"use client";

import Link from "next/link";
import {
  Calendar,
  TrendingUp,
  Shield,
  CheckCircle,
  ArrowRight,
  Clock,
  FileCheck,
  Target,
  Brain,
  DollarSign,
  FileText,
  Download,
  RefreshCw,
  Smartphone,
  AlertTriangle,
  Zap,
  Users,
  BarChart3,
  Building2,
  Receipt,
  Briefcase,
  FileBarChart,
  Award,
  Globe,
  ChevronUp,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Navigation - Overlays Hero */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold text-blue-600"
            >
              {/* <Calendar className="w-6 h-6" /> */}
              <span>Compliant AI</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => scrollToSection("problem")}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Problem
              </button>
              <button
                onClick={() => scrollToSection("solution")}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Solution
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("coverage")}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Coverage
              </button>
              <Link
                href="/questionnaire"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2">
              <button
                onClick={() => scrollToSection("problem")}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Problem
              </button>
              <button
                onClick={() => scrollToSection("solution")}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Solution
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("coverage")}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Coverage
              </button>
              <Link
                href="/questionnaire"
                className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Section 1: Hero / Above the Fold */}
      <section className="relative h-screen overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1428908728789-d2de25dbd4e2?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
          }}
        ></div>
        {/* Subtle light overlay for text readability */}
        <div className="absolute inset-0 bg-white/30"></div>
        {/* Content */}
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-gray-900 drop-shadow-lg">
              Never Miss a Compliance Deadline Again
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-800 drop-shadow-md">
              AI-powered compliance calendar for Indian SMEs. Get your
              personalized 12-month roadmap in 2 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link
                href="/questionnaire"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-xl"
              >
                Get My Compliance Calendar
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm border-2 border-gray-300 text-gray-800 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white transition-all shadow-lg"
              >
                Steps
                <FileCheck className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-700">
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium">Free</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium">No Credit Card</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium">2-Minute Setup</span>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Section 2: The Problem */}
      <section id="problem" className="py-20 bg-white scroll-mt-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            The Compliance Challenge Indian SMEs Face
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">🤯</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                Too Complex
              </h3>
              <p className="text-gray-700">
                500+ regulations, constantly changing. Most businesses
                don&apos;t know which apply to them.
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">💸</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                Expensive Penalties
              </h3>
              <p className="text-gray-700">
                SMEs lose ₹50,000-2,00,000 annually to late filing penalties and
                non-compliance.
              </p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">⏰</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                Time-Consuming
              </h3>
              <p className="text-gray-700">
                Business owners spend 10+ hours/month researching deadlines
                instead of growing their business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Our Solution */}
      <section id="solution" className="py-20 bg-gray-50 scroll-mt-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
            How We Solve This with AI
          </h2>
          <p className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            Our intelligent system analyzes your business profile and
            automatically determines which compliances apply to YOU. No manual
            research needed.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">
                Personalized Matching
              </h3>
              <p className="text-sm text-gray-600">
                Smart algorithms determine exact compliances based on your
                business type, size, location, and industry
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">
                AI-Powered Insights
              </h3>
              <p className="text-sm text-gray-600">
                GPT-4 analyzes your profile and generates custom recommendations
                and risk assessments
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">
                12-Month Calendar
              </h3>
              <p className="text-sm text-gray-600">
                Visual calendar with all deadlines, penalties, and filing
                requirements clearly mapped out
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">
                Cost Analysis
              </h3>
              <p className="text-sm text-gray-600">
                Understand compliance costs, compare to industry averages, and
                identify savings opportunities
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">
                Smart Reports
              </h3>
              <p className="text-sm text-gray-600">
                Detailed compliance report with executive summary, risk factors,
                and action plans
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mb-4">
                <Download className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">
                Export Anywhere
              </h3>
              <p className="text-sm text-gray-600">
                Download as PDF, CSV, or add directly to Google Calendar for
                reminders
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-cyan-600 rounded-lg flex items-center justify-center mb-4">
                <RefreshCw className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">
                Always Current
              </h3>
              <p className="text-sm text-gray-600">
                AI-powered data generation ensures compliance information is
                up-to-date
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">
                Mobile Friendly
              </h3>
              <p className="text-sm text-gray-600">
                Access your compliance calendar on any device, anywhere
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: How It Works */}
      <section id="how-it-works" className="py-20 bg-white scroll-mt-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
            Get Your Compliance Calendar in 3 Simple Steps
          </h2>
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connecting line for desktop */}
              <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-0.5 bg-blue-200 -z-10"></div>

              <div className="text-center relative">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold shadow-lg">
                  1
                </div>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileCheck className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">
                  Answer Questions
                </h3>
                <p className="text-gray-700 mb-2">
                  Tell us about your business in 7 simple questions
                </p>
                <ul className="text-sm text-gray-600 text-left max-w-xs mx-auto space-y-1">
                  <li>• Business type, location, size, industry</li>
                  <li>• Takes just 2 minutes</li>
                  <li>• No technical knowledge needed</li>
                </ul>
              </div>

              <div className="text-center relative">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold shadow-lg">
                  2
                </div>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">
                  AI Analysis
                </h3>
                <p className="text-gray-700 mb-2">
                  Our AI analyzes and matches compliances
                </p>
                <ul className="text-sm text-gray-600 text-left max-w-xs mx-auto space-y-1">
                  <li>• Checks 20+ compliance requirements</li>
                  <li>• Matches based on your specific criteria</li>
                  <li>• Calculates deadlines for next 12 months</li>
                </ul>
              </div>

              <div className="text-center relative">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold shadow-lg">
                  3
                </div>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">
                  Get Your Calendar
                </h3>
                <p className="text-gray-700 mb-2">
                  View, download, and never miss a deadline
                </p>
                <ul className="text-sm text-gray-600 text-left max-w-xs mx-auto space-y-1">
                  <li>• Interactive calendar with all deadlines</li>
                  <li>• Detailed compliance report</li>
                  <li>• Export and share options</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Why This Solution Works */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 scroll-mt-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Why Our Approach is the Right Solution
          </h2>
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">
                    Automated Intelligence
                  </h3>
                  <p className="text-gray-700">
                    Traditional solutions require manual tracking or expensive
                    consultants. Our AI-powered approach democratizes compliance
                    management, making it accessible to all SMEs.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">
                    Personalization at Scale
                  </h3>
                  <p className="text-gray-700">
                    Generic compliance checklists overwhelm businesses with
                    irrelevant requirements. We show ONLY what applies to your
                    specific business profile.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">
                    Proactive Not Reactive
                  </h3>
                  <p className="text-gray-700">
                    Most businesses discover compliance requirements when
                    it&apos;s too late. Our 12-month forecast helps you plan
                    ahead and avoid penalties.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">
                    Cost-Effective
                  </h3>
                  <p className="text-gray-700">
                    Hiring compliance consultants costs ₹50,000+/year. Our
                    solution provides 80% of the value at a fraction of the
                    cost.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">
                    Data-Driven Insights
                  </h3>
                  <p className="text-gray-700">
                    We don&apos;t just list deadlines. Our AI analyzes your
                    compliance burden, identifies risks, and recommends
                    optimizations.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-center text-gray-900">
                Traditional vs Our Solution
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Approach</span>
                  <div className="flex gap-4">
                    <span className="text-red-600">Manual research</span>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                    <span className="text-green-600 font-semibold">
                      AI-powered
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Relevance</span>
                  <div className="flex gap-4">
                    <span className="text-red-600">Generic lists</span>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                    <span className="text-green-600 font-semibold">
                      Personalized
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Timing</span>
                  <div className="flex gap-4">
                    <span className="text-red-600">After-the-fact</span>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                    <span className="text-green-600 font-semibold">
                      Proactive
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Cost</span>
                  <div className="flex gap-4">
                    <span className="text-red-600">Expensive</span>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                    <span className="text-green-600 font-semibold">
                      Affordable
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Updates</span>
                  <div className="flex gap-4">
                    <span className="text-red-600">Static data</span>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                    <span className="text-green-600 font-semibold">
                      Always updated
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: What You Get */}
      <section className="py-20 bg-white scroll-mt-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Complete Compliance Package
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                12-Month Compliance Calendar
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>All applicable deadlines clearly marked</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Priority indicators (High/Medium/Low)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Penalty information for each compliance</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Official portal links</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Month view and list view</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Filter by category and priority</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-6">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                AI-Generated Report
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Executive summary of compliance status</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Risk assessment and score</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Cost breakdown and analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Industry-specific insights</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Prioritized action plan</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Compliance checklist</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-6">
                <Download className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                Export & Integration
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Download calendar as PDF</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Export to CSV for spreadsheet</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Add to Google Calendar</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Print-friendly format</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Markdown format for notes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Share with team/accountant</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Compliance Coverage */}
      <section id="coverage" className="py-20 bg-gray-50 scroll-mt-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
            Comprehensive Compliance Coverage
          </h2>
          <p className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            We track all major compliance requirements for Indian SMEs
          </p>
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-md">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Receipt className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Tax Compliances
                  </h3>
                </div>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">GST Returns</span>{" "}
                      (GSTR-1, GSTR-3B)
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">TDS</span> (Tax Deducted
                      at Source)
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Income Tax Return</span>{" "}
                      (ITR-3, ITR-4)
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Tax Audit</span>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-md">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Labor Compliances
                  </h3>
                </div>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">EPF</span> (Employee
                      Provident Fund)
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">ESI</span> (Employee State
                      Insurance)
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Professional Tax</span>{" "}
                      (state-specific)
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-md">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Statutory Compliances
                  </h3>
                </div>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">MSME Annual Return</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">MSME Form 1</span>{" "}
                      (Payment disclosure)
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">
                        Shops & Establishments Act
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <p className="text-center text-gray-600 mt-8 italic">
              More compliances added regularly based on your business profile
            </p>
          </div>
        </div>
      </section>

      {/* Section 8: Important Notice */}
      <section className="py-12 bg-amber-50 border-y-2 border-amber-200 scroll-mt-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-md border-l-4 border-amber-500">
              <AlertTriangle className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">
                  ⚠️ PROTOTYPE NOTICE
                </h3>
                <p className="text-gray-700 mb-4">
                  <strong>Important: Save Your Data</strong>
                </p>
                <p className="text-gray-700 mb-4">
                  This is a prototype demonstration system. Calendar and report
                  generation is <strong>TEMPORARY</strong> and session-based
                  only.
                </p>
                <p className="text-gray-700 mb-4">
                  Your generated compliance calendar and reports are{" "}
                  <strong>NOT stored in a database</strong>. Please:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4 ml-4">
                  <li>
                    ✓ Download your calendar (PDF/CSV) immediately after
                    generation
                  </li>
                  <li>✓ Save your AI report for future reference</li>
                  <li>✓ Export to Google Calendar if you want reminders</li>
                  <li>✓ Bookmark or print important information</li>
                </ul>
                <p className="text-gray-700 font-semibold">
                  If you refresh or close your browser, you&apos;ll need to
                  regenerate your data. This is normal for a prototype system
                  and demonstrates the core functionality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 9: Technical Architecture */}
      <section className="py-20 bg-white scroll-mt-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
            Built with Modern Technology
          </h2>
          <p className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            This prototype demonstrates enterprise-grade architecture and AI
            integration suitable for production deployment.
          </p>
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">
                Tech Stack
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span>
                    <strong>Next.js 14</strong> (App Router, Server Components)
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span>
                    <strong>TypeScript</strong> for type safety
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span>
                    <strong>TailwindCSS</strong> for responsive design
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span>
                    <strong>OpenAI GPT-4</strong> for intelligent insights
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span>
                    <strong>Serper API</strong> for real-time data
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span>
                    <strong>Vercel</strong> deployment platform
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">
                Features
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                  <span>AI-powered data generation from live sources</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                  <span>Smart compliance matching algorithms</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                  <span>Responsive calendar components</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                  <span>PDF/CSV export functionality</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                  <span>Error boundaries and loading states</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                  <span>SEO optimized and accessible</span>
                </li>
              </ul>
              <div className="mt-6 p-4 bg-white rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Deployment:</strong> Fully deployed on Vercel with
                  edge functions for optimal performance
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 10: Project Context */}
      <section className="py-20 bg-gray-50 scroll-mt-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900">
              About This Project
            </h2>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <p className="text-lg text-gray-700 mb-6">
                This is a prototype developed as part of the{" "}
                <strong>Nonmarket Strategy for Grand Challenges</strong> course
                (MBA Program). It addresses the grand challenge of{" "}
                <strong>Ethical Governance and Anti-Corruption</strong> by
                making compliance accessible to Indian SMEs.
              </p>

              <h3 className="text-xl font-bold mb-4 text-gray-900">
                KEY OBJECTIVES:
              </h3>
              <ul className="space-y-2 mb-6 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Reduce compliance burden on small businesses</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>
                    Prevent unintentional non-compliance due to lack of
                    awareness
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>
                    Demonstrate AI application in governance and regulation
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Create shared value for businesses and government</span>
                </li>
              </ul>

              <h3 className="text-xl font-bold mb-4 text-gray-900">
                INNOVATION:
              </h3>
              <p className="text-gray-700">
                Unlike existing solutions that provide generic compliance lists,
                our AI-powered approach personalizes requirements based on
                specific business attributes, making compliance management
                accessible and actionable for resource-constrained SMEs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 11: Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Simplify Your Compliance?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Get your personalized compliance calendar in the next 2 minutes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link
              href="/questionnaire"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-10 py-5 rounded-lg font-semibold text-xl hover:bg-blue-50 transition-all transform hover:scale-105 shadow-xl"
            >
              Start Your Compliance Check
              <ArrowRight className="w-6 h-6" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white px-10 py-5 rounded-lg font-semibold text-xl hover:bg-white/10 transition-all"
            >
              Or explore a sample calendar
            </Link>
          </div>
          <p className="text-lg text-blue-100">
            No signup required • Completely free • Takes 2 minutes
          </p>
        </div>
      </section>

      {/* Section 12: Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-6 h-6 text-blue-400" />
                <span className="text-xl font-bold text-white">
                  Compliant AI
                </span>
              </div>
              <p className="text-sm">
                © {new Date().getFullYear()} Compliant AI. Academic prototype
                project.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/questionnaire"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Questionnaire
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("coverage")}
                    className="hover:text-blue-400 transition-colors"
                  >
                    Compliance Coverage
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Built With</h4>
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="px-3 py-1 bg-gray-800 rounded">Next.js</span>
                <span className="px-3 py-1 bg-gray-800 rounded">
                  TypeScript
                </span>
                <span className="px-3 py-1 bg-gray-800 rounded">
                  TailwindCSS
                </span>
                <span className="px-3 py-1 bg-gray-800 rounded">OpenAI</span>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p className="text-gray-500">
              Academic prototype project • Not for commercial use • Built as
              part of MBA coursework
            </p>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center z-50"
          aria-label="Back to top"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
