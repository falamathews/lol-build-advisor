import { useState, useEffect } from 'react'
import ItemCard, { InventorySlot } from './ItemCard'

const C = {
  gold: '#C8A964',
  goldLight: '#F0E6D3',
  goldBorder: '#785A28',
}

function SectionHeader({ title, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 3, height: 16, background: C.gold, flexShrink: 0 }} />
        <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: 12, letterSpacing: '0.2em', color: C.goldLight, textTransform: 'uppercase' }}>
          {title}
        </h3>
      </div>
      {right}
    </div>
  )
}

function PurchaseOrder({ items, buyOrder }) {
  const ordered = buyOrder
    .map(name => items.find(i => i.item?.toLowerCase() === name?.toLowerCase()))
    .filter(Boolean)

  return (
    <div style={{ animation: 'slideUp 0.5s ease 0.3s both' }}>
      <SectionHeader title="Ordem de Compra" />
      <div style={{
        padding: '20px 24px',
        background: 'rgba(7,21,35,0.75)', backdropFilter: 'blur(8px)',
        border: '1px solid rgba(120,90,40,0.3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap', gap: 0 }}>
          {ordered.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: 'rgba(120,90,40,0.3)', border: `1px solid ${C.gold}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Cinzel, serif', fontSize: 10, color: C.gold,
                }}>
                  {i + 1}
                </div>
                <div style={{ width: 56, height: 56, border: `1px solid ${C.goldBorder}`, overflow: 'hidden' }}>
                  {item.icon
                    ? <img src={item.icon} alt={item.item} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', background: '#1a2a40' }} />
                  }
                </div>
                <span style={{ fontSize: 9.5, color: '#8a9bb5', textAlign: 'center', lineHeight: 1.35, width: 68, wordBreak: 'break-word' }}>
                  {item.item}
                </span>
              </div>
              {i < ordered.length - 1 && (
                <div style={{
                  alignSelf: 'center', marginBottom: 22, marginTop: 22,
                  width: 24, height: 1, flexShrink: 0,
                  backgroundImage: `repeating-linear-gradient(to right, ${C.goldBorder} 0, ${C.goldBorder} 4px, transparent 4px, transparent 8px)`,
                  opacity: 0.6,
                }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function BuildRecommendation({ data }) {
  const { patch, composition_analysis, build, buy_order } = data
  const [viewMode, setViewMode] = useState('inventory')
  const [visibleSlots, setVisibleSlots] = useState([])

  useEffect(() => {
    if (viewMode === 'inventory') {
      setVisibleSlots([])
      build.forEach((_, i) => {
        setTimeout(() => setVisibleSlots(prev => [...prev, i]), 180 + i * 120)
      })
    }
  }, [viewMode])

  const Toggle = (
    <div style={{ display: 'flex', border: `1px solid ${C.goldBorder}`, overflow: 'hidden' }}>
      {[['inventory', 'Inventário'], ['list', 'Lista']].map(([v, label]) => (
        <button key={v} onClick={() => setViewMode(v)} style={{
          padding: '6px 18px', fontFamily: 'Cinzel, serif', fontSize: 10, letterSpacing: '0.12em',
          background: viewMode === v ? 'rgba(120,90,40,0.45)' : 'transparent',
          color: viewMode === v ? C.gold : '#4a6580',
          border: 'none', cursor: 'pointer', textTransform: 'uppercase', transition: 'all 0.2s',
        }}>{label}</button>
      ))}
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* Build Section */}
      <div style={{ animation: 'slideUp 0.4s ease 0.1s both' }}>
        <SectionHeader title="Build Recomendada" right={Toggle} />

        {viewMode === 'inventory' && (
          <div style={{
            padding: '24px 28px',
            background: 'rgba(7,21,35,0.8)', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(120,90,40,0.3)',
          }}>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              {build.map((item, i) => (
                <InventorySlot key={item.slot} item={item} visible={visibleSlots.includes(i)} />
              ))}
            </div>
            <p style={{ textAlign: 'center', marginTop: 14, fontSize: 10, color: '#3a5068', letterSpacing: '0.08em' }}>
              Passe o mouse sobre os itens para ver detalhes
            </p>
          </div>
        )}

        {viewMode === 'list' && (
          <div>
            {build.map((item, i) => (
              <ItemCard key={item.slot} {...item} delay={i * 0.04} />
            ))}
          </div>
        )}
      </div>

      {/* Análise da Composição */}
      <div style={{ animation: 'slideUp 0.4s ease 0.2s both' }}>
        <SectionHeader title="Análise da Composição" />
        <div style={{
          padding: '18px 20px',
          background: 'rgba(4,10,20,0.9)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(120,90,40,0.3)',
          borderLeft: `4px solid ${C.gold}`,
        }}>
          <p style={{ fontSize: 13.5, color: '#b8cad8', lineHeight: 1.85, letterSpacing: '0.02em' }}>
            {composition_analysis}
          </p>
        </div>
      </div>

      {/* Ordem de Compra */}
      {buy_order?.length > 0 && (
        <PurchaseOrder items={build} buyOrder={buy_order} />
      )}

    </div>
  )
}
