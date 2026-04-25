import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import WaitingScreen from './components/WaitingScreen'
import LoadingScreen from './components/LoadingScreen'
import ChampionList from './components/ChampionList'
import BuildRecommendation from './components/BuildRecommendation'
import './index.css'

const POLL_INTERVAL = 5000

const ERROR_MESSAGES = {
  GEMINI_KEY_INVALID: {
    text: 'Sua Gemini API Key é inválida ou expirou.',
    hint: 'Obtenha uma nova em aistudio.google.com e atualize o arquivo .env.',
  },
  GEMINI_TIMEOUT: {
    text: 'O Gemini demorou demais para responder.',
    hint: 'Tente novamente em alguns segundos.',
  },
  DEFAULT: {
    text: 'Erro ao gerar a recomendação de build.',
    hint: 'Verifique se o backend está rodando e tente novamente.',
  },
}

function parseError(err) {
  const detail = err.response?.data?.detail || ''
  if (detail.includes('GEMINI_KEY_INVALID')) return ERROR_MESSAGES.GEMINI_KEY_INVALID
  if (detail.includes('GEMINI_TIMEOUT')) return ERROR_MESSAGES.GEMINI_TIMEOUT
  return ERROR_MESSAGES.DEFAULT
}

export default function App() {
  const [phase, setPhase] = useState('waiting')
  const [gameData, setGameData] = useState(null)
  const [buildData, setBuildData] = useState(null)
  const [error, setError] = useState(null)
  const pollingRef = useRef(null)
  const loadingCheckRef = useRef(null)

  useEffect(() => {
    startPolling()
    return () => {
      clearInterval(pollingRef.current)
      clearInterval(loadingCheckRef.current)
    }
  }, [])

  function startPolling() {
    checkGameStatus()
    pollingRef.current = setInterval(checkGameStatus, POLL_INTERVAL)
  }

  async function checkGameStatus() {
    try {
      const { data } = await axios.get('/api/game/status')
      if (data.status === 'active') {
        clearInterval(pollingRef.current)
        setGameData(data)
        setPhase('loading')
        fetchBuild(data)
        watchForDisconnect()
      }
    } catch {
      // backend offline — continua tentando silenciosamente
    }
  }

  function watchForDisconnect() {
    loadingCheckRef.current = setInterval(async () => {
      try {
        const { data } = await axios.get('/api/game/status')
        if (data.status === 'waiting') {
          clearInterval(loadingCheckRef.current)
          handleReset()
        }
      } catch { /* ignora */ }
    }, POLL_INTERVAL)
  }

  async function fetchBuild(data) {
    try {
      const { data: build } = await axios.post('/api/build/recommend', {
        my_champion: data.my_champion,
        allies: data.allies,
        enemies: data.enemies,
      })
      clearInterval(loadingCheckRef.current)
      setBuildData(build)
      setPhase('result')
    } catch (err) {
      clearInterval(loadingCheckRef.current)
      setError(parseError(err))
      setPhase('error')
    }
  }

  function handleReset() {
    setBuildData(null)
    setGameData(null)
    setError(null)
    setPhase('waiting')
    clearInterval(loadingCheckRef.current)
    startPolling()
  }

  if (phase === 'waiting') return <WaitingScreen key="waiting" />
  if (phase === 'loading') return <LoadingScreen key="loading" champion={gameData?.my_champion} />

  if (phase === 'error') {
    return (
      <div className="fade-in flex flex-col items-center justify-center min-h-screen gap-4 px-4 text-center">
        <p className="text-lg font-semibold" style={{ color: '#e74c3c' }}>{error?.text}</p>
        {error?.hint && (
          <p className="text-sm max-w-sm" style={{ color: 'var(--gold-light)', opacity: 0.55 }}>{error.hint}</p>
        )}
        <button
          onClick={handleReset}
          className="mt-2 px-6 py-2 rounded text-sm font-semibold cursor-pointer"
          style={{ background: 'var(--border-gold)', color: 'var(--gold)' }}
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  return (
    <div className="fade-in max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1
          className="text-xl sm:text-2xl font-bold tracking-widest"
          style={{ color: 'var(--gold)', fontFamily: 'Cinzel, serif' }}
        >
          LoL Build Advisor
        </h1>
        <button
          onClick={handleReset}
          className="text-xs px-3 py-1.5 rounded cursor-pointer"
          style={{ border: '1px solid var(--border-gold)', color: 'var(--gold-light)', opacity: 0.6 }}
        >
          Nova partida
        </button>
      </div>

      <ChampionList
        myChampion={gameData.my_champion}
        allies={gameData.allies}
        enemies={gameData.enemies}
        myChampionIcon={gameData.my_champion_icon}
        alliesIcons={gameData.allies_icons}
        enemiesIcons={gameData.enemies_icons}
      />

      <BuildRecommendation data={buildData} />
    </div>
  )
}
