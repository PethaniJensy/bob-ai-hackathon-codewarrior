import { Brain, AlertTriangle, CheckCircle, TrendingUp, DollarSign, Clock } from 'lucide-react'

const RECOMMENDATIONS = [
  {
    id: 'REC-001',
    priority: 1,
    title: 'DIVERT SHP-8801',
    problem: 'Temperature breach + highway closure',
    risk: 'Pediatric vaccine cargo at critical risk — 10,000 doses valued at $520,000',
    reasoning: [
      'Temperature exceeded safe threshold: 9.1°C vs 8.0°C limit.',
      'Winter Storm Boreas has closed I-80 between Cheyenne and Laramie.',
      'Nearest certified cold-storage facility is 22 minutes away via alternate route.',
      'REEFER-WY-04 is immediately available at Cheyenne Logistics Hub (14.2 miles).',
    ],
    action: 'Dispatch REEFER-WY-04 to intercept SHP-8801 and transfer cargo to Cheyenne Certified Cold Storage (Gate 3).',
    impact: '$520,000 cargo protected. 100% spoilage prevention.',
    confidence: 96,
    urgency: 'critical',
    eta: '22 min',
    value: 520000,
  },
  {
    id: 'REC-002',
    priority: 2,
    title: 'MONITOR SHP-8820',
    problem: 'Elevated temperature trend detected',
    risk: 'Blood plasma showing gradual upward temperature trend. Not yet in breach.',
    reasoning: [
      'MKT trending above baseline — 4.1°C vs 2°C lower limit.',
      'Carrier has been in transit 12+ hours without stop.',
      'Weather forecast shows clear roads on current route.',
    ],
    action: 'Issue temperature alert to carrier. Schedule proactive reefer unit check at next waypoint.',
    impact: 'Prevent potential $180,000 blood plasma loss.',
    confidence: 78,
    urgency: 'warning',
    eta: '—',
    value: 180000,
  },
  {
    id: 'REC-003',
    priority: 3,
    title: 'OPTIMIZE REEFER-CO-11',
    problem: 'Standby refrigerated unit underutilized',
    risk: 'Low — opportunity for operational efficiency.',
    reasoning: [
      'REEFER-CO-11 has been on standby at Fort Collins for 8+ hours.',
      'SHP-8815 is routed through the same corridor.',
      'Fuel and maintenance optimization available.',
    ],
    action: 'Assign REEFER-CO-11 as secondary escort for SHP-8815 on Seattle–Chicago route.',
    impact: 'Improve cargo protection coverage by 25%.',
    confidence: 64,
    urgency: 'info',
    eta: '—',
    value: 62000,
  },
]

const URGENCY_CONFIG = {
  critical: {
    border: 'border-l-4 border-l-brand-red',
    badge: 'badge-critical',
    badgeLabel: 'Critical Priority',
    icon: AlertTriangle,
    iconCls: 'text-brand-red',
  },
  warning: {
    border: 'border-l-4 border-l-amber-400',
    badge: 'badge-warning',
    badgeLabel: 'Medium Priority',
    icon: AlertTriangle,
    iconCls: 'text-amber-500',
  },
  info: {
    border: 'border-l-4 border-l-brand-blue',
    badge: 'badge-blue',
    badgeLabel: 'Low Priority',
    icon: Brain,
    iconCls: 'text-brand-blue',
  },
}

export default function AIRecommendationsPage() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="card p-5 flex items-center gap-4 bg-navy-950">
        <div className="w-10 h-10 bg-brand-blue rounded-lg flex items-center justify-center">
          <Brain size={20} className="text-white" />
        </div>
        <div>
          <div className="text-white font-bold">IBM Bob AI Recommendation Center</div>
          <div className="text-slate-400 text-sm">Real-time operational decisions powered by AI analysis</div>
        </div>
        <div className="ml-auto flex items-center gap-1.5 bg-brand-green rounded-full px-3 py-1">
          <span className="w-2 h-2 rounded-full bg-white" />
          <span className="text-xs font-semibold text-white">Active Monitoring</span>
        </div>
      </div>

      {/* Recommendation cards */}
      {RECOMMENDATIONS.map((rec) => {
        const u = URGENCY_CONFIG[rec.urgency] || URGENCY_CONFIG.info
        const Icon = u.icon
        return (
          <div key={rec.id} className={`card overflow-hidden ${u.border}`}>
            <div className="px-5 py-4 border-b border-surface-200 flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-navy-950 rounded-md flex items-center justify-center shrink-0">
                  <Icon size={14} className={u.iconCls} />
                </div>
                <div>
                  <div className="text-sm font-bold text-navy-950">{rec.title}</div>
                  <div className="text-xs text-surface-500">{rec.problem}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={rec.urgency === 'critical' ? 'badge-critical' : rec.urgency === 'warning' ? 'badge-warning' : 'badge-blue'}>
                  {u.badgeLabel}
                </span>
                <span className="badge-navy">#{rec.priority}</span>
              </div>
            </div>

            <div className="px-5 py-4 space-y-4">
              {/* Risk */}
              <div>
                <div className="label-upper mb-1">Detected Risk</div>
                <p className="text-sm text-surface-700">{rec.risk}</p>
              </div>

              {/* Reasoning */}
              <div>
                <div className="label-upper mb-2">AI Reasoning</div>
                <ol className="space-y-1.5">
                  {rec.reasoning.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-surface-700">
                      <span className="w-4 h-4 rounded-full bg-navy-800 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      {r}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Action */}
              <div className="bg-navy-950 rounded-lg p-3">
                <div className="label-upper text-slate-500 mb-1">Recommended Action</div>
                <p className="text-sm text-white">{rec.action}</p>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-2.5 bg-surface-50 border border-surface-200 rounded-lg">
                  <div className="text-lg font-bold text-brand-blue">{rec.confidence}%</div>
                  <div className="text-xs text-surface-500">Confidence</div>
                </div>
                <div className="text-center p-2.5 bg-brand-green-light border border-green-200 rounded-lg">
                  <div className="text-lg font-bold text-brand-green">${(rec.value / 1000).toFixed(0)}K</div>
                  <div className="text-xs text-surface-500">Value Protected</div>
                </div>
                <div className="text-center p-2.5 bg-blue-50 border border-blue-100 rounded-lg">
                  <div className="text-lg font-bold text-brand-blue">{rec.eta}</div>
                  <div className="text-xs text-surface-500">Rescue ETA</div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
