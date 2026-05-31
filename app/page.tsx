'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Service {
  id: string
  name: string
  description: string
  short_description: string
  url: string
  status: 'live' | 'coming_soon' | 'planned' | 'down'
  category: string
  framework: string
  icon: string
  tags: string[]
  sort_order: number
}

interface Category {
  slug: string
  name: string
  icon: string
}

const STATUS_COLOR: Record<string, string> = {
  live: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  coming_soon: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  planned: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
  down: 'text-red-400 bg-red-500/10 border-red-500/20',
}
const STATUS_DOT: Record<string, string> = {
  live: 'bg-emerald-400',
  coming_soon: 'bg-yellow-400',
  planned: 'bg-slate-500',
  down: 'bg-red-400',
}
const STATUS_LABEL: Record<string, string> = {
  live: 'Live',
  coming_soon: 'Coming Soon',
  planned: 'Planned',
  down: 'Down',
}

const PER_PAGE = 24

export default function Home() {
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('all')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, live: 0, coming_soon: 0, planned: 0 })

  useEffect(() => {
    const load = async () => {
      const [sRes, cRes] = await Promise.all([
        supabase.from('its_r_services').select('*').order('sort_order', { ascending: true }).order('name', { ascending: true }),
        supabase.from('its_r_categories').select('slug,name,icon').order('sort_order', { ascending: true })
      ])
      if (sRes.data) {
        const d = sRes.data as Service[]
        setServices(d)
        setStats({
          total: d.length,
          live: d.filter(s => s.status === 'live').length,
          coming_soon: d.filter(s => s.status === 'coming_soon').length,
          planned: d.filter(s => s.status === 'planned').length,
        })
      }
      if (cRes.data) setCategories(cRes.data as Category[])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = services.filter(s => {
    const q = search.toLowerCase()
    const ms = !q || s.name.toLowerCase().includes(q) || (s.short_description || '').toLowerCase().includes(q) || (s.description || '').toLowerCase().includes(q) || (s.tags || []).some(t => t.toLowerCase().includes(q))
    const mc = cat === 'all' || s.category === cat
    const mst = status === 'all' || s.status === status
    return ms && mc && mst
  })

  const pages = Math.ceil(filtered.length / PER_PAGE)
  const shown = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE)

  const setFilter = (fn: () => void) => { fn(); setPage(0) }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid #1e293b', background: 'rgba(13,17,23,0.9)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1rem', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#d4af37', fontWeight: 800, fontSize: 22 }}>ITS-R</span>
            <span style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 18 }}>Universe</span>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <a href="/about" style={{ color: '#94a3b8', fontSize: 14, textDecoration: 'none' }}>About</a>
            <a href="https://its-r-passport.vercel.app" style={{ padding: '8px 18px', background: '#d4af37', color: '#000', fontWeight: 700, borderRadius: 8, fontSize: 14, textDecoration: 'none', transition: 'background 0.2s' }}>
              Sign In
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '4rem 1rem 2rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', padding: '4px 14px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 100, marginBottom: 20 }}>
          <span style={{ color: '#d4af37', fontSize: 13, fontWeight: 600 }}>Civilization-Scale Digital Infrastructure</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 800, color: '#fff', lineHeight: 1.1, marginBottom: 16 }}>
          <span style={{ color: '#d4af37' }}>ITS-R</span> Universe
        </h1>
        <p style={{ color: '#94a3b8', fontSize: 18, marginBottom: 40, maxWidth: 500, margin: '0 auto 40px' }}>
          {stats.total.toLocaleString()} services. One identity. One universe.
        </p>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, maxWidth: 640, margin: '0 auto 3rem' }}>
          {[
            { label: 'Total', val: stats.total, color: '#fff' },
            { label: 'Live', val: stats.live, color: '#34d399' },
            { label: 'Coming Soon', val: stats.coming_soon, color: '#fbbf24' },
            { label: 'Planned', val: stats.planned, color: '#64748b' },
          ].map(s => (
            <div key={s.label} style={{ background: '#0d1117', border: '1px solid #1e293b', borderRadius: 12, padding: '16px 12px' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{loading ? '—' : s.val.toLocaleString()}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <input
            value={search}
            onChange={e => setFilter(() => setSearch(e.target.value))}
            placeholder="Search services, categories, tags..."
            style={{ width: '100%', padding: '14px 20px', background: '#0d1117', border: '1px solid #1e293b', borderRadius: 12, color: '#e2e8f0', fontSize: 16, outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
            onFocus={e => (e.target.style.borderColor = '#d4af37')}
            onBlur={e => (e.target.style.borderColor = '#1e293b')}
          />
        </div>
      </section>

      {/* Filters */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1rem 1.5rem', display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
        <select
          value={cat}
          onChange={e => setFilter(() => setCat(e.target.value))}
          style={{ padding: '8px 14px', background: '#0d1117', border: '1px solid #1e293b', borderRadius: 8, color: '#e2e8f0', fontSize: 14, outline: 'none', cursor: 'pointer' }}
        >
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c.slug} value={c.slug}>{c.icon} {c.name}</option>)}
        </select>

        {(['all', 'live', 'coming_soon', 'planned'] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilter(() => setStatus(s))}
            style={{
              padding: '8px 16px', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s', border: '1px solid',
              background: status === s ? '#d4af37' : '#0d1117',
              borderColor: status === s ? '#d4af37' : '#1e293b',
              color: status === s ? '#000' : '#94a3b8',
            }}
          >
            {s === 'all' ? 'All' : STATUS_LABEL[s]}
          </button>
        ))}

        <span style={{ marginLeft: 'auto', color: '#64748b', fontSize: 14 }}>
          {filtered.length.toLocaleString()} services
        </span>
      </div>

      {/* Grid */}
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1rem 4rem' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{ background: '#0d1117', border: '1px solid #1e293b', borderRadius: 12, padding: 20, height: 120, animation: 'pulse 1.5s ease-in-out infinite' }} />
            ))}
          </div>
        ) : shown.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
            <p style={{ fontSize: 18 }}>No services found</p>
            <button onClick={() => { setSearch(''); setCat('all'); setStatus('all'); setPage(0) }} style={{ marginTop: 16, padding: '8px 20px', background: '#d4af37', color: '#000', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
              {shown.map(svc => (
                <a
                  key={svc.id}
                  href={svc.status === 'live' && svc.url ? svc.url : undefined}
                  target={svc.status === 'live' ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  style={{
                    display: 'block', background: '#0d1117', border: '1px solid #1e293b', borderRadius: 12, padding: 20,
                    textDecoration: 'none', transition: 'border-color 0.2s, transform 0.15s',
                    cursor: svc.status === 'live' ? 'pointer' : 'default',
                    opacity: svc.status === 'live' ? 1 : 0.65,
                  }}
                  onMouseEnter={e => { if (svc.status === 'live') { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,175,55,0.5)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' } }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1e293b'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <span style={{ fontSize: 26 }}>{svc.icon || '🔷'}</span>
                    <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 100, border: '1px solid', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5, ...parseColor(STATUS_COLOR[svc.status]) }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', display: 'inline-block', background: STATUS_DOT[svc.status] === 'bg-emerald-400' ? '#34d399' : STATUS_DOT[svc.status] === 'bg-yellow-400' ? '#fbbf24' : STATUS_DOT[svc.status] === 'bg-red-400' ? '#f87171' : '#64748b' }} />
                      {STATUS_LABEL[svc.status]}
                    </span>
                  </div>
                  <h3 style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 15, marginBottom: 6 }}>{svc.name}</h3>
                  <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {svc.short_description || svc.description || ''}
                  </p>
                  {svc.category && (
                    <div style={{ marginTop: 12 }}>
                      <span style={{ fontSize: 11, color: '#475569', background: '#1e293b', padding: '3px 8px', borderRadius: 4 }}>{svc.category}</span>
                    </div>
                  )}
                </a>
              ))}
            </div>

            {pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 40, alignItems: 'center' }}>
                <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                  style={{ padding: '8px 20px', background: '#0d1117', border: '1px solid #1e293b', color: '#e2e8f0', borderRadius: 8, cursor: page === 0 ? 'not-allowed' : 'pointer', opacity: page === 0 ? 0.4 : 1 }}>
                  ← Prev
                </button>
                <span style={{ color: '#64748b', fontSize: 14 }}>Page {page + 1} of {pages}</span>
                <button onClick={() => setPage(p => Math.min(pages - 1, p + 1))} disabled={page === pages - 1}
                  style={{ padding: '8px 20px', background: '#0d1117', border: '1px solid #1e293b', color: '#e2e8f0', borderRadius: 8, cursor: page === pages - 1 ? 'not-allowed' : 'pointer', opacity: page === pages - 1 ? 0.4 : 1 }}>
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #1e293b', padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#475569', fontSize: 14 }}>ITS-R Universe</p>
        <p style={{ color: '#334155', fontSize: 12, marginTop: 4 }}>In loving memory of Roshan Ali Sahab</p>
      </footer>
    </div>
  )
}

function parseColor(cls: string): React.CSSProperties {
  const map: Record<string, React.CSSProperties> = {
    'text-emerald-400 bg-emerald-500/10 border-emerald-500/20': { color: '#34d399', background: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.2)' },
    'text-yellow-400 bg-yellow-500/10 border-yellow-500/20': { color: '#fbbf24', background: 'rgba(234,179,8,0.1)', borderColor: 'rgba(234,179,8,0.2)' },
    'text-slate-400 bg-slate-500/10 border-slate-500/20': { color: '#94a3b8', background: 'rgba(100,116,139,0.1)', borderColor: 'rgba(100,116,139,0.2)' },
    'text-red-400 bg-red-500/10 border-red-500/20': { color: '#f87171', background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.2)' },
  }
  return map[cls] || {}
}
