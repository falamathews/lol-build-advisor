const C = {
  gold: '#C8A964',
  goldLight: '#F0E6D3',
  goldBorder: '#785A28',
  red: '#C0392B',
}

function ChampionCard({ name, icon, isPlayer = false, isAlly = true }) {
  const size = isPlayer ? 64 : 52
  const borderColor = isAlly ? (isPlayer ? C.gold : C.goldBorder) : C.red
  const glow = isPlayer ? '0 0 18px rgba(200,169,100,0.7), 0 0 36px rgba(200,169,100,0.25)' : 'none'
  const roleColor = isAlly ? C.gold : '#e07070'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, animation: 'slideUp 0.4s ease both' }}>
      <div style={{
        position: 'relative', width: size, height: size, flexShrink: 0,
        border: `${isPlayer ? 2 : 1}px solid ${borderColor}`,
        boxShadow: glow, overflow: 'hidden',
      }}>
        {icon ? (
          <img src={icon} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={e => { e.target.style.background = '#1a2a40' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#1a2a40' }} />
        )}
        {isPlayer && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(200,169,100,0.15) 0%, transparent 60%)',
            pointerEvents: 'none',
          }} />
        )}
      </div>
      <span style={{
        fontSize: 10, letterSpacing: '0.03em', textAlign: 'center',
        maxWidth: isPlayer ? 90 : 64,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        color: isPlayer ? C.gold : (isAlly ? C.goldLight : '#e07070'),
        opacity: isPlayer ? 1 : 0.8,
        fontWeight: isPlayer ? 600 : 400,
      }}>
        {name}
      </span>
      {isPlayer && (
        <span style={{
          fontSize: 9, fontFamily: 'Cinzel, serif', letterSpacing: '0.1em',
          color: roleColor, opacity: 0.6,
          background: `${roleColor}18`, padding: '1px 6px',
          border: `1px solid ${roleColor}28`,
        }}>
          VOCÊ
        </span>
      )}
    </div>
  )
}

function TeamPanel({ champions, icons = [], isAlly }) {
  const borderColor = isAlly ? C.goldBorder : 'rgba(192,57,43,0.4)'
  const headerColor = isAlly ? C.gold : '#e07070'

  return (
    <div style={{
      flex: 1, padding: '16px 20px',
      background: 'rgba(7,21,35,0.85)', backdropFilter: 'blur(10px)',
      border: `1px solid ${borderColor}`,
      animation: `slideUp 0.5s ease ${isAlly ? '0.05s' : '0.12s'} both`,
    }}>
      <p style={{
        fontFamily: 'Cinzel, serif', fontSize: 10, letterSpacing: '0.22em',
        color: headerColor, textTransform: 'uppercase', marginBottom: 14, opacity: 0.85,
      }}>
        {isAlly ? '▲ Seu Time' : '▼ Time Inimigo'}
      </p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'space-around', flexWrap: 'wrap' }}>
        {champions.map((name, i) => (
          <ChampionCard
            key={name + i}
            name={name}
            icon={icons[i]}
            isPlayer={isAlly && i === 0}
            isAlly={isAlly}
          />
        ))}
      </div>
    </div>
  )
}

export default function ChampionList({ myChampion, allies, enemies, myChampionIcon, alliesIcons = [], enemiesIcons = [] }) {
  const myTeam = [myChampion, ...allies]
  const myTeamIcons = [myChampionIcon, ...alliesIcons]

  return (
    <div style={{ animation: 'slideUp 0.4s ease 0.0s both' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ width: 3, height: 16, background: C.gold, flexShrink: 0 }} />
        <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: 12, letterSpacing: '0.2em', color: C.goldLight, textTransform: 'uppercase' }}>
          Composição da Partida
        </h3>
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <TeamPanel champions={myTeam} icons={myTeamIcons} isAlly={true} />
        <TeamPanel champions={enemies} icons={enemiesIcons} isAlly={false} />
      </div>
    </div>
  )
}
