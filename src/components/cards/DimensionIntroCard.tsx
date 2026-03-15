'use client';

import type { Dimension } from '@/types';

interface DimensionIntroCardProps {
  dimension: Dimension;
  onContinue: () => void;
}

function DimensionIcon({ icon, color }: { icon: string; color: string }) {
  const iconClass = "w-8 h-8";
  switch (icon) {
    case 'shield-check':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} className={iconClass}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      );
    case 'document-check':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} className={iconClass}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9.375-9zM10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12" />
        </svg>
      );
    case 'eye':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} className={iconClass}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case 'megaphone':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} className={iconClass}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
        </svg>
      );
    case 'clipboard-check':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} className={iconClass}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 011.65 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
        </svg>
      );
    case 'users':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} className={iconClass}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function DimensionIntroCard({ dimension, onContinue }: DimensionIntroCardProps) {
  return (
    <div className="text-center">
      {/* Icon area */}
      <div
        className="inline-flex items-center justify-center w-16 h-16 rounded-[4px] mb-6"
        style={{ backgroundColor: dimension.color + '15' }}
      >
        <DimensionIcon icon={dimension.icon} color={dimension.color} />
      </div>

      {/* Dimension title */}
      <h2 className="text-2xl font-heading font-bold text-ti-navy dark:text-ti-dark-text uppercase tracking-wide mb-4">
        {dimension.label}
      </h2>

      {/* Description */}
      <p className="text-ti-text-muted dark:text-ti-dark-muted leading-relaxed mb-6 max-w-lg mx-auto">
        {dimension.description}
      </p>

      {/* Research references */}
      <div className="bg-ti-bg dark:bg-ti-dark-bg border border-ti-grey-mid dark:border-ti-dark-border rounded-[4px] p-4 mb-6 text-left max-w-md mx-auto">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-ti-text-muted dark:text-ti-dark-muted mb-2">
          Based on international standards
        </h3>
        <ul className="space-y-1">
          {dimension.references.map((ref, i) => (
            <li key={i} className="text-sm text-ti-text dark:text-ti-dark-text flex items-start gap-2">
              <span className="text-ti-text-muted dark:text-ti-dark-muted mt-0.5">&#8226;</span>
              <span>{ref}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Question count */}
      <p className="text-sm text-ti-text-muted dark:text-ti-dark-muted mb-6">
        5 questions &middot; ~2 minutes
      </p>

      {/* CTA button */}
      <button
        onClick={onContinue}
        className="bg-ti-red hover:bg-ti-red-dark text-white font-bold py-3 px-8 rounded-[4px] uppercase tracking-wide transition-colors"
      >
        Begin Section
      </button>
    </div>
  );
}
