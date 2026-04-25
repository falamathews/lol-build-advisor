import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import WaitingScreen from './components/WaitingScreen'
import LoadingScreen from './components/LoadingScreen'
import ChampionList from './components/ChampionList'
import BuildRecommendation from './components/BuildRecommendation'
import './index.css'

const POLL_INTERVAL = 5000

const C = {
  gold: '#C8A964',
  goldLight: '#F0E6D3',
  goldBorder: '#785A28',
}

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
    } catch { /* backend offline */ }
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
  if (phase === 'loading') return (
    <LoadingScreen
      key="loading"
      champion={gameData?.my_champion}
      championIcon={gameData?.my_champion_icon}
    />
  )

  if (phase === 'error') {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: '100vh', gap: 16,
        padding: '0 24px', textAlign: 'center',
        animation: 'fadeScreen 0.4s ease',
      }}>
        <p style={{ fontSize: 17, fontWeight: 600, color: '#e74c3c' }}>{error?.text}</p>
        {error?.hint && (
          <p style={{ fontSize: 13, color: '#8a9bb5', maxWidth: 360 }}>{error.hint}</p>
        )}
        <button onClick={handleReset} style={{
          marginTop: 8, padding: '10px 32px',
          fontFamily: 'Cinzel, serif', fontSize: 11, letterSpacing: '0.18em',
          color: C.gold, background: 'rgba(120,90,40,0.2)',
          border: `1px solid ${C.goldBorder}`, cursor: 'pointer',
          textTransform: 'uppercase', transition: 'all 0.2s',
        }}>
          Tentar novamente
        </button>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A1428', padding: '24px 32px 48px', animation: 'fadeScreen 0.4s ease' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 28, paddingBottom: 16,
        borderBottom: '1px solid rgba(120,90,40,0.25)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
            <polygon points="24,4 44,14 44,34 24,44 4,34 4,14" stroke={C.gold} strokeWidth="1.5" fill="none" opacity="0.7"/>
            <circle cx="24" cy="24" r="5" fill={C.gold} opacity="0.9"/>
          </svg>
          <div>
            <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: 20, fontWeight: 700, color: C.goldLight, letterSpacing: '0.12em' }}>
              BUILD ADVISOR
            </h1>
            <p style={{ fontSize: 10, color: C.gold, opacity: 0.6, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              {gameData?.my_champion}
            </p>
          </div>
        </div>
        <button onClick={handleReset} style={{
          fontFamily: 'Cinzel, serif', fontSize: 10, letterSpacing: '0.18em',
          color: '#4a6580', background: 'transparent',
          border: '1px solid rgba(74,101,128,0.3)', padding: '8px 16px',
          cursor: 'pointer', textTransform: 'uppercase', transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.color = C.gold; e.currentTarget.style.borderColor = C.goldBorder }}
          onMouseLeave={e => { e.currentTarget.style.color = '#4a6580'; e.currentTarget.style.borderColor = 'rgba(74,101,128,0.3)' }}
        >
          ↩ Nova Partida
        </button>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }}>
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
    </div>
  )
}
