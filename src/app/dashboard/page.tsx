import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import type { Assessment, Profile } from '@/types';
import Header from '@/components/ui/Header';

function getScoreColor(score: number): string {
  if (score >= 75) return 'text-score-green';
  if (score >= 60) return 'text-score-yellow';
  if (score >= 40) return 'text-score-orange';
  return 'text-score-red';
}

function getScoreBgColor(score: number): string {
  if (score >= 75) return 'bg-score-green';
  if (score >= 60) return 'bg-score-yellow';
  if (score >= 40) return 'bg-score-orange';
  return 'bg-score-red';
}

function getScoreLabel(score: number): string {
  if (score >= 75) return 'Strong';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Developing';
  return 'Needs Attention';
}

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const typedProfile = profile as Profile | null;

  // Fetch completed assessments
  const { data: assessments } = await supabase
    .from('assessments')
    .select('*')
    .eq('user_id', user.id)
    .not('completed_at', 'is', null)
    .order('completed_at', { ascending: false });

  const typedAssessments = (assessments || []) as Assessment[];

  return (
    <div className="min-h-screen bg-ti-bg">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ti-navy">
            {typedProfile?.organization_name
              ? `Welcome, ${typedProfile.organization_name}`
              : 'Your Dashboard'}
          </h1>
          <p className="text-ti-gray mt-1">
            Track your integrity assessment progress over time.
          </p>
        </div>

        {/* Assessments List */}
        {typedAssessments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-bold text-ti-navy mb-3">
              No Assessments Yet
            </h2>
            <p className="text-ti-gray mb-8 max-w-md mx-auto">
              Start your first integrity self-assessment to understand where
              your organisation stands and receive tailored recommendations.
            </p>
            <Link
              href="/assessment"
              className="inline-block bg-ti-yellow text-ti-navy font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity"
            >
              Start Your First Assessment
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-ti-navy">
                Past Assessments ({typedAssessments.length})
              </h2>
              <Link
                href="/assessment"
                className="bg-ti-yellow text-ti-navy font-semibold py-2 px-6 rounded-lg hover:opacity-90 transition-opacity text-sm"
              >
                New Assessment
              </Link>
            </div>

            <div className="space-y-4">
              {typedAssessments.map((assessment) => {
                const completedDate = new Date(
                  assessment.completed_at
                ).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                });

                return (
                  <div
                    key={assessment.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        {/* Score Circle */}
                        <div className="flex-shrink-0">
                          <div
                            className={`w-16 h-16 rounded-full flex items-center justify-center ${getScoreBgColor(
                              assessment.total_score
                            )} bg-opacity-10`}
                          >
                            <span
                              className={`text-2xl font-bold ${getScoreColor(
                                assessment.total_score
                              )}`}
                            >
                              {assessment.total_score}
                            </span>
                          </div>
                        </div>

                        {/* Details */}
                        <div>
                          <p className="text-sm text-ti-gray">
                            {completedDate}
                          </p>
                          <p
                            className={`text-sm font-semibold mt-1 ${getScoreColor(
                              assessment.total_score
                            )}`}
                          >
                            {getScoreLabel(assessment.total_score)}
                          </p>
                        </div>
                      </div>

                      {/* View Results Link */}
                      <Link
                        href={`/results/${assessment.id}`}
                        className="text-ti-accent font-medium text-sm hover:underline"
                      >
                        View Results &rarr;
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
