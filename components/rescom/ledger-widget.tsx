"use client"

import { Eye, EyeOff, Bell, TrendingUp, CheckCircle, Wallet } from "lucide-react"
import { useState } from "react"

interface StatsBarProps {
  balance: number
  lockedBalance: number
  completedSurveys: number
  weeklyPoints: number
  userName: string
}

export function StatsBar({ 
  balance, 
  lockedBalance, 
  completedSurveys, 
  weeklyPoints,
  userName 
}: StatsBarProps) {
  const [isBalanceHidden, setIsBalanceHidden] = useState(false)

  const formatNumber = (num: number) => {
    return num.toLocaleString("vi-VN")
  }

  return (
    <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center lg:divide-x divide-border">
        {/* Block 1: Wallet Balance */}
        <div className="flex items-center gap-4 p-5 lg:p-6 flex-1 border-b lg:border-b-0 border-border">
          <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center flex-shrink-0">
            <Wallet className="h-7 w-7 text-success" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Ví điểm:</p>
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl font-bold text-foreground">
                {isBalanceHidden ? "•••••" : formatNumber(balance)}
              </span>
              <span className="text-lg font-medium text-muted-foreground">đ</span>
              <button 
                onClick={() => setIsBalanceHidden(!isBalanceHidden)}
                className="p-1.5 rounded-lg hover:bg-accent transition-colors ml-1"
              >
                {isBalanceHidden ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {formatNumber(lockedBalance)} đ ký quỹ
            </p>
          </div>
        </div>

        {/* Block 2: Completed Surveys */}
        <div className="flex items-center gap-4 p-5 lg:p-6 flex-1 border-b lg:border-b-0 border-border">
          <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="h-7 w-7 text-success" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Hoàn thành:</p>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold text-foreground">
                {completedSurveys}
              </span>
              <span className="text-sm text-muted-foreground">khảo sát</span>
            </div>
          </div>
        </div>

        {/* Block 3: Weekly Points */}
        <div className="flex items-center gap-4 p-5 lg:p-6 flex-1 border-b lg:border-b-0 border-border">
          <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="h-7 w-7 text-success" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">tuần này</p>
            <span className="font-display text-2xl font-bold text-success">
              +{formatNumber(weeklyPoints)} đ
            </span>
          </div>
        </div>

        {/* User Profile (desktop only, shown in top right) */}
        <div className="hidden lg:flex items-center gap-3 p-5 lg:p-6 border-l border-border">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=nguyen" 
              alt={userName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-right">
            <p className="font-medium text-foreground text-sm">{userName}</p>
          </div>
          <button className="relative p-2 rounded-xl hover:bg-accent transition-colors ml-2">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-card" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Keep the old exports for backwards compatibility but mark as deprecated
export function LedgerWidget({ balance, lockedBalance }: { balance: number; lockedBalance: number }) {
  return (
    <StatsBar 
      balance={balance} 
      lockedBalance={lockedBalance}
      completedSurveys={24}
      weeklyPoints={850}
      userName="Nguyễn A"
    />
  )
}

export function CompactLedger({ balance, lockedBalance }: { balance: number; lockedBalance: number }) {
  return (
    <StatsBar 
      balance={balance} 
      lockedBalance={lockedBalance}
      completedSurveys={24}
      weeklyPoints={850}
      userName="Nguyễn Văn A"
    />
  )
}
