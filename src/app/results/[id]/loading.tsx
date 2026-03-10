export default function Loading() {
  return (
    <div className="min-h-screen bg-ti-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-ti-navy/10" />
          <div className="absolute inset-0 rounded-full border-4 border-t-ti-navy border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        </div>
        <p className="text-sm font-medium text-ti-gray animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
