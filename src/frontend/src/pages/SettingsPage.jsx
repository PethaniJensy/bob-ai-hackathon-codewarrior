import { Settings, Bell, Shield, Database, User } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* API Configuration */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
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
              defaultValue="http://localhost:8000"
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
          {[
            { label: 'Temperature Breach Alert (°C)', value: '8.0' },
            { label: 'MKT Warning Threshold (°C)', value: '8.5' },
            { label: 'Fleet Idle Alert (hours)', value: '6' },
          ].map(({ label, value }) => (
            <div key={label}>
              <label className="label-upper mb-1.5 block">{label}</label>
              <input type="number" className="input" defaultValue={value} />
            </div>
          ))}
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

      <div className="flex gap-3">
        <button className="btn-primary">Save Changes</button>
        <button className="btn-secondary">Reset to Defaults</button>
      </div>
    </div>
  )
}
