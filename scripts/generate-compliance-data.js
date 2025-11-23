/**
 * Compliance Data Generation Script
 *
 * This script uses Serper API to perform deep searches (15 results per query)
 * and OpenAI GPT-5.1 with high reasoning effort to extract comprehensive,
 * detailed compliance data in a one-time deep analysis.
 *
 * Run with: node scripts/generate-compliance-data.js
 */

const axios = require("axios");
const OpenAI = require("openai");
const fs = require("fs").promises;
const path = require("path");
require("dotenv").config();

// Configuration
const SERPER_API_URL = "https://google.serper.dev/search";
const SERPER_API_KEY = process.env.SERPER_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// Rate limiting delays
const SERPER_DELAY = 1000; // 1 second
const OPENAI_DELAY = 2000; // 2 seconds

/**
 * Sleep function for rate limiting
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Search using Serper API
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of organic search results
 */
async function searchWithSerper(query) {
  try {
    const response = await axios.post(
      SERPER_API_URL,
      {
        q: query,
        num: 15, // Increased from 5 to 15 for deeper search
        gl: "in",
        hl: "en",
      },
      {
        headers: {
          "X-API-KEY": SERPER_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.organic || [];
  } catch (error) {
    console.error(`Error searching for "${query}":`, error.message);
    return [];
  }
}

/**
 * Gather compliance data from all search queries
 * @returns {Promise<Object>} Aggregated search results by compliance ID
 */
async function gatherComplianceData() {
  console.log("📊 Loading search queries...");

  const queriesPath = path.join(
    __dirname,
    "../data-generation/search-queries.json"
  );
  const queriesData = JSON.parse(await fs.readFile(queriesPath, "utf-8"));

  const results = {};
  const totalQueries = queriesData.compliances.reduce(
    (sum, comp) => sum + comp.queries.length,
    0
  );
  let processedQueries = 0;

  console.log(
    `🔍 Gathering data for ${queriesData.compliances.length} compliances...`
  );

  for (const compliance of queriesData.compliances) {
    console.log(`\n📋 Processing: ${compliance.name} (${compliance.id})`);
    results[compliance.id] = {
      id: compliance.id,
      name: compliance.name,
      searchResults: [],
    };

    for (const query of compliance.queries) {
      processedQueries++;
      console.log(
        `  [${processedQueries}/${totalQueries}] Searching: "${query}"`
      );

      const searchResults = await searchWithSerper(query);

      results[compliance.id].searchResults.push({
        query,
        results: searchResults.map((result) => ({
          title: result.title,
          snippet: result.snippet,
          link: result.link,
          date: result.date,
        })),
      });

      // Rate limiting
      if (processedQueries < totalQueries) {
        await sleep(SERPER_DELAY);
      }
    }
  }

  console.log(
    `\n✅ Gathered data for ${Object.keys(results).length} compliances`
  );
  return results;
}

/**
 * Extract structured data from search results using OpenAI
 * @param {string} complianceId - Compliance identifier
 * @param {Array} searchResults - Search results for this compliance
 * @returns {Promise<Object|null>} Structured compliance data or null on error
 */
async function extractStructuredData(complianceId, searchResults) {
  const startTime = Date.now();
  console.log(`    🔄 Starting AI extraction for ${complianceId}...`);
  console.log(`    📊 Search results count: ${searchResults.length} queries`);

  try {
    const prompt = `You are an expert on Indian compliance regulations for SMEs. Perform a comprehensive, deep analysis of the following search results to extract ALL available compliance information.

Compliance ID: ${complianceId}

Search Results:
${JSON.stringify(searchResults, null, 2)}

IMPORTANT: Analyze ALL search results thoroughly. Extract comprehensive, detailed information including:
- All applicable forms and their variations
- Complete deadline information with exact dates and calculation methods
- Detailed penalty structures (late fees, interest rates, minimum/maximum amounts)
- All applicable thresholds and conditions
- State-specific variations and requirements
- Contribution rates and calculation methods
- All official resources and documentation links
- Exemptions and special cases
- Recent updates or changes in 2025

Return as JSON matching this structure with COMPLETE details:
{
  "id": "${complianceId}",
  "name": "Full Compliance Name",
  "category": "Tax" | "Labor" | "Statutory" | "Environmental",
  "applicability": {
    "condition": "Detailed human-readable condition explaining when this applies",
    "threshold": number or object with all thresholds (e.g., {"services": 2000000, "goods": 4000000}),
    "states": ["array of all applicable states if state-specific"],
    "exemptions": ["any exemptions or special cases"]
  },
  "frequency": "monthly" | "quarterly" | "biannual" | "annual",
  "forms": [
    {
      "name": "Complete Form Name",
      "description": "Detailed description of what this form is for, when to use it, and its purpose",
      "deadline": {
        "type": "monthly" | "quarterly" | "annual" | "fixed",
        "day": number (exact day of month),
        "formula": "Detailed formula description (e.g., '11th of the following month')",
        "calculation": "Step-by-step calculation explanation with examples",
        "gracePeriod": "if any grace period exists",
        "extensions": "information about deadline extensions if available"
      },
      "penalty": "Complete penalty information including: late fee per day, maximum late fee, interest rate, minimum penalty, maximum penalty, calculation method"
    }
  ],
  "contribution": {
    "employer": "X% (with detailed calculation if applicable)",
    "employee": "Y% (with detailed calculation if applicable)",
    "calculation": "How contributions are calculated",
    "wageCeiling": "if there's a wage ceiling for contributions"
  } (only if applicable, include ALL contribution details),
  "resources": [
    {
      "title": "Resource Title",
      "url": "URL",
      "type": "official" | "guidance" | "form" | "calculator"
    }
  ],
  "additionalInfo": {
    "registration": "Registration requirements if applicable",
    "renewal": "Renewal requirements and frequency",
    "filingMethod": "Online/Offline filing methods",
    "prerequisites": "Any prerequisites or dependencies",
    "recentUpdates": "Any recent updates in 2025"
  }
}

CRITICAL REQUIREMENTS:
- Extract ALL forms mentioned in search results, not just the main ones
- Include COMPLETE penalty information (daily rates, maximums, interest calculations)
- Provide EXACT threshold numbers in rupees
- Include ALL state-specific variations if applicable
- List ALL official government website links found
- Include any exemptions, special cases, or recent changes
- Be extremely detailed and comprehensive - this is a one-time deep analysis

Return ONLY valid JSON, no markdown formatting.`;

    // Try with JSON mode first (for models that support it)
    let content;
    try {
      console.log(`    📡 Sending API request with JSON mode...`);
      const apiStartTime = Date.now();

      const response = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [
          {
            role: "system",
            content:
              "You are an expert compliance data extraction specialist. Perform deep, comprehensive analysis. Return only valid JSON, no markdown, no code blocks. Extract ALL available details from the search results.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        reasoning_effort: "high", // Enable deep reasoning for comprehensive analysis
        response_format: { type: "json_object" },
      });

      const apiTime = ((Date.now() - apiStartTime) / 1000).toFixed(1);
      console.log(`    ✅ API response received (${apiTime}s)`);

      content = response.choices[0].message.content;
      console.log(`    📝 Response length: ${content.length} characters`);
    } catch (jsonModeError) {
      // Fallback: use model without JSON mode and parse from text
      console.log(`    ⚠️  JSON mode error: ${jsonModeError.message}`);
      console.log(`    🔄 Retrying without JSON mode...`);

      const apiStartTime = Date.now();
      const response = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [
          {
            role: "system",
            content:
              "You are an expert compliance data extraction specialist. Perform deep, comprehensive analysis. Return ONLY valid JSON, no markdown formatting, no code blocks, no explanations. Just the raw JSON object with ALL extracted details.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        reasoning_effort: "high", // Enable deep reasoning for comprehensive analysis
      });

      const apiTime = ((Date.now() - apiStartTime) / 1000).toFixed(1);
      console.log(`    ✅ Fallback API response received (${apiTime}s)`);

      content = response.choices[0].message.content;
      console.log(`    📝 Response length: ${content.length} characters`);

      // Clean up the content - remove markdown code blocks if present
      content = content.trim();
      if (content.startsWith("```json")) {
        content = content.replace(/^```json\s*/, "").replace(/\s*```$/, "");
      } else if (content.startsWith("```")) {
        content = content.replace(/^```\s*/, "").replace(/\s*```$/, "");
      }
    }

    console.log(`    🔍 Parsing JSON response...`);
    const parsed = JSON.parse(content);
    const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(
      `    ✅ Successfully extracted data for ${complianceId} (${totalTime}s total)`
    );
    return parsed;
  } catch (error) {
    const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
    console.error(
      `    ❌ Error extracting data for ${complianceId} (${totalTime}s):`,
      error.message
    );
    if (error.stack) {
      console.error(
        `    📋 Stack trace:`,
        error.stack.split("\n").slice(0, 3).join("\n")
      );
    }
    return null;
  }
}

/**
 * Process all compliance data with AI
 * @param {Object} searchData - Aggregated search results
 * @returns {Promise<Object>} Structured compliance data
 */
async function processAllComplianceData(searchData) {
  console.log("\n🤖 Processing data with AI...");

  const structuredData = {};
  const complianceIds = Object.keys(searchData);
  let processed = 0;

  for (const complianceId of complianceIds) {
    processed++;
    console.log(
      `\n  [${processed}/${complianceIds.length}] Processing: ${searchData[complianceId].name}`
    );
    console.log(`  ⏱️  Started at: ${new Date().toLocaleTimeString()}`);

    const extracted = await extractStructuredData(
      complianceId,
      searchData[complianceId].searchResults
    );

    if (extracted) {
      structuredData[complianceId] = extracted;
      console.log(`  ✅ Successfully processed ${complianceId}`);
    } else {
      console.log(`  ❌ Failed to process ${complianceId}`);
    }

    // Rate limiting
    if (processed < complianceIds.length) {
      console.log(
        `  ⏳ Waiting ${OPENAI_DELAY / 1000}s before next request...`
      );
      await sleep(OPENAI_DELAY);
    }
  }

  console.log(
    `\n✅ Processed ${Object.keys(structuredData).length} compliances`
  );
  return structuredData;
}

/**
 * Validate and enrich compliance data
 * @param {Object} structuredData - Structured compliance data
 * @returns {Promise<Object>} Validated and enriched data
 */
async function validateAndEnrich(structuredData) {
  console.log("\n🔍 Validating and enriching data...");
  const validationStartTime = Date.now();
  const complianceCount = Object.keys(structuredData).length;
  console.log(`📊 Validating ${complianceCount} compliances...`);

  const validationPrompt = `You are an expert validator of Indian compliance data. Perform a comprehensive, deep validation and enrichment of the following compliance rules.

${JSON.stringify(structuredData, null, 2)}

KNOWN FACTS TO VERIFY AND ENRICH:
- GST: GSTR-1 due 11th, GSTR-3B due 20th of next month. Threshold: ₹20L services, ₹40L goods
- EPF: ECR due 15th of next month, 12% employer + 12% employee contribution. Applies to establishments with 20+ employees
- ESI: Due 15th of next month, 3.25% employer + 0.75% employee contribution. Applies to establishments with 10+ employees
- Professional Tax: State-specific, varies by state (Maharashtra: 30th, Karnataka: 20th, etc.)
- TDS: Challan 281 due 7th, Form 24Q quarterly. Various rates depending on payment type
- MSME: Annual return and Form 1 for delayed payments
- Income Tax: ITR-3/ITR-4 due July 31st (or extended)
- Tax Audit: Form 3CD/3CA, applicable for turnover >₹1Cr or profit >8% of turnover

COMPREHENSIVE VALIDATION TASKS:
1. Verify ALL deadlines are correct and match known Indian compliance standards
2. Add ALL missing standard information (thresholds, rates, exemptions)
3. Ensure ALL dates are clear, specific, and include calculation methods
4. Add ALL official government website links if missing (gst.gov.in, epfindia.gov.in, etc.)
5. Verify ALL contribution rates and calculation methods
6. Cross-reference with known compliance facts and add any missing details
7. Ensure state-specific variations are complete and accurate
8. Add any missing forms, penalties, or requirements
9. Verify penalty structures are complete (daily rates, maximums, interest)
10. Ensure all thresholds are accurate and include all variations
11. Add any recent 2025 updates or changes
12. Include all exemptions, special cases, and edge cases

For each compliance, provide COMPLETE, DETAILED, and ACCURATE information. This is a one-time deep validation, so be thorough.

Return the complete validated and enriched data as JSON in the same structure. Return ONLY valid JSON, no markdown.`;

  try {
    // Try with JSON mode first (for models that support it)
    let content;
    console.log(`📡 Sending validation API request with JSON mode...`);
    const apiStartTime = Date.now();

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [
          {
            role: "system",
            content:
              "You are an expert compliance data validation specialist. Perform deep, comprehensive validation and enrichment. Return only valid JSON, no markdown, no code blocks. Ensure all data is complete, accurate, and detailed.",
          },
          {
            role: "user",
            content: validationPrompt,
          },
        ],
        reasoning_effort: "high", // Enable deep reasoning for comprehensive validation
        response_format: { type: "json_object" },
      });

      const apiTime = ((Date.now() - apiStartTime) / 1000).toFixed(1);
      console.log(`✅ Validation API response received (${apiTime}s)`);

      content = response.choices[0].message.content;
      console.log(
        `📝 Validation response length: ${content.length} characters`
      );
    } catch (jsonModeError) {
      // Fallback: use model without JSON mode and parse from text
      console.log(`⚠️  JSON mode error: ${jsonModeError.message}`);
      console.log(`🔄 Retrying validation without JSON mode...`);

      const fallbackStartTime = Date.now();
      const response = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [
          {
            role: "system",
            content:
              "You are an expert compliance data validation specialist. Perform deep, comprehensive validation and enrichment. Return ONLY valid JSON, no markdown formatting, no code blocks, no explanations. Just the raw JSON object with all validated and enriched data.",
          },
          {
            role: "user",
            content: validationPrompt,
          },
        ],
        reasoning_effort: "high", // Enable deep reasoning for comprehensive validation
      });

      const fallbackTime = ((Date.now() - fallbackStartTime) / 1000).toFixed(1);
      console.log(
        `✅ Fallback validation API response received (${fallbackTime}s)`
      );

      content = response.choices[0].message.content;
      console.log(
        `📝 Validation response length: ${content.length} characters`
      );

      // Clean up the content - remove markdown code blocks if present
      content = content.trim();
      if (content.startsWith("```json")) {
        content = content.replace(/^```json\s*/, "").replace(/\s*```$/, "");
      } else if (content.startsWith("```")) {
        content = content.replace(/^```\s*/, "").replace(/\s*```$/, "");
      }
    }

    console.log(`🔍 Parsing validation JSON response...`);
    const validated = JSON.parse(content);
    const totalTime = ((Date.now() - validationStartTime) / 1000).toFixed(1);
    console.log(`✅ Data validated and enriched (${totalTime}s total)`);
    return validated;
  } catch (error) {
    const totalTime = ((Date.now() - validationStartTime) / 1000).toFixed(1);
    console.error(`❌ Error validating data (${totalTime}s):`, error.message);
    if (error.stack) {
      console.error(
        `📋 Stack trace:`,
        error.stack.split("\n").slice(0, 3).join("\n")
      );
    }
    console.log("⚠️  Returning original data without validation");
    return structuredData;
  }
}

