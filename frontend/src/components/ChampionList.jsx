function ChampionAvatar({ name, icon, highlight = false }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-10 h-10 rounded-full overflow-hidden shrink-0"
        style={{
          border: highlight ? '2px solid var(--gold)' : '2px solid var(--border-gold)',
          boxShadow: highlight ? '0 0 8px var(--gold)' : 'none',
        }}
      >
        {icon ? (
          <img
            src={icon}
            alt={name}
            className="w-full h-full object-cover"
            onError={e => {
              e.target.style.display = 'none'
              e.target.parentElement.style.background = 'var(--blue-mid)'
            }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'var(--blue-mid)' }} />
        )}
      </div>
      <span
        className="text-sm"
        style={{ color: highlight ? 'var(--gold)' : 'var(--gold-light)', fontWeight: highlight ? 600 : 400 }}
      >
        {name}
        {highlight && (
          <span className="ml-2 text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--border-gold)', color: 'var(--gold)' }}>
            VOCÊ
          </span>
        )}
      </span>
    </div>
  )
}

export default function ChampionList({ myChampion, allies, enemies, myChampionIcon, alliesIcons = [], enemiesIcons = [] }) {
  const myTeam = [myChampion, ...allies]
  const myTeamIcons = [myChampionIcon, ...alliesIcons]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="panel rounded-lg p-4 flex flex-col gap-3">
        <h3 className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--gold)', opacity: 0.7 }}>
          Seu Time
        </h3>
        {myTeam.map((c, i) => (
          <ChampionAvatar key={c + i} name={c} icon={myTeamIcons[i]} highlight={c === myChampion} />
        ))}
      </div>

      <div className="panel rounded-lg p-4 flex flex-col gap-3">
        <h3 className="text-xs uppercase tracking-widest mb-1" style={{ color: '#e74c3c', opacity: 0.8 }}>
          Time Inimigo
        </h3>
        {enemies.map((c, i) => (
          <ChampionAvatar key={c + i} name={c} icon={enemiesIcons[i]} />
        ))}
      </div>
    </div>
  )
}
