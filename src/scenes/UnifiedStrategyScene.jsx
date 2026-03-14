import { animate } from 'animejs'
import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBolt, faGear, faDatabase, faMagnifyingGlass, faBrain, faChartLine, faArrowsRotate, faLink, faBullseye, faTimeline, faArrowsSplitUpAndLeft } from '@fortawesome/free-solid-svg-icons'

const dataSources = [
  { id: 'endpoints', label: 'Endpoints', color: '#48EFCF' },
  { id: 'applications', label: 'Applications', color: '#0B64DD' },
  { id: 'infrastructure', label: 'Infrastructure', color: '#F04E98' },
  { id: 'services', label: 'Services', color: '#FEC514' },
  { id: 'network', label: 'Network/Security', color: '#FF957D' },
]

const platformCapabilities = [
  { id: 'ingest', label: 'Ingestion', icon: faTimeline },
  { id: 'process', label: 'Processing', icon: faGear },
  { id: 'storage', label: 'Storage', icon: faDatabase, core: true },
  { id: 'search', label: 'Search', icon: faMagnifyingGlass, core: true },
  { id: 'ai', label: 'AI & ML', icon: faBrain, core: true },
  { id: 'viz', label: 'Visualization', icon: faChartLine },
  { id: 'workflow', label: 'Automation', icon: faArrowsRotate },
]

const solutions = [
  { id: 'elasticsearch', label: 'Elasticsearch', tagline: 'Build Your Own', color: '#FEC514' },
  { id: 'observability', label: 'Observability', tagline: 'Out-of-the-Box', color: '#F04E98' },
  { id: 'security', label: 'Security', tagline: 'Out-of-the-Box', color: '#FF957D' },
]

const deploymentOptions = [
  { id: 'self', label: 'Self-Managed', desc: 'Full control on your infrastructure' },
  { id: 'cloud', label: 'Elastic Cloud', desc: 'Managed service on AWS, GCP, Azure' },
  { id: 'serverless', label: 'Serverless', desc: 'Zero ops, automatic scaling' },
]

const outcomes = [
  { id: 'dashboards', label: 'Dashboards', icon: faChartLine, color: '#48EFCF' },
  { id: 'integrations', label: 'Integrations', icon: faLink, color: '#0B64DD' },
  { id: 'orchestration', label: 'Orchestration', icon: faBullseye, color: '#F04E98' },
  { id: 'automation', label: 'Workflows', icon: faArrowsSplitUpAndLeft, color: '#FEC514' },
]

function FlowingParticles({ direction = 'right', colors, count = 8 }) {
  const [particles, setParticles] = useState([])
  const particleRefs = useRef([])

  useEffect(() => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      color: colors[i % colors.length],
      delay: (i / count) * 2000,
      y: 10 + (i % 5) * 20,
    }))
    setParticles(newParticles)
  }, [colors, count])

  useEffect(() => {
    if (particles.length === 0) return

    // Animate each particle
    particles.forEach((particle, index) => {
      const element = particleRefs.current[index]
      if (!element) return

      const animateParticle = () => {
        animate(element, {
          translateX: direction === 'right' ? [0, 120] : [0, -120],
          opacity: [0, 1, 1, 0],
          duration: 2000,
          delay: particle.delay,
          easing: 'linear',
          loop: true
        })
      }

      animateParticle()
    })
  }, [particles, direction])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((particle, index) => (
        <div
          key={particle.id}
          ref={(el) => particleRefs.current[index] = el}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: particle.color,
            top: `${particle.y}%`,
            left: direction === 'right' ? '-10%' : '110%',
          }}
        />
      ))}
    </div>
  )
}

