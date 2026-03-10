'use client';

interface ActionPlanProps {
  recommendations: Record<string, string[]>;
  dimensionScores: { dimensionId: string; label: string; score: number }[];
}

function getScoreColor(score: number): string {
  if (score < 40) return 'text-score-red';
  if (score < 60) return 'text-score-orange';
  if (score < 75) return 'text-score-yellow';
  return 'text-score-green';
}

function getScoreBorderColor(score: number): string {
  if (score < 40) return 'border-score-red';
  if (score < 60) return 'border-score-orange';
  if (score < 75) return 'border-score-yellow';
  return 'border-score-green';
}

export default function ActionPlan({ recommendations, dimensionScores }: ActionPlanProps) {
  const dimensionsWithRecs = dimensionScores.filter(
    (ds) => recommendations[ds.dimensionId] && recommendations[ds.dimensionId].length > 0
  );

  if (dimensionsWithRecs.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="text-4xl mb-4">&#127942;</div>
        <h3 className="text-xl font-bold text-ti-navy mb-2">
          Excellent work!
        </h3>
        <p className="text-ti-gray">
          All your dimensions scored 60 or above. Your organisation demonstrates
          a solid foundation across all integrity areas. Continue monitoring and
          improving your practices to maintain this strong posture.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {dimensionsWithRecs.map((ds) => (
        <div
          key={ds.dimensionId}
          className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${getScoreBorderColor(ds.score)}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-ti-navy">
              {ds.label}
            </h3>
            <span className={`text-2xl font-bold ${getScoreColor(ds.score)}`}>
              {ds.score}/100
            </span>
          </div>
          <ul className="space-y-3">
            {recommendations[ds.dimensionId].map((rec, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="mt-1.5 flex-shrink-0 w-2 h-2 rounded-full bg-ti-accent" />
                <span className="text-ti-gray text-sm leading-relaxed">
                  {rec}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
