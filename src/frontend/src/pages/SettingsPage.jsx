import { useState } from 'react'
import { Settings, Bell, Shield, Database, User, CheckCircle2 } from 'lucide-react'

const DEFAULTS = {
  apiUrl: 'http://localhost:8000',
  tempBreachAlert: '8.0',
  mktWarningThreshold: '8.5',
  fleetIdleAlert: '6',
}

export default function SettingsPage() {
  const [form, setForm] = useState(DEFAULTS)
  const [saved, setSaved] = useState(false)

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    setSaved(false)
  }

  const handleSave = () => {
    localStorage.setItem('codewarrior_settings', JSON.stringify(form))
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleReset = () => {
    setForm(DEFAULTS)
    localStorage.removeItem('codewarrior_settings')
    setSaved(false)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        {/* API Configuration */}
        <div className="card">
          <div className="card-header flex items-center gap-2">
            <Database size={15} className="text-surface-500" />
            <span className="text-sm font-bold text-navy-950">Backend API Configuration</span>
          </div>
          <div className="px-5 py-4 space-y-4">
            <div>
              <label className="label-upper mb-1.5 block">Backend API URL</label>
              <input
                type="text"
                className="input"
                value={form.apiUrl}
                onChange={handleChange('apiUrl')}
                aria-label="Backend API URL"
              />
            </div>
            <div>
              <label className="label-upper mb-1.5 block">Health Check Endpoint</label>
              <input type="text" className="input" defaultValue="/health" readOnly aria-label="Health endpoint" />
            </div>
            <div className="flex items-center gap-2 bg-brand-green-light border border-green-200 rounded-md px-3 py-2">
              <span className="w-2 h-2 rounded-full bg-brand-green" />
              <span className="text-sm text-brand-green font-medium">Backend connection active</span>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="card">
          <div className="card-header flex items-center gap-2">
            <Bell size={15} className="text-surface-500" />
            <span className="text-sm font-bold text-navy-950">Alert Thresholds</span>
          </div>
          <div className="px-5 py-4 space-y-4">
            <div>
              <label className="label-upper mb-1.5 block">Temperature Breach Alert (°C)</label>
              <input
                type="number"
                className="input"
                value={form.tempBreachAlert}
                onChange={handleChange('tempBreachAlert')}
              />
            </div>
            <div>
              <label className="label-upper mb-1.5 block">MKT Warning Threshold (°C)</label>
              <input
                type="number"
                className="input"
                value={form.mktWarningThreshold}
                onChange={handleChange('mktWarningThreshold')}
              />
            </div>
            <div>
              <label className="label-upper mb-1.5 block">Fleet Idle Alert (hours)</label>
              <input
                type="number"
                className="input"
                value={form.fleetIdleAlert}
                onChange={handleChange('fleetIdleAlert')}
              />
            </div>
          </div>
        </div>

        {/* System */}
        <div className="card">
          <div className="card-header flex items-center gap-2">
            <Shield size={15} className="text-surface-500" />
            <span className="text-sm font-bold text-navy-950">System</span>
          </div>
          <div className="px-5 py-4 space-y-2 text-sm">
            <div className="flex justify-between py-1.5 border-b border-surface-100">
              <span className="text-surface-500">Version</span>
              <span className="font-medium text-navy-950">CODEWARRIOR AI v1.0.0</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-surface-100">
              <span className="text-surface-500">Backend</span>
              <span className="font-medium text-navy-950">FastAPI 1.0.0 (Python)</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-surface-500">IBM Bob Integration</span>
              <span className="font-medium text-brand-green">Connected</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="btn-primary" onClick={handleSave}>Save Changes</button>
        <button className="btn-secondary" onClick={handleReset}>Reset to Defaults</button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-brand-green font-medium">
            <CheckCircle2 size={15} /> Settings saved
          </span>
        )}
      </div>
    </div>
  )
}