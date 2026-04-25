export default function DingerLogo({ width = 320, uid = 'logo' }) {
  const height = Math.round(width / 2)
  const gId = `dg-${uid}`
  const glId = `dgl-${uid}`

  return (
    <svg viewBox="0 0 400 200" width={width} height={height} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#F0E6D3"/>
          <stop offset="50%"  stopColor="#C8A964"/>
          <stop offset="100%" stopColor="#785A28"/>
        </linearGradient>
        <filter id={glId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Linha superior + diamante */}
      <line x1="80" y1="46" x2="188" y2="46" stroke="#785A28" strokeWidth="0.8" opacity="0.6"/>
      <polygon points="200,41 206,46 200,51 194,46" fill="#C8A964" opacity="0.85"/>
      <line x1="212" y1="46" x2="320" y2="46" stroke="#785A28" strokeWidth="0.8" opacity="0.6"/>

      {/* DINGER */}
      <text x="200" y="116" textAnchor="middle"
        fontFamily="Cinzel, serif" fontSize="64" fontWeight="900"
        fill={`url(#${gId})`} letterSpacing="10" filter={`url(#${glId})`}>
        DINGER
      </text>

      {/* Linha inferior + subtítulo */}
      <line x1="60" y1="143" x2="152" y2="143" stroke="#785A28" strokeWidth="0.7" opacity="0.5"/>
      <text x="200" y="147" textAnchor="middle"
        fontFamily="Cinzel, serif" fontSize="8.5" fill="#C8A964" letterSpacing="6" opacity="0.65">
        BUILD ADVISOR
      </text>
      <line x1="248" y1="143" x2="340" y2="143" stroke="#785A28" strokeWidth="0.7" opacity="0.5"/>
    </svg>
  )
}
