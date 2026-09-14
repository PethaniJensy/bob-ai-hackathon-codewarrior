import { Loader2 } from 'lucide-react'

export function LoadingSpinner({ size = 20, className = '' }) {
  return <Loader2 size={size} className={`animate-spin text-brand-blue ${className}`} aria-hidden />
}

export function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <LoadingSpinner size={28} />
      <p className="text-sm text-surface-500">{message}</p>
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
        <svg className="w-6 h-6 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-surface-900 mb-1">Connection Error</p>
        <p className="text-sm text-surface-500 max-w-xs">{message || 'Unable to connect to rescue service.'}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary text-sm">
          Retry
        </button>
      )}
    </div>
  )
}

export function EmptyState({ title = 'No data found', message, icon: Icon }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      {Icon && (
        <div className="w-12 h-12 bg-surface-100 rounded-full flex items-center justify-center">
          <Icon size={22} className="text-surface-400" />
        </div>
      )}
      <div className="text-center">
        <p className="text-sm font-semibold text-surface-700">{title}</p>
        {message && <p className="text-sm text-surface-400 mt-1 max-w-xs">{message}</p>}
      </div>
    </div>
  )
}
