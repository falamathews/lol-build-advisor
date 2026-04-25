import { useState, useEffect } from 'react'
import ItemCard, { InventorySlot } from './ItemCard'

const C = {
  gold: '#C8A964',
  goldLight: '#F0E6D3',
  goldBorder: '#785A28',
}

function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 3, height: 16, background: C.gold }} />
        <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: 13, letterSpacing: '0.18em', color: C.goldLight, textTransform: 'uppercase' }}>
          {title}
        </h3>
        {subtitle && <span style={{ fontSize: 11, color: '#4a6580', letterSpacing: '0.06em' }}>— {subtitle}</span>}
      </div>
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
        padding: '16px 18px',
        background: 'rgba(7,21,35,0.7)', backdropFilter: 'blur(8px)',
        border: '1px solid rgba(120,90,40,0.3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0 }}>
          {ordered.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: 'rgba(120,90,40,0.3)', border: `1px solid ${C.gold}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Cinzel, serif', fontSize: 10, color: C.gold,
                }}>
                  {i + 1}
                </div>
                <div style={{ width: 50, height: 50, border: `1px solid ${C.goldBorder}`, overflow: 'hidden' }}>
                  {item.icon
                    ? <img src={item.icon} alt={item.item} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', background: '#1a2a40' }} />
                  }
                </div>
                <span style={{ fontSize: 9, color: '#4a6580', maxWidth: 55, textAlign: 'center', lineHeight: 1.3 }}>
                  {item.item?.split(' ').slice(0, 2).join(' ')}
                </span>
              </div>
              {i < ordered.length - 1 && (
                <div style={{
                  alignSelf: 'center', marginBottom: 16,
                  width: 20, height: 1,
                  background: `linear-gradient(to right, ${C.goldBorder}, transparent)`,
                  opacity: 0.5, flexShrink: 0,
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
  const { champion, patch, composition_analysis, build, buy_order } = data
  const [viewMode, setViewMode] = useState('inventory')
  const [visibleSlots, setVisibleSlots] = useState([])

  useEffect(() => {
    build.forEach((_, i) => {
      setTimeout(() => setVisibleSlots(prev => [...prev, i]), 200 + i * 110)
    })
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* Build Section */}
      <div style={{ animation: 'slideUp 0.4s ease 0.1s both' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 3, height: 16, background: C.gold }} />
            <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: 13, letterSpacing: '0.18em', color: C.goldLight, textTransform: 'uppercase' }}>
              Build Recomendada
            </h3>
            <span style={{ fontSize: 11, color: '#4a6580', letterSpacing: '0.06em' }}>— Patch {patch}</span>
          </div>
          {/* Toggle */}
          <div style={{ display: 'flex', border: `1px solid ${C.goldBorder}`, overflow: 'hidden' }}>
            {[['inventory', 'Inventário'], ['list', 'Lista']].map(([v, label]) => (
              <button key={v} onClick={() => setViewMode(v)} style={{
                padding: '6px 16px', fontFamily: 'Cinzel, serif', fontSize: 10, letterSpacing: '0.12em',
                background: viewMode === v ? 'rgba(120,90,40,0.4)' : 'transparent',
                color: viewMode === v ? C.gold : '#4a6580',
                border: 'none', cursor: 'pointer', textTransform: 'uppercase', transition: 'all 0.2s',
              }}>{label}</button>
            ))}
          </div>
        </div>

        {/* Inventário */}
        {viewMode === 'inventory' && (
          <div style={{
            padding: '20px 24px',
            background: 'rgba(7,21,35,0.8)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(120,90,40,0.3)',
          }}>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              {build.map((item, i) => (
                <InventorySlot key={item.slot} item={item} visible={visibleSlots.includes(i)} />
              ))}
            </div>
            <p style={{ textAlign: 'center', marginTop: 12, fontSize: 10, color: '#4a6580', letterSpacing: '0.08em' }}>
              Passe o mouse sobre os itens para ver detalhes
            </p>
          </div>
        )}

        {/* Lista */}
        {viewMode === 'list' && (
          <div>
            {build.map((item, i) => (
              <ItemCard key={item.slot} {...item} />
            ))}
          </div>
        )}
      </div>

      {/* Análise da Composição */}
      <div style={{ animation: 'slideUp 0.4s ease 0.2s both' }}>
        <SectionHeader title="Análise da Composição" />
        <div style={{
          padding: '16px 20px',
          background: 'rgba(7,21,35,0.7)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(120,90,40,0.3)',
          borderLeft: `3px solid ${C.gold}`,
        }}>
          <p style={{ fontSize: 13.5, color: '#b8cad8', lineHeight: 1.75, letterSpacing: '0.02em' }}>
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
