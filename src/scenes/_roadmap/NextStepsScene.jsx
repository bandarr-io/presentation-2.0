import { animate, stagger } from 'animejs'
import { useEffect, useRef } from 'react'
import { useTheme } from '../context/ThemeContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBullseye, faWrench, faPlaneDeparture,
  faUsers, faDesktop, faBook,
  faArrowRight, faCalendarDays, faEnvelope,
} from '@fortawesome/free-solid-svg-icons'

// ─── Data ─────────────────────────────────────────────────────────────────────

const journeySteps = [
  { phase: '01', title: 'Executive Alignment',  description: 'Business priorities & pain points', color: '#48EFCF' },
  { phase: '02', title: 'Use Case Discovery',   description: 'Technical requirements & scope',    color: '#0B64DD' },
  { phase: '03', title: 'Technical Validation', description: 'Architecture review & pilot',       color: '#F04E98' },
  { phase: '04', title: 'Business Value Review', description: 'Quantifying impact & ROI',         color: '#FEC514' },
]

const primaryActions = [
  { title: 'Start a Free Trial',  desc: '14-day full-platform access — no credit card', icon: faBullseye,      color: '#48EFCF' },
  { title: 'Book a Workshop',     desc: 'Hands-on session with our Solutions Architects', icon: faWrench,       color: '#0B64DD' },
  { title: 'Run a Pilot',         desc: 'Validate on your own data & infrastructure',    icon: faPlaneDeparture, color: '#F04E98' },
]

const secondaryActions = [
  { title: 'Customer Stories',   desc: 'elastic.co/customers',     icon: faUsers       },
  { title: 'Live Demo Gallery',  desc: 'elastic.co/demo-gallery',  icon: faDesktop     },
  { title: 'Documentation',      desc: 'elastic.co/docs',          icon: faBook        },
]

// ─── Component ────────────────────────────────────────────────────────────────

