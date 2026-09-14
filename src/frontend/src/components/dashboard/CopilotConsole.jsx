import { Brain, Thermometer, Search, Truck, CheckCircle, AlertTriangle, Circle } from 'lucide-react'

const EVENTS = [
  {
    id: 1,
    time: '02:14 PM',
    agent: 'Bob Agent',
    icon: Brain,
    color: 'blue',
    text: 'Temperature breach detected for SHP-8801. Current reading 9.1°C exceeds safe threshold of 8.0°C.',
    status: 'critical',
  },
  {
    id: 2,
    time: '02:15 PM',
    agent: 'MKT Calculator',
    icon: Thermometer,
    color: 'blue',
    text: 'Mean Kinetic Temperature calculated: 8.42°C. Cumulative thermal exposure indicates spoilage risk for pediatric vaccines.',
    status: 'warning',
  },
  {
    id: 3,
    time: '02:16 PM',
    agent: 'Fleet Radar',
    icon: Search,
    color: 'green',
    text: 'Nearby idle refrigerated unit detected: REEFER-WY-04 at Cheyenne Logistics Hub — 14.2 miles from current shipment position.',
    status: 'success',
  },
  {
    id: 4,
    time: '02:17 PM',
    agent: 'Bob Agent',
    icon: Brain,
    color: 'blue',
    text: 'AI rescue recommendation generated. Confidence: 96%. Recommending divert to Cheyenne Certified Cold Storage.',
    status: 'info',
  },
]

const COLOR_MAP = {
  blue:  { dot: 'bg-brand-blue', border: 'border-blue-100', bg: 'bg-blue-50', text: 'text-brand-blue', icon: 'text-brand-blue' },
  green: { dot: 'bg-brand-green', border: 'border-green-100', bg: 'bg-brand-green-light', text: 'text-brand-green', icon: 'text-brand-green' },
  red:   { dot: 'bg-brand-red', border: 'border-red-100', bg: 'bg-red-50', text: 'text-brand-red', icon: 'text-brand-red' },
}

export default function CopilotConsole({ extraEvents = [] }) {
  const allEvents = [...EVENTS, ...extraEvents]

  return (
    <div className="card flex flex-col h-full">
      <div className="card-header">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-navy-950 rounded-md flex items-center justify-center">
            <Brain size={14} className="text-brand-blue" />
          </div>
          <div>
            <div className="text-sm font-bold text-navy-950">IBM Bob Copilot</div>
            <div className="text-xs text-surface-400">AI-powered operational decision support</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-4 space-y-3 max-h-96">
        {allEvents.map((event, idx) => {
          const c = COLOR_MAP[event.color] || COLOR_MAP.blue
          const Icon = event.icon
          return (
            <div key={event.id} className={`rounded-lg border ${c.border} ${c.bg} p-3`}>
              <div className="flex items-start gap-2.5">
                <div className={`w-6 h-6 rounded-md bg-white border ${c.border} flex items-center justify-center shrink-0 mt-0.5`}>
                  <Icon size={12} className={c.icon} aria-hidden />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className={`text-xs font-bold ${c.text}`}>{event.agent}</span>
                    <span className="text-xs text-surface-400 shrink-0">{event.time}</span>
                  </div>
                  <p className="text-xs text-surface-700 leading-relaxed">{event.text}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Status bar */}
      <div className="px-5 py-3 border-t border-surface-200 flex items-center gap-2">
        <Circle size={7} className="text-brand-green fill-brand-green" />
        <span className="text-xs text-surface-500">IBM Bob is actively monitoring all shipments</span>
      </div>
    </div>
  )
}
