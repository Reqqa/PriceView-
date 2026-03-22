'use client'

import { GlassCard, StatCard, Button } from '@/app/components/ui'

const features = [
  { label: 'Real-Time Tracking', title: 'Monitor', color: 'text-blue-400', desc: 'Track market news, earnings reports, and price movements in real-time' },
  { label: 'AI Powered', title: 'Summarize', color: 'text-green-400', desc: 'Get AI-powered summaries of complex financial information instantly' },
  { label: 'Comprehensive', title: 'Analyze', color: 'text-purple-400', desc: 'Analyze analyst changes and sentiment across multiple sources' },
]

const metrics = [
  { label: 'Supported Instruments', value: '10,000+', subColor: 'text-blue-400' },
  { label: 'Daily Updates', value: '24/7', subColor: 'text-green-400' },
  { label: 'Active Users', value: '50K+', subColor: 'text-purple-400' },
  { label: 'Data Sources', value: '100+', subColor: 'text-orange-400' },
]

const sampleNews = [
  { color: 'border-blue-400', time: '2 hours ago', title: 'Apple Announces New iPhone 16', body: 'Apple released its latest flagship device with improved battery life and AI features.' },
  { color: 'border-green-400', time: '4 hours ago', title: 'Tesla Stock Rises 3%', body: 'Tesla shares jumped following better than expected Q3 earnings report.' },
  { color: 'border-red-400', time: '6 hours ago', title: 'Fed Raises Interest Rates', body: 'Federal Reserve announces a 0.25% rate hike to combat inflation.' },
]

export default function Home() {
  return (
    <div className="space-y-8 p-4 max-w-6xl mx-auto text-white relative z-10">

      {/* Hero */}
      <div className="text-center space-y-4 py-12">
        <h1 className="text-5xl font-bold">Welcome to PriceView</h1>
        <p className="text-lg text-white/70 max-w-2xl mx-auto">
          A comprehensive financial platform for institutions and traders to track news, earnings, analyst changes, price moves and summarize it for easy digestion
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Button href="/dashboard" variant="solid">Dashboard</Button>
          <Button href="/details" variant="outline">View Stock Details</Button>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {features.map(({ label, title, color, desc }) => (
          <GlassCard key={title}>
            <p className="text-white/50 text-xs font-semibold mb-2">{label}</p>
            <p className={`text-lg font-bold ${color}`}>{title}</p>
            <p className="text-white/60 text-sm mt-2">{desc}</p>
          </GlassCard>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metrics.map(({ label, value, subColor }) => (
          <GlassCard key={label}>
            <p className="text-white/50 text-xs">{label}</p>
            <p className={`text-2xl font-bold ${subColor}`}>{value}</p>
          </GlassCard>
        ))}
      </div>

      {/* Sample News */}
      <GlassCard>
        <h2 className="text-lg font-bold mb-3">Latest Market News</h2>
        <div className="space-y-3">
          {sampleNews.map(({ color, time, title, body }) => (
            <div key={title} className={`border-l-4 ${color} pl-3 py-2`}>
              <p className="text-xs text-white/40">{time}</p>
              <p className="font-semibold text-sm">{title}</p>
              <p className="text-white/60 text-xs mt-1">{body}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* CTA */}
      <GlassCard className="text-center py-8">
        <h2 className="text-2xl font-bold mb-2">Ready to Get Started?</h2>
        <p className="text-white/60 mb-4">Join thousands of traders and institutions using PriceView</p>
        <Button href="/dashboard" variant="solid">Go to Dashboard</Button>
      </GlassCard>

      <p className="text-center text-xs mt-8 text-white/30">Designed by Req</p>
    </div>
  )
}