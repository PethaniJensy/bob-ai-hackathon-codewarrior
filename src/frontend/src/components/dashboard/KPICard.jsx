import clsx from 'clsx'

export default function KPICard({
  title,
  value,
  subtitle,
  meta,
  accent = 'blue',
  icon: Icon,
  children,
}) {
  const accents = {
    blue:  'border-t-2 border-t-brand-blue',
    navy:  'border-t-2 border-t-navy-950',
    green: 'border-t-2 border-t-brand-green',
    red:   'border-t-2 border-t-brand-red',
  }

  const iconBg = {
    blue:  'bg-blue-50 text-brand-blue',
    navy:  'bg-navy-950 text-white',
    green: 'bg-brand-green-light text-brand-green',
    red:   'bg-red-50 text-brand-red',
  }

  return (
    <div className={clsx('card p-5', accents[accent])}>
      <div className="flex items-start justify-between mb-3">
        <span className="label-upper">{title}</span>
        {Icon && (
          <div className={clsx('w-8 h-8 rounded-md flex items-center justify-center', iconBg[accent])}>
            <Icon size={16} aria-hidden />
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-navy-950 mb-0.5">{value}</div>
      {subtitle && <div className="text-sm text-surface-500">{subtitle}</div>}
      {meta && <div className="text-xs text-surface-400 mt-1">{meta}</div>}
      {children}
    </div>
  )
}
