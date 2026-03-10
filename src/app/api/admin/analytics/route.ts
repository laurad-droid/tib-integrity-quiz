import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

interface ScoreDistribution {
  range: string;
  count: number;
}

interface SectorAverage {
  sector: string;
  averageScore: number;
  count: number;
}

interface AnalyticsResponse {
  totalAssessments: number;
  averageScore: number;
  scoreDistribution: ScoreDistribution[];
  sectorAverages: SectorAverage[];
}

export async function GET() {
  const supabase = createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch all completed assessments with profile data
  const { data: assessments, error } = await supabase
    .from('assessments')
    .select('id, total_score, completed_at, user_id')
    .not('completed_at', 'is', null);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const completedAssessments = assessments || [];
  const totalAssessments = completedAssessments.length;

  // Average total score
  const averageScore =
    totalAssessments > 0
      ? Math.round(
          completedAssessments.reduce((sum, a) => sum + (a.total_score || 0), 0) /
            totalAssessments
        )
      : 0;

  // Score distribution
  const distribution = { '0-39': 0, '40-59': 0, '60-74': 0, '75-100': 0 };
  completedAssessments.forEach((a) => {
    const score = a.total_score || 0;
    if (score >= 75) distribution['75-100']++;
    else if (score >= 60) distribution['60-74']++;
    else if (score >= 40) distribution['40-59']++;
    else distribution['0-39']++;
  });

  const scoreDistribution: ScoreDistribution[] = [
    { range: '0-39', count: distribution['0-39'] },
    { range: '40-59', count: distribution['40-59'] },
    { range: '60-74', count: distribution['60-74'] },
    { range: '75-100', count: distribution['75-100'] },
  ];

  // Fetch profiles for sector breakdown
  const userIds = Array.from(new Set(completedAssessments.map((a) => a.user_id)));
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, sector')
    .in('id', userIds.length > 0 ? userIds : ['__none__']);

  const profileMap = new Map<string, string>();
  (profiles || []).forEach((p: { id: string; sector: string }) => {
    profileMap.set(p.id, p.sector);
  });

  // Calculate average score by sector
  const sectorData: Record<string, { totalScore: number; count: number }> = {};
  completedAssessments.forEach((a) => {
    const sector = profileMap.get(a.user_id) || 'unknown';
    if (!sectorData[sector]) {
      sectorData[sector] = { totalScore: 0, count: 0 };
    }
    sectorData[sector].totalScore += a.total_score || 0;
    sectorData[sector].count++;
  });

  const sectorAverages: SectorAverage[] = Object.entries(sectorData).map(
    ([sector, data]) => ({
      sector,
      averageScore: Math.round(data.totalScore / data.count),
      count: data.count,
    })
  );

  const response: AnalyticsResponse = {
    totalAssessments,
    averageScore,
    scoreDistribution,
    sectorAverages,
  };

  return NextResponse.json(response);
}
