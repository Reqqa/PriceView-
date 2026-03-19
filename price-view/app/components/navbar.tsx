'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/app/lib/supabase'

export default function Navbar() {
  const router = useRouter()
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    // Check session on mount
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session)
    })

    // Listen for login/logout changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="bg-black/80 backdrop-blur shadow">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-white">PriceView</div>
        <nav className="flex gap-6 items-center">
          <a href="/" className="text-white hover:text-gray-300">Home</a>
          <a href="/dashboard" className="text-white hover:text-gray-300">Dashboard</a>
          {loggedIn ? (
            <button
              onClick={handleLogout}
              className="text-white hover:text-red-400 transition"
            >
              Logout
            </button>
          ) : (
            <a href="/login" className="text-white hover:text-gray-300">Login</a>
          )}
        </nav>
      </div>
    </header>
  )
}