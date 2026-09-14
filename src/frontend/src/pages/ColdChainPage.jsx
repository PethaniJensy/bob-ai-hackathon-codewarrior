import { useState, useEffect } from 'react'
import {
  Thermometer, AlertTriangle, TrendingUp, DollarSign,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer,
} from 'recharts'
import api from '../services/api'
import { LoadingState, ErrorState } from '../components/common/LoadingState'

const TELEMETRY_SHP8801 = [
  { time: '11:00', temp: 4.1 },
  { time: '11:30', temp: 4.2 },
  { time: '12:00', temp: 4.5 },
  { time: '12:30', temp: 5.8 },
  { time: '01:00', temp: 7.2 },
  { time: '01:30', temp: 8.4 },
  { time: '02:00', temp: 9.1 },
]

const TELEMETRY_SHP9022 = [
  { time: '08:00', temp: 2.1 },
  { time: '08:30', temp: 2.3 },
  { time: '09:00', temp: 2.2 },
  { time: '09:30', temp: 2.5 },
  { time: '10:00', temp: 2.4 },
]

function MiniChart({ data, safeLimit, color }) {
  return (
    <ResponsiveContainer width="100%" height={100}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
        <defs>
          <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.15} />
            <stop offset="100%" stopColor={color} stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
        <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 9, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ fontSize: 11, borderRadius: 6, border: '1px solid #E2E8F0' }}
          formatter={(v) => [`${v.toFixed(1)}°C`, 'Temp']}
        />
        <ReferenceLine y={safeLimit} stroke="#DC2626" strokeDasharray="4 3" strokeWidth={1.5} />
        <Area type="monotone" dataKey="temp" stroke={color} strokeWidth={2} fill={`url(#grad-${color})`} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

function ShipmentCard({ id, title, carrier, safeRange, currentTemp, safeLimit, telemetry, mkt, isBreach, valueAtRisk }) {
  return (
    <div className={`card overflow-hidden ${isBreach ? 'border-l-4 border-l-brand-red' : 'border-l-4 border-l-brand-green'}`}>
      <div className="px-5 py-4 border-b border-surface-200 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            {isBreach && <AlertTriangle size={13} className="text-brand-red" />}
            <span className="text-sm font-bold text-navy-950">{id}</span>
            <span className={`badge text-xs ${isBreach ? 'badge-critical' : 'badge-safe'}`}>
              {isBreach ? 'BREACH' : 'SAFE'}
            </span>
          </div>
          <div className="text-xs text-surface-500 mt-0.5">{title}</div>
        </div>
        <div className="text-right">
          <div className={`text-xl font-bold ${isBreach ? 'text-brand-red' : 'text-brand-green'}`}>
            {currentTemp.toFixed(1)}°C
          </div>
          <div className="text-xs text-surface-400">Current</div>
        </div>
      </div>

      <div className="px-5 py-3">
        <div className="grid grid-cols-4 gap-3 text-xs mb-3">
          <div>
            <div className="label-upper text-[10px] mb-0.5">Safe Range</div>
            <div className="font-semibold text-navy-950">{safeRange}</div>
          </div>
          <div>
            <div className="label-upper text-[10px] mb-0.5">MKT</div>
            <div className={`font-semibold ${mkt > safeLimit ? 'text-brand-red' : 'text-brand-green'}`}>{mkt.toFixed(2)}°C</div>
          </div>
          <div>
            <div className="label-upper text-[10px] mb-0.5">Carrier</div>
            <div className="font-semibold text-surface-700 truncate">{carrier}</div>
          </div>
          <div>
            <div className="label-upper text-[10px] mb-0.5">Value at Risk</div>
            <div className={`font-semibold ${isBreach ? 'text-brand-red' : 'text-brand-green'}`}>${valueAtRisk.toLocaleString()}</div>
          </div>
        </div>
        <MiniChart data={telemetry} safeLimit={safeLimit} color={isBreach ? '#DC2626' : '#2563EB'} />
      </div>
    </div>
  )
}

export default function ColdChainPage() {
  const [shipments, setShipments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getShipments()
      setShipments(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  if (loading) return <LoadingState message="Loading cold chain data..." />
  if (error) return <ErrorState message={error} onRetry={fetchData} />

  const critical = shipments.filter((s) => s.status === 'CRITICAL_EXCURSION')
  const allTemps = shipments.map((s) => s.temperature_history[s.temperature_history.length - 1])
  const avgTemp = allTemps.reduce((a, b) => a + b, 0) / allTemps.length || 0
  const maxTemp = Math.max(...allTemps)

  return (
    <div className="space-y-6">
      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Breaches', value: critical.length, icon: AlertTriangle, cls: critical.length > 0 ? 'text-brand-red' : 'text-brand-green', bg: critical.length > 0 ? 'bg-red-50' : 'bg-brand-green-light' },
          { label: 'Avg Temperature', value: `${avgTemp.toFixed(1)}°C`, icon: Thermometer, cls: 'text-brand-blue', bg: 'bg-blue-50' },
          { label: 'Max Temperature', value: `${maxTemp.toFixed(1)}°C`, icon: TrendingUp, cls: maxTemp > 8 ? 'text-brand-red' : 'text-brand-blue', bg: maxTemp > 8 ? 'bg-red-50' : 'bg-blue-50' },
          { label: 'Cargo Value at Risk', value: `$${critical.reduce((a, s) => a + s.value_usd, 0).toLocaleString()}`, icon: DollarSign, cls: 'text-brand-red', bg: 'bg-red-50' },
        ].map(({ label, value, icon: Icon, cls, bg }) => (
          <div key={label} className="card p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${bg}`}>
              <Icon size={17} className={cls} />
            </div>
            <div>
              <div className={`text-xl font-bold ${cls}`}>{value}</div>
              <div className="text-xs text-surface-500">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Shipment cards */}
      <div className="space-y-4">
        {shipments.map((s) => {
          const temp = s.temperature_history[s.temperature_history.length - 1]
          const isBreach = s.status === 'CRITICAL_EXCURSION'
          const telemetry = s.id === 'SHP-8801' ? TELEMETRY_SHP8801 : TELEMETRY_SHP9022
          const mkt = s.telemetry_analysis?.mkt_celsius ?? temp
          const safeMax = parseFloat(s.target_temp_range?.split(' to ')[1]) || 8

          return (
            <ShipmentCard
              key={s.id}
              id={s.id}
              title={s.title}
              carrier={s.carrier}
              safeRange={s.target_temp_range}
              currentTemp={temp}
              safeLimit={safeMax}
              telemetry={telemetry}
              mkt={mkt}
              isBreach={isBreach}
              valueAtRisk={s.value_usd}
            />
          )
        })}
      </div>
    </div>
  )
}
