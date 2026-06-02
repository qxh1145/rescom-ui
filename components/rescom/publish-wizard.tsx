"use client"

import { useState } from "react"
import { 
  ArrowLeft, 
  ArrowRight, 
  Link2, 
  Users, 
  Lock, 
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info,
  Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PublishWizardProps {
  userBalance: number
  onPublish: (data: PublishData) => Promise<{ success: boolean; error?: string }>
  onCancel: () => void
}

interface PublishData {
  formUrl: string
  completionCode: string
  targetResponses: number
  pointBounty: number
  demographics: {
    university?: string
    major?: string
    yearRange?: string[]
    gender?: string
  }
}

type WizardStep = 1 | 2 | 3

export function PublishWizard({ userBalance, onPublish, onCancel }: PublishWizardProps) {
  const [step, setStep] = useState<WizardStep>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Form data
  const [formUrl, setFormUrl] = useState("")
  const [completionCode, setCompletionCode] = useState("")
  const [targetResponses, setTargetResponses] = useState(50)
  const [pointBounty, setPointBounty] = useState(20)
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>([])
  const [selectedMajors, setSelectedMajors] = useState<string[]>([])
  const [selectedYears, setSelectedYears] = useState<string[]>([])

  const totalEscrow = targetResponses * pointBounty
  const hasEnoughBalance = userBalance >= totalEscrow

  const universities = ["Tất cả", "ĐH Bách Khoa", "ĐH Kinh tế", "ĐH KHXH&NV", "ĐH CNTT", "ĐH Ngoại thương"]
  const majors = ["Tất cả", "CNTT", "Kinh tế", "Marketing", "Tâm lý học", "Xã hội học", "Quản trị"]
  const years = ["Năm 1", "Năm 2", "Năm 3", "Năm 4", "Sau đại học"]

  const toggleSelection = (item: string, selected: string[], setSelected: (items: string[]) => void) => {
    if (item === "Tất cả") {
      setSelected(["Tất cả"])
    } else {
      const newSelection = selected.includes(item)
        ? selected.filter(s => s !== item)
        : [...selected.filter(s => s !== "Tất cả"), item]
      setSelected(newSelection.length === 0 ? ["Tất cả"] : newSelection)
    }
  }

  const handleNext = () => {
    setError("")
    if (step === 1) {
      if (!formUrl.trim()) {
        setError("Vui lòng nhập link Google Form")
        return
      }
      if (!completionCode.trim()) {
        setError("Vui lòng nhập mã hoàn thành")
        return
      }
    }
    if (step < 3) {
      setStep((step + 1) as WizardStep)
    }
  }

  const handleBack = () => {
    setError("")
    if (step > 1) {
      setStep((step - 1) as WizardStep)
    } else {
      onCancel()
    }
  }

  const handleSubmit = async () => {
    if (!hasEnoughBalance) {
      setError(`Bạn cần thêm ${(totalEscrow - userBalance).toLocaleString("vi-VN")} điểm để đăng khảo sát này`)
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const result = await onPublish({
        formUrl,
        completionCode,
        targetResponses,
        pointBounty,
        demographics: {
          university: selectedUniversities.includes("Tất cả") ? undefined : selectedUniversities.join(", "),
          major: selectedMajors.includes("Tất cả") ? undefined : selectedMajors.join(", "),
          yearRange: selectedYears.length === 0 ? undefined : selectedYears,
        }
      })

      if (!result.success) {
        setError(result.error || "Đã có lỗi xảy ra")
      }
    } catch {
      setError("Đã có lỗi xảy ra. Vui lòng thử lại.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={handleBack}
            className="p-2 rounded-xl hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">Đăng khảo sát mới</h1>
            <p className="text-sm text-muted-foreground">Bước {step} / 3</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                "h-2 flex-1 rounded-full transition-all duration-300",
                s <= step ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-destructive/10 text-destructive mb-6">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Step 1: Link & Code */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Link2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Thông tin khảo sát</h2>
                  <p className="text-sm text-muted-foreground">Nhập link và mã hoàn thành</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="formUrl">Link Google Form</Label>
                  <Input
                    id="formUrl"
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                    placeholder="https://forms.gle/..."
                    className="h-12 rounded-2xl"
                  />
                  <p className="text-xs text-muted-foreground">
                    Paste link khảo sát Google Form của bạn
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code">Mã hoàn thành</Label>
                  <Input
                    id="code"
                    value={completionCode}
                    onChange={(e) => setCompletionCode(e.target.value.toUpperCase())}
                    placeholder="VD: RESCOM2024"
                    className="h-12 rounded-2xl font-mono text-center"
                    maxLength={15}
                  />
                  <p className="text-xs text-muted-foreground">
                    Tạo một mã duy nhất và đặt ở trang cuối khảo sát
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-foreground mb-1">Mẹo tạo mã hoàn thành</p>
                  <p className="text-muted-foreground">
                    Thêm một câu hỏi {"\"Văn bản ngắn\""} ở cuối khảo sát với mã cố định. Người trả lời sẽ copy mã này để xác nhận hoàn thành.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Demographics */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Đối tượng khảo sát</h2>
                  <p className="text-sm text-muted-foreground">Chọn nhóm sinh viên phù hợp</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Trường đại học</Label>
                  <div className="flex flex-wrap gap-2">
                    {universities.map((uni) => (
                      <button
                        key={uni}
                        onClick={() => toggleSelection(uni, selectedUniversities, setSelectedUniversities)}
                        className={cn(
                          "px-4 py-2 rounded-2xl text-sm font-medium transition-all active:scale-95",
                          selectedUniversities.includes(uni)
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-accent"
                        )}
                      >
                        {uni}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Chuyên ngành</Label>
                  <div className="flex flex-wrap gap-2">
                    {majors.map((major) => (
                      <button
                        key={major}
                        onClick={() => toggleSelection(major, selectedMajors, setSelectedMajors)}
                        className={cn(
                          "px-4 py-2 rounded-2xl text-sm font-medium transition-all active:scale-95",
                          selectedMajors.includes(major)
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-accent"
                        )}
                      >
                        {major}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Năm học</Label>
                  <div className="flex flex-wrap gap-2">
                    {years.map((year) => (
                      <button
                        key={year}
                        onClick={() => toggleSelection(year, selectedYears, setSelectedYears)}
                        className={cn(
                          "px-4 py-2 rounded-2xl text-sm font-medium transition-all active:scale-95",
                          selectedYears.includes(year)
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-accent"
                        )}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Escrow confirmation */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-warning/20 flex items-center justify-center">
                  <Lock className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Xác nhận ký quỹ</h2>
                  <p className="text-sm text-muted-foreground">Điểm sẽ được giữ an toàn</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Số người trả lời mong muốn</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      value={targetResponses}
                      onChange={(e) => setTargetResponses(Math.max(1, parseInt(e.target.value) || 1))}
                      className="h-12 rounded-2xl text-center font-display text-xl"
                      min={1}
                      max={500}
                    />
                    <span className="text-muted-foreground">người</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Điểm thưởng mỗi người</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      value={pointBounty}
                      onChange={(e) => setPointBounty(Math.max(5, parseInt(e.target.value) || 5))}
                      className="h-12 rounded-2xl text-center font-display text-xl"
                      min={5}
                      max={100}
                    />
                    <span className="text-muted-foreground">điểm</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Escrow breakdown */}
            <div className="p-6 rounded-3xl bg-warning/10 border border-warning/30">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-warning" />
                Chi tiết ký quỹ
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Số người x Điểm thưởng</span>
                  <span className="font-medium">{targetResponses} x {pointBounty}</span>
                </div>
                <div className="h-px bg-warning/30" />
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">Tổng ký quỹ</span>
                  <span className="font-display text-2xl font-bold text-warning">
                    {totalEscrow.toLocaleString("vi-VN")} điểm
                  </span>
                </div>
              </div>

              <div className="mt-4 p-4 rounded-2xl bg-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Số dư hiện tại</span>
                  <span className={cn(
                    "font-display font-bold",
                    hasEnoughBalance ? "text-success" : "text-destructive"
                  )}>
                    {userBalance.toLocaleString("vi-VN")} điểm
                  </span>
                </div>
                {hasEnoughBalance ? (
                  <div className="flex items-center gap-2 text-success text-sm">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Đủ điểm để đăng khảo sát</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-destructive text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>Cần thêm {(totalEscrow - userBalance).toLocaleString("vi-VN")} điểm</span>
                  </div>
                )}
              </div>

              <p className="mt-4 text-xs text-muted-foreground text-center text-balance">
                Điểm ký quỹ sẽ được hoàn lại cho những suất chưa có người trả lời sau 30 ngày
              </p>
            </div>

            {/* Friendly explanation */}
            <div className="p-4 rounded-2xl bg-success/10 border border-success/30">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm mb-1">
                    Hệ thống sẽ tìm {targetResponses} người trả lời cho bạn!
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Mỗi khi có người hoàn thành khảo sát, {pointBounty} điểm sẽ tự động chuyển cho họ. 
                    Bạn không cần làm gì thêm cả!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-3 mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex-1 h-14 rounded-2xl font-semibold"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {step === 1 ? "Huỷ" : "Quay lại"}
          </Button>
          
          {step < 3 ? (
            <Button
              onClick={handleNext}
              className="flex-1 h-14 rounded-2xl font-semibold"
            >
              Tiếp theo
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !hasEnoughBalance}
              className={cn(
                "flex-1 h-14 rounded-2xl font-semibold",
                hasEnoughBalance ? "bg-success hover:bg-success/90" : ""
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Đăng khảo sát
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
