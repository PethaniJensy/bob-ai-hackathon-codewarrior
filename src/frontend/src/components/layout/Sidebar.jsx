import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Truck,
  Thermometer,
  CloudLightning,
  Brain,
  ClipboardList,
  Activity,
  Settings,
  Zap,
  Circle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import clsx from 'clsx'

const NAV_ITEMS = [
  { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Shipments', path: '/shipments', icon: Package },
  { label: 'Fleet', path: '/fleet', icon: Truck },
  { label: 'Cold Chain', path: '/cold-chain', icon: Thermometer },
  { label: 'Disruptions', path: '/disruptions', icon: CloudLightning },
  { label: 'AI Recommendations', path: '/ai-recommendations', icon: Brain },
  { label: 'Operations', path: '/operations', icon: ClipboardList },
  { label: 'Activity Log', path: '/activity-log', icon: Activity },
  { label: 'Settings', path: '/settings', icon: Settings },
]

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <aside
      className={clsx(
        'flex flex-col h-screen bg-navy-950 border-r border-navy-900 transition-all duration-300 shrink-0',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-navy-800">
  {!collapsed && (
    <div className="flex items-center gap-2.5 min-w-0">
      <div className="w-8 h-8 bg-brand-blue rounded-md flex items-center justify-center shrink-0">
        <Zap className="w-4.5 h-4.5 text-white" size={18} />
      </div>
      <div className="min-w-0">
        <div className="text-white font-bold text-sm leading-none truncate">CODEWARRIOR AI</div>
        <div className="text-slate-400 text-xs mt-0.5 leading-none truncate">Fleet Crisis & Cold-Chain</div>
      </div>
    </div>
  )}
  {collapsed && (
    <div className="w-8 h-8 bg-brand-blue rounded-md flex items-center justify-center mx-auto">
      <Zap size={18} className="text-white" />
    </div>
  )}
  <button
    onClick={onToggle}
    className="text-slate-400 hover:text-white p-1 rounded transition-colors"
    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
  >
    {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
  </button>
</div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto scrollbar-thin">
        {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-brand-blue text-white'
                  : 'text-slate-300 hover:bg-navy-800 hover:text-white',
                collapsed && 'justify-center'
              )
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={17} className="shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* System Status */}
      <div className="px-3 py-4 border-t border-navy-800">
        {!collapsed ? (
          <div className="bg-navy-900 rounded-md px-3 py-3">
            <div className="label-upper text-slate-500 mb-2">System Status</div>
            <div className="flex items-center gap-2">
              <Circle size={8} className="text-brand-green fill-brand-green shrink-0" />
              <div>
                <div className="text-white text-xs font-semibold">IBM Bob</div>
                <div className="text-slate-400 text-xs">Connected</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <Circle size={8} className="text-brand-green fill-brand-green" />
          </div>
        )}
      </div>
    </aside>
  )
}
