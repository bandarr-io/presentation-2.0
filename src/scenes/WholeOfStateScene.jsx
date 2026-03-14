import { motion, AnimatePresence } from 'framer-motion'
import { useState, useCallback, useRef, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faShieldHalved, faPlay, faPause, faCheck,
  faCity, faSchool, faHospital, faRoad,
  faUserShield, faBuilding, faUser, faMagnifyingGlass,
  faTriangleExclamation, faSkullCrossbones, faWandMagicSparkles,
  faLock, faRobot, faGraduationCap, faTruckMedical
} from '@fortawesome/free-solid-svg-icons'

// ─── Stage Configuration ──────────────────────────────────────────────
const stages = [
  { id: 'challenge', label: 'The Challenge' },
  { id: 'solution', label: 'Unified SOC' },
  { id: 'impact', label: 'AI-Powered Defense' },
]

// Stage durations (ms): how long each stage runs before advancing
const STAGE_DURATIONS = [8000, 9500, 10500]
const DWELL_TIME = 3000 // pause on final state before advancing

// ─── SLED Entity Data ─────────────────────────────────────────────────
const sledEntities = [
  { id: 'doe',         name: 'Dept of Education',       short: 'Edu',         type: 'state',    icon: faGraduationCap, color: '#0B64DD', security: 'siem'     },
  { id: 'dhs',         name: 'Health & Human Services', short: 'HHS',         type: 'state',    icon: faTruckMedical,  color: '#48EFCF', security: 'siem'     },
  { id: 'dot',         name: 'Dept of Transportation',  short: 'DOT',         type: 'state',    icon: faRoad,          color: '#FEC514', security: 'basic'    },
  { id: 'springfield', name: 'City of Springfield',     short: 'Springfield', type: 'city',     icon: faCity,          color: '#FF957D', security: 'basic'    },
  { id: 'riverside',   name: 'City of Riverside',       short: 'Riverside',   type: 'city',     icon: faCity,          color: '#F04E98', security: 'none'     },
  { id: 'lincoln-sd',  name: 'Lincoln School District', short: 'Lincoln SD',  type: 'school',   icon: faSchool,        color: '#48EFCF', security: 'none'     },
  { id: 'cedar-sd',    name: 'Cedar County Schools',    short: 'Cedar SD',    type: 'school',   icon: faSchool,        color: '#0B64DD', security: 'firewall' },
  { id: 'memorial',    name: 'Memorial Hospital',       short: 'Memorial',    type: 'hospital', icon: faHospital,      color: '#F04E98', security: 'none'     },
]

// ─── Role-Based Access Data ───────────────────────────────────────────
const roles = [
  { id: 'ciso',    name: 'State CISO',   access: 'Full visibility — cross-cluster search across all agencies', color: '#F04E98', icon: faUserShield },
  { id: 'agency',  name: 'Agency Admin',  access: 'Own deployment + shared threat intel & detection rules', color: '#FEC514', icon: faBuilding   },
  { id: 'analyst', name: 'Local Analyst', access: 'Local data + AI-guided workflows — force multiplier',    color: '#48EFCF', icon: faUser        },
]

// ─── Cross-Agency Incidents (Stage 2) ─────────────────────────────────
const crossAgencyIncidents = [
  {
    id: 1, title: 'Coordinated Phishing Campaign',
    summary: 'Same C2 infrastructure targeting 3 districts and 1 city simultaneously',
    agencies: ['Lincoln SD', 'Cedar SD', 'Riverside'], alertCount: 47,
    severity: 'critical', color: '#F04E98',
  },
  {
    id: 2, title: 'Supply Chain Compromise',
    summary: 'Shared vendor software update contained backdoor across 2 agencies',
    agencies: ['DOT', 'Memorial'], alertCount: 23,
    severity: 'high', color: '#FF957D',
  },
  {
    id: 3, title: 'Lateral Movement via VPN',
    summary: 'Compromised city credentials used to probe state network boundary',
    agencies: ['Springfield', 'Edu'], alertCount: 15,
    severity: 'high', color: '#0B64DD',
  },
]

// ─── Impact Metrics ───────────────────────────────────────────────────
const impactMetrics = [
  { label: 'MTTR Reduced',          value: 99,  suffix: '%', color: '#48EFCF' },
  { label: 'Alert Fatigue Down',    value: 94,  suffix: '%', color: '#0B64DD' },
  { label: 'SLED Coverage',         value: 100, suffix: '%', color: '#F04E98' },
  { label: 'Deployments Connected', value: 12,  suffix: '',  color: '#FEC514' },
]

