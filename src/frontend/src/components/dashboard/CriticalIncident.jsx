import { AlertTriangle, Thermometer, MapPin, Package } from 'lucide-react'

export default function CriticalIncident({ shipment, onRescueClick }) {
  if (!shipment) return null

  const temp = shipment.temperature_history?.[shipment.temperature_history.length - 1] ?? 9.1
  const safeLimit = 8.0
  const mkt = shipment.telemetry_analysis?.mkt_celsius ?? 8.42
  const isBreach = temp > safeLimit

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-surface-200">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} className="text-brand-red" aria-hidden />
          <span className="text-sm font-bold text-navy-950 uppercase tracking-wide">Critical Shipment</span>
        </div>
        <span className="badge-critical">
          <AlertTriangle size={10} aria-hidden /> CRITICAL BREACH
        </span>
      </div>

      <div className="px-5 py-4">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          {/* Shipment info */}
          <div className="flex-1 space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-lg font-bold text-navy-950">#{shipment.id}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-surface-700">
                <Package size={13} className="text-surface-400" />
                {shipment.title}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="label-upper mb-0.5">Carrier</div>
                <div className="font-medium text-navy-950">{shipment.carrier}</div>
              </div>
              <div>
                <div className="label-upper mb-0.5">Cargo Value</div>
                <div className="font-medium text-navy-950">${shipment.value_usd?.toLocaleString()}</div>
              </div>
              <div>
                <div className="label-upper mb-0.5">Origin</div>
                <div className="font-medium text-navy-950 flex items-center gap-1">
                  <MapPin size={11} className="text-surface-400" />
                  {shipment.origin}
                </div>
              </div>
              <div>
                <div className="label-upper mb-0.5">Destination</div>
                <div className="font-medium text-navy-950 flex items-center gap-1">
                  <MapPin size={11} className="text-surface-400" />
                  {shipment.destination}
                </div>
              </div>
            </div>
          </div>

          {/* Temperature metrics */}
          <div className="flex-shrink-0 lg:w-72">
            <div className="bg-surface-50 border border-surface-200 rounded-lg p-4">
              <div className="flex items-center gap-1.5 mb-3">
                <Thermometer size={14} className="text-surface-500" />
                <span className="label-upper">Temperature Status</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-2 bg-red-50 border border-red-100 rounded-md">
                  <div className="text-xl font-bold text-brand-red">{temp.toFixed(1)}°C</div>
                  <div className="text-xs text-surface-500 mt-0.5">Current</div>
                </div>
                <div className="text-center p-2 bg-white border border-surface-200 rounded-md">
                  <div className="text-xl font-bold text-brand-green">{safeLimit.toFixed(1)}°C</div>
                  <div className="text-xs text-surface-500 mt-0.5">Safe Limit</div>
                </div>
                <div className="text-center p-2 bg-amber-50 border border-amber-100 rounded-md">
                  <div className="text-xl font-bold text-amber-700">{mkt.toFixed(2)}°C</div>
                  <div className="text-xs text-surface-500 mt-0.5">MKT</div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-surface-200">
                <div className="flex justify-between text-xs">
                  <span className="text-surface-500">Est. Spoilage Risk</span>
                  <span className="font-semibold text-brand-red">38:14 elapsed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="mt-4 pt-4 border-t border-surface-200 flex justify-end">
          <button
            onClick={onRescueClick}
            className="btn-danger"
            aria-label="Trigger emergency rescue for shipment SHP-8801"
          >
            <AlertTriangle size={15} aria-hidden />
            Trigger Autonomous Rescue Divert
          </button>
        </div>
      </div>
    </div>
  )
}
