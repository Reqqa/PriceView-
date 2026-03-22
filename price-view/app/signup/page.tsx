'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/app/lib/supabase'
import { GlassCard } from '@/app/components/ui'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const passwordMatch = confirm.length > 0 && password !== confirm

  const inputStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.15)',
    backdropFilter: 'blur(12px)',
  }

  async function handleSignUp() {
    if (passwordMatch || !email || !password || !name) return
    setLoading(true); setError('')
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name } },
    })
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
            <p className="text-white/40 text-xs">Create your account</p>
          </div>

          {/* Fields */}
          <div className="space-y-3">
            <div className="relative">
              <input type="text" placeholder="Full Name" value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 pr-10 rounded-full text-white text-sm placeholder-white/30 focus:outline-none transition"
                style={inputStyle} />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">👤</span>
            </div>
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
            <div className="relative">
              <input type={showConfirm ? 'text' : 'password'} placeholder="Confirm Password" value={confirm}
                onChange={e => setConfirm(e.target.value)}
                className="w-full px-4 py-3 pr-10 rounded-full text-white text-sm placeholder-white/30 focus:outline-none transition"
                style={{ ...inputStyle, border: `1px solid ${passwordMatch ? 'rgba(255,80,80,0.5)' : 'rgba(255,255,255,0.15)'}` }} />
              <button onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition text-sm">
                {showConfirm ? '🔓' : '🔒'}
              </button>
            </div>
            {passwordMatch && <p className="text-red-400 text-xs pl-4">Passwords do not match</p>}
            {error && <p className="text-red-400 text-xs pl-4">{error}</p>}
          </div>

          {/* Sign Up Button */}
          <button onClick={handleSignUp} disabled={loading || passwordMatch}
            className="w-full py-3 rounded-full font-semibold text-sm tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'rgba(255,255,255,0.9)', color: '#0a0a1a' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,1)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.9)')}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-center text-xs text-white/40">
            Already have an account?{' '}
            <a href="/login" className="text-white/70 hover:text-white underline transition">Login</a>
          </p>

        </GlassCard>
      </div>
    </div>
  )
}