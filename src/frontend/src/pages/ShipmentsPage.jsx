import { useState, useEffect } from 'react'
import { Search, Filter, ChevronRight, X, Package, MapPin, Thermometer, Truck } from 'lucide-react'
import api from '../services/api'
import StatusBadge from '../components/common/StatusBadge'
import { LoadingState, ErrorState, EmptyState } from '../components/common/LoadingState'

const STATUS_LABELS = {
  CRITICAL_EXCURSION: { label: 'Critical', variant: 'critical' },
  OPTIMAL: { label: 'Safe', variant: 'safe' },
  WARNING: { label: 'Warning', variant: 'warning' },
  DELAYED: { label: 'Delayed', variant: 'warning' },
  RESCUE_IN_PROGRESS: { label: 'Rescue In Progress', variant: 'rescue' },
  PROTECTED: { label: 'Protected', variant: 'protected' },
}

// Static demo rows to supplement live data
const DEMO_ROWS = [
  {
    id: 'SHP-8820',
    title: 'Blood Plasma & Biologics',
    cargo_type: 'Pharmaceutical',
    origin: 'Chicago, IL',
    destination: 'Denver, CO',
    carrier: 'ColdLine Express #07',
    temperature_history: [3.2, 3.5, 3.8, 4.1, 4.0],
    status: 'WARNING',
    value_usd: 180000,
    eta: '4h 20m',
  },
  {
    id: 'SHP-8815',
    title: 'Frozen Seafood – Premium Grade',
    cargo_type: 'Perishable Foods',
    origin: 'Seattle, WA',
    destination: 'Chicago, IL',
    carrier: 'PolarFreight #33',
    temperature_history: [-18.2, -18.0, -17.9, -18.1],
    status: 'OPTIMAL',
    value_usd: 62000,
    eta: '9h 10m',
  },
  {
    id: 'SHP-8842',
    title: 'Insulin & Diabetic Supplies',
    cargo_type: 'Pharmaceutical',
    origin: 'Boston, MA',
    destination: 'Atlanta, GA',
    carrier: 'MedFreight #05',
    temperature_history: [5.1, 5.2, 5.0, 5.3, 5.2],
    status: 'OPTIMAL',
    value_usd: 95000,
    eta: '6h 45m',
  },
]

function getLatestTemp(history) {
  if (!history?.length) return null
  return history[history.length - 1]
}

function TempCell({ history, safeMax = 8 }) {
  const temp = getLatestTemp(history)
  if (temp === null) return <span className="text-surface-400">—</span>
  const breach = temp > safeMax
  return (
    <span className={`font-semibold ${breach ? 'text-brand-red' : 'text-brand-green'}`}>
      {temp.toFixed(1)}°C
    </span>
  )
}

