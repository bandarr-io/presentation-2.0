import { createContext, useContext, useState, useEffect } from 'react'

const TeamContext = createContext()
const TEAM_STORAGE_KEY = 'presentation-team-config'

const DEFAULT_TEAM_CONFIG = {
  title: 'Meet Your Elastic Team',
  subtitle: 'Our dedicated team is here to support your success.',
  members: [
    {
      id: 'member-1',
      name: 'Cat Owens',
      role: 'Senior Account Executive',
      email: 'cat.owens@elastic.co',
      phone: '202.360.9384',
      color: '#48EFCF',
      initials: 'CO',
      photo: 'photos/cat-profile.jpeg'
    },
    {
      id: 'member-2',
      name: 'Daniel Barr',
      role: 'Senior Solutions Architect',
      email: 'daniel.barr@elastic.co',
      phone: '914.619.6230',
      color: '#0B64DD',
      initials: 'DB',
      photo: 'photos/dan-profile.jpeg'
    },
    {
      id: 'member-3',
      name: 'Gene Kent',
      role: 'RVP Defense Industrial Base',
      email: 'gene.kent@elastic.co',
      phone: '813.205.6097',
      color: '#F04E98',
      initials: 'GK',
      photo: 'photos/gene-profile.jpeg'
    },
    {
      id: 'member-4',
      name: 'Matt Wall',
      role: 'Sr. Regional Service Provider',
      email: 'matthew.wall@elastic.co',
      phone: '831.756.6386',
      color: '#FEC514',
      initials: 'MW',
      photo: 'photos/matt-profile.jpeg'
    }
  ]
}

export function TeamProvider({ children }) {
  const [teamConfig, setTeamConfig] = useState(() => {
    const saved = localStorage.getItem(TEAM_STORAGE_KEY)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return DEFAULT_TEAM_CONFIG
      }
    }
    return DEFAULT_TEAM_CONFIG
  })

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(teamConfig))
  }, [teamConfig])

  const updateTeamConfig = (newConfig) => {
    setTeamConfig(newConfig)
  }

  const resetTeamConfig = () => {
    setTeamConfig(DEFAULT_TEAM_CONFIG)
  }

  return (
    <TeamContext.Provider value={{ 
      teamConfig, 
      updateTeamConfig, 
      resetTeamConfig,
      isLoading 
    }}>
      {children}
    </TeamContext.Provider>
  )
}

export function useTeamConfig() {
  const context = useContext(TeamContext)
  if (!context) {
    throw new Error('useTeamConfig must be used within a TeamProvider')
  }
  return context
}
