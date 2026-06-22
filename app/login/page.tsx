'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Leaf, Check, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

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
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Static Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/BG.png"
          alt="Background"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Top Left Decorative Dots */}
      <div className="absolute top-6 left-6 z-20 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#87d7ac]" />
        <div className="w-3 h-3 rounded-full bg-[#bde8a5]" />
        <div className="w-3 h-3 rounded-full bg-[#dcf4ba]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 flex flex-col items-center mt-8">

        {/* Container for Mascot and Form */}
        <div className="flex flex-col md:flex-row items-center justify-center w-full relative">

          {/* Mascot (Hidden on small screens, positioned to the left) */}
          <div className="hidden md:block w-[380px] h-[380px] relative z-20 md:-mr-10 xl:-mr-10 mt-[15rem] transition-transform duration-500 ease-out transform hover:scale-105">
            <Image
              src={mascotSrc}
              alt="Rescom Mascot"
              fill
              className="object-contain drop-shadow-2xl transition-all duration-300 ease-in-out"
              priority
            />
          </div>

          {/* Login Card */}
          <div className={`w-full max-w-[420px] bg-white rounded-[32px] p-8 md:p-10 shadow-[0_20px_60px_rgba(30,100,50,0.12)] relative z-10 transition-all duration-500 ${shakeError ? 'animate-shake' : ''}`}>

            <div className="text-center mb-8">
              <h1 className="text-[22px] font-bold text-[#144f2d] font-display">
                {mode === 'login' ? 'Chào mừng trở lại' : 'Tạo tài khoản mới'}
              </h1>
              <p className="text-[13px] text-[#4f8a65] mt-1.5 font-medium">
                {mode === 'login' ? 'Đăng nhập để tiếp tục với Rescom' : 'Tham gia cộng đồng nghiên cứu Rescom'}
              </p>
            </div>

            {/* Custom Tab Switcher */}
            <div className="relative flex items-center bg-[#f2f8f4] rounded-full p-1.5 mb-8 border border-[#e5f0e8]">
              <div
                className="absolute top-1.5 bottom-1.5 rounded-full bg-white shadow-sm transition-all duration-300 ease-out border border-[#eef5f0]"
                style={{
                  left: mode === 'login' ? '6px' : '50%',
                  width: 'calc(50% - 6px)',
                }}
              />
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`relative z-10 flex-1 py-2.5 text-[14px] font-bold rounded-full transition-colors duration-200 ${mode === 'login' ? 'text-[#197d43]' : 'text-[#87b499] hover:text-[#197d43]'}`}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => switchMode('register')}
                className={`relative z-10 flex-1 py-2.5 text-[14px] font-bold rounded-full transition-colors duration-200 ${mode === 'register' ? 'text-[#197d43]' : 'text-[#87b499] hover:text-[#197d43]'}`}
              >
                Đăng ký
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Name Field (Register Mode Only) */}
              <div className={`transition-all duration-400 ease-out overflow-hidden ${mode === 'register' ? 'max-h-[100px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2'}`}>
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-[#197d43] text-[11px] font-bold uppercase tracking-wider ml-2">
                    Họ và tên
                  </Label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4.5 text-[#5cb87e] group-focus-within:text-[#197d43] transition-colors" />
                    <Input
                      id="name"
                      placeholder="Nguyễn Văn A"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-[52px] pl-12 rounded-full border-[#dcece2] bg-white text-sm transition-all focus-visible:ring-[#5cb87e]/20 focus-visible:border-[#5cb87e]"
                    />
                  </div>
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[#197d43] text-[11px] font-bold uppercase tracking-wider ml-2">
                  Email
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4.5 text-[#5cb87e] group-focus-within:text-[#197d43] transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
                    required
                    className="h-[52px] pl-12 rounded-full border-[#dcece2] bg-white text-[14px] transition-all focus-visible:ring-[#5cb87e]/20 focus-visible:border-[#5cb87e] placeholder:text-[#a0c2af]"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-[#197d43] text-[11px] font-bold uppercase tracking-wider ml-2">
                  Mật khẩu
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4.5 text-[#5cb87e] group-focus-within:text-[#197d43] transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    required
                    className="h-[52px] pl-12 pr-12 rounded-full border-[#dcece2] bg-white text-[14px] transition-all focus-visible:ring-[#5cb87e]/20 focus-visible:border-[#5cb87e] placeholder:text-[#a0c2af] tracking-widest"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-[#5cb87e] hover:text-[#197d43] transition-colors"
                  >
                    {showPassword ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field (Register Mode Only) */}
              <div className={`transition-all duration-400 ease-out overflow-hidden ${mode === 'register' ? 'max-h-[100px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2'}`}>
                <div className="space-y-1.5">
                  <Label htmlFor="confirm-password" className="text-[#197d43] text-[11px] font-bold uppercase tracking-wider ml-2">
                    Xác nhận mật khẩu
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4.5 text-[#5cb87e] group-focus-within:text-[#197d43] transition-colors" />
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onFocus={() => setIsPasswordFocused(true)}
                      onBlur={() => setIsPasswordFocused(false)}
                      className="h-[52px] pl-12 pr-12 rounded-full border-[#dcece2] bg-white text-[14px] transition-all focus-visible:ring-[#5cb87e]/20 focus-visible:border-[#5cb87e] placeholder:text-[#a0c2af] tracking-widest"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-[#5cb87e] hover:text-[#197d43] transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Forgot Password Link */}
              {mode === 'login' && (
                <div className="flex justify-end pt-1">
                  <Link href="#" className="text-[12.5px] text-[#2c8e54] hover:text-[#144f2d] font-bold hover:underline transition-colors">
                    Quên mật khẩu?
                  </Link>
                </div>
              )}

              {/* Alerts */}
              {error && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-[13px] font-medium animate-fade-scale-in">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#f0f9f3] border border-[#d2ebd9] text-[#197d43] text-[13px] font-medium animate-fade-scale-in">
                  <Check className="size-4 shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-[52px] rounded-full bg-[#0a8643] hover:bg-[#076834] text-white font-bold text-[15px] shadow-[0_6px_20px_rgba(10,134,67,0.3)] hover:shadow-[0_8px_25px_rgba(10,134,67,0.4)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 group mt-2"
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
                    <ArrowRight className="size-4.5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e2f0e6]" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-[12px] text-[#86b196] font-medium">
                  hoặc tiếp tục với
                </span>
              </div>
            </div>

            {/* Social Logins */}
            <div className="flex justify-center gap-4">
              <button type="button" className="flex items-center justify-center w-14 h-14 rounded-full border border-[#dcece2] bg-white hover:bg-[#f8fdf9] hover:border-[#a8d3b8] hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                <svg className="size-[22px]" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              </button>
              <button type="button" className="flex items-center justify-center w-14 h-14 rounded-full border border-[#dcece2] bg-white hover:bg-[#f8fdf9] hover:border-[#a8d3b8] hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                <svg className="size-[22px]" fill="#333" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </button>
              <button type="button" className="flex items-center justify-center w-14 h-14 rounded-full border border-[#dcece2] bg-white hover:bg-[#f8fdf9] hover:border-[#a8d3b8] hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                <svg className="size-[22px] text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
            </div>

          </div>
        </div>

        {/* Footer (Outside the card) */}
        <div className="mt-8 text-center relative z-10 w-full">
          <p className="text-[12px] text-[#3e7855] drop-shadow-sm font-medium">
            Bằng việc tiếp tục, bạn đồng ý với{' '}
            <Link href="#" className="font-bold hover:underline hover:text-[#185e34] transition-colors">Điều khoản</Link>
            {' & '}
            <Link href="#" className="font-bold hover:underline hover:text-[#185e34] transition-colors">Chính sách bảo mật</Link>
          </p>

          <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/40 backdrop-blur-md border border-white/60 shadow-sm text-[12px] text-[#2c6b45]">
            <Leaf className="size-3.5 text-[#1a8549]" />
            <span>
              Demo: <code className="font-bold text-[#144f2d] bg-white/50 px-1.5 py-0.5 rounded ml-1">demo@gmail.com</code> / <code className="font-bold text-[#144f2d] bg-white/50 px-1.5 py-0.5 rounded">123456</code>
            </span>
          </div>
        </div>

      </div>
    </div>
  )
}
