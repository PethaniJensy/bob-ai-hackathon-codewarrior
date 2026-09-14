import { useLocation } from 'react-router-dom'
import { Bell, User, Circle, AlertTriangle, Menu } from 'lucide-react'

const PAGE_META = {
  '/dashboard': {
    title: 'Fleet Crisis War Room',
    subtitle: 'Real-time logistics monitoring and AI-powered operational decision support',
  },
  '/shipments': {
    title: 'Shipment Monitoring',
    subtitle: 'Track all active shipments, temperatures, and risk status',
  },
  '/fleet': {
    title: 'Fleet Management',
    subtitle: 'Monitor all vehicles, availability, and deployment status',
  },
  '/cold-chain': {
    title: 'Cold Chain Monitoring',
    subtitle: 'Temperature telemetry, breach detection, and cargo risk assessment',
  },
  '/disruptions': {
    title: 'Disruption Intelligence',
    subtitle: 'Active weather events, route closures, and operational impacts',
  },
  '/ai-recommendations': {
    title: 'AI Recommendations',
    subtitle: 'IBM Bob AI-powered operational decisions and recommended actions',
  },
  '/operations': {
    title: 'Operations Center',
    subtitle: 'Operational priorities, active incidents, and resource planning',
  },
  '/activity-log': {
    title: 'Activity Log',
    subtitle: 'Full chronological timeline of system events and actions',
  },
  '/settings': {
    title: 'Settings',
    subtitle: 'System configuration and preferences',
  },
}

export default function Header({ onSidebarToggle }) {
  const { pathname } = useLocation()
  const meta = PAGE_META[pathname] || { title: 'CODEWARRIOR AI', subtitle: '' }

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-surface-200 px-6 py-0 flex items-center justify-between h-16 shrink-0">
      {/* Left: mobile hamburger + page title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onSidebarToggle}
          className="lg:hidden p-1.5 rounded-md text-surface-500 hover:bg-surface-100 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        <div className="min-w-0">
          <h1 className="text-base font-bold text-navy-950 leading-tight truncate">{meta.title}</h1>
          <p className="text-xs text-surface-500 truncate hidden sm:block">{meta.subtitle}</p>
        </div>
      </div>

      {/* Right: status indicators */}
      <div className="flex items-center gap-3 shrink-0">
        {/* IBM Bob status */}
        <div className="hidden md:flex items-center gap-1.5 bg-surface-50 border border-surface-200 rounded-full px-3 py-1">
          <Circle size={7} className="text-brand-green fill-brand-green" />
          <span className="text-xs font-medium text-surface-700">IBM Bob Connected</span>
        </div>

        {/* Emergency indicator */}
        <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-full px-3 py-1">
          <AlertTriangle size={13} className="text-brand-red" />
          <span className="text-xs font-semibold text-brand-red">1 Active Emergency</span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-md text-surface-500 hover:bg-surface-100 transition-colors" aria-label="Notifications">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-red rounded-full"></span>
        </button>

        {/* Profile */}
        <button className="flex items-center gap-2 p-1.5 rounded-md hover:bg-surface-100 transition-colors" aria-label="Profile">
          <div className="w-7 h-7 rounded-full bg-navy-800 flex items-center justify-center">
            <User size={14} className="text-white" />
          </div>
        </button>
      </div>
    </header>
  )
}
