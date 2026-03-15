'use client';

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface DimensionRadarProps {
  dimensionScores: { dimension: string; score: number; label: string }[];
}

export default function DimensionRadar({ dimensionScores }: DimensionRadarProps) {
  const data = dimensionScores.map((ds) => ({
    subject: ds.label,
    score: ds.score,
    fullMark: 100,
  }));

  return (
    <div className="bg-white dark:bg-ti-dark-card rounded-[4px] border border-ti-grey-mid dark:border-ti-dark-border shadow-lg p-6">
      <div className="w-full" style={{ height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fontSize: 12, fill: '#5A5A72' }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: '#5A5A72' }}
              tickCount={6}
            />
            <Tooltip
              formatter={(value) => [`${value}/100`, 'Score']}
              contentStyle={{ borderRadius: '4px', border: '1px solid #e5e7eb' }}
            />
            <Radar
              name="Score"
              dataKey="score"
              stroke="#003087"
              fill="#003087"
              fillOpacity={0.25}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
        {dimensionScores.map((ds) => (
          <div key={ds.dimension} className="text-center">
            <p className="text-sm text-ti-text-muted dark:text-ti-dark-muted">{ds.label}</p>
            <p className={`text-lg font-bold ${
              ds.score < 40 ? 'text-score-red' :
              ds.score < 60 ? 'text-score-orange' :
              ds.score < 75 ? 'text-score-yellow' :
              'text-score-green'
            }`}>
              {ds.score}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
