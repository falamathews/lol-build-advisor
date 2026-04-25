import { useState } from 'react'

export default function ItemCard({ slot, item, reason, icon, patch = '16.8.1' }) {
  const [open, setOpen] = useState(false)

  const label = slot === 'boots' ? 'Botas' : `Item ${slot}`

  return (
    <div
      className="panel rounded-lg overflow-hidden cursor-pointer transition-all duration-200"
      style={{ borderColor: open ? 'var(--gold)' : 'var(--border-gold)' }}
      onClick={() => setOpen(o => !o)}
    >
      <div className="flex items-center gap-3 p-3">
        <ItemIcon name={item} icon={icon} patch={patch} />
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: 'var(--gold)', opacity: 0.6 }}>
            {label}
          </p>
          <p className="text-sm font-semibold truncate" style={{ color: 'var(--gold-light)' }}>
            {item}
          </p>
        </div>
        <span style={{ color: 'var(--gold)', opacity: 0.5 }} className="text-xs">
          {open ? '▲' : '▼'}
        </span>
      </div>

      {open && (
        <div className="px-3 pb-3 pt-0">
          <div className="h-px mb-3" style={{ background: 'var(--border-gold)', opacity: 0.4 }} />
          <p className="text-sm leading-relaxed" style={{ color: 'var(--gold-light)', opacity: 0.8 }}>
            {reason}
          </p>
        </div>
      )}
    </div>
  )
}

function ItemIcon({ name, icon }) {
  const [errored, setErrored] = useState(false)

  return (
    <div
      className="w-12 h-12 rounded shrink-0 flex items-center justify-center"
      style={{ background: 'var(--blue-mid)', border: '1px solid var(--border-gold)' }}
    >
      {icon && !errored ? (
        <img
          src={icon}
          alt={name}
          className="w-full h-full object-cover rounded"
          onError={() => setErrored(true)}
        />
      ) : (
        <span className="text-lg">⚔️</span>
      )}
    </div>
  )
}
