// Numbers always use Latin digits (0-9), in English and in Khmer

export function formatNumber(value) {
  return value.toLocaleString('en-US')
}

export function formatMoney(value) {
  return `$${formatNumber(value)}`
}

// 11.4 -> "+11.4%", -3 -> "-3%", 0 -> "0%"
export function formatChange(value) {
  const text = value.toLocaleString('en-US', { maximumFractionDigits: 1 })
  return `${value > 0 ? '+' : ''}${text}%`
}

// "2026-09-30T09:00:00Z" -> "September 2026" (or the Khmer month name)
export function formatMonth(iso, lang) {
  const locale = lang === 'km' ? 'km-KH-u-nu-latn' : 'en-US'
  return new Date(iso).toLocaleDateString(locale, { month: 'long', year: 'numeric' })
}

// "2 min ago", "1 hr ago", "3 hrs ago", "2 days ago". Pass the t function from useI18n.
export function timeAgo(iso, t) {
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (minutes < 1) return t('time.justNow')
  if (minutes < 60) return t('time.minAgo', { count: minutes })

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return t(hours === 1 ? 'time.hourAgo' : 'time.hoursAgo', { count: hours })

  const days = Math.floor(hours / 24)
  return t(days === 1 ? 'time.dayAgo' : 'time.daysAgo', { count: days })
}
