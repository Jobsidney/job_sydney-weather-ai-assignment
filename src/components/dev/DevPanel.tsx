import { useState } from 'react'
import { Settings, Database, Wifi, WifiOff } from 'lucide-react'
import { DEV_CONFIG } from '@/config/dev'

export function DevPanel() {
  const [isOpen, setIsOpen] = useState(false)
  
  // Only show in development
  if (import.meta.env.PROD) return null

  const toggleMockData = () => {
    DEV_CONFIG.USE_MOCK_DATA = !DEV_CONFIG.USE_MOCK_DATA
    window.location.reload() // Reload to apply changes
  }

  const toggleApiCall = (apiType: keyof typeof DEV_CONFIG.ENABLE_API_CALLS) => {
    DEV_CONFIG.ENABLE_API_CALLS[apiType] = !DEV_CONFIG.ENABLE_API_CALLS[apiType]
    window.location.reload()
  }

  return (
    <div className="dev-panel">
      <button
        className="dev-panel__toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Developer Panel"
      >
        <Settings size={16} />
        <span>DEV</span>
      </button>

      {isOpen && (
        <div className="dev-panel__content">
          <div className="dev-panel__header">
            <h4>Developer Panel</h4>
            <button onClick={() => setIsOpen(false)}>×</button>
          </div>
          
          <div className="dev-panel__section">
            <h5>Data source</h5>
            <button
              className={`dev-panel__btn ${DEV_CONFIG.USE_MOCK_DATA ? 'dev-panel__btn--active' : ''}`}
              onClick={toggleMockData}
            >
              {DEV_CONFIG.USE_MOCK_DATA ? <Database size={14} /> : <Wifi size={14} />}
              {DEV_CONFIG.USE_MOCK_DATA ? 'Using Mock Data ✅' : 'Using Live API ⚠️'}
            </button>
          </div>

          <div className="dev-panel__section">
            <h5>Individual APIs</h5>
            {Object.entries(DEV_CONFIG.ENABLE_API_CALLS).map(([api, enabled]) => (
              <button
                key={api}
                className={`dev-panel__btn ${enabled ? 'dev-panel__btn--enabled' : ''}`}
                onClick={() => toggleApiCall(api as keyof typeof DEV_CONFIG.ENABLE_API_CALLS)}
              >
                {enabled ? <Wifi size={12} /> : <WifiOff size={12} />}
                {api}: {enabled ? 'Live' : 'Mock'}
              </button>
            ))}
          </div>

          <div className="dev-panel__section">
            <p style={{ fontSize: '11px', color: 'var(--nav-text-muted)' }}>
              Changes require page reload
            </p>
          </div>
        </div>
      )}
    </div>
  )
}