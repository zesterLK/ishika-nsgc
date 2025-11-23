import Link from "next/link";
import {
  Calendar,
  TrendingUp,
  Shield,
  CheckCircle,
  ArrowRight,
  Clock,
  FileCheck,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SME Compliance Tracker - Never Miss a Deadline",
  description:
    "AI-powered compliance calendar for Indian businesses. Get personalized GST, EPF, ESI, and other compliance deadlines.",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Never Miss a Compliance Deadline Again
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              AI-powered compliance calendar for Indian SMEs. Get your
              personalized compliance roadmap in 2 minutes.
            </p>
            <Link
              href="/questionnaire"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
            >
              Get My Compliance Calendar
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Why Choose Our Compliance Tracker?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                Personalized Calendar
              </h3>
              <p className="text-gray-700">
                Shows only compliances that apply to YOUR business. No more
                sifting through irrelevant requirements.
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                Always Up-to-Date
              </h3>
              <p className="text-gray-700">
                AI-powered data from latest government sources. Compliance rules
                updated automatically as regulations change.
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                Zero Penalties
              </h3>
              <p className="text-gray-700">
                Never miss a deadline with clear due dates, reminders, and
                priority indicators. Stay compliant, avoid fines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
            How It Works
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">
                  Answer 7 Simple Questions
                </h3>
                <p className="text-gray-700">
                  Tell us about your business type, location, size, and
                  registration status. Takes less than 2 minutes.
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">
                  Get Your Calendar
                </h3>
                <p className="text-gray-700">
                  AI generates your personalized compliance roadmap with all
                  applicable deadlines for the next 12 months.
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">
                  Stay Compliant
                </h3>
                <p className="text-gray-700">
                  Track deadlines, download reports, and access official
                  resources. Never miss a compliance deadline again.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-700">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium">
                Based on official government sources
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium">Free for basic use</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium">No credit card required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Stay Compliant?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Get your personalized compliance calendar in just 2 minutes
          </p>
          <Link
            href="/questionnaire"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
          >
            Start Your Free Compliance Check
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
