import { useEffect, useMemo, useState } from 'react'
import { Search, ExternalLink, Filter, Zap, Cloud, Cpu, Wrench, Building, GraduationCap, Link2, DollarSign, Mail, Lock, ArrowRight, CheckCircle, Sparkles, Users, TrendingUp, Shield } from 'lucide-react'
import type { Program } from './types'

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Cloud Infrastructure': <Cloud className="w-4 h-4" />,
  'AI / ML / GPU Compute': <Cpu className="w-4 h-4" />,
  'SaaS & Developer Tools': <Wrench className="w-4 h-4" />,
  'Banking & Finance (Startup Perks)': <DollarSign className="w-4 h-4" />,
  'Cap Table & Legal': <Building className="w-4 h-4" />,
  'HR & Payroll': <Building className="w-4 h-4" />,
  'Other Notable': <Zap className="w-4 h-4" />,
  'PRIORITY TIER 2: Accelerator Perk Programs (Massive Value)': <GraduationCap className="w-4 h-4" />,
  'Free Aggregators (Sign Up Immediately)': <Link2 className="w-4 h-4" />,
  'Paid Aggregators (High ROI)': <DollarSign className="w-4 h-4" />,
}

const CATEGORY_COLORS: Record<string, string> = {
  'Cloud Infrastructure': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'AI / ML / GPU Compute': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'SaaS & Developer Tools': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Banking & Finance (Startup Perks)': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Cap Table & Legal': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  'HR & Payroll': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  'Other Notable': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  'PRIORITY TIER 2: Accelerator Perk Programs (Massive Value)': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  'Free Aggregators (Sign Up Immediately)': 'bg-green-500/10 text-green-400 border-green-500/20',
  'Paid Aggregators (High ROI)': 'bg-pink-500/10 text-pink-400 border-pink-500/20',
}

function formatCategory(name: string): string {
  return name
    .replace('PRIORITY TIER 2: ', '')
    .replace(' (Massive Value)', '')
    .replace(' (Sign Up Immediately)', '')
    .replace(' (High ROI)', '')
    .replace(' (Startup Perks)', '')
}

