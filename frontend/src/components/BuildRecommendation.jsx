import ItemCard from './ItemCard'

export default function BuildRecommendation({ data }) {
  const { champion, patch, composition_analysis, build, buy_order } = data

  const mainItems = build.filter(i => i.slot !== 'boots')
  const boots = build.find(i => i.slot === 'boots')

  return (
    <div className="flex flex-col gap-4">
      <div className="panel rounded-lg p-4">
        <h2
          className="text-lg font-bold tracking-wide mb-2"
          style={{ color: 'var(--gold)', fontFamily: 'Cinzel, serif' }}
        >
          Análise da Composição Inimiga
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--gold-light)', opacity: 0.85 }}>
          {composition_analysis}
        </p>
      </div>

      <div>
        <h2
          className="text-lg font-bold tracking-wide mb-3"
          style={{ color: 'var(--gold)', fontFamily: 'Cinzel, serif' }}
        >
          Build Recomendada para {champion}
          <span className="ml-2 text-xs font-normal opacity-50">Patch {patch}</span>
        </h2>

        <div className="flex flex-col gap-2">
          {mainItems.map(item => (
            <ItemCard key={item.slot} {...item} patch={patch} />
          ))}
          {boots && <ItemCard key="boots" {...boots} patch={patch} />}
        </div>
      </div>

      {buy_order?.length > 0 && (
        <div className="panel rounded-lg p-4">
          <h3 className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--gold)', opacity: 0.7 }}>
            Ordem de Compra Sugerida
          </h3>
          <div className="flex flex-wrap gap-2">
            {buy_order.map((item, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: 'var(--border-gold)', color: 'var(--gold)' }}
                >
                  {i + 1}
                </span>
                <span className="text-sm" style={{ color: 'var(--gold-light)', opacity: 0.8 }}>
                  {item}
                </span>
                {i < buy_order.length - 1 && (
                  <span style={{ color: 'var(--border-gold)' }}>›</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
