import { useState, useEffect } from 'react'

const C = {
  gold: '#C8A964',
  goldLight: '#F0E6D3',
  goldBorder: '#785A28',
}

export default function LoadingScreen({ champion, championIcon }) {
  const [slow, setSlow] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setSlow(true), 20000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      animation: 'fadeScreen 0.4s ease',
    }}>
      {/* Fundo */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(ellipse 80% 60% at 60% 40%, rgba(160,80,20,0.35) 0%, transparent 70%),
          linear-gradient(160deg, #1a0f06 0%, #0d1520 50%, #0A1428 100%)
        `,
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, transparent 20%, rgba(10,20,40,0.8) 70%, #0A1428 100%)',
        pointerEvents: 'none', zIndex: 1,
      }} />

      {/* Conteúdo */}
      <div style={{
        position: 'relative', zIndex: 2,
        textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
      }}>
        <p style={{
          fontFamily: 'Cinzel, serif', fontSize: 12, letterSpacing: '0.3em',
          color: C.gold, opacity: 0.7, textTransform: 'uppercase',
        }}>
          Campeão Detectado
        </p>

        {/* Portrait do campeão */}
        <div style={{ position: 'relative', width: 96, height: 96, animation: 'scaleIn 0.5s ease' }}>
          <div style={{
            position: 'absolute', inset: -4,
            border: `2px solid ${C.gold}`,
            animation: 'borderGlow 2s ease-in-out infinite',
          }} />
          {championIcon && (
            <img
              src={championIcon}
              alt={champion}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={e => { e.target.style.display = 'none' }}
            />
          )}
        </div>

        <h2 style={{
          fontFamily: 'Cinzel, serif', fontSize: 32, fontWeight: 700,
          letterSpacing: '0.1em', color: C.goldLight,
          textShadow: '0 0 24px rgba(200,169,100,0.6)',
          animation: 'slideUp 0.5s ease',
        }}>
          {champion?.toUpperCase()}
        </h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ height: 1, width: 60, background: `linear-gradient(to right, transparent, ${C.goldBorder})` }} />
          <p style={{ fontFamily: 'Cinzel, serif', fontSize: 11, color: C.gold, opacity: 0.65, letterSpacing: '0.2em' }}>
            CALCULANDO BUILD
          </p>
          <div style={{ height: 1, width: 60, background: `linear-gradient(to left, transparent, ${C.goldBorder})` }} />
        </div>

        {/* 5 pontos em cascata */}
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} style={{
              width: 10, height: 10, borderRadius: '50%',
              background: C.gold,
              animation: `pulse5 1.6s ease-in-out ${i * 0.18}s infinite`,
            }} />
          ))}
        </div>

        <p style={{ fontSize: 13, color: '#8a9bb5', letterSpacing: '0.06em' }}>
          Analisando composição inimiga...
        </p>

        {slow && (
          <div style={{
            marginTop: 8, padding: '10px 20px',
            background: 'rgba(139,32,32,0.15)', border: '1px solid rgba(192,57,43,0.3)',
            animation: 'fadeIn 0.4s ease',
          }}>
            <p style={{ fontSize: 12, color: '#e07070', letterSpacing: '0.05em' }}>
              ⚠ Demorando mais que o normal...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
