import { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Bell, User, Circle, AlertTriangle, Menu, X, CheckCircle2, Clock } from 'lucide-react'

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

const NOTIFICATIONS = [
  {
    id: 1,
    type: 'critical',
    title: 'Critical Temperature Breach',
    desc: 'Shipment #SHP-8801 logged 9.1°C (Safe Limit: 8.0°C). MKT at 8.42°C.',
    time: '2m ago',
    unread: true,
  },
  {
    id: 2,
    type: 'warning',
    title: 'Severe Weather Disruption',
    desc: 'Winter Storm Boreas has shut down Interstate 80 between Cheyenne and Laramie.',
    time: '14m ago',
    unread: true,
  },
  {
    id: 3,
    type: 'info',
    title: 'Idle Fleet Staged',
    desc: 'Backup reefer REEFER-WY-04 is available at Cheyenne Hub (14.2 miles away).',
    time: '25m ago',
    unread: false,
  },
]

export default function Header({ onSidebarToggle }) {
  const { pathname } = useLocation()
  const meta = PAGE_META[pathname] || { title: 'CODEWARRIOR AI', subtitle: '' }
  
  const [showNotifications, setShowNotifications] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const notifRef = useRef(null)

  const profileRef = useRef(null)

useEffect(() => {
  function handleClickOutside(event) {
    if (notifRef.current && !notifRef.current.contains(event.target)) {
      setShowNotifications(false)
    }
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setProfileOpen(false)
    }
  }
  document.addEventListener('mousedown', handleClickOutside)
  return () => document.removeEventListener('mousedown', handleClickOutside)
}, [])

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

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-md text-surface-500 hover:bg-surface-100 transition-colors ${showNotifications ? 'bg-surface-100 text-navy-900' : ''}`}
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-red rounded-full ring-2 ring-white"></span>
          </button>

          {/* Notification Menu Popup */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-surface-200 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 pb-2 border-b border-surface-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-navy-950 uppercase tracking-wider">Alert Center</h3>
                  <span className="bg-red-100 text-brand-red text-[10px] font-bold px-1.5 py-0.5 rounded-full">2 New</span>
                </div>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-surface-400 hover:text-surface-600 p-1"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="divide-y divide-surface-100 max-h-80 overflow-y-auto">
                {NOTIFICATIONS.map((n) => (
                  <div key={n.id} className={`p-3.5 hover:bg-surface-50 transition-colors ${n.unread ? 'bg-blue-50/30' : ''}`}>
                    <div className="flex items-start gap-2.5">
                      {n.type === 'critical' && <AlertTriangle size={15} className="text-brand-red shrink-0 mt-0.5" />}
                      {n.type === 'warning' && <AlertTriangle size={15} className="text-amber-500 shrink-0 mt-0.5" />}
                      {n.type === 'info' && <CheckCircle2 size={15} className="text-brand-blue shrink-0 mt-0.5" />}
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-semibold text-navy-950 truncate">{n.title}</p>
                          <span className="text-[10px] text-surface-400 flex items-center gap-0.5 shrink-0">
                            <Clock size={10} /> {n.time}
                          </span>
                        </div>
                        <p className="text-xs text-surface-600 mt-0.5 leading-snug">{n.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-4 pt-2 border-t border-surface-100 text-center">
                <a href="/activity-log" className="text-[11px] font-semibold text-brand-blue hover:underline">
                  View Full Chronological Activity Log →
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
<div className="relative">
  <button
    onClick={() => setProfileOpen(v => !v)}
    className="flex items-center gap-2 p-1.5 rounded-md hover:bg-surface-100 transition-colors"
    aria-label="Profile"
  >
    <div className="w-7 h-7 rounded-full bg-navy-800 flex items-center justify-center">
      <User size={14} className="text-white" />
    </div>
  </button>
  {profileOpen && (
    <>
      <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
      <div className="absolute right-0 mt-2 w-48 bg-white border border-surface-200 rounded-md shadow-lg py-1 z-50">
        <button className="w-full text-left px-3 py-2 text-sm hover:bg-surface-50">Account</button>
        <button className="w-full text-left px-3 py-2 text-sm hover:bg-surface-50">Sign out</button>
      </div>
    </>
  )}
</div>
      </div>
    </header>
  )
}