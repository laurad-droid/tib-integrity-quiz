export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ti-bg px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-ti-navy sm:text-5xl">
          Integrity Self-Assessment
        </h1>
        <p className="mt-4 text-lg text-ti-gray">
          Evaluate your organisation&apos;s integrity policies and practices
          with this confidential self-assessment tool by Transparency
          International Belgium.
        </p>
        <button
          className="mt-8 rounded-lg bg-ti-yellow px-8 py-3 text-lg font-semibold text-ti-navy shadow-sm transition-colors hover:bg-yellow-400"
          type="button"
        >
          Start Assessment
        </button>
      </div>
    </main>
  );
}