function LandingPage({ onUnlock }: { onUnlock: (email: string) => void }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) return
    setStatus('submitting')

    // Send to Netlify function that creates GHL contact
    try {
      await fetch('/.netlify/functions/create-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'startup-credits-directory' }),
      })
    } catch {
      // Function may not exist in dev, that's fine
    }

    // Save to localStorage
    const emails = JSON.parse(localStorage.getItem('biznomad-emails') || '[]')
    emails.push({ email, date: new Date().toISOString() })
    localStorage.setItem('biznomad-emails', JSON.stringify(emails))

    setStatus('success')
    setTimeout(() => onUnlock(email), 800)
  }

  return (
    <div className="min-h-screen bg-ink text-cream">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-ochre to-terra flex items-center justify-center">
              <Zap className="w-5 h-5 text-ink" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">Biznomad</span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-8">
            <span className="px-3 py-1 rounded-full bg-ochre/10 border border-ochre/20 text-ochre text-xs font-semibold tracking-wide uppercase">
              Free for Founders
            </span>
            <span className="px-3 py-1 rounded-full bg-surface border border-white/5 text-cream/50 text-xs">
              Updated April 2026
            </span>
          </div>

          <h1 className="font-display font-bold text-5xl md:text-7xl tracking-tight leading-[0.95]">
            122 Startup Programs.<br />
            <span className="text-ochre">$500K–$2M+</span> in Free Credits.
          </h1>

          <p className="mt-6 text-cream/50 text-lg max-w-2xl mx-auto leading-relaxed">
            Every cloud credit, AI API grant, SaaS perk, and accelerator deal we could find.
            Curated for AI-first founders.
          </p>

          {/* Social Proof Stats */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="glass rounded-2xl p-5 text-center">
              <div className="font-display text-3xl font-bold text-ochre">122</div>
              <div className="text-cream/50 text-sm mt-1">Programs</div>
            </div>
            <div className="glass rounded-2xl p-5 text-center">
              <div className="font-display text-3xl font-bold text-ochre">$2M+</div>
              <div className="text-cream/50 text-sm mt-1">Total Value</div>
            </div>
            <div className="glass rounded-2xl p-5 text-center">
              <div className="font-display text-3xl font-bold text-ochre">27</div>
              <div className="text-cream/50 text-sm mt-1">AI/ML Deals</div>
            </div>
            <div className="glass rounded-2xl p-5 text-center">
              <div className="font-display text-3xl font-bold text-ochre">18</div>
              <div className="text-cream/50 text-sm mt-1">Cloud Providers</div>
            </div>
          </div>

          {/* What's Inside */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto text-left">
            <div className="glass rounded-2xl p-6">
              <Sparkles className="w-6 h-6 text-ochre mb-3" />
              <h3 className="font-display font-bold text-lg mb-2">AI & ML Credits</h3>
              <p className="text-cream/40 text-sm leading-relaxed">Anthropic, OpenAI, NVIDIA Inception, Together AI, Mistral, Groq, and 20+ more AI API grants.</p>
            </div>
            <div className="glass rounded-2xl p-6">
              <Cloud className="w-6 h-6 text-ochre mb-3" />
              <h3 className="font-display font-bold text-lg mb-2">Cloud Infrastructure</h3>
              <p className="text-cream/40 text-sm leading-relaxed">AWS Activate ($300K), Google Cloud ($350K), Microsoft, DigitalOcean Hatch, Oracle, and more.</p>
            </div>
            <div className="glass rounded-2xl p-6">
              <Shield className="w-6 h-6 text-ochre mb-3" />
              <h3 className="font-display font-bold text-lg mb-2">SaaS & Tools</h3>
              <p className="text-cream/40 text-sm leading-relaxed">Vercel, Notion, HubSpot, Datadog, MongoDB, Stripe alternatives, and 30+ operational tools.</p>
            </div>
          </div>

          {/* Email Gate */}
          <div className="mt-16 glass rounded-3xl p-8 md:p-12 max-w-xl mx-auto border border-ochre/20">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Lock className="w-4 h-4 text-ochre" />
              <span className="text-ochre text-sm font-semibold uppercase tracking-wide">Gated Content</span>
            </div>

            <h2 className="font-display font-bold text-2xl md:text-3xl mb-3">
              Get Instant Access
            </h2>
            <p className="text-cream/50 text-sm mb-6">
              Enter your email to unlock the full directory with search, filters, and direct application links.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/30" />
                <input
                  type="email"
                  placeholder="founder@startup.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full bg-surface border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-ochre/50 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full bg-ochre text-ink font-semibold rounded-xl py-3.5 text-sm hover:bg-ochre/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {status === 'submitting' ? (
                  'Unlocking...'
                ) : status === 'success' ? (
                  <><CheckCircle className="w-4 h-4" /> Access Granted</>
                ) : (
                  <>Unlock Directory <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            <p className="text-cream/30 text-xs mt-4">
              No spam. Unsubscribe anytime. We only email when we add new programs.
            </p>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex items-center justify-center gap-6 text-cream/30 text-sm">
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> Built by founders</span>
            <span className="flex items-center gap-1.5"><TrendingUp className="w-4 h-4" /> $500K+ saved</span>
            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4" /> Updated monthly</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-cream/20 text-xs">
            © 2026 Biznomad. Not affiliated with any provider. All links go directly to official program pages.
          </p>
        </div>
      </footer>
    </div>
  )
}

function Directory({ userEmail }: { userEmail: string }) {
  const [programs, setPrograms] = useState<Program[]>([])
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/programs.json')
      .then(r => r.json())
      .then((data: Program[]) => {
        setPrograms(data)
        setLoading(false)
      })
  }, [])

  const categories = useMemo(() => {
    const cats = Array.from(new Set(programs.map(p => p.category)))
    return ['All', ...cats]
  }, [programs])

  const filtered = useMemo(() => {
    return programs.filter(p => {
      const matchesSearch = !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.credits.toLowerCase().includes(search.toLowerCase()) ||
        p.eligibility.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [programs, search, activeCategory])

  if (loading) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <div className="text-cream/60 font-body">Loading directory...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ink text-cream">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-ochre to-terra flex items-center justify-center">
              <Zap className="w-5 h-5 text-ink" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">Biznomad</span>
            <span className="hidden sm:inline text-cream/40 text-sm">| Startup Credits</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-cream/40 hidden sm:inline">{userEmail}</span>
            <span className="px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-semibold uppercase">
              Unlocked
            </span>
          </div>
        </div>
      </nav>

      {/* Hero Mini */}
      <section className="pt-28 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight">
            Startup Credits <span className="text-ochre">Directory</span>
          </h1>
          <p className="mt-2 text-cream/50 text-base max-w-xl">
            122 programs. Search, filter by category, and apply directly.
          </p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="px-6 pb-6 sticky top-[60px] z-40 bg-ink/95 backdrop-blur-md border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/30" />
              <input
                type="text"
                placeholder="Search programs, credits, eligibility..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-surface border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-ochre/50 transition-all"
              />
            </div>
            <div className="flex items-center gap-2 text-cream/40 text-sm">
              <Filter className="w-4 h-4" />
              <span>{filtered.length} results</span>
            </div>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-ochre text-ink font-semibold'
                    : 'bg-surface border border-white/10 text-cream/60 hover:border-white/20 hover:text-cream'
                }`}
              >
                {cat === 'All' ? 'All Programs' : formatCategory(cat)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-cream/40">
              No programs match your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(program => (
                <div
                  key={program.id}
                  className="group glass rounded-2xl p-6 hover:bg-white/[0.05] transition-all duration-300 border border-white/[0.06] hover:border-white/[0.12]"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${CATEGORY_COLORS[program.category] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                      {CATEGORY_ICONS[program.category] || <Zap className="w-3 h-3" />}
                      {formatCategory(program.category)}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg leading-tight mb-2 group-hover:text-ochre transition-colors">
                    {program.name}
                  </h3>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-display text-2xl font-bold text-ochre">
                      {program.credits}
                    </span>
                  </div>

                  {program.eligibility && program.eligibility !== '-' && (
                    <p className="text-cream/40 text-xs leading-relaxed mb-4 line-clamp-2">
                      {program.eligibility}
                    </p>
                  )}

                  <a
                    href={program.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-cream/60 hover:text-ochre transition-colors"
                  >
                    Apply <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ochre to-terra flex items-center justify-center">
              <Zap className="w-4 h-4 text-ink" />
            </div>
            <span className="font-display font-bold">Biznomad</span>
          </div>
          <p className="text-cream/30 text-sm">
            Built for founders who stack leverage. 122 programs. $500K–$2M+ in value.
          </p>
          <p className="text-cream/20 text-xs">
            © 2026 Biznomad. Not affiliated with any provider.
          </p>
        </div>
      </footer>
    </div>
  )
}

function App() {
  const [unlocked, setUnlocked] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('biznomad-credits-unlocked')
    const savedEmail = localStorage.getItem('biznomad-credits-email')
    if (saved === 'true' && savedEmail) {
      setUnlocked(true)
      setUserEmail(savedEmail)
    }
  }, [])

  const handleUnlock = (email: string) => {
    localStorage.setItem('biznomad-credits-unlocked', 'true')
    localStorage.setItem('biznomad-credits-email', email)
    setUserEmail(email)
    setUnlocked(true)
  }

  return unlocked ? <Directory userEmail={userEmail} /> : <LandingPage onUnlock={handleUnlock} />
}

export default App