function NextStepsScene({ metadata = {} }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const contentRef = useRef(null)

  const eyebrow    = metadata.eyebrow    || "What Comes Next"
  const headingPlain  = metadata.headingPlain  || "Ready to "
  const headingAccent = metadata.headingAccent || "Get Started?"
  const subtitle   = metadata.subtitle   || "Here's a clear path forward — we'll guide you every step of the way."
  const ctaHeading = metadata.ctaHeading || "Let's keep the momentum going."
  const ctaName    = metadata.ctaName    || ''
  const ctaEmail   = metadata.ctaEmail   || ''
  const ctaPhone   = metadata.ctaPhone   || ''

  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    animate(el.querySelectorAll('.stagger-in'), {
      opacity:   [0, 1],
      translateY: [16, 0],
      duration:  500,
      delay:     stagger(80),
      ease:      'outCubic',
    })
  }, [])

  return (
    <div className="scene !py-4 w-full h-full">
      <div className="max-w-[98%] mx-auto w-full h-full flex flex-col gap-4" ref={contentRef}>

        {/* Header */}
        <div className="stagger-in text-center flex-shrink-0">
          <p className={`text-sm font-semibold uppercase tracking-widest mb-3 ${isDark ? 'text-elastic-teal' : 'text-elastic-blue'}`}>
            {eyebrow}
          </p>
          <h2 className="font-headline text-4xl md:text-5xl font-extrabold mb-3">
            <span className={isDark ? 'text-white' : 'text-elastic-dark-ink'}>{headingPlain}</span>
            <span className={isDark ? 'text-elastic-teal' : 'text-elastic-blue'}>{headingAccent}</span>
          </h2>
          <p className={`text-lg mx-auto max-w-2xl ${isDark ? 'text-white/60' : 'text-elastic-ink/70'}`}>
            {subtitle}
          </p>
        </div>

        {/* Journey steps */}
        <div className="stagger-in flex-shrink-0">
          <div className="relative grid grid-cols-4 gap-3">
            {/* Connecting line */}
            <div className={`absolute top-6 left-[12.5%] right-[12.5%] h-px ${isDark ? 'bg-white/10' : 'bg-elastic-dev-blue/10'}`} />
            <div
              className="absolute top-6 left-[12.5%] h-px bg-gradient-to-r from-elastic-teal via-elastic-blue to-elastic-pink"
              style={{ width: '75%' }}
            />

            {journeySteps.map((step, i) => (
              <div key={step.phase} className="flex flex-col items-center text-center gap-2">
                {/* Phase bubble */}
                <div
                  className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center font-mono font-bold text-sm text-white shadow-lg"
                  style={{ backgroundColor: step.color, boxShadow: `0 0 16px ${step.color}50` }}
                >
                  {step.phase}
                </div>
                {/* Label */}
                <div className={`px-3 py-2 rounded-xl w-full ${isDark ? 'bg-white/[0.04]' : 'bg-white/70'} border ${isDark ? 'border-white/8' : 'border-elastic-dev-blue/8'}`}>
                  <p className={`text-sm font-bold leading-snug ${isDark ? 'text-white' : 'text-elastic-dev-blue'}`}>{step.title}</p>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Primary CTAs */}
        <div className="stagger-in flex gap-3 flex-shrink-0">
          {primaryActions.map((action) => (
            <div
              key={action.title}
              className={`flex-1 rounded-2xl border-2 p-4 flex flex-col gap-2 transition-all ${isDark ? 'bg-white/[0.03]' : 'bg-white/80'}`}
              style={{ borderColor: `${action.color}40` }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${action.color}20`, color: action.color }}
              >
                <FontAwesomeIcon icon={action.icon} className="text-sm" />
              </div>
              <div>
                <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-elastic-dev-blue'}`}>{action.title}</p>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>{action.desc}</p>
              </div>
              <div
                className="mt-auto flex items-center gap-1 text-xs font-semibold"
                style={{ color: action.color }}
              >
                Get started <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
              </div>
            </div>
          ))}
        </div>

        {/* Secondary resources + Contact strip */}
        <div className="stagger-in flex gap-3 flex-1 min-h-0">

          {/* Self-serve resources */}
          <div className={`flex-1 rounded-2xl border p-4 flex flex-col gap-2 ${isDark ? 'bg-white/[0.02] border-white/10' : 'bg-white/60 border-elastic-dev-blue/10'}`}>
            <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>
              Explore on your own
            </p>
            {secondaryActions.map((action) => (
              <div key={action.title} className={`flex items-center gap-3 px-3 py-2 rounded-xl ${isDark ? 'bg-white/5 hover:bg-white/8' : 'bg-elastic-dev-blue/5 hover:bg-elastic-dev-blue/8'} transition-colors cursor-pointer`}>
                <FontAwesomeIcon icon={action.icon} className={`text-sm flex-shrink-0 ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`} />
                <div>
                  <p className={`text-sm font-semibold ${isDark ? 'text-white/80' : 'text-elastic-dev-blue/80'}`}>{action.title}</p>
                  <p className={`text-xs ${isDark ? 'text-white/30' : 'text-elastic-dev-blue/30'}`}>{action.desc}</p>
                </div>
                <FontAwesomeIcon icon={faArrowRight} className={`ml-auto text-xs ${isDark ? 'text-white/20' : 'text-elastic-dev-blue/20'}`} />
              </div>
            ))}
          </div>

          {/* Contact / CTA strip */}
          <div className={`flex-1 rounded-2xl border p-4 flex flex-col justify-between ${isDark ? 'bg-elastic-teal/10 border-elastic-teal/20' : 'bg-elastic-blue/5 border-elastic-blue/20'}`}>
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-elastic-teal/70' : 'text-elastic-blue/70'}`}>
                Your Elastic Team
              </p>
              <p className={`text-base font-bold ${isDark ? 'text-white' : 'text-elastic-dev-blue'}`}>{ctaHeading}</p>
            </div>

            <div className="space-y-2 my-3">
              {ctaName && (
                <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-white/70' : 'text-elastic-dev-blue/70'}`}>
                  <FontAwesomeIcon icon={faUsers} className="text-xs flex-shrink-0" />
                  {ctaName}
                </div>
              )}
              {ctaEmail && (
                <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-elastic-teal' : 'text-elastic-blue'}`}>
                  <FontAwesomeIcon icon={faEnvelope} className="text-xs flex-shrink-0" />
                  {ctaEmail}
                </div>
              )}
              {ctaPhone && (
                <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-white/70' : 'text-elastic-dev-blue/70'}`}>
                  <FontAwesomeIcon icon={faCalendarDays} className="text-xs flex-shrink-0" />
                  {ctaPhone}
                </div>
              )}
              {!ctaName && !ctaEmail && !ctaPhone && (
                <p className={`text-sm ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>
                  Add your contact details in Scene Settings.
                </p>
              )}
            </div>

            <div className="flex items-center justify-between mt-auto pt-3 border-t" style={{ borderColor: isDark ? 'rgba(72,239,207,0.15)' : 'rgba(11,100,221,0.15)' }}>
              <img
                src={isDark ? '/Elastic-Logo-tagline-secondary-white.svg' : '/Elastic-Logo-tagline-secondary-black.png'}
                alt="Elastic"
                className="h-6 w-auto"
              />
              <span className={`text-xs ${isDark ? 'text-elastic-teal/60' : 'text-elastic-blue/60'}`}>elastic.co</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default NextStepsScene
