import { useState, useEffect } from 'react'
import { Truck, MapPin, Thermometer, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import api from '../services/api'
import StatusBadge from '../components/common/StatusBadge'
import { LoadingState, ErrorState } from '../components/common/LoadingState'

const STATUS_CONFIG = {
  AVAILABLE_IMMEDIATE: { label: 'Available', variant: 'safe', dot: 'bg-brand-green' },
  AVAILABLE_STANDBY:   { label: 'Available', variant: 'safe', dot: 'bg-brand-green' },
  DISPATCHED:          { label: 'Dispatched', variant: 'rescue', dot: 'bg-amber-500' },
  IN_TRANSIT:          { label: 'In Transit', variant: 'info', dot: 'bg-brand-blue' },
  AFFECTED:            { label: 'Disruption', variant: 'warning', dot: 'bg-amber-500' },
}

// Demo static fleet rows
const DEMO_FLEET = [
  {
    asset_id: 'REEFER-CO-11',
    equipment_type: '48ft Refrigerated Trailer',
    depot_name: 'Fort Collins Logistics Depot, CO',
    location: { lat: 40.5853, lng: -105.0844 },
    distance_miles: 48.6,
    eta_minutes: 55,
    status: 'AVAILABLE_STANDBY',
    cargo: 'Empty',
    temp: 4.2,
  },
  {
    asset_id: 'DRY-NE-22',
    equipment_type: '53ft Dry Van Trailer',
    depot_name: 'Omaha Distribution Center, NE',
    location: { lat: 41.2565, lng: -95.9345 },
    distance_miles: 320,
    eta_minutes: null,
    status: 'IN_TRANSIT',
    cargo: 'General Freight',
    temp: null,
  },
  {
    asset_id: 'REEFER-WY-09',
    equipment_type: '53ft Multi-Temp Refrigerated Trailer',
    depot_name: 'Laramie Freight Terminal, WY',
    location: { lat: 41.3114, lng: -105.5911 },
    distance_miles: 52,
    eta_minutes: null,
    status: 'AFFECTED',
    cargo: 'Frozen Goods',
    temp: -18.5,
  },
]

function StatCard({ label, value, icon: Icon, colorClass }) {
  return (
    <div className="card p-4 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorClass}`}>
        <Icon size={17} />
      </div>
      <div>
        <div className="text-xl font-bold text-navy-950">{value}</div>
        <div className="text-xs text-surface-500">{label}</div>
      </div>
    </div>
  )
}

export default function FleetPage() {
  const [fleet, setFleet] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getIdleFleet()
      // Merge live + demo
      const live = data.map((v) => ({ ...v, cargo: 'Empty', temp: 4.2 }))
      setFleet([...live, ...DEMO_FLEET.filter((d) => !live.find((l) => l.asset_id === d.asset_id))])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  if (loading) return <LoadingState message="Loading fleet data..." />
  if (error) return <ErrorState message={error} onRetry={fetchData} />

  const available = fleet.filter((v) => v.status === 'AVAILABLE_IMMEDIATE' || v.status === 'AVAILABLE_STANDBY')
  const inTransit = fleet.filter((v) => v.status === 'IN_TRANSIT')
  const affected  = fleet.filter((v) => v.status === 'AFFECTED')
  const refrigerated = fleet.filter((v) => v.equipment_type?.toLowerCase().includes('refrig'))

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Available" value={available.length} icon={CheckCircle} colorClass="bg-brand-green-light text-brand-green" />
        <StatCard label="In Transit" value={inTransit.length} icon={Truck} colorClass="bg-blue-50 text-brand-blue" />
        <StatCard label="Affected" value={affected.length} icon={AlertTriangle} colorClass="bg-amber-50 text-amber-600" />
        <StatCard label="Refrigerated" value={refrigerated.length} icon={Thermometer} colorClass="bg-surface-100 text-surface-600" />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="card-header">
          <span className="text-sm font-bold text-navy-950">Fleet Registry</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                {['Vehicle ID', 'Type', 'Status', 'Location', 'Cargo', 'Temperature', 'Distance', 'ETA'].map((h) => (
                  <th key={h} className="table-cell text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fleet.map((v) => {
                const sc = STATUS_CONFIG[v.status] || { label: v.status, variant: 'info', dot: 'bg-surface-400' }
                return (
                  <tr key={v.asset_id} className="table-row">
                    <td className="table-cell font-semibold text-navy-950">{v.asset_id}</td>
                    <td className="table-cell text-surface-700 max-w-[160px] truncate">{v.equipment_type}</td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${sc.dot}`} />
                        <StatusBadge status={sc.variant} label={sc.label} />
                      </div>
                    </td>
                    <td className="table-cell text-surface-600 max-w-[160px]">
                      <div className="flex items-center gap-1">
                        <MapPin size={11} className="text-surface-400 shrink-0" />
                        <span className="truncate">{v.depot_name}</span>
                      </div>
                    </td>
                    <td className="table-cell text-surface-600">{v.cargo || '—'}</td>
                    <td className="table-cell">
                      {v.temp !== null && v.temp !== undefined ? (
                        <span className="font-semibold text-brand-blue">{v.temp}°C</span>
                      ) : (
                        <span className="text-surface-400">N/A</span>
                      )}
                    </td>
                    <td className="table-cell text-surface-600">
                      {v.distance_miles ? `${v.distance_miles} mi` : '—'}
                    </td>
                    <td className="table-cell text-surface-600">
                      {v.eta_minutes ? `${v.eta_minutes} min` : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
