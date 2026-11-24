import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

const VARIANTS = {
  primary:
    'bg-primary text-on-primary hover:bg-primary-hover disabled:bg-primary-disabled disabled:hover:bg-primary-disabled',
  secondary:
    'border border-line-strong bg-surface text-ink hover:bg-hover disabled:text-disabled disabled:hover:bg-surface',
  ghost: 'text-ink-soft hover:bg-hover disabled:text-disabled disabled:hover:bg-transparent',
  link: 'text-primary hover:bg-primary-subtle disabled:text-disabled disabled:hover:bg-transparent',
  danger:
    'bg-danger-subtle text-danger hover:bg-danger hover:text-on-primary disabled:text-disabled disabled:hover:bg-danger-subtle disabled:hover:text-disabled',
}

const SIZES = {
  md: 'px-4 py-2',
  sm: 'px-3 py-1.5',
}

// Pass `to` to get a link that looks like a button
export default function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading = false,
  disabled = false,
  type = 'button',
  to,
  className = '',
  children,
  ...rest
}) {
  const classes = `inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm leading-5 font-semibold whitespace-nowrap disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${loading ? 'opacity-85' : ''} ${className}`
  const content = (
    <>
      {loading ? <Loader2 size={16} className="animate-spin" /> : Icon && <Icon size={16} />}
      {children}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    )
  }

  return (
    <button type={type} disabled={disabled || loading} className={classes} {...rest}>
      {content}
    </button>
  )
}