// ─── Security Badge Colors ────────────────────────────────────────────
const securityBadgeConfig = {
  siem:     { label: 'SIEM Active',   dotColor: '#22c55e', bgColor: 'rgba(34,197,94,0.15)',  textColor: '#4ade80' },
  basic:    { label: 'Basic AV Only', dotColor: '#eab308', bgColor: 'rgba(234,179,8,0.15)',  textColor: '#facc15' },
  firewall: { label: 'Firewall Only', dotColor: '#eab308', bgColor: 'rgba(234,179,8,0.15)',  textColor: '#facc15' },
  none:     { label: 'No SIEM',       dotColor: '#ef4444', bgColor: 'rgba(239,68,68,0.15)',  textColor: '#f87171' },
}

// ─── Animated Counter ─────────────────────────────────────────────────
function AnimatedCounter({ value, suffix = '', duration = 1500 }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    let start = 0
    const increment = value / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= value) {
        setCurrent(value)
        clearInterval(timer)
      } else {
        setCurrent(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [value, duration])

  return <>{current}{suffix}</>
}

// ─── Grid positions for deployment cards ──────────────────────────────
// Two rows of 4, centered below the SOC hub
const entityPositions = sledEntities.map((entity, i) => {
  const row = i < 4 ? 0 : 1
  const col = i < 4 ? i : i - 4
  const cols = 4
  const xStart = 8
  const xSpan = 84
  const x = xStart + (col / (cols - 1)) * xSpan
  const y = row === 0 ? 38 : 62
  return { ...entity, x, y }
})


// ═══════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════

