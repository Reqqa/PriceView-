'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { searchSymbol } from '@/app/lib/finnhub'

const glass = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  backdropFilter: 'blur(12px)',
}

export default function Page() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{ symbol: string; description: string }[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [searching, setSearching] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [portfolio] = useState({
    value: 125000,
    dayChange: 2500,
    dayChangePercent: 2.04,
    returns: 15234,
    returnsPercent: 13.87,
    sectors: [
      { name: 'Technology', value: 45000, percent: 36 },
      { name: 'Healthcare', value: 30000, percent: 24 },
      { name: 'Finance', value: 25000, percent: 20 },
      { name: 'Energy', value: 15000, percent: 12 },
      { name: 'Other', value: 10000, percent: 8 },
    ],
    stocks: [
      { symbol: 'AAPL', shares: 10, price: 150, value: 1500 },
      { symbol: 'MSFT', shares: 5, price: 380, value: 1900 },
      { symbol: 'GOOGL', shares: 3, price: 140, value: 420 },
      { symbol: 'TSLA', shares: 8, price: 245, value: 1960 },
    ],
  })

  useEffect(() => {
    if (query.length < 1) {
      setResults([])
      setShowDropdown(false)
      return
    }
    const timeout = setTimeout(async () => {
      setSearching(true)
      try {
        const data = await searchSymbol(query)
        const filtered = data
          .filter((r: { symbol: string; description: string }) => !r.symbol.includes('.'))
          .slice(0, 6)
        setResults(filtered)
        setShowDropdown(true)
      } catch {
        setResults([])
      } finally {
        setSearching(false)
      }
    }, 300)
    return () => clearTimeout(timeout)
  }, [query])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSelect(symbol: string) {
    setQuery('')
    setShowDropdown(false)
    router.push(`/details?symbol=${symbol}`)
  }

  return (
    <div className="space-y-4 p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-white">Req's Dashboard</h1>

      {/* Search */}
      <div className="flex justify-center mb-6">
        <div className="relative w-full max-w-xl" ref={dropdownRef}>
          <input
            type="text"
            placeholder="Search for financial instrument (e.g. AAPL, BTC, SPY)"
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
            <div
              className="absolute top-full left-0 right-0 mt-1 rounded-lg overflow-hidden z-50"
              style={{
                background: 'rgba(15,15,30,0.95)',
                border: '1px solid rgba(255,255,255,0.15)',
                backdropFilter: 'blur(20px)',
              }}
            >
              {results.map((result) => (
                <button
                  key={result.symbol}
                  onClick={() => handleSelect(result.symbol)}
                  className="w-full px-4 py-3 flex justify-between items-center text-left transition-all"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <span className="text-white font-semibold text-sm">{result.symbol}</span>
                  <span className="text-white/40 text-xs truncate ml-4 max-w-xs text-right">{result.description}</span>
                </button>
              ))}
            </div>
          )}
          {showDropdown && results.length === 0 && !searching && query.length > 0 && (
            <div
              className="absolute top-full left-0 right-0 mt-1 rounded-lg px-4 py-3 z-50"
              style={{
                background: 'rgba(15,15,30,0.95)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              <p className="text-white/40 text-sm">No results for "{query}"</p>
            </div>
          )}
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg" style={glass}>
          <p className="text-white/50 text-xs">Portfolio Value</p>
          <p className="text-xl font-bold text-blue-400">${portfolio.value.toLocaleString()}</p>
          <p className="text-green-400 text-xs mt-1">+${portfolio.dayChange.toLocaleString()} ({portfolio.dayChangePercent}%)</p>
        </div>
        <div className="p-4 rounded-lg" style={glass}>
          <p className="text-white/50 text-xs">Total Returns</p>
          <p className="text-xl font-bold text-green-400">${portfolio.returns.toLocaleString()}</p>
          <p className="text-green-400 text-xs mt-1">+{portfolio.returnsPercent}%</p>
        </div>
        <div className="p-4 rounded-lg" style={glass}>
          <p className="text-white/50 text-xs">Holdings</p>
          <p className="text-xl font-bold text-purple-400">{portfolio.stocks.length}</p>
          <p className="text-white/50 text-xs mt-1">Stocks</p>
        </div>
      </div>

      {/* Sectors and Holdings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg text-white" style={glass}>
          <h2 className="text-lg font-bold mb-3">Sector Allocation</h2>
          <div className="space-y-2">
            {portfolio.sectors.map((sector) => (
              <div key={sector.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-medium">{sector.name}</span>
                  <span className="text-xs text-white/50">${sector.value.toLocaleString()} ({sector.percent}%)</span>
                </div>
                <div className="w-full rounded-full h-2" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${sector.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-lg text-white" style={glass}>
          <h2 className="text-lg font-bold mb-3">Holdings</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <tr>
                  {['Symbol', 'Shares', 'Price', 'Value'].map(h => (
                    <th key={h} className="pb-2 text-white/50 font-medium text-xs">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {portfolio.stocks.map((stock) => (
                  <tr
                    key={stock.symbol}
                    className="cursor-pointer"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                    onClick={() => router.push(`/details?symbol=${stock.symbol}`)}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td className="py-2 font-semibold text-sm text-blue-400">{stock.symbol}</td>
                    <td className="py-2 text-sm text-white/70">{stock.shares}</td>
                    <td className="py-2 text-sm text-white/70">${stock.price}</td>
                    <td className="py-2 text-green-400 font-semibold text-sm">${stock.value.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg text-white" style={glass}>
          <h2 className="text-lg font-bold mb-3">Performance Graph</h2>
          <div className="h-64 rounded flex items-end justify-around p-4" style={{ background: 'rgba(255,255,255,0.03)' }}>
            {[45, 52, 48, 61, 55, 70, 65].map((value, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="bg-blue-500 rounded-t" style={{ width: '30px', height: `${value}px` }} />
                <p className="text-xs text-white/40 mt-2">{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-lg text-white" style={glass}>
          <h2 className="text-lg font-bold mb-3">Asset Allocation</h2>
          <div className="space-y-3">
            {[
              { label: 'Stocks', value: '$50,000.00', color: 'bg-blue-500', width: '40%' },
              { label: 'Crypto', value: '$37,500.00', color: 'bg-orange-500', width: '30%' },
              { label: 'ETFs', value: '$25,000.00', color: 'bg-purple-500', width: '20%' },
              { label: 'Cash', value: '$12,500.00', color: 'bg-cyan-500', width: '10%' },
            ].map(({ label, value, color, width }) => (
              <div key={label}>
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-medium">{label}</span>
                  <span className="text-xs font-semibold">{value}</span>
                </div>
                <div className="flex h-5 rounded overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <div className={color} style={{ width }} />
                </div>
              </div>
            ))}
            <div className="flex justify-between pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <span className="text-xs font-semibold">Total</span>
              <span className="text-xs font-semibold">$125,000.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* News */}
      <div className="p-4 rounded-lg text-white" style={glass}>
        <h2 className="text-lg font-bold mb-3">News Dashboard</h2>
        <div className="space-y-2">
          {[
            { time: '2 hours ago', title: 'Apple Announces New iPhone 16', body: 'Apple released its latest flagship device with improved battery life and AI features.' },
            { time: '4 hours ago', title: 'Tesla Stock Rises 3%', body: 'Tesla shares jumped following better than expected Q3 earnings report.' },
            { time: '6 hours ago', title: 'Fed Raises Interest Rates', body: 'Federal Reserve announces a 0.25% rate hike to combat inflation.' },
          ].map(({ time, title, body }) => (
            <div key={title} className="pl-3 py-2 rounded-lg" style={{ border: '1px solid rgba(99,160,255,0.3)', borderLeft: '2px solid rgba(99,160,255,0.8)' }}>
              <p className="text-xs text-white/40">{time}</p>
              <p className="font-semibold text-sm">{title}</p>
              <p className="text-white/60 text-xs mt-1">{body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Summary */}
      <div className="p-4 rounded-lg text-white" style={glass}>
        <h2 className="text-lg font-bold mb-3">AI Summary</h2>
        <div className="space-y-3">
          {[
            { color: 'rgba(99,160,255,0.15)', border: 'rgba(99,160,255,0.5)', label: 'Portfolio Health: Strong', text: 'Your portfolio is well-diversified across sectors. Technology dominance at 36% is balanced with Healthcare and Finance holdings.' },
            { color: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.5)', label: 'Performance: Above Average', text: 'Your returns of 13.87% YTD outperform the market average. Strong momentum observed over the past week.' },
            { color: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.5)', label: 'Recommendation: Hold & Monitor', text: 'Maintain current positions. Consider rebalancing Cash allocation if market volatility increases.' },
            { color: 'rgba(192,132,252,0.1)', border: 'rgba(192,132,252,0.5)', label: 'Risk Alert: Low', text: 'No significant risks detected. Your asset allocation provides good downside protection.' },
          ].map(({ color, border, label, text }) => (
            <div key={label} className="p-3 rounded" style={{ background: color, borderLeft: `2px solid ${border}` }}>
              <p className="text-xs font-semibold mb-1">{label}</p>
              <p className="text-xs text-white/60">{text}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-white/30 text-xs mt-4">Designed by Req</p>
    </div>
  )
}