import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { TeamProvider } from './context/TeamContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faMoon, faMagnifyingGlass, faGear, faMagnifyingGlass as faSearch, faChartColumn, faBrain, faDna, faShield, faClock, faRocket, faCoins, faForwardStep, faChartLine, faPlay, faPause, faRotateRight, faChevronRight, faBolt, faLayerGroup, faTimes, faCircleNodes } from '@fortawesome/free-solid-svg-icons'
import SceneSettings, { useSceneConfiguration } from './components/SceneSettings'

import TeamScene from './scenes/TeamScene'
import UnifiedStrategyScene from './scenes/UnifiedStrategyScene'
import DataExplosionSceneV2 from './scenes/DataExplosionSceneV2'
import CrossClusterScene from './scenes/CrossClusterScene'
import SecurityScene from './scenes/SecurityScene'
import SchemaScene from './scenes/SchemaScene'
import AccessControlSceneDev from './scenes/AccessControlSceneDev'
import DataMeshScene from './scenes/DataMeshScene'
import LicensingScene from './scenes/LicensingScene'
import DataTieringScene from './scenes/DataTieringScene'
import ConsolidationScene from './scenes/ConsolidationScene'

// Hero Scene with typing animation
const HeroScene = ({ metadata = {} }) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [showCursor, setShowCursor] = useState(true)
  const [isTypingComplete, setIsTypingComplete] = useState(false)
  const [showBanner, setShowBanner] = useState(false)
  
  // Use metadata values or defaults
  const typingText = metadata.typingText || "The Elastic Search AI Platform"
  const bannerTitle = metadata.bannerTitle || "The Elastic Search AI Platform:"
  const bannerHighlight = metadata.bannerHighlight || "Transforming Data into Action"
  const bannerSubtitle = metadata.bannerSubtitle || "Unleash the Power of Real-Time Insights, Scale, and Innovation"
  
  const fullText = typingText

  // Handle search bar click
  const handleSearchBarClick = () => {
    if (!isClicked && !isTyping) {
      setIsClicked(true)
      // Wait 1 second before starting to type
      setTimeout(() => {
        setIsTyping(true)
      }, 1000)
    }
  }

  // Handle search button click (when typing is complete)
  const handleSearchButtonClick = () => {
    if (isTypingComplete) {
      setShowBanner(true)
    }
  }

  // Typing effect
  useEffect(() => {
    if (!isTyping) return

    if (displayText.length < fullText.length) {
      const timer = setTimeout(() => {
        setDisplayText(fullText.slice(0, displayText.length + 1))
      }, 80) // Type speed: 80ms per character

      return () => clearTimeout(timer)
    } else if (displayText.length === fullText.length && !isTypingComplete) {
      // Typing is complete
      setIsTypingComplete(true)
    }
  }, [displayText, isTyping, fullText, isTypingComplete])

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 530)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center h-full w-full px-8">
      {!showBanner ? (
        // Search Bar with Typing Animation
        <div className="w-full max-w-4xl mb-8">
          {/* Eyebrow text above search bar */}
          <p className={`text-sm font-semibold uppercase tracking-eyebrow mb-4 text-center ${
            isDark ? 'text-elastic-teal' : 'text-elastic-blue'
          }`}>
            Click search to discover
          </p>

          <div
            onClick={handleSearchBarClick}
            className={`relative cursor-text transition-all duration-300 ${
              isClicked ? 'scale-[1.02]' : ''
            }`}
          >
            <div className={`relative flex items-center gap-4 px-8 py-6 rounded-full border-2 transition-all duration-300 ${
              isDark
                ? 'bg-white/[0.05] border-white/10 hover:border-elastic-teal/50'
                : 'bg-white border-elastic-dev-blue/10 hover:border-elastic-blue/30 shadow-lg'
            }`}>
              {/* Typing Text */}
              <div className={`flex-1 text-3xl font-semibold ${
                isDark ? 'text-white' : 'text-elastic-dark-ink'
              }`}>
                {displayText}
                {/* Blinking cursor */}
                {isClicked && (
                  <span className={`ml-1 inline-block w-0.5 h-8 ${
                    isDark ? 'bg-elastic-teal' : 'bg-elastic-blue'
                  } ${showCursor ? 'opacity-100' : 'opacity-0'}`} style={{ verticalAlign: 'middle' }} />
                )}
              </div>

              {/* Search Icon */}
              <button
                onClick={handleSearchButtonClick}
                disabled={!isTypingComplete}
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isDark ? 'bg-elastic-teal/20 text-elastic-teal' : 'bg-elastic-blue/10 text-elastic-blue'
                } ${isTypingComplete ? 'animate-pulse cursor-pointer hover:scale-110' : 'cursor-default'}`}
                style={isTypingComplete ? {
                  boxShadow: isDark 
                    ? '0 0 20px 8px rgba(72, 239, 207, 0.4), 0 0 40px 15px rgba(72, 239, 207, 0.2)'
                    : '0 0 20px 8px rgba(11, 100, 221, 0.4), 0 0 40px 15px rgba(11, 100, 221, 0.2)'
                } : {}}
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Large Banner
        <div className="text-center max-w-6xl">
          {/* Elastic Logo */}
          <div className="mb-12">
            <img 
              src={isDark ? '/Elastic-Logo-tagline-secondary-white.svg' : '/Elastic-Logo-tagline-secondary-black.png'}
              alt="Elastic - The Search AI Company" 
              className={`h-16 mx-auto`}
            />
          </div>
          
          <h1 className={`font-headline text-7xl font-extrabold mb-6 leading-tight ${
            isDark ? 'text-white' : 'text-elastic-dark-ink'
          }`}>
            {bannerTitle}
            <br />
            <span className={`${
              isDark 
                ? 'bg-gradient-to-r from-elastic-blue via-elastic-teal to-elastic-teal bg-clip-text text-transparent' 
                : 'text-elastic-blue'
            }`}>
              {bannerHighlight}
            </span>
          </h1>
          <p className={`font-body text-2xl ${
            isDark ? 'text-elastic-light-grey' : 'text-elastic-ink'
          } opacity-90`}>
            {bannerSubtitle}
          </p>
        </div>
      )}
    </div>
  )
}

const AboutScene = ({ metadata = {} }) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  // Use metadata values or defaults
  const subtitle = metadata.subtitle || "The Search AI Company — powering search, observability, and security for thousands of organizations worldwide."

  const defaultStats = [
    { value: '5B+', label: 'Downloads', description: 'Open source downloads worldwide' },
    { value: '54%', label: 'Fortune 500', description: 'Trust Elastic for their data needs' },
    { value: '40+', label: 'Countries', description: 'Global presence and support' },
    { value: '3,000+', label: 'Employees', description: 'Distributed across the globe' }
  ]

  const defaultFeatures = [
    { 
      icon: faSearch, 
      title: 'Search Pioneer', 
      description: 'Built on Apache Lucene, the gold standard for search' 
    },
    { 
      icon: faChartColumn, 
      title: 'Data at Scale', 
      description: 'Petabytes of data processed daily by our customers' 
    },
    { 
      icon: faBrain, 
      title: 'AI-Native', 
      description: 'Vector search & ML built into the platform from day one' 
    },
    { 
      icon: faDna, 
      title: 'Open Source DNA', 
      description: 'Transparent, extensible, community-driven' 
    }
  ]

  // Merge metadata with defaults
  const stats = defaultStats.map((stat, index) => ({
    ...stat,
    value: metadata.stats?.[index]?.value || stat.value,
    label: metadata.stats?.[index]?.label || stat.label,
    description: metadata.stats?.[index]?.description || stat.description
  }))

  const features = defaultFeatures.map((feature, index) => ({
    ...feature,
    title: metadata.features?.[index]?.title || feature.title,
    description: metadata.features?.[index]?.description || feature.description
  }))

  return (
    <div className="flex flex-col items-center justify-center h-full w-full py-12 overflow-y-auto">
      <div className="w-full max-w-[1400px] px-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="font-headline text-4xl md:text-5xl font-extrabold mb-4">
            <span className={isDark ? 'text-white' : 'text-elastic-dark-ink'}>About </span>
            <span className={isDark ? 'text-elastic-teal' : 'text-elastic-blue'}>Elastic</span>
          </h2>
          <p className={`text-paragraph text-lg md:text-xl mx-auto pt-1 pb-8 ${isDark ? 'text-elastic-light-grey' : 'text-elastic-ink'}`}>
            {subtitle}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`rounded-2xl p-6 transition-all duration-300 border ${
                isDark
                  ? 'bg-white/[0.03] border-white/10 hover:bg-white/[0.05] hover:border-elastic-teal/30'
                  : 'bg-white border-elastic-dev-blue/10 hover:border-elastic-blue/30 hover:shadow-lg'
              }`}
            >
              <div className={`text-5xl font-bold mb-2 ${
                isDark ? 'text-elastic-teal' : 'text-elastic-blue'
              }`}>
                {stat.value}
              </div>
              <div className={`text-lg font-semibold mb-1 ${
                isDark ? 'text-white' : 'text-elastic-dark-ink'
              }`}>
                {stat.label}
              </div>
              <div className={`text-sm ${
                isDark ? 'text-white/60' : 'text-elastic-ink/60'
              }`}>
                {stat.description}
              </div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`rounded-2xl p-6 transition-all duration-300 border ${
                isDark
                  ? 'bg-white/[0.03] border-white/10 hover:bg-white/[0.05] hover:border-elastic-teal/30'
                  : 'bg-white border-elastic-dev-blue/10 hover:border-elastic-blue/30 hover:shadow-lg'
              }`}
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                isDark ? 'bg-elastic-teal/20' : 'bg-elastic-blue/10'
              }`}>
                <FontAwesomeIcon 
                  icon={feature.icon} 
                  className={`text-2xl ${
                    isDark ? 'text-elastic-teal' : 'text-elastic-blue'
                  }`}
                />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${
                isDark ? 'text-white' : 'text-elastic-dark-ink'
              }`}>
                {feature.title}
              </h3>
              <p className={`text-sm ${
                isDark ? 'text-white/60' : 'text-elastic-ink/60'
              }`}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const BusinessValueScene = ({ selectedCard, setSelectedCard, showUnifiedMessage, setShowUnifiedMessage }) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const valueCards = [
    {
      id: 'risk',
      icon: faShield,
      title: 'Risk Reduction',
      description: 'Reduce likelihood & severity of threats',
      borderColor: '#48EFCF',
      bgColor: 'rgba(72, 239, 207, 0.1)',
      detailText: 'Elastic helps reduce your attack surface, detect threats faster, and improve your overall security posture.'
    },
    {
      id: 'time',
      icon: faClock,
      title: 'Time Efficiency',
      description: 'Do more with less',
      borderColor: '#F04E98',
      bgColor: 'rgba(240, 78, 152, 0.1)',
      detailText: 'Elastic helps you automate manual tasks, streamline workflows, and get insights faster so your teams can focus on what matters most.'
    },
    {
      id: 'resilience',
      icon: faRocket,
      title: 'Resilience',
      description: 'Respond & recover faster',
      borderColor: '#0B64DD',
      bgColor: 'rgba(11, 100, 221, 0.1)',
      detailText: 'Elastic helps you quickly identify and resolve issues, minimize downtime, and maintain business continuity even during incidents.'
    },
    {
      id: 'cost',
      icon: faCoins,
      title: 'Cost Savings',
      description: 'Reduce expenses prevent losses',
      borderColor: '#FEC514',
      bgColor: 'rgba(254, 197, 20, 0.1)',
      detailText: 'Elastic helps you consolidate tools, optimize resource usage, and prevent costly security breaches and operational incidents.'
    },
  ]

  return (
    <div className="flex flex-col items-center justify-center h-full w-full py-12 overflow-y-auto">
      <div className="w-full max-w-[1400px] px-8">
        {/* Header */}
        <div className="text-center">
          <p className={`text-sm font-semibold uppercase tracking-eyebrow pt-8 mb-4 ${
            isDark ? 'text-elastic-teal' : 'text-elastic-blue'
          }`}>
            BUSINESS VALUE
          </p>
          <h2 className="font-headline text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            <span className={isDark ? 'text-white' : 'text-elastic-dark-ink'}>Delivering Measurable</span>
            <span className={isDark ? 'text-elastic-teal' : 'text-elastic-blue'}> Business Value</span>
          </h2>
          <p className={`text-paragraph text-lg md:text-xl max-w-3xl mx-auto pt-1 pb-8 ${isDark ? 'text-elastic-light-grey' : 'text-elastic-ink'}`}>
            Elastic helps organizations in <span className={`font-bold ${isDark ? 'text-white' : 'text-elastic-dark-ink'}`}>four key areas.</span>
          </p>
        </div>

        {/* Value Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {valueCards.map((card, index) => (
            <div
              key={index}
              onClick={() => {
                setSelectedCard(card)
                setShowUnifiedMessage(false)
              }}
              className={`rounded-2xl p-8 transition-all duration-300 border-2 cursor-pointer ${
                isDark ? 'bg-white/[0.03] hover:bg-white/[0.05]' : 'bg-white hover:shadow-xl'
              } ${selectedCard?.id === card.id && !showUnifiedMessage ? 'scale-105' : 'hover:scale-102'}`}
              style={{
                borderColor: isDark ? card.borderColor : '#0B64DD',
              }}
            >
              {/* Icon */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                style={{
                  backgroundColor: isDark ? card.bgColor : 'rgba(11, 100, 221, 0.1)',
                }}
              >
                <FontAwesomeIcon
                  icon={card.icon}
                  className="text-3xl"
                  style={{ color: isDark ? card.borderColor : '#0B64DD' }}
                />
              </div>

              {/* Title */}
              <h3
                className="text-2xl font-bold mb-3"
                style={{ color: isDark ? card.borderColor : '#0B64DD' }}
              >
                {card.title}
              </h3>

              {/* Description */}
              <p className={`text-base ${
                isDark ? 'text-white/70' : 'text-elastic-dev-blue/70'
              }`}>
                {card.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Section — fixed height so cards never shift */}
        <div className="text-center relative min-h-[160px] flex flex-col items-center justify-center">
          {showUnifiedMessage ? (
            // Unified Platform Message
            <div className="flex flex-col items-center gap-6">
              {/* Four Icons */}
              <div className="flex items-center gap-4">
                {valueCards.map((card) => (
                  <div
                    key={card.id}
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: isDark ? card.bgColor : 'rgba(11, 100, 221, 0.1)',
                    }}
                  >
                    <FontAwesomeIcon
                      icon={card.icon}
                      className="text-xl"
                      style={{ color: isDark ? card.borderColor : '#0B64DD' }}
                    />
                  </div>
                ))}
              </div>
              
              {/* Message */}
              <p className={`text-2xl font-semibold max-w-4xl ${
                isDark ? 'text-white' : 'text-elastic-dark-ink'
              }`}>
                Elastic delivers tangible impact across all four areas with a{' '}
                <span className={isDark ? 'text-elastic-teal' : 'text-elastic-blue'}>
                  unified platform.
                </span>
              </p>
            </div>
          ) : !selectedCard ? (
            <div className="min-h-[80px]" />
          ) : (
            // Selected Card Details
            <div className="flex flex-col items-center">
              {/* Detail Text */}
              <p className={`text-3xl font-medium max-w-5xl ${
                isDark ? 'text-white/90' : 'text-elastic-ink/90'
              }`}>
                {selectedCard.detailText}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const ProblemPatternsScene = ({ metadata = {} }) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [selectedFilter, setSelectedFilter] = useState('observability')

  // Default problem titles
  const defaultProblems = {
    observability: [
      'Disconnected logs, metrics, traces',
      'MTTR stays high despite lots of data',
      'Tool sprawl and cost pressure',
      'Weak correlation to customer impact'
    ],
    security: [
      'Alert fatigue and signal-to-noise ratio',
      'Blind spots across cloud and on-prem',
      'Tool sprawl and cost pressure',
      'Manual investigation slows response'
    ],
    search: [
      'Slow or irrelevant search results',
      'Limited semantic or vector search capabilities',
      'Tool sprawl and cost pressure',
      'Difficulty scaling search infrastructure'
    ]
  }

  // Use custom problems from metadata or defaults
  const customProblems = metadata.problems || {}
  
  const filters = [
    { 
      id: 'observability', 
      label: 'Observability', 
      icon: faChartLine,
      darkColor: 'from-pink-500 to-pink-600',
      lightColor: 'from-blue-500 to-blue-600',
      bulletColor: '#F04E98',
      textColor: 'text-pink-400'
    },
    { 
      id: 'security', 
      label: 'Security', 
      icon: faShield,
      darkColor: 'from-orange-500 to-orange-600',
      lightColor: 'from-blue-500 to-blue-600',
      bulletColor: '#F97316',
      textColor: 'text-orange-400'
    },
    { 
      id: 'search', 
      label: 'Search / Product', 
      icon: faSearch,
      darkColor: 'from-yellow-500 to-yellow-600',
      lightColor: 'from-blue-500 to-blue-600',
      bulletColor: '#EAB308',
      textColor: 'text-yellow-400'
    },
  ]

  const currentFilter = filters.find(f => f.id === selectedFilter)

  // Build problems array - use custom titles from metadata or defaults
  const problems = []
  
  // Observability problems
  for (let i = 0; i < 4; i++) {
    const customTitle = customProblems.observability?.[i]
    const defaultTitle = defaultProblems.observability[i]
    problems.push({
      id: `obs-${i}`,
      number: String(i + 1).padStart(2, '0'),
      title: customTitle || defaultTitle,
      categories: ['observability']
    })
  }
  
  // Security problems
  for (let i = 0; i < 4; i++) {
    const customTitle = customProblems.security?.[i]
    const defaultTitle = defaultProblems.security[i]
    problems.push({
      id: `sec-${i}`,
      number: String(i + 1).padStart(2, '0'),
      title: customTitle || defaultTitle,
      categories: ['security']
    })
  }
  
  // Search problems
  for (let i = 0; i < 4; i++) {
    const customTitle = customProblems.search?.[i]
    const defaultTitle = defaultProblems.search[i]
    problems.push({
      id: `search-${i}`,
      number: String(i + 1).padStart(2, '0'),
      title: customTitle || defaultTitle,
      categories: ['search']
    })
  }

  const filteredProblems = problems.filter(p => p.categories.includes(selectedFilter))

  return (
    <div className="flex flex-col items-center justify-center h-full w-full py-12 overflow-y-auto">
      <div className="w-full max-w-[1400px] px-8">
        {/* Header */}
        <div className="text-center">
          <p className={`text-sm font-semibold uppercase tracking-eyebrow pt-8 mb-4 ${
            isDark ? 'text-elastic-teal' : 'text-elastic-blue'
          }`}>
            PROBLEM ORIENTATION
          </p>
          <h2 className="font-headline text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            <span className={isDark ? 'text-white' : 'text-elastic-dark-ink'}>Common </span>
            <span className={isDark ? 'text-elastic-teal' : 'text-elastic-blue'}>
              Problem Patterns
            </span>
          </h2>
          <p className={`text-paragraph text-lg md:text-xl mx-auto pt-1 pb-8 ${isDark ? 'text-elastic-light-grey' : 'text-elastic-ink'}`}>
            Elastic is broad, so rather than walk through everything, let's orient around the problems teams typically solve with it.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`flex items-center gap-3 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 ${
                selectedFilter === filter.id
                  ? `bg-gradient-to-r ${isDark ? filter.darkColor : filter.lightColor} text-white scale-105 ${!isDark ? 'shadow-lg' : ''}`
                  : isDark
                    ? 'bg-white/[0.05] text-white/60 hover:bg-white/[0.08] hover:text-white/80'
                    : 'bg-white/50 text-elastic-ink/60 hover:bg-white hover:text-elastic-ink shadow'
              }`}
            >
              <FontAwesomeIcon icon={filter.icon} />
              <span>{filter.label}</span>
            </button>
          ))}
        </div>

        {/* Problem Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProblems.map((problem) => (
            <div
              key={problem.id}
              className={`rounded-2xl p-8 pr-20 transition-all duration-300 border-2 relative ${
                isDark
                  ? 'bg-white/[0.03] hover:bg-white/[0.05]'
                  : 'bg-white hover:shadow-lg'
              }`}
              style={{
                borderColor: isDark ? currentFilter.bulletColor : '#0B64DD'
              }}
            >
              <div className="flex items-start gap-6">
                {/* Bullet Point */}
                <div 
                  className="flex-shrink-0 w-3 h-3 rounded-full mt-2" 
                  style={{ backgroundColor: isDark ? currentFilter.bulletColor : '#0B64DD' }} 
                />
                
                {/* Content */}
                <div className="flex-1">
                  <h3 className={`text-2xl font-bold mb-2 ${
                    isDark ? 'text-white' : 'text-elastic-dark-ink'
                  }`}>
                    {problem.title}
                  </h3>
                </div>
              </div>

              {/* Number Badge - Circular */}
              <div 
                className="absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center text-sm font-mono font-semibold"
                style={{
                  backgroundColor: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(11, 100, 221, 0.1)',
                  color: isDark ? currentFilter.bulletColor : '#0B64DD'
                }}
              >
                {problem.number}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const AgendaScene = ({ scenes = [], sceneMetadata = {}, customDurations = {} }) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  
  // Build agenda items from scenes, grouping by group field
  const agendaItems = []
  const processedGroups = new Set()
  const accentColors = ['#0B64DD', '#48EFCF', '#F04E98', '#FEC514', '#FF957D']

  scenes.forEach((scene) => {
    if (scene.id === 'hero' || scene.id === 'agenda') return
    
    const metadata = sceneMetadata?.[scene.id] || {}
    const group = metadata.group
    const duration = customDurations?.[scene.id] || scene.duration || ''
    
    if (group) {
      // This scene is part of a group
      if (!processedGroups.has(group)) {
        // Add the group to agenda using group name as title
        // Capitalize first letter of each word in group name
        const groupTitle = group
          .split(/[-_\s]+/)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
        
        agendaItems.push({
          id: `group-${group}`,
          title: groupTitle,
          description: metadata.description || '',
          duration: duration,
          isGroup: true,
          groupName: group
        })
        processedGroups.add(group)
      }
    } else {
      // Individual scene - use custom title or default
      agendaItems.push({
        id: scene.id,
        title: metadata.title || scene.title,
        description: metadata.description || scene.description || '',
        duration: duration,
        isGroup: false
      })
    }
  })

  return (
    <div className="flex flex-col items-center justify-center h-full w-full py-12 overflow-y-auto">
      <div className="w-full max-w-[900px]">
        {/* Header */}
        <div className="text-center">
          <p className={`text-sm font-semibold uppercase tracking-eyebrow pt-8 mb-4 ${
            isDark ? 'text-elastic-teal' : 'text-elastic-blue'
          }`}>
            OVERVIEW
          </p>
          <h2 className="font-headline text-4xl md:text-5xl font-extrabold mb-4">
            <span className={isDark ? 'text-white' : 'text-elastic-dark-ink'}>Today's </span>
            <span className={isDark ? 'text-elastic-teal' : 'text-elastic-blue'}>Agenda</span>
          </h2>
          <p className={`text-paragraph text-lg md:text-xl max-w-3xl mx-auto pt-1 pb-8 ${isDark ? 'text-elastic-light-grey' : 'text-elastic-ink'}`}>
            A roadmap for our conversation.
          </p>
        </div>

        {/* Agenda Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agendaItems.map((item, index) => (
            <div
              key={item.id}
              className={`relative rounded-xl p-4 transition-all duration-300 group ${
                isDark 
                  ? 'bg-white/[0.03] border border-white/10 hover:bg-white/[0.05]'
                  : 'bg-white border border-elastic-dev-blue/10 hover:border-elastic-blue/20 hover:shadow-md'
              }`}
            >
              {/* Left accent bar */}
              <div
                className="absolute left-0 top-4 bottom-4 w-1 rounded-r"
                style={{ backgroundColor: isDark ? accentColors[index % accentColors.length] : '#0B64DD' }}
              />
              
              <div className="flex items-start justify-between gap-4 pl-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Number */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-white/[0.05]' : 'bg-elastic-blue/[0.05]'
                  }`}>
                    <span className={`text-xs font-mono ${
                      isDark ? 'text-white/50' : 'text-elastic-blue/50'
                    }`}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-1">
                    <h3 className={`font-bold text-lg mb-1 ${
                      isDark ? 'text-white' : 'text-elastic-dark-ink'
                    }`}>
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className={`text-sm leading-relaxed ${
                        isDark ? 'text-white/60' : 'text-elastic-ink/70'
                      }`}>
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Duration */}
                {item.duration && (
                  <div className={`flex-shrink-0 text-sm font-medium pt-1 ${
                    isDark ? 'text-white/50' : 'text-elastic-blue/50'
                  }`}>
                    {item.duration}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AppContent() {
  const { theme, toggleTheme } = useTheme()
  
  const allScenes = [
    { 
      id: 'hero', 
      component: HeroScene, 
      title: 'Hero', 
      duration: '2 min',
      description: ''
    },
    { 
      id: 'agenda', 
      component: AgendaScene, 
      title: 'Agenda', 
      duration: '5 min',
      description: ''
    },
    { 
      id: 'team', 
      component: TeamScene, 
      title: 'Team Introductions', 
      duration: '4 min',
      description: 'The people here to support you'
    },
    { 
      id: 'about', 
      component: AboutScene, 
      title: 'About Elastic', 
      duration: '3 min',
      description: 'Who we are and what we do'
    },
    { 
      id: 'business-value', 
      component: BusinessValueScene, 
      title: 'Desired Outcomes', 
      duration: '4 min',
      description: 'Key areas where Elastic delivers value'
    },
    { 
      id: 'problem-patterns', 
      component: ProblemPatternsScene, 
      title: 'Problem Patterns', 
      duration: '5 min',
      description: 'Common challenges teams solve with Elastic'
    },
    { 
      id: 'unified-strategy', 
      component: UnifiedStrategyScene, 
      title: 'Platform Overview', 
      duration: '4 min',
      description: 'All your data, real-time, at scale'
    },
    {
      id: 'data-explosion',
      component: DataExplosionSceneV2,
      title: 'Data Explosion',
      duration: '3 min',
      description: 'The unprecedented scale of modern data'
    },
    {
      id: 'data-mesh',
      component: DataMeshScene,
      title: 'Data Mesh',
      duration: '4 min',
      description: 'From data chaos to clarity — the Elastic data mesh story'
    },
    {
      id: 'cross-cluster',
      component: CrossClusterScene,
      title: 'Cross-Cluster',
      duration: '3 min',
      description: 'Distributed search and replication across environments'
    },
    {
      id: 'security',
      component: SecurityScene,
      title: 'Security',
      duration: '4 min',
      description: 'AI-driven security operations: attack discovery, investigation, and automated response'
    },
    {
      id: 'schema',
      component: SchemaScene,
      title: 'Schema',
      duration: '2 min',
      description: 'Schema on Read vs Schema on Write — why ECS matters'
    },
    {
      id: 'access-control',
      component: AccessControlSceneDev,
      title: 'Access Control',
      duration: '3 min',
      description: 'Role and attribute-based controls — every user sees exactly what they need'
    },
    {
      id: 'data-tiering',
      component: DataTieringScene,
      title: 'Data Tiering',
      duration: '3 min',
      description: 'Hot, warm, cold, and frozen — intelligent lifecycle management for your data'
    },
    {
      id: 'licensing',
      component: LicensingScene,
      title: 'Licensing',
      duration: '3 min',
      description: 'Subscription tiers and what comes with each'
    },
    {
      id: 'consolidation',
      component: ConsolidationScene,
      title: 'Consolidation',
      duration: '3 min',
      description: 'Replace fragmented tooling with a unified Elastic platform'
    },
  ]

  const {
    enabledScenes,
    enabledSceneIds,
    orderedScenes,
    customDurations,
    sceneMetadata,
    toggleScene,
    updateDuration,
    updateSceneMetadata,
    updateOrder,
    resetToDefault
  } = useSceneConfiguration(allScenes)

  const navigate = useNavigate()
  const location = useLocation()

  const scenes = enabledScenes

  const sceneIdFromUrl = location.pathname.slice(1)
  const currentScene = (() => {
    const idx = scenes.findIndex(s => s.id === sceneIdFromUrl)
    return idx >= 0 ? idx : 0
  })()

  // Redirect to first enabled scene if URL is missing or unrecognised
  useEffect(() => {
    const idx = scenes.findIndex(s => s.id === sceneIdFromUrl)
    if (idx === -1 && scenes.length > 0) {
      navigate(`/${scenes[0].id}`, { replace: true })
    }
  }, [sceneIdFromUrl, scenes, navigate])

  const navigateToScene = (index) => {
    const clamped = Math.max(0, Math.min(index, scenes.length - 1))
    navigate(`/${scenes[clamped].id}`)
  }

  const [settingsOpen, setSettingsOpen] = useState(false)
  const [securityStage, setSecurityStage] = useState(0)
  const [securityPlaySignal, setSecurityPlaySignal] = useState(0)
  const [securityAlertPhase, setSecurityAlertPhase] = useState('idle')
  const [securityPhaseSignal, setSecurityPhaseSignal] = useState(0)
  const [schemaPlaySignal, setSchemaPlaySignal] = useState(0)
  const [schemaStage, setSchemaStage] = useState(0)
  const SECURITY_STAGE_COUNT = 3
  const SCHEMA_STAGE_COUNT = 2
  const [businessValueSelectedCard, setBusinessValueSelectedCard] = useState(null)
  const [businessValueShowUnified, setBusinessValueShowUnified] = useState(false)
  const [dataExplosionVerdictSignal, setDataExplosionVerdictSignal] = useState(0)
  const [dataMeshRunQuerySignal, setDataMeshRunQuerySignal] = useState(0)
  const [dataMeshQueryState, setDataMeshQueryState] = useState({ canRun: false, isRunning: false })
  const [dataMeshPlaySignal, setDataMeshPlaySignal] = useState(0)
  const [dataMeshPlayState, setDataMeshPlayState] = useState({ canPlay: false })
  const [dataMeshSummarySignal, setDataMeshSummarySignal] = useState(0)
  const [dataMeshSummaryState, setDataMeshSummaryState] = useState({ canToggle: false, isShowing: false })
  const [dataMeshActivateMeshSignal, setDataMeshActivateMeshSignal] = useState(0)
  const [dataMeshActivateMeshState, setDataMeshActivateMeshState] = useState({ canActivate: false })
  const [dataTieringIsRunning, setDataTieringIsRunning] = useState(false)
  const [dataTieringResetSignal, setDataTieringResetSignal] = useState(0)
  
  // Pass props to scenes
  const Scene = scenes[currentScene]?.component || HeroScene
  const currentSceneId = scenes[currentScene]?.id
  
  let sceneProps = {}
  if (currentSceneId === 'agenda') {
    sceneProps = { scenes: orderedScenes, sceneMetadata, customDurations }
  } else if (currentSceneId === 'hero') {
    sceneProps = { metadata: sceneMetadata?.hero || {} }
  } else if (currentSceneId === 'about') {
    sceneProps = { metadata: sceneMetadata?.about || {} }
  } else if (currentSceneId === 'business-value') {
    sceneProps = {
      selectedCard: businessValueSelectedCard,
      setSelectedCard: setBusinessValueSelectedCard,
      showUnifiedMessage: businessValueShowUnified,
      setShowUnifiedMessage: setBusinessValueShowUnified
    }
  } else if (currentSceneId === 'problem-patterns') {
    sceneProps = { metadata: sceneMetadata?.['problem-patterns'] || {} }
  } else if (currentSceneId === 'unified-strategy') {
    sceneProps = { metadata: sceneMetadata?.['unified-strategy'] || {} }
  } else if (currentSceneId === 'data-explosion') {
    sceneProps = {
      metadata: sceneMetadata?.['data-explosion'] || {},
      verdictSignal: dataExplosionVerdictSignal,
    }
  } else if (currentSceneId === 'data-mesh') {
    sceneProps = {
      scenes: enabledScenes,
      onNavigate: (i) => navigateToScene(i),
      metadata: sceneMetadata?.['data-mesh'] || {},
      runQuerySignal: dataMeshRunQuerySignal,
      onQueryStateChange: setDataMeshQueryState,
      playSignal: dataMeshPlaySignal,
      onPlayStateChange: setDataMeshPlayState,
      summarySignal: dataMeshSummarySignal,
      onSummaryStateChange: setDataMeshSummaryState,
      activateMeshSignal: dataMeshActivateMeshSignal,
      onActivateMeshStateChange: setDataMeshActivateMeshState,
    }
  } else if (currentSceneId === 'cross-cluster') {
    sceneProps = { metadata: sceneMetadata?.['cross-cluster'] || {} }
  } else if (currentSceneId === 'security') {
    sceneProps = {
      externalStage: securityStage,
      onStageChange: setSecurityStage,
      playSignal: securityPlaySignal,
      phaseAdvanceSignal: securityPhaseSignal,
      onAlertPhaseChange: setSecurityAlertPhase,
    }
  } else if (currentSceneId === 'schema') {
    sceneProps = {
      externalStage: schemaStage,
      onStageChange: setSchemaStage,
      playSignal: schemaPlaySignal,
      metadata: sceneMetadata?.schema || {},
    }
  } else if (currentSceneId === 'access-control') {
    sceneProps = {
      metadata: sceneMetadata?.['access-control'] || {},
    }
  } else if (currentSceneId === 'data-tiering') {
    sceneProps = {
      isRunning: dataTieringIsRunning,
      setIsRunning: setDataTieringIsRunning,
      resetSignal: dataTieringResetSignal,
    }
  } else if (currentSceneId === 'consolidation') {
    sceneProps = {
      tools: sceneMetadata?.consolidation?.tools,
      metadata: sceneMetadata?.consolidation || {},
    }
  }

  const handleNext = () => {
    if (currentSceneId === 'security' && securityStage < SECURITY_STAGE_COUNT - 1) {
      setSecurityStage(s => s + 1)
    } else if (currentSceneId === 'schema' && schemaStage < SCHEMA_STAGE_COUNT - 1) {
      setSchemaStage(s => s + 1)
    } else {
      setSecurityStage(0)
      setSchemaStage(0)
      navigateToScene(currentScene + 1)
    }
  }

  const handlePrev = () => {
    if (currentSceneId === 'security' && securityStage > 0) {
      setSecurityStage(s => s - 1)
    } else if (currentSceneId === 'schema' && schemaStage > 0) {
      setSchemaStage(s => s - 1)
    } else {
      setSecurityStage(0)
      setSchemaStage(0)
      navigateToScene(currentScene - 1)
    }
  }

  // Reset scene-specific state when navigating away
  useEffect(() => {
    if (currentSceneId !== 'business-value') {
      setBusinessValueSelectedCard(null)
      setBusinessValueShowUnified(false)
    }
    if (currentSceneId !== 'data-explosion') {
      setDataExplosionVerdictSignal(0)
    }
    if (currentSceneId !== 'security') {
      setSecurityStage(0)
      setSecurityPlaySignal(0)
      setSecurityAlertPhase('idle')
      setSecurityPhaseSignal(0)
    }
    if (currentSceneId !== 'schema') {
      setSchemaPlaySignal(0)
      setSchemaStage(0)
    }
  }, [currentSceneId])

  return (
    <div className="min-h-screen bg-elastic-light-grey dark:bg-elastic-dev-blue transition-colors duration-300">
      {/* Scene Settings */}
      <SceneSettings
        scenes={orderedScenes}
        enabledSceneIds={enabledSceneIds}
        customDurations={customDurations}
        sceneMetadata={sceneMetadata}
        onToggle={toggleScene}
        onUpdateDuration={updateDuration}
        onUpdateSceneMetadata={updateSceneMetadata}
        onUpdateOrder={updateOrder}
        onReset={resetToDefault}
        isOpen={settingsOpen}
        onOpenChange={setSettingsOpen}
      />

      {/* Scene Container */}
      <div className="h-[calc(100vh-120px)] flex items-center justify-center">
        <Scene {...sceneProps} />
      </div>
      
      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-elastic-light-grey dark:bg-elastic-dev-blue w-full py-4">
        <div className="flex items-center justify-between max-w-[95%] mx-auto">
          {/* Left: Theme Toggle and Settings */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 ${
                theme === 'dark' 
                  ? 'bg-elastic-teal/20 hover:bg-elastic-teal/30 text-elastic-teal' 
                  : 'bg-elastic-blue/10 hover:bg-elastic-blue/20 text-elastic-blue'
              }`}
              aria-label="Toggle theme"
            >
              <FontAwesomeIcon 
                icon={theme === 'dark' ? faSun : faMoon} 
                className="text-lg"
              />
            </button>
            
            <button
              onClick={() => setSettingsOpen(true)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 ${
                theme === 'dark' 
                  ? 'bg-elastic-teal/20 hover:bg-elastic-teal/30 text-elastic-teal' 
                  : 'bg-elastic-blue/10 hover:bg-elastic-blue/20 text-elastic-blue'
              }`}
              title="Settings"
            >
              <FontAwesomeIcon icon={faGear} className="text-lg" />
            </button>
            

            {/* Reveal button - only visible on Data Explosion scene */}
            {currentSceneId === 'data-explosion' && (
              <button
                onClick={() => setDataExplosionVerdictSignal(n => n + 1)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 ${
                  theme === 'dark'
                    ? 'bg-elastic-teal/20 hover:bg-elastic-teal/30 text-elastic-teal'
                    : 'bg-elastic-blue/10 hover:bg-elastic-blue/20 text-elastic-blue'
                }`}
                title="Reveal verdict"
              >
                <FontAwesomeIcon icon={faPlay} className="text-sm ml-0.5" />
              </button>
            )}

            {/* Play Button - only visible on Security scene, triggers current stage animation */}
            {currentSceneId === 'security' && (
              <button
                onClick={() => setSecurityPlaySignal(n => n + 1)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 ${
                  theme === 'dark'
                    ? 'bg-elastic-teal/20 hover:bg-elastic-teal/30 text-elastic-teal'
                    : 'bg-elastic-blue/10 hover:bg-elastic-blue/20 text-elastic-blue'
                }`}
                title="Play animation"
              >
                <FontAwesomeIcon icon={faPlay} className="text-sm ml-0.5" />
              </button>
            )}

            {/* Phase Advance Button - appears when correlation is running; advances to attack story cards */}
            {currentSceneId === 'security' && (securityAlertPhase === 'flooding' || securityAlertPhase === 'connecting') && (
              <button
                onClick={() => setSecurityPhaseSignal(n => n + 1)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 ${
                  theme === 'dark'
                    ? 'bg-elastic-teal/20 hover:bg-elastic-teal/30 text-elastic-teal border border-elastic-teal/30 glow-delayed-dark'
                    : 'bg-elastic-blue/10 hover:bg-elastic-blue/20 text-elastic-blue border border-elastic-blue/20 glow-delayed-light'
                }`}
                title="Show attack story cards"
              >
                <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
              </button>
            )}

            {/* Play Button - only visible on Data Mesh scene stage 0 before typing starts */}
            {currentSceneId === 'data-mesh' && dataMeshPlayState.canPlay && (
              <button
                onClick={() => setDataMeshPlaySignal(n => n + 1)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 ${
                  theme === 'dark'
                    ? 'bg-elastic-teal/20 hover:bg-elastic-teal/30 text-elastic-teal'
                    : 'bg-elastic-blue/10 hover:bg-elastic-blue/20 text-elastic-blue'
                }`}
                title="Play typing animation"
              >
                <FontAwesomeIcon icon={faPlay} className="text-sm ml-0.5" />
              </button>
            )}

            {/* Run Query Button - only visible on Data Mesh scene when stage 4 and mesh is active */}
            {currentSceneId === 'data-mesh' && dataMeshQueryState.canRun && (
              <button
                onClick={() => setDataMeshRunQuerySignal(n => n + 1)}
                disabled={dataMeshQueryState.isRunning}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 disabled:opacity-50 ${
                  theme === 'dark'
                    ? 'bg-elastic-teal/20 hover:bg-elastic-teal/30 text-elastic-teal'
                    : 'bg-elastic-blue/10 hover:bg-elastic-blue/20 text-elastic-blue'
                }`}
                title={dataMeshQueryState.isRunning ? 'Running Query…' : 'Run Query'}
              >
                <FontAwesomeIcon
                  icon={dataMeshQueryState.isRunning ? faBolt : faPlay}
                  className={`text-sm ml-0.5 ${dataMeshQueryState.isRunning ? 'animate-pulse' : ''}`}
                />
              </button>
            )}

            {/* Activate Mesh Button - Data Mesh stage 4 before mesh is active */}
            {currentSceneId === 'data-mesh' && dataMeshActivateMeshState.canActivate && (
              <button
                onClick={() => setDataMeshActivateMeshSignal(n => n + 1)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 ${
                  theme === 'dark'
                    ? 'bg-elastic-teal/20 hover:bg-elastic-teal/30 text-elastic-teal'
                    : 'bg-elastic-blue/10 hover:bg-elastic-blue/20 text-elastic-blue'
                }`}
                title="Activate Mesh"
              >
                <FontAwesomeIcon icon={faCircleNodes} className="text-sm" />
              </button>
            )}

            {/* Compare All Button - Data Mesh stage 3 */}
            {currentSceneId === 'data-mesh' && dataMeshSummaryState.canToggle && (
              <button
                onClick={() => setDataMeshSummarySignal(n => n + 1)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 ${
                  theme === 'dark'
                    ? 'bg-elastic-teal/20 hover:bg-elastic-teal/30 text-elastic-teal'
                    : 'bg-elastic-blue/10 hover:bg-elastic-blue/20 text-elastic-blue'
                }`}
                title={dataMeshSummaryState.isShowing ? 'Back to Cards' : 'Compare All'}
              >
                <FontAwesomeIcon icon={dataMeshSummaryState.isShowing ? faTimes : faLayerGroup} className="text-sm" />
              </button>
            )}

            {/* Start/Pause + Reset - Data Tiering scene */}
            {currentSceneId === 'data-tiering' && (
              <>
                <button
                  onClick={() => setDataTieringIsRunning(r => !r)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 ${
                    theme === 'dark'
                      ? 'bg-elastic-teal/20 hover:bg-elastic-teal/30 text-elastic-teal'
                      : 'bg-elastic-blue/10 hover:bg-elastic-blue/20 text-elastic-blue'
                  }`}
                  title={dataTieringIsRunning ? 'Pause' : 'Start Flow'}
                >
                  <FontAwesomeIcon icon={dataTieringIsRunning ? faPause : faPlay} className="text-sm ml-0.5" />
                </button>
                <button
                  onClick={() => { setDataTieringIsRunning(false); setDataTieringResetSignal(n => n + 1) }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 ${
                    theme === 'dark'
                      ? 'bg-elastic-teal/20 hover:bg-elastic-teal/30 text-elastic-teal'
                      : 'bg-elastic-blue/10 hover:bg-elastic-blue/20 text-elastic-blue'
                  }`}
                  title="Reset"
                >
                  <FontAwesomeIcon icon={faRotateRight} className="text-sm" />
                </button>
              </>
            )}

            {/* How Button - only visible on Business Value scene when card is selected and unified message not shown */}
            {currentSceneId === 'business-value' && businessValueSelectedCard && !businessValueShowUnified && (
              <button
                onClick={() => setBusinessValueShowUnified(true)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 ${
                  theme === 'dark' 
                    ? 'bg-elastic-teal/20 hover:bg-elastic-teal/30 text-elastic-teal glow-once-dark' 
                    : 'bg-elastic-blue/10 hover:bg-elastic-blue/20 text-elastic-blue glow-once-light'
                }`}
                title="Show unified platform message"
              >
                <FontAwesomeIcon icon={faForwardStep} className="text-lg" />
              </button>
            )}
          </div>
          
          {/* Right: Navigation Controls */}
          <div className="flex items-center gap-6">
            <button 
              onClick={handlePrev} 
              disabled={currentScene === 0 && (currentSceneId !== 'security' || securityStage === 0) && (currentSceneId !== 'schema' || schemaStage === 0)}
              className={`text-sm font-medium transition-all hover:scale-105 ${
                (currentScene === 0 && (currentSceneId !== 'security' || securityStage === 0) && (currentSceneId !== 'schema' || schemaStage === 0))
                  ? 'opacity-30 cursor-not-allowed'
                  : theme === 'dark'
                    ? 'text-white/60 hover:text-white'
                    : 'text-elastic-ink/60 hover:text-elastic-dark-ink'
              }`}
            >
              Previous
            </button>
            
            {/* Scene Dots */}
            <div className="flex gap-3">
              {scenes.map((scene, index) => (
                <div key={scene.id} className="relative group flex flex-col items-center">
                  <button
                    onClick={() => navigateToScene(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentScene 
                        ? 'bg-elastic-blue dark:bg-elastic-teal scale-125' 
                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                    }`}
                    aria-label={`Go to ${scene.title}`}
                  />
                  <span className={`pointer-events-none absolute top-full mt-2 whitespace-nowrap text-xs px-2 py-1 rounded-md border opacity-0 group-hover:opacity-100 transition-opacity duration-150 ${theme === 'dark' ? 'bg-elastic-dev-blue/95 text-white/80 border-white/10' : 'bg-white/95 text-elastic-dark-ink/80 border-elastic-dev-blue/10'} shadow-md`}>
                    {scene.title}
                  </span>
                </div>
              ))}
            </div>
            
            <button 
              onClick={handleNext} 
              disabled={currentScene === scenes.length - 1 && (currentSceneId !== 'security' || securityStage === SECURITY_STAGE_COUNT - 1) && (currentSceneId !== 'schema' || schemaStage === SCHEMA_STAGE_COUNT - 1)}
              className={`text-sm font-medium transition-all hover:scale-105 ${
                (currentScene === scenes.length - 1 && (currentSceneId !== 'security' || securityStage === SECURITY_STAGE_COUNT - 1) && (currentSceneId !== 'schema' || schemaStage === SCHEMA_STAGE_COUNT - 1))
                  ? 'opacity-30 cursor-not-allowed'
                  : theme === 'dark'
                    ? 'text-white/60 hover:text-white'
                    : 'text-elastic-ink/60 hover:text-elastic-dark-ink'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </nav>
      
      {/* Progress Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
        <div 
          className="h-full bg-elastic-blue dark:bg-elastic-teal transition-all duration-500"
          style={{ width: `${((currentScene + 1) / scenes.length) * 100}%` }}
        />
      </div>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <TeamProvider>
        <AppContent />
      </TeamProvider>
    </ThemeProvider>
  )
}

export default App
