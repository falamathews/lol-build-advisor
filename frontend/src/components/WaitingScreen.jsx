import { useState, useEffect } from 'react'
import axios from 'axios'
import DingerLogo from './DingerLogo'

const C = {
  gold: '#C8A964',
  goldLight: '#F0E6D3',
  goldBorder: '#785A28',
}

const FEATURES = [
  { icon: '⚔', label: 'Detecção Automática', desc: 'Identifica sua partida em até 5 segundos' },
  { icon: '🧠', label: 'Build por IA',        desc: 'Gerada pelo Gemini com base na comp inimiga' },
  { icon: '📊', label: 'Patch Atual',          desc: 'Itens e dados sempre atualizados' },
]

export default function WaitingScreen() {
  const [config, setConfig] = useState({ riot_id: '—', region: 'BR1', patch: '—' })

  useEffect(() => {
    axios.get('/api/config').then(r => setConfig(r.data)).catch(() => {})
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, animation: 'fadeScreen 0.4s ease' }}>

      {/* Fundo fallback */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: '#0A1428' }} />

      {/* Heimerdinger */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <img
          src="/heimerdinger-bg.png"
          alt="Heimerdinger"
          draggable="false"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center', userSelect: 'none', pointerEvents: 'none' }}
        />
      </div>

      {/* Overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(10,20,40,0.45) 0%, rgba(10,20,40,0.5) 35%, rgba(10,20,40,0.75) 65%, #0A1428 100%)',
      }} />

      {/* Riot ID — canto superior esquerdo */}
      <div style={{
        position: 'absolute', top: 20, left: 24, zIndex: 4,
        display: 'flex', alignItems: 'center', gap: 8,
        animation: 'slideUp 0.5s ease 0.2s both',
      }}>
        <div style={{
          width: 6, height: 6, background: '#3ecf6e', borderRadius: '50%',
          boxShadow: '0 0 6px #3ecf6e',
        }} />
        <div>
          <p style={{ fontFamily: 'Cinzel, serif', fontSize: 15, color: C.gold, letterSpacing: '0.08em' }}>
            {config.riot_id}
          </p>
          <p style={{ fontSize: 11, color: '#4a6580', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 2 }}>
            {config.region}
          </p>
        </div>
      </div>

      {/* Patch — canto inferior direito */}
      <div style={{
        position: 'absolute', bottom: 24, right: 24, zIndex: 4,
        textAlign: 'right',
        animation: 'slideUp 0.5s ease 0.3s both',
      }}>
        <p style={{ fontSize: 11, color: '#4a6580', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 3 }}>
          Patch Atual
        </p>
        <p style={{ fontFamily: 'Cinzel, serif', fontSize: 16, color: C.gold, letterSpacing: '0.1em', opacity: 0.85 }}>
          {config.patch}
        </p>
      </div>

      {/* Conteúdo central */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 3,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 16, textAlign: 'center',
      }}>
        <DingerLogo width={420} uid="waiting" />

        {/* Pontos pulsando */}
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 10, height: 10, borderRadius: '50%', background: C.gold,
              animation: `pulse3 1.4s ease-in-out ${i * 0.22}s infinite`,
            }} />
          ))}
        </div>

        <p style={{ fontSize: 15, color: C.goldLight, opacity: 0.9, letterSpacing: '0.04em' }}>
          Aguardando partida...
        </p>
      </div>

      {/* Cards de funcionalidades — base da tela */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 4,
        display: 'flex', justifyContent: 'center', gap: 0,
        borderTop: '1px solid rgba(120,90,40,0.2)',
        animation: 'slideUp 0.5s ease 0.4s both',
      }}>
        {FEATURES.map((f, i) => (
          <div key={i} style={{
            flex: 1, maxWidth: 280, padding: '14px 20px',
            display: 'flex', alignItems: 'center', gap: 12,
            borderRight: i < FEATURES.length - 1 ? '1px solid rgba(120,90,40,0.2)' : 'none',
            background: 'rgba(7,21,35,0.7)',
            backdropFilter: 'blur(12px)',
          }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>{f.icon}</span>
            <div>
              <p style={{ fontFamily: 'Cinzel, serif', fontSize: 12, color: C.gold, letterSpacing: '0.1em', marginBottom: 3 }}>
                {f.label}
              </p>
              <p style={{ fontSize: 12, color: '#6a85a0', letterSpacing: '0.02em', lineHeight: 1.5 }}>
                {f.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
