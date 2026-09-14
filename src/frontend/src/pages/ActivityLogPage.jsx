import {
  Thermometer, Search, Truck, Brain, CheckCircle, AlertTriangle, Navigation, Shield, Clock,
} from 'lucide-react'

const EVENTS = [
  {
    id: 1,
    time: '02:14 PM',
    label: 'Temperature breach detected.',
    desc: 'SHP-8801 IoT sensor reported 9.1°C — exceeds 8.0°C safe threshold.',
    icon: AlertTriangle,
    color: 'red',
  },
  {
    id: 2,
    time: '02:15 PM',
    label: 'MKT calculation completed.',
    desc: 'Mean Kinetic Temperature: 8.42°C. Cumulative thermal exposure confirms spoilage risk.',
    icon: Thermometer,
    color: 'blue',
  },
  {
    id: 3,
    time: '02:16 PM',
    label: 'Nearby fleet identified.',
    desc: 'Fleet Radar located REEFER-WY-04 at Cheyenne Logistics Hub — 14.2 miles from SHP-8801.',
    icon: Search,
    color: 'blue',
  },
  {
    id: 4,
    time: '02:17 PM',
    label: 'AI rescue recommendation generated.',
    desc: 'IBM Bob generated emergency rescue plan with 96% confidence. Divert to Cheyenne Cold Storage.',
    icon: Brain,
    color: 'blue',
  },
  {
    id: 5,
    time: '02:18 PM',
    label: 'Rescue dispatch authorized.',
    desc: 'Operator authorized emergency rescue. IBM Bob confirmed operational authority.',
    icon: Shield,
    color: 'green',
  },
  {
    id: 6,
    time: '02:19 PM',
    label: 'Replacement vehicle dispatched.',
    desc: 'REEFER-WY-04 departed Cheyenne Logistics Hub. ETA: 22 minutes. Cargo transfer underway.',
    icon: Truck,
    color: 'green',
  },
  {
    id: 7,
    time: '02:41 PM',
    label: 'Cargo transfer complete.',
    desc: 'Pediatric vaccine cargo successfully transferred. All 10,000 doses secured at Cheyenne Certified Cold Storage.',
    icon: CheckCircle,
    color: 'green',
  },
]

const COLOR = {
  red:   { dot: 'bg-brand-red', line: 'border-brand-red/20', bg: 'bg-red-50', border: 'border-red-100', icon: 'text-brand-red', text: 'text-brand-red' },
  blue:  { dot: 'bg-brand-blue', line: 'border-brand-blue/20', bg: 'bg-blue-50', border: 'border-blue-100', icon: 'text-brand-blue', text: 'text-brand-blue' },
  green: { dot: 'bg-brand-green', line: 'border-brand-green/20', bg: 'bg-brand-green-light', border: 'border-green-200', icon: 'text-brand-green', text: 'text-brand-green' },
}

export default function ActivityLogPage() {
  return (
    <div className="space-y-4">
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <span className="text-sm font-bold text-navy-950">Event Timeline</span>
          <span className="text-xs text-surface-400">{EVENTS.length} events — Today</span>
        </div>

        <div className="px-5 py-5">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-surface-200" />

            <ol className="space-y-6" aria-label="Activity timeline">
              {EVENTS.map((e, idx) => {
                const c = COLOR[e.color] || COLOR.blue
                const Icon = e.icon
                return (
                  <li key={e.id} className="relative flex items-start gap-4">
                    {/* Dot */}
                    <div className={`relative z-10 w-9 h-9 rounded-full border-2 border-white flex items-center justify-center shrink-0 ${c.bg}`}>
                      <Icon size={15} className={c.icon} aria-hidden />
                    </div>

                    {/* Content */}
                    <div className={`flex-1 rounded-lg border ${c.border} ${c.bg} px-4 py-3 min-w-0`}>
                      <div className="flex items-start justify-between gap-2">
                        <span className={`text-sm font-semibold ${c.text}`}>{e.label}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <Clock size={11} className="text-surface-400" />
                          <span className="text-xs text-surface-400">{e.time}</span>
                        </div>
                      </div>
                      <p className="text-xs text-surface-600 mt-0.5 leading-relaxed">{e.desc}</p>
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
