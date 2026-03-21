'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { getQuote, getCompanyNews, searchSymbol } from '@/app/lib/finnhub'
import { supabase } from '@/app/lib/supabase'

const glass = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  backdropFilter: 'blur(12px)',
}

function TradingViewWidget({ symbol }: { symbol: string }) {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!container.current) return
    container.current.innerHTML = ''
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify({
      symbol: `NASDAQ:${symbol}`,
      interval: 'D',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'en',
      backgroundColor: 'rgba(0,0,0,0)',
      gridColor: 'rgba(255,255,255,0.05)',
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      height: 400,
      width: '100%',
    })
    container.current.appendChild(script)
  }, [symbol])

  return <div ref={container} className="w-full rounded-lg overflow-hidden" style={{ height: '400px' }} />
}

function DetailsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const symbol = searchParams.get('symbol') ?? 'AAPL'

  // Search state
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{ symbol: string; description: string }[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [searching, setSearching] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [quote, setQuote] = useState<{
    price: number
    change: number
    changePercent: number
    high: number
    low: number
    open: number
  } | null>(null)

  const [news, setNews] = useState<{
    headline: string
    summary: string
    datetime: number
    url: string
    source: string
  }[]>([])

  const [newsLoading, setNewsLoading] = useState(true)
  const [loading, setLoading] = useState(true)
  const [tracked, setTracked] = useState(false)
  const [trackLoading, setTrackLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const isPositive = (quote?.change ?? 0) >= 0

  // Search logic
  useEffect(() => {
    if (query.length < 1) { setResults([]); setShowDropdown(false); return }
    const timeout = setTimeout(async () => {
      setSearching(true)
      try {
        const data = await searchSymbol(query)
        const filtered = data
          .filter((r: { symbol: string; description: string }) => !r.symbol.includes('.'))
          .slice(0, 6)
        setResults(filtered)
        setShowDropdown(true)
      } catch { setResults([]) }
      finally { setSearching(false) }
    }, 300)
    return () => clearTimeout(timeout)
  }, [query])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setShowDropdown(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSelect(sym: string) {
    setQuery('')
    setShowDropdown(false)
    router.push(`/details?symbol=${sym}`)
  }

  // Get user and check if stock is already tracked
  useEffect(() => {
    async function init() {
      const { data } = await supabase.auth.getUser()
      const uid = data.user?.id ?? null
      setUserId(uid)
      if (uid) {
        const { data: existing } = await supabase
          .from('watchlist').select('id')
          .eq('user_id', uid).eq('symbol', symbol)
          .maybeSingle()
        setTracked(!!existing)
      }
    }
    init()
  }, [symbol])

  async function handleTrack() {
    if (!userId) return
    setTrackLoading(true)
    if (tracked) {
      await supabase.from('watchlist').delete()
        .eq('user_id', userId).eq('symbol', symbol)
      setTracked(false)
    } else {
      await supabase.from('watchlist').insert({ user_id: userId, symbol })
      setTracked(true)
    }
    setTrackLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    async function fetchQuote() {
      try {
        const data = await getQuote(symbol)
        setQuote(data)
      } catch (err) {
        console.error('Failed to fetch quote:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchQuote()
    const interval = setInterval(fetchQuote, 10000)
    return () => clearInterval(interval)
  }, [symbol])

  useEffect(() => {
    setNewsLoading(true)
    async function fetchNews() {
      try {
        const data = await getCompanyNews(symbol)
        setNews(data)
      } catch (err) {
        console.error('Failed to fetch news:', err)
      } finally {
        setNewsLoading(false)
      }
    }
    fetchNews()
  }, [symbol])

  function formatNewsTime(datetime: number) {
    const diff = Date.now() - datetime * 1000
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins} minute${mins !== 1 ? 's' : ''} ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`
    const days = Math.floor(hours / 24)
    return `${days} day${days !== 1 ? 's' : ''} ago`
  }

  return (
    <div className="space-y-4 p-4 max-w-6xl mx-auto text-white">
      <h1 className="text-4xl font-bold text-center mb-2">{symbol}</h1>
      <p className="text-center text-sm text-white/50">Live Data - NASDAQ</p>

      {/* Search */}
      <div className="flex justify-center">
        <div className="relative w-full max-w-xl" ref={dropdownRef}>
          <input
            type="text"
            placeholder="Search for another stock (e.g. MSFT, TSLA, SPY)"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none transition"
            style={{ ...glass, border: '1px solid rgba(255,255,255,0.15)' }}
            suppressHydrationWarning
          />
          {searching && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-3 h-3 border border-white/30 border-t-white/80 rounded-full animate-spin" />
            </div>
          )}
          {showDropdown && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 rounded-lg overflow-hidden z-50"
              style={{ background: 'rgba(15,15,30,0.95)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(20px)' }}>
              {results.map((result) => (
                <button key={result.symbol} onClick={() => handleSelect(result.symbol)}
                  className="w-full px-4 py-3 flex justify-between items-center text-left transition-all"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <span className="text-white font-semibold text-sm">{result.symbol}</span>
                  <span className="text-white/40 text-xs truncate ml-4 max-w-xs text-right">{result.description}</span>
                </button>
              ))}
            </div>
          )}
          {showDropdown && results.length === 0 && !searching && query.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 rounded-lg px-4 py-3 z-50"
              style={{ background: 'rgba(15,15,30,0.95)', border: '1px solid rgba(255,255,255,0.15)' }}>
              <p className="text-white/40 text-sm">No results for "{query}"</p>
            </div>
          )}
        </div>
      </div>

      {/* Price Section */}
      <div className="p-4 rounded-lg" style={glass}>
        {loading ? (
          <p className="text-white/40 text-sm animate-pulse">Loading live price...</p>
        ) : quote ? (
          <div className="flex justify-between items-center">
            <div>
              <p className="text-3xl font-bold text-blue-400">${quote.price.toFixed(2)}</p>
              <p className={`text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? '+' : ''}{quote.change.toFixed(2)} ({quote.changePercent.toFixed(2)}%)
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/50">Today's Range</p>
              <p className="text-sm font-semibold text-white/80">${quote.low.toFixed(2)} — ${quote.high.toFixed(2)}</p>
              <p className="text-xs text-white/50 mt-1">Open: ${quote.open.toFixed(2)}</p>
            </div>
          </div>
        ) : (
          <p className="text-red-400 text-sm">Failed to load price data.</p>
        )}
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Current Price', value: `$${quote?.price.toFixed(2)}`, color: 'text-blue-400' },
          { label: 'Day High', value: `$${quote?.high.toFixed(2)}`, color: 'text-green-400' },
          { label: 'Day Low', value: `$${quote?.low.toFixed(2)}`, color: 'text-red-400' },
          { label: 'Change %', value: `${isPositive ? '+' : ''}${quote?.changePercent.toFixed(2)}%`, color: isPositive ? 'text-green-400' : 'text-red-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="p-4 rounded-lg" style={glass}>
            <p className="text-white/50 text-xs">{label}</p>
            <p className={`text-lg font-bold ${color}`}>{loading ? '...' : value}</p>
          </div>
        ))}
      </div>

      {/* TradingView Chart */}
      <div className="p-4 rounded-lg" style={glass}>
        <div className="mb-4">
          <p className="text-white/40 text-xs uppercase tracking-widest">Price Chart</p>
          <p className="text-2xl font-bold">{loading ? '...' : `$${quote?.price.toFixed(2)}`}</p>
          <p className={`text-sm mt-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {!loading && `${isPositive ? '↑' : '↓'} ${quote?.changePercent.toFixed(2)}% today`}
          </p>
        </div>
        <TradingViewWidget symbol={symbol} />
      </div>

      {/* News */}
      <div className="p-4 rounded-lg" style={glass}>
        <h2 className="text-lg font-bold mb-3">Latest News</h2>
        <div className="space-y-3">
          {newsLoading ? (
            <p className="text-white/40 text-sm animate-pulse">Loading news...</p>
          ) : news.length > 0 ? (
            news.map((article) => (
              <a key={article.url} href={article.url} target="_blank" rel="noopener noreferrer"
                className="block pl-3 py-2 rounded-lg hover:opacity-80 transition-opacity"
                style={{ border: '1px solid rgba(99,160,255,0.3)', borderLeft: '2px solid rgba(99,160,255,0.8)' }}>
                <p className="text-xs text-white/40">{formatNewsTime(article.datetime)} · {article.source}</p>
                <p className="font-semibold text-sm">{article.headline}</p>
                {article.summary && (
                  <p className="text-white/60 text-xs mt-1 line-clamp-2">{article.summary}</p>
                )}
              </a>
            ))
          ) : (
            <p className="text-white/40 text-sm">No recent news found.</p>
          )}
        </div>
      </div>

      {/* AI Summary - Coming Soon */}
      <div className="p-4 rounded-lg" style={glass}>
        <h2 className="text-lg font-bold mb-3">AI Summary</h2>
        <div className="flex flex-col items-center justify-center py-8 rounded-lg gap-2"
          style={{ border: '1px dashed rgba(255,255,255,0.1)' }}>
          <p className="text-2xl">zz</p>
          <p className="text-sm font-semibold text-white/60 tracking-widest uppercase">Coming Soon</p>
          <p className="text-xs text-white/30 text-center max-w-xs">
            AI-powered news sentiment and stock analysis will appear here.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-4">
        <a href="/dashboard" className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
          Back to Portfolio Dashboard
        </a>
        <button onClick={handleTrack} disabled={trackLoading}
          className="px-6 py-2 rounded font-semibold text-sm transition disabled:opacity-50"
          style={{
            background: tracked ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.08)',
            border: tracked ? '1px solid rgba(74,222,128,0.5)' : '1px solid rgba(255,255,255,0.15)',
            color: tracked ? '#4ade80' : 'rgba(255,255,255,0.7)',
          }}>
          {trackLoading ? '...' : tracked ? '✓ Tracking' : '+ Track this Stock'}
        </button>
      </div>

      <p className="text-center text-white/30 text-xs mt-6">Designed by Req</p>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white/40 animate-pulse">Loading...</p>
      </div>
    }>
      <DetailsContent />
    </Suspense>
  )
}