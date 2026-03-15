'use client';

interface WelcomeCardProps {
  onStart: () => void;
}

export default function WelcomeCard({ onStart }: WelcomeCardProps) {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-heading font-bold text-ti-navy dark:text-ti-dark-text mb-4">
        Integrity Self-Assessment
      </h1>
      <p className="text-ti-text-muted dark:text-ti-dark-muted mb-6 leading-relaxed max-w-lg mx-auto">
        This assessment evaluates your organisation&apos;s integrity policies and
        practices across six key dimensions. It takes approximately 15 minutes to
        complete and consists of 30 questions. At the end, you will receive a
        detailed scorecard with personalised recommendations to strengthen your
        organisation&apos;s integrity framework.
      </p>
      <button
        onClick={onStart}
        className="bg-ti-red hover:bg-ti-red-dark text-white font-bold py-3 px-8 rounded-[4px] uppercase tracking-wide transition-colors"
      >
        Start Assessment
      </button>
    </div>
  );
}
