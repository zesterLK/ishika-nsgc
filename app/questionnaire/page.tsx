import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { QuestionnaireForm } from '@/components/forms/QuestionnaireForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Questionnaire | SME Compliance Tracker',
  description: 'Complete your business profile to get personalized compliance calendar',
};

export default function QuestionnairePage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Business Profile Questionnaire
          </h1>
          <p className="text-lg text-gray-600">
            Answer a few questions to get your personalized compliance calendar
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-200">
          <QuestionnaireForm />
        </div>
      </main>
    </div>
  );
}

