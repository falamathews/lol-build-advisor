import { useState } from 'react'

const C = {
  gold: '#C8A964',
  goldLight: '#F0E6D3',
  goldBorder: '#785A28',
}

const SLOT_COLORS = {
  boots: '#C8A964',
  1: '#8ba8c8',
  2: '#8ba8c8',
  3: '#8ba8c8',
  4: '#b08ad8',
  5: '#6ab8a0',
  6: '#c87878',
}

function slotLabel(slot) {
  if (slot === 'boots') return 'BOTAS'
  return `SLOT ${slot}`
}

export function InventorySlot({ item, visible }) {
  const [hovered, setHovered] = useState(false)
  const isBoots = item?.slot === 'boots'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, position: 'relative' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: 72, height: 72, flexShrink: 0, cursor: 'default',
          border: `${isBoots ? 2 : 1}px solid ${hovered ? C.gold : (isBoots ? '#a08040' : C.goldBorder)}`,
          background: item ? 'rgba(5,12,22,0.9)' : 'rgba(7,21,35,0.5)',
          position: 'relative',
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1)' : 'scale(0.7)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
          boxShadow: hovered ? '0 0 20px rgba(200,169,100,0.75), 0 0 40px rgba(200,169,100,0.25)' : 'none',
        }}
      >
        {item?.icon ? (
          <img src={item.icon} alt={item.item} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 18, height: 18, border: '1px solid rgba(120,90,40,0.3)', transform: 'rotate(45deg)' }} />
          </div>
        )}
        {isBoots && (
          <div style={{
            position: 'absolute', bottom: 3, right: 3,
            width: 8, height: 8, background: C.gold, opacity: 0.7,
            clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
          }} />
        )}

        {/* Tooltip */}
        {hovered && item && (
          <div style={{
            position: 'absolute', bottom: 'calc(100% + 10px)', left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(5,12,22,0.98)', border: `1px solid ${C.goldBorder}`,
            padding: '12px 14px', zIndex: 200,
            minWidth: 220, maxWidth: 260,
            backdropFilter: 'blur(14px)',
            animation: 'fadeIn 0.15s ease',
            pointerEvents: 'none',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          }}>
            <p style={{ fontFamily: 'Cinzel, serif', fontSize: 12, color: C.goldLight, letterSpacing: '0.06em', marginBottom: 6 }}>
              {item.item}
            </p>
            <div style={{ width: '100%', height: 1, background: C.goldBorder, opacity: 0.4, marginBottom: 8 }} />
            <p style={{ fontSize: 11.5, color: '#a0b4c8', lineHeight: 1.65 }}>
              {item.reason}
            </p>
            <div style={{
              position: 'absolute', bottom: -5, left: '50%',
              transform: 'translateX(-50%) rotate(45deg)',
              width: 8, height: 8, background: 'rgba(5,12,22,0.98)',
              borderRight: `1px solid ${C.goldBorder}`, borderBottom: `1px solid ${C.goldBorder}`,
            }} />
          </div>
        )}
      </div>

      {/* Item name always visible */}
      <span style={{
        fontSize: 10, color: isBoots ? C.gold : C.goldLight,
        opacity: isBoots ? 0.9 : 0.65,
        textAlign: 'center', maxWidth: 80, lineHeight: 1.3, letterSpacing: '0.02em',
      }}>
        {item?.item ?? '—'}
      </span>
      <span style={{
        fontSize: 8, fontFamily: 'Cinzel, serif', letterSpacing: '0.1em',
        color: isBoots ? C.gold : '#4a6580', opacity: 0.7, textTransform: 'uppercase',
      }}>
        {item ? slotLabel(item.slot) : ''}
      </span>
    </div>
  )
}

export default function ItemCard({ slot, item, reason, icon }) {
  const [open, setOpen] = useState(false)
  const sc = SLOT_COLORS[slot] || C.gold
  const label = slotLabel(slot)

  return (
    <div style={{ marginBottom: 4, animation: 'slideUp 0.4s ease both' }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 14, padding: '13px 16px',
          background: open ? 'rgba(200,169,100,0.07)' : 'rgba(7,21,35,0.5)',
          border: `1px solid ${open ? C.goldBorder : 'rgba(120,90,40,0.22)'}`,
          cursor: 'pointer',
          transition: 'background 0.2s, border 0.2s',
        }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.background = 'rgba(120,90,40,0.09)' }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = 'rgba(7,21,35,0.5)' }}
      >
        <div style={{ width: 52, height: 52, border: `1px solid ${C.goldBorder}`, flexShrink: 0, overflow: 'hidden' }}>
          {icon
            ? <img src={icon} alt={item} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ width: '100%', height: '100%', background: '#1a2a40' }} />
          }
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14, color: C.goldLight, fontWeight: 500, letterSpacing: '0.03em', marginBottom: 5 }}>{item}</p>
          <span style={{
            display: 'inline-block', fontSize: 9, fontFamily: 'Cinzel, serif',
            letterSpacing: '0.12em', color: sc,
            background: `${sc}18`, border: `1px solid ${sc}40`,
            padding: '2px 8px', textTransform: 'uppercase',
          }}>
            {label}
          </span>
        </div>
        <span style={{
          fontSize: 14, color: C.gold, opacity: 0.75,
          transition: 'transform 0.25s', display: 'inline-block',
          transform: open ? 'rotate(180deg)' : 'none',
        }}>▼</span>
      </div>
      {open && (
        <div style={{
          padding: '14px 16px 16px',
          background: 'rgba(200,169,100,0.04)',
          border: `1px solid ${C.goldBorder}`,
          borderTop: 'none',
          animation: 'fadeIn 0.2s ease',
        }}>
          <p style={{
            fontSize: 13, color: '#a0b4c8', lineHeight: 1.75, letterSpacing: '0.02em',
            borderLeft: `3px solid ${C.gold}`, paddingLeft: 12,
          }}>
            {reason}
          </p>
        </div>
      )}
    </div>
  )
}
