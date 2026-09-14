import { createContext, useContext, useState, useCallback } from 'react'
import { X, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react'
import clsx from 'clsx'

const ToastContext = createContext(null)

let _id = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback(({ type = 'info', message, duration = 4000 }) => {
    const id = ++_id
    setToasts((prev) => [...prev, { id, type, message }])
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration)
    }
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}

const ICONS = {
  success: <CheckCircle size={16} className="text-brand-green shrink-0" />,
  error:   <XCircle size={16} className="text-brand-red shrink-0" />,
  warning: <AlertTriangle size={16} className="text-amber-500 shrink-0" />,
  info:    <Info size={16} className="text-brand-blue shrink-0" />,
}

const BORDER = {
  success: 'border-l-4 border-brand-green',
  error:   'border-l-4 border-brand-red',
  warning: 'border-l-4 border-amber-400',
  info:    'border-l-4 border-brand-blue',
}

function ToastContainer({ toasts, onDismiss }) {
  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={clsx(
            'flex items-start gap-3 bg-white rounded-lg shadow-lg px-4 py-3 pointer-events-auto',
            BORDER[t.type] || BORDER.info
          )}
          role="alert"
        >
          {ICONS[t.type] || ICONS.info}
          <span className="flex-1 text-sm text-surface-900">{t.message}</span>
          <button
            onClick={() => onDismiss(t.id)}
            className="text-surface-400 hover:text-surface-600 transition-colors"
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
