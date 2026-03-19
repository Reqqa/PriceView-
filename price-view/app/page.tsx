export default function Home() {
  return (
    <div className="space-y-8 p-4 max-w-6xl mx-auto text-white relative z-10 ">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-12">
        <h1 className="text-5xl font-bold">Welcome to PriceView</h1>
        <p className="text-lg max-w-2xl mx-auto">
          A comprehensive financial platform for institutions and traders to track news, earnings, analyst changes, price moves and summarize it for easy digestion
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <a href="/dashboard" className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition">
            Dashboard
          </a>
          <a href="/details" className="px-6 py-3 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition">
            View Stock Details
          </a>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border border-white/10 backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <p className="text-white/50 text-xs font-semibold mb-2">Real-Time Tracking</p>
          <p className="text-lg font-bold text-blue-400">Monitor</p>
          <p className="text-white/60 text-sm mt-2">Track market news, earnings reports, and price movements in real-time</p>
        </div>
        <div className="p-4 rounded-lg border border-white/10 backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <p className="text-white/50 text-xs font-semibold mb-2">AI Powered</p>
          <p className="text-lg font-bold text-green-400">Summarize</p>
          <p className="text-white/60 text-sm mt-2">Get AI-powered summaries of complex financial information instantly</p>
        </div>
        <div className="p-4 rounded-lg border border-white/10 backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <p className="text-white/50 text-xs font-semibold mb-2">Comprehensive</p>
          <p className="text-lg font-bold text-purple-400">Analyze</p>
          <p className="text-white/60 text-sm mt-2">Analyze analyst changes and sentiment across multiple sources</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg border border-white/10 backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <p className="text-white/50 text-xs">Supported Instruments</p>
          <p className="text-2xl font-bold text-blue-400">10,000+</p>
        </div>
        <div className="p-4 rounded-lg border border-white/10 backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <p className="text-white/50 text-xs">Daily Updates</p>
          <p className="text-2xl font-bold text-green-400">24/7</p>
        </div>
        <div className="p-4 rounded-lg border border-white/10 backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <p className="text-white/50 text-xs">Active Users</p>
          <p className="text-2xl font-bold text-purple-400">50K+</p>
        </div>
        <div className="p-4 rounded-lg border border-white/10 backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <p className="text-white/50 text-xs">Data Sources</p>
          <p className="text-2xl font-bold text-orange-400">100+</p>
        </div>
      </div>

      {/* Sample News Feed */}
      <div className="p-4 rounded-lg border border-white/10 backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <h2 className="text-lg font-bold mb-3 text-white">Latest Market News</h2>
        <div className="space-y-3">
          <div className="border-l-4 border-blue-400 pl-3 py-2">
            <p className="text-xs text-white/40">2 hours ago</p>
            <p className="font-semibold text-sm text-white">Apple Announces New iPhone 16</p>
            <p className="text-white/60 text-xs mt-1">Apple released its latest flagship device with improved battery life and AI features.</p>
          </div>
          <div className="border-l-4 border-green-400 pl-3 py-2">
            <p className="text-xs text-white/40">4 hours ago</p>
            <p className="font-semibold text-sm text-white">Tesla Stock Rises 3%</p>
            <p className="text-white/60 text-xs mt-1">Tesla shares jumped following better than expected Q3 earnings report.</p>
          </div>
          <div className="border-l-4 border-red-400 pl-3 py-2">
            <p className="text-xs text-white/40">6 hours ago</p>
            <p className="font-semibold text-sm text-white">Fed Raises Interest Rates</p>
            <p className="text-white/60 text-xs mt-1">Federal Reserve announces a 0.25% rate hike to combat inflation.</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="p-8 rounded-lg border border-white/10 backdrop-blur-sm text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <h2 className="text-2xl font-bold mb-2 text-white">Ready to Get Started?</h2>
        <p className="text-white/60 mb-4">Join thousands of traders and institutions using PriceView</p>
        <a href="/dashboard" className="inline-block px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition">
          Go to Dashboard
        </a>
      </div>

      <p className="text-center text-xs mt-8 text-white/30">Designed by Req</p>
    </div>
  )
}