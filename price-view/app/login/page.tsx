'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/app/lib/supabase'
import { GlassCard } from '@/app/components/ui'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const inputStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.15)',
    backdropFilter: 'blur(12px)',
  }

  async function handleLogin() {
    if (!email || !password) return
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <GlassCard className="rounded-2xl space-y-6">

          {/* Header */}
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold tracking-wide">PriceView</h1>
            <p className="text-white/40 text-xs">Sign in to your account</p>
          </div>

          {/* Fields */}
          <div className="space-y-3">
            <div className="relative">
              <input type="email" placeholder="Email ID" value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 pr-10 rounded-full text-white text-sm placeholder-white/30 focus:outline-none transition"
                style={inputStyle} />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">✉</span>
            </div>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-10 rounded-full text-white text-sm placeholder-white/30 focus:outline-none transition"
                style={inputStyle} />
              <button onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition text-sm">
                {showPassword ? '🔓' : '🔒'}
              </button>
            </div>
            {error && <p className="text-red-400 text-xs pl-4">{error}</p>}
          </div>

          {/* Remember + Forgot */}
          <div className="flex justify-between items-center text-xs">
            <label className="flex items-center gap-2 text-white/50 cursor-pointer select-none">
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                className="accent-blue-500 w-3 h-3" />
              Remember me
            </label>
            <a href="#" className="text-white/50 hover:text-white transition">Forgot Password?</a>
          </div>

          {/* Login Button */}
          <button onClick={handleLogin} disabled={loading}
            className="w-full py-3 rounded-full font-semibold text-sm tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'rgba(255,255,255,0.9)', color: '#0a0a1a' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,1)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.9)')}>
            {loading ? 'Signing in...' : 'Login'}
          </button>

          <p className="text-center text-xs text-white/40">
            Don't have an account?{' '}
            <a href="/signup" className="text-white/70 hover:text-white underline transition">Register</a>
          </p>

        </GlassCard>
      </div>
    </div>
  )
}