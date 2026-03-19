'use client'

import { useState } from 'react'

export default function Page() {


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

  return (
    <div className="space-y-4 p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-black">Req's Dashboard</h1>

      {/* Symbol Search Bar */}
      <div className="flex justify-center mb-6">
        <input 
          type="text" 
          placeholder="Search for financial instrument (e.g. AAPL, BTC, SPY)"
          className="w-full max-w-xl px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-black text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
        />
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-gray-600 text-xs">Portfolio Value</p>
          <p className="text-xl font-bold text-blue-600">${portfolio.value.toLocaleString()}</p>
          <p className="text-green-600 text-xs mt-1">+${portfolio.dayChange.toLocaleString()} ({portfolio.dayChangePercent}%)</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-gray-600 text-xs">Total Returns</p>
          <p className="text-xl font-bold text-green-600">${portfolio.returns.toLocaleString()}</p>
          <p className="text-green-600 text-xs mt-1">+{portfolio.returnsPercent}%</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <p className="text-gray-600 text-xs">Holdings</p>
          <p className="text-xl font-bold text-purple-600">{portfolio.stocks.length}</p>
          <p className="text-gray-600 text-xs mt-1">Stocks</p>
        </div>
      </div>

      {/* Sectors and Holdings Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sectors */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-black">
          <h2 className="text-lg font-bold mb-3">Sector Allocation</h2>
          <div className="space-y-2">
            {portfolio.sectors.map((sector) => (
              <div key={sector.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-medium">{sector.name}</span>
                  <span className="text-xs text-gray-600">${sector.value.toLocaleString()} ({sector.percent}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${sector.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Holdings */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-black">
          <h2 className="text-lg font-bold mb-3">Holdings</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="pb-2 text-gray-600 font-medium text-xs">Symbol</th>
                  <th className="pb-2 text-gray-600 font-medium text-xs">Shares</th>
                  <th className="pb-2 text-gray-600 font-medium text-xs">Price</th>
                  <th className="pb-2 text-gray-600 font-medium text-xs">Value</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.stocks.map((stock) => (
                  <tr key={stock.symbol} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 font-semibold text-sm">{stock.symbol}</td>
                    <td className="py-2 text-sm">{stock.shares}</td>
                    <td className="py-2 text-sm">${stock.price}</td>
                    <td className="py-2 text-green-600 font-semibold text-sm">${stock.value.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Performance Graph */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-black">
          <h2 className="text-lg font-bold mb-3">Performance Graph</h2>
          <div className="h-64 bg-gray-50 rounded flex items-end justify-around p-4">
            {[45, 52, 48, 61, 55, 70, 65].map((value, i) => (
              <div key={i} className="flex flex-col items-center">
                <div 
                  className="bg-blue-500 rounded-t"
                  style={{ width: '30px', height: `${value}px` }}
                ></div>
                <p className="text-xs text-gray-600 mt-2">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Asset Allocation */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-black">
          <h2 className="text-lg font-bold mb-3">Asset Allocation</h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs font-medium">Stocks</span>
                <span className="text-xs font-semibold">$50,000.00</span>
              </div>
              <div className="flex gap-1 h-5 rounded overflow-hidden bg-gray-200">
                <div className="bg-blue-500" style={{ width: '40%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs font-medium">Crypto</span>
                <span className="text-xs font-semibold">$37,500.00</span>
              </div>
              <div className="flex gap-1 h-5 rounded overflow-hidden bg-gray-200">
                <div className="bg-orange-500" style={{ width: '30%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs font-medium">ETFs</span>
                <span className="text-xs font-semibold">$25,000.00</span>
              </div>
              <div className="flex gap-1 h-5 rounded overflow-hidden bg-gray-200">
                <div className="bg-purple-500" style={{ width: '20%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs font-medium">Cash</span>
                <span className="text-xs font-semibold">$12,500.00</span>
              </div>
              <div className="flex gap-1 h-5 rounded overflow-hidden bg-gray-200">
                <div className="bg-cyan-500" style={{ width: '10%' }}></div>
              </div>
            </div>

            <div className="border-t border-gray-300 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="text-xs font-semibold">Total</span>
                <span className="text-xs font-semibold">$125,000.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* News Dashboard */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 text-black">
        <h2 className="text-lg font-bold mb-3">News Dashboard</h2>
        <div className="space-y-2">
          <div className='border-2 border-blue-500 pl-3 py-2 rounded-lg'>
            <p className="text-xs text-gray-500">2 hours ago</p>
            <p className="font-semibold text-sm">Apple Announces New iPhone 16</p>
            <p className="text-gray-700 text-xs mt-1">Apple released its latest flagship device with improved battery life and AI features.</p>
          </div>
          <div className='border-2 border-blue-500 pl-3 py-2 rounded-lg'>
            <p className="text-xs text-gray-500">4 hours ago</p>
            <p className="font-semibold text-sm">Tesla Stock Rises 3%</p>
            <p className="text-gray-700 text-xs mt-1">Tesla shares jumped following better than expected Q3 earnings report.</p>
          </div>
          <div className='border-2 border-blue-500 pl-3 py-2 rounded-lg'>
            <p className="text-xs text-gray-500">6 hours ago</p>
            <p className="font-semibold text-sm">Fed Raises Interest Rates</p>
            <p className="text-gray-700 text-xs mt-1">Federal Reserve announces a 0.25% rate hike to combat inflation.</p>
          </div>
        </div>
      </div>

      {/* AI Summary */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 text-black">
        <h2 className="text-lg font-bold mb-3">AI Summary</h2>
        <div className="space-y-3">
          <div className="bg-blue-50 p-3 rounded border-l border-blue-500">
            <p className="text-xs font-semibold text-blue-900 mb-1">Portfolio Health: Strong</p>
            <p className="text-xs text-gray-700">Your portfolio is well-diversified across sectors. Technology dominance at 36% is balanced with Healthcare and Finance holdings.</p>
          </div>

          <div className="bg-green-50 p-3 rounded border-l border-green-500">
            <p className="text-xs font-semibold text-green-900 mb-1">Performance: Above Average</p>
            <p className="text-xs text-gray-700">Your returns of 13.87% YTD outperform the market average. Strong momentum observed over the past week.</p>
          </div>

          <div className="bg-amber-50 p-3 rounded border-l border-amber-500">
            <p className="text-xs font-semibold text-amber-900 mb-1">Recommendation: Hold & Monitor</p>
            <p className="text-xs text-gray-700">Maintain current positions. Consider rebalancing Cash allocation if market volatility increases.</p>
          </div>

          <div className="bg-purple-50 p-3 rounded border-l border-purple-500">
            <p className="text-xs font-semibold text-purple-900 mb-1">Risk Alert: Low</p>
            <p className="text-xs text-gray-700">No significant risks detected. Your asset allocation provides good downside protection.</p>
          </div>
        </div>
      </div>

      <p className="text-center text-gray-500 text-xs mt-4">Designed by Req</p>
    </div>
  )
}