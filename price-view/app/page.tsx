export default function Home() {
  return (
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold">Welcome!</h1>
        <p>PriceView is a service for financial institutions and traders to</p>
        <p>track news, earnings, analyst changes, price moves and summarize it for easy digestion</p>
        <a 
          href="/dashboard"
          className="inline-block mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Get Started
        </a>
        <p>Designed by Req</p>
      </div>
  )
}