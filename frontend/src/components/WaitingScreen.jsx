import DingerLogo from './DingerLogo'

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
      {/* Fundo fallback caso a imagem não carregue */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: '#0A1428' }} />

      {/* Heimerdinger — fundo completo */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <img
          src="/heimerdinger-bg.png"
          alt="Heimerdinger"
          draggable="false"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center', userSelect: 'none', pointerEvents: 'none' }}
        />
      </div>

      {/* Overlay escuro sobre a imagem inteira */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        background: 'linear-gradient(to bottom, rgba(10,20,40,0.45) 0%, rgba(10,20,40,0.55) 40%, rgba(10,20,40,0.82) 70%, #0A1428 100%)',
        pointerEvents: 'none',
      }} />

      {/* Conteúdo */}
      <div style={{
        position: 'relative', zIndex: 3,
        textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
      }}>
        {/* Logo DINGER */}
        <DingerLogo width={320} uid="waiting" />

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
