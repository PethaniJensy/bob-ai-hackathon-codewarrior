import { useState, useEffect } from 'react'
import { CloudLightning, MapPin, Truck, AlertTriangle, Navigation } from 'lucide-react'
import api from '../services/api'
import { LoadingState, ErrorState, EmptyState } from '../components/common/LoadingState'
import StatusBadge from '../components/common/StatusBadge'

const SEVERITY_CONFIG = {
  CRITICAL: { variant: 'critical', label: 'Critical' },
  HIGH:     { variant: 'warning', label: 'High' },
  MODERATE: { variant: 'info', label: 'Moderate' },
}

const AFFECTED_SHIPMENTS = [
  { id: 'SHP-8801', route: 'Omaha → Salt Lake City', impact: 'Route Blocked — Rescue in Progress', status: 'critical' },
  { id: 'SHP-8820', route: 'Chicago → Denver', impact: 'Potential delay — monitoring', status: 'warning' },
  { id: 'SHP-8842', route: 'Boston → Atlanta', impact: 'No impact — southern route clear', status: 'safe' },
]

export default function DisruptionsPage() {
  const [disruptions, setDisruptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getDisruptions()
      setDisruptions(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  if (loading) return <LoadingState message="Loading disruption data..." />
  if (error) return <ErrorState message={error} onRetry={fetchData} />

  return (
    <div className="space-y-6">
      {disruptions.length === 0 ? (
        <EmptyState
          title="No active disruptions"
          message="All routes are clear. No weather events or road closures detected."
          icon={CloudLightning}
        />
      ) : (
        disruptions.map((d) => {
          const sev = SEVERITY_CONFIG[d.severity] || SEVERITY_CONFIG.MODERATE
          return (
            <div key={d.id} className="space-y-4">
              {/* Main disruption card */}
              <div className="card overflow-hidden">
                <div className="bg-navy-950 px-6 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-brand-blue/20 flex items-center justify-center">
                        <CloudLightning size={20} className="text-brand-blue" />
                      </div>
                      <div>
                        <div className="text-white text-lg font-bold">{d.name}</div>
                        <div className="text-slate-400 text-sm">{d.type}</div>
                      </div>
                    </div>
                    <StatusBadge status={sev.variant} label={sev.label} />
                  </div>
                </div>

                <div className="px-6 py-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div>
                      <div className="label-upper mb-1">Affected Corridor</div>
                      <div className="text-sm font-semibold text-navy-950 flex items-start gap-1">
                        <Navigation size={13} className="text-surface-400 mt-0.5 shrink-0" />
                        {d.corridor}
                      </div>
                    </div>
                    <div>
                      <div className="label-upper mb-1">Impact</div>
                      <div className="text-sm font-semibold text-navy-950">{d.impact}</div>
                    </div>
                    <div>
                      <div className="label-upper mb-1">Radius</div>
                      <div className="text-sm font-semibold text-navy-950">{d.radius_miles} miles</div>
                    </div>
                    <div>
                      <div className="label-upper mb-1">Status</div>
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle size={13} className="text-brand-red" />
                        <span className="text-sm font-semibold text-brand-red">Road Closure</span>
                      </div>
                    </div>
                  </div>

                  {/* Alternative route */}
                  <div className="mt-5 pt-5 border-t border-surface-200">
                    <div className="flex items-start gap-3 bg-brand-green-light border border-green-200 rounded-lg p-4">
                      <Navigation size={15} className="text-brand-green mt-0.5 shrink-0" />
                      <div>
                        <div className="text-sm font-bold text-brand-green">AI Alternative Route Available</div>
                        <div className="text-sm text-green-800 mt-0.5">
                          Reroute via US-30 through Rawlins → Evanston → Salt Lake City.
                          Estimated additional time: +2h 15m. Road conditions: Clear.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Affected shipments */}
              <div className="card">
                <div className="card-header">
                  <span className="text-sm font-bold text-navy-950">Affected Shipments</span>
                </div>
                <div className="divide-y divide-surface-100">
                  {AFFECTED_SHIPMENTS.map((s) => (
                    <div key={s.id} className="flex items-center justify-between px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Truck size={14} className="text-surface-400 shrink-0" />
                        <div>
                          <div className="text-sm font-semibold text-navy-950">{s.id}</div>
                          <div className="text-xs text-surface-500">{s.route}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-surface-600">{s.impact}</span>
                        <StatusBadge status={s.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
