import { useState, useEffect, useRef } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useTeamConfig } from '../context/TeamContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faGear, faXmark, faEye, faEyeSlash, faRotateLeft, faClock, faCheck,
  faUsers, faSliders, faPlus, faTrash, faGripVertical, faChevronDown,
  faDownload, faUpload, faImage, faPalette
} from '@fortawesome/free-solid-svg-icons'

const STORAGE_KEY = 'presentation-scene-config'

export function useSceneConfiguration(initialScenes) {
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return {
          enabledIds: initialScenes.map(s => s.id),
          durations: {},
          sceneMetadata: {},
          order: initialScenes.map(s => s.id)
        }
      }
    }
    return {
      enabledIds: initialScenes.map(s => s.id),
      durations: {},
      sceneMetadata: {},
      order: initialScenes.map(s => s.id)
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  }, [config])

  const toggleScene = (sceneId) => {
    setConfig(prev => {
      if (prev.enabledIds.includes(sceneId)) {
        if (prev.enabledIds.length <= 1) return prev
        return { ...prev, enabledIds: prev.enabledIds.filter(id => id !== sceneId) }
      }
      return { ...prev, enabledIds: [...prev.enabledIds, sceneId] }
    })
  }

  const updateDuration = (sceneId, duration) => {
    setConfig(prev => ({
      ...prev,
      durations: { ...prev.durations, [sceneId]: duration }
    }))
  }

  const updateSceneMetadata = (sceneId, metadata) => {
    setConfig(prev => ({
      ...prev,
      sceneMetadata: {
        ...(prev.sceneMetadata || {}),
        [sceneId]: {
          ...(prev.sceneMetadata?.[sceneId] || {}),
          ...metadata
        }
      }
    }))
  }

  const updateOrder = (newOrder) => {
    setConfig(prev => ({
      ...prev,
      order: newOrder
    }))
  }

  const resetToDefault = () => {
    setConfig({
      enabledIds: initialScenes.map(s => s.id),
      durations: {},
      sceneMetadata: {},
      order: initialScenes.map(s => s.id)
    })
  }

  // Build ordered scenes
  const order = config.order || initialScenes.map(s => s.id)
  const orderedScenes = order
    .map(id => initialScenes.find(s => s.id === id))
    .filter(Boolean)
  
  // Add any new scenes not in the order
  initialScenes.forEach(scene => {
    if (!orderedScenes.find(s => s.id === scene.id)) {
      orderedScenes.push(scene)
    }
  })

  const enabledScenes = orderedScenes
    .filter(s => config.enabledIds.includes(s.id))
    .map(s => ({
      ...s,
      ...(config.sceneMetadata?.[s.id] || {}),
      duration: config.durations?.[s.id] || s.duration
    }))

  return {
    enabledSceneIds: config.enabledIds,
    enabledScenes,
    orderedScenes,
    customDurations: config.durations,
    sceneMetadata: config.sceneMetadata || {},
    toggleScene,
    updateDuration,
    updateSceneMetadata,
    updateOrder,
    resetToDefault
  }
}

const DEFAULT_TOOLS = [
  { name: 'Splunk',      category: 'SIEM',      type: 'consolidate' },
  { name: 'QRadar',      category: 'SIEM',      type: 'consolidate' },
  { name: 'Datadog',     category: 'APM',       type: 'consolidate' },
  { name: 'CrowdStrike', category: 'EDR',       type: 'consolidate' },
  { name: 'Snowflake',   category: 'Data',      type: 'consolidate' },
  { name: 'Pinecone',    category: 'Vector',    type: 'consolidate' },
  { name: 'Palo Alto',   category: 'Firewall',  type: 'integrate'   },
  { name: 'Okta',        category: 'Identity',  type: 'integrate'   },
  { name: 'ServiceNow',  category: 'ITSM',      type: 'integrate'   },
  { name: 'Tines',       category: 'SOAR',      type: 'integrate'   },
  { name: 'Zscaler',     category: 'ZeroTrust', type: 'integrate'   },
  { name: 'Databricks',  category: 'Analytics', type: 'integrate'   },
]