function ShipmentDrawer({ shipment, onClose }) {
  if (!shipment) return null
  const statusInfo = STATUS_LABELS[shipment.status] || { label: shipment.status, variant: 'info' }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md shadow-xl overflow-y-auto scrollbar-thin">
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-200 sticky top-0 bg-white z-10">
          <div>
            <div className="text-base font-bold text-navy-950">{shipment.id}</div>
            <div className="text-xs text-surface-500">{shipment.carrier}</div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md text-surface-400 hover:bg-surface-100 transition-colors" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <div className="label-upper mb-1">Cargo</div>
            <div className="text-sm font-semibold text-navy-950">{shipment.title}</div>
            <div className="text-xs text-surface-500 mt-0.5">{shipment.cargo_type}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="label-upper mb-1">Origin</div>
              <div className="text-sm font-medium text-navy-950">{shipment.origin}</div>
            </div>
            <div>
              <div className="label-upper mb-1">Destination</div>
              <div className="text-sm font-medium text-navy-950">{shipment.destination}</div>
            </div>
            <div>
              <div className="label-upper mb-1">Status</div>
              <StatusBadge status={statusInfo.variant} label={statusInfo.label} />
            </div>
            <div>
              <div className="label-upper mb-1">Cargo Value</div>
              <div className="text-sm font-semibold text-navy-950">
                ${shipment.value_usd?.toLocaleString()}
              </div>
            </div>
          </div>

          <div>
            <div className="label-upper mb-2">Temperature History</div>
            <div className="flex items-end gap-1.5 h-12">
              {shipment.temperature_history?.map((t, i) => {
                const max = Math.max(...shipment.temperature_history)
                const pct = max > 0 ? (t / max) * 100 : 50
                const breach = t > 8
                return (
                  <div
                    key={i}
                    className={`flex-1 rounded-sm ${breach ? 'bg-brand-red' : 'bg-brand-blue'}`}
                    style={{ height: `${Math.max(20, pct)}%` }}
                    title={`${t}°C`}
                  />
                )
              })}
            </div>
            <div className="flex justify-between text-xs text-surface-400 mt-1">
              <span>Earliest</span>
              <span>Latest: {getLatestTemp(shipment.temperature_history)?.toFixed(1)}°C</span>
            </div>
          </div>

          {shipment.telemetry_analysis && (
            <div className="bg-surface-50 border border-surface-200 rounded-lg p-3 text-sm space-y-1.5">
              <div className="label-upper mb-2">Telemetry Analysis</div>
              {shipment.telemetry_analysis.mkt_celsius && (
                <div className="flex justify-between">
                  <span className="text-surface-500">MKT</span>
                  <span className="font-semibold text-navy-950">{shipment.telemetry_analysis.mkt_celsius.toFixed(2)}°C</span>
                </div>
              )}
              {shipment.telemetry_analysis.excursion_detected !== undefined && (
                <div className="flex justify-between">
                  <span className="text-surface-500">Excursion</span>
                  <span className={`font-semibold ${shipment.telemetry_analysis.excursion_detected ? 'text-brand-red' : 'text-brand-green'}`}>
                    {shipment.telemetry_analysis.excursion_detected ? 'Detected' : 'None'}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selected, setSelected] = useState(null)
  const [sortBy, setSortBy] = useState('status')

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getShipments()
      setShipments([...data, ...DEMO_ROWS])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const allStatuses = ['ALL', ...new Set(shipments.map((s) => s.status))]

  const filtered = shipments
    .filter((s) => {
      if (statusFilter !== 'ALL' && s.status !== statusFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          s.id.toLowerCase().includes(q) ||
          s.title?.toLowerCase().includes(q) ||
          s.origin?.toLowerCase().includes(q) ||
          s.destination?.toLowerCase().includes(q)
        )
      }
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'status') {
        const priority = { CRITICAL_EXCURSION: 0, WARNING: 1, DELAYED: 2, OPTIMAL: 3, PROTECTED: 4 }
        return (priority[a.status] ?? 5) - (priority[b.status] ?? 5)
      }
      if (sortBy === 'value') return b.value_usd - a.value_usd
      return 0
    })

  if (loading) return <LoadingState message="Loading shipments..." />
  if (error) return <ErrorState message={error} onRetry={fetchData} />

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            type="search"
            placeholder="Search shipments, cargo, route..."
            className="input pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            className="input w-auto"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
          >
            {allStatuses.map((s) => (
              <option key={s} value={s}>{s === 'ALL' ? 'All Statuses' : STATUS_LABELS[s]?.label || s}</option>
            ))}
          </select>
          <select
            className="input w-auto"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort by"
          >
            <option value="status">Sort: Risk</option>
            <option value="value">Sort: Value</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <EmptyState title="No shipments found" message="Try adjusting your search or filter." icon={Package} />
          ) : (
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  {['Shipment ID', 'Cargo', 'Origin', 'Destination', 'Carrier', 'Temperature', 'Risk', 'Status', ''].map((h) => (
                    <th key={h} className="table-cell text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => {
                  const statusInfo = STATUS_LABELS[s.status] || { label: s.status, variant: 'info' }
                  return (
                    <tr
                      key={s.id}
                      className="table-row"
                      onClick={() => setSelected(s)}
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && setSelected(s)}
                      role="button"
                      aria-label={`View details for ${s.id}`}
                    >
                      <td className="table-cell font-semibold text-navy-950">{s.id}</td>
                      <td className="table-cell max-w-[180px] truncate text-surface-700">{s.title}</td>
                      <td className="table-cell text-surface-600">{s.origin}</td>
                      <td className="table-cell text-surface-600">{s.destination}</td>
                      <td className="table-cell text-surface-600 max-w-[140px] truncate">{s.carrier}</td>
                      <td className="table-cell">
                        <TempCell history={s.temperature_history} />
                      </td>
                      <td className="table-cell">
                        <StatusBadge status={statusInfo.variant} label={statusInfo.label} />
                      </td>
                      <td className="table-cell">
                        <span className="text-sm text-surface-500">{s.eta || '—'}</span>
                      </td>
                      <td className="table-cell">
                        <ChevronRight size={14} className="text-surface-400" />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Detail drawer */}
      {selected && <ShipmentDrawer shipment={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
