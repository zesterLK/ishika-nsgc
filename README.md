# 📅 SME Compliance Tracker

**AI-powered compliance calendar for Indian SMEs**

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)

🔗 [Live Demo](https://ishika-nsgc.vercel.app/)) | 📖 [Documentation](#getting-started) | 🐛 [Report Issue](https://github.com/your-username/ishika-nsgc/issues)

---

## Overview

The SME Compliance Tracker is an intelligent web application that helps Indian small and medium enterprises (SMEs) manage their regulatory compliance requirements effortlessly. By answering a few simple questions about your business, the system uses AI to automatically determine which compliances apply to you and generates a personalized 12-month compliance calendar with all deadlines, penalties, and filing requirements.

**The Problem:** Indian SMEs face a complex web of 500+ regulations that vary by business type, size, location, and industry. Most businesses struggle to identify which compliances apply to them, leading to missed deadlines, expensive penalties (₹50,000-2,00,000 annually), and countless hours spent on manual research.

**Target Users:** Small and medium enterprises in India across manufacturing, trading, service, and professional sectors who need a simple, affordable solution to stay compliant.

---

## Key Features

- 🎯 **Personalized Compliance Matching** - Smart algorithms determine exact compliances based on your business profile
- 🤖 **AI-Powered Calendar Generation** - GPT-4 analyzes your business and generates a customized 12-month roadmap
- 📅 **12-Month Compliance Roadmap** - Visual calendar with all deadlines, priority indicators, and penalty information
- 💰 **Cost Analysis and Recommendations** - Understand compliance costs, compare to industry averages, and identify savings
- 📊 **AI-Generated Reports** - Comprehensive compliance reports with executive summary, risk assessment, and action plans
- 📤 **Export Functionality** - Download calendar and reports as PDF, CSV, or add to Google Calendar
- 📱 **Mobile-Responsive Design** - Access your compliance calendar on any device, anywhere

---

## Tech Stack

| Category          | Technology                                    |
| ----------------- | --------------------------------------------- |
| **Frontend**      | Next.js 14, React 18, TypeScript, TailwindCSS |
| **AI**            | OpenAI GPT-4, Serper API                      |
| **Deployment**    | Vercel                                        |
| **UI Components** | Shadcn UI, Lucide React                       |
| **Export**        | jsPDF, jspdf-autotable, docx, file-saver      |
| **Charts**        | Recharts                                      |
| **Date Handling** | date-fns                                      |

---

## Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **npm** or **yarn** package manager
- **API Keys** (required for full functionality):
  - OpenAI API key (for AI report generation)
  - Serper API key (for compliance data generation)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/ishika-nsgc.git
cd ishika-nsgc
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:

```env
OPENAI_API_KEY=your_openai_api_key_here
SERPER_API_KEY=your_serper_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**How to get API keys:**

- **OpenAI API Key**: Sign up at [platform.openai.com](https://platform.openai.com) and create an API key
- **Serper API Key**: Sign up at [serper.dev](https://serper.dev) (2500 free searches/month)

4. **Generate compliance data (one-time setup)**

```bash
npm run generate-data
```

This script uses Serper API to search for compliance information and OpenAI to extract structured data. It may take several minutes to complete.

5. **Run development server**

```bash
npm run dev
```

6. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

| Variable              | Description                                   | Required |
| --------------------- | --------------------------------------------- | -------- |
| `OPENAI_API_KEY`      | OpenAI API key for AI report generation       | Yes      |
| `SERPER_API_KEY`      | Serper API key for compliance data generation | Yes      |
| `NEXT_PUBLIC_APP_URL` | Your deployment URL (for production)          | Optional |

**⚠️ Important:** Never commit `.env` or `.env.local` files with real API keys. These files are already in `.gitignore`.

---

## Project Structure

```
/
├── app/                  # Next.js App Router pages
│   ├── page.tsx         # Landing page
│   ├── questionnaire/   # Business profile form
│   ├── dashboard/       # Compliance calendar
│   ├── report/          # AI-generated report
│   └── api/             # API routes
│       ├── generate-calendar/
│       └── generate-report/
├── components/          # React components
│   ├── calendar/       # Calendar view components
│   ├── dashboard/      # Dashboard components
│   ├── forms/          # Form components
│   ├── report/         # Report components
│   └── ui/             # Reusable UI components
├── lib/                 # Utilities and logic
│   ├── compliance-rules.json    # Compliance database
│   ├── compliance-matcher.ts    # Matching algorithm
│   ├── calendar-generator.ts    # Calendar generation
│   ├── report-generator.ts      # AI report generation
│   ├── industry-insights.ts     # Industry-specific data
│   ├── report-export.ts         # Export utilities
│   ├── types.ts                 # TypeScript types
│   └── utils.ts                 # Helper functions
├── scripts/             # Data generation scripts
│   └── generate-compliance-data.js
├── public/              # Static assets
│   └── images/
├── backups/             # Timestamped backups of compliance data
└── docs/                # Documentation
```

---

## How It Works

1. **User Answers Questions** - Business owner completes a 7-question form about their business type, location, size, and registration status (takes 2 minutes)

2. **System Matches Compliances** - The compliance matcher algorithm analyzes the business profile and determines which of 20+ compliance requirements apply

3. **Calendar Generation** - System generates a 12-month calendar with all applicable deadlines, calculating due dates based on compliance frequency and rules

4. **AI Report Creation** - GPT-4 analyzes the business profile and calendar to generate a personalized report with insights, risk assessment, cost analysis, and action plans

5. **Export and Share** - User can download calendar as PDF/CSV, export report, and add deadlines to Google Calendar

---

## Compliance Types Supported

The system tracks all major compliance requirements for Indian SMEs:

### Tax Compliances

- **GST (Goods and Services Tax)** - GSTR-1, GSTR-3B monthly returns
- **TDS (Tax Deducted at Source)** - Quarterly TDS returns
- **Income Tax Return** - ITR-3, ITR-4 based on business type
- **Tax Audit** - For businesses above ₹1 crore turnover

### Labor Compliances

- **EPF (Employee Provident Fund)** - Monthly ECR filing for businesses with 20+ employees
- **ESI (Employee State Insurance)** - Monthly ESI returns for businesses with 10+ employees
- **Professional Tax** - State-specific monthly professional tax (Maharashtra, Karnataka, West Bengal, Tamil Nadu, Gujarat, etc.)

### Statutory Compliances

- **MSME Annual Return** - Annual return for MSME registered businesses
- **MSME Form 1** - Payment disclosure for businesses owing payments to MSME entities
- **Shops & Establishments Act** - State-specific registration and renewal

_More compliances are added regularly based on business profiles and regulatory updates._

---

## Development

### Available Scripts

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint

# Type checking (via TypeScript)
npm run build  # TypeScript checks during build
```

### Type Checking

TypeScript is configured to check types during build. For IDE support, ensure your editor has TypeScript language server enabled.

---

## Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**

```bash
npm install -g vercel
```

2. **Deploy**

```bash
vercel
```

3. **Set Environment Variables**

In the Vercel dashboard, add your environment variables:

- `OPENAI_API_KEY`
- `SERPER_API_KEY`
- `NEXT_PUBLIC_APP_URL` (your Vercel deployment URL)

### Alternative: GitHub Integration

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

---

## Important Notes

- 🔒 **Never commit `.env` files** with real API keys. These files are gitignored for security.
- 📊 **Run `generate-data` script once** to create the compliance database. This script uses API credits, so run it only when needed.
- 🎯 **Compliance data should be updated quarterly** to reflect regulatory changes. The system uses AI to generate up-to-date information.
- ⚠️ **This is a prototype** - Data generation is temporary and session-based. See [Known Limitations](#known-limitations) below.

---

## Known Limitations (Prototype)

This is a prototype demonstration system with the following limitations:

- **AI-Generated Reports Require API Credits** - Each report generation consumes OpenAI API credits. Ensure you have sufficient credits for testing.
- **Compliance Data Needs Periodic Updates** - While AI-powered, compliance data should be manually reviewed and updated quarterly as regulations change.
- **No User Authentication** - The system is designed for single-session usage. No user accounts or data persistence.
- **Calendar Data Not Persisted** - Generated calendars are session-based only. Users must download/export to save their data.
- **No Email Reminder Functionality** - The system generates calendars but does not send automated reminders (future enhancement).

**⚠️ Important:** Users should download their calendar and report immediately after generation, as data is not stored in a database.

---

## Future Enhancements

Planned improvements for production deployment:

- ✅ **User Authentication and Data Persistence** - Save calendars and reports to user accounts
- 📧 **Email/SMS Reminders** - Automated notifications for upcoming deadlines
- 📁 **Document Storage** - Upload and manage compliance documents
- 🔗 **Integration with Accounting Software** - Connect with Tally, QuickBooks, etc.
- 🌐 **Multi-Language Support** - Support for Hindi and regional languages
- 📱 **Mobile Applications** - Native iOS and Android apps
- 🔄 **Real-Time Regulatory Updates** - Automated monitoring of regulatory changes
- 👥 **Team Collaboration** - Share calendars with team members and accountants

---

## License

This project is developed as part of the **Nonmarket Strategy for Grand Challenges** course (MBA Program). It is an academic prototype project and is not intended for commercial use.

For academic or research purposes, please contact the project maintainers.

---

## Acknowledgments

- **Built as part of MBA coursework** - Addressing the grand challenge of Ethical Governance and Anti-Corruption
- **Data Sources** - Government portals (GST Portal, EPFO, ESIC, State Government websites)
- **AI Providers** - OpenAI (GPT-4) and Serper API for intelligent data extraction
- **Framework** - Next.js team for the excellent framework
- **UI Components** - Shadcn UI and Lucide React for beautiful, accessible components

---

## Contributing

This is an academic project. For questions or suggestions, please open an issue on GitHub.

---

**Made with ❤️ for Indian SMEs**
