'use client'

import { useState, useEffect } from 'react'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Leaf, Check, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { HandButton } from '@/components/hand-drawn/Button'
import { HandCard } from '@/components/hand-drawn/Card'
import { HandInput } from '@/components/hand-drawn/Input'
import '../landing/landing.css'

const MOCK_USER = { email: 'demo@gmail.com', password: '123456' }
type AuthMode = 'login' | 'register'

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [shakeError, setShakeError] = useState(false)

  // Focus states to control mascot
  const [isEmailFocused, setIsEmailFocused] = useState(false)
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)

  // Prevent hydration mismatch for standard UI state
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const triggerShake = () => {
    setShakeError(true)
    setTimeout(() => setShakeError(false), 600)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    await new Promise((r) => setTimeout(r, 1000))

    if (mode === 'login') {
      if (email === MOCK_USER.email && password === MOCK_USER.password) {
        localStorage.setItem('isLoggedIn', 'true')
        const onboardingDone = localStorage.getItem('isOnboardingComplete') === 'true'
        setSuccess('Đăng nhập thành công! Đang chuyển hướng...')
        setTimeout(() => { window.location.href = onboardingDone ? '/' : '/onboarding' }, 1500)
      } else {
        setError('Email hoặc mật khẩu không chính xác')
        triggerShake()
      }
    } else {
      if (!name.trim()) { setError('Vui lòng nhập họ tên'); triggerShake(); setIsLoading(false); return }
      if (!email.includes('@')) { setError('Email không hợp lệ'); triggerShake(); setIsLoading(false); return }
      if (password.length < 6) { setError('Mật khẩu phải có ít nhất 6 ký tự'); triggerShake(); setIsLoading(false); return }
      if (password !== confirmPassword) { setError('Mật khẩu xác nhận không khớp'); triggerShake(); setIsLoading(false); return }

      setSuccess('Đăng ký thành công! Vui lòng đăng nhập.')
      setTimeout(() => {
        setMode('login')
        setSuccess('')
        setPassword('')
        setName('')
        setConfirmPassword('')
      }, 2000)
    }
    setIsLoading(false)
  }

  const switchMode = (m: AuthMode) => {
    setMode(m)
    setError('')
    setSuccess('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setName('')
  }

  // Determine which mascot to show based on interaction
  let mascotSrc = '/mascot 4.png' // Default waving
  if (isPasswordFocused) {
    mascotSrc = '/mascot 7.png' // Covering eyes for password
  } else if (isEmailFocused || email.length > 0) {
    mascotSrc = '/mascot 5.png' // Hands up / happy when typing
  }

  if (!mounted) return null

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-landing-bg bg-paper text-landing-fg font-patrick selection:bg-landing-yellow selection:text-landing-fg">
      
      {/* Hand-Drawn Decorative Scribbles */}
      <div className="absolute top-6 left-6 z-20 flex items-center gap-2">
        <svg width="60" height="60" viewBox="0 0 100 100" fill="none" className="-rotate-12 opacity-60">
           <path d="M10,50 Q30,10 50,50 T90,50" stroke="#16a34a" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="10 10" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 flex flex-col items-center mt-8">

        {/* Container for Mascot and Form */}
        <div className="flex flex-col md:flex-row items-center justify-center w-full relative">

          {/* Mascot */}
          <div className="hidden md:block w-[380px] h-[380px] relative z-20 md:-mr-10 xl:-mr-10 mt-[15rem] transition-transform duration-500 ease-out transform hover:scale-105">
            {/* Hand-drawn frame behind mascot */}
            <div className="absolute -inset-4 bg-landing-yellow/30 radius-wobbly blur-md -z-10 -rotate-2" />
            <Image
              src={mascotSrc}
              alt="Rescom Mascot"
              fill
              className="object-contain drop-shadow-[8px_8px_0px_rgba(45,45,45,0.1)] transition-all duration-300 ease-in-out"
              priority
            />
          </div>

          {/* Login Card */}
          <div className={`w-full max-w-[420px] relative z-10 transition-all duration-300 ${shakeError ? 'animate-shake' : ''}`}>
            
            <HandCard decoration="tape" className="p-8 md:p-10 w-full">
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold font-kalam -rotate-1">
                  {mode === 'login' ? 'Chào mừng trở lại' : 'Tạo tài khoản mới'}
                </h1>
                <p className="text-xl text-landing-fg/80 mt-2 rotate-1">
                  {mode === 'login' ? 'Đăng nhập để tiếp tục với Rescom' : 'Tham gia cộng đồng nghiên cứu Rescom'}
                </p>
              </div>

              {/* Hand-Drawn Tab Switcher */}
              <div className="flex gap-4 mb-8">
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className={`flex-1 py-2 text-xl font-bold transition-all duration-200 border-2 radius-wobbly ${
                    mode === 'login'
                      ? 'border-landing-border bg-landing-accent text-white shadow-hard translate-x-[-2px] translate-y-[-2px]'
                      : 'border-landing-border/20 bg-transparent text-landing-fg/60 hover:text-landing-fg hover:border-landing-border/50'
                  }`}
                >
                  Đăng nhập
                </button>
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  className={`flex-1 py-2 text-xl font-bold transition-all duration-200 border-2 radius-wobbly ${
                    mode === 'register'
                      ? 'border-landing-border bg-landing-accent text-white shadow-hard translate-x-[-2px] translate-y-[-2px]'
                      : 'border-landing-border/20 bg-transparent text-landing-fg/60 hover:text-landing-fg hover:border-landing-border/50'
                  }`}
                >
                  Đăng ký
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Name Field (Register Mode Only) */}
                <div className={`transition-all duration-400 ease-out overflow-hidden ${mode === 'register' ? 'max-h-[100px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-xl font-bold ml-2">
                      Họ và tên
                    </label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-landing-border/50 group-focus-within:text-landing-secondary z-10 transition-colors" />
                      <HandInput
                        id="name"
                        placeholder="Nguyễn Văn A"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-12 text-xl h-14"
                      />
                    </div>
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xl font-bold ml-2">
                    Email
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-landing-border/50 group-focus-within:text-landing-secondary z-10 transition-colors" />
                    <HandInput
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setIsEmailFocused(true)}
                      onBlur={() => setIsEmailFocused(false)}
                      required
                      className="pl-12 text-xl h-14"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <label htmlFor="password" className="text-xl font-bold ml-2">
                    Mật khẩu
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-landing-border/50 group-focus-within:text-landing-secondary z-10 transition-colors" />
                    <HandInput
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setIsPasswordFocused(true)}
                      onBlur={() => setIsPasswordFocused(false)}
                      required
                      className="pl-12 pr-12 text-xl h-14 tracking-widest"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-landing-border/50 hover:text-landing-secondary z-10 transition-colors"
                    >
                      {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field (Register Mode Only) */}
                <div className={`transition-all duration-400 ease-out overflow-hidden ${mode === 'register' ? 'max-h-[100px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="space-y-1.5">
                    <label htmlFor="confirm-password" className="text-xl font-bold ml-2">
                      Xác nhận mật khẩu
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-landing-border/50 group-focus-within:text-landing-secondary z-10 transition-colors" />
                      <HandInput
                        id="confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onFocus={() => setIsPasswordFocused(true)}
                        onBlur={() => setIsPasswordFocused(false)}
                        className="pl-12 pr-12 text-xl h-14 tracking-widest"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-landing-border/50 hover:text-landing-secondary z-10 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Forgot Password Link */}
                {mode === 'login' && (
                  <div className="flex justify-end pt-1">
                    <Link href="#" className="text-lg text-landing-secondary hover:line-through decoration-2 font-bold transition-all">
                      Quên mật khẩu?
                    </Link>
                  </div>
                )}

                {/* Alerts */}
                {error && (
                  <div className="flex items-center gap-3 p-4 bg-[#fecaca] border-2 border-landing-border radius-wobbly shadow-hard-sm text-landing-fg text-lg font-bold animate-fade-scale-in rotate-1">
                    <AlertCircle className="size-6 shrink-0 text-red-600" />
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="flex items-center gap-3 p-4 bg-landing-yellow border-2 border-landing-border radius-wobbly shadow-hard-sm text-landing-fg text-lg font-bold animate-fade-scale-in -rotate-1">
                    <Check className="size-6 shrink-0 text-landing-accent" />
                    <span>{success}</span>
                  </div>
                )}

                {/* Submit Button */}
                <HandButton
                  type="submit"
                  disabled={isLoading}
                  size="lg"
                  className="w-full mt-4"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Đang xử lý...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
                      <ArrowRight className="size-5" />
                    </span>
                  )}
                </HandButton>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-[3px] border-dashed border-landing-border/30" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-lg text-landing-fg/60 font-bold -rotate-2 inline-block">
                    hoặc
                  </span>
                </div>
              </div>

              {/* Social Logins */}
              <div className="flex justify-center gap-6">
                <button type="button" className="flex items-center justify-center w-14 h-14 bg-white border-[3px] border-landing-border radius-wobbly shadow-hard hover:bg-landing-yellow hover:-translate-y-1 transition-all">
                  <svg className="size-6" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                </button>
                <button type="button" className="flex items-center justify-center w-14 h-14 bg-white border-[3px] border-landing-border radius-wobbly shadow-hard hover:bg-landing-yellow hover:-translate-y-1 transition-all">
                  <svg className="size-6" fill="#333" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </button>
                <button type="button" className="flex items-center justify-center w-14 h-14 bg-white border-[3px] border-landing-border radius-wobbly shadow-hard hover:bg-landing-yellow hover:-translate-y-1 transition-all">
                  <svg className="size-6 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
              </div>
            </HandCard>
          </div>
        </div>

        {/* Footer (Outside the card) */}
        <div className="mt-12 text-center relative z-10 w-full max-w-lg">
          <p className="text-xl text-landing-fg/80 font-bold mb-6 relative inline-block">
            Bằng việc tiếp tục, bạn đồng ý với{' '}
            <Link href="#" className="text-landing-secondary hover:line-through decoration-2 transition-colors">Điều khoản</Link>
            {' & '}
            <Link href="#" className="text-landing-secondary hover:line-through decoration-2 transition-colors">Chính sách bảo mật</Link>
            
            {/* Wavy underline */}
            <svg className="absolute -bottom-2 left-0 w-full opacity-50" height="6" viewBox="0 0 100 6" preserveAspectRatio="none">
              <path d="M0,3 Q10,0 20,3 T40,3 T60,3 T80,3 T100,3" stroke="#16a34a" strokeWidth="2" fill="none" />
            </svg>
          </p>

          <div className="inline-flex items-center gap-3 px-6 py-2 bg-landing-muted border-2 border-landing-border radius-wobbly shadow-hard-sm text-lg rotate-1">
            <Leaf className="size-5 text-landing-accent" />
            <span>
              Demo: <code className="font-kalam text-landing-accent font-bold">demo@gmail.com</code> / <code className="font-kalam text-landing-accent font-bold">123456</code>
            </span>
          </div>
        </div>

      </div>
    </div>
  )
}
