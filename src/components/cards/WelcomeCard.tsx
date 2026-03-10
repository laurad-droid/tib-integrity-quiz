'use client';

interface WelcomeCardProps {
  onStart: () => void;
}

export default function WelcomeCard({ onStart }: WelcomeCardProps) {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold text-ti-navy mb-4">
        Integrity Self-Assessment
      </h1>
      <p className="text-ti-gray mb-6 leading-relaxed max-w-lg mx-auto">
        This assessment evaluates your organisation&apos;s integrity policies and
        practices across six key dimensions. It takes approximately 15 minutes to
        complete and consists of 30 questions. At the end, you will receive a
        detailed scorecard with personalised recommendations to strengthen your
        organisation&apos;s integrity framework.
      </p>
      <button
        onClick={onStart}
        className="bg-ti-yellow text-ti-navy font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity"
      >
        Start Assessment
      </button>
    </div>
  );
}
