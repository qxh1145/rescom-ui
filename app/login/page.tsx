'use client'

import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { LoginBear } from '@/components/rescom/login-bear'
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Leaf,
  TreePine,
  Check,
  AlertCircle,
} from 'lucide-react'

/* ─── Mock Data ──────────────────────────────────────────────── */
const MOCK_USER = { email: 'damin@gmail.com', password: '123456' }

type AuthMode = 'login' | 'register'

/* ─── Floating Leaf Component ────────────────────────────────── */
function FloatingLeaf({ delay, left, size, duration }: { delay: number; left: string; size: number; duration: number }) {
  return (
    <div
      className="absolute pointer-events-none z-[2]"
      style={{
        left,
        top: '-40px',
        animation: `leafFall ${duration}s linear ${delay}s infinite`,
        opacity: 0.35,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2C6.5 2 2 6.5 2 12c0 3.5 1.8 6.6 4.5 8.4C8 18 10 14 12 10c2 4 4 8 5.5 10.4C20.2 18.6 22 15.5 22 12c0-5.5-4.5-10-10-10z"
          fill="#4CAF50"
          opacity="0.6"
        />
        <path d="M12 2v20" stroke="#388E3C" strokeWidth="0.8" opacity="0.4" />
      </svg>
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────────────── */
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

  // Bear state
  const [isEmailFocused, setIsEmailFocused] = useState(false)
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)

  // Background
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    const orbs: Array<{
      x: number; y: number; radius: number
      dx: number; dy: number; color: string
    }> = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Forest green palette orbs
    const colors = [
      'rgba(76, 175, 80, 0.12)',    // Green 500
      'rgba(56, 142, 60, 0.10)',    // Green 700
      'rgba(129, 199, 132, 0.14)',  // Green 300
      'rgba(27, 94, 32, 0.08)',     // Green 900
      'rgba(165, 214, 167, 0.12)',  // Green 200
      'rgba(104, 159, 56, 0.10)',   // Light Green 700
      'rgba(139, 195, 74, 0.08)',   // Light Green 500
      'rgba(46, 125, 50, 0.10)',    // Green 800
    ]

    for (let i = 0; i < 8; i++) {
      orbs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 240 + 120,
        dx: (Math.random() - 0.5) * 0.35,
        dy: (Math.random() - 0.5) * 0.35,
        color: colors[i % colors.length],
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      orbs.forEach((o) => {
        o.x += o.dx
        o.y += o.dy
        if (o.x < -o.radius || o.x > canvas.width + o.radius) o.dx *= -1
        if (o.y < -o.radius || o.y > canvas.height + o.radius) o.dy *= -1

        const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.radius)
        g.addColorStop(0, o.color)
        g.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.beginPath()
        ctx.arc(o.x, o.y, o.radius, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()
      })
      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  /* ── Helpers ───────────────────────────────────────────────── */
  const triggerShake = () => {
    setShakeError(true)
    setTimeout(() => setShakeError(false), 600)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    await new Promise((r) => setTimeout(r, 1500))

    if (mode === 'login') {
      if (email === MOCK_USER.email && password === MOCK_USER.password) {
        setSuccess('Đăng nhập thành công! Đang chuyển hướng...')
        setTimeout(() => { window.location.href = '/' }, 2000)
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

  /* ── Render ────────────────────────────────────────────────── */
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#e8f5e9] via-[#f1f8e9] to-[#e0f2f1]">
      {/* Animated background orbs */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Leaf pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 Q20 15 25 25 Q30 15 35 25 Q40 15 30 5Z' fill='%23388E3C' opacity='0.4'/%3E%3Cpath d='M10 35 Q5 45 10 50 Q15 45 20 50 Q15 40 10 35Z' fill='%23388E3C' opacity='0.3'/%3E%3Cpath d='M50 40 Q45 48 50 55 Q55 48 58 52 Q55 44 50 40Z' fill='%23388E3C' opacity='0.3'/%3E%3C/svg%3E")`,
          backgroundSize: '120px 120px',
        }}
      />

      {/* Falling leaves animation */}
      <style>{`
        @keyframes leafFall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.35; }
          90% { opacity: 0.35; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
      <FloatingLeaf delay={0} left="10%" size={18} duration={14} />
      <FloatingLeaf delay={3} left="25%" size={14} duration={18} />
      <FloatingLeaf delay={6} left="55%" size={20} duration={15} />
      <FloatingLeaf delay={9} left="75%" size={16} duration={20} />
      <FloatingLeaf delay={2} left="90%" size={12} duration={16} />
      <FloatingLeaf delay={7} left="40%" size={15} duration={22} />

      {/* ── Bottom trees silhouette ──────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-[2] pointer-events-none opacity-[0.06]">
        <svg viewBox="0 0 1200 200" className="w-full" preserveAspectRatio="xMidYMax slice">
          <path d="M0 200 L0 120 Q30 60 60 120 Q90 40 120 120 Q150 70 180 120 Q210 50 240 120 Q270 80 300 120 Q330 55 360 120 Q390 70 420 120 Q450 45 480 120 Q510 75 540 120 Q570 50 600 120 Q630 65 660 120 Q690 40 720 120 Q750 80 780 120 Q810 55 840 120 Q870 70 900 120 Q930 50 960 120 Q990 75 1020 120 Q1050 60 1080 120 Q1110 45 1140 120 Q1170 70 1200 120 L1200 200Z" fill="#2E7D32" />
        </svg>
      </div>

      {/* ── Main column ──────────────────────────────────────── */}
      <div
        className={`relative z-10 w-full max-w-[440px] mx-4 flex flex-col items-center transition-all duration-500 ${shakeError ? 'animate-shake' : ''}`}
      >
        {/* Forest badge */}

        {/* ── Bear ────────────────────────────────────────────── */}
        <div className="w-52 relative z-20" style={{ marginBottom: '-18px' }}>
          <LoginBear
            isPasswordFocused={isPasswordFocused}
            isEmailFocused={isEmailFocused}
            emailLength={email.length}
          />
        </div>

        {/* ── Glass card (green tint) ────────────────────────── */}
        <div className="relative z-10 w-full bg-white/65 backdrop-blur-2xl rounded-3xl border border-green-100/80 shadow-[0_8px_60px_rgba(46,125,50,0.08),0_1px_3px_rgba(0,0,0,0.04)] px-8 pb-8 pt-7 md:px-10 md:pb-10 md:pt-8">
          {/* Header text */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-green-900 font-display tracking-tight">
              {mode === 'login' ? 'Chào mừng trở lại' : 'Tạo tài khoản mới'}
            </h1>
            <p className="text-sm text-green-700/60 mt-1">
              {mode === 'login'
                ? 'Đăng nhập để tiếp tục với Rescom'
                : 'Tham gia cộng đồng nghiên cứu Rescom'}
            </p>
          </div>

          {/* Tab switcher (green) */}
          <div className="relative flex items-center bg-green-50/80 rounded-xl p-1 mb-7">
            <div
              className="absolute top-1 bottom-1 rounded-lg bg-white shadow-sm transition-all duration-300 ease-out"
              style={{
                left: mode === 'login' ? '4px' : '50%',
                width: 'calc(50% - 4px)',
              }}
            />
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`relative z-10 flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors duration-200 ${mode === 'login' ? 'text-green-900' : 'text-green-600/60 hover:text-green-800'}`}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              className={`relative z-10 flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors duration-200 ${mode === 'register' ? 'text-green-900' : 'text-green-600/60 hover:text-green-800'}`}
            >
              Đăng ký
            </button>
          </div>

          {/* ── Form ─────────────────────────────────────────── */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name (register only) */}
            <div
              className={`transition-all duration-400 ease-out overflow-hidden ${mode === 'register' ? 'max-h-[100px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2'}`}
            >
              <div className="space-y-2">
                <Label htmlFor="auth-name" className="text-green-800 text-xs font-semibold uppercase tracking-wider">
                  Họ và tên
                </Label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-green-400 group-focus-within:text-green-600 transition-colors" />
                  <Input
                    id="auth-name"
                    placeholder="Nguyễn Văn A"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 pl-10 rounded-xl border-green-200 bg-white/60 focus:bg-white text-sm transition-all focus-visible:ring-green-500/20 focus-visible:border-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="auth-email" className="text-green-800 text-xs font-semibold uppercase tracking-wider">
                Email
              </Label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-green-400 group-focus-within:text-green-600 transition-colors" />
                <Input
                  id="auth-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                  required
                  className="h-12 pl-10 rounded-xl border-green-200 bg-white/60 focus:bg-white text-sm transition-all focus-visible:ring-green-500/20 focus-visible:border-green-500"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="auth-password" className="text-green-800 text-xs font-semibold uppercase tracking-wider">
                Mật khẩu
              </Label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-green-400 group-focus-within:text-green-600 transition-colors" />
                <Input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  required
                  className="h-12 pl-10 pr-12 rounded-xl border-green-200 bg-white/60 focus:bg-white text-sm transition-all focus-visible:ring-green-500/20 focus-visible:border-green-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-green-400 hover:text-green-600 hover:bg-green-50 transition-all"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Confirm password (register only) */}
            <div
              className={`transition-all duration-400 ease-out overflow-hidden ${mode === 'register' ? 'max-h-[100px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2'}`}
            >
              <div className="space-y-2">
                <Label htmlFor="auth-confirm" className="text-green-800 text-xs font-semibold uppercase tracking-wider">
                  Xác nhận mật khẩu
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-green-400 group-focus-within:text-green-600 transition-colors" />
                  <Input
                    id="auth-confirm"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    className="h-12 pl-10 pr-12 rounded-xl border-green-200 bg-white/60 focus:bg-white text-sm transition-all focus-visible:ring-green-500/20 focus-visible:border-green-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-green-400 hover:text-green-600 hover:bg-green-50 transition-all"
                  >
                    {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Forgot password */}
            {mode === 'login' && (
              <div className="flex justify-end">
                <button type="button" className="text-xs text-green-600 hover:text-green-700 font-medium hover:underline transition-colors">
                  Quên mật khẩu?
                </button>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm animate-fade-scale-in">
                <AlertCircle className="size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm animate-fade-scale-in">
                <Check className="size-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Submit - forest green gradient */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 hover:from-green-800 hover:via-green-700 hover:to-emerald-700 text-white font-semibold text-sm shadow-lg shadow-green-600/25 hover:shadow-green-600/40 transition-all duration-300 disabled:opacity-70 group"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Đang xử lý...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
                  <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-green-200/60" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white/70 backdrop-blur-sm px-4 text-xs text-green-500/70 font-medium">
                hoặc tiếp tục với
              </span>
            </div>
          </div>

          {/* Social login */}
          <div className="grid grid-cols-3 gap-3">
            {/* Google */}
            <button type="button" className="flex items-center justify-center h-12 rounded-xl border border-green-200/80 bg-white/60 hover:bg-white hover:border-green-300 hover:shadow-sm transition-all duration-200">
              <svg className="size-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            </button>
            {/* GitHub */}
            <button type="button" className="flex items-center justify-center h-12 rounded-xl border border-green-200/80 bg-white/60 hover:bg-white hover:border-green-300 hover:shadow-sm transition-all duration-200">
              <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </button>
            {/* Facebook */}
            <button type="button" className="flex items-center justify-center h-12 rounded-xl border border-green-200/80 bg-white/60 hover:bg-white hover:border-green-300 hover:shadow-sm transition-all duration-200">
              <svg className="size-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-7 text-center">
          <p className="text-xs text-green-700/40">
            Bằng việc tiếp tục, bạn đồng ý với{' '}
            <button type="button" className="text-green-600 hover:underline">Điều khoản</button>
            {' & '}
            <button type="button" className="text-green-600 hover:underline">Chính sách bảo mật</button>
          </p>

          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 backdrop-blur-sm border border-green-200/40 text-[11px] text-green-600/50">
            <Leaf className="size-3 text-green-500" />
            <span>
              Demo: <code className="font-mono text-green-700/60">damin@gmail.com</code> / <code className="font-mono text-green-700/60">123456</code>
            </span>
          </div>
        </div>
      </div>

      {/* Corner nature dots */}
      <div className="fixed top-6 left-6 z-20 flex items-center gap-2 opacity-50">
        <div className="size-2 rounded-full bg-green-400 animate-pulse" />
        <div className="size-2 rounded-full bg-emerald-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="size-2 rounded-full bg-lime-400 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="size-2 rounded-full bg-teal-400 animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>
      <div className="fixed bottom-6 right-6 z-20 text-[10px] text-green-600/30 font-mono">
        v0.1.0-forest
      </div>
    </div>
  )
}