function WholeOfStateScene({ onNavigate, scenes }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const timeoutsRef = useRef([])

  // ── Core state ────────────────────────────────────────────────────
  const [stage, setStage] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  // ── Per-stage animation phases ────────────────────────────────────
  const [challengePhase, setChallengePhase] = useState('idle')
  const [solutionPhase, setSolutionPhase] = useState('idle')
  const [impactPhase, setImpactPhase] = useState('idle')
  const [floodAlerts, setFloodAlerts] = useState([])

  // ── Timeout helpers ───────────────────────────────────────────────
  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(id => clearTimeout(id))
    timeoutsRef.current = []
  }, [])

  const addTimeout = useCallback((fn, delay) => {
    const id = setTimeout(fn, delay)
    timeoutsRef.current.push(id)
    return id
  }, [])

  useEffect(() => () => clearTimeouts(), [clearTimeouts])

  const resetPhaseStates = useCallback(() => {
    clearTimeouts()
    setChallengePhase('idle')
    setSolutionPhase('idle')
    setImpactPhase('idle')
    setFloodAlerts([])
  }, [clearTimeouts])

  // ── Animation runners (no idle guard — auto-loop calls them) ──────
  const runChallenge = useCallback(() => {
    setChallengePhase('appearing')
    addTimeout(() => setChallengePhase('attacking'), 1200)
    addTimeout(() => setChallengePhase('breached'), 3000)
    addTimeout(() => setChallengePhase('spreading'), 4500)
  }, [addTimeout])

  const runSolution = useCallback(() => {
    setSolutionPhase('soc-appear')
    addTimeout(() => setSolutionPhase('deploying'), 600)
    addTimeout(() => setSolutionPhase('connecting'), 1800)
    addTimeout(() => setSolutionPhase('querying'), 3000)
    addTimeout(() => setSolutionPhase('results'), 4200)
    addTimeout(() => setSolutionPhase('roles'), 5800)
  }, [addTimeout])

  const runImpact = useCallback(() => {
    setImpactPhase('alerts-flooding')
    const alertColors = ['#F04E98', '#FF957D', '#FEC514', '#48EFCF']
    for (let i = 0; i < 24; i++) {
      addTimeout(() => {
        setFloodAlerts(prev => [...prev, {
          id: i,
          entityIndex: i % sledEntities.length,
          color: alertColors[i % alertColors.length],
        }])
      }, i * 125)
    }
    addTimeout(() => setImpactPhase('ai-triaging'), 3000)
    addTimeout(() => setImpactPhase('correlated'), 4500)
    addTimeout(() => setImpactPhase('metrics'), 6500)
  }, [addTimeout])

  // ── Auto-loop controller ──────────────────────────────────────────
  useEffect(() => {
    if (!isPlaying) return

    // Reset previous stage state
    setChallengePhase('idle')
    setSolutionPhase('idle')
    setImpactPhase('idle')
    setFloodAlerts([])

    // Start current stage animation after a short entry delay
    const startDelay = addTimeout(() => {
      if (stage === 0) runChallenge()
      else if (stage === 1) runSolution()
      else if (stage === 2) runImpact()
    }, 400)

    // Schedule advance to next stage (or loop back to SecurityScene if last stage)
    const advanceId = addTimeout(() => {
      if (stage === stages.length - 1 && onNavigate && scenes) {
        const secIdx = scenes.findIndex(s => s.id === 'security')
        if (secIdx >= 0) {
          resetPhaseStates()
          onNavigate(secIdx)
        } else {
          setStage(0)
        }
      } else {
        setStage(s => s + 1)
      }
    }, STAGE_DURATIONS[stage] + DWELL_TIME)

    return () => {
      clearTimeout(startDelay)
      clearTimeout(advanceId)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, stage])

  // ── Pause / play toggle ───────────────────────────────────────────
  const togglePlayback = useCallback(() => {
    if (isPlaying) {
      // Pausing: clear all scheduled timeouts so animations freeze
      clearTimeouts()
    }
    setIsPlaying(p => !p)
  }, [isPlaying, clearTimeouts])

  // ═══════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════
  return (
    <div className="scene !py-2">
      <div className="max-w-[98%] mx-auto w-full h-full flex flex-col">

        {/* ── Header ───────────────────────────────────────────────── */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className={`text-eyebrow text-sm block pt-8 mb-4 ${isDark ? 'text-elastic-teal' : 'text-elastic-blue'}`}>
            Whole-of-State Cyber Defense
          </span>
          <h2 className={`text-headline text-4xl md:text-5xl font-extrabold mb-4 ${isDark ? 'text-white' : 'text-elastic-dark-ink'}`}>
            One State SOC — <span className="gradient-text">Every Agency Protected</span>
          </h2>
          <p className={`text-paragraph text-lg md:text-xl max-w-3xl mx-auto pt-1 pb-8 ${isDark ? 'text-elastic-light-grey' : 'text-elastic-ink'}`}>
            Attackers target the weakest link. A unified state SOC with cross-cluster search, role-based access, and AI closes the gaps.
          </p>
        </motion.div>

        {/* ── Stage Pills ──────────────────────────────────────────── */}
        <div className="flex items-center justify-center gap-2 mb-3">
          {stages.map((s, i) => (
            <button
              key={s.id}
              onClick={() => { resetPhaseStates(); setStage(i) }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                i === stage
                  ? isDark
                    ? 'bg-elastic-teal/20 text-elastic-teal border border-elastic-teal/40'
                    : 'bg-elastic-blue/10 text-elastic-blue border border-elastic-blue/30'
                  : i < stage
                    ? isDark ? 'bg-white/10 text-white/80 border border-transparent' : 'bg-elastic-dev-blue/10 text-elastic-dev-blue/70 border border-transparent'
                    : isDark ? 'bg-white/5 text-white/50 border border-transparent' : 'bg-elastic-dev-blue/5 text-elastic-dev-blue/40 border border-transparent'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                i < stage
                  ? isDark ? 'bg-elastic-teal/30 text-elastic-teal' : 'bg-elastic-blue/20 text-elastic-blue'
                  : i === stage
                    ? isDark ? 'bg-elastic-teal/30 text-elastic-teal' : 'bg-elastic-blue/20 text-elastic-blue'
                    : isDark ? 'bg-white/10' : 'bg-elastic-dev-blue/10'
              }`}>
                {i < stage ? <FontAwesomeIcon icon={faCheck} /> : i + 1}
              </span>
              <span className="hidden md:inline">{s.label}</span>
            </button>
          ))}
        </div>

        {/* ── Main Content Area ────────────────────────────────────── */}
        <div className={`flex-1 relative overflow-hidden rounded-2xl border min-h-[520px] mx-auto w-full ${
          isDark ? 'border-white/10 bg-white/[0.01]' : 'border-elastic-dev-blue/10 bg-white/40'
        }`}>
          <AnimatePresence mode="popLayout">

            {/* ═══════════ STAGE 0: THE CHALLENGE ═══════════════════ */}
            {stage === 0 && (
              <motion.div
                key="challenge"
                className="absolute inset-0 p-5 flex flex-col"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                {/* Stage title */}
                <div className="flex items-center gap-3 mb-3">
                  <FontAwesomeIcon icon={faTriangleExclamation} className="text-lg text-elastic-pink" />
                  <div>
                    <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-elastic-dark-ink'}`}>
                      The Weakest Link Problem
                    </div>
                    <div className={`text-sm ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>
                      Under-resourced agencies lack SIEM, staff, and expertise — creating gaps attackers exploit
                    </div>
                  </div>
                </div>

                {/* Entity grid — 4 cols, 2 rows */}
                <div className="flex-1 grid grid-cols-4 grid-rows-2 gap-3 content-center">
                  {sledEntities.map((entity, i) => {
                    const badge = securityBadgeConfig[entity.security]
                    const isVulnerable = entity.security === 'none'
                    const isBreachedEntity = entity.id === 'lincoln-sd'
                    const showAttack = isVulnerable && ['attacking', 'breached', 'spreading'].includes(challengePhase)
                    const showBreach = isBreachedEntity && ['breached', 'spreading'].includes(challengePhase)

                    return (
                      <motion.div
                        key={entity.id}
                        className={`relative rounded-xl border p-3 ${
                          showBreach
                            ? 'border-elastic-pink/60'
                            : showAttack
                              ? isDark ? 'border-red-500/30' : 'border-red-400/30'
                              : isDark ? 'border-white/10 bg-white/[0.03]' : 'border-elastic-dev-blue/10 bg-white/60'
                        }`}
                        style={showBreach ? { boxShadow: '0 0 25px rgba(240,78,152,0.4)' } : {}}
                        initial={{ opacity: 0, scale: 0.85, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: i * 0.06, type: 'spring', stiffness: 300, damping: 25 }}
                      >
                        {/* Attack pulse ring */}
                        {showAttack && (
                          <motion.div
                            className="absolute -inset-1 rounded-xl border-2 border-red-500/50"
                            animate={{ scale: [1, 1.04, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.2, repeat: Infinity }}
                          />
                        )}

                        {/* Breach label */}
                        {showBreach && (
                          <motion.div
                            className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-elastic-pink/20 text-elastic-pink text-[10px] font-bold"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                          >
                            <FontAwesomeIcon icon={faSkullCrossbones} className="text-[9px]" />
                            BREACHED
                          </motion.div>
                        )}

                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: entity.color + '20' }}
                          >
                            <FontAwesomeIcon icon={entity.icon} style={{ color: entity.color }} className="text-xs" />
                          </div>
                          <div className="min-w-0">
                            <div className={`text-xs font-semibold truncate ${isDark ? 'text-white/80' : 'text-elastic-dark-ink/80'}`}>
                              {entity.name}
                            </div>
                            <div className={`text-[10px] ${isDark ? 'text-white/30' : 'text-elastic-dev-blue/30'}`}>
                              {entity.type === 'state' ? 'State Agency' : entity.type === 'city' ? 'Municipality' : entity.type === 'school' ? 'School District' : 'Healthcare'}
                            </div>
                          </div>
                        </div>

                        {/* Security posture badge */}
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold w-fit"
                          style={{ backgroundColor: badge.bgColor, color: badge.textColor }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: badge.dotColor }} />
                          {badge.label}
                        </div>

                        {/* Attack skull */}
                        {showAttack && !showBreach && (
                          <motion.div className="absolute bottom-2 right-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0.3, 0.7, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <FontAwesomeIcon icon={faSkullCrossbones} className="text-red-500/60 text-base" />
                          </motion.div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>

                {/* Summary callout */}
                <AnimatePresence>
                  {challengePhase === 'spreading' && (
                    <motion.div
                      className={`mt-3 px-5 py-3 rounded-2xl border text-center ${
                        isDark ? 'bg-elastic-pink/5 border-elastic-pink/20' : 'bg-elastic-pink/5 border-elastic-pink/15'
                      }`}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      style={{ zIndex: 20 }}
                    >
                      <span className={`text-sm font-semibold ${isDark ? 'text-white/80' : 'text-elastic-dark-ink/80'}`}>
                        78% of SLED breaches start at under-resourced local entities
                      </span>
                      <span className={`block text-xs mt-0.5 ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>
                        Talent shortage + budget constraints leave school districts, small cities, and hospitals exposed
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* ═══════════ STAGE 1: UNIFIED SOC ════════════════════ */}
            {stage === 1 && (
              <motion.div
                key="solution"
                className="absolute inset-0 p-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                <div className="w-full h-full relative">

                  {/* ── SOC Hub (top center, above the grid) ──────────── */}
                  <motion.div
                    className="absolute left-1/2 top-[3%]"
                    style={{ zIndex: 6 }}
                    initial={{ opacity: 0, scale: 0.5, x: '-50%' }}
                    animate={{ opacity: 1, scale: 1, x: '-50%' }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  >
                    <motion.div
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border-2 ${isDark ? 'bg-elastic-dev-blue' : 'bg-white'}`}
                      style={{
                        borderColor: ['results', 'roles'].includes(solutionPhase)
                          ? (isDark ? '#48EFCF' : '#0B64DD')
                          : (isDark ? 'rgba(72,239,207,0.4)' : 'rgba(11,100,221,0.4)'),
                        boxShadow: ['results', 'roles'].includes(solutionPhase)
                          ? (isDark ? '0 0 25px rgba(72,239,207,0.3)' : '0 0 25px rgba(11,100,221,0.2)')
                          : 'none',
                      }}
                    >
                      <img src="/logo-elastic-glyph-color.png" alt="Elastic" className="w-12 h-12 object-contain" />
                      <div>
                        <div className={`text-base font-bold ${isDark ? 'text-white' : 'text-elastic-dev-blue'}`}>
                          State Security Operations Center
                        </div>
                        <div className={`text-[11px] ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>
                          Cross-cluster search across all SLED deployments
                        </div>
                        {/* Search bar */}
                        <div className={`flex items-center gap-2 mt-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono ${
                          isDark ? 'bg-white/[0.06] border border-white/10 text-white/40' : 'bg-elastic-dev-blue/[0.04] border border-elastic-dev-blue/10 text-elastic-dev-blue/40'
                        }`}>
                          <FontAwesomeIcon icon={faMagnifyingGlass} className="text-[9px]" />
                          <span className={['querying', 'results', 'roles'].includes(solutionPhase) ? (isDark ? 'text-elastic-teal' : 'text-elastic-blue') : ''}>
                            GET _remote/*:logs-*/_search
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* ── SVG Connection Lines ──────────────────────────── */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ zIndex: 1 }}>
                    {['connecting', 'querying', 'results', 'roles'].includes(solutionPhase) && entityPositions.map((pos, index) => {
                      const startX = 50, startY = 18
                      const controlY = (startY + pos.y) / 2
                      return (
                        <motion.path
                          key={pos.id}
                          d={`M ${startX} ${startY} C ${startX} ${controlY}, ${pos.x} ${controlY}, ${pos.x} ${pos.y}`}
                          fill="none"
                          stroke={isDark ? '#48EFCF' : '#0B64DD'}
                          strokeWidth="0.3"
                          strokeOpacity="0.5"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.6, delay: index * 0.08 }}
                        />
                      )
                    })}
                  </svg>

                  {/* ── Query balls (outbound) ───────────────────────── */}
                  {solutionPhase === 'querying' && entityPositions.map((pos, index) => {
                    const startX = 50, startY = 18
                    const controlY = (startY + pos.y) / 2
                    const bezier = (t) => {
                      const mt = 1 - t
                      return {
                        x: mt*mt*mt*startX + 3*mt*mt*t*startX + 3*mt*t*t*pos.x + t*t*t*pos.x,
                        y: mt*mt*mt*startY + 3*mt*mt*t*controlY + 3*mt*t*t*controlY + t*t*t*pos.y,
                      }
                    }
                    const pts = [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1].map(bezier)
                    return (
                      <motion.div
                        key={`q-${pos.id}`}
                        className="absolute w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: isDark ? '#48EFCF' : '#0B64DD',
                          boxShadow: isDark ? '0 0 10px 3px rgba(72,239,207,0.5)' : '0 0 10px 3px rgba(11,100,221,0.5)',
                          marginLeft: '-6px', marginTop: '-6px', zIndex: 5,
                        }}
                        initial={{ left: '50%', top: '18%', opacity: 0 }}
                        animate={{
                          left: pts.map(p => `${p.x}%`),
                          top: pts.map(p => `${p.y}%`),
                          opacity: [0, 1, 1, 1, 1, 1, 1, 0],
                        }}
                        transition={{ duration: 0.8, ease: 'linear', delay: index * 0.06 }}
                      />
                    )
                  })}

                  {/* ── Result balls (return) ────────────────────────── */}
                  {solutionPhase === 'results' && entityPositions.map((pos, index) => {
                    const startX = 50, startY = 18
                    const controlY = (startY + pos.y) / 2
                    const bezier = (t) => {
                      const mt = 1 - t
                      return {
                        x: mt*mt*mt*pos.x + 3*mt*mt*t*pos.x + 3*mt*t*t*startX + t*t*t*startX,
                        y: mt*mt*mt*pos.y + 3*mt*mt*t*controlY + 3*mt*t*t*controlY + t*t*t*startY,
                      }
                    }
                    const pts = [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1].map(bezier)
                    return (
                      <motion.div
                        key={`r-${pos.id}`}
                        className="absolute w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: pos.color,
                          boxShadow: `0 0 10px 3px ${pos.color}80`,
                          marginLeft: '-6px', marginTop: '-6px', zIndex: 5,
                        }}
                        initial={{ left: `${pos.x}%`, top: `${pos.y}%`, opacity: 0 }}
                        animate={{
                          left: pts.map(p => `${p.x}%`),
                          top: pts.map(p => `${p.y}%`),
                          opacity: [0, 1, 1, 1, 1, 1, 1, 0],
                        }}
                        transition={{ duration: 0.8, ease: 'linear', delay: index * 0.06 }}
                      />
                    )
                  })}

                  {/* ── Deployment cards (two rows of 4) ─────────────── */}
                  {['deploying', 'connecting', 'querying', 'results', 'roles'].includes(solutionPhase) && entityPositions.map((pos, index) => (
                    <motion.div
                      key={pos.id}
                      className="absolute"
                      style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)', zIndex: 3 }}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.08, type: 'spring', stiffness: 300, damping: 25 }}
                    >
                      <div className={`w-[140px] rounded-xl border-2 p-2.5 ${isDark ? 'bg-elastic-dev-blue' : 'bg-white'}`}
                        style={{ borderColor: pos.color + '50' }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: pos.color + '20' }}>
                            <FontAwesomeIcon icon={pos.icon} style={{ color: pos.color }} className="text-[10px]" />
                          </div>
                          <span className={`text-[11px] font-semibold truncate ${isDark ? 'text-white/80' : 'text-elastic-dark-ink/80'}`}>
                            {pos.short}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-[8px] px-1.5 py-0.5 rounded-full font-semibold"
                            style={{ backgroundColor: pos.color + '20', color: pos.color }}
                          >
                            Elastic Deployment
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                            <span className={`text-[8px] ${isDark ? 'text-white/30' : 'text-elastic-dev-blue/30'}`}>Live</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* ── Results bar ───────────────────────────────────── */}
                  <AnimatePresence>
                    {solutionPhase === 'results' && (
                      <motion.div
                        className={`absolute bottom-[3%] left-1/2 flex items-center gap-8 px-6 py-3 rounded-2xl border ${
                          isDark ? 'bg-elastic-dev-blue/95 border-elastic-teal/30' : 'bg-white/95 border-elastic-blue/20'
                        }`}
                        style={{ zIndex: 10 }}
                        initial={{ opacity: 0, y: 15, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0 }}
                      >
                        {[
                          { label: 'Deployments', value: '8' },
                          { label: 'Data Sources', value: '425' },
                          { label: 'Events/Day', value: '1.1M' },
                          { label: 'Query Latency', value: '42ms' },
                        ].map((stat, i) => (
                          <div key={i} className="text-center">
                            <div className={`text-lg font-bold ${isDark ? 'text-elastic-teal' : 'text-elastic-blue'}`}>{stat.value}</div>
                            <div className={`text-[10px] ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>{stat.label}</div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ── Role-based access cards (bottom row) ────────────── */}
                  <AnimatePresence>
                    {solutionPhase === 'roles' && (
                      <motion.div
                        className="absolute bottom-[3%] left-1/2 flex items-center gap-4"
                        style={{ zIndex: 10 }}
                        initial={{ opacity: 0, y: 15, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0 }}
                      >
                        <div className={`text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>
                          Role-Based Access
                        </div>
                        {roles.map((role, i) => (
                          <motion.div
                            key={role.id}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border ${
                              isDark ? 'bg-elastic-dev-blue/95 border-white/10' : 'bg-white/95 border-elastic-dev-blue/10'
                            }`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.12 }}
                          >
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: role.color + '20' }}>
                              <FontAwesomeIcon icon={role.icon} style={{ color: role.color }} className="text-xs" />
                            </div>
                            <div>
                              <div className={`text-[11px] font-semibold ${isDark ? 'text-white/80' : 'text-elastic-dark-ink/80'}`}>{role.name}</div>
                              <div className={`text-[9px] ${isDark ? 'text-white/35' : 'text-elastic-dev-blue/35'}`}>{role.access}</div>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ── Idle label ────────────────────────────────────── */}
                  {solutionPhase === 'idle' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        className={`text-center ${isDark ? 'text-white/20' : 'text-elastic-dev-blue/20'}`}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                      >
                        <FontAwesomeIcon icon={faShieldHalved} className="text-3xl mb-2 block mx-auto" />
                        <div className="text-sm">Deploying unified SOC...</div>
                      </motion.div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ═══════════ STAGE 2: AI-POWERED DEFENSE ═════════════ */}
            {stage === 2 && (
              <motion.div
                key="impact"
                className="absolute inset-0 p-5 flex gap-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                {/* ── Left: Compact SOC topology ─────────────────────── */}
                <div className="flex-[3] relative min-w-0">
                  {/* Mini SOC hub */}
                  <motion.div
                    className="absolute left-1/2 top-[1%]"
                    style={{ zIndex: 5 }}
                    initial={{ opacity: 0, scale: 0.8, x: '-50%' }} animate={{ opacity: 1, scale: 1, x: '-50%' }}
                  >
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 ${isDark ? 'bg-elastic-dev-blue' : 'bg-white'}`}
                      style={{ borderColor: isDark ? 'rgba(72,239,207,0.4)' : 'rgba(11,100,221,0.4)' }}
                    >
                      <img src="/logo-elastic-glyph-color.png" alt="Elastic" className="w-8 h-8 object-contain" />
                      <div>
                        <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-elastic-dev-blue'}`}>State SOC</div>
                        <div className={`text-[9px] ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>AI-Powered Defense</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* SVG connections */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {entityPositions.map((pos, index) => {
                      const startX = 50, startY = 10
                      const controlY = (startY + pos.y) / 2
                      return (
                        <motion.path key={pos.id}
                          d={`M ${startX} ${startY} C ${startX} ${controlY}, ${pos.x} ${controlY}, ${pos.x} ${pos.y}`}
                          fill="none" stroke={isDark ? '#48EFCF' : '#0B64DD'}
                          strokeWidth="0.25" strokeOpacity="0.3"
                          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                          transition={{ duration: 0.4, delay: index * 0.04 }}
                        />
                      )
                    })}
                  </svg>

                  {/* Compact deployment nodes */}
                  {entityPositions.map((pos, index) => (
                    <motion.div key={pos.id} className="absolute"
                      style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)', zIndex: 2 }}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.04 }}
                    >
                      <div className={`w-[100px] rounded-lg border p-1.5 text-center ${isDark ? 'bg-elastic-dev-blue border-white/10' : 'bg-white border-elastic-dev-blue/10'}`}
                        style={{ borderColor: pos.color + '30' }}
                      >
                        <FontAwesomeIcon icon={pos.icon} style={{ color: pos.color }} className="text-[10px] mb-0.5" />
                        <div className={`text-[8px] font-semibold truncate ${isDark ? 'text-white/60' : 'text-elastic-dark-ink/60'}`}>
                          {pos.short}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Alert flood particles */}
                  {impactPhase === 'alerts-flooding' && floodAlerts.map((alert) => {
                    const source = entityPositions[alert.entityIndex]
                    return (
                      <motion.div key={`flood-${alert.id}`} className="absolute w-2 h-2 rounded-full"
                        style={{ backgroundColor: alert.color, boxShadow: `0 0 6px 2px ${alert.color}60`, zIndex: 4 }}
                        initial={{ left: `${source.x}%`, top: `${source.y}%`, opacity: 0, scale: 0 }}
                        animate={{ left: '50%', top: '6%', opacity: [0, 1, 1, 0], scale: [0, 1, 1, 0.5] }}
                        transition={{ duration: 0.8, ease: 'easeInOut' }}
                      />
                    )
                  })}

                  {/* Data sovereignty badge */}
                  <AnimatePresence>
                    {impactPhase === 'metrics' && (
                      <motion.div
                        className={`absolute bottom-2 left-1/2 flex items-center gap-2 px-3 py-2 rounded-xl border ${
                          isDark ? 'bg-elastic-dev-blue/95 border-elastic-teal/20' : 'bg-white/95 border-elastic-blue/15'
                        }`}
                        style={{ zIndex: 10 }}
                        initial={{ opacity: 0, y: 10, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }}
                      >
                        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                          <FontAwesomeIcon icon={faLock} className={`text-sm ${isDark ? 'text-elastic-teal' : 'text-elastic-blue'}`} />
                        </motion.div>
                        <div>
                          <div className={`text-[11px] font-semibold ${isDark ? 'text-white/70' : 'text-elastic-dark-ink/70'}`}>
                            Data Sovereignty Preserved
                          </div>
                          <div className={`text-[9px] ${isDark ? 'text-white/35' : 'text-elastic-dev-blue/35'}`}>
                            Queries travel, data stays — each agency retains full ownership
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* ── Right: AI Analysis Panel ───────────────────────── */}
                <div className={`flex-[2] flex flex-col gap-3 rounded-2xl border p-4 ${
                  isDark ? 'border-white/10 bg-white/[0.02]' : 'border-elastic-dev-blue/10 bg-white/50'
                }`}>
                  {/* Panel header */}
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faWandMagicSparkles} className={`text-sm ${isDark ? 'text-elastic-teal' : 'text-elastic-blue'}`} />
                    <span className={`text-sm font-semibold ${isDark ? 'text-white/70' : 'text-elastic-dark-ink/70'}`}>
                      AI-Powered Analysis
                    </span>
                  </div>

                  {/* Alert flooding indicator */}
                  {impactPhase === 'alerts-flooding' && (
                    <motion.div className="flex-1 flex flex-col items-center justify-center gap-3"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    >
                      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <FontAwesomeIcon icon={faTriangleExclamation} className="text-2xl text-elastic-yellow" />
                      </motion.div>
                      <span className={`text-sm ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>
                        {floodAlerts.length} alerts streaming in...
                      </span>
                    </motion.div>
                  )}

                  {/* AI triage spinner */}
                  {impactPhase === 'ai-triaging' && (
                    <motion.div className="flex-1 flex flex-col items-center justify-center gap-3"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    >
                      <motion.div
                        className={`w-9 h-9 rounded-full border-2 border-t-transparent ${isDark ? 'border-elastic-teal' : 'border-elastic-blue'}`}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      <span className={`text-sm ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>
                        Analyzing alerts across 8 deployments...
                      </span>
                    </motion.div>
                  )}

                  {/* Cross-agency incidents */}
                  {['correlated', 'metrics'].includes(impactPhase) && (
                    <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto">
                      <div className={`text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'text-white/30' : 'text-elastic-dev-blue/30'}`}>
                        Cross-Agency Incidents — 85 alerts → 3 attack stories
                      </div>
                      {crossAgencyIncidents.map((incident, i) => (
                        <motion.div key={incident.id}
                          className={`rounded-xl border p-3 ${isDark ? 'border-white/10 bg-white/[0.03]' : 'border-elastic-dev-blue/10 bg-white/60'}`}
                          style={{ borderLeftWidth: 3, borderLeftColor: incident.color }}
                          initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.15 }}
                        >
                          <div className="flex items-start justify-between mb-1">
                            <span className={`text-xs font-semibold ${isDark ? 'text-white/80' : 'text-elastic-dark-ink/80'}`}>
                              {incident.title}
                            </span>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase flex-shrink-0 ml-2"
                              style={{ backgroundColor: incident.color + '20', color: incident.color }}
                            >
                              {incident.severity}
                            </span>
                          </div>
                          <div className={`text-[10px] leading-snug mb-1.5 ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>
                            {incident.summary}
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {incident.agencies.map((agency, j) => (
                              <span key={j} className={`text-[8px] px-1.5 py-0.5 rounded-full ${
                                isDark ? 'bg-white/[0.06] text-white/50' : 'bg-elastic-dev-blue/[0.06] text-elastic-dev-blue/50'
                              }`}>
                                {agency}
                              </span>
                            ))}
                            <span className={`text-[8px] ml-auto ${isDark ? 'text-white/30' : 'text-elastic-dev-blue/30'}`}>
                              {incident.alertCount} alerts
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Impact metrics */}
                  <AnimatePresence>
                    {impactPhase === 'metrics' && (
                      <motion.div className="grid grid-cols-2 gap-2 mt-auto"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {impactMetrics.map((metric, i) => (
                          <motion.div key={i}
                            className={`rounded-xl border p-2.5 text-center ${
                              isDark ? 'border-white/10 bg-white/[0.03]' : 'border-elastic-dev-blue/10 bg-white/60'
                            }`}
                            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 + i * 0.08 }}
                          >
                            <div className="text-xl font-bold" style={{ color: metric.color }}>
                              <AnimatedCounter value={metric.value} suffix={metric.suffix} duration={1200} />
                            </div>
                            <div className={`text-[9px] mt-0.5 ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>
                              {metric.label}
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Idle state */}
                  {impactPhase === 'idle' && (
                    <div className={`flex-1 flex items-center justify-center ${isDark ? 'text-white/20' : 'text-elastic-dev-blue/20'}`}>
                      <div className="text-center">
                        <FontAwesomeIcon icon={faRobot} className="text-2xl mb-2 block mx-auto" />
                        <div className="text-sm">Starting AI defense...</div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* ── Bottom Bar: Pause / Play ─────────────────────────────── */}
        <div className="flex items-center justify-center mt-3">
          <button
            onClick={togglePlayback}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${
              isDark
                ? 'bg-white/[0.06] hover:bg-white/10 text-white/50 hover:text-white/80'
                : 'bg-elastic-dev-blue/[0.06] hover:bg-elastic-dev-blue/10 text-elastic-dev-blue/50 hover:text-elastic-dev-blue/80'
            }`}
          >
            <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} className="text-xs" />
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default WholeOfStateScene
