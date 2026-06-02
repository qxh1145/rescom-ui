"use client"

import { useState, useEffect, useRef } from "react"
import { 
  Coffee, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink,
  Loader2,
  PartyPopper,
  XCircle,
  ArrowLeft
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type AnchorState = "waiting" | "input" | "success" | "error" | "time-barrier"

interface AnchorTabProps {
  surveyTitle: string
  pointBounty: number
  minimumTimeSeconds?: number // Time barrier in seconds
  formUrl: string
  onSubmitCode: (code: string) => Promise<{ success: boolean; error?: string }>
  onGoBack: () => void
}

export function AnchorTab({
  surveyTitle,
  pointBounty,
  minimumTimeSeconds = 60,
  formUrl,
  onSubmitCode,
  onGoBack,
}: AnchorTabProps) {
  const [state, setState] = useState<AnchorState>("waiting")
  const [code, setCode] = useState("")
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [errorMessage, setErrorMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const startTimeRef = useRef(Date.now())

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
      setElapsedSeconds(elapsed)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Auto-transition to input state after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setState("input")
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleSubmit = async () => {
    if (!code.trim()) return

    // Check time barrier
    if (elapsedSeconds < minimumTimeSeconds) {
      setState("time-barrier")
      setErrorMessage(`Bạn cần dành ít nhất ${minimumTimeSeconds} giây để hoàn thành khảo sát. Vui lòng đợi thêm ${minimumTimeSeconds - elapsedSeconds} giây.`)
      return
    }

    setIsSubmitting(true)
    
    try {
      const result = await onSubmitCode(code)
      
      if (result.success) {
        setState("success")
        setShowConfetti(true)
      } else {
        setState("error")
        setErrorMessage(result.error || "Mã không hợp lệ. Vui lòng kiểm tra lại.")
      }
    } catch {
      setState("error")
      setErrorMessage("Đã có lỗi xảy ra. Vui lòng thử lại.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRetry = () => {
    setCode("")
    setErrorMessage("")
    setState("input")
  }

  const meetsTimeBarrier = elapsedSeconds >= minimumTimeSeconds

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md">
        {/* Header */}
        <button 
          onClick={onGoBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Quay lại danh sách</span>
        </button>

        {/* Main content card */}
        <div className={cn(
          "relative overflow-hidden rounded-3xl bg-card border-2 p-8 transition-all duration-500",
          state === "success" && "border-success bg-success/5 animate-confetti-pop",
          state === "error" && "border-destructive bg-destructive/5",
          state === "time-barrier" && "border-warning bg-warning/5 animate-shake",
          state === "waiting" && "border-border",
          state === "input" && "border-primary"
        )}>
          {/* Confetti overlay for success */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full animate-float"
                  style={{
                    backgroundColor: ["#10b981", "#3b82f6", "#f59e0b", "#ec4899"][i % 4],
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Survey info */}
          <div className="text-center mb-8">
            <h2 className="font-semibold text-lg text-foreground mb-2 text-balance">
              {surveyTitle}
            </h2>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-success/10">
              <span className="font-display text-2xl font-bold text-success">+{pointBounty}</span>
              <span className="text-success">điểm</span>
            </div>
          </div>

          {/* State-based content */}
          {state === "waiting" && (
            <div className="text-center">
              <div className="w-20 h-20 rounded-3xl bg-muted mx-auto mb-6 flex items-center justify-center">
                <Coffee className="h-10 w-10 text-muted-foreground animate-float" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Hãy nghỉ ngơi nhé!
              </h3>
              <p className="text-muted-foreground mb-4 text-balance">
                Biểu mẫu đang mở ở tab mới. Hoàn thành xong quay lại đây nhập mã nhé!
              </p>
              <a 
                href={formUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline text-sm"
              >
                <ExternalLink className="h-4 w-4" />
                Mở lại biểu mẫu
              </a>
            </div>
          )}

          {state === "input" && (
            <div>
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Hoàn thành rồi?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Nhập mã hoàn thành từ cuối khảo sát
                </p>
              </div>

              {/* Code input */}
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="Nhập mã hoàn thành..."
                    className={cn(
                      "text-center text-2xl font-mono h-16 rounded-2xl border-2 transition-all",
                      meetsTimeBarrier 
                        ? "border-success focus:border-success focus:ring-success/20 animate-pulse-success" 
                        : "border-input"
                    )}
                    maxLength={10}
                  />
                  {meetsTimeBarrier && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-success flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-success-foreground" />
                    </div>
                  )}
                </div>

                {/* Time indicator */}
                <div className={cn(
                  "flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-sm",
                  meetsTimeBarrier 
                    ? "bg-success/10 text-success" 
                    : "bg-muted text-muted-foreground"
                )}>
                  <Clock className="h-4 w-4" />
                  <span>
                    {meetsTimeBarrier 
                      ? `Đã qua ${formatTime(elapsedSeconds)} - Sẵn sàng gửi!` 
                      : `Đã ${formatTime(elapsedSeconds)} / ${formatTime(minimumTimeSeconds)} tối thiểu`
                    }
                  </span>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={!code.trim() || isSubmitting}
                  className="w-full h-14 rounded-2xl font-semibold text-base"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Đang xác nhận...
                    </>
                  ) : (
                    "Xác nhận hoàn thành"
                  )}
                </Button>
              </div>

              <a 
                href={formUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors mt-4 text-sm"
              >
                <ExternalLink className="h-4 w-4" />
                Mở lại biểu mẫu
              </a>
            </div>
          )}

          {state === "success" && (
            <div className="text-center">
              <div className="w-20 h-20 rounded-3xl bg-success/20 mx-auto mb-6 flex items-center justify-center">
                <PartyPopper className="h-10 w-10 text-success" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Tuyệt vời!
              </h3>
              <p className="text-muted-foreground mb-6 text-balance">
                Bạn đã nhận được <span className="font-display font-bold text-success">+{pointBounty} điểm</span> cho khảo sát này!
              </p>
              <Button
                onClick={onGoBack}
                className="w-full h-12 rounded-2xl font-semibold"
              >
                Tiếp tục kiếm điểm
              </Button>
            </div>
          )}

          {state === "error" && (
            <div className="text-center">
              <div className="w-20 h-20 rounded-3xl bg-destructive/20 mx-auto mb-6 flex items-center justify-center">
                <XCircle className="h-10 w-10 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Không thể xác nhận
              </h3>
              <p className="text-muted-foreground mb-6 text-balance">
                {errorMessage}
              </p>
              <Button
                onClick={handleRetry}
                variant="outline"
                className="w-full h-12 rounded-2xl font-semibold"
              >
                Thử lại
              </Button>
            </div>
          )}

          {state === "time-barrier" && (
            <div className="text-center">
              <div className="w-20 h-20 rounded-3xl bg-warning/20 mx-auto mb-6 flex items-center justify-center animate-float">
                <AlertTriangle className="h-10 w-10 text-warning" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Chậm lại một chút!
              </h3>
              <p className="text-muted-foreground mb-6 text-balance">
                {errorMessage}
              </p>
              <div className="py-3 px-4 rounded-2xl bg-warning/10 text-warning font-medium mb-4">
                <Clock className="h-4 w-4 inline mr-2" />
                Còn {minimumTimeSeconds - elapsedSeconds} giây
              </div>
              <Button
                onClick={handleRetry}
                variant="outline"
                className="w-full h-12 rounded-2xl font-semibold"
              >
                Đã hiểu, quay lại
              </Button>
            </div>
          )}
        </div>

        {/* Tips section */}
        {(state === "waiting" || state === "input") && (
          <div className="mt-6 p-4 rounded-2xl bg-muted/50">
            <p className="text-sm text-muted-foreground text-center">
              <span className="font-medium text-foreground">💡 Mẹo:</span> Mã hoàn thành thường xuất hiện ở trang cuối cùng của khảo sát sau khi bạn nhấn {"\"Gửi\""}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
