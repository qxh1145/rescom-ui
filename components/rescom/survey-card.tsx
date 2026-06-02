"use client"

import { Clock, Users, Zap, ChevronRight, Sparkles, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SurveyCardProps {
  id: string
  title: string
  description?: string
  tags: string[]
  pointBounty: number
  estimatedTime: number // in minutes
  targetResponses: number
  currentResponses: number
  matchScore?: number // 0-100, how well it matches user profile
  onStart: (id: string) => void
  isNew?: boolean
}

export function SurveyCard({
  id,
  title,
  description,
  tags,
  pointBounty,
  estimatedTime,
  targetResponses,
  currentResponses,
  matchScore,
  onStart,
  isNew = false,
}: SurveyCardProps) {
  const progressPercent = Math.round((currentResponses / targetResponses) * 100)
  const spotsLeft = targetResponses - currentResponses

  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-3xl bg-card border border-border p-5",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5",
        "active:scale-[0.98]"
      )}
    >
      {/* New badge */}
      {isNew && (
        <div className="absolute -right-8 top-4 rotate-45 bg-success px-8 py-1 text-xs font-semibold text-success-foreground shadow-sm">
          Mới
        </div>
      )}

      {/* Match score indicator */}
      {matchScore && matchScore >= 80 && (
        <div className="flex items-center gap-1.5 mb-3 px-3 py-1.5 w-fit rounded-full bg-success/10 text-success text-xs font-medium">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Phù hợp với bạn</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-foreground text-lg leading-tight line-clamp-2 text-balance">
          {title}
        </h3>
        <div className="flex-shrink-0 px-3 py-2 rounded-2xl bg-success/10">
          <span className="font-display text-xl font-bold text-success">+{pointBounty}</span>
          <span className="text-xs text-success ml-0.5">đ</span>
        </div>
      </div>

      {description && (
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Meta info */}
      <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          <span>~{estimatedTime} phút</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="h-4 w-4" />
          <span>Còn {spotsLeft} suất</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-muted-foreground">Tiến độ thu thập</span>
          <span className="font-medium text-foreground">{progressPercent}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div 
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* CTA Button */}
      <Button 
        onClick={() => onStart(id)}
        className="w-full rounded-2xl h-12 font-semibold text-base bg-primary hover:bg-primary/90 active:scale-[0.98] transition-all"
      >
        <Zap className="h-4 w-4 mr-2" />
        Bắt đầu làm
        <ChevronRight className="h-4 w-4 ml-auto" />
      </Button>
    </div>
  )
}

interface CompletedSurveyCardProps {
  title: string
  pointsEarned: number
  completedAt: string
}

export function CompletedSurveyCard({ title, pointsEarned, completedAt }: CompletedSurveyCardProps) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border">
      <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
        <CheckCircle2 className="h-5 w-5 text-success" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-foreground truncate">{title}</h4>
        <p className="text-sm text-muted-foreground">{completedAt}</p>
      </div>
      <div className="font-display text-lg font-bold text-success">+{pointsEarned}</div>
    </div>
  )
}
