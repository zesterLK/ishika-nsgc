import { NextResponse } from 'next/server';
import { businessProfileSchema } from '@/lib/form-state';
import { matchCompliances } from '@/lib/compliance-matcher';
import { generateCalendar } from '@/lib/calendar-generator';
import type { BusinessProfile } from '@/lib/types';

/**
 * POST /api/generate-calendar
 * Generates a personalized compliance calendar based on business profile
 */
export async function POST(request: Request) {
  try {
    // Parse and validate request body
    const body = await request.json();
    
    // Validate using Zod schema
    const validationResult = businessProfileSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
          code: 'VALIDATION_ERROR',
          details: validationResult.error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const businessProfile = body as BusinessProfile;

    // Log request for debugging
    console.log('Generating calendar for business profile:', {
      businessType: businessProfile.businessType,
      state: businessProfile.state,
      turnover: businessProfile.turnover,
      employees: businessProfile.employees,
    });

    // Step 1: Match applicable compliances
    const applicableCompliances = matchCompliances(businessProfile);
    console.log('Applicable compliances:', applicableCompliances);

    // Step 2: Generate calendar entries for next 12 months
    const calendar = generateCalendar(applicableCompliances, new Date());
    console.log(`Generated ${calendar.length} calendar entries`);

    // Step 3: Calculate summary statistics
    const monthlyCompliances = calendar.filter(
      (entry) => entry.priority === 'High' || entry.priority === 'Medium'
    ).length;
    
    const quarterlyCompliances = calendar.filter((entry) => {
      const month = entry.dueDate.getMonth();
      return month % 3 === 0;
    }).length;
    
    const annualCompliances = calendar.filter((entry) => {
      const month = entry.dueDate.getMonth();
      return month === 0; // January
    }).length;

    // Step 4: Estimate annual cost (basic calculation)
    // Rough estimates: GST ~₹5000, EPF ~₹10000, ESI ~₹5000, etc.
    const costPerCompliance: Record<string, number> = {
      gst: 5000,
      epf: 10000,
      esi: 5000,
      'professional-tax': 2000,
      tds: 3000,
      'msme-annual-return': 2000,
      'msme-form-1': 1000,
      'income-tax': 5000,
      'tax-audit': 15000,
      'shops-establishments': 2000,
    };

    const estimatedAnnualCost = applicableCompliances.reduce((total, complianceId) => {
      return total + (costPerCompliance[complianceId] || 3000);
    }, 0);

    // Prepare response
    const response = {
      success: true,
      data: {
        businessProfile,
        applicableCompliances,
        calendar: calendar.map((entry) => ({
          ...entry,
          dueDate: entry.dueDate.toISOString(),
        })),
        summary: {
          totalCompliances: applicableCompliances.length,
          monthlyCompliances,
          quarterlyCompliances,
          annualCompliances,
          totalCalendarEntries: calendar.length,
          estimatedAnnualCost,
        },
        generatedAt: new Date().toISOString(),
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error generating calendar:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        code: 'PROCESSING_ERROR',
      },
      { status: 500 }
    );
  }
}

