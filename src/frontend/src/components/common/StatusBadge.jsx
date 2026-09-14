import clsx from 'clsx'
import { AlertTriangle, CheckCircle, Info, Clock, Shield, Truck } from 'lucide-react'

const VARIANTS = {
  critical:     { cls: 'badge-critical',  Icon: AlertTriangle },
  warning:      { cls: 'badge-warning',   Icon: AlertTriangle },
  safe:         { cls: 'badge-safe',      Icon: CheckCircle },
  protected:    { cls: 'badge-protected', Icon: Shield },
  rescue:       { cls: 'badge-rescue',    Icon: Truck },
  info:         { cls: 'badge-blue',      Icon: Info },
  navy:         { cls: 'badge-navy',      Icon: null },
  optimal:      { cls: 'badge-safe',      Icon: CheckCircle },
  delayed:      { cls: 'badge-warning',   Icon: Clock },
  dispatched:   { cls: 'badge-rescue',    Icon: Truck },
}

export default function StatusBadge({ status, label, className }) {
  const key = status?.toLowerCase().replace(/[\s_]/g, '') || 'info'
  const match =
    VARIANTS[key] ||
    VARIANTS[status?.toLowerCase()] ||
    VARIANTS.info

  const { cls, Icon } = match
  const text = label || status

  return (
    <span className={clsx(cls, className)} role="status">
      {Icon && <Icon size={10} className="shrink-0" aria-hidden />}
      {text}
    </span>
  )
}
