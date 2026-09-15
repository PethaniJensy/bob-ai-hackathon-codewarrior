import { useState, useEffect } from 'react'
import {
  Package,
  AlertTriangle,
  CloudLightning,
  Truck,
  TrendingUp,
} from 'lucide-react'
import api from '../services/api'
import KPICard from '../components/dashboard/KPICard'
import CriticalIncident from '../components/dashboard/CriticalIncident'
import TemperatureChart from '../components/dashboard/TemperatureChart'
import CopilotConsole from '../components/dashboard/CopilotConsole'
import AIRecommendation from '../components/dashboard/AIRecommendation'
import RescueModal from '../components/dashboard/RescueModal'
import LogisticsMap from '../components/dashboard/LogisticsMap'
import { LoadingState, ErrorState } from '../components/common/LoadingState'

export default function DashboardPage() {
  const [shipments, setShipments] = useState([])
  const [disruptions, setDisruptions] = useState([])
  const [fleet, setFleet] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [rescueModalOpen, setRescueModalOpen] = useState(false)
  const [rescueStatus, setRescueStatus] = useState(null) // null | 'success'
  const [successResult, setSuccessResult] = useState(null)
  const [copilotEvents, setCopilotEvents] = useState([])

  const fetchData = async (silent = false) => {
  if (!silent) setLoading(true)
    setLoadError(null)
    try {
      const [s, d, f] = await Promise.all([
        api.getShipments(),
        api.getDisruptions(),
        api.getIdleFleet(),
      ])
      setShipments(s)
      setDisruptions(d)
      setFleet(f)
    } catch (err) {
      setLoadError(err.message || 'Unable to connect to backend.')
    } finally {
      if (!silent) setLoading(false)
    }
  }

  useEffect(() => { 
    fetchData() 
      const interval = setInterval(() => fetchData(true), 5000)
  return () => clearInterval(interval)

  }, [])

  const criticalShipment = shipments.find((s) => s.status === 'CRITICAL_EXCURSION') || shipments[0]
  const activeDisruption = disruptions[0]
  const idleFleet = fleet.filter(
    (f) => f.status === 'AVAILABLE_IMMEDIATE' || f.status === 'AVAILABLE_STANDBY'
  )

  const handleRescueSuccess = (result) => {
    setRescueStatus('success')
    setSuccessResult(result)
    setCopilotEvents((prev) => [
      ...prev,
      {
        id: Date.now(),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        agent: 'Rescue Coordinator',
        icon: Truck,
        color: 'green',
        text: `Emergency rescue dispatched. ${result.assigned_asset} en route to ${result.divert_location}. ETA: ${result.eta_minutes} minutes.`,
        status: 'success',
      },
    ])
  }

  if (loading) return <LoadingState message="Loading operational data..." />
  if (loadError) return <ErrorState message={loadError} onRetry={fetchData} />

  return (
    <div className="space-y-6">
      {/* Success panel */}
      {rescueStatus === 'success' && successResult && (
        <div className="bg-brand-green-light border border-green-300 rounded-xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 bg-brand-green rounded-full flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-brand-green uppercase tracking-wide">Emergency Dispatch Executed</span>
              </div>
              <p className="text-sm text-green-800">
                <span className="font-semibold">{successResult.assigned_asset}</span> dispatched to{' '}
                <span className="font-semibold">{successResult.divert_location}</span> — ETA {successResult.eta_minutes} minutes.
                Cargo value protected: <span className="font-semibold">${successResult.value_saved_usd?.toLocaleString()}</span>
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <span className="badge-protected">RESCUE IN PROGRESS</span>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          title="Active Shipments"
          value={`${shipments.length} In-Transit`}
          subtitle="11 Road · 1 Intermodal"
          accent="navy"
          icon={Package}
        />
        <KPICard
          title="Cargo at Critical Risk"
          value={`$${criticalShipment?.value_usd?.toLocaleString() ?? '520,000'}`}
          subtitle={criticalShipment?.title ?? '10,000 Pediatric Vaccine Doses'}
          accent="red"
          icon={AlertTriangle}
        />
        <KPICard
          title="Active Weather Crisis"
          value={activeDisruption?.name ?? 'Winter Storm Boreas'}
          subtitle="I-80 Closed"
          meta="Cheyenne → Laramie"
          accent="blue"
          icon={CloudLightning}
        />
        <KPICard
          title="Nearby Idle Fleet"
          value={`${idleFleet.length} Available`}
          subtitle={idleFleet[0]?.depot_name ?? 'Cheyenne Logistics Hub'}
          meta={`${idleFleet[0]?.distance_miles ?? 14} miles away`}
          accent="green"
          icon={Truck}
        />
      </div>

      {/* Critical Shipment */}
      {criticalShipment && (
        <CriticalIncident
          shipment={criticalShipment}
          onRescueClick={() => setRescueModalOpen(true)}
        />
      )}

      {/* Chart + Copilot */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3">
          <TemperatureChart shipment={criticalShipment} />
        </div>
        <div className="xl:col-span-2">
          <CopilotConsole extraEvents={copilotEvents} />
        </div>
      </div>

      {/* Map + AI Recommendation */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3">
          <LogisticsMap shipments={shipments} fleet={fleet}/>
        </div>
        <div className="xl:col-span-2">
          <AIRecommendation
            onRescueClick={() => setRescueModalOpen(true)}
            rescueStatus={rescueStatus}
          />
        </div>
      </div>

      {/* Rescue Modal */}
      <RescueModal
        isOpen={rescueModalOpen}
        onClose={() => setRescueModalOpen(false)}
        onSuccess={handleRescueSuccess}
      />
    </div>
  )
}
