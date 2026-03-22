
const glass = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  backdropFilter: 'blur(12px)',
}

//Glass Card
export function GlassCard({ children, className = '' }: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`p-4 rounded-lg text-white ${className}`} style={glass}>
      {children}
    </div>
  )
}

//Stats Card
export function StatCard({ label, value, sub, subColor }: {
  label: string
  value: string
  sub?: string
  subColor?: string
}) {
  return (
    <GlassCard>
      <p className="text-white/50 text-xs">{label}</p>
      <p className="text-xl font-bold">{value}</p>
      {sub && <p className={`text-xs mt-1 ${subColor ?? 'text-white/50'}`}>{sub}</p>}
    </GlassCard>
  )
}

//Section Card
export function SectionCard({ title, children, className = '' }: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <GlassCard className={className}>
      <h2 className="text-lg font-bold mb-3">{title}</h2>
      {children}
    </GlassCard>
  )
}

//Button
export function Button({ children, href, onClick, variant = 'solid', disabled = false }: {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  variant?: 'solid' | 'outline' | 'ghost'
  disabled?: boolean
}) {
  const base = 'px-6 py-2 rounded font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed'

  const styles: Record<string, React.CSSProperties> = {
    solid: { background: 'rgba(99,160,255,0.9)', color: '#fff' },
    outline: { background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)' },
    ghost: { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)' },
  }

  if (href) {
    return (
      <a href={href} className={base} style={styles[variant]}>
        {children}
      </a>
    )
  }

  return (
    <button onClick={onClick} disabled={disabled} className={base} style={styles[variant]}>
      {children}
    </button>
  )
}

//Coming Soon Buttons (To Be Removed)
export function ComingSoon({ label = 'Coming Soon', description }: {
  label?: string
  description?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-8 rounded-lg gap-2"
      style={{ border: '1px dashed rgba(255,255,255,0.1)' }}>
      <p className="text-2xl">TBA</p>
      <p className="text-sm font-semibold text-white/60 tracking-widest uppercase">{label}</p>
      {description && (
        <p className="text-xs text-white/30 text-center max-w-xs">{description}</p>
      )}
    </div>
  )
}

//Empty State 
export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-64">
      <p className="text-white/30 text-sm">{message}</p>
    </div>
  )
}

//News Item 
export function NewsItem({ headline, summary, datetime, url, source }: {
  headline: string
  summary?: string
  datetime: number
  url: string
  source: string
}) {
  function formatTime(datetime: number) {
    const diff = Date.now() - datetime * 1000
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className="block pl-3 py-2 rounded-lg hover:opacity-80 transition-opacity"
      style={{ border: '1px solid rgba(99,160,255,0.3)', borderLeft: '2px solid rgba(99,160,255,0.8)' }}>
      <p className="text-xs text-white/40">{formatTime(datetime)} · {source}</p>
      <p className="font-semibold text-sm text-white">{headline}</p>
      {summary && <p className="text-white/60 text-xs mt-1 line-clamp-2">{summary}</p>}
    </a>
  )
}

//Loading Pulse 
export function LoadingPulse({ message = 'Loading...' }: { message?: string }) {
  return <p className="text-white/40 text-sm animate-pulse">{message}</p>
}