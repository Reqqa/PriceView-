
export default function Home() {
  return (
    <div className="space-y-8 p-4 max-w-6xl mx-auto text-black">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-12">
        <h1 className="text-5xl font-bold">Welcome to PriceView</h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          A comprehensive financial platform for institutions and traders to track news, earnings, analyst changes, price moves and summarize it for easy digestion
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <a 
            href="/dashboard"
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
          >
            Dashboard
          </a>
          <a 
            href="/details"
            className="px-6 py-3 border border-blue-500 text-blue-500 font-semibold rounded-lg hover:bg-blue-50 transition"
          >
            View Stock Details
          </a>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-gray-600 text-xs font-semibold mb-2">Real-Time Tracking</p>
          <p className="text-lg font-bold text-blue-600">Monitor</p>
          <p className="text-gray-700 text-sm mt-2">Track market news, earnings reports, and price movements in real-time</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-gray-600 text-xs font-semibold mb-2">AI Powered</p>
          <p className="text-lg font-bold text-green-600">Summarize</p>
          <p className="text-gray-700 text-sm mt-2">Get AI-powered summaries of complex financial information instantly</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <p className="text-gray-600 text-xs font-semibold mb-2">Comprehensive</p>
          <p className="text-lg font-bold text-purple-600">Analyze</p>
          <p className="text-gray-700 text-sm mt-2">Analyze analyst changes and sentiment across multiple sources</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-xs">Supported Instruments</p>
          <p className="text-2xl font-bold text-blue-600">10,000+</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-xs">Daily Updates</p>
          <p className="text-2xl font-bold text-green-600">24/7</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-xs">Active Users</p>
          <p className="text-2xl font-bold text-purple-600">50K+</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-xs">Data Sources</p>
          <p className="text-2xl font-bold text-orange-600">100+</p>
        </div>
      </div>

      {/* Sample News Feed */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h2 className="text-lg font-bold mb-3">Latest Market News</h2>
        <div className="space-y-3">
          <div className="border-l-4 border-blue-500 pl-3 py-2">
            <p className="text-xs text-gray-500">2 hours ago</p>
            <p className="font-semibold text-sm">Apple Announces New iPhone 16</p>
            <p className="text-gray-700 text-xs mt-1">Apple released its latest flagship device with improved battery life and AI features.</p>
          </div>
          <div className="border-l-4 border-green-500 pl-3 py-2">
            <p className="text-xs text-gray-500">4 hours ago</p>
            <p className="font-semibold text-sm">Tesla Stock Rises 3%</p>
            <p className="text-gray-700 text-xs mt-1">Tesla shares jumped following better than expected Q3 earnings report.</p>
          </div>
          <div className="border-l-4 border-red-500 pl-3 py-2">
            <p className="text-xs text-gray-500">6 hours ago</p>
            <p className="font-semibold text-sm">Fed Raises Interest Rates</p>
            <p className="text-gray-700 text-xs mt-1">Federal Reserve announces a 0.25% rate hike to combat inflation.</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg border border-blue-200 text-center">
        <h2 className="text-2xl font-bold mb-2">Ready to Get Started?</h2>
        <p className="text-gray-700 mb-4">Join thousands of traders and institutions using PriceView</p>
        <a 
          href="/dashboard"
          className="inline-block px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
        >
          Go to Dashboard
        </a>
      </div>

      <p className="text-center text-gray-500 text-xs mt-8">Designed by Req</p>
    </div>
  )
}