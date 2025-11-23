import { NextResponse } from "next/server";
import { generateComplianceReport } from "@/lib/report-generator";
import type {
  BusinessProfile,
  CalendarEntry,
  ComplianceReport,
} from "@/lib/types";
import { createHash } from "crypto";

/**
 * Simple in-memory cache for reports
 * In production, use Redis or a proper caching solution
 */
const reportCache = new Map<
  string,
  { report: ComplianceReport; timestamp: number }
>();

/**
 * Generate hash from business profile for caching
 */
function generateCacheKey(
  businessProfile: BusinessProfile,
  compliances: string[]
): string {
  const data = JSON.stringify({
    businessType: businessProfile.businessType,
    state: businessProfile.state,
    turnover: businessProfile.turnover,
    employees: businessProfile.employees,
    msmeRegistered: businessProfile.msmeRegistered,
    industry: businessProfile.industry,
    compliances: compliances.sort(),
  });
  return createHash("md5").update(data).digest("hex");
}

/**
 * Check if cached report is still valid (7 days)
 */
function isCacheValid(timestamp: number): boolean {
  const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
  return Date.now() - timestamp < sevenDaysInMs;
}

/**
 * Rate limiting: track requests per IP
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // 10 reports per hour
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

/**
 * POST /api/generate-report
 * Generates an AI-powered compliance report based on business profile and calendar
 */
export async function POST(request: Request) {
  const startTime = Date.now();
  let cacheHit = false;

  try {
    // Get client IP for rate limiting
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "unknown";

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded. Please try again later.",
          code: "RATE_LIMIT_EXCEEDED",
        },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();

    if (
      !body.businessProfile ||
      !body.calendar ||
      !body.applicableCompliances
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields: businessProfile, calendar, or applicableCompliances",
          code: "VALIDATION_ERROR",
        },
        { status: 400 }
      );
    }

    const businessProfile = body.businessProfile as BusinessProfile;
    const calendar = (body.calendar as any[]).map((entry) => ({
      ...entry,
      dueDate: new Date(entry.dueDate),
    })) as CalendarEntry[];
    const applicableCompliances = body.applicableCompliances as string[];

    // Validate business profile
    if (
      !businessProfile.businessType ||
      !businessProfile.state ||
      !businessProfile.industry
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid business profile data",
          code: "VALIDATION_ERROR",
        },
        { status: 400 }
      );
    }

    // Check cache
    const cacheKey = generateCacheKey(businessProfile, applicableCompliances);
    const cached = reportCache.get(cacheKey);

    if (cached && isCacheValid(cached.timestamp)) {
      cacheHit = true;
      console.log("Report cache hit for key:", cacheKey);

      return NextResponse.json({
        success: true,
        report: cached.report,
        metadata: {
          generatedAt: cached.report.generatedAt.toISOString(),
          generationTime: Date.now() - startTime,
          aiProvider: cached.report.generatedBy,
          cacheHit: true,
        },
      });
    }

    // Generate new report
    console.log("Generating new report for:", {
      businessType: businessProfile.businessType,
      state: businessProfile.state,
      industry: businessProfile.industry,
      compliances: applicableCompliances.length,
    });

    const report = await generateComplianceReport(
      businessProfile,
      calendar,
      applicableCompliances
    );

    // Cache the report
    reportCache.set(cacheKey, {
      report,
      timestamp: Date.now(),
    });

    // Clean up old cache entries (keep last 100)
    if (reportCache.size > 100) {
      const entries = Array.from(reportCache.entries());
      entries.sort((a, b) => b[1].timestamp - a[1].timestamp);
      reportCache.clear();
      entries.slice(0, 100).forEach(([key, value]) => {
        reportCache.set(key, value);
      });
    }

    const generationTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      report,
      metadata: {
        generatedAt: report.generatedAt.toISOString(),
        generationTime,
        aiProvider: report.generatedBy,
        cacheHit: false,
      },
    });
  } catch (error) {
    console.error("Error generating report:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    // Don't expose internal errors to client
    const userMessage =
      errorMessage.includes("OpenAI") || errorMessage.includes("API")
        ? "Report generation service temporarily unavailable. Please try again later."
        : "Failed to generate report. Please try again.";

    return NextResponse.json(
      {
        success: false,
        error: userMessage,
        code: "PROCESSING_ERROR",
      },
      { status: 500 }
    );
  }
}