function UnifiedStrategyScene({ metadata = {} }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [hoveredCapability, setHoveredCapability] = useState(null)
  const [hoveredSolution, setHoveredSolution] = useState(null)

  // Use metadata values or defaults
  const eyebrow = metadata.eyebrow || "The Elastic Search AI Platform"
  const titlePart1 = metadata.titlePart1 || "All Your Data"
  const titlePart2 = metadata.titlePart2 || ", Real-Time, At Scale"
  const subtitle = metadata.subtitle || "Accelerate mission outcomes by finding insights from any data source."

  const sourceColors = dataSources.map(s => s.color)
  const outcomeColors = outcomes.map(o => o.color)

  return (
    <div className="flex flex-col items-center justify-center h-full w-full pt-10 pb-4 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full px-8">
        {/* Header */}
        <div className="text-center">
          <p className={`text-sm font-semibold uppercase tracking-eyebrow pt-8 mb-4 ${isDark ? 'text-elastic-teal' : 'text-elastic-blue'}`}>
            {eyebrow}
          </p>
          <h2 className="font-headline text-4xl md:text-5xl font-extrabold mb-4">
            <span className={isDark ? 'text-elastic-teal' : 'text-elastic-blue'}>{titlePart1}</span>
            <span className={isDark ? 'text-white' : 'text-elastic-dark-ink'}>{titlePart2}</span>
          </h2>
          <p className={`text-paragraph text-lg md:text-xl max-w-3xl mx-auto pt-1 pb-8 ${isDark ? 'text-elastic-light-grey' : 'text-elastic-ink'}`}>
            {subtitle}
          </p>
        </div>

        {/* Main Platform Visualization */}
        <div className="relative">
          {/* Using 5 columns: sources | arrow | platform | arrow | outcomes */}
          <div className="grid gap-3 items-stretch" style={{ gridTemplateColumns: '1fr 60px 4fr 60px 1fr' }}>
            
            {/* Left: Data Sources */}
            <div className="flex flex-col justify-center">
              <p className={`text-xs uppercase tracking-widest mb-3 text-center ${isDark ? 'text-white/40' : 'text-elastic-dark-ink/60'}`}>
                Any Data Source
              </p>
              <div className="space-y-2">
                {dataSources.map((source, index) => (
                  <div
                    key={source.id}
                    className={`p-2 rounded-lg border text-center text-xs relative overflow-hidden ${
                      isDark 
                        ? 'bg-white/[0.03] border-white/10' 
                        : 'bg-white/80 border-elastic-dev-blue/10'
                    }`}
                  >
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1"
                      style={{ backgroundColor: source.color }}
                    />
                    <span className={isDark ? 'text-white/70' : 'text-elastic-dark-ink'}>
                      {source.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Left Arrow with flowing particles */}
            <div className="relative flex items-center justify-center">
              <FlowingParticles direction="right" colors={sourceColors} count={10} />
            </div>

            {/* Center: Platform Architecture */}
            <div className="flex flex-col justify-center">
              {/* Solutions Row */}
              <div className="grid grid-cols-3 gap-3 mb-2">
                {solutions.map((solution, index) => (
                  <div
                    key={solution.id}
                    className={`relative px-4 py-3 rounded-xl border-2 cursor-pointer transition-all text-center ${
                      hoveredSolution === solution.id
                        ? 'scale-[1.02]'
                        : ''
                    } ${isDark ? 'bg-white/[0.03]' : 'bg-white/90'}`}
                    style={{ 
                      borderColor: solution.color,
                      borderTopWidth: '4px',
                    }}
                    onMouseEnter={() => setHoveredSolution(solution.id)}
                    onMouseLeave={() => setHoveredSolution(null)}
                  >
                    <div className={`text-xs mb-1 ${isDark ? 'text-white/40' : 'text-elastic-dark-ink/60'}`}>
                      {solution.tagline}
                    </div>
                    <div className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-elastic-dark-ink'}`}>
                      {solution.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Main Platform Box */}
              <div
                className={`relative p-3 rounded-2xl border-2 ${
                  isDark 
                    ? 'bg-elastic-dev-blue/50 border-elastic-blue/30' 
                    : 'bg-white border-elastic-blue/20 shadow-lg'
                }`}
              >
                <div className={`text-center text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-elastic-dark-ink'}`}>
                  Search AI Platform
                </div>

                {/* Capabilities Row */}
                <div className="grid grid-cols-7 gap-1 items-end">
                  {platformCapabilities.map((cap, index) => (
                    <div
                      key={cap.id}
                      className={`relative px-2 py-2 rounded-lg text-center cursor-pointer transition-all ${
                        cap.core 
                          ? isDark 
                            ? 'bg-elastic-blue/30 border border-elastic-blue/50' 
                            : 'bg-elastic-blue/10 border border-elastic-blue/30'
                          : isDark 
                            ? 'bg-white/[0.05] border border-white/10' 
                            : 'bg-elastic-light-grey border border-elastic-dev-blue/10'
                      } ${hoveredCapability === cap.id ? 'scale-105 z-10' : ''}`}
                      onMouseEnter={() => setHoveredCapability(cap.id)}
                      onMouseLeave={() => setHoveredCapability(null)}
                    >
                      <div className={`text-base mb-1 ${isDark ? 'text-white' : 'text-elastic-blue'}`}>
                        <FontAwesomeIcon icon={cap.icon} />
                      </div>
                      <div className={`text-[10px] leading-tight ${
                        cap.core 
                          ? isDark ? 'text-white font-medium' : 'text-elastic-blue font-medium'
                          : isDark ? 'text-white/60' : 'text-elastic-dark-ink'
                      }`}>
                        {cap.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Search AI Lake Badge */}
                <div className="grid grid-cols-7 gap-1 mt-2">
                  <div className="col-span-2" />
                  <div className="col-span-3">
                    <div className={`w-full py-1.5 rounded-full text-xs font-medium text-center ${
                      isDark 
                        ? 'bg-elastic-teal/20 text-elastic-teal border border-elastic-teal/30' 
                        : 'bg-elastic-blue/10 text-elastic-blue border border-elastic-blue/30'
                    }`}>
                      Search AI Lake
                    </div>
                  </div>
                  <div className="col-span-2" />
                </div>
              </div>

              {/* Deployment Options */}
              <div className="flex justify-center gap-3 mt-2">
                {deploymentOptions.map((option, index) => (
                  <div
                    key={option.id}
                    className={`px-3 py-2 rounded-xl border text-center ${
                      isDark 
                        ? 'bg-white/[0.02] border-white/10' 
                        : 'bg-white/60 border-elastic-dev-blue/10'
                    }`}
                  >
                    <div className={`text-xs font-medium ${isDark ? 'text-white' : 'text-elastic-dark-ink'}`}>
                      {option.label}
                    </div>
                    <div className={`text-[10px] ${isDark ? 'text-white/40' : 'text-elastic-dark-ink/60'}`}>
                      {option.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Arrow with flowing particles */}
            <div className="relative flex items-center justify-center">
              <FlowingParticles direction="right" colors={outcomeColors} count={8} />
            </div>

            {/* Right: Outcomes */}
            <div className="flex flex-col justify-center">
              <p className={`text-xs uppercase tracking-widest mb-3 text-center ${isDark ? 'text-white/40' : 'text-elastic-dark-ink/60'}`}>
                Outcomes
              </p>
              <div className="space-y-2">
                {outcomes.map((outcome, index) => (
                  <div
                    key={outcome.id}
                    className={`p-2 rounded-lg border text-center relative overflow-hidden ${
                      isDark 
                        ? 'bg-elastic-teal/5 border-elastic-teal/20' 
                        : 'bg-elastic-blue/5 border-elastic-blue/20'
                    }`}
                  >
                    <div
                      className="absolute right-0 top-0 bottom-0 w-1"
                      style={{ backgroundColor: outcome.color }}
                    />
                    <span className={`mr-1 text-sm ${isDark ? 'text-white' : 'text-elastic-blue'}`}>
                      <FontAwesomeIcon icon={outcome.icon} />
                    </span>
                    <span className={`text-xs ${isDark ? 'text-white/70' : 'text-elastic-dark-ink'}`}>
                      {outcome.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Key Value Props */}
        <div className="grid md:grid-cols-3 gap-3 mt-4">
          {[
            {
              title: 'One Platform',
              desc: 'Search, Observability, and Security unified on a single data layer',
              color: '#0B64DD',
            },
            {
              title: 'Any Deployment',
              desc: 'Self-managed, cloud-hosted, or fully serverless—your choice',
              color: '#48EFCF',
            },
            {
              title: 'Real-Time Insights',
              desc: 'From ingestion to action in milliseconds, at petabyte scale',
              color: '#F04E98',
            },
          ].map((prop, index) => (
            <div
              key={prop.title}
                className={`p-3 rounded-xl border transition-all ${
                isDark 
                  ? 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05]' 
                  : 'bg-white/80 border-elastic-dev-blue/10 hover:bg-white'
              }`}
            >
                <div 
                className="w-2 h-2 rounded-full mb-1.5"
                style={{ backgroundColor: prop.color }}
              />
              <h3 className={`text-headline text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-elastic-dark-ink'}`}>
                {prop.title}
              </h3>
              <p className={`text-paragraph text-sm ${isDark ? 'text-elastic-light-grey/70' : 'text-elastic-dark-ink'}`}>
                {prop.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UnifiedStrategyScene
