import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

const speakers = [
  { name: 'Dr. Erica Reuter', role: 'RVP, Solution Engineering, US Public Sector', org: 'Snowflake', moderator: true },
  { name: 'Andrew Alipanah', role: 'CISO', org: 'Orange County, California', note: 'Invited Pending Approval' },
  { name: 'Merlin Namuth', role: 'CISO', org: 'City and County of Denver, Colorado' },
  { name: 'Collin Hill', role: 'CIO', org: 'City of Indianapolis & Marion County, Indiana' },
  { name: 'Jared Pane', role: 'Senior Director Solutions Architecture', org: 'Elastic', highlight: true },
]

function PanelScene() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className="scene">
      <div className="max-w-5xl mx-auto w-full">
        {/* Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className={`text-eyebrow text-sm ${isDark ? 'text-elastic-teal' : 'text-elastic-blue'}`}>
            Featured Panel
          </span>
          <h2 className={`text-headline text-4xl md:text-5xl font-extrabold mt-4 leading-tight ${isDark ? 'text-white' : 'text-elastic-dark-ink'}`}>
            Understanding Security in Linking{' '}
            <span className="gradient-text">Infrastructure to Governing</span>
          </h2>
          <motion.div
            className={`inline-flex items-center gap-3 mt-5 px-5 py-2.5 rounded-full border ${
              isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white/80 border-elastic-dev-blue/10'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <svg className={`w-5 h-5 ${isDark ? 'text-elastic-teal' : 'text-elastic-blue'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-elastic-dev-blue'}`}>
              March 11, 2025
            </span>
            <span className={`text-sm ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>|</span>
            <span className={`text-sm ${isDark ? 'text-white/70' : 'text-elastic-ink'}`}>
              10:45 AM – 11:30 AM
            </span>
          </motion.div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Speakers */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 ${isDark ? 'text-elastic-teal' : 'text-elastic-blue'}`}>
              Speakers
            </h3>
            <div className="space-y-3">
              {speakers.map((speaker, index) => (
                <motion.div
                  key={speaker.name}
                  className={`relative p-4 rounded-xl border ${
                    speaker.highlight
                      ? isDark
                        ? 'bg-elastic-teal/10 border-elastic-teal/30'
                        : 'bg-elastic-blue/5 border-elastic-blue/20'
                      : isDark
                        ? 'bg-white/[0.03] border-white/10'
                        : 'bg-white/80 border-elastic-dev-blue/10'
                  }`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + index * 0.08 }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${
                          speaker.highlight
                            ? isDark ? 'text-elastic-teal' : 'text-elastic-blue'
                            : isDark ? 'text-white' : 'text-elastic-dark-ink'
                        }`}>
                          {speaker.name}
                        </span>
                        {speaker.moderator && (
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            isDark ? 'bg-white/10 text-white/60' : 'bg-elastic-dev-blue/10 text-elastic-dev-blue/60'
                          }`}>
                            Moderator
                          </span>
                        )}
                        {speaker.highlight && (
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            isDark ? 'bg-elastic-teal/20 text-elastic-teal' : 'bg-elastic-blue/10 text-elastic-blue'
                          }`}>
                            Elastic
                          </span>
                        )}
                      </div>
                      <p className={`text-xs mt-1 ${isDark ? 'text-white/50' : 'text-elastic-ink/70'}`}>
                        {speaker.role}, {speaker.org}
                      </p>
                    </div>
                  </div>
                  {speaker.note && (
                    <p className={`text-[10px] mt-1.5 italic ${isDark ? 'text-white/30' : 'text-elastic-ink/40'}`}>
                      {speaker.note}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 ${isDark ? 'text-elastic-teal' : 'text-elastic-blue'}`}>
              About This Panel
            </h3>
            <div className={`p-6 rounded-xl border ${
              isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white/80 border-elastic-dev-blue/10'
            }`}>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-white/70' : 'text-elastic-ink'}`}>
                Both <span className={`font-semibold ${isDark ? 'text-white' : 'text-elastic-dark-ink'}`}>Salt Typhoon</span> and{' '}
                <span className={`font-semibold ${isDark ? 'text-white' : 'text-elastic-dark-ink'}`}>Volt Typhoon</span> have
                showcased why it is important for cyber practitioners to think about securing their entire
                digital eco-system—both their operational and business networks and how they connect to the edge.
              </p>
              <p className={`text-sm leading-relaxed mt-4 ${isDark ? 'text-white/70' : 'text-elastic-ink'}`}>
                This panel will discuss the cybersecurity and governing implications of protecting an
                increasingly complicated and connected digital environment.
              </p>
            </div>

            {/* Key topics */}
            <motion.div
              className="mt-6 space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-elastic-teal' : 'text-elastic-blue'}`}>
                Key Topics
              </h3>
              {[
                'Securing operational & business networks end-to-end',
                'Infrastructure-to-edge cyber defense strategies',
                'Governing connected digital environments',
              ].map((topic, i) => (
                <motion.div
                  key={topic}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg ${
                    isDark ? 'bg-white/[0.02]' : 'bg-elastic-blue/[0.03]'
                  }`}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                >
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isDark ? 'bg-elastic-teal' : 'bg-elastic-blue'}`} />
                  <span className={`text-sm ${isDark ? 'text-white/60' : 'text-elastic-ink'}`}>{topic}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default PanelScene
