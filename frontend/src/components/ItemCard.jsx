import { useState, useEffect } from 'react'

const C = {
  gold: '#C8A964',
  goldLight: '#F0E6D3',
  goldBorder: '#785A28',
}

export function InventorySlot({ item, visible }) {
  const [hovered, setHovered] = useState(false)
  const [showTip, setShowTip] = useState(false)
  const isBoots = item?.slot === 'boots'

  useEffect(() => {
    if (hovered) {
      const t = setTimeout(() => setShowTip(true), 120)
      return () => clearTimeout(t)
    } else {
      setShowTip(false)
    }
  }, [hovered])

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: 64, height: 64, flexShrink: 0, cursor: 'default',
          border: `${isBoots ? 1.5 : 1}px solid ${hovered ? C.gold : (isBoots ? '#a08040' : C.goldBorder)}`,
          background: item ? 'transparent' : 'rgba(7,21,35,0.6)',
          position: 'relative',
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1)' : 'scale(0.7)',
          transition: 'opacity 0.3s ease, transform 0.3s ease, box-shadow 0.2s ease, border-color 0.2s ease',
          boxShadow: hovered
            ? '0 0 16px rgba(200,169,100,0.7), 0 0 32px rgba(200,169,100,0.3)'
            : (isBoots ? '0 0 8px rgba(200,169,100,0.2)' : 'none'),
        }}
      >
        {item?.icon ? (
          <img src={item.icon} alt={item.item} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 16, height: 16, border: '1px solid rgba(120,90,40,0.3)', transform: 'rotate(45deg)' }} />
          </div>
        )}
        {isBoots && (
          <div style={{
            position: 'absolute', bottom: 2, right: 2,
            width: 8, height: 8, background: C.gold, opacity: 0.6,
            clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
          }} />
        )}
      </div>
      <span style={{ fontSize: 9, color: isBoots ? C.gold : '#4a6580', letterSpacing: '0.06em', opacity: 0.8, textTransform: 'uppercase' }}>
        {item ? (item.slot === 'boots' ? 'Botas' : `Slot ${item.slot}`) : '—'}
      </span>

      {/* Tooltip */}
      {showTip && item && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(7,21,35,0.97)', border: `1px solid ${C.goldBorder}`,
          padding: '8px 12px', zIndex: 100,
          backdropFilter: 'blur(12px)',
          animation: 'fadeIn 0.15s ease',
          pointerEvents: 'none',
          minWidth: 160, maxWidth: 220,
        }}>
          <p style={{ fontFamily: 'Cinzel, serif', fontSize: 11, color: C.goldLight, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
            {item.item}
          </p>
          <div style={{ width: '100%', height: 1, background: C.goldBorder, opacity: 0.4, marginTop: 4 }} />
          <p style={{ fontSize: 10, color: '#8a9bb5', marginTop: 3, lineHeight: 1.5, whiteSpace: 'normal' }}>
            {item.reason?.substring(0, 90)}...
          </p>
          <div style={{
            position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%) rotate(45deg)',
            width: 8, height: 8, background: '#071523',
            borderRight: `1px solid ${C.goldBorder}`, borderBottom: `1px solid ${C.goldBorder}`,
          }} />
        </div>
      )}
    </div>
  )
}

export default function ItemCard({ slot, item, reason, icon }) {
  const [open, setOpen] = useState(false)
  const label = slot === 'boots' ? 'Botas' : `Slot ${slot}`

  return (
    <div style={{ animation: `slideUp 0.4s ease both` }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
          background: open ? 'rgba(200,169,100,0.06)' : 'rgba(7,21,35,0.4)',
          border: `1px solid ${open ? C.goldBorder : 'rgba(120,90,40,0.25)'}`,
          cursor: 'pointer', marginBottom: open ? 0 : 4,
          transition: 'background 0.2s, border 0.2s',
        }}
      >
        <div style={{ width: 44, height: 44, border: `1px solid ${C.goldBorder}`, flexShrink: 0, overflow: 'hidden' }}>
          {icon
            ? <img src={icon} alt={item} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ width: '100%', height: '100%', background: '#1a2a40' }} />
          }
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 13, color: C.goldLight, fontWeight: 500, letterSpacing: '0.03em' }}>{item}</p>
          <p style={{ fontSize: 10, color: '#4a6580', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2 }}>
            {label}
          </p>
        </div>
        <span style={{
          fontSize: 10, color: C.gold, opacity: 0.7, letterSpacing: '0.1em',
          transition: 'transform 0.2s', display: 'inline-block',
          transform: open ? 'rotate(180deg)' : 'none',
        }}>▼</span>
      </div>
      {open && (
        <div style={{
          padding: '12px 14px 14px',
          background: 'rgba(200,169,100,0.04)',
          border: `1px solid ${C.goldBorder}`,
          borderTop: 'none', marginBottom: 4,
          animation: 'fadeIn 0.2s ease',
        }}>
          <p style={{
            fontSize: 12.5, color: '#a0b4c8', lineHeight: 1.7, letterSpacing: '0.02em',
            borderLeft: `2px solid ${C.gold}`, paddingLeft: 10,
          }}>
            {reason}
          </p>
        </div>
      )}
    </div>
  )
}
