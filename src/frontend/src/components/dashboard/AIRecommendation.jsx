import { Brain, CheckCircle } from 'lucide-react'

const REASONS = [
  'Cargo temperature exceeded the safe threshold of 8.0°C.',
  'Winter Storm Boreas is affecting the current route on I-80.',
  'I-80 is closed between Cheyenne and Laramie.',
  'Nearby refrigerated fleet unit REEFER-WY-04 is available at Cheyenne Hub.',
  'Certified cold-storage facility is available within 22 minutes.',
]

export default function AIRecommendation({ onRescueClick, rescueStatus }) {
  return (
    <div className="card border-t-2 border-t-navy-950">
      <div className="card-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-navy-950 rounded-md flex items-center justify-center">
            <Brain size={14} className="text-brand-blue" />
          </div>
          <span className="text-sm font-bold text-navy-950">AI Recommended Action</span>
        </div>
        <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-full px-2.5 py-1">
          <Brain size={11} className="text-brand-blue" />
          <span className="text-xs font-semibold text-brand-blue">96% Confidence</span>
        </div>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Recommendation */}
        <div className="bg-navy-950 rounded-lg p-4">
          <p className="text-white text-sm font-medium leading-relaxed">
            Divert shipment <span className="text-brand-blue font-bold">SHP-8801</span> and dispatch
            nearby reefer <span className="text-brand-green font-bold">REEFER-WY-04</span> to protect
            the pediatric vaccine cargo.
          </p>
        </div>

        {/* Reasoning */}
        <div>
          <div className="label-upper mb-2">AI Reasoning</div>
          <ol className="space-y-1.5">
            {REASONS.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-surface-700">
                <span className="w-5 h-5 rounded-full bg-navy-950 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {r}
              </li>
            ))}
          </ol>
        </div>

        {/* Impact metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-surface-50 rounded-lg border border-surface-200">
            <div className="text-lg font-bold text-brand-blue">96%</div>
            <div className="text-xs text-surface-500">AI Confidence</div>
          </div>
          <div className="text-center p-3 bg-brand-green-light rounded-lg border border-green-200">
            <div className="text-lg font-bold text-brand-green">$520K</div>
            <div className="text-xs text-surface-500">Cargo Protected</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="text-lg font-bold text-brand-blue">22 min</div>
            <div className="text-xs text-surface-500">Rescue ETA</div>
          </div>
        </div>

        {/* Action */}
        <div className="pt-2">
          {rescueStatus === 'success' ? (
            <button className="btn-success w-full justify-center" disabled>
              <CheckCircle size={15} />
              Rescue Dispatched
            </button>
          ) : (
            <button
              onClick={onRescueClick}
              className="btn-danger w-full justify-center"
              aria-label="Trigger autonomous rescue divert for SHP-8801"
            >
              Trigger Autonomous Rescue Divert
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
