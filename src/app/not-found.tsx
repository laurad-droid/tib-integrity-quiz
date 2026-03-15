import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ti-bg dark:bg-ti-dark-bg flex items-center justify-center px-4">
      <div className="bg-white dark:bg-ti-dark-card rounded-[4px] border border-ti-grey-mid dark:border-ti-dark-border shadow-lg p-8 sm:p-12 text-center max-w-md w-full">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-ti-navy/5 mb-6">
          <span className="text-4xl font-bold text-ti-navy dark:text-ti-dark-text">404</span>
        </div>
        <h2 className="text-2xl font-bold font-heading text-ti-navy dark:text-ti-dark-text mb-3">Page Not Found</h2>
        <p className="text-ti-text-muted dark:text-ti-dark-muted mb-8 leading-relaxed">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-[4px] bg-ti-red hover:bg-ti-red-dark px-8 py-3 text-base font-bold text-white uppercase tracking-wide shadow-sm transition-colors"
        >
          Back to Home
          <svg
            className="ml-2 w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