/**
 * Generate final JSON structure with metadata
 * @param {Object} validatedData - Validated compliance data
 * @returns {Object} Complete ComplianceData structure
 */
function generateFinalJSON(validatedData) {
  const now = new Date().toISOString();

  return {
    metadata: {
      version: "1.0",
      generatedAt: now,
      lastUpdated: now,
      source: "Serper API + OpenAI GPT-5.1 (Deep Analysis)",
      applicableFor: "Indian SMEs",
      disclaimer:
        "This data is generated using AI and web search. Please verify all information with official government sources before making compliance decisions. Deadlines and requirements may change, and this data should be used as a reference only.",
    },
    compliances: validatedData,
  };
}

/**
 * Save data to file with backup
 * @param {Object} data - Data to save
 * @param {string} filename - Filename to save as
 */
async function saveToFile(data, filename) {
  try {
    // Ensure lib directory exists
    const libDir = path.join(__dirname, "../lib");
    await fs.mkdir(libDir, { recursive: true });

    // Save main file
    const filePath = path.join(libDir, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");

    console.log(`\n💾 Saved to: ${filePath}`);
    console.log(`   Compliances: ${Object.keys(data.compliances).length}`);
    console.log(`   Version: ${data.metadata.version}`);

    // Create timestamped backup
    const backupsDir = path.join(__dirname, "../backups");
    await fs.mkdir(backupsDir, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupFilename = `compliance-rules-${timestamp}.json`;
    const backupPath = path.join(backupsDir, backupFilename);

    await fs.writeFile(backupPath, JSON.stringify(data, null, 2), "utf-8");
    console.log(`💾 Backup saved to: ${backupPath}`);
  } catch (error) {
    console.error("Error saving file:", error.message);
    throw error;
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║     SME Compliance Data Generator                       ║
║     Using Serper API + OpenAI GPT-5.1 (Deep Analysis)   ║
╚══════════════════════════════════════════════════════════╝
  `);

  // Validate API keys
  if (!SERPER_API_KEY) {
    console.error("❌ Error: SERPER_API_KEY not found in .env file");
    process.exit(1);
  }

  if (!OPENAI_API_KEY) {
    console.error("❌ Error: OPENAI_API_KEY not found in .env file");
    process.exit(1);
  }

  try {
    // Step 1: Gather compliance data
    console.log("\n📊 STEP 1: Gathering compliance data...");
    const searchData = await gatherComplianceData();

    // Step 2: Process with AI
    console.log("\n🤖 STEP 2: Processing with AI...");
    const structuredData = await processAllComplianceData(searchData);

    // Step 3: Validate and enrich
    console.log("\n🔍 STEP 3: Validating and enriching...");
    const validatedData = await validateAndEnrich(structuredData);

    // Step 4: Generate final JSON
    console.log("\n📝 STEP 4: Generating final JSON...");
    const finalData = generateFinalJSON(validatedData);

    // Step 5: Save to files
    console.log("\n💾 STEP 5: Saving to files...");
    await saveToFile(finalData, "compliance-rules.json");

    console.log(`
╔══════════════════════════════════════════════════════════╗
║                    ✅ COMPLETE                           ║
╚══════════════════════════════════════════════════════════╝

📊 Statistics:
   - Compliances processed: ${Object.keys(validatedData).length}
   - Generated at: ${finalData.metadata.generatedAt}
   - Saved to: lib/compliance-rules.json

🎉 Data generation completed successfully!
    `);
  } catch (error) {
    console.error("\n❌ Fatal error:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  searchWithSerper,
  gatherComplianceData,
  extractStructuredData,
  processAllComplianceData,
  validateAndEnrich,
  generateFinalJSON,
  saveToFile,
};
