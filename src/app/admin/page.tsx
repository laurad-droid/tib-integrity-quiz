import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/ui/Header';

interface ScoreDistribution { range: string; count: number; }
interface SectorAverage { sector: string; averageScore: number; count: number; }

const BAR_COLORS: Record<string, string> = { "0-39": "bg-score-red", "40-59": "bg-score-orange", "60-74": "bg-score-yellow", "75-100": "bg-score-green" };
const RANGE_LABELS: Record<string, string> = { "0-39": "Needs Attention (0-39)", "40-59": "Developing (40-59)", "60-74": "Good (60-74)", "75-100": "Strong (75-100)" };
const SECTOR_LABELS: Record<string, string> = { government: "Government", private: "Private Sector", ngo: "NGO / Civil Society" };

function getBarColor(r: string): string { return BAR_COLORS[r] || 'bg-ti-gray'; }
function getRangeLabel(r: string): string { return RANGE_LABELS[r] || r; }
function getSectorLabel(s: string): string { return SECTOR_LABELS[s] || s.charAt(0).toUpperCase() + s.slice(1); }

export default async function AdminPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { redirect('/auth/login'); }

  const { data: assessments } = await supabase.from('assessments').select('id, total_score, completed_at, user_id').not('completed_at', 'is', null);
  const all = assessments || [];
  const total = all.length;
  const avg = total > 0 ? Math.round(all.reduce((s, a) => s + (a.total_score || 0), 0) / total) : 0;

  const dist: Record<string, number> = { "0-39": 0, "40-59": 0, "60-74": 0, "75-100": 0 };
  all.forEach((a) => { const sc = a.total_score || 0; if (sc >= 75) dist["75-100"]++; else if (sc >= 60) dist["60-74"]++; else if (sc >= 40) dist["40-59"]++; else dist["0-39"]++; });
  const scoreDist: ScoreDistribution[] = [{ range: "0-39", count: dist["0-39"] }, { range: "40-59", count: dist["40-59"] }, { range: "60-74", count: dist["60-74"] }, { range: "75-100", count: dist["75-100"] }];
  const maxC = Math.max(...scoreDist.map((d) => d.count), 1);

  const uids = Array.from(new Set(all.map((a) => a.user_id)));
  const { data: profiles } = await supabase.from('profiles').select('id, sector').in('id', uids.length > 0 ? uids : ['__none__']);
  const pMap = new Map<string, string>();
  (profiles || []).forEach((p: { id: string; sector: string }) => { pMap.set(p.id, p.sector); });
  const sData: Record<string, { ts: number; c: number }> = {};
  all.forEach((a) => { const sec = pMap.get(a.user_id) || 'unknown'; if (!sData[sec]) sData[sec] = { ts: 0, c: 0 }; sData[sec].ts += a.total_score || 0; sData[sec].c++; });
  const sectorAvgs: SectorAverage[] = Object.entries(sData).map(([sector, d]) => ({ sector, averageScore: Math.round(d.ts / d.c), count: d.c }));

  return (
    <div className="min-h-screen bg-ti-bg">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-ti-navy">Admin Dashboard</h1>
            <p className="text-ti-gray mt-1">Aggregate analytics across all assessments</p>
          </div>
          <Link href="/api/admin/export" className="bg-ti-yellow text-ti-navy font-semibold py-2 px-6 rounded-lg hover:opacity-90 transition-opacity text-sm">Export CSV</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <p className="text-sm text-ti-gray font-medium">Total Assessments</p>
            <p className="text-4xl font-bold text-ti-navy mt-2">{total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <p className="text-sm text-ti-gray font-medium">Average Score</p>
            <p className="text-4xl font-bold text-ti-navy mt-2">{avg}<span className="text-lg text-ti-gray font-normal">/100</span></p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <p className="text-sm text-ti-gray font-medium">Belgium CPI 2025</p>
            <p className="text-4xl font-bold text-ti-accent mt-2">69<span className="text-lg text-ti-gray font-normal">/100</span></p>
            <p className="text-xs text-ti-gray mt-1">Corruption Perceptions Index</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-10">
          <h2 className="text-xl font-semibold text-ti-navy mb-6">Score Distribution</h2>
          {total === 0 ? (<p className="text-ti-gray text-center py-8">No assessments completed yet.</p>) : (
            <div className="space-y-4">
              {scoreDist.map((item) => {
                const bw = Math.max((item.count / maxC) * 100, item.count > 0 ? 12 : 0);
                return (
                  <div key={item.range} className="flex items-center gap-4">
                    <div className="w-40 text-sm text-ti-gray flex-shrink-0">{getRangeLabel(item.range)}</div>
                    <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 flex items-center justify-end pr-3 ${getBarColor(item.range)}`} style={{ width: bw + '%' }}>
                        {item.count > 0 && <span className="text-white text-xs font-bold">{item.count}</span>}
                      </div>
                    </div>
                    <div className="w-12 text-right text-sm font-medium text-ti-navy">{item.count}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-ti-navy mb-6">Average Score by Sector</h2>
          {sectorAvgs.length === 0 ? (<p className="text-ti-gray text-center py-8">No sector data available yet.</p>) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-ti-navy">Sector</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-ti-navy">Assessments</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-ti-navy">Avg Score</th>
                  </tr>
                </thead>
                <tbody>
                  {sectorAvgs.map((sec) => (
                    <tr key={sec.sector} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-ti-gray">{getSectorLabel(sec.sector)}</td>
                      <td className="py-3 px-4 text-sm text-ti-gray text-right">{sec.count}</td>
                      <td className="py-3 px-4 text-right"><span className="text-sm font-bold text-ti-navy">{sec.averageScore}</span><span className="text-xs text-ti-gray">/100</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
