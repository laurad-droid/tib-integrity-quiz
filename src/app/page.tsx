import Link from 'next/link';

function CPIScoreCircle() {
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="w-48 h-48 sm:w-56 sm:h-56" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="88" fill="none" stroke="#E5E7EB" strokeWidth="12" />
        <circle
          cx="100" cy="100" r="88" fill="none" stroke="#FFCD00" strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 88 * 0.69} ${2 * Math.PI * 88 * 0.31}`}
          strokeDashoffset={2 * Math.PI * 88 * 0.25}
          className="drop-shadow-sm"
        />
        <text x="100" y="92" textAnchor="middle" className="fill-ti-navy" fontSize="52" fontWeight="bold">69</text>
        <text x="100" y="116" textAnchor="middle" className="fill-ti-gray" fontSize="14">out of 100</text>
      </svg>
      <div className="absolute -bottom-2 bg-white rounded-full px-4 py-1 shadow-md border border-gray-100">
        <span className="text-sm font-medium text-ti-navy">Belgium CPI 2023</span>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center hover:shadow-md transition-shadow">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-ti-navy/5 mb-5">{icon}</div>
      <h3 className="text-xl font-bold text-ti-navy mb-3">{title}</h3>
      <p className="text-ti-gray leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({ step, title, description }: { step: number; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-full bg-ti-yellow flex items-center justify-center mb-4 shadow-sm">
        <span className="text-xl font-bold text-ti-navy">{step}</span>
      </div>
      <h3 className="text-lg font-bold text-ti-navy mb-2">{title}</h3>
      <p className="text-ti-gray leading-relaxed">{description}</p>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-ti-bg">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-ti-navy rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TI</span>
            </div>
            <span className="font-bold text-ti-navy text-lg hidden sm:block">Integrity Assessment</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-sm font-medium text-ti-navy hover:text-ti-accent transition-colors">Sign In</Link>
            <Link href="/assessment" className="rounded-lg bg-ti-yellow px-5 py-2 text-sm font-semibold text-ti-navy shadow-sm hover:bg-yellow-400 transition-colors">Start Assessment</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ti-navy/[0.03] via-transparent to-ti-yellow/[0.05]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-ti-navy leading-tight">
                How Integrity-Ready Is Your Organisation?
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-ti-gray leading-relaxed max-w-xl">
                A confidential self-assessment for Belgian organisations. Evaluate your integrity policies and practices, benchmarked against EU Corruption Perceptions Index data.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/assessment" className="inline-flex items-center justify-center rounded-lg bg-ti-yellow px-8 py-3.5 text-lg font-semibold text-ti-navy shadow-sm hover:bg-yellow-400 transition-colors">
                  Start Your Assessment
                  <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                </Link>
                <a href="#features" className="inline-flex items-center justify-center rounded-lg border-2 border-ti-navy/20 px-8 py-3.5 text-lg font-semibold text-ti-navy hover:border-ti-navy/40 hover:bg-white transition-colors">
                  Learn More
                </a>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-ti-gray">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-score-green" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                  <span>Confidential</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-ti-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>~15 minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-ti-yellow" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
                  <span>30 questions</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="bg-white rounded-2xl shadow-lg p-10 border border-gray-100">
                <p className="text-sm text-ti-gray uppercase tracking-widest text-center mb-6">National Benchmark</p>
                <CPIScoreCircle />
                <p className="text-sm text-ti-gray text-center mt-8 max-w-[240px] mx-auto leading-relaxed">
                  Belgium scores 69/100 on the Corruption Perceptions Index. How does your organisation compare?
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="scroll-mt-20 py-20 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-ti-navy">What You Get</h2>
            <p className="mt-4 text-lg text-ti-gray max-w-2xl mx-auto">A thorough, research-backed assessment designed to give your organisation clear and actionable insights.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<svg className="w-7 h-7 text-ti-navy" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>}
              title="Comprehensive Assessment"
              description="30 questions across 6 integrity dimensions covering leadership, policies, culture, risk management, reporting, and compliance."
            />
            <FeatureCard
              icon={<svg className="w-7 h-7 text-ti-navy" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>}
              title="EU Benchmarking"
              description="Compare your integrity score against Belgium&apos;s CPI ranking and see how you measure up across all 27 EU member states."
            />
            <FeatureCard
              icon={<svg className="w-7 h-7 text-ti-navy" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>}
              title="Actionable Recommendations"
              description="Receive a tailored action plan with concrete steps to strengthen your organisation&apos;s integrity framework and practices."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-ti-navy">How It Works</h2>
            <p className="mt-4 text-lg text-ti-gray max-w-2xl mx-auto">Three simple steps to assess your organisation&apos;s integrity readiness.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 md:gap-8">
            <StepCard step={1} title="Register Your Organisation" description="Create a confidential account with basic information about your organisation. Your data stays private." />
            <StepCard step={2} title="Answer 30 Questions" description="Complete the self-assessment across six integrity dimensions. It takes approximately 15 minutes." />
            <StepCard step={3} title="Receive Your Score & Plan" description="Get your integrity score, EU benchmarking comparison, and a personalised action plan for improvement." />
          </div>
          <div className="text-center mt-14">
            <Link href="/assessment" className="inline-flex items-center justify-center rounded-lg bg-ti-yellow px-8 py-3.5 text-lg font-semibold text-ti-navy shadow-sm hover:bg-yellow-400 transition-colors">
              Begin Your Assessment
              <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-ti-navy mb-6">
              <span className="text-white font-bold text-xl">TI</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-ti-navy mb-6">About This Tool</h2>
            <p className="text-lg text-ti-gray leading-relaxed mb-4">
              This self-assessment tool is developed by{' '}
              <strong className="text-ti-navy">Transparency International Belgium</strong>, part of the global coalition against corruption. We believe that integrity is the foundation of a fair and just society.
            </p>
            <p className="text-lg text-ti-gray leading-relaxed mb-8">
              By measuring integrity across key dimensions, organisations can identify strengths, address weaknesses, and build a culture of transparency and accountability. The tool is grounded in EU policy frameworks and benchmarked against the Corruption Perceptions Index.
            </p>
            <a href="https://transparencybelgium.be" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-ti-accent font-semibold hover:underline transition-colors">
              Visit Transparency International Belgium
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ti-navy text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-ti-yellow rounded-lg flex items-center justify-center">
                  <span className="text-ti-navy font-bold text-sm">TI</span>
                </div>
                <span className="font-bold text-lg">Integrity Assessment</span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">A self-assessment tool by Transparency International Belgium to help organisations evaluate and strengthen their integrity practices.</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-white/90">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/assessment" className="text-sm text-white/70 hover:text-white transition-colors">Start Assessment</Link></li>
                <li><Link href="/auth/login" className="text-sm text-white/70 hover:text-white transition-colors">Sign In</Link></li>
                <li><Link href="/auth/register" className="text-sm text-white/70 hover:text-white transition-colors">Register</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-white/90">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-sm text-white/70 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-sm text-white/70 hover:text-white transition-colors">Terms of Use</Link></li>
                <li><a href="https://transparencybelgium.be" target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-white/10 text-center text-sm text-white/50">
            &copy; {new Date().getFullYear()} Transparency International Belgium. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
