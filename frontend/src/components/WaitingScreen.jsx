export default function WaitingScreen() {
  return (
    <div className="fade-in flex flex-col items-center justify-center min-h-screen gap-8 px-4">
      <div className="text-center">
        <h1
          className="text-4xl sm:text-5xl font-bold tracking-widest mb-2"
          style={{ color: 'var(--gold)', fontFamily: 'Cinzel, serif' }}
        >
          LoL Build Advisor
        </h1>
        <p style={{ color: 'var(--gold-light)', opacity: 0.6 }} className="text-sm tracking-widest uppercase">
          Assistente de Build ao Vivo
        </p>
      </div>

      <div
        className="w-px self-stretch"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--border-gold), transparent)', maxHeight: 60 }}
      />

      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-2">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: 'var(--gold)', animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite` }}
            />
          ))}
        </div>
        <p style={{ color: 'var(--gold-light)' }} className="text-lg">
          Aguardando partida...
        </p>
        <p style={{ color: 'var(--gold-light)', opacity: 0.5 }} className="text-sm text-center max-w-xs">
          Abra o League of Legends e entre em uma partida. A build será gerada automaticamente.
        </p>
      </div>
    </div>
  )
}
