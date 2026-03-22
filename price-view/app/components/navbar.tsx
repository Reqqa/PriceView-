'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/app/lib/supabase'

export default function Navbar() {
  const router = useRouter()
  const [loggedIn, setLoggedIn] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session)
    })
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
    <header className="bg-black/30 backdrop-blur shadow" style={{ zIndex: 50, position: 'relative' }}>
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">

        {/* Logo */}
        <div className="text-2xl font-bold text-white">PriceView</div>

        {/* Normal nav */}
        {!menuOpen && (
          <nav className="flex gap-6 items-center">
            <a href="/" className="text-white hover:text-gray-300 text-sm">Home</a>
            {loggedIn ? (
              <button onClick={handleLogout} className="text-white hover:text-red-400 transition text-sm">
                Logout
              </button>
            ) : (
              <a href="/login" className="text-white hover:text-gray-300 text-sm">Login</a>
            )}
            <button
              onClick={() => setMenuOpen(true)}
              className="flex flex-col gap-1.5 p-1 hover:opacity-70 transition"
              aria-label="Open menu"
            >
              <span className="block w-5 h-0.5 bg-white rounded" />
              <span className="block w-5 h-0.5 bg-white rounded" />
              <span className="block w-5 h-0.5 bg-white rounded" />
            </button>
          </nav>
        )}

        {/* Menu nav — replaces normal nav, same row */}
        {menuOpen && (
          <nav className="flex gap-6 items-center">
            <a href="/dashboard" onClick={() => setMenuOpen(false)} className="text-white hover:text-blue-400 transition text-sm ">
              Dashboard
            </a>
            <a href="/details" onClick={() => setMenuOpen(false)} className="text-white hover:text-blue-400 transition text-sm ">
              Stock Details
            </a>
            <span className="text-white/30 text-sm  cursor-not-allowed">Placeholder</span>
            <span className="text-white/30 text-sm  cursor-not-allowed">Placeholder</span>
            <button
              onClick={() => setMenuOpen(false)}
              className="text-white/60 hover:text-white transition text-lg leading-none"
              aria-label="Close menu"
            >
              ✕
            </button>
          </nav>
        )}

      </div>
    </header>
  )
}