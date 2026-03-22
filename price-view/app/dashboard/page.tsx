'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { searchSymbol, getQuote, getCompanyNews } from '@/app/lib/finnhub'
import { supabase } from '@/app/lib/supabase'
import { GlassCard, SectionCard, StatCard, ComingSoon, EmptyState, NewsItem, LoadingPulse } from '@/app/components/ui'

type Stock = {
  symbol: string
  shares: number
  price: number
  value: number
  changePercent: number
}

type NewsArticle = {
  headline: string
  summary: string
  datetime: number
  url: string
  source: string
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
      style: '3',
      locale: 'en',
      backgroundColor: 'rgba(0,0,0,0)',
      gridColor: 'rgba(255,255,255,0.05)',
      hide_top_toolbar: true,
      hide_legend: true,
      hide_volume: true,
      no_timeframes: true,
      save_image: false,
      height: 260,
      width: '100%',
    })
    container.current.appendChild(script)
  }, [symbol])

  return <div ref={container} className="w-full rounded-lg overflow-hidden" style={{ height: '260px' }} />
}

const sectorMap: Record<string, string[]> = {
  Technology:  ['AAPL', 'MSFT', 'GOOGL', 'NVDA', 'META', 'AMZN', 'TSLA', 'AMD', 'INTC', 'ORCL'],
  Healthcare:  ['JNJ', 'PFE', 'UNH', 'ABBV', 'MRK', 'LLY', 'TMO', 'ABT', 'BMY', 'AMGN'],
  Finance:     ['JPM', 'BAC', 'WFC', 'GS', 'MS', 'BLK', 'C', 'AXP', 'SCHW', 'CB'],
  Energy:      ['XOM', 'CVX', 'COP', 'SLB', 'EOG', 'MPC', 'PSX', 'PXD', 'VLO', 'OXY'],
}

const sectorColors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-cyan-500']

export default function Page() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{ symbol: string; description: string }[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [searching, setSearching] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [stocks, setStocks] = useState<Stock[]>([])
  const [loadingStocks, setLoadingStocks] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null)
  const [news, setNews] = useState<NewsArticle[]>([])
  const [newsLoading, setNewsLoading] = useState(false)

  // Default to first stock once loaded
  useEffect(() => {
    if (stocks.length > 0 && !selectedSymbol) setSelectedSymbol(stocks[0].symbol)
  }, [stocks])

  // Fetch news for all tracked symbols
  useEffect(() => {
    if (stocks.length === 0) return
    async function fetchAllNews() {
      setNewsLoading(true)
      try {
        const allNews = await Promise.all(stocks.map(s => getCompanyNews(s.symbol).catch(() => [])))
        const merged = allNews.flat()
          .filter((a, i, arr) => arr.findIndex(b => b.url === a.url) === i)
          .sort((a, b) => b.datetime - a.datetime)
          .slice(0, 10)
        setNews(merged)
      } catch (err) {
        console.error('Failed to fetch news:', err)
      } finally {
        setNewsLoading(false)
      }
    }
    fetchAllNews()
  }, [stocks])

  const portfolioValue = stocks.reduce((sum, s) => sum + s.value, 0)
  const todayChange = stocks.reduce((sum, s) => sum + (s.value * s.changePercent / 100), 0)
  const todayChangePercent = stocks.length > 0
    ? stocks.reduce((sum, s) => sum + s.changePercent, 0) / stocks.length
    : 0

  const sectors = (() => {
    const counts: Record<string, number> = { Technology: 0, Healthcare: 0, Finance: 0, Energy: 0, Other: 0 }
    stocks.forEach(s => {
      let found = false
      for (const [sector, syms] of Object.entries(sectorMap)) {
        if (syms.includes(s.symbol)) { counts[sector]++; found = true; break }
      }
      if (!found) counts['Other']++
    })
    const total = stocks.length || 1
    return Object.entries(counts)
      .filter(([, count]) => count > 0)
      .map(([name, count]) => ({ name, count, percent: Math.round((count / total) * 100) }))
  })()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null))
  }, [])

  useEffect(() => {
    if (!userId) return
    async function fetchWatchlist() {
      setLoadingStocks(true)
      try {
        const { data, error } = await supabase.from('watchlist').select('symbol').order('created_at', { ascending: false })
        if (error) throw error
        const stocksWithPrices = await Promise.all(
          (data ?? []).map(async ({ symbol }: { symbol: string }) => {
            try {
              const quote = await getQuote(symbol)
              return { symbol, shares: 0, price: quote.price, value: quote.price, changePercent: quote.changePercent }
            } catch {
              return { symbol, shares: 0, price: 0, value: 0, changePercent: 0 }
            }
          })
        )
        setStocks(stocksWithPrices)
      } catch (err) {
        console.error('Failed to fetch watchlist:', err)
      } finally {
        setLoadingStocks(false)
      }
    }
    fetchWatchlist()
  }, [userId])

  async function removeFromWatchlist(symbol: string) {
    const { error } = await supabase.from('watchlist').delete().eq('symbol', symbol).eq('user_id', userId)
    if (error) { console.error('Failed to remove:', error); return }
    setStocks(prev => prev.filter(s => s.symbol !== symbol))
    if (selectedSymbol === symbol) setSelectedSymbol(null)
  }

  useEffect(() => {
    if (query.length < 1) { setResults([]); setShowDropdown(false); return }
    const timeout = setTimeout(async () => {
      setSearching(true)
      try {
        const data = await searchSymbol(query)
        const filtered = data.filter((r: { symbol: string }) => !r.symbol.includes('.')).slice(0, 6)
        setResults(filtered)
        setShowDropdown(true)
      } catch { setResults([]) }
      finally { setSearching(false) }
    }, 300)
    return () => clearTimeout(timeout)
  }, [query])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setShowDropdown(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSelect(symbol: string) {
    setQuery(''); setShowDropdown(false)
    router.push(`/details?symbol=${symbol}`)
  }

  return (
    <div className="space-y-4 p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-white">Your Dashboard</h1>

      {/* Search */}
      <div className="flex justify-center mb-6">
        <div className="relative w-full max-w-xl" ref={dropdownRef}>
          <input
            type="text"
            placeholder="Search for financial instrument (e.g. AAPL, BTC, SPY)"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none transition"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)' }}
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

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Portfolio Value"
          value={`$${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          sub="+$2,500 (2.04%)"
          subColor="text-green-400"
        />
        <StatCard
          label="Today's Returns"
          value={loadingStocks ? '...' : `${todayChange >= 0 ? '+' : ''}$${Math.abs(todayChange).toFixed(2)}`}
          sub={loadingStocks ? '' : `${todayChangePercent >= 0 ? '+' : ''}${todayChangePercent.toFixed(2)}% avg today`}
          subColor={todayChangePercent >= 0 ? 'text-green-400' : 'text-red-400'}
        />
        <StatCard
          label="Holdings"
          value={loadingStocks ? '...' : stocks.length.toString()}
          sub="Stocks"
        />
      </div>

      {/* Sectors and Holdings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SectionCard title="Sector Allocation">
          {loadingStocks ? <LoadingPulse message="Loading sectors..." /> :
            sectors.length === 0 ? <p className="text-white/40 text-sm">Add stocks to see sector breakdown.</p> : (
              <div className="space-y-2">
                {sectors.map((sector, i) => (
                  <div key={sector.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium">{sector.name}</span>
                      <span className="text-xs text-white/50">{sector.count} stock{sector.count !== 1 ? 's' : ''} · {sector.percent}%</span>
                    </div>
                    <div className="w-full rounded-full h-2" style={{ background: 'rgba(255,255,255,0.1)' }}>
                      <div className={`${sectorColors[i % sectorColors.length]} h-2 rounded-full`} style={{ width: `${sector.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
        </SectionCard>

        <SectionCard title="Holdings">
          {loadingStocks ? <LoadingPulse message="Loading watchlist..." /> :
            stocks.length === 0 ? <p className="text-white/40 text-sm">No stocks yet. Search above to add some.</p> : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <tr>
                      {['Symbol', 'Price', 'Change', ''].map(h => (
                        <th key={h} className="pb-2 text-white/50 font-medium text-xs">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stocks.map((stock) => (
                      <tr key={stock.symbol} className="cursor-pointer"
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: selectedSymbol === stock.symbol ? 'rgba(99,160,255,0.08)' : 'transparent' }}
                        onMouseEnter={e => (e.currentTarget.style.background = selectedSymbol === stock.symbol ? 'rgba(99,160,255,0.08)' : 'rgba(255,255,255,0.04)')}
                        onMouseLeave={e => (e.currentTarget.style.background = selectedSymbol === stock.symbol ? 'rgba(99,160,255,0.08)' : 'transparent')}>
                        <td className="py-2 font-semibold text-sm text-blue-400"
                          onClick={() => setSelectedSymbol(selectedSymbol === stock.symbol ? null : stock.symbol)}>
                          {stock.symbol}
                        </td>
                        <td className="py-2 text-sm text-white/70">${stock.price.toFixed(2)}</td>
                        <td className={`py-2 text-sm font-semibold ${stock.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </td>
                        <td className="py-2 text-right">
                          <button onClick={() => removeFromWatchlist(stock.symbol)}
                            className="text-white/20 hover:text-red-400 transition text-xs px-2">✕</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </SectionCard>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SectionCard title="Performance Graph">
          {loadingStocks ? <LoadingPulse /> :
            stocks.length === 0 ? <EmptyState message="Add stocks to see performance" /> : (
              <div className="overflow-x-auto custom-scroll-x">
                <div className="rounded p-4 min-w-max" style={{ background: 'rgba(255,255,255,0.03)', height: '260px', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 16, right: 16, top: '50%', borderTop: '1px dashed rgba(255,255,255,0.1)' }} />
                  <div className="flex items-center justify-start gap-4 h-full">
                    {stocks.map((stock) => {
                      const isPos = stock.changePercent >= 0
                      const maxVal = Math.max(...stocks.map(s => Math.abs(s.changePercent)), 1)
                      const barH = Math.max(6, (Math.abs(stock.changePercent) / maxVal) * 100)
                      return (
                        <div key={stock.symbol} className="flex flex-col items-center gap-1 h-full justify-center">
                          {isPos ? <p className="text-xs font-semibold text-green-400">+{stock.changePercent.toFixed(1)}%</p> : <div style={{ height: '18px' }} />}
                          {isPos ? <div className="rounded-sm bg-green-500" style={{ width: '32px', height: `${barH}px`, opacity: 0.85 }} /> : <div style={{ height: `${barH}px` }} />}
                          {!isPos ? <div className="rounded-sm bg-red-500" style={{ width: '32px', height: `${barH}px`, opacity: 0.85 }} /> : <div style={{ height: `${barH}px` }} />}
                          {!isPos ? <p className="text-xs font-semibold text-red-400">{stock.changePercent.toFixed(1)}%</p> : <div style={{ height: '18px' }} />}
                          <p className="text-xs text-white/50 mt-1">{stock.symbol}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
        </SectionCard>

        <GlassCard>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">Stock Chart</h2>
            {selectedSymbol && (
              <span className="text-xs font-semibold text-blue-400 px-2 py-1 rounded-full"
                style={{ background: 'rgba(99,160,255,0.1)', border: '1px solid rgba(99,160,255,0.3)' }}>
                {selectedSymbol}
              </span>
            )}
          </div>
          {selectedSymbol ? <TradingViewWidget symbol={selectedSymbol} /> : <EmptyState message="Add stocks to your watchlist to see charts" />}
        </GlassCard>
      </div>

      {/* News */}
      <SectionCard title="News Dashboard">
        {newsLoading ? <LoadingPulse message="Loading news..." /> :
          news.length === 0 ? <p className="text-white/40 text-sm">No recent news for your watchlist.</p> : (
            <div className="space-y-2 overflow-y-auto custom-scroll pr-1" style={{ maxHeight: '320px' }}>
              {news.map((article) => (
                <NewsItem key={article.url} {...article} />
              ))}
            </div>
          )}
      </SectionCard>

      {/* AI Summary */}
      <SectionCard title="AI Summary">
        <ComingSoon description="AI-powered portfolio analysis and recommendations will appear here." />
      </SectionCard>

      <p className="text-center text-white/30 text-xs mt-4">Designed by Req</p>
    </div>
  )
}