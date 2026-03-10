import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { DimensionId } from '@/types';

const DIMENSION_IDS: DimensionId[] = [
  'leadership',
  'anticorruption',
  'transparency',
  'whistleblower',
  'accountability',
  'stakeholder',
];

export async function GET() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch all completed assessments with user profiles (anonymized: sector only)
  const { data: assessments, error: assessmentsError } = await supabase
    .from('assessments')
    .select('id, total_score, dimension_scores, completed_at, user_id')
    .not('completed_at', 'is', null)
    .order('completed_at', { ascending: false });

  if (assessmentsError) {
    return NextResponse.json({ error: assessmentsError.message }, { status: 500 });
  }

  const completedAssessments = assessments || [];

  // Fetch profiles for sector info
  const userIds = Array.from(new Set(completedAssessments.map((a) => a.user_id)));
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, sector')
    .in('id', userIds.length > 0 ? userIds : ['__none__']);

  const profileMap = new Map<string, string>();
  (profiles || []).forEach((p: { id: string; sector: string }) => {
    profileMap.set(p.id, p.sector);
  });

  // Build CSV
  const dimensionHeaders = DIMENSION_IDS.map((d) => 'score_' + d);
  const headers = ['assessment_date', 'sector', 'total_score', ...dimensionHeaders];

  const rows = completedAssessments.map((a) => {
    const sector = profileMap.get(a.user_id) || 'unknown';
    const date = a.completed_at ? new Date(a.completed_at).toISOString().split('T')[0] : '';
    const dimScores = (a.dimension_scores || {}) as Record<string, number>;

    const dimensionValues = DIMENSION_IDS.map((d) => {
      const score = dimScores[d];
      return score !== undefined ? String(score) : '';
    });

    return [date, sector, String(a.total_score || 0), ...dimensionValues];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="integrity-assessments-export.csv"',
    },
  });
}
