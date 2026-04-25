const C = {
  gold: '#C8A964',
  goldLight: '#F0E6D3',
  goldBorder: '#785A28',
  redBorder: '#C0392B',
}

function ChampionCard({ name, icon, isPlayer = false, isAlly = true }) {
  const border = isAlly ? (isPlayer ? C.gold : C.goldBorder) : C.redBorder
  const glow = isPlayer ? '0 0 16px rgba(200,169,100,0.6), 0 0 32px rgba(200,169,100,0.2)' : 'none'
  const size = isPlayer ? 58 : 46

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, animation: 'slideUp 0.4s ease both' }}>
      <div style={{
        position: 'relative', width: size, height: size, flexShrink: 0,
        border: `${isPlayer ? 2 : 1}px solid ${border}`,
        boxShadow: glow,
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
        fontSize: 10, letterSpacing: '0.04em', textAlign: 'center',
        maxWidth: 62, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        color: isPlayer ? C.gold : (isAlly ? C.goldLight : '#e07070'),
        opacity: isPlayer ? 1 : 0.8,
        fontWeight: isPlayer ? 600 : 400,
      }}>
        {name}
      </span>
      {isPlayer && (
        <span style={{
          fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
          color: C.gold, opacity: 0.6,
        }}>
          VOCÊ
        </span>
      )}
    </div>
  )
}

function TeamPanel({ title, champions, icons = [], isAlly }) {
  const borderColor = isAlly ? C.goldBorder : 'rgba(192,57,43,0.4)'
  const headerColor = isAlly ? C.gold : '#e07070'

  return (
    <div style={{
      flex: 1, padding: '16px 20px',
      background: 'rgba(7,21,35,0.8)',
      backdropFilter: 'blur(8px)',
      border: `1px solid ${borderColor}`,
      animation: `slideUp 0.5s ease ${isAlly ? '0.05s' : '0.15s'} both`,
    }}>
      <p style={{
        fontFamily: 'Cinzel, serif', fontSize: 10, letterSpacing: '0.25em',
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
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{ width: 3, height: 16, background: C.gold }} />
        <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: 13, letterSpacing: '0.18em', color: '#F0E6D3', textTransform: 'uppercase' }}>
          Composição da Partida
        </h3>
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <TeamPanel title="Seu Time" champions={myTeam} icons={myTeamIcons} isAlly={true} />
        <TeamPanel title="Time Inimigo" champions={enemies} icons={enemiesIcons} isAlly={false} />
      </div>
    </div>
  )
}
