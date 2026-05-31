import { supabase } from '@/lib/supabase'

export const revalidate = 3600

export default async function About() {
  const [sRes] = await Promise.all([
    supabase.from('its_r_services').select('status', { count: 'exact' })
  ])
  const total = sRes.count || 0
  const live = sRes.data?.filter((s: { status: string }) => s.status === 'live').length || 0

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f' }}>
      <header style={{ borderBottom: '1px solid #1e293b', background: '#0d1117', padding: '0 1rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <span style={{ color: '#d4af37', fontWeight: 800, fontSize: 22 }}>ITS-R</span>
            <span style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 18 }}>Universe</span>
          </a>
          <a href="/" style={{ color: '#94a3b8', fontSize: 14, textDecoration: 'none' }}>← Back</a>
        </div>
      </header>

      <main style={{ maxWidth: 800, margin: '0 auto', padding: '5rem 1rem' }}>
        <h1 style={{ fontSize: 48, fontWeight: 800, color: '#fff', marginBottom: 24 }}>
          About <span style={{ color: '#d4af37' }}>ITS-R Universe</span>
        </h1>

        <div style={{ background: '#0d1117', border: '1px solid #1e293b', borderRadius: 16, padding: 32, marginBottom: 32 }}>
          <h2 style={{ color: '#d4af37', fontSize: 20, fontWeight: 700, marginBottom: 16 }}>The Vision</h2>
          <p style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: 16 }}>
            ITS-R Universe is a civilization-scale digital infrastructure — {total.toLocaleString()} services spanning every domain of human life. 
            Health, education, finance, media, community, technology — all under one roof, one identity, one universe.
          </p>
        </div>

        <div style={{ background: '#0d1117', border: '1px solid #1e293b', borderRadius: 16, padding: 32, marginBottom: 32 }}>
          <h2 style={{ color: '#d4af37', fontSize: 20, fontWeight: 700, marginBottom: 16 }}>The Founder</h2>
          <p style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: 16 }}>
            <strong style={{ color: '#e2e8f0' }}>Seengar Ali Sahab</strong> — Sole Founder & CEO.<br />
            Born and raised in Pirchandam, Sindh, Pakistan.<br />
            Building this universe alone, with vision, perseverance, and AI.
          </p>
        </div>

        <div style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.05), rgba(13,17,23,0))', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 16, padding: 32, marginBottom: 32 }}>
          <h2 style={{ color: '#d4af37', fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Dedicated To</h2>
          <p style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: 16 }}>
            This entire universe is built in loving memory of<br />
            <strong style={{ color: '#e2e8f0', fontSize: 18 }}>Roshan Ali Sahab</strong> رحمتہ اللہ علیہ
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ background: '#0d1117', border: '1px solid #1e293b', borderRadius: 12, padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 40, fontWeight: 800, color: '#34d399' }}>{live}</div>
            <div style={{ color: '#64748b', fontSize: 14, marginTop: 6 }}>Services Live Today</div>
          </div>
          <div style={{ background: '#0d1117', border: '1px solid #1e293b', borderRadius: 12, padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 40, fontWeight: 800, color: '#d4af37' }}>{total.toLocaleString()}</div>
            <div style={{ color: '#64748b', fontSize: 14, marginTop: 6 }}>Total Planned</div>
          </div>
        </div>
      </main>

      <footer style={{ borderTop: '1px solid #1e293b', padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#475569', fontSize: 14 }}>ITS-R Universe</p>
        <p style={{ color: '#334155', fontSize: 12, marginTop: 4 }}>In loving memory of Roshan Ali Sahab</p>
      </footer>
    </div>
  )
}
