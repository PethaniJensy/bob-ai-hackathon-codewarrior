import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'
import { Thermometer } from 'lucide-react'

const TELEMETRY = [
  { time: '11:00', temp: 4.1 },
  { time: '11:30', temp: 4.2 },
  { time: '12:00', temp: 4.5 },
  { time: '12:30', temp: 5.8 },
  { time: '01:00', temp: 7.2 },
  { time: '01:30', temp: 8.4 },
  { time: '02:00', temp: 9.1 },
]

const SAFE_LIMIT = 8.0

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const val = payload[0]?.value
  const breach = val > SAFE_LIMIT
  return (
    <div className="bg-white border border-surface-200 rounded-lg shadow-md px-3 py-2 text-xs">
      <div className="font-semibold text-surface-700 mb-1">{label}</div>
      <div className={`font-bold text-base ${breach ? 'text-brand-red' : 'text-brand-blue'}`}>
        {val?.toFixed(1)}°C
      </div>
      <div className={`mt-0.5 ${breach ? 'text-brand-red' : 'text-surface-500'}`}>
        {breach ? '⚠ Above safe limit' : '✓ Within safe range'}
      </div>
    </div>
  )
}

function getLineColor(data) {
  // Recharts doesn't natively segment line color; we handle via gradient
  return 'url(#tempGradient)'
}

export default function TemperatureChart({ shipment }) {
  const data = shipment?.temperature_history
    ? TELEMETRY.map((p, i) => ({
        ...p,
        temp: shipment.temperature_history[i] ?? p.temp,
      }))
    : TELEMETRY

  const currentTemp = data[data.length - 1]?.temp ?? 9.1

  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Thermometer size={16} className="text-surface-500" />
          <span className="text-sm font-bold text-navy-950">IoT Reefer Temperature Telemetry</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-brand-blue inline-block rounded" />
            <span className="text-surface-500">Temperature</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-brand-red inline-block rounded border-dashed" style={{ borderTop: '2px dashed' }} />
            <span className="text-surface-500">Safe Limit (8°C)</span>
          </div>
        </div>
      </div>

      <div className="px-5 pt-4 pb-2">
        {/* Current reading pills */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-md px-3 py-1.5">
            <Thermometer size={13} className="text-brand-red" />
            <span className="text-xs font-semibold text-brand-red">Current: {currentTemp.toFixed(1)}°C</span>
          </div>
          <div className="flex items-center gap-2 bg-brand-green-light border border-green-200 rounded-md px-3 py-1.5">
            <span className="text-xs font-semibold text-brand-green">Safe Threshold: {SAFE_LIMIT.toFixed(1)}°C</span>
          </div>
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-md px-3 py-1.5">
            <span className="text-xs font-semibold text-brand-red">
              +{(currentTemp - SAFE_LIMIT).toFixed(1)}°C above limit
            </span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="65%" stopColor="#2563EB" />
                <stop offset="75%" stopColor="#DC2626" />
                <stop offset="100%" stopColor="#DC2626" />
              </linearGradient>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity={0.12} />
                <stop offset="100%" stopColor="#2563EB" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: '#64748B' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[2, 12]}
              tick={{ fontSize: 11, fill: '#64748B' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}°`}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={SAFE_LIMIT}
              stroke="#DC2626"
              strokeDasharray="5 4"
              strokeWidth={1.5}
              label={{ value: '8°C Limit', position: 'right', fontSize: 10, fill: '#DC2626' }}
            />
            <Area
              type="monotone"
              dataKey="temp"
              stroke="url(#tempGradient)"
              strokeWidth={2.5}
              fill="url(#areaGradient)"
              dot={(props) => {
                const { cx, cy, payload } = props
                const breach = payload.temp > SAFE_LIMIT
                return (
                  <circle
                    key={`dot-${cx}`}
                    cx={cx}
                    cy={cy}
                    r={4}
                    fill={breach ? '#DC2626' : '#2563EB'}
                    stroke="white"
                    strokeWidth={2}
                  />
                )
              }}
              activeDot={{ r: 5, fill: '#2563EB', stroke: 'white', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
