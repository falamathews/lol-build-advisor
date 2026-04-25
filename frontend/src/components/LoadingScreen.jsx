import { useState, useEffect } from 'react'

export default function LoadingScreen({ champion }) {
  const [slow, setSlow] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setSlow(true), 20000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="fade-in flex flex-col items-center justify-center min-h-screen gap-6 px-4">
      <h1
        className="text-2xl sm:text-3xl font-bold tracking-widest text-center"
        style={{ color: 'var(--gold)', fontFamily: 'Cinzel, serif' }}
      >
        Partida Detectada
      </h1>
      <p style={{ color: 'var(--gold-light)', opacity: 0.7 }} className="text-center">
        Gerando build para <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{champion}</span>...
      </p>
      <div className="flex gap-2">
        {[0, 1, 2, 3, 4].map(i => (
          <span
            key={i}
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: 'var(--gold)', animation: `pulse 1.4s ease-in-out ${i * 0.15}s infinite` }}
          />
        ))}
      </div>
      {slow && (
        <p
          className="text-xs text-center max-w-xs fade-in"
          style={{ color: 'var(--gold-light)', opacity: 0.45 }}
        >
          O Gemini está demorando mais que o normal. Aguarde mais um momento...
        </p>
      )}
    </div>
  )
}
