const C = {
  gold: '#C8A964',
  goldLight: '#F0E6D3',
  goldBorder: '#785A28',
}

export default function WaitingScreen() {
  return (
    <div style={{
      position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      animation: 'fadeScreen 0.4s ease',
    }}>
      {/* Fundo com gradiente quente */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: `
          radial-gradient(ellipse 80% 60% at 60% 40%, rgba(160,80,20,0.35) 0%, transparent 70%),
          radial-gradient(ellipse 60% 80% at 40% 60%, rgba(100,40,10,0.25) 0%, transparent 70%),
          linear-gradient(160deg, #1a0f06 0%, #0d1520 50%, #0A1428 100%)
        `,
      }} />

      {/* Heimerdinger */}
      <div style={{
        position: 'absolute', right: '6%', bottom: 0,
        width: 'clamp(260px, 30vw, 420px)',
        height: 'clamp(360px, 55vh, 580px)',
        zIndex: 1,
        maskImage: 'linear-gradient(to top, transparent 0%, black 25%)',
        WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 25%)',
      }}>
        <img
          src="/heimerdinger-bg.png"
          alt="Heimerdinger"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
        />
      </div>

      {/* Overlay escuro inferior */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        background: 'linear-gradient(to bottom, transparent 30%, rgba(10,20,40,0.7) 60%, #0A1428 100%)',
        pointerEvents: 'none',
      }} />

      {/* Conteúdo */}
      <div style={{
        position: 'relative', zIndex: 3,
        textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
      }}>
        {/* Logo hexagonal */}
        <div style={{ marginBottom: 8 }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <polygon points="24,4 44,14 44,34 24,44 4,34 4,14" stroke={C.gold} strokeWidth="1.5" fill="none" opacity="0.7"/>
            <polygon points="24,10 38,18 38,30 24,38 10,30 10,18" stroke={C.gold} strokeWidth="0.8" fill="none" opacity="0.4"/>
            <circle cx="24" cy="24" r="5" fill={C.gold} opacity="0.9"/>
          </svg>
        </div>

        <h1 style={{
          fontFamily: 'Cinzel, serif', fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 700,
          letterSpacing: '0.12em', color: C.goldLight,
          textShadow: '0 0 30px rgba(200,169,100,0.5), 0 2px 4px rgba(0,0,0,0.8)',
        }}>
          BUILD ADVISOR
        </h1>

        <p style={{
          fontFamily: 'Cinzel, serif', fontSize: 13, letterSpacing: '0.25em',
          color: C.gold, opacity: 0.75, textTransform: 'uppercase',
        }}>
          Assistente de Build ao Vivo
        </p>

        {/* Divisor dourado */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, width: 280 }}>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${C.goldBorder})` }} />
          <div style={{ width: 4, height: 4, background: C.gold, transform: 'rotate(45deg)' }} />
          <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${C.goldBorder})` }} />
        </div>

        {/* Pontos pulsando */}
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 10, height: 10, borderRadius: '50%',
              background: C.gold,
              animation: `pulse3 1.4s ease-in-out ${i * 0.22}s infinite`,
            }} />
          ))}
        </div>

        <p style={{ fontSize: 15, color: C.goldLight, opacity: 0.9, marginTop: 8, letterSpacing: '0.04em' }}>
          Aguardando partida...
        </p>
        <p style={{ fontSize: 12, color: '#8a9bb5', letterSpacing: '0.05em' }}>
          Inicie uma partida para detectar automaticamente
        </p>
      </div>
    </div>
  )
}
