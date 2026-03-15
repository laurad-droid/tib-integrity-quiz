'use client';

import { useState } from 'react';
import type { Dimension } from '@/types';

interface WhyThisMattersProps {
  dimension: Dimension;
}

export default function WhyThisMatters({ dimension }: WhyThisMattersProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mb-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="inline-flex items-center gap-1 text-sm text-ti-text-muted dark:text-ti-dark-muted hover:text-ti-navy dark:hover:text-ti-navy-light transition-colors"
      >
        <span>Why this matters</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {expanded && (
        <div className="mt-2 pl-0 text-sm text-ti-text-muted dark:text-ti-dark-muted leading-relaxed">
          <p className="mb-2">{dimension.description}</p>
          {dimension.references.slice(0, 2).map((ref, i) => (
            <p key={i} className="text-xs italic">&#8226; {ref}</p>
          ))}
        </div>
      )}
    </div>
  );
}
