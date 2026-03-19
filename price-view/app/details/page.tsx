'use client'

import { useState } from 'react'

export default function Home() {
  const [stockData] = useState([
    { time: 'Mon', price: 145 },
    { time: 'Tue', price: 147 },
    { time: 'Wed', price: 146 },
    { time: 'Thu', price: 149 },
    { time: 'Fri', price: 150 },
    { time: 'Sat', price: 152 },
    { time: 'Sun', price: 150.25 },
  ])

  const minPrice = Math.min(...stockData.map(d => d.price))
  const maxPrice = Math.max(...stockData.map(d => d.price))
  const range = maxPrice - minPrice

  // Generate SVG line path
  const points = stockData.map((data, i) => {
    const x = (i / (stockData.length - 1)) * 100
    const y = 100 - ((data.price - minPrice) / range) * 100
    return `${x},${y}`
  }).join(' ')

  return (
    <div className="space-y-4 p-4 max-w-6xl mx-auto text-black">
      <h1 className="text-4xl font-bold text-center mb-2">AAPL</h1>
      <p className="text-center text-gray-600 text-sm">Apple Inc. - NASDAQ</p>

      {/* Price Section */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-3xl font-bold text-blue-600">$150.25</p>
            <p className="text-green-600 text-sm">+2.50 (+1.69%)</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-600">Today's Change</p>
            <p className="text-sm font-semibold">Market Open: $147.75</p>
          </div>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-gray-600 text-xs">Market Cap</p>
          <p className="text-lg font-bold text-blue-600">$2.4T</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-gray-600 text-xs">52-Week High</p>
          <p className="text-lg font-bold text-green-600">$199.62</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-gray-600 text-xs">52-Week Low</p>
          <p className="text-lg font-bold text-red-600">$124.17</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <p className="text-gray-600 text-xs">P/E Ratio</p>
          <p className="text-lg font-bold text-purple-600">28.5</p>
        </div>
      </div>

      {/* Stock Price Line Chart */}
      <div className="bg-white p-6 rounded-lg border border-gray-700">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-gray-400 text-sm">REVENUE</p>
            <p className="text-4xl font-bold text-black">$150.25</p>
            <p className="text-green-400 text-sm mt-1">↑ 22% YOY</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-blue-400 text-blue-400 rounded-full text-xs font-semibold hover:bg-blue-400 hover:text-black transition">YEAR</button>
            <button className="px-4 py-2 border border-gray-600 text-gray-400 rounded-full text-xs font-semibold hover:border-gray-400 transition">MONTH</button>
            <button className="px-4 py-2 border border-gray-600 text-gray-400 rounded-full text-xs font-semibold hover:border-gray-400 transition">WEEK</button>
          </div>
        </div>

        {/* SVG Line Chart */}
        <svg viewBox="0 0 100 100" className="w-full h-64 mb-4" preserveAspectRatio="none">
          {/* Grid background */}
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.01"/>
            </linearGradient>
          </defs>
          
          {/* Area under line */}
          <path
            d={`M 0,100 ${points} L 100,100 Z`}
            fill="url(#areaGradient)"
          />
          
          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Points on line */}
          {stockData.map((data, i) => {
            const x = (i / (stockData.length - 1)) * 100
            const y = 100 - ((data.price - minPrice) / range) * 100
            return (
              <circle key={i} cx={x} cy={y} r="1.2" fill="#3b82f6" />
            )
          })}
        </svg>

        {/* X-axis labels */}
        <div className="flex justify-between text-gray-400 text-xs px-2">
          {stockData.map((data, i) => (
            <span key={i}>{data.time}</span>
          ))}
        </div>
      </div>

      {/* News Details */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h2 className="text-lg font-bold mb-3">News Details</h2>
        <div className="space-y-3">
          <div className="border-l-4 border-blue-500 pl-3 py-2">
            <p className="text-xs text-gray-500">2 hours ago</p>
            <p className="font-semibold text-sm">Apple Announces New iPhone 16</p>
            <p className="text-gray-700 text-xs mt-1">Apple released its latest flagship device with improved battery life and AI features.</p>
          </div>
          <div className="border-l-4 border-blue-500 pl-3 py-2">
            <p className="text-xs text-gray-500">5 hours ago</p>
            <p className="font-semibold text-sm">Apple Q3 Earnings Beat Expectations</p>
            <p className="text-gray-700 text-xs mt-1">Apple reported strong quarterly results with revenue growth exceeding analyst expectations.</p>
          </div>
          <div className="border-l-4 border-blue-500 pl-3 py-2">
            <p className="text-xs text-gray-500">1 day ago</p>
            <p className="font-semibold text-sm">New MacBook Pro Launch Scheduled</p>
            <p className="text-gray-700 text-xs mt-1">Apple announces upcoming launch event for new MacBook Pro models with M3 chips.</p>
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
       <a 
          href="/dashboard"
          className="inline-block mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Portfolio Dashboard
        </a>

      <p className="text-center text-gray-500 text-xs mt-6">Designed by Req</p>
    </div>
  )
}