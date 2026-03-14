import { animate } from 'animejs'
import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBullseye, faWrench, faCircleCheck, faUsers, faGraduationCap, faGlobe, faMedal, faCalendarDays, faDesktop, faPlug, faFlask, faBook } from '@fortawesome/free-solid-svg-icons'
import { faPlaneDeparture } from '@fortawesome/free-solid-svg-icons/faPlaneDeparture'

const journeySteps = [
  { id: 'alignment', phase: '01', title: 'Executive Alignment', description: 'Business Priorities & Challenges', color: '#48EFCF' },
  { id: 'discovery', phase: '02', title: 'Use Case Discovery', description: 'Technical Requirements & Scope', color: '#0B64DD' },
  { id: 'validation', phase: '03', title: 'Technical Validation', description: 'Architecture Review & Pilot ', color: '#F04E98' },
  { id: 'value', phase: '04', title: 'Business Value Review', description: 'Quantifying Impact & ROI', color: '#FEC514' },
]

const deRiskingOptions = [
  { title: 'Free Trial', desc: '14-day full access', icon: faBullseye },
  { title: 'Workshop', desc: 'Hands-on with SAs', icon: faWrench },
  { title: 'Pilot', desc: 'Validate with your data', icon: faPlaneDeparture },
  { title: 'Review Customer Success Stories', desc: 'elastic.co/customers', icon: faUsers },
  { title: 'Get Hands-on with Demos', desc: 'elastic.co/demo-gallery', icon: faDesktop },
  { title: 'Explore Integrations', desc: 'elastic.co/integrations', icon: faPlug },
  { title: 'Explore Our Labs', desc: 'Search, Security & Observability', icon: faFlask },
  { title: 'Read Our Docs', desc: 'elastic.co/docs', icon: faBook },
  { title: 'Get Trained Up', desc: 'elastic.co/training', icon: faGraduationCap },
  { title: 'Access Our Veterans Resources', desc: 'elastic.co/veterans', icon: faMedal },
  { title: 'Register for Events', desc: 'elastic.co/events', icon: faCalendarDays },
  { title: 'Learn More', desc: 'elastic.co', icon: faGlobe },
]

function NextStepsScene() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [activeStep, setActiveStep] = useState(0)

  return (
    <div className="scene !py-4">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div
          className="text-center"
        >
          <span className={`text-eyebrow text-sm ${isDark ? 'text-elastic-teal' : 'text-elastic-blue'}`}>
            Your Journey
          </span>
          <h2 className={`text-headline text-4xl md:text-5xl font-extrabold mt-2 ${isDark ? 'text-white' : 'text-elastic-dark-ink'}`}>
            Let's Get <span className="gradient-text">Started</span>
          </h2>
        </div>

        {/* Journey timeline */}
        <div className="relative mb-8">
          {/* Connection line */}
          <div
            className={`absolute top-7 left-0 right-0 h-0.5 hidden md:block ${isDark ? 'bg-white/10' : 'bg-elastic-dev-blue/10'}`}
          />
          
          {/* Progress line */}
          <div
            className={`absolute top-7 left-0 h-0.5 hidden md:block ${isDark ? 'bg-gradient-to-r from-elastic-teal via-elastic-blue to-elastic-pink' : 'bg-gradient-to-r from-elastic-dev-blue via-elastic-blue to-elastic-blue'}`}
%` }}
          />

          <div className="grid md:grid-cols-4 gap-4">
            {journeySteps.map((step, index) => (
              <div
                key={step.id}
                className="relative"
}
              >
                {/* Step indicator */}
                <button
                  className={`relative z-10 w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center border-2 transition-all ${
                    index <= activeStep
                      ? 'border-transparent'
                      : isDark ? 'border-white/20 bg-elastic-dev-blue' : 'border-elastic-dev-blue/20 bg-white'
                  }`}
                  style={{ backgroundColor: index <= activeStep ? step.color : undefined }}
                  onClick={() => setActiveStep(index)}
                >
                  <span className={`text-base font-mono font-bold ${index <= activeStep ? 'text-white' : isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>
                    {step.phase}
                  </span>
                  {index === activeStep && (
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: step.color }}
                    />
                  )}
                </button>

                {/* Step content */}
                <div
                  className={`text-center px-3 py-2 rounded-xl transition-all ${
                    index === activeStep ? isDark ? 'bg-white/5' : 'bg-elastic-blue/5' : ''
                  }`}
                >
                  <h3 className={`text-lg font-semibold mb-1 transition-colors ${
                    index === activeStep 
                      ? isDark ? 'text-white' : 'text-elastic-dev-blue' 
                      : isDark ? 'text-white/70' : 'text-elastic-dev-blue/70'
                  }`}>
                    {step.title}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/60'}`}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* De-risking section */}
        <div
          className="mb-6"
}
        >
          <h3 className={`text-xl font-semibold text-center mb-3 ${isDark ? 'text-white/80' : 'text-elastic-dev-blue/80'}`}>
            Low-risk ways to explore
          </h3>
          <div className={`grid grid-cols-4 gap-2 p-4 rounded-2xl border ${
            isDark ? 'bg-white/[0.02] border-white/10' : 'bg-white/60 border-elastic-dev-blue/10'
          }`}>
            {deRiskingOptions.map((option, index) => (
              <div
                key={option.title}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm ${
                  isDark ? 'bg-white/5' : 'bg-white'
                }`}
              >
                <span className="text-base flex-shrink-0"><FontAwesomeIcon icon={option.icon} /></span>
                <div className="flex flex-col min-w-0">
                  <span className={`font-medium leading-tight ${isDark ? 'text-white/80' : 'text-elastic-dev-blue/80'}`}>{option.title}</span>
                  <span className={`text-xs truncate ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>{option.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Thank you message */}
        <div
          className="text-center"
}
        >
          <img 
            src={isDark 
              ? "/Elastic-Logo-tagline-secondary-white.svg" 
              : "/Elastic-Logo-tagline-secondary-black.png"
            }
            alt="Elastic - The Search AI Company" 
            className="h-12 w-auto mx-auto"
          />
        </div>
      </div>
    </div>
  )
}

export default NextStepsScene
