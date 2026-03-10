'use client';

export default function Error({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-ti-bg flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center max-w-md w-full">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-score-red/10 mb-6">
          <svg
            className="w-8 h-8 text-score-red"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-ti-navy mb-3">Something went wrong</h2>
        <p className="text-ti-gray mb-8 leading-relaxed">
          An unexpected error occurred. Please try again or contact support if the problem persists.
        </p>
        <button
          onClick={() => reset()}
          className="rounded-lg bg-ti-yellow px-8 py-3 text-base font-semibold text-ti-navy shadow-sm hover:bg-yellow-400 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