function ConsolidationToolEditor({ metadata, onUpdate, isDark, inputClass }) {
  const tools = metadata.tools || DEFAULT_TOOLS

  const updateTool = (index, field, value) => {
    const updated = tools.map((t, i) => i === index ? { ...t, [field]: value } : t)
    onUpdate(updated)
  }

  const addTool = (type) => {
    if (tools.length >= 12) return
    onUpdate([...tools, { name: '', category: '', type }])
  }

  const removeTool = (index) => {
    onUpdate(tools.filter((_, i) => i !== index))
  }

  const resetTools = () => onUpdate(DEFAULT_TOOLS)

  const labelClass = `text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`
  const typeBtn = (tool, index, type) => (
    <button
      key={type}
      onClick={() => updateTool(index, 'type', type)}
      className={`px-2 py-0.5 rounded text-xs font-medium transition-all ${
        tool.type === type
          ? isDark ? 'bg-elastic-teal text-elastic-dev-blue' : 'bg-elastic-blue text-white'
          : isDark ? 'bg-white/10 text-white/50 hover:bg-white/20' : 'bg-elastic-dev-blue/10 text-elastic-dev-blue/40 hover:bg-elastic-dev-blue/20'
      }`}
    >
      {type === 'consolidate' ? 'Replace' : 'Integrate'}
    </button>
  )

  return (
    <div className="pt-3 space-y-3">
      <div className="flex items-center justify-between">
        <label className={labelClass}>Tools ({tools.length}/12)</label>
        <button onClick={resetTools} className={`text-xs px-2 py-0.5 rounded ${isDark ? 'text-white/40 hover:text-white/70' : 'text-elastic-dev-blue/40 hover:text-elastic-dev-blue/70'}`}>
          Reset defaults
        </button>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 items-start">
        {/* Column headers */}
        <p className={`text-xs font-semibold ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>Replace</p>
        <p className={`text-xs font-semibold ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>Integrate</p>

        {/* Replace column */}
        <div className="space-y-2">
          {tools.map((tool, i) => tool.type !== 'consolidate' ? null : (
            <div key={i} className={`p-2 rounded-lg border ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-elastic-dev-blue/[0.02] border-elastic-dev-blue/10'}`}>
              <input
                type="text"
                value={tool.name}
                onChange={(e) => updateTool(i, 'name', e.target.value)}
                placeholder="Tool name"
                className={`w-full px-2 py-1 text-xs rounded border mb-1.5 ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-white/30' : 'bg-white border-elastic-dev-blue/10 text-elastic-dev-blue placeholder-elastic-dev-blue/30'}`}
              />
              <input
                type="text"
                value={tool.category}
                onChange={(e) => updateTool(i, 'category', e.target.value)}
                placeholder="Category"
                className={`w-full px-2 py-1 text-xs rounded border ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-white/30' : 'bg-white border-elastic-dev-blue/10 text-elastic-dev-blue placeholder-elastic-dev-blue/30'}`}
              />
            </div>
          ))}
        </div>

        {/* Integrate column */}
        <div className="space-y-2">
          {tools.map((tool, i) => tool.type !== 'integrate' ? null : (
            <div key={i} className={`p-2 rounded-lg border ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-elastic-dev-blue/[0.02] border-elastic-dev-blue/10'}`}>
              <input
                type="text"
                value={tool.name}
                onChange={(e) => updateTool(i, 'name', e.target.value)}
                placeholder="Tool name"
                className={`w-full px-2 py-1 text-xs rounded border mb-1.5 ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-white/30' : 'bg-white border-elastic-dev-blue/10 text-elastic-dev-blue placeholder-elastic-dev-blue/30'}`}
              />
              <input
                type="text"
                value={tool.category}
                onChange={(e) => updateTool(i, 'category', e.target.value)}
                placeholder="Category"
                className={`w-full px-2 py-1 text-xs rounded border ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-white/30' : 'bg-white border-elastic-dev-blue/10 text-elastic-dev-blue placeholder-elastic-dev-blue/30'}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SceneItem({ 
  scene, 
  index, 
  isEnabled, 
  isLastEnabled, 
  onToggle, 
  customDuration, 
  onUpdateDuration,
  sceneMetadata,
  onUpdateSceneMetadata,
  onReorder,
  isDark 
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditingDuration, setIsEditingDuration] = useState(false)
  const [durationValue, setDurationValue] = useState(customDuration || scene.duration || '')
  const [isDragging, setIsDragging] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDurationSubmit = () => {
    onUpdateDuration(scene.id, durationValue)
    setIsEditingDuration(false)
  }

  const handleDragStart = (e) => {
    setIsDragging(true)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', scene.id)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const draggedId = e.dataTransfer.getData('text/plain')
    if (draggedId !== scene.id) {
      onReorder(draggedId, scene.id)
    }
  }

  const displayDuration = customDuration || scene.duration
  const metadata = sceneMetadata?.[scene.id] || {}
  const displayTitle = metadata.title || scene.title
  const displayDescription = metadata.description || ''
  const hasAgendaContent = scene.id !== 'hero'
  const hasExpandableContent = true // All scenes can be expanded now

  const inputClass = `w-full px-3 py-2 text-sm rounded-lg border ${
    isDark
      ? 'bg-white/5 border-white/10 text-white placeholder-white/30'
      : 'bg-white border-elastic-dev-blue/10 text-elastic-dev-blue placeholder-elastic-dev-blue/30'
  }`

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`rounded-xl transition-all ${
        isDragging ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
      } ${
        isDragOver ? (isDark ? 'ring-2 ring-elastic-teal' : 'ring-2 ring-elastic-blue') : ''
      } ${
        isEnabled
          ? isDark 
            ? 'bg-elastic-teal/20 border-2 border-elastic-teal/50' 
            : 'bg-elastic-blue/10 border-2 border-elastic-blue/30'
          : isDark
            ? 'bg-white/[0.03] border-2 border-transparent'
            : 'bg-elastic-dev-blue/[0.03] border-2 border-transparent'
      }`}
    >
      {/* Header - Always Visible */}
      <div className="p-4 flex items-center gap-3">
        {/* Drag Handle */}
        <div className={`cursor-grab active:cursor-grabbing p-1 ${
          isDark ? 'text-white/30 hover:text-white/60' : 'text-elastic-dev-blue/30 hover:text-elastic-dev-blue/60'
        }`}>
          <FontAwesomeIcon icon={faGripVertical} className="text-sm" />
        </div>
        {/* Toggle Button */}
        <button
          onClick={() => !isLastEnabled && onToggle(scene.id)}
          disabled={isLastEnabled}
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
            isEnabled
              ? isDark
                ? 'bg-elastic-teal text-elastic-dev-blue'
                : 'bg-elastic-blue text-white'
              : isDark ? 'bg-white/10 text-white/40 hover:bg-white/20' : 'bg-elastic-dev-blue/10 text-elastic-dev-blue/40 hover:bg-elastic-dev-blue/20'
          } ${isLastEnabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        >
          <FontAwesomeIcon icon={isEnabled ? faEye : faEyeSlash} className="text-sm" />
        </button>

        {/* Scene Info */}
        <button
          onClick={() => hasExpandableContent && setIsExpanded(!isExpanded)}
          className={`flex-1 min-w-0 text-left flex items-center gap-2 ${hasExpandableContent ? 'cursor-pointer' : ''}`}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className={`text-xs font-mono px-2 py-0.5 rounded ${
              isDark ? 'bg-white/10 text-white/50' : 'bg-elastic-dev-blue/10 text-elastic-dev-blue/50'
            }`}>
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className={`font-semibold truncate ${
                  isEnabled
                    ? isDark ? 'text-white' : 'text-elastic-dev-blue'
                    : isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'
                }`}>
                  {displayTitle}
                </h3>
                {metadata.group && (
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    isDark ? 'bg-elastic-blue/20 text-elastic-blue' : 'bg-elastic-blue/10 text-elastic-blue'
                  }`}>
                    {metadata.group}
                  </span>
                )}
              </div>
              {displayDescription && (
                <p className={`text-xs truncate mt-0.5 ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>
                  {displayDescription}
                </p>
              )}
            </div>
          </div>
          {hasExpandableContent && (
            <FontAwesomeIcon 
              icon={faChevronDown} 
              className={`text-xs transition-transform ${
                isExpanded ? 'rotate-180' : ''
              } ${
                isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'
              }`}
            />
          )}
        </button>

        {/* Duration Editor */}
        <div className="flex-shrink-0">
          {isEditingDuration ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={durationValue}
                onChange={(e) => setDurationValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleDurationSubmit()
                  if (e.key === 'Escape') setIsEditingDuration(false)
                }}
                onBlur={handleDurationSubmit}
                autoFocus
                className={`w-20 px-2 py-1 text-xs rounded border ${
                  isDark 
                    ? 'bg-white/10 border-white/20 text-white' 
                    : 'bg-white border-elastic-dev-blue/20 text-elastic-dev-blue'
                }`}
                placeholder="e.g. 5 min"
              />
              <button
                onClick={handleDurationSubmit}
                className={`w-6 h-6 rounded flex items-center justify-center ${
                  isDark ? 'bg-elastic-teal text-elastic-dev-blue' : 'bg-elastic-blue text-white'
                }`}
              >
                <FontAwesomeIcon icon={faCheck} className="text-xs" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingDuration(true)}
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-all ${
                isDark 
                  ? 'bg-white/10 text-white/50 hover:bg-white/20 hover:text-white/70' 
                  : 'bg-elastic-dev-blue/10 text-elastic-dev-blue/50 hover:bg-elastic-dev-blue/20'
              }`}
              title="Click to edit duration"
            >
              <FontAwesomeIcon icon={faClock} className="text-[10px]" />
              {displayDuration || 'Set time'}
            </button>
          )}
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className={`px-4 pb-4 pt-0 space-y-3 border-t ${isDark ? 'border-white/10' : 'border-elastic-dev-blue/10'}`}>
          {scene.id === 'hero' ? (
            // Hero Scene Fields
            <>
              <div className="pt-3">
                <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>
                  Typing Text
                </label>
                <input
                  type="text"
                  value={metadata.typingText || ''}
                  onChange={(e) => onUpdateSceneMetadata(scene.id, { ...metadata, typingText: e.target.value })}
                  className={inputClass}
                  placeholder="The Elastic Search AI Platform"
                />
                <p className={`text-xs mt-1 ${isDark ? 'text-white/30' : 'text-elastic-dev-blue/30'}`}>
                  Text that types out in the search bar animation
                </p>
              </div>
              
              <div>
                <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>
                  Banner Title
                </label>
                <input
                  type="text"
                  value={metadata.bannerTitle || ''}
                  onChange={(e) => onUpdateSceneMetadata(scene.id, { ...metadata, bannerTitle: e.target.value })}
                  className={inputClass}
                  placeholder="The Elastic Search AI Platform:"
                />
                <p className={`text-xs mt-1 ${isDark ? 'text-white/30' : 'text-elastic-dev-blue/30'}`}>
                  First line of the banner title
                </p>
              </div>
              
              <div>
                <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>
                  Banner Highlight Text
                </label>
                <input
                  type="text"
                  value={metadata.bannerHighlight || ''}
                  onChange={(e) => onUpdateSceneMetadata(scene.id, { ...metadata, bannerHighlight: e.target.value })}
                  className={inputClass}
                  placeholder="Transforming Data into Action"
                />
                <p className={`text-xs mt-1 ${isDark ? 'text-white/30' : 'text-elastic-dev-blue/30'}`}>
                  Second line (highlighted in gradient/blue)
                </p>
              </div>
              
              <div>
                <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>
                  Banner Subtitle
                </label>
                <input
                  type="text"
                  value={metadata.bannerSubtitle || ''}
                  onChange={(e) => onUpdateSceneMetadata(scene.id, { ...metadata, bannerSubtitle: e.target.value })}
                  className={inputClass}
                  placeholder="Unleash the Power of Real-Time Insights, Scale, and Innovation"
                />
                <p className={`text-xs mt-1 ${isDark ? 'text-white/30' : 'text-elastic-dev-blue/30'}`}>
                  Subtitle text below the main title
                </p>
              </div>
            </>
          ) : (
            // Agenda Scene Fields
            <>
              <div className="pt-3">
                <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>
                  Agenda Group
                </label>
                <input
                  type="text"
                  value={metadata.group || ''}
                  onChange={(e) => onUpdateSceneMetadata(scene.id, { group: e.target.value.toLowerCase() })}
                  className={inputClass}
                  placeholder="e.g. 'features' or 'security-features'"
                />
                <p className={`text-xs mt-1 ${isDark ? 'text-white/30' : 'text-elastic-dev-blue/30'}`}>
                  Group name will appear on agenda. Scenes with same group are combined. (e.g., "features" → "Features")
                </p>
              </div>
              {!metadata.group && (
            <div>
              <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>
                Agenda Title (Individual Scene)
              </label>
              <input
                type="text"
                value={displayTitle}
                onChange={(e) => onUpdateSceneMetadata(scene.id, { title: e.target.value })}
                className={inputClass}
                placeholder={scene.title}
              />
            </div>
          )}
              <div>
                <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>
                  Agenda Description {metadata.group && '(for group)'}
                </label>
                <input
                  type="text"
                  value={displayDescription}
                  onChange={(e) => onUpdateSceneMetadata(scene.id, { description: e.target.value })}
                  className={inputClass}
                  placeholder={metadata.group ? 'Description for the entire group' : 'Optional description'}
                />
                {metadata.group && (
                  <p className={`text-xs mt-1 ${isDark ? 'text-white/30' : 'text-elastic-dev-blue/30'}`}>
                    This description appears under "{metadata.group}" in the agenda
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}


function TeamEditorPanel({ isDark }) {
  const { teamConfig, updateTeamConfig, resetTeamConfig } = useTeamConfig()
  const fileInputRefs = useRef({})
  
  const inputClass = `w-full px-3 py-2 text-sm rounded-lg border ${
    isDark
      ? 'bg-white/5 border-white/10 text-white placeholder-white/30'
      : 'bg-white border-elastic-dev-blue/10 text-elastic-dev-blue placeholder-elastic-dev-blue/30'
  }`

  const handleMemberUpdate = (index, field, value) => {
    const newMembers = [...teamConfig.members]
    newMembers[index] = { ...newMembers[index], [field]: value }
    updateTeamConfig({ ...teamConfig, members: newMembers })
  }

  const handlePhotoUpload = async (index, file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Convert to base64
    const reader = new FileReader()
    reader.onload = (e) => {
      handleMemberUpdate(index, 'photo', e.target.result)
    }
    reader.readAsDataURL(file)
  }

  const handleMemberDelete = (index) => {
    const newMembers = teamConfig.members.filter((_, i) => i !== index)
    updateTeamConfig({ ...teamConfig, members: newMembers })
  }

  const handleAddMember = () => {
    if (teamConfig.members.length >= 15) {
      return // Maximum of 15 team members
    }
    const newMember = {
      id: `member-${Date.now()}`,
      name: '',
      role: '',
      email: '',
      phone: '',
      color: '#0B64DD',
      initials: '',
      photo: null
    }
    updateTeamConfig({ ...teamConfig, members: [...teamConfig.members, newMember] })
  }

  return (
    <div className="space-y-4">
      {/* Header Settings */}
      <div className={`p-4 rounded-xl ${isDark ? 'bg-white/[0.03]' : 'bg-elastic-dev-blue/[0.02]'}`}>
        <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-white/70' : 'text-elastic-dev-blue/70'}`}>
          Page Header
        </h3>
        <div className="space-y-3">
          <div>
            <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Title</label>
            <input
              type="text"
              value={teamConfig.title}
              onChange={(e) => updateTeamConfig({ ...teamConfig, title: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Subtitle</label>
            <input
              type="text"
              value={teamConfig.subtitle}
              onChange={(e) => updateTeamConfig({ ...teamConfig, subtitle: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className={`text-sm font-semibold ${isDark ? 'text-white/70' : 'text-elastic-dev-blue/70'}`}>
            Team Members ({teamConfig.members.length}/15)
          </h3>
          <button
            onClick={handleAddMember}
            disabled={teamConfig.members.length >= 15}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${
              teamConfig.members.length >= 15
                ? 'opacity-50 cursor-not-allowed bg-elastic-dev-blue/10 text-elastic-dev-blue/50'
                : isDark 
                  ? 'bg-elastic-teal/20 hover:bg-elastic-teal/30 text-elastic-teal' 
                  : 'bg-elastic-blue/10 hover:bg-elastic-blue/20 text-elastic-blue'
            }`}
            title={teamConfig.members.length >= 15 ? 'Maximum of 15 team members reached' : 'Add a new team member'}
          >
            <FontAwesomeIcon icon={faPlus} />
            Add Member
          </button>
        </div>

        <div className="space-y-3">
          {teamConfig.members.map((member, index) => (
            <div
              key={member.id}
              className={`p-4 rounded-xl border ${
                isDark ? 'bg-white/[0.03] border-white/10' : 'bg-elastic-dev-blue/[0.02] border-elastic-dev-blue/10'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {/* Avatar with photo or initials */}
                  <button
                    onClick={() => fileInputRefs.current[member.id]?.click()}
                    className="relative group/avatar"
                  >
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-10 h-10 rounded-lg object-cover"
                        style={{ border: `2px solid ${member.color}` }}
                      />
                    ) : (
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
                        style={{
                          backgroundColor: `${member.color}20`,
                          color: member.color,
                          border: `2px solid ${member.color}`
                        }}
                      >
                        {member.initials || '?'}
                      </div>
                    )}
                    <div className={`absolute inset-0 rounded-lg flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity ${
                      isDark ? 'bg-black/60' : 'bg-black/40'
                    }`}>
                      <FontAwesomeIcon icon={faUpload} className="text-white text-xs" />
                    </div>
                  </button>
                  <input
                    ref={(el) => fileInputRefs.current[member.id] = el}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handlePhotoUpload(index, file)
                      e.target.value = ''
                    }}
                    className="hidden"
                  />
                  <div>
                    <div className={`font-medium text-sm ${isDark ? 'text-white' : 'text-elastic-dev-blue'}`}>
                      {member.name || 'New Member'}
                    </div>
                    <div className={`text-xs ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>
                      {member.role || 'No role set'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {member.photo && (
                    <button
                      onClick={() => handleMemberUpdate(index, 'photo', null)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                        isDark ? 'hover:bg-orange-500/20 text-white/40 hover:text-orange-400' : 'hover:bg-orange-500/10 text-elastic-dev-blue/40 hover:text-orange-500'
                      }`}
                      title="Remove photo"
                    >
                      <FontAwesomeIcon icon={faXmark} className="text-xs" />
                    </button>
                  )}
                  <button
                    onClick={() => handleMemberDelete(index)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      isDark ? 'hover:bg-red-500/20 text-white/40 hover:text-red-400' : 'hover:bg-red-500/10 text-elastic-dev-blue/40 hover:text-red-500'
                    }`}
                    title="Delete member"
                  >
                    <FontAwesomeIcon icon={faTrash} className="text-xs" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Name</label>
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => handleMemberUpdate(index, 'name', e.target.value)}
                    className={inputClass}
                    placeholder="Full Name"
                  />
                </div>
                <div>
                  <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Initials</label>
                  <input
                    type="text"
                    value={member.initials}
                    onChange={(e) => handleMemberUpdate(index, 'initials', e.target.value.toUpperCase().slice(0, 3))}
                    className={inputClass}
                    placeholder="AB"
                    maxLength={3}
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Role</label>
                <input
                  type="text"
                  value={member.role}
                  onChange={(e) => handleMemberUpdate(index, 'role', e.target.value)}
                  className={inputClass}
                  placeholder="Job Title"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Email</label>
                  <input
                    type="email"
                    value={member.email}
                    onChange={(e) => handleMemberUpdate(index, 'email', e.target.value)}
                    className={inputClass}
                    placeholder="email@elastic.co"
                  />
                </div>
                <div>
                  <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Phone</label>
                  <input
                    type="text"
                    value={member.phone}
                    onChange={(e) => handleMemberUpdate(index, 'phone', e.target.value)}
                    className={inputClass}
                    placeholder="555.123.4567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Photo URL</label>
                  <input
                    type="text"
                    value={member.photo && !member.photo.startsWith('data:') ? member.photo : ''}
                    onChange={(e) => handleMemberUpdate(index, 'photo', e.target.value)}
                    className={inputClass}
                    placeholder="/photos/name.jpg"
                  />
                  <p className={`text-xs mt-1 ${isDark ? 'text-white/30' : 'text-elastic-dev-blue/30'}`}>
                    Or click avatar to upload
                  </p>
                </div>
                <div>
                  <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={member.color}
                      onChange={(e) => handleMemberUpdate(index, 'color', e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={member.color}
                      onChange={(e) => handleMemberUpdate(index, 'color', e.target.value)}
                      className={`${inputClass} flex-1`}
                      placeholder="#0B64DD"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {teamConfig.members.length === 0 && (
            <div className={`text-center py-8 rounded-xl border-2 border-dashed ${
              isDark ? 'border-white/10 text-white/30' : 'border-elastic-dev-blue/10 text-elastic-dev-blue/30'
            }`}>
              <FontAwesomeIcon icon={faUsers} className="text-2xl mb-2" />
              <p className="text-sm">No team members yet</p>
              <p className="text-xs mt-1">Click "Add Member" to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={resetTeamConfig}
        className={`w-full px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all ${
          isDark 
            ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400' 
            : 'bg-red-500/5 hover:bg-red-500/10 text-red-500'
        }`}
      >
        <FontAwesomeIcon icon={faRotateLeft} />
        Reset Team to Default
      </button>
    </div>
  )
}

export default function SceneSettings({ 
  scenes, 
  enabledSceneIds, 
  customDurations,
  sceneMetadata,
  onToggle, 
  onUpdateDuration,
  onUpdateSceneMetadata,
  onUpdateOrder,
  onReset,
  isOpen: externalIsOpen,
  onOpenChange
}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen
  const setIsOpen = onOpenChange || setInternalIsOpen
  const [activeTab, setActiveTab] = useState('scenes')
  const { theme } = useTheme()
  const { teamConfig, updateTeamConfig } = useTeamConfig()
  const isDark = theme === 'dark'
  const fileInputRef = useRef(null)

  const enabledCount = enabledSceneIds.length
  const totalCount = scenes.length

  const handleReorder = (draggedId, targetId) => {
    const sceneIds = scenes.map(s => s.id)
    const draggedIndex = sceneIds.indexOf(draggedId)
    const targetIndex = sceneIds.indexOf(targetId)
    
    if (draggedIndex !== -1 && targetIndex !== -1) {
      const newOrder = [...sceneIds]
      newOrder.splice(draggedIndex, 1)
      newOrder.splice(targetIndex, 0, draggedId)
      onUpdateOrder(newOrder)
    }
  }

  const handleExportAll = () => {
    const config = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      scenes: {
        enabled: enabledSceneIds,
        order: scenes.map(s => s.id),
        durations: customDurations,
        metadata: sceneMetadata
      },
      team: teamConfig
    }

    const dataStr = JSON.stringify(config, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `presentation-config-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportAll = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target.result)
        
        // Import scene configuration
        if (config.scenes) {
          const sceneConfig = {
            enabledIds: config.scenes.enabled || [],
            order: config.scenes.order || [],
            durations: config.scenes.durations || {},
            sceneMetadata: config.scenes.metadata || {}
          }
          localStorage.setItem('presentation-scene-config', JSON.stringify(sceneConfig))
        }

        // Import team configuration
        if (config.team) {
          // Enforce maximum of 15 team members
          const teamConfigToImport = {
            ...config.team,
            members: config.team.members?.slice(0, 15) || []
          }
          updateTeamConfig(teamConfigToImport)
        }

        // Reload to apply changes
        window.location.reload()
      } catch (err) {
        alert('Invalid configuration file. Please check the JSON format.')
        console.error('Import error:', err)
      }
    }
    reader.readAsText(file)
    event.target.value = '' // Reset input
  }

  // Calculate total presentation time
  const totalTime = scenes
    .filter(s => enabledSceneIds.includes(s.id))
    .reduce((acc, s) => {
      const duration = customDurations?.[s.id] || s.duration || ''
      const match = duration.match(/(\d+)/)
      return acc + (match ? parseInt(match[1]) : 0)
    }, 0)

  return (
    <>
      {/* Settings Button - only show if not externally controlled */}
      {externalIsOpen === undefined && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-24 right-8 z-40 w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg hover:scale-110 ${
            isDark 
              ? 'bg-elastic-teal/20 hover:bg-elastic-teal/30 text-elastic-teal' 
              : 'bg-elastic-blue/10 hover:bg-elastic-blue/20 text-elastic-blue'
          }`}
          title="Settings"
        >
          <FontAwesomeIcon icon={faGear} className="text-lg" />
        </button>
      )}

      {/* Settings Panel - Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Settings Panel - Content */}
      {isOpen && (
        <div
          className={`fixed right-0 top-0 bottom-0 w-[960px] z-50 shadow-2xl overflow-hidden flex flex-col transition-transform duration-300 ${
            isDark ? 'bg-elastic-dev-blue' : 'bg-white'
          }`}
        >
          {/* Header */}
          <div className={`p-6 border-b flex-shrink-0 ${isDark ? 'border-white/10' : 'border-elastic-dev-blue/10'}`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-elastic-dev-blue'}`}>
                  Settings
                </h2>
                <p className={`text-sm mt-1 ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>
                  {activeTab === 'scenes' 
                    ? `${enabledCount} of ${totalCount} scenes • ~${totalTime} min total`
                    : activeTab === 'team'
                    ? 'Customize your team'
                    : 'Customize scene content'}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isDark ? 'hover:bg-white/10 text-white/60' : 'hover:bg-elastic-dev-blue/10 text-elastic-dev-blue/60'
                }`}
              >
                <FontAwesomeIcon icon={faXmark} className="text-xl" />
              </button>
            </div>

            {/* Import/Export Buttons */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={handleExportAll}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                  isDark 
                    ? 'bg-white/10 hover:bg-white/20 text-white/70' 
                    : 'bg-elastic-dev-blue/10 hover:bg-elastic-dev-blue/20 text-elastic-dev-blue/70'
                }`}
              >
                <FontAwesomeIcon icon={faDownload} />
                Export All
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                  isDark 
                    ? 'bg-white/10 hover:bg-white/20 text-white/70' 
                    : 'bg-elastic-dev-blue/10 hover:bg-elastic-dev-blue/20 text-elastic-dev-blue/70'
                }`}
              >
                <FontAwesomeIcon icon={faUpload} />
                Import All
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportAll}
                className="hidden"
              />
            </div>

            {/* Tab Buttons */}
            <div className={`flex gap-2 p-1 rounded-xl ${isDark ? 'bg-white/5' : 'bg-elastic-dev-blue/5'}`}>
              <button
                onClick={() => setActiveTab('scenes')}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'scenes'
                    ? isDark 
                      ? 'bg-elastic-teal text-elastic-dev-blue' 
                      : 'bg-elastic-blue text-white'
                    : isDark 
                      ? 'text-white/60 hover:text-white/80' 
                      : 'text-elastic-dev-blue/60 hover:text-elastic-dev-blue/80'
                }`}
              >
                <FontAwesomeIcon icon={faSliders} />
                Scenes & Agenda
              </button>
              <button
                onClick={() => setActiveTab('team')}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'team'
                    ? isDark 
                      ? 'bg-elastic-teal text-elastic-dev-blue' 
                      : 'bg-elastic-blue text-white'
                    : isDark 
                      ? 'text-white/60 hover:text-white/80' 
                      : 'text-elastic-dev-blue/60 hover:text-elastic-dev-blue/80'
                }`}
              >
                <FontAwesomeIcon icon={faUsers} />
                Team
              </button>
              <button
                onClick={() => setActiveTab('customizations')}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'customizations'
                    ? isDark 
                      ? 'bg-elastic-teal text-elastic-dev-blue' 
                      : 'bg-elastic-blue text-white'
                    : isDark 
                      ? 'text-white/60 hover:text-white/80' 
                      : 'text-elastic-dev-blue/60 hover:text-elastic-dev-blue/80'
                }`}
              >
                <FontAwesomeIcon icon={faPalette} />
                Content
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'scenes' ? (
              <>
                {/* Instructions & Reset */}
                <div className="mb-4 flex items-center justify-between">
                  <p className={`text-xs ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>
                    Drag to reorder • Click to expand • Eye to toggle
                  </p>
                  <button
                    onClick={onReset}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${
                      isDark 
                        ? 'bg-white/10 hover:bg-white/20 text-white/70' 
                        : 'bg-elastic-dev-blue/10 hover:bg-elastic-dev-blue/20 text-elastic-dev-blue/70'
                    }`}
                  >
                    <FontAwesomeIcon icon={faRotateLeft} />
                    Reset
                  </button>
                </div>

                {/* Scene List */}
                <div className="space-y-2">
                  {scenes.map((scene, index) => {
                    const isEnabled = enabledSceneIds.includes(scene.id)
                    const isLastEnabled = isEnabled && enabledCount === 1

                    return (
                      <SceneItem
                        key={scene.id}
                        scene={scene}
                        index={index}
                        isEnabled={isEnabled}
                        isLastEnabled={isLastEnabled}
                        onToggle={onToggle}
                        customDuration={customDurations?.[scene.id]}
                        onUpdateDuration={onUpdateDuration}
                        sceneMetadata={sceneMetadata}
                        onUpdateSceneMetadata={onUpdateSceneMetadata}
                        onReorder={handleReorder}
                        isDark={isDark}
                      />
                    )
                  })}
                </div>
              </>
            ) : activeTab === 'team' ? (
              <TeamEditorPanel isDark={isDark} />
            ) : (
              <CustomizationsPanel 
                isDark={isDark} 
                sceneMetadata={sceneMetadata}
                onUpdateSceneMetadata={onUpdateSceneMetadata}
              />
            )}
          </div>
        </div>
      )}
    </>
  )
}

// Customizations Panel Component
function CustomizationsPanel({ isDark, sceneMetadata, onUpdateSceneMetadata }) {
  const [selectedScene, setSelectedScene] = useState('about')

  const inputClass = `w-full px-3 py-2 text-sm rounded-lg border ${
    isDark
      ? 'bg-white/5 border-white/10 text-white placeholder-white/30'
      : 'bg-white border-elastic-dev-blue/10 text-elastic-dev-blue placeholder-elastic-dev-blue/30'
  }`

  const textareaClass = `w-full px-3 py-2 text-sm rounded-lg border resize-none ${
    isDark
      ? 'bg-white/5 border-white/10 text-white placeholder-white/30'
      : 'bg-white border-elastic-dev-blue/10 text-elastic-dev-blue placeholder-elastic-dev-blue/30'
  }`

  const problemPatterns = sceneMetadata?.['problem-patterns'] || {}

  const handleProblemUpdate = (category, index, value) => {
    const currentProblems = problemPatterns.problems || {}
    const categoryProblems = currentProblems[category] || []
    const newCategoryProblems = [...categoryProblems]
    newCategoryProblems[index] = value
    
    onUpdateSceneMetadata('problem-patterns', {
      ...problemPatterns,
      problems: {
        ...currentProblems,
        [category]: newCategoryProblems
      }
    })
  }

  return (
    <div className="space-y-4">
      <p className={`text-xs ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>
        Customize text content for your scenes
      </p>

      {/* Scene Selector */}
      <div>
        <label className={`text-xs mb-2 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>
          Select Scene
        </label>
        <select
          value={selectedScene}
          onChange={(e) => setSelectedScene(e.target.value)}
          className={inputClass}
        >
          <option value="about">About Elastic</option>
          <option value="problem-patterns">Problem Patterns</option>
          <option value="unified-strategy">Platform Overview</option>
          <option value="data-explosion">Data Explosion</option>
          <option value="cross-cluster">Cross-Cluster</option>
          <option value="schema">Schema</option>
          <option value="access-control">Access Control</option>
          <option value="consolidation">Consolidation</option>
          <option value="esql">ES|QL</option>
          <option value="services">Services</option>
          <option value="next-steps">Next Steps</option>
        </select>
      </div>

      {selectedScene === 'about' && (
        <div className="space-y-6 mt-6">
          <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-elastic-dark-ink'}`}>
            About Elastic Content
          </h3>

          <div>
            <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>
              Subtitle
            </label>
            <textarea
              value={sceneMetadata?.about?.subtitle || ''}
              onChange={(e) => onUpdateSceneMetadata('about', {
                ...sceneMetadata?.about,
                subtitle: e.target.value
              })}
              className={textareaClass}
              rows={3}
              placeholder="The Search AI Company—powering search, observability, and security for thousands of organizations worldwide."
            />
            <p className={`text-xs mt-1 ${isDark ? 'text-white/30' : 'text-elastic-dev-blue/30'}`}>
              Descriptive subtitle below the main title
            </p>
          </div>

          {/* Stats Cards */}
          <div className="space-y-4">
            <h4 className={`text-sm font-semibold ${isDark ? 'text-white/70' : 'text-elastic-dark-ink/70'}`}>
              Statistics Cards
            </h4>
            {[
              { index: 0, defaultValue: '5B+', defaultLabel: 'Downloads', defaultDesc: 'Open source downloads worldwide' },
              { index: 1, defaultValue: '54%', defaultLabel: 'Fortune 500', defaultDesc: 'Trust Elastic for their data needs' },
              { index: 2, defaultValue: '40+', defaultLabel: 'Countries', defaultDesc: 'Global presence and support' },
              { index: 3, defaultValue: '3,000+', defaultLabel: 'Employees', defaultDesc: 'Distributed across the globe' }
            ].map((stat) => (
              <div key={`stat-${stat.index}`} className={`p-3 rounded-lg border ${isDark ? 'border-white/10 bg-white/[0.02]' : 'border-elastic-dev-blue/10 bg-elastic-dev-blue/[0.02]'}`}>
                <p className={`text-xs font-semibold mb-2 ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>
                  Stat #{stat.index + 1}
                </p>
                <div className="space-y-2">
                  <div>
                    <label className={`text-xs mb-1 block ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>
                      Value
                    </label>
                    <input
                      type="text"
                      value={sceneMetadata?.about?.stats?.[stat.index]?.value || ''}
                      onChange={(e) => {
                        const currentStats = sceneMetadata?.about?.stats || []
                        const newStats = [...currentStats]
                        newStats[stat.index] = { ...newStats[stat.index], value: e.target.value }
                        onUpdateSceneMetadata('about', {
                          ...sceneMetadata?.about,
                          stats: newStats
                        })
                      }}
                      className={inputClass}
                      placeholder={stat.defaultValue}
                    />
                  </div>
                  <div>
                    <label className={`text-xs mb-1 block ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>
                      Label
                    </label>
                    <input
                      type="text"
                      value={sceneMetadata?.about?.stats?.[stat.index]?.label || ''}
                      onChange={(e) => {
                        const currentStats = sceneMetadata?.about?.stats || []
                        const newStats = [...currentStats]
                        newStats[stat.index] = { ...newStats[stat.index], label: e.target.value }
                        onUpdateSceneMetadata('about', {
                          ...sceneMetadata?.about,
                          stats: newStats
                        })
                      }}
                      className={inputClass}
                      placeholder={stat.defaultLabel}
                    />
                  </div>
                  <div>
                    <label className={`text-xs mb-1 block ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>
                      Description
                    </label>
                    <input
                      type="text"
                      value={sceneMetadata?.about?.stats?.[stat.index]?.description || ''}
                      onChange={(e) => {
                        const currentStats = sceneMetadata?.about?.stats || []
                        const newStats = [...currentStats]
                        newStats[stat.index] = { ...newStats[stat.index], description: e.target.value }
                        onUpdateSceneMetadata('about', {
                          ...sceneMetadata?.about,
                          stats: newStats
                        })
                      }}
                      className={inputClass}
                      placeholder={stat.defaultDesc}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Features Cards */}
          <div className="space-y-4">
            <h4 className={`text-sm font-semibold ${isDark ? 'text-white/70' : 'text-elastic-dark-ink/70'}`}>
              Features Cards
            </h4>
            {[
              { index: 0, defaultTitle: 'Search Pioneer', defaultDesc: 'Built on Apache Lucene, the gold standard for search' },
              { index: 1, defaultTitle: 'Data at Scale', defaultDesc: 'Petabytes of data processed daily by our customers' },
              { index: 2, defaultTitle: 'AI-Native', defaultDesc: 'Vector search & ML built into the platform from day one' },
              { index: 3, defaultTitle: 'Open Source DNA', defaultDesc: 'Transparent, extensible, community-driven' }
            ].map((feature) => (
              <div key={`feature-${feature.index}`} className={`p-3 rounded-lg border ${isDark ? 'border-white/10 bg-white/[0.02]' : 'border-elastic-dev-blue/10 bg-elastic-dev-blue/[0.02]'}`}>
                <p className={`text-xs font-semibold mb-2 ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>
                  Feature #{feature.index + 1}
                </p>
                <div className="space-y-2">
                  <div>
                    <label className={`text-xs mb-1 block ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>
                      Title
                    </label>
                    <input
                      type="text"
                      value={sceneMetadata?.about?.features?.[feature.index]?.title || ''}
                      onChange={(e) => {
                        const currentFeatures = sceneMetadata?.about?.features || []
                        const newFeatures = [...currentFeatures]
                        newFeatures[feature.index] = { ...newFeatures[feature.index], title: e.target.value }
                        onUpdateSceneMetadata('about', {
                          ...sceneMetadata?.about,
                          features: newFeatures
                        })
                      }}
                      className={inputClass}
                      placeholder={feature.defaultTitle}
                    />
                  </div>
                  <div>
                    <label className={`text-xs mb-1 block ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>
                      Description
                    </label>
                    <input
                      type="text"
                      value={sceneMetadata?.about?.features?.[feature.index]?.description || ''}
                      onChange={(e) => {
                        const currentFeatures = sceneMetadata?.about?.features || []
                        const newFeatures = [...currentFeatures]
                        newFeatures[feature.index] = { ...newFeatures[feature.index], description: e.target.value }
                        onUpdateSceneMetadata('about', {
                          ...sceneMetadata?.about,
                          features: newFeatures
                        })
                      }}
                      className={inputClass}
                      placeholder={feature.defaultDesc}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedScene === 'problem-patterns' && (
        <div className="space-y-6 mt-6">
          <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-elastic-dark-ink'}`}>
            Problem Patterns Content
          </h3>

          {/* Observability Problems */}
          <div className="space-y-3">
            <h4 className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-pink-400' : 'text-elastic-blue'}`}>
              Observability Problems
            </h4>
            {[0, 1, 2, 3].map((index) => (
              <div key={`obs-${index}`}>
                <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>
                  Problem #{index + 1}
                </label>
                <input
                  type="text"
                  value={problemPatterns.problems?.observability?.[index] || ''}
                  onChange={(e) => handleProblemUpdate('observability', index, e.target.value)}
                  className={inputClass}
                  placeholder={
                    index === 0 ? 'Disconnected logs, metrics, traces' :
                    index === 1 ? 'MTTR stays high despite lots of data' :
                    index === 2 ? 'Tool sprawl and cost pressure' :
                    'Weak correlation to customer impact'
                  }
                />
              </div>
            ))}
          </div>

          {/* Security Problems */}
          <div className="space-y-3">
            <h4 className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-orange-400' : 'text-elastic-blue'}`}>
              Security Problems
            </h4>
            {[0, 1, 2, 3].map((index) => (
              <div key={`sec-${index}`}>
                <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>
                  Problem #{index + 1}
                </label>
                <input
                  type="text"
                  value={problemPatterns.problems?.security?.[index] || ''}
                  onChange={(e) => handleProblemUpdate('security', index, e.target.value)}
                  className={inputClass}
                  placeholder={
                    index === 0 ? 'Alert fatigue and signal-to-noise ratio' :
                    index === 1 ? 'Blind spots across cloud and on-prem' :
                    index === 2 ? 'Tool sprawl and cost pressure' :
                    'Manual investigation slows response'
                  }
                />
              </div>
            ))}
          </div>

          {/* Search/Product Problems */}
          <div className="space-y-3">
            <h4 className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-yellow-400' : 'text-elastic-blue'}`}>
              Search / Product Problems
            </h4>
            {[0, 1, 2, 3].map((index) => (
              <div key={`search-${index}`}>
                <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>
                  Problem #{index + 1}
                </label>
                <input
                  type="text"
                  value={problemPatterns.problems?.search?.[index] || ''}
                  onChange={(e) => handleProblemUpdate('search', index, e.target.value)}
                  className={inputClass}
                  placeholder={
                    index === 0 ? 'Slow or irrelevant search results' :
                    index === 1 ? 'Limited semantic or vector search capabilities' :
                    index === 2 ? 'Tool sprawl and cost pressure' :
                    'Difficulty scaling search infrastructure'
                  }
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedScene === 'data-explosion' && (
        <div className="space-y-6 mt-6">
          <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-elastic-dark-ink'}`}>
            Data Explosion Content
          </h3>

          <div>
            <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>
              Eyebrow Text
            </label>
            <input
              type="text"
              value={sceneMetadata?.['data-explosion']?.eyebrow || ''}
              onChange={(e) => onUpdateSceneMetadata('data-explosion', {
                ...sceneMetadata?.['data-explosion'],
                eyebrow: e.target.value
              })}
              className={inputClass}
              placeholder="The Challenge"
            />
          </div>

          <div>
            <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>
              Verdict Line 1
            </label>
            <input
              type="text"
              value={sceneMetadata?.['data-explosion']?.verdictLine1 || ''}
              onChange={(e) => onUpdateSceneMetadata('data-explosion', {
                ...sceneMetadata?.['data-explosion'],
                verdictLine1: e.target.value
              })}
              className={inputClass}
              placeholder="Most data goes unsearched, unanalyzed, unutilized."
            />
            <p className={`text-xs mt-1 ${isDark ? 'text-white/30' : 'text-elastic-dev-blue/30'}`}>
              Main punchline text (plain text, no color highlights)
            </p>
          </div>

          <div>
            <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>
              Verdict Line 2
            </label>
            <input
              type="text"
              value={sceneMetadata?.['data-explosion']?.verdictLine2 || ''}
              onChange={(e) => onUpdateSceneMetadata('data-explosion', {
                ...sceneMetadata?.['data-explosion'],
                verdictLine2: e.target.value
              })}
              className={inputClass}
              placeholder="Speed. Scale. Flexibility. Innovation demands all three — simultaneously."
            />
            <p className={`text-xs mt-1 ${isDark ? 'text-white/30' : 'text-elastic-dev-blue/30'}`}>
              Supporting text below the punchline
            </p>
          </div>

          <div className="space-y-4">
            <h4 className={`text-sm font-semibold ${isDark ? 'text-white/70' : 'text-elastic-dark-ink/70'}`}>
              Stat Card Labels
            </h4>
            {[
              { index: 0, defaultEnd: '175', defaultSuffix: 'ZB', defaultLabel: 'of data generated in 2025', defaultSource: 'IDC / Seagate "Data Age 2025"' },
              { index: 1, defaultEnd: '90',  defaultSuffix: '%',  defaultLabel: 'of enterprise data is unstructured', defaultSource: 'IBM Research' },
              { index: 2, defaultEnd: '68',  defaultSuffix: '%',  defaultLabel: 'is "dark data" — never analyzed', defaultSource: 'Seagate / IDC Research' },
            ].map((stat) => (
              <div key={`de-stat-${stat.index}`} className={`p-3 rounded-lg border ${isDark ? 'border-white/10 bg-white/[0.02]' : 'border-elastic-dev-blue/10 bg-elastic-dev-blue/[0.02]'}`}>
                <p className={`text-xs font-semibold mb-2 ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>
                  Stat #{stat.index + 1}
                </p>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={`text-xs mb-1 block ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>
                        Number
                      </label>
                      <input
                        type="number"
                        value={sceneMetadata?.['data-explosion']?.stats?.[stat.index]?.end ?? ''}
                        onChange={(e) => {
                          const currentStats = sceneMetadata?.['data-explosion']?.stats || []
                          const newStats = [...currentStats]
                          newStats[stat.index] = { ...newStats[stat.index], end: e.target.value }
                          onUpdateSceneMetadata('data-explosion', {
                            ...sceneMetadata?.['data-explosion'],
                            stats: newStats
                          })
                        }}
                        className={inputClass}
                        placeholder={stat.defaultEnd}
                      />
                    </div>
                    <div>
                      <label className={`text-xs mb-1 block ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>
                        Suffix
                      </label>
                      <input
                        type="text"
                        value={sceneMetadata?.['data-explosion']?.stats?.[stat.index]?.suffix || ''}
                        onChange={(e) => {
                          const currentStats = sceneMetadata?.['data-explosion']?.stats || []
                          const newStats = [...currentStats]
                          newStats[stat.index] = { ...newStats[stat.index], suffix: e.target.value }
                          onUpdateSceneMetadata('data-explosion', {
                            ...sceneMetadata?.['data-explosion'],
                            stats: newStats
                          })
                        }}
                        className={inputClass}
                        placeholder={stat.defaultSuffix}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={`text-xs mb-1 block ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>
                      Label
                    </label>
                    <input
                      type="text"
                      value={sceneMetadata?.['data-explosion']?.stats?.[stat.index]?.label || ''}
                      onChange={(e) => {
                        const currentStats = sceneMetadata?.['data-explosion']?.stats || []
                        const newStats = [...currentStats]
                        newStats[stat.index] = { ...newStats[stat.index], label: e.target.value }
                        onUpdateSceneMetadata('data-explosion', {
                          ...sceneMetadata?.['data-explosion'],
                          stats: newStats
                        })
                      }}
                      className={inputClass}
                      placeholder={stat.defaultLabel}
                    />
                  </div>
                  <div>
                    <label className={`text-xs mb-1 block ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>
                      Source
                    </label>
                    <input
                      type="text"
                      value={sceneMetadata?.['data-explosion']?.stats?.[stat.index]?.source || ''}
                      onChange={(e) => {
                        const currentStats = sceneMetadata?.['data-explosion']?.stats || []
                        const newStats = [...currentStats]
                        newStats[stat.index] = { ...newStats[stat.index], source: e.target.value }
                        onUpdateSceneMetadata('data-explosion', {
                          ...sceneMetadata?.['data-explosion'],
                          stats: newStats
                        })
                      }}
                      className={inputClass}
                      placeholder={stat.defaultSource}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedScene === 'cross-cluster' && (
        <div className="space-y-6 mt-6">
          <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-elastic-dark-ink'}`}>
            Cross-Cluster Content
          </h3>

          {/* Header */}
          <div>
            <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Eyebrow Text</label>
            <input
              type="text"
              value={sceneMetadata?.['cross-cluster']?.eyebrow || ''}
              onChange={(e) => onUpdateSceneMetadata('cross-cluster', { ...sceneMetadata?.['cross-cluster'], eyebrow: e.target.value })}
              className={inputClass}
              placeholder="Distributed Architecture"
            />
          </div>
          <div>
            <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Title Part 1 (plain)</label>
            <input
              type="text"
              value={sceneMetadata?.['cross-cluster']?.titlePart1 || ''}
              onChange={(e) => onUpdateSceneMetadata('cross-cluster', { ...sceneMetadata?.['cross-cluster'], titlePart1: e.target.value })}
              className={inputClass}
              placeholder="Distributed by Design, "
            />
          </div>
          <div>
            <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Title Part 2 (accent colour)</label>
            <input
              type="text"
              value={sceneMetadata?.['cross-cluster']?.titlePart2 || ''}
              onChange={(e) => onUpdateSceneMetadata('cross-cluster', { ...sceneMetadata?.['cross-cluster'], titlePart2: e.target.value })}
              className={inputClass}
              placeholder="Connected by Elastic"
            />
          </div>

          {/* Benefit cards */}
          <div className="space-y-4">
            <h4 className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>
              Benefit Cards
            </h4>
            {[
              { defaultText: 'Search across all data',        defaultHighlight: 'limit data transfer costs'  },
              { defaultText: 'Data privacy & sovereignty',    defaultHighlight: 'global compliance'          },
              { defaultText: 'Faster, more responsive',       defaultHighlight: 'reduced app latency'        },
              { defaultText: 'High availability for DR',      defaultHighlight: 'business continuity'        },
              { defaultText: 'Seamless hybrid & multi-cloud', defaultHighlight: 'deployment flexibility'     },
            ].map((defaults, i) => {
              const updateBenefit = (field, value) => {
                const benefits = [...(sceneMetadata?.['cross-cluster']?.benefits || [])]
                benefits[i] = { ...(benefits[i] || {}), [field]: value }
                onUpdateSceneMetadata('cross-cluster', { ...sceneMetadata?.['cross-cluster'], benefits })
              }
              return (
                <div key={`cc-benefit-${i}`} className={`p-3 rounded-lg ${isDark ? 'bg-white/[0.03]' : 'bg-elastic-dev-blue/[0.03]'}`}>
                  <p className={`text-xs font-semibold mb-2 ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Card #{i + 1}</p>
                  <div className="space-y-2">
                    <div>
                      <label className={`text-xs mb-1 block ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>Main text</label>
                      <input
                        type="text"
                        value={sceneMetadata?.['cross-cluster']?.benefits?.[i]?.text || ''}
                        onChange={(e) => updateBenefit('text', e.target.value)}
                        className={inputClass}
                        placeholder={defaults.defaultText}
                      />
                    </div>
                    <div>
                      <label className={`text-xs mb-1 block ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>Highlight text</label>
                      <input
                        type="text"
                        value={sceneMetadata?.['cross-cluster']?.benefits?.[i]?.highlight || ''}
                        onChange={(e) => updateBenefit('highlight', e.target.value)}
                        className={inputClass}
                        placeholder={defaults.defaultHighlight}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ── Stage 1: In Practice ──────────────────────────────────── */}
          <div className={`p-4 rounded-xl space-y-3 ${isDark ? 'bg-white/[0.03]' : 'bg-elastic-dev-blue/[0.02]'}`}>
            <h4 className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>
              Stage 1: In Practice
            </h4>

            <div>
              <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Hub Name</label>
              <input
                type="text"
                value={sceneMetadata?.['cross-cluster']?.stage1HubName || ''}
                onChange={(e) => onUpdateSceneMetadata('cross-cluster', { ...sceneMetadata?.['cross-cluster'], stage1HubName: e.target.value })}
                className={inputClass}
                placeholder="Your Organization"
              />
            </div>

            <div>
              <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Hub Subtitle</label>
              <input
                type="text"
                value={sceneMetadata?.['cross-cluster']?.stage1HubSubtitle || ''}
                onChange={(e) => onUpdateSceneMetadata('cross-cluster', { ...sceneMetadata?.['cross-cluster'], stage1HubSubtitle: e.target.value })}
                className={inputClass}
                placeholder="Main Elastic Cluster"
              />
            </div>

            <div>
              <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Search Query</label>
              <input
                type="text"
                value={sceneMetadata?.['cross-cluster']?.stage1Query || ''}
                onChange={(e) => onUpdateSceneMetadata('cross-cluster', { ...sceneMetadata?.['cross-cluster'], stage1Query: e.target.value })}
                className={inputClass}
                placeholder="GET _remote/*:logs-*/_search"
              />
            </div>

            <div>
              <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Number of Sites</label>
              <select
                value={sceneMetadata?.['cross-cluster']?.siteCount || '7'}
                onChange={(e) => onUpdateSceneMetadata('cross-cluster', { ...sceneMetadata?.['cross-cluster'], siteCount: e.target.value })}
                className={inputClass}
              >
                {[2, 3, 4, 5, 6, 7, 8].map(n => (
                  <option key={n} value={String(n)}>{n} sites</option>
                ))}
              </select>
              <p className={`text-xs mt-1 ${isDark ? 'text-white/30' : 'text-elastic-dev-blue/30'}`}>
                2–4 sites appear in a single row. 5–8 sites use two rows.
              </p>
            </div>
          </div>

          {/* Stage 1 site list */}
          <div className="space-y-4">
            <h4 className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>
              Sites (Stage 1)
            </h4>
            {Array.from({ length: parseInt(sceneMetadata?.['cross-cluster']?.siteCount || '4') }, (_, i) => {
              const defaultNames    = ['HQ Data Center', 'AWS us-east-1', 'Azure West EU', 'GCP Asia Pacific', 'DR Backup', 'Edge — LATAM', 'On-Prem EU']
              const defaultRegions  = ['US-East', 'US-East', 'EU-West', 'APAC', 'US-West', 'SA-East', 'EU-East']
              const defaultDocs     = ['2.4M', '8.1M', '3.7M', '1.9M', '2.4M', '0.9M', '1.5M']
              const site = sceneMetadata?.['cross-cluster']?.sites?.[i] || {}
              const updateSite = (patch) => {
                const sites = [...(sceneMetadata?.['cross-cluster']?.sites || [])]
                sites[i] = { ...(sites[i] || {}), ...patch }
                onUpdateSceneMetadata('cross-cluster', { ...sceneMetadata?.['cross-cluster'], sites })
              }
              return (
                <div key={`site-${i}`} className={`p-3 rounded-lg border space-y-2 ${isDark ? 'border-white/10 bg-white/[0.02]' : 'border-elastic-dev-blue/10 bg-elastic-dev-blue/[0.02]'}`}>
                  <p className={`text-xs font-semibold ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Site {i + 1}</p>
                  <div>
                    <label className={`text-xs mb-1 block ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>Name</label>
                    <input type="text" value={site.name || ''} onChange={(e) => updateSite({ name: e.target.value })} className={inputClass} placeholder={defaultNames[i] ?? `Site ${i + 1}`} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={`text-xs mb-1 block ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>Type</label>
                      <select value={site.type || 'cloud'} onChange={(e) => updateSite({ type: e.target.value })} className={inputClass}>
                        <option value="cloud">Cloud</option>
                        <option value="onprem">On-Prem</option>
                        <option value="server">Server</option>
                        <option value="database">Database</option>
                        <option value="network">Network</option>
                      </select>
                    </div>
                    <div>
                      <label className={`text-xs mb-1 block ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>Region</label>
                      <input type="text" value={site.region || ''} onChange={(e) => updateSite({ region: e.target.value })} className={inputClass} placeholder={defaultRegions[i] ?? 'Global'} />
                    </div>
                  </div>
                  <div>
                    <label className={`text-xs mb-1 block ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>Doc Count</label>
                    <input type="text" value={site.docs || ''} onChange={(e) => updateSite({ docs: e.target.value })} className={inputClass} placeholder={defaultDocs[i] ?? '1.0M'} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* ── Stage 0: Remote Clusters ───────────────────────────────────── */}
          <div className="space-y-4">
            <h4 className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>
              Remote Clusters (Stage 0)
            </h4>
            {[
              { defaultLabel: 'elastic', defaultName: 'On-Prem', defaultType: 'onprem' },
              { defaultLabel: 'elastic', defaultName: 'AWS',     defaultType: 'cloud'  },
              { defaultLabel: 'elastic', defaultName: 'GCP',     defaultType: 'cloud'  },
              { defaultLabel: 'elastic', defaultName: 'Azure',   defaultType: 'cloud'  },
            ].map((defaults, i) => {
              const updateCluster = (field, value) => {
                const clusters = [...(sceneMetadata?.['cross-cluster']?.clusters || [])]
                clusters[i] = { ...(clusters[i] || {}), [field]: value }
                onUpdateSceneMetadata('cross-cluster', { ...sceneMetadata?.['cross-cluster'], clusters })
              }
              return (
                <div key={`cc-cluster-${i}`} className={`p-3 rounded-lg ${isDark ? 'bg-white/[0.03]' : 'bg-elastic-dev-blue/[0.03]'}`}>
                  <p className={`text-xs font-semibold mb-2 ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Cluster #{i + 1}</p>
                  <div className="space-y-2">
                    <div>
                      <label className={`text-xs mb-1 block ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>Label (e.g. "elastic")</label>
                      <input
                        type="text"
                        value={sceneMetadata?.['cross-cluster']?.clusters?.[i]?.label || ''}
                        onChange={(e) => updateCluster('label', e.target.value)}
                        className={inputClass}
                        placeholder={defaults.defaultLabel}
                      />
                    </div>
                    <div>
                      <label className={`text-xs mb-1 block ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>Name badge (e.g. "On-Prem")</label>
                      <input
                        type="text"
                        value={sceneMetadata?.['cross-cluster']?.clusters?.[i]?.name || ''}
                        onChange={(e) => updateCluster('name', e.target.value)}
                        className={inputClass}
                        placeholder={defaults.defaultName}
                      />
                    </div>
                    <div>
                      <label className={`text-xs mb-1 block ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>Icon</label>
                      <select
                        value={sceneMetadata?.['cross-cluster']?.clusters?.[i]?.type || defaults.defaultType}
                        onChange={(e) => updateCluster('type', e.target.value)}
                        className={inputClass}
                      >
                        <option value="cloud">Cloud</option>
                        <option value="onprem">Building (On-Prem)</option>
                        <option value="server">Server</option>
                        <option value="database">Database</option>
                        <option value="network">Network</option>
                      </select>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {selectedScene === 'unified-strategy' && (
        <div className="space-y-6 mt-6">
          <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-elastic-dark-ink'}`}>
            Platform Overview Content
          </h3>

          <div>
            <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>
              Eyebrow Text
            </label>
            <input
              type="text"
              value={sceneMetadata?.['unified-strategy']?.eyebrow || ''}
              onChange={(e) => onUpdateSceneMetadata('unified-strategy', {
                ...sceneMetadata?.['unified-strategy'],
                eyebrow: e.target.value
              })}
              className={inputClass}
              placeholder="The Elastic Search AI Platform"
            />
            <p className={`text-xs mt-1 ${isDark ? 'text-white/30' : 'text-elastic-dev-blue/30'}`}>
              Small text above the main title
            </p>
          </div>
          
          <div>
            <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>
              Title (Part 1)
            </label>
            <input
              type="text"
              value={sceneMetadata?.['unified-strategy']?.titlePart1 || ''}
              onChange={(e) => onUpdateSceneMetadata('unified-strategy', {
                ...sceneMetadata?.['unified-strategy'],
                titlePart1: e.target.value
              })}
              className={inputClass}
              placeholder="All Your Data"
            />
            <p className={`text-xs mt-1 ${isDark ? 'text-white/30' : 'text-elastic-dev-blue/30'}`}>
              First part of title (will be shown in teal/blue)
            </p>
          </div>
          
          <div>
            <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>
              Title (Part 2)
            </label>
            <input
              type="text"
              value={sceneMetadata?.['unified-strategy']?.titlePart2 || ''}
              onChange={(e) => onUpdateSceneMetadata('unified-strategy', {
                ...sceneMetadata?.['unified-strategy'],
                titlePart2: e.target.value
              })}
              className={inputClass}
              placeholder=", Real-Time, At Scale"
            />
            <p className={`text-xs mt-1 ${isDark ? 'text-white/30' : 'text-elastic-dev-blue/30'}`}>
              Second part of title (white/black)
            </p>
          </div>
          
          <div>
            <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>
              Subtitle
            </label>
            <input
              type="text"
              value={sceneMetadata?.['unified-strategy']?.subtitle || ''}
              onChange={(e) => onUpdateSceneMetadata('unified-strategy', {
                ...sceneMetadata?.['unified-strategy'],
                subtitle: e.target.value
              })}
              className={inputClass}
              placeholder="Accelerate mission outcomes by finding insights from any data source"
            />
            <p className={`text-xs mt-1 ${isDark ? 'text-white/30' : 'text-elastic-dev-blue/30'}`}>
              Descriptive subtitle below the main title
            </p>
          </div>
        </div>
      )}

      {selectedScene === 'access-control' && (
        <div className="space-y-6 mt-6">
          <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-elastic-dark-ink'}`}>
            Access Control Content
          </h3>

          {/* Identity */}
          <div className={`p-4 rounded-xl space-y-3 ${isDark ? 'bg-white/[0.03]' : 'bg-elastic-dev-blue/[0.02]'}`}>
            <h4 className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>
              Identity
            </h4>
            <div>
              <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>
                Company Domain
              </label>
              <input
                type="text"
                value={sceneMetadata?.['access-control']?.domain || ''}
                onChange={(e) => onUpdateSceneMetadata('access-control', {
                  ...sceneMetadata?.['access-control'],
                  domain: e.target.value
                })}
                className={inputClass}
                placeholder="acme.com"
              />
              <p className={`text-xs mt-1 ${isDark ? 'text-white/30' : 'text-elastic-dev-blue/30'}`}>
                Replaces the email domain in all log entries (e.g. user@acme.com)
              </p>
            </div>
            <div>
              <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>
                Departments
              </label>
              <input
                type="text"
                value={sceneMetadata?.['access-control']?.departments || ''}
                onChange={(e) => onUpdateSceneMetadata('access-control', {
                  ...sceneMetadata?.['access-control'],
                  departments: e.target.value
                })}
                className={inputClass}
                placeholder="Engineering, Finance, Sales, IT"
              />
              <p className={`text-xs mt-1 ${isDark ? 'text-white/30' : 'text-elastic-dev-blue/30'}`}>
                Comma-separated list. Updates the ABAC department filter chips and redistributes log entries automatically.
              </p>
            </div>
          </div>

          {/* Column Labels */}
          <div className={`p-4 rounded-xl space-y-3 ${isDark ? 'bg-white/[0.03]' : 'bg-elastic-dev-blue/[0.02]'}`}>
            <h4 className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>
              Column Labels
            </h4>
            <p className={`text-xs ${isDark ? 'text-white/30' : 'text-elastic-dev-blue/30'}`}>
              Rename table columns to match your terminology.
            </p>
            {[
              { key: 'action',      placeholder: 'Action'      },
              { key: 'credit_card', placeholder: 'Credit Card' },
              { key: 'ssn',         placeholder: 'SSN'         },
            ].map(({ key, placeholder }) => (
              <div key={key}>
                <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>
                  {placeholder} column
                </label>
                <input
                  type="text"
                  value={sceneMetadata?.['access-control']?.[`label_${key}`] || ''}
                  onChange={(e) => onUpdateSceneMetadata('access-control', {
                    ...sceneMetadata?.['access-control'],
                    [`label_${key}`]: e.target.value
                  })}
                  className={inputClass}
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>

          {/* Sample Values */}
          <div className={`p-4 rounded-xl space-y-4 ${isDark ? 'bg-white/[0.03]' : 'bg-elastic-dev-blue/[0.02]'}`}>
            <div>
              <h4 className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>
                Sample Values
              </h4>
              <p className={`text-xs mt-1 ${isDark ? 'text-white/30' : 'text-elastic-dev-blue/30'}`}>
                Comma-separated values distributed across log entries. Leave blank to use defaults.
              </p>
            </div>

            <div>
              <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>
                Action values
              </label>
              <input
                type="text"
                value={sceneMetadata?.['access-control']?.actions || ''}
                onChange={(e) => onUpdateSceneMetadata('access-control', {
                  ...sceneMetadata?.['access-control'],
                  actions: e.target.value
                })}
                className={inputClass}
                placeholder="login_success, payment_processed, config_change"
              />
            </div>

            <div>
              <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>
                {sceneMetadata?.['access-control']?.label_credit_card || 'Credit Card'} values
              </label>
              <input
                type="text"
                value={sceneMetadata?.['access-control']?.sensitive1Values || ''}
                onChange={(e) => onUpdateSceneMetadata('access-control', {
                  ...sceneMetadata?.['access-control'],
                  sensitive1Values: e.target.value
                })}
                className={inputClass}
                placeholder="4532-8821-3347-9912, 5421-3345-9921-7788"
              />
              <p className={`text-xs mt-1 ${isDark ? 'text-white/30' : 'text-elastic-dev-blue/30'}`}>
                Masking is format-aware: NNNN-NNNN-NNNN-NNNN → keeps first/last group. Other formats masked generically.
              </p>
            </div>

            <div>
              <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>
                {sceneMetadata?.['access-control']?.label_ssn || 'SSN'} values
              </label>
              <input
                type="text"
                value={sceneMetadata?.['access-control']?.sensitive2Values || ''}
                onChange={(e) => onUpdateSceneMetadata('access-control', {
                  ...sceneMetadata?.['access-control'],
                  sensitive2Values: e.target.value
                })}
                className={inputClass}
                placeholder="123-45-6789, EMP-2024-0042, ID-94821"
              />
              <p className={`text-xs mt-1 ${isDark ? 'text-white/30' : 'text-elastic-dev-blue/30'}`}>
                NNN-NN-NNNN → SSN masking. Any other format (e.g. EMP-2024-0042) → generic masking.
              </p>
            </div>
          </div>
        </div>
      )}

      {selectedScene === 'consolidation' && (
        <div className="space-y-6 mt-6">
          <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-elastic-dark-ink'}`}>
            Consolidation Scene — Header
          </h3>

          <div>
            <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Eyebrow Text</label>
            <input
              type="text"
              value={sceneMetadata?.consolidation?.eyebrow || ''}
              onChange={(e) => onUpdateSceneMetadata('consolidation', { ...sceneMetadata?.consolidation, eyebrow: e.target.value })}
              className={inputClass}
              placeholder="Unified Platform"
            />
          </div>

          <div>
            <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Heading — Plain</label>
            <input
              type="text"
              value={sceneMetadata?.consolidation?.headingPlain || ''}
              onChange={(e) => onUpdateSceneMetadata('consolidation', { ...sceneMetadata?.consolidation, headingPlain: e.target.value })}
              className={inputClass}
              placeholder="Consolidate Point Solutions, "
            />
          </div>

          <div>
            <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Heading — Accent</label>
            <input
              type="text"
              value={sceneMetadata?.consolidation?.headingAccent || ''}
              onChange={(e) => onUpdateSceneMetadata('consolidation', { ...sceneMetadata?.consolidation, headingAccent: e.target.value })}
              className={inputClass}
              placeholder="Centralize Data Workflows"
            />
          </div>

          <div>
            <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Subtitle</label>
            <textarea
              value={sceneMetadata?.consolidation?.subtitle || ''}
              onChange={(e) => onUpdateSceneMetadata('consolidation', { ...sceneMetadata?.consolidation, subtitle: e.target.value })}
              className={textareaClass}
              rows={2}
              placeholder="Comprehensive capabilities to replace disparate tools while integrating with your broader ecosystem"
            />
          </div>

          <h3 className={`text-sm font-semibold pt-2 ${isDark ? 'text-white' : 'text-elastic-dark-ink'}`}>
            Before State (Tool Sprawl)
          </h3>

          <div>
            <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Sidebar Title</label>
            <input
              type="text"
              value={sceneMetadata?.consolidation?.beforeTitle || ''}
              onChange={(e) => onUpdateSceneMetadata('consolidation', { ...sceneMetadata?.consolidation, beforeTitle: e.target.value })}
              className={inputClass}
              placeholder="Tool Sprawl"
            />
          </div>

          <div className="space-y-2">
            <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Pain Points (5 items)</label>
            {['Multiple licenses & contracts', 'Data silos & duplication', 'Context switching', 'Integration overhead', 'Inconsistent alerting'].map((defaultVal, i) => (
              <input
                key={i}
                type="text"
                value={sceneMetadata?.consolidation?.painPoints?.[i] || ''}
                onChange={(e) => {
                  const current = sceneMetadata?.consolidation?.painPoints || []
                  const updated = [...current]
                  updated[i] = e.target.value
                  onUpdateSceneMetadata('consolidation', { ...sceneMetadata?.consolidation, painPoints: updated })
                }}
                className={inputClass}
                placeholder={defaultVal}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Stat Value</label>
              <input
                type="text"
                value={sceneMetadata?.consolidation?.beforeStatValue || ''}
                onChange={(e) => onUpdateSceneMetadata('consolidation', { ...sceneMetadata?.consolidation, beforeStatValue: e.target.value })}
                className={inputClass}
                placeholder="76+"
              />
            </div>
            <div>
              <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Stat Label</label>
              <input
                type="text"
                value={sceneMetadata?.consolidation?.beforeStatLabel || ''}
                onChange={(e) => onUpdateSceneMetadata('consolidation', { ...sceneMetadata?.consolidation, beforeStatLabel: e.target.value })}
                className={inputClass}
                placeholder="Avg. security tools per org"
              />
            </div>
          </div>

          <div>
            <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Stat Source</label>
            <input
              type="text"
              value={sceneMetadata?.consolidation?.beforeStatSource || ''}
              onChange={(e) => onUpdateSceneMetadata('consolidation', { ...sceneMetadata?.consolidation, beforeStatSource: e.target.value })}
              className={inputClass}
              placeholder="IBM / Palo Alto Networks"
            />
          </div>

          <div>
            <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Chaos Label</label>
            <input
              type="text"
              value={sceneMetadata?.consolidation?.chaosLabel || ''}
              onChange={(e) => onUpdateSceneMetadata('consolidation', { ...sceneMetadata?.consolidation, chaosLabel: e.target.value })}
              className={inputClass}
              placeholder="Disconnected tools • Duplicated data • Fragmented workflows"
            />
          </div>

          <h3 className={`text-sm font-semibold pt-2 ${isDark ? 'text-white' : 'text-elastic-dark-ink'}`}>
            After State (With Elastic)
          </h3>

          <div>
            <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Sidebar Title</label>
            <input
              type="text"
              value={sceneMetadata?.consolidation?.afterTitle || ''}
              onChange={(e) => onUpdateSceneMetadata('consolidation', { ...sceneMetadata?.consolidation, afterTitle: e.target.value })}
              className={inputClass}
              placeholder="With Elastic"
            />
          </div>

          <div className="space-y-2">
            <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Benefit Text (5 items)</label>
            {['Reduced licensing costs', 'Faster triage & response', 'Unified data layer', 'No data duplication', 'Shared context'].map((defaultVal, i) => (
              <input
                key={i}
                type="text"
                value={sceneMetadata?.consolidation?.benefitTexts?.[i] || ''}
                onChange={(e) => {
                  const current = sceneMetadata?.consolidation?.benefitTexts || []
                  const updated = [...current]
                  updated[i] = e.target.value
                  onUpdateSceneMetadata('consolidation', { ...sceneMetadata?.consolidation, benefitTexts: updated })
                }}
                className={inputClass}
                placeholder={defaultVal}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Stat Value</label>
              <input
                type="text"
                value={sceneMetadata?.consolidation?.afterStatValue || ''}
                onChange={(e) => onUpdateSceneMetadata('consolidation', { ...sceneMetadata?.consolidation, afterStatValue: e.target.value })}
                className={inputClass}
                placeholder="3-5"
              />
            </div>
            <div>
              <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Stat Label</label>
              <input
                type="text"
                value={sceneMetadata?.consolidation?.afterStatLabel || ''}
                onChange={(e) => onUpdateSceneMetadata('consolidation', { ...sceneMetadata?.consolidation, afterStatLabel: e.target.value })}
                className={inputClass}
                placeholder="Vendors eliminated on average"
              />
            </div>
          </div>

          <h3 className={`text-sm font-semibold pt-2 ${isDark ? 'text-white' : 'text-elastic-dark-ink'}`}>
            Consolidation Scene — Tools
          </h3>
          <ConsolidationToolEditor
            metadata={sceneMetadata?.consolidation || {}}
            onUpdate={(tools) => onUpdateSceneMetadata('consolidation', {
              ...(sceneMetadata?.consolidation || {}),
              tools,
            })}
            isDark={isDark}
            inputClass={inputClass}
          />
        </div>
      )}

      {selectedScene === 'schema' && (
        <div className="space-y-6 mt-6">
          <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-elastic-dark-ink'}`}>
            Schema Scene Content
          </h3>

          <div>
            <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Eyebrow Text</label>
            <input
              type="text"
              value={sceneMetadata?.schema?.eyebrow || ''}
              onChange={(e) => onUpdateSceneMetadata('schema', { ...sceneMetadata?.schema, eyebrow: e.target.value })}
              className={inputClass}
              placeholder="Elastic Common Schema"
            />
          </div>

          <div>
            <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Title Part 1 (plain)</label>
            <input
              type="text"
              value={sceneMetadata?.schema?.titlePart1 || ''}
              onChange={(e) => onUpdateSceneMetadata('schema', { ...sceneMetadata?.schema, titlePart1: e.target.value })}
              className={inputClass}
              placeholder="Schema on Read"
            />
          </div>

          <div>
            <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Title Part 2 (accent colour)</label>
            <input
              type="text"
              value={sceneMetadata?.schema?.titlePart2 || ''}
              onChange={(e) => onUpdateSceneMetadata('schema', { ...sceneMetadata?.schema, titlePart2: e.target.value })}
              className={inputClass}
              placeholder="Schema on Write"
            />
          </div>

          <div>
            <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Stage 0 Subtitle</label>
            <input
              type="text"
              value={sceneMetadata?.schema?.subtitle0 || ''}
              onChange={(e) => onUpdateSceneMetadata('schema', { ...sceneMetadata?.schema, subtitle0: e.target.value })}
              className={inputClass}
              placeholder="How you organize data determines how fast you can find it"
            />
          </div>

          <div>
            <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Stage 1 Subtitle</label>
            <input
              type="text"
              value={sceneMetadata?.schema?.subtitle1 || ''}
              onChange={(e) => onUpdateSceneMetadata('schema', { ...sceneMetadata?.schema, subtitle1: e.target.value })}
              className={inputClass}
              placeholder="One field name. Any source. Zero guesswork."
            />
          </div>

          {/* Sources */}
          <div className="space-y-4">
            <h4 className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>
              Data Sources (Stage 1)
            </h4>
            {[
              { defaultLabel: 'Firewall',       defaultField: 'src_ip',         defaultHits: 14 },
              { defaultLabel: 'Windows Events', defaultField: 'source_address', defaultHits: 31 },
              { defaultLabel: 'Web Server',     defaultField: 'client.ip',      defaultHits: 7  },
              { defaultLabel: 'EDR',            defaultField: 'RemoteIP',       defaultHits: 5  },
            ].map((defaults, i) => {
              const src = sceneMetadata?.schema?.sources?.[i] || {}
              const update = (patch) => {
                const sources = [...(sceneMetadata?.schema?.sources || [{}, {}, {}, {}])]
                sources[i] = { ...sources[i], ...patch }
                onUpdateSceneMetadata('schema', { ...sceneMetadata?.schema, sources })
              }
              return (
                <div key={i} className="space-y-2">
                  <p className={`text-xs font-medium ${isDark ? 'text-white/60' : 'text-elastic-dev-blue/60'}`}>
                    Source {i + 1}
                  </p>
                  <div>
                    <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Label</label>
                    <input
                      type="text"
                      value={src.label || ''}
                      onChange={(e) => update({ label: e.target.value })}
                      className={inputClass}
                      placeholder={defaults.defaultLabel}
                    />
                  </div>
                  <div>
                    <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Raw Field Name</label>
                    <input
                      type="text"
                      value={src.rawField || ''}
                      onChange={(e) => update({ rawField: e.target.value })}
                      className={inputClass}
                      placeholder={defaults.defaultField}
                    />
                  </div>
                  <div>
                    <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Hit Count</label>
                    <input
                      type="number"
                      value={src.hitCount ?? ''}
                      onChange={(e) => update({ hitCount: e.target.value })}
                      className={inputClass}
                      placeholder={defaults.defaultHits}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {selectedScene === 'esql' && (
        <div className="space-y-6 mt-6">
          <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-elastic-dark-ink'}`}>
            ES|QL Scene — Header
          </h3>

          <div>
            <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Eyebrow Text</label>
            <input
              type="text"
              value={sceneMetadata?.esql?.eyebrow || ''}
              onChange={(e) => onUpdateSceneMetadata('esql', { ...sceneMetadata?.esql, eyebrow: e.target.value })}
              className={inputClass}
              placeholder="ES|QL · Elasticsearch Query Language"
            />
          </div>

          <div>
            <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Heading — Plain</label>
            <input
              type="text"
              value={sceneMetadata?.esql?.headingPlain || ''}
              onChange={(e) => onUpdateSceneMetadata('esql', { ...sceneMetadata?.esql, headingPlain: e.target.value })}
              className={inputClass}
              placeholder="Transform Your "
            />
          </div>

          <div>
            <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Heading — Accent</label>
            <input
              type="text"
              value={sceneMetadata?.esql?.headingAccent || ''}
              onChange={(e) => onUpdateSceneMetadata('esql', { ...sceneMetadata?.esql, headingAccent: e.target.value })}
              className={inputClass}
              placeholder="Investigation Workflows."
            />
          </div>

          <div>
            <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Subtitle</label>
            <textarea
              rows={2}
              value={sceneMetadata?.esql?.subtitle || ''}
              onChange={(e) => onUpdateSceneMetadata('esql', { ...sceneMetadata?.esql, subtitle: e.target.value })}
              className={inputClass}
              placeholder="A next-generation piped query language. Search, aggregate, transform, and visualize from a single query."
            />
          </div>

          <h3 className={`text-sm font-semibold pt-2 ${isDark ? 'text-white' : 'text-elastic-dark-ink'}`}>
            ES|QL Scene — Value Propositions
          </h3>

          {[
            { label: 'Card 1', titleKey: 'valuePropTitle0', descKey: 'valuePropDesc0', titlePlaceholder: 'Faster queries, at scale.', descPlaceholder: 'Multi-stage concurrent execution delivers greater speed and efficiency across billions of events. No pre-aggregation required.' },
            { label: 'Card 2', titleKey: 'valuePropTitle1', descKey: 'valuePropDesc1', titlePlaceholder: 'One query. One window.', descPlaceholder: 'Search, aggregate, calculate, transform, and visualize from a single pipeline. Refine as you go.' },
            { label: 'Card 3', titleKey: 'valuePropTitle2', descKey: 'valuePropDesc2', titlePlaceholder: 'Lookup, join, and transform.', descPlaceholder: 'Perform data transformations in one query with lookup and joins. No convoluted scripts. No redundant requests.' },
            { label: 'Card 4', titleKey: 'valuePropTitle3', descKey: 'valuePropDesc3', titlePlaceholder: 'More accurate alerting.', descPlaceholder: 'Review trends over isolated incidents to reduce false positives and surface more actionable notifications.' },
          ].map(({ label, titleKey, descKey, titlePlaceholder, descPlaceholder }, i) => {
            const titles = sceneMetadata?.esql?.valuePropTitles || []
            const descs  = sceneMetadata?.esql?.valuePropDescriptions || []
            return (
              <div key={i} className="space-y-3">
                <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>{label}</p>
                <div>
                  <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Title</label>
                  <input
                    type="text"
                    value={titles[i] || ''}
                    onChange={(e) => {
                      const next = [...titles]
                      next[i] = e.target.value
                      onUpdateSceneMetadata('esql', { ...sceneMetadata?.esql, valuePropTitles: next })
                    }}
                    className={inputClass}
                    placeholder={titlePlaceholder}
                  />
                </div>
                <div>
                  <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Description</label>
                  <textarea
                    rows={2}
                    value={descs[i] || ''}
                    onChange={(e) => {
                      const next = [...descs]
                      next[i] = e.target.value
                      onUpdateSceneMetadata('esql', { ...sceneMetadata?.esql, valuePropDescriptions: next })
                    }}
                    className={inputClass}
                    placeholder={descPlaceholder}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Services Scene ─────────────────────────────────────────────── */}
      {selectedScene === 'services' && (
        <div className="space-y-6 mt-6">

          <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-elastic-dark-ink'}`}>
            Services Scene — Header
          </h3>

          <div>
            <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Eyebrow Text</label>
            <input
              type="text"
              value={sceneMetadata?.services?.eyebrow || ''}
              onChange={(e) => onUpdateSceneMetadata('services', { ...sceneMetadata?.services, eyebrow: e.target.value })}
              className={inputClass}
              placeholder="Your Path to Success"
            />
          </div>

          <div>
            <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Heading — Plain</label>
            <input
              type="text"
              value={sceneMetadata?.services?.headingPlain || ''}
              onChange={(e) => onUpdateSceneMetadata('services', { ...sceneMetadata?.services, headingPlain: e.target.value })}
              className={inputClass}
              placeholder="Transform Faster "
            />
          </div>

          <div>
            <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Heading — Accent</label>
            <input
              type="text"
              value={sceneMetadata?.services?.headingAccent || ''}
              onChange={(e) => onUpdateSceneMetadata('services', { ...sceneMetadata?.services, headingAccent: e.target.value })}
              className={inputClass}
              placeholder="with Expert Guidance."
            />
          </div>

          <div>
            <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Subtitle</label>
            <textarea
              rows={3}
              value={sceneMetadata?.services?.subtitle || ''}
              onChange={(e) => onUpdateSceneMetadata('services', { ...sceneMetadata?.services, subtitle: e.target.value })}
              className={inputClass}
              placeholder="Skip the guesswork. Elastic Professional Services accelerates your deployment, migration, and adoption — so your team focuses on outcomes, not overhead."
            />
          </div>

          <h3 className={`text-sm font-semibold pt-2 ${isDark ? 'text-white' : 'text-elastic-dark-ink'}`}>
            Services Scene — Hidden Costs
          </h3>
          <p className={`text-xs ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>
            DIY Reality stage — cost items with severity (HIGH / MEDIUM / LOW).
          </p>

          {[
            { placeholder: 'Opportunity cost of delayed insights',      sev: 'HIGH'   },
            { placeholder: 'Engineer time diverted from impactful work', sev: 'HIGH'  },
            { placeholder: 'Production incidents during migration',      sev: 'MEDIUM' },
            { placeholder: 'Vendor support for edge cases',             sev: 'MEDIUM' },
            { placeholder: 'Re-work from initial mistakes',             sev: 'HIGH'   },
          ].map((item, i) => {
            const costs = sceneMetadata?.services?.hiddenCosts || []
            return (
              <div key={i} className="space-y-2">
                <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>Cost {i + 1}</p>
                <div>
                  <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Label</label>
                  <input
                    type="text"
                    value={costs[i]?.label || ''}
                    onChange={(e) => {
                      const next = [...costs]
                      next[i] = { ...next[i], label: e.target.value }
                      onUpdateSceneMetadata('services', { ...sceneMetadata?.services, hiddenCosts: next })
                    }}
                    className={inputClass}
                    placeholder={item.placeholder}
                  />
                </div>
                <div>
                  <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Severity</label>
                  <select
                    value={costs[i]?.severity || ''}
                    onChange={(e) => {
                      const next = [...costs]
                      next[i] = { ...next[i], severity: e.target.value }
                      onUpdateSceneMetadata('services', { ...sceneMetadata?.services, hiddenCosts: next })
                    }}
                    className={inputClass}
                  >
                    <option value="">Default ({item.sev})</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>
            )
          })}

          <h3 className={`text-sm font-semibold pt-2 ${isDark ? 'text-white' : 'text-elastic-dark-ink'}`}>
            Services Scene — Data Sources
          </h3>
          <p className={`text-xs ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>
            Zero Downtime demo — data source names shown in the left panel.
          </p>

          {['AWS', 'Linux Systems', 'Windows Systems', 'Palo Alto', 'CrowdStrike'].map((def, i) => {
            const sources = sceneMetadata?.services?.dataSources || []
            return (
              <div key={i}>
                <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Source {i + 1}</label>
                <input
                  type="text"
                  value={sources[i]?.name || ''}
                  onChange={(e) => {
                    const next = [...sources]
                    next[i] = { ...next[i], name: e.target.value }
                    onUpdateSceneMetadata('services', { ...sceneMetadata?.services, dataSources: next })
                  }}
                  className={inputClass}
                  placeholder={def}
                />
              </div>
            )
          })}

        </div>
      )}

      {/* ── Next Steps Scene ───────────────────────────────────────────── */}
      {selectedScene === 'next-steps' && (
        <div className="space-y-6 mt-6">

          <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-elastic-dark-ink'}`}>
            Next Steps — Header
          </h3>

          <div>
            <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Eyebrow Text</label>
            <input
              type="text"
              value={sceneMetadata?.['next-steps']?.eyebrow || ''}
              onChange={(e) => onUpdateSceneMetadata('next-steps', { ...sceneMetadata?.['next-steps'], eyebrow: e.target.value })}
              className={inputClass}
              placeholder="What Comes Next"
            />
          </div>

          <div>
            <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Heading — Plain</label>
            <input
              type="text"
              value={sceneMetadata?.['next-steps']?.headingPlain || ''}
              onChange={(e) => onUpdateSceneMetadata('next-steps', { ...sceneMetadata?.['next-steps'], headingPlain: e.target.value })}
              className={inputClass}
              placeholder="Ready to "
            />
          </div>

          <div>
            <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Heading — Accent</label>
            <input
              type="text"
              value={sceneMetadata?.['next-steps']?.headingAccent || ''}
              onChange={(e) => onUpdateSceneMetadata('next-steps', { ...sceneMetadata?.['next-steps'], headingAccent: e.target.value })}
              className={inputClass}
              placeholder="Get Started?"
            />
          </div>

          <div>
            <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Subtitle</label>
            <textarea
              rows={2}
              value={sceneMetadata?.['next-steps']?.subtitle || ''}
              onChange={(e) => onUpdateSceneMetadata('next-steps', { ...sceneMetadata?.['next-steps'], subtitle: e.target.value })}
              className={inputClass}
              placeholder="Here's a clear path forward — we'll guide you every step of the way."
            />
          </div>

          <h3 className={`text-sm font-semibold pt-2 ${isDark ? 'text-white' : 'text-elastic-dark-ink'}`}>
            Next Steps — Your Contact Info
          </h3>
          <p className={`text-xs ${isDark ? 'text-white/40' : 'text-elastic-dev-blue/40'}`}>
            Shown in the contact panel at the bottom right of the scene.
          </p>

          <div>
            <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Panel Heading</label>
            <input
              type="text"
              value={sceneMetadata?.['next-steps']?.ctaHeading || ''}
              onChange={(e) => onUpdateSceneMetadata('next-steps', { ...sceneMetadata?.['next-steps'], ctaHeading: e.target.value })}
              className={inputClass}
              placeholder="Let's keep the momentum going."
            />
          </div>

          <div>
            <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Your Name / Role</label>
            <input
              type="text"
              value={sceneMetadata?.['next-steps']?.ctaName || ''}
              onChange={(e) => onUpdateSceneMetadata('next-steps', { ...sceneMetadata?.['next-steps'], ctaName: e.target.value })}
              className={inputClass}
              placeholder="Jane Smith · Solutions Architect"
            />
          </div>

          <div>
            <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Email</label>
            <input
              type="text"
              value={sceneMetadata?.['next-steps']?.ctaEmail || ''}
              onChange={(e) => onUpdateSceneMetadata('next-steps', { ...sceneMetadata?.['next-steps'], ctaEmail: e.target.value })}
              className={inputClass}
              placeholder="jane.smith@elastic.co"
            />
          </div>

          <div>
            <label className={`text-xs mb-1 block ${isDark ? 'text-white/50' : 'text-elastic-dev-blue/50'}`}>Scheduling Link / Phone</label>
            <input
              type="text"
              value={sceneMetadata?.['next-steps']?.ctaPhone || ''}
              onChange={(e) => onUpdateSceneMetadata('next-steps', { ...sceneMetadata?.['next-steps'], ctaPhone: e.target.value })}
              className={inputClass}
              placeholder="calendly.com/jane-smith"
            />
          </div>

        </div>
      )}
    </div>
  )
}
