import { AlertTriangle, CheckCircle, Clock, Truck, ChevronRight } from 'lucide-react'
import StatusBadge from '../components/common/StatusBadge'

const PRIORITIES = [
  {
    id: 'SHP-8801',
    label: 'Pediatric Vaccines — Critical Breach',
    risk: 'critical',
    action: 'Rescue Divert Required',
    value: '$520,000',
    icon: AlertTriangle,
    iconCls: 'text-brand-red bg-red-50',
  },
  {
    id: 'SHP-8820',
    label: 'Blood Plasma — Temperature Warning',
    risk: 'warning',
    action: 'Monitoring — Alert Issued',
    value: '$180,000',
    icon: Clock,
    iconCls: 'text-amber-500 bg-amber-50',
  },
  {
    id: 'SHP-8815',
    label: 'Frozen Seafood — Monitoring',
    risk: 'info',
    action: 'Standard monitoring',
    value: '$62,000',
    icon: CheckCircle,
    iconCls: 'text-brand-blue bg-blue-50',
  },
  {
    id: 'SHP-8842',
    label: 'Insulin Supplies — Safe',
    risk: 'safe',
    action: 'On schedule, no action needed',
    value: '$95,000',
    icon: CheckCircle,
    iconCls: 'text-brand-green bg-brand-green-light',
  },
]

const INCIDENTS = [
  {
    id: 1,
    title: 'Temperature Excursion — SHP-8801',
    severity: 'critical',
    status: 'Rescue in Progress',
    time: '02:14 PM',
    desc: 'Cold-chain breach detected. Pediatric vaccine cargo at risk. Rescue unit dispatched.',
  },
  {
    id: 2,
    title: 'Route Closure — I-80 Corridor',
    severity: 'warning',
    status: 'Active',
    time: '01:55 PM',
    desc: 'Winter Storm Boreas has closed I-80 between Cheyenne and Laramie.',
  },
  {
    id: 3,
    title: 'Fleet Unit Deployed — REEFER-WY-04',
    severity: 'info',
    status: 'Dispatched',
    time: '02:18 PM',
    desc: 'Rescue unit dispatched from Cheyenne Logistics Hub. ETA 22 minutes.',
  },
]

export default function OperationsPage() {
  return (
    <div className="space-y-6">
      {/* Active Incidents */}
      <div className="card">
        <div className="card-header flex items-center gap-2">
          <AlertTriangle size={15} className="text-brand-red" />
          <span className="text-sm font-bold text-navy-950">Active Incidents</span>
        </div>
        <div className="divide-y divide-surface-100">
          {INCIDENTS.map((inc) => (
            <div key={inc.id} className="flex items-start gap-3 px-5 py-3.5">
              <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                inc.severity === 'critical' ? 'bg-brand-red' :
                inc.severity === 'warning' ? 'bg-amber-400' : 'bg-brand-blue'
              }`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-sm font-semibold text-navy-950">{inc.title}</div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-surface-400">{inc.time}</span>
                    <StatusBadge status={inc.severity} label={inc.status} />
                  </div>
                </div>
                <div className="text-xs text-surface-500 mt-0.5">{inc.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Operational Priority List */}
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <span className="text-sm font-bold text-navy-950">Operational Priority Queue</span>
          <span className="text-xs text-surface-400">{PRIORITIES.length} shipments</span>
        </div>
        <div className="divide-y divide-surface-100">
          {PRIORITIES.map((p, idx) => {
            const Icon = p.icon
            return (
              <div
                key={p.id}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-surface-50 transition-colors cursor-pointer"
                role="button"
                tabIndex={0}
              >
                <span className="w-6 h-6 rounded-full bg-surface-100 text-surface-600 text-xs font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${p.iconCls}`}>
                  <Icon size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-navy-950">{p.id}</div>
                  <div className="text-xs text-surface-500 truncate">{p.label}</div>
                </div>
                <div className="hidden sm:flex items-center gap-3 shrink-0">
                  <span className="text-xs text-surface-500">{p.action}</span>
                  <span className="text-xs font-semibold text-surface-700">{p.value}</span>
                  <StatusBadge status={p.risk} />
                </div>
                <ChevronRight size={14} className="text-surface-400 shrink-0" />
              </div>
            )
          })}
        </div>
      </div>

      {/* Resource Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Shipments at Risk', value: '1', sub: 'Critical Breach', cls: 'text-brand-red', bg: 'bg-red-50' },
          { label: 'Shipments Monitored', value: '4', sub: 'All tracked', cls: 'text-brand-blue', bg: 'bg-blue-50' },
          { label: 'Fleet Available', value: '2', sub: 'Ready to deploy', cls: 'text-brand-green', bg: 'bg-brand-green-light' },
          { label: 'AI Recommendations', value: '3', sub: 'Pending review', cls: 'text-navy-800', bg: 'bg-surface-100' },
        ].map(({ label, value, sub, cls, bg }) => (
          <div key={label} className="card p-4 text-center">
            <div className={`text-2xl font-bold mb-0.5 ${cls}`}>{value}</div>
            <div className="text-sm font-medium text-navy-950">{label}</div>
            <div className="text-xs text-surface-400 mt-0.5">{sub}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
