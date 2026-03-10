'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import cpiScores from '../../../config/cpi-scores.json';

interface CPIComparisonChartProps {
  userScore: number;
}

interface ChartDataItem {
  name: string;
  score: number;
  type: 'user' | 'belgium' | 'other';
}

export default function CPIComparisonChart({ userScore }: CPIComparisonChartProps) {
  const allCountries = Object.entries(cpiScores)
    .map(([code, data]) => ({
      code,
      name: data.name,
      score: data.score,
    }))
    .sort((a, b) => b.score - a.score);

  const euAverage = Math.round(
    allCountries.reduce((sum, c) => sum + c.score, 0) / allCountries.length
  );

  const top5 = allCountries.slice(0, 5);
  const bottom5 = allCountries.slice(-5);

  const selectedCountries = new Set<string>();
  const chartData: ChartDataItem[] = [];

  for (const country of top5) {
    selectedCountries.add(country.code);
    chartData.push({
      name: country.name,
      score: country.score,
      type: country.code === 'BE' ? 'belgium' : 'other',
    });
  }

  if (!selectedCountries.has('BE')) {
    const belgium = allCountries.find((c) => c.code === 'BE');
    if (belgium) {
      chartData.push({ name: belgium.name, score: belgium.score, type: 'belgium' });
      selectedCountries.add('BE');
    }
  }

  chartData.push({ name: 'Your Score', score: userScore, type: 'user' });

  for (const country of bottom5) {
    if (!selectedCountries.has(country.code)) {
      chartData.push({
        name: country.name,
        score: country.score,
        type: country.code === 'BE' ? 'belgium' : 'other',
      });
    }
  }

  chartData.sort((a, b) => b.score - a.score);

  const getBarColor = (type: string) => {
    switch (type) {
      case 'user': return '#FFCD00';
      case 'belgium': return '#002169';
      default: return '#636466';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <p className="text-sm text-ti-gray mb-4">
        Your score compared to EU Corruption Perceptions Index (CPI) scores
      </p>
      <div className="w-full" style={{ height: `${chartData.length * 40 + 60}px`, minHeight: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 13 }} />
            <Tooltip
              formatter={(value) => [`${value}/100`, 'Score']}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
            />
            <ReferenceLine
              x={euAverage}
              stroke="#004C97"
              strokeDasharray="5 5"
              label={{ value: `EU Avg: ${euAverage}`, position: 'top', fill: '#004C97', fontSize: 12 }}
            />
            <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={24}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getBarColor(entry.type)}
                  opacity={entry.type === 'user' ? 1 : 0.85}
                  stroke={entry.type === 'user' ? '#002169' : 'none'}
                  strokeWidth={entry.type === 'user' ? 2 : 0}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-6 mt-4 text-xs text-ti-gray justify-center">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: '#FFCD00' }} />
          Your Score
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: '#002169' }} />
          Belgium
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: '#636466' }} />
          Other EU Countries
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-0 border-t-2 border-dashed" style={{ borderColor: '#004C97' }} />
          EU Average
        </div>
      </div>
    </div>
  );
}
