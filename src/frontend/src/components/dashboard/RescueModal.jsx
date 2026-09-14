import { useState } from 'react'
import Modal from '../common/Modal'
import { LoadingSpinner } from '../common/LoadingState'
import { useToast } from '../common/Toast'
import api from '../../services/api'
import {
  AlertTriangle,
  CheckCircle,
  Truck,
  MapPin,
  Thermometer,
  Package,
  Clock,
  DollarSign,
  Shield,
} from 'lucide-react'

const STEPS = {
  CONFIRM: 'confirm',
  AUTHORIZING: 'authorizing',
  DISPATCHING: 'dispatching',
  SUCCESS: 'success',
  ERROR: 'error',
}

export default function RescueModal({ isOpen, onClose, onSuccess }) {
  const [step, setStep] = useState(STEPS.CONFIRM)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const { addToast } = useToast()

  const handleClose = () => {
    if (step === STEPS.AUTHORIZING || step === STEPS.DISPATCHING) return
    setStep(STEPS.CONFIRM)
    setResult(null)
    setError(null)
    onClose()
  }

  const handleAuthorize = async () => {
    setStep(STEPS.AUTHORIZING)
    setError(null)
    try {
      await new Promise((r) => setTimeout(r, 1200))
      setStep(STEPS.DISPATCHING)
      await new Promise((r) => setTimeout(r, 1000))
      const data = await api.rescueShipment('SHP-8801')
      setResult(data)
      setStep(STEPS.SUCCESS)
      addToast({ type: 'success', message: 'Emergency rescue dispatched — REEFER-WY-04 en route.', duration: 6000 })
      onSuccess?.(data)
    } catch (err) {
      setError(err.message || 'Unable to connect to rescue service.')
      setStep(STEPS.ERROR)
      addToast({ type: 'error', message: err.message || 'Unable to connect to rescue service.' })
    }
  }

  const handleRetry = () => {
    setStep(STEPS.CONFIRM)
    setError(null)
  }

  const getTitle = () => {
    if (step === STEPS.SUCCESS) return 'Emergency Dispatch Executed'
    if (step === STEPS.ERROR) return 'Rescue Request Failed'
    return 'Authorize Emergency Rescue?'
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={getTitle()} size="md">
      {/* CONFIRM */}
      {step === STEPS.CONFIRM && (
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
            <AlertTriangle size={15} className="text-brand-red shrink-0 mt-0.5" />
            <p className="text-xs text-red-700">
              This action will dispatch an emergency rescue unit and divert the shipment. This cannot be undone without manual operator intervention.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label: 'Shipment', value: 'SHP-8801', icon: Package },
              { label: 'Cargo', value: 'Pediatric Vaccines', icon: Package },
              { label: 'Current Temperature', value: '9.1°C', icon: Thermometer, cls: 'text-brand-red font-bold' },
              { label: 'Risk Level', value: 'Critical', icon: AlertTriangle, cls: 'text-brand-red font-bold' },
              { label: 'Replacement Vehicle', value: 'REEFER-WY-04', icon: Truck },
              { label: 'Distance', value: '14.2 miles', icon: MapPin },
              { label: 'Destination', value: 'Cheyenne Certified Cold Storage', icon: MapPin },
              { label: 'Estimated ETA', value: '22 minutes', icon: Clock },
              { label: 'Cargo Value', value: '$520,000', icon: DollarSign },
            ].map(({ label, value, icon: Icon, cls }) => (
              <div key={label} className="bg-surface-50 border border-surface-200 rounded-md p-2.5">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Icon size={11} className="text-surface-400" />
                  <span className="label-upper text-[10px]">{label}</span>
                </div>
                <div className={`text-sm font-semibold text-navy-950 ${cls || ''}`}>{value}</div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={handleClose} className="btn-secondary">Cancel</button>
            <button onClick={handleAuthorize} className="btn-danger">
              <Shield size={14} />
              Authorize Rescue
            </button>
          </div>
        </div>
      )}

      {/* LOADING STATES */}
      {(step === STEPS.AUTHORIZING || step === STEPS.DISPATCHING) && (
        <div className="flex flex-col items-center justify-center py-10 gap-4">
          <LoadingSpinner size={32} />
          <div className="text-center">
            <p className="text-sm font-semibold text-navy-950">
              {step === STEPS.AUTHORIZING ? 'Authorizing via IBM Bob...' : 'Dispatching REEFER-WY-04...'}
            </p>
            <p className="text-xs text-surface-500 mt-1">
              {step === STEPS.AUTHORIZING
                ? 'Verifying operational authority and validating rescue parameters'
                : 'Sending dispatch signal to rescue unit and updating routing'}
            </p>
          </div>
        </div>
      )}

      {/* SUCCESS */}
      {step === STEPS.SUCCESS && result && (
        <div className="space-y-4">
          <div className="bg-brand-green-light border border-green-200 rounded-lg p-4 text-center">
            <CheckCircle size={28} className="text-brand-green mx-auto mb-2" />
            <div className="text-base font-bold text-brand-green">Rescue Dispatched</div>
            <div className="text-xs text-green-700 mt-0.5">Emergency unit en route to cold-storage facility</div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label: 'Assigned Unit', value: result.assigned_asset },
              { label: 'Destination', value: result.divert_location },
              { label: 'ETA', value: `${result.eta_minutes} minutes` },
              { label: 'Cargo Value Protected', value: `$${result.value_saved_usd?.toLocaleString()}` },
              { label: 'Cargo Protection', value: '100%' },
              { label: 'Status', value: 'RESCUE IN PROGRESS' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-surface-50 border border-surface-200 rounded-md p-2.5">
                <div className="label-upper text-[10px] mb-0.5">{label}</div>
                <div className="text-sm font-semibold text-navy-950">{value}</div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button onClick={handleClose} className="btn-success">
              <CheckCircle size={14} />
              Done
            </button>
          </div>
        </div>
      )}

      {/* ERROR */}
      {step === STEPS.ERROR && (
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <AlertTriangle size={28} className="text-brand-red mx-auto mb-2" />
            <div className="text-sm font-semibold text-brand-red">Unable to connect to rescue service</div>
            <div className="text-xs text-red-600 mt-1">{error}</div>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={handleClose} className="btn-secondary">Cancel</button>
            <button onClick={handleRetry} className="btn-primary">Retry</button>
          </div>
        </div>
      )}
    </Modal>
  )
}
