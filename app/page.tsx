'use client'
import { useEffect, useState } from 'react'

const SUPA_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ''
const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''

export default function PortalPage() {
  const [dark, setDark] = useState(true)
  const [services, setServices] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('all')

  useEffect(() => {
    const t = localStorage.getItem('its-r-theme')
    const isDark = t !== 'light'
    setDark(isDark)
    if (!isDark) document.documentElement.setAttribute('data-theme', 'light')

    async function load() {
      const all: any[] = []
      let offset = 0
      while(true) {
        const r = await fetch(`${SUPA_URL}/rest/v1/its_r_services?select=id,name,slug,status,category,description&status=eq.live&limit=1000&offset=${offset}&order=name.asc`, {
          headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` }
        })
        const d = await r.json()
        if(!Array.isArray(d)||!d.length) break
        all.push(...d)
        if(d.length<1000) break
        offset+=1000
      }
      setServices(all)
    }
    load()
  }, [])

  const toggleTheme = () => {
    const next = !dark; setDark(next)
    if (next) { document.documentElement.removeAttribute('data-theme'); localStorage.setItem('its-r-theme','dark') }
    else { document.documentElement.setAttribute('data-theme','light'); localStorage.setItem('its-r-theme','light') }
  }

  const cats = ['all', ...Array.from(new Set(services.map(s => s.category).filter(Boolean)))]
  const filtered = services.filter(s =>
    (cat === 'all' || s.category === cat) &&
    (!search || s.name.toLowerCase().includes(search.toLowerCase()))
  )

  const sc: Record<string,string> = { live:'#22c55e', down:'#ef4444', coming_soon:'#f59e0b', planned:'#6366f1' }

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',color:'var(--text)',fontFamily:'system-ui,sans-serif'}}>
      <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1rem 2rem',borderBottom:'1px solid var(--border)',position:'sticky',top:0,background:'var(--bg)',zIndex:10}}>
        <span style={{fontWeight:800,fontSize:'1.2rem'}}><span style={{color:'var(--gold)'}}>ITS-R</span> Portal</span>
        <div style={{display:'flex',gap:'0.75rem',alignItems:'center'}}>
          <a href="https://its-r-passport.vercel.app/login" style={{background:'var(--gold)',color:'#000',padding:'0.4rem 1rem',borderRadius:'0.5rem',fontSize:'0.8rem',fontWeight:700,textDecoration:'none'}}>
            🛂 Sign In
          </a>
          <button onClick={toggleTheme} style={{background:'var(--card)',border:'1px solid var(--border)',color:'var(--text)',padding:'0.4rem 0.75rem',borderRadius:'0.5rem',cursor:'pointer',fontSize:'0.8rem'}}>
            {dark?'☀️':'🌙'}
          </button>
        </div>
      </nav>

      <div style={{maxWidth:'1400px',margin:'0 auto',padding:'2rem'}}>
        <div style={{textAlign:'center',marginBottom:'2.5rem'}}>
          <h1 style={{fontSize:'2.5rem',fontWeight:800,marginBottom:'0.5rem'}}>
            <span style={{color:'var(--gold)'}}>ITS-R</span> Universe
          </h1>
          <p style={{color:'var(--sub)'}}>2,213 services • One universe</p>
        </div>

        <div style={{display:'flex',gap:'0.75rem',marginBottom:'1.5rem',flexWrap:'wrap'}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search services..." style={{flex:1,minWidth:200,padding:'0.625rem 1rem',background:'var(--card)',border:'1px solid var(--border)',borderRadius:'0.5rem',color:'var(--text)',fontSize:'0.875rem',outline:'none'}} />
          <select value={cat} onChange={e=>setCat(e.target.value)} style={{padding:'0.625rem 1rem',background:'var(--card)',border:'1px solid var(--border)',borderRadius:'0.5rem',color:'var(--text)',fontSize:'0.875rem',outline:'none'}}>
            {cats.map(c=><option key={c} value={c}>{c==='all'?'All Categories':c}</option>)}
          </select>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:'0.75rem'}}>
          {filtered.map(s=>(
            <a key={s.id} href={`https://its-r-${s.slug}.vercel.app`} target="_blank" rel="noopener" style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'0.625rem',padding:'1rem',display:'flex',flexDirection:'column',gap:'0.5rem',textDecoration:'none',color:'var(--text)',transition:'border-color 0.15s'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                <span style={{fontWeight:600,fontSize:'0.875rem'}}>{s.name}</span>
                <span style={{width:8,height:8,borderRadius:'50%',background:sc[s.status]||'#888',flexShrink:0,marginTop:3}}/>
              </div>
              {s.category && <span style={{fontSize:'0.7rem',color:'var(--sub)',background:'var(--border)',padding:'0.15rem 0.5rem',borderRadius:'999px',alignSelf:'flex-start'}}>{s.category}</span>}
            </a>
          ))}
        </div>

        {!filtered.length && (
          <div style={{textAlign:'center',padding:'4rem',color:'var(--sub)'}}>
            {services.length === 0 ? 'Loading services...' : 'No live services found'}
          </div>
        )}
      </div>

      <footer style={{textAlign:'center',padding:'2rem',borderTop:'1px solid var(--border)',color:'var(--sub)',fontSize:'0.75rem',marginTop:'3rem'}}>
        ITS-R Universe • In loving memory of Roshan Ali Sahab 🤲
      </footer>
    </div>
  )
}
