"use client"

import React, { useState, useEffect, useRef, useTransition } from "react"
import Link from "next/link"
import {
  Wallet,
  CheckCircle,
  TrendingUp,
  Bell,
  Search,
  Compass,
  PlusCircle,
  ArrowUpDown,
  Sparkles,
  Clock,
  Lock,
  Unlock,
  Settings,
  User,
  X,
  ChevronRight,
  Plus,
  SlidersHorizontal,
  Calendar,
  Users,
  Check,
  BookOpen,
  ShoppingCart,
  Cpu,
  HeartPulse,
  Bike,
  Gamepad2,
  Landmark,
  Share2,
  HelpCircle,
  LogOut,
  Moon,
  Sun,
  Award,
  Zap,
  Info,
  CheckSquare,
  Square,
  FileText
} from "lucide-react"

// Types & Interfaces
interface Survey {
  id: string
  title: string
  description: string
  tags: string[]
  pointBounty: number
  estimatedTime: number // in minutes
  targetResponses: number
  currentResponses: number
  matchScore: number // 0-100%
  createdHoursAgo: number
  deadlineDays: number
  completed: boolean
  topic: "shopping" | "ai" | "health" | "finance" | "food" | "english" | "gaming" | "library" | "social"
  completionCode: string
  universityTarget?: string
  majorTarget?: string
}

interface ToastMessage {
  id: string
  text: string
  type: "success" | "info" | "reward"
}

interface RescomNotification {
  id: string
  type: "new_survey" | "points_received" | "feedback" | "expiring" | "frozen_unlocked"
  title: string
  description: string
  timeAgo: string
  unread: boolean
}

// Initial Mock Surveys
const INITIAL_SURVEYS: Survey[] = [
  {
    id: "1",
    title: "Khảo sát Hành vi Mua sắm Thời trang của Gen Z tại Việt Nam",
    description: "Nghiên cứu về thói quen mua sắm trực tuyến, các thương hiệu thời trang nội địa và quyết định mua hàng trên các sàn TMĐT.",
    tags: ["Gen Z", "Thời trang", "Mua sắm"],
    pointBounty: 25,
    estimatedTime: 5,
    targetResponses: 100,
    currentResponses: 67,
    matchScore: 95,
    createdHoursAgo: 12, // < 48 hours -> "Mới" ribbon
    deadlineDays: 2, // < 3 days -> red + bold
    completed: false,
    topic: "shopping",
    completionCode: "GENZSHOP25",
    universityTarget: "Tất cả",
    majorTarget: "Marketing"
  },
  {
    id: "2",
    title: "Đánh giá Ứng dụng AI (ChatGPT, Claude) trong Học tập",
    description: "Khảo sát mức độ sử dụng, tính hiệu quả học thuật và thái độ học tập của sinh viên đối với các công cụ trí tuệ nhân tạo.",
    tags: ["AI", "Công nghệ", "Giáo dục"],
    pointBounty: 40,
    estimatedTime: 8,
    targetResponses: 80,
    currentResponses: 45,
    matchScore: 98, // 90-100% -> solid green match badge
    createdHoursAgo: 20, // < 48 hours -> "Mới" ribbon
    deadlineDays: 4, // 3-7 days -> orange
    completed: false,
    topic: "ai",
    completionCode: "AICLASS40",
    universityTarget: "ĐH CNTT",
    majorTarget: "CNTT"
  },
  {
    id: "3",
    title: "Nghiên cứu Stress và Sức khỏe Tâm thần Sinh viên Đại học",
    description: "Đánh giá mức độ áp lực học tập thi cử và đề xuất các giải pháp hỗ trợ tâm lý tại các trường đại học lớn.",
    tags: ["Tâm lý", "Sức khỏe", "Y tế"],
    pointBounty: 35,
    estimatedTime: 10,
    targetResponses: 150,
    currentResponses: 145,
    matchScore: 88, // 70-89% -> medium green badge
    createdHoursAgo: 50,
    deadlineDays: 0.8, // < 24h -> red + pulsing
    completed: true, // completed state
    topic: "health",
    completionCode: "MINDSTRESS35",
    universityTarget: "Tất cả",
    majorTarget: "Tâm lý học"
  },
  {
    id: "4",
    title: "Xu hướng Sử dụng Fintech và Ví điện tử của Sinh viên IT",
    description: "Khảo sát các yếu tố ảnh hưởng đến quyết định lựa chọn ví điện tử MoMo, ZaloPay và ShopeePay của giới trẻ ngày nay.",
    tags: ["Tài chính", "Fintech", "Ví điện tử"],
    pointBounty: 30,
    estimatedTime: 7,
    targetResponses: 200,
    currentResponses: 50,
    matchScore: 92,
    createdHoursAgo: 60,
    deadlineDays: 10, // > 7 days -> gray
    completed: false,
    topic: "finance",
    completionCode: "FINWAL30",
    universityTarget: "ĐH Bách Khoa",
    majorTarget: "Kinh tế"
  },
  {
    id: "5",
    title: "Khảo sát Thói quen Đặt Đồ ăn qua Ứng dụng Di động",
    description: "Phân tích tần suất đặt hàng trực tuyến, tiêu chí lựa chọn ứng dụng đặt đồ ăn GrabFood, ShopeeFood, Baemin của sinh viên.",
    tags: ["Ẩm thực", "Dịch vụ", "Tiêu dùng"],
    pointBounty: 20,
    estimatedTime: 4,
    targetResponses: 120,
    currentResponses: 75,
    matchScore: 78,
    createdHoursAgo: 3, // < 48 hours -> "Mới" ribbon
    deadlineDays: 3, // 3-7 days -> orange
    completed: false,
    topic: "food",
    completionCode: "FOODAPP20",
    universityTarget: "Tất cả",
    majorTarget: "Kinh tế"
  },
  {
    id: "6",
    title: "Nhu cầu Học Tiếng Anh và các Chứng chỉ Quốc tế IELTS, TOEIC",
    description: "Khảo sát mong muốn cải thiện ngoại ngữ, chi phí học tập có thể chi trả và hình thức học offline/online ưa thích.",
    tags: ["Giáo dục", "Ngoại ngữ", "IELTS"],
    pointBounty: 15,
    estimatedTime: 3,
    targetResponses: 300,
    currentResponses: 120,
    matchScore: 48, // < 50% -> hide badge
    createdHoursAgo: 96,
    deadlineDays: 14, // > 7 days -> gray
    completed: true, // completed state
    topic: "english",
    completionCode: "ENGLISH15",
    universityTarget: "ĐH Ngoại thương",
    majorTarget: "Tất cả"
  },
  {
    id: "7",
    title: "Trải nghiệm Chơi Game Online và Mức độ Ảnh hưởng Học tập",
    description: "Khảo sát hành vi chơi game online, thời gian dành cho game mỗi ngày và mối tương quan đến kết quả học tập của sinh viên.",
    tags: ["Giải trí", "Gaming", "Sinh viên"],
    pointBounty: 50,
    estimatedTime: 12,
    targetResponses: 50,
    currentResponses: 48, // 2 spots left -> "Còn ít suất nhất"
    matchScore: 96,
    createdHoursAgo: 36, // < 48 hours -> "Mới" ribbon
    deadlineDays: 0.5, // < 24h -> red + pulsing
    completed: false,
    topic: "gaming",
    completionCode: "GAMING50",
    universityTarget: "ĐH CNTT",
    majorTarget: "CNTT"
  },
  {
    id: "8",
    title: "Đánh giá Dịch vụ Thư viện Trường Đại học Quốc gia",
    description: "Khảo sát mức độ hài lòng về không gian tự học, nguồn sách tham khảo và thái độ phục vụ tại thư viện trường đại học.",
    tags: ["Trường học", "Thư viện", "Học tập"],
    pointBounty: 15,
    estimatedTime: 5,
    targetResponses: 100,
    currentResponses: 35,
    matchScore: 65, // 50-69% -> light green badge
    createdHoursAgo: 72,
    deadlineDays: 5, // orange
    completed: false,
    topic: "library",
    completionCode: "LIBRARY15",
    universityTarget: "Tất cả",
    majorTarget: "Tất cả"
  },
  {
    id: "9",
    title: "Thói quen Sử dụng Mạng xã hội TikTok, Facebook & Instagram",
    description: "Khảo sát thời gian onscreen mỗi ngày, nội dung thường xem và những ảnh hưởng tâm lý tích cực/tiêu cực của mạng xã hội.",
    tags: ["Mạng xã hội", "TikTok", "Truyền thông"],
    pointBounty: 22,
    estimatedTime: 6,
    targetResponses: 250,
    currentResponses: 231,
    matchScore: 72, // 70-89% -> medium green badge
    createdHoursAgo: 24, // < 48 hours -> "Mới" ribbon
    deadlineDays: 1, // < 3 days -> red + bold
    completed: false,
    topic: "social",
    completionCode: "SOCIAL22",
    universityTarget: "ĐH KHXH&NV",
    majorTarget: "Xã hội học"
  }
]

// Initial Mock Notifications
const INITIAL_NOTIFICATIONS: RescomNotification[] = [
  {
    id: "n1",
    type: "new_survey",
    title: "Khảo sát mới phù hợp",
    description: "Đánh giá Ứng dụng AI trong Học tập có độ tương thích 98% với bạn.",
    timeAgo: "2 giờ trước",
    unread: true
  },
  {
    id: "n2",
    type: "points_received",
    title: "Bạn nhận được +25đ",
    description: "Khảo sát hành vi mua sắm Gen Z đã được phê duyệt thành công.",
    timeAgo: "5 giờ trước",
    unread: true
  },
  {
    id: "n3",
    type: "feedback",
    title: "Feedback mới từ chủ khảo sát",
    description: "Khảo sát của bạn nhận được phản hồi chất lượng từ sinh viên CNTT.",
    timeAgo: "1 ngày trước",
    unread: false
  },
  {
    id: "n4",
    type: "expiring",
    title: "Khảo sát sắp hết hạn",
    description: "Khảo sát stress sinh viên chỉ còn 20 giờ để hoàn thành mục tiêu.",
    timeAgo: "2 ngày trước",
    unread: false
  }
]

export default function RescomDashboard() {
  const [isPending, startTransition] = useTransition()

  // App States
  const [balance, setBalance] = useState(2450)
  const [lockedBalance, setLockedBalance] = useState(500)
  const [completedCount, setCompletedCount] = useState(24)
  const [weeklyPoints, setWeeklyPoints] = useState(850)
  const [frozenCount, setFrozenCount] = useState(2) // out of 3
  const [showFrozenBanner, setShowFrozenBanner] = useState(true)

  // Surveys & Interactive State
  const [surveys, setSurveys] = useState<Survey[]>(INITIAL_SURVEYS)
  const [notifications, setNotifications] = useState<RescomNotification[]>(INITIAL_NOTIFICATIONS)
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  // Search & Filtering States
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [sortOption, setSortOption] = useState("Mới nhất")
  const [activeFilter, setActiveFilter] = useState<"Tất cả" | "Phù hợp" | "Thưởng cao" | "Nhanh">("Tất cả")
  const [hideCompleted, setHideCompleted] = useState(false)

  // Advanced Filter Side Panel States
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [selectedMajors, setSelectedMajors] = useState<string[]>([])
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>([])
  const [ageRange, setAgeRange] = useState<[number, number]>([16, 30])
  const [bountyRange, setBountyRange] = useState<number>(5)
  const [selectedDuration, setSelectedDuration] = useState<string>("")
  const [selectedDeadline, setSelectedDeadline] = useState<string>("")

  // Active Filter Count for Badge
  const [activeFilterCount, setActiveFilterCount] = useState(0)

  // Layout UI States
  const [scrolled, setScrolled] = useState(false)
  const [isStatsBarCollapsed, setIsStatsBarCollapsed] = useState(true)
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(true)

  // Overlay/Modal States
  const [activeSurveyForModal, setActiveSurveyForModal] = useState<Survey | null>(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showFABModal, setShowFABModal] = useState(false)
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false)

  // completion code simulation state
  const [enteredCode, setEnteredCode] = useState("")
  const [codeError, setCodeError] = useState("")
  const [isSubmittingCode, setIsSubmittingCode] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [surveyInProgress, setSurveyInProgress] = useState(false)

  // New Survey Creation State (FAB Modal)
  const [newSurveyUrl, setNewSurveyUrl] = useState("")
  const [newSurveyTitle, setNewSurveyTitle] = useState("")
  const [newSurveyCode, setNewSurveyCode] = useState("")
  const [newSurveyBounty, setNewSurveyBounty] = useState(25)
  const [newSurveyTarget, setNewSurveyTarget] = useState(50)
  const [newSurveyTopic, setNewSurveyTopic] = useState<Survey["topic"]>("shopping")

  // Floating points reward animation helpers
  const [floatingReward, setFloatingReward] = useState<{ amount: number; x: number; y: number } | null>(null)

  // Refs for closing panels on outside click
  const notificationRef = useRef<HTMLDivElement>(null)
  const sortDropdownRef = useRef<HTMLDivElement>(null)
  const bellDesktopRef = useRef<HTMLButtonElement>(null)
  const [showSortDropdown, setShowSortDropdown] = useState(false)

  // Toast Functionality
  const showToast = (text: string, type: "success" | "info" | "reward" = "success") => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, text, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4500)
  }

  // Load state from localStorage on mount
  useEffect(() => {
    const storedFrozenDismiss = localStorage.getItem("rescom_frozen_dismissed")
    if (storedFrozenDismiss === "true") {
      setShowFrozenBanner(false)
    }
    const storedBalance = localStorage.getItem("rescom_balance")
    if (storedBalance) setBalance(parseInt(storedBalance))

    const storedCompleted = localStorage.getItem("rescom_completed")
    if (storedCompleted) setCompletedCount(parseInt(storedCompleted))

    const storedFrozenCount = localStorage.getItem("rescom_frozen_count")
    if (storedFrozenCount) setFrozenCount(parseInt(storedFrozenCount))
  }, [])

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Scroll listener: only toggle shadow (no layout/height changes to avoid jump)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // ESC Key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowAdvancedFilters(false)
        setShowNotifications(false)
        setActiveSurveyForModal(null)
        setShowFABModal(false)
        setShowSortDropdown(false)
        setIsSidebarMobileOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Outside click listener for notification / sort dropdowns
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target as Node)) {
        setShowSortDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [])

  // Recalculate Active Filter Count
  useEffect(() => {
    let count = 0
    if (selectedMajors.length > 0) count++
    if (selectedUniversities.length > 0) count++
    if (ageRange[0] !== 16 || ageRange[1] !== 30) count++
    if (bountyRange > 5) count++
    if (selectedDuration !== "") count++
    if (selectedDeadline !== "") count++
    setActiveFilterCount(count)
  }, [selectedMajors, selectedUniversities, ageRange, bountyRange, selectedDuration, selectedDeadline])

  // Vietnamese Diacritic Insensitive helper
  const removeDiacritics = (str: string) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
  }

  // Vietnamese Diacritic Insensitive Highlight function
  const highlightText = (text: string, search: string) => {
    if (!search.trim()) return <span>{text}</span>

    const normalizedText = removeDiacritics(text)
    const normalizedSearch = removeDiacritics(search)

    const parts: React.ReactNode[] = []
    let currentIndex = 0

    while (true) {
      const matchIndex = normalizedText.indexOf(normalizedSearch, currentIndex)
      if (matchIndex === -1) {
        parts.push(text.slice(currentIndex))
        break
      }

      if (matchIndex > currentIndex) {
        parts.push(text.slice(currentIndex, matchIndex))
      }

      const matchLength = normalizedSearch.length
      const matchText = text.slice(matchIndex, matchIndex + matchLength)

      parts.push(
        <mark key={matchIndex} className="bg-yellow-200 text-[#1A1A1A] font-semibold rounded px-0.5 animate-pulse">
          {matchText}
        </mark>
      )

      currentIndex = matchIndex + matchLength
    }

    return <span>{parts}</span>
  }

  // Filter & Sort core logic
  const filteredSurveys = surveys.filter((survey) => {
    // 1. Hide completed check
    if (hideCompleted && survey.completed) return false

    // 2. Main Search query matching
    if (debouncedSearch.trim()) {
      const searchNorm = removeDiacritics(debouncedSearch)
      const titleNorm = removeDiacritics(survey.title)
      const descNorm = removeDiacritics(survey.description)
      const tagsNorm = removeDiacritics(survey.tags.join(" "))

      const matchesSearch =
        titleNorm.includes(searchNorm) || descNorm.includes(searchNorm) || tagsNorm.includes(searchNorm)

      if (!matchesSearch) return false
    }

    // 3. Quick Pills Filters
    if (activeFilter === "Phù hợp") {
      if (survey.matchScore < 70) return false
    } else if (activeFilter === "Thưởng cao") {
      if (survey.pointBounty < 30) return false
    } else if (activeFilter === "Nhanh") {
      if (survey.estimatedTime > 5) return false
    }

    // 4. Advanced Filter Side Panel Matching
    if (selectedMajors.length > 0 && survey.majorTarget && survey.majorTarget !== "Tất cả") {
      const matchesMajor = selectedMajors.some((m) => survey.majorTarget?.includes(m))
      if (!matchesMajor) return false
    }

    if (selectedUniversities.length > 0 && survey.universityTarget && survey.universityTarget !== "Tất cả") {
      const matchesUni = selectedUniversities.some((u) => survey.universityTarget?.includes(u))
      if (!matchesUni) return false
    }

    if (survey.pointBounty < bountyRange) return false

    // Time ranges filter
    if (selectedDuration) {
      if (selectedDuration === "<5" && survey.estimatedTime >= 5) return false
      if (selectedDuration === "5-10" && (survey.estimatedTime < 5 || survey.estimatedTime > 10)) return false
      if (selectedDuration === "10-20" && (survey.estimatedTime < 10 || survey.estimatedTime > 20)) return false
      if (selectedDuration === ">20" && survey.estimatedTime <= 20) return false
    }

    // Deadline ranges filter
    if (selectedDeadline) {
      if (selectedDeadline === "1" && survey.deadlineDays > 1) return false
      if (selectedDeadline === "3" && survey.deadlineDays > 3) return false
      if (selectedDeadline === "7" && survey.deadlineDays > 7) return false
      if (selectedDeadline === "30" && survey.deadlineDays > 30) return false
    }

    return true
  })

  // Sorting Implementation
  const sortedSurveys = [...filteredSurveys].sort((a, b) => {
    switch (sortOption) {
      case "Deadline gần nhất":
        return a.deadlineDays - b.deadlineDays
      case "Thưởng cao nhất":
        return b.pointBounty - a.pointBounty
      case "Thời gian ngắn nhất":
        return a.estimatedTime - b.estimatedTime
      case "Độ phù hợp cao nhất":
        return b.matchScore - a.matchScore
      case "Còn ít suất nhất":
        return (a.targetResponses - a.currentResponses) - (b.targetResponses - b.currentResponses)
      case "Mới nhất":
      default:
        return a.createdHoursAgo - b.createdHoursAgo
    }
  })

  // Start Survey Completion Simulation
  const handleStartSurvey = (survey: Survey, e: React.MouseEvent) => {
    e.stopPropagation()
    if (survey.completed) {
      showToast("Bạn đã làm khảo sát này rồi!", "info")
      return
    }

    // Open external URL in a mock tab
    window.open("https://docs.google.com/forms", "_blank")
    showToast(`Đã mở khảo sát: ${survey.title} ở tab mới!`, "info")

    setActiveSurveyForModal(survey)
    setEnteredCode("")
    setCodeError("")
    setCountdown(5)
    setSurveyInProgress(true)
  }

  // Count down simulation
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (surveyInProgress && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    }
    return () => clearTimeout(timer)
  }, [surveyInProgress, countdown])

  // Submit completion code logic
  const handleSubmitCompletionCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeSurveyForModal) return

    if (countdown > 0) {
      setCodeError("Bạn cần hoàn thành tối thiểu khảo sát trước khi gửi mã xác nhận!")
      return
    }

    setIsSubmittingCode(true)
    setCodeError("")

    // Artificial network delay
    await new Promise((resolve) => setTimeout(resolve, 1200))

    if (enteredCode.trim().toUpperCase() !== activeSurveyForModal.completionCode) {
      setCodeError("Mã xác minh không hợp lệ. Vui lòng kiểm tra lại cuối form của bạn.")
      setIsSubmittingCode(false)
      return
    }

    // Capture coordinates for floating point animation
    const rect = document.getElementById(`survey-card-${activeSurveyForModal.id}`)?.getBoundingClientRect()
    if (rect) {
      setFloatingReward({
        amount: activeSurveyForModal.pointBounty,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      })
    }

    // Update survey completion
    setSurveys((prev) =>
      prev.map((s) => (s.id === activeSurveyForModal.id ? { ...s, completed: true, currentResponses: s.currentResponses + 1 } : s))
    )

    // Update balances & rewards
    const reward = activeSurveyForModal.pointBounty
    const nextBalance = balance + reward
    const nextCompleted = completedCount + 1

    setBalance(nextBalance)
    setCompletedCount(nextCompleted)
    setWeeklyPoints((prev) => prev + reward)

    localStorage.setItem("rescom_balance", nextBalance.toString())
    localStorage.setItem("rescom_completed", nextCompleted.toString())

    // Update notification list
    const newNotif: RescomNotification = {
      id: Date.now().toString(),
      type: "points_received",
      title: `Nhận +${reward}đ thành công`,
      description: `Đã hoàn thành khảo sát "${activeSurveyForModal.title.substring(0, 30)}..."`,
      timeAgo: "Vừa xong",
      unread: true
    }
    setNotifications((prev) => [newNotif, ...prev])

    showToast(`🎉 Thành công! Nhận +${reward}đ vào ví điểm!`, "success")

    // Check Frozen Credit progress (conditional logic)
    if (showFrozenBanner && frozenCount < 3) {
      const nextFrozen = frozenCount + 1
      setFrozenCount(nextFrozen)
      localStorage.setItem("rescom_frozen_count", nextFrozen.toString())

      if (nextFrozen === 3) {
        // Unlock 50đ bonus!
        const finalBalance = nextBalance + 50
        setBalance(finalBalance)
        setLockedBalance((prev) => prev - 50)
        localStorage.setItem("rescom_balance", finalBalance.toString())

        // Celebration Alert
        setTimeout(() => {
          showToast("🎉 Chúc mừng! Đã hoàn thành 3/3 khảo sát, mở khóa 50đ ký quỹ!", "success")
        }, 1500)

        const bonusNotif: RescomNotification = {
          id: `bonus-${Date.now()}`,
          type: "frozen_unlocked",
          title: "Mở khóa frozen credit +50đ!",
          description: "Chúc mừng bạn đã hoàn thành nhiệm vụ và mở khóa 50đ thành công.",
          timeAgo: "Vừa xong",
          unread: true
        }
        setNotifications((prev) => [bonusNotif, ...prev])
      }
    }

    // Clean up
    setIsSubmittingCode(false)
    setSurveyInProgress(false)
    setActiveSurveyForModal(null)

    // Fade out reward coordinates
    setTimeout(() => {
      setFloatingReward(null)
    }, 1500)
  }

  // Dismiss Frozen Banner
  const handleDismissFrozenBanner = () => {
    setShowFrozenBanner(false)
    localStorage.setItem("rescom_frozen_dismissed", "true")
  }

  // Clear all filters
  const handleClearFilters = () => {
    setActiveFilter("Tất cả")
    setSearchQuery("")
    setSelectedMajors([])
    setSelectedUniversities([])
    setAgeRange([16, 30])
    setBountyRange(5)
    setSelectedDuration("")
    setSelectedDeadline("")
  }

  // Mark all notifications as read
  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
    showToast("Đã đánh dấu đọc tất cả thông báo", "info")
  }

  // Submit new survey from FAB Modal
  const handleCreateSurvey = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSurveyTitle || !newSurveyUrl || !newSurveyCode) {
      showToast("Vui lòng điền đầy đủ thông tin bắt buộc!", "info")
      return
    }

    const totalCost = newSurveyBounty * newSurveyTarget
    if (balance < totalCost) {
      showToast(`Không đủ số dư! Cần ${totalCost}đ nhưng bạn chỉ có ${balance}đ.`, "info")
      return
    }

    // Subtract balance
    const nextBalance = balance - totalCost
    setBalance(nextBalance)
    setLockedBalance((prev) => prev + totalCost)
    localStorage.setItem("rescom_balance", nextBalance.toString())

    // Add new survey
    const newSurvey: Survey = {
      id: Date.now().toString(),
      title: newSurveyTitle,
      description: "Khảo sát mới tạo bởi bạn. Phù hợp cho đối tượng sinh viên đã được thiết lập sẵn.",
      tags: ["Khảo sát của tôi", "Mới đăng"],
      pointBounty: newSurveyBounty,
      estimatedTime: 5,
      targetResponses: newSurveyTarget,
      currentResponses: 0,
      matchScore: 100, // your own survey matches you
      createdHoursAgo: 0,
      deadlineDays: 7,
      completed: false,
      topic: newSurveyTopic,
      completionCode: newSurveyCode.toUpperCase(),
      universityTarget: "Tất cả",
      majorTarget: "Tất cả"
    }

    setSurveys((prev) => [newSurvey, ...prev])
    setShowFABModal(false)

    // Reset fields
    setNewSurveyTitle("")
    setNewSurveyUrl("")
    setNewSurveyCode("")
    setNewSurveyBounty(25)
    setNewSurveyTarget(50)

    showToast("🚀 Đăng khảo sát thành công! Hệ thống đã ký quỹ an toàn.", "success")
  }

  // Icon mapping for Visual Card Hero
  const getTopicIcon = (topic: Survey["topic"]) => {
    const baseClass = "w-16 h-16 stroke-[1.5]"
    switch (topic) {
      case "shopping":
        return <ShoppingCart className={`${baseClass} text-amber-600`} />
      case "ai":
        return <Cpu className={`${baseClass} text-cyan-600`} />
      case "health":
        return <HeartPulse className={`${baseClass} text-red-600`} />
      case "finance":
        return <Wallet className={`${baseClass} text-emerald-600`} />
      case "food":
        return <Bike className={`${baseClass} text-orange-600`} />
      case "english":
        return <BookOpen className={`${baseClass} text-blue-600`} />
      case "gaming":
        return <Gamepad2 className={`${baseClass} text-indigo-600`} />
      case "library":
        return <Landmark className={`${baseClass} text-yellow-700`} />
      case "social":
      default:
        return <Share2 className={`${baseClass} text-pink-600`} />
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F1] text-[#1A1A1A] font-sans antialiased overflow-x-clip relative select-none">

      {/* 15. Skip-to-content accessibility link */}
      <a
        href="#survey-grid-region"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[999] focus:bg-[#3db87a] focus:text-white focus:px-5 focus:py-3 focus:rounded-full focus:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-200"
      >
        Bỏ qua, đến danh sách khảo sát
      </a>

      {/* Styled webkit scrollbar injection */}
      <style>{`
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #C7D2C9;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #3db87a;
        }
        @keyframes float-points {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-120px) scale(1.4);
            opacity: 0;
          }
        }
        .animate-float-points {
          animation: float-points 1.5s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards;
        }
      `}</style>

      {/* Custom Floating Reward Animation */}
      {floatingReward && (
        <div
          className="fixed z-[9999] pointer-events-none font-bold text-3xl text-green-600 drop-shadow-lg flex items-center gap-1.5 animate-float-points"
          style={{ left: floatingReward.x - 20, top: floatingReward.y - 20 }}
        >
          <Award className="w-8 h-8 text-green-600 fill-green-100" />
          <span>+{floatingReward.amount}đ</span>
        </div>
      )}

      {/* Global Toast Panel */}
      <div className="fixed top-6 right-6 z-[99999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="p-4 rounded-2xl shadow-xl bg-white border border-[#E5E7EB] pointer-events-auto transition-all duration-300 flex items-start gap-3 animate-slide-in"
          >
            <div className="w-8 h-8 rounded-full bg-[#E8F3EC] flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4 text-[#3db87a]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#1A1A1A]">{toast.text}</p>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="text-[#6B7280] hover:text-[#1A1A1A] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* 2. LEFT SIDEBAR (Desktop / Collapsed Tablet) */}
      <aside
        className={`fixed left-0 top-0 h-screen z-50 bg-white border-r border-gray-100 shadow-sm flex flex-col transition-all duration-300 w-[256px] ${isSidebarMobileOpen ? "translate-x-0" : "max-md:-translate-x-full"}`}
      >
        <div className="flex flex-col h-full">

          {/* Top Logo */}
          <div className="px-6 pt-6 pb-3">
            <img
              src="/rescom-logo.png"
              alt="Rescom"
              className="w-[130px] h-auto object-contain"
            />
          </div>

          {/* Navigation stack */}
          <nav className="px-4 space-y-1" aria-label="Menu chính">
            <button
              onClick={() => {
                setIsSidebarMobileOpen(false)
                showToast("Đang ở màn hình Khám Phá", "success")
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 bg-[#3db87a] text-white shadow-md shadow-green-200 hover:bg-[#36a86f] active:scale-95"
            >
              <Compass className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1 text-left">Khám Phá</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            {[
              { label: "Đăng Khảo Sát", icon: <PlusCircle className="w-5 h-5 flex-shrink-0" />, action: () => setShowFABModal(true) },
              { label: "Tạo Khảo Sát", icon: <FileText className="w-5 h-5 flex-shrink-0" />, href: "/survey-builder" },
              { label: "Ví Điểm", icon: <Wallet className="w-5 h-5 flex-shrink-0" /> }
            ].map((item) => (
              item.href ? (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsSidebarMobileOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-gray-700 hover:text-[#3db87a] hover:bg-green-50 transition-all duration-200 active:scale-95"
                >
                  {item.icon}
                  <span className="text-left">{item.label}</span>
                </Link>
              ) : (
                <button
                  key={item.label}
                  onClick={() => {
                    setIsSidebarMobileOpen(false)
                    if (item.action) item.action()
                    else showToast(`Mở tính năng: ${item.label}`, "info")
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-gray-700 hover:text-[#3db87a] hover:bg-green-50 transition-all duration-200 active:scale-95"
                >
                  {item.icon}
                  <span className="text-left">{item.label}</span>
                </button>
              )
            ))}
          </nav>

          {/* Mascot section */}
          <div className="flex-1 px-4 mt-3 min-h-0">
            <div className="w-full h-full relative overflow-hidden rounded-2xl flex flex-col" style={{ minHeight: "160px" }}>
              {/* Mascot */}
              <div className="flex-1 flex justify-center items-end relative z-10 pt-4">
                <img
                  src="/Artboard 1.png"
                  alt="Mascot"
                  style={{ width: 148, height: 148, objectFit: "contain", marginBottom: "20px", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))" }}
                  className="animate-bounce"
                />
              </div>
              {/* Green hills */}
              <div className="absolute bottom-0 left-0 right-0">
                <img
                  src="/background-mascot.png"
                  alt="Background"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>

          {/* Bottom user profile & settings */}
          <div className="border-t border-gray-100 px-4 pt-3 pb-4 space-y-1 mt-3">
            <button
              onClick={() => showToast("Mở trang cá nhân", "info")}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-gray-50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full border-2 border-gray-200 overflow-hidden flex-shrink-0 bg-green-50">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=nguyen"
                  alt="Avatar người dùng"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">Nguyễn Văn A</p>
                <p className="text-xs text-gray-500 truncate">Sinh viên CNTT</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
            </button>
            <button
              onClick={() => showToast("Mở cài đặt tài khoản", "info")}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">Cài đặt tài khoản</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Hamburger Overlay backdrop for Mobile Drawer */}
      {isSidebarMobileOpen && (
        <div
          onClick={() => setIsSidebarMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
        ></div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="transition-all duration-300 md:ml-[256px] min-h-screen flex flex-col">

        {/* Mobile Header Bar (<768px sticky) */}
        <header className="sticky top-0 z-40 bg-[#FEFCF7] border-b border-[#E5E7EB] md:hidden">
          {/* Row 1: Nav + Logo | Actions */}
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarMobileOpen(true)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-[#3db87a] focus:outline-none"
                aria-label="Mở menu điều hướng"
              >
                <SlidersHorizontal className="w-6 h-6 rotate-90" />
              </button>
              <img src="/rescom-logo.png" alt="Rescom" className="h-7 w-auto object-contain" />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full hover:bg-gray-100 text-[#1A1A1A] focus:outline-none"
                aria-label="Thông báo"
              >
                <Bell className="w-5.5 h-5.5" />
                {notifications.some((n) => n.unread) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#DC2626] rounded-full border border-white animate-ping"></span>
                )}
              </button>
              <div className="w-8 h-8 rounded-full border border-green-200 overflow-hidden bg-green-50">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=nguyen"
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          {/* Row 2: Compact stats toggle */}
          <button
            onClick={() => setIsStatsBarCollapsed(prev => !prev)}
            className="w-full flex items-center justify-between px-4 py-2 border-t border-[#E5E7EB]/60 hover:bg-gray-50/80 transition-colors"
            aria-expanded={!isStatsBarCollapsed}
            aria-label={isStatsBarCollapsed ? "Mở rộng thống kê" : "Thu gọn thống kê"}
          >
            <div className="flex items-center gap-2 text-xs font-semibold">
              <Wallet className="w-3.5 h-3.5 text-[#3db87a]" />
              <span className="text-[#1A1A1A]">{balance.toLocaleString("vi-VN")}đ</span>
              <span className="text-[#D1D5DB] mx-0.5">•</span>
              <CheckCircle className="w-3.5 h-3.5 text-green-600" />
              <span className="text-[#6B7280]">{completedCount} KS</span>
              <span className="text-[#D1D5DB] mx-0.5">•</span>
              <TrendingUp className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span className="text-green-600">+{weeklyPoints}đ</span>
            </div>
            <ChevronRight className={`w-4 h-4 text-[#3db87a] transition-transform duration-300 ${isStatsBarCollapsed ? "" : "rotate-90"}`} />
          </button>
        </header>

        {/* 3. STICKY HEADER REGION (Solid Solid Background) */}
        <div
          className={`sticky md:top-0 top-[88px] z-30 bg-[#FAF8F1] transition-all duration-200 ${scrolled ? "shadow-md border-b border-[#E5E7EB]/50" : "shadow-none"
            }`}
          style={{ willChange: "transform" }}
        >
          {/* Wrapper with padding */}
          <div className="px-4 py-4 md:px-8 md:py-6 space-y-4">

            {/* 3A. STATS BAR CARD */}
            <div className={`${isStatsBarCollapsed ? "hidden md:block" : ""} bg-white rounded-2xl shadow-sm border border-[#E5E7EB]`}>
              <div className="flex flex-col md:flex-row items-stretch justify-between p-4 md:p-5">
                <div className="flex flex-col sm:flex-row flex-1 divide-y sm:divide-y-0 sm:divide-x divide-[#E5E7EB]">

                  {/* Stats Block 1 - Ví điểm */}
                  <div className="flex items-center gap-4 py-2 sm:py-0 sm:px-5 first:pl-0 flex-1">
                    <div className="rounded-xl bg-[#E8F3EC] flex items-center justify-center flex-shrink-0 w-12 h-12">
                      <Wallet className="text-[#3db87a] w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[11px] text-[#6B7280] font-bold uppercase tracking-wider">Ví điểm:</p>
                      <div className="flex items-baseline gap-1">
                        <span className="font-bold tabular-nums text-[#1A1A1A] text-2xl">
                          {balance.toLocaleString("vi-VN")}
                        </span>
                        <span className="text-xs font-semibold text-[#6B7280]">đ</span>
                      </div>
                      <p className="text-xs text-[#3db87a] font-semibold overflow-hidden h-4 mt-0.5">
                        {lockedBalance.toLocaleString("vi-VN")} đ ký quỹ
                      </p>
                    </div>
                  </div>

                  {/* Stats Block 2 - Hoàn thành */}
                  <div className="flex items-center gap-4 py-2 sm:py-0 sm:px-5 flex-1">
                    <div className="rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0 w-12 h-12">
                      <CheckCircle className="text-green-600 w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[11px] text-[#6B7280] font-bold uppercase tracking-wider">Hoàn thành:</p>
                      <div className="flex items-baseline gap-1">
                        <span className="font-bold tabular-nums text-[#1A1A1A] text-2xl">
                          {completedCount}
                        </span>
                        <span className="text-xs font-semibold text-[#6B7280]">khảo sát</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats Block 3 - Tuần này */}
                  <div className="flex items-center gap-4 py-2 sm:py-0 sm:px-5 flex-1">
                    <div className="rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0 w-12 h-12">
                      <TrendingUp className="text-[#F59E0B] w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[11px] text-[#6B7280] font-bold uppercase tracking-wider">Tuần này:</p>
                      <div className="flex items-baseline gap-1">
                        <span className="font-bold tabular-nums text-green-600 text-2xl">
                          +{weeklyPoints}
                        </span>
                        <span className="text-xs font-semibold text-green-600">đ</span>
                      </div>
                      <p className="text-xs text-[#6B7280] font-semibold overflow-hidden h-4 mt-0.5">
                        đã tích lũy
                      </p>
                    </div>
                  </div>

                </div>

                {/* Far right - profile bell indicator for desktop only */}
                <div className="hidden md:flex items-center gap-4 pl-5 border-l border-[#E5E7EB]">
                  <div className="relative z-[9999]" ref={notificationRef}>
                    <button
                      ref={bellDesktopRef}
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="relative p-2.5 rounded-xl border border-[#E5E7EB] hover:bg-[#E8F3EC] text-[#1A1A1A] hover:text-[#3db87a] transition-all focus:ring-2 focus:ring-[#3db87a]"
                      aria-haspopup="true"
                      aria-expanded={showNotifications}
                      aria-label="Thông báo"
                    >
                      <Bell className="w-5.5 h-5.5" />
                      {notifications.some((n) => n.unread) && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#DC2626] rounded-full border border-white animate-pulse"></span>
                      )}
                    </button>

                    {/* 7. NOTIFICATION PANEL DROPDOWN */}
                    {showNotifications && (
                      <div
                        className="fixed w-80 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl z-[9999] overflow-hidden animate-fade-in"
                        style={{
                          top: bellDesktopRef.current
                            ? bellDesktopRef.current.getBoundingClientRect().bottom + 12
                            : 100,
                          right: bellDesktopRef.current
                            ? window.innerWidth - bellDesktopRef.current.getBoundingClientRect().right
                            : 24,
                        }}
                      >
                        <div className="p-4 bg-[#FEFCF7] border-b border-[#E5E7EB] flex items-center justify-between">
                          <span className="font-bold text-sm text-[#1A1A1A]">Thông báo</span>
                          <button
                            onClick={handleMarkAllNotificationsRead}
                            className="text-xs font-semibold text-[#3db87a] hover:underline"
                          >
                            Đánh dấu đã đọc tất cả
                          </button>
                        </div>

                        <div className="max-h-[300px] overflow-y-auto divide-y divide-[#E5E7EB]">
                          {notifications.length === 0 ? (
                            <div className="p-8 text-center text-xs text-[#6B7280]">Chưa có thông báo nào</div>
                          ) : (
                            notifications.map((notif) => (
                              <div
                                key={notif.id}
                                className={`p-3.5 flex items-start gap-3 hover:bg-[#FAF8F1] transition-colors ${notif.unread ? "bg-[#E8F3EC]/30" : ""
                                  }`}
                              >
                                <div className="mt-0.5 w-2.5 h-2.5 flex-shrink-0 rounded-full flex items-center justify-center">
                                  {notif.unread && <span className="w-2 h-2 bg-[#3db87a] rounded-full"></span>}
                                </div>
                                <div className="flex-1 space-y-0.5">
                                  <p className="text-xs font-bold text-[#1A1A1A]">{notif.title}</p>
                                  <p className="text-[11px] text-[#6B7280] leading-snug">{notif.description}</p>
                                  <p className="text-[9px] text-[#6B7280] font-medium pt-1">{notif.timeAgo}</p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        <div className="p-3 bg-[#FEFCF7] border-t border-[#E5E7EB] text-center">
                          <button
                            onClick={() => {
                              showToast("Chuyển tới tất cả thông báo", "info")
                              setShowNotifications(false)
                            }}
                            className="text-xs font-bold text-[#3db87a] hover:underline"
                          >
                            Xem tất cả thông báo
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* 3B. FROZEN CREDIT BANNER (CONDITIONAL) */}
            {showFrozenBanner && frozenCount < 3 && (
              <div className="bg-[#FEF3C7] border border-[#FCD34D] rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 animate-bounce-subtle">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F59E0B]/20 flex items-center justify-center flex-shrink-0 text-[#D97706]">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-[#92400E]">
                      Nhiệm vụ: Hoàn thành {frozenCount}/3 khảo sát để mở khóa 50đ ký quỹ!
                    </p>
                    {/* Progress Bar */}
                    <div className="flex items-center gap-2">
                      <div className="w-36 h-2 rounded-full bg-white/70 overflow-hidden border border-[#FCD34D]">
                        <div
                          className="h-full bg-[#D97706] rounded-full transition-all duration-500"
                          style={{ width: `${(frozenCount / 3) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-[11px] font-bold text-[#92400E]">{frozenCount}/3</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 self-end sm:self-center">
                  <button
                    onClick={() => {
                      // complete simulation quickly
                      const next = Math.min(3, frozenCount + 1)
                      setFrozenCount(next)
                      localStorage.setItem("rescom_frozen_count", next.toString())
                      if (next === 3) {
                        const finalBalance = balance + 50
                        setBalance(finalBalance)
                        setLockedBalance((prev) => prev - 50)
                        localStorage.setItem("rescom_balance", finalBalance.toString())
                        showToast("🎉 Chúc mừng! Đã mở khóa 50đ thành công!", "success")
                      } else {
                        showToast("Đã tiến thêm 1 bước tới mở khóa phần thưởng!", "success")
                      }
                    }}
                    className="px-3 py-1.5 text-[11px] font-bold bg-[#D97706] text-white rounded-full hover:bg-[#B45309] transition-colors"
                  >
                    Làm khảo sát
                  </button>
                  <button
                    onClick={handleDismissFrozenBanner}
                    className="p-1 rounded-full text-[#92400E] hover:bg-[#FCD34D] transition-colors"
                    aria-label="Đóng biểu ngữ"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Celebrate Toast Banner after Frozen unlocked */}
            {frozenCount === 3 && showFrozenBanner && (
              <div className="bg-[#D1FAE5] border border-[#6EE7B7] rounded-2xl p-4 flex items-center justify-between animate-confetti-pop">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#10B981]/20 flex items-center justify-center text-[#059669]">
                    <Unlock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#065F46]">🎉 Đã mở khóa 50đ thành công!</p>
                    <p className="text-[11px] text-[#047857]">Tiền thưởng ký quỹ đã được cộng vào số dư của bạn.</p>
                  </div>
                </div>
                <button
                  onClick={handleDismissFrozenBanner}
                  className="p-1 rounded-full text-[#065F46] hover:bg-[#6EE7B7] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Filter toggle - mobile only */}
            <button
              onClick={() => setIsFiltersCollapsed(prev => !prev)}
              className="md:hidden w-full flex items-center justify-between py-2 px-0"
              aria-expanded={!isFiltersCollapsed}
              aria-label={isFiltersCollapsed ? "Mở rộng tìm kiếm & bộ lọc" : "Thu gọn tìm kiếm & bộ lọc"}
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-[#3db87a]">
                <Search className="w-4 h-4" />
                <span>Tìm kiếm & Bộ lọc</span>
                {activeFilterCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-[#3db87a] text-white text-[10px] font-bold">{activeFilterCount}</span>
                )}
                {debouncedSearch && (
                  <span className="px-2 py-0.5 rounded-full bg-[#E8F3EC] text-[#3db87a] text-[10px] font-bold">Đang tìm</span>
                )}
              </div>
              <ChevronRight className={`w-4 h-4 text-[#3db87a] transition-transform duration-300 ${isFiltersCollapsed ? "" : "rotate-90"}`} />
            </button>
            {/* 3C + 3D collapsible - always shown on desktop */}
            <div className={`${isFiltersCollapsed ? "max-h-0" : "max-h-screen"} md:max-h-screen overflow-hidden transition-[max-height] duration-300 ease-in-out space-y-3`}>
              {/* 3C. SECTION HEADER + SEARCH + SORT */}
              <div className="space-y-3">

                {/* Row 2 */}
                <div className="flex flex-col sm:flex-row gap-3">

                  {/* Search Input wrapper */}
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm khảo sát theo tên, chủ đề, nhãn..."
                      className="w-full h-11 pl-12 pr-10 text-sm bg-white border border-[#E5E7EB] rounded-full focus:outline-none focus:border-[#3db87a] focus:ring-4 focus:ring-green-100 transition-all font-medium text-[#1A1A1A]"
                      aria-label="Tìm kiếm khảo sát"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#1A1A1A]"
                        aria-label="Xóa văn bản tìm kiếm"
                      >
                        <X className="w-4.5 h-4.5" />
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setShowAdvancedFilters(true)}
                      className={`flex items-center gap-2 px-4 h-11 rounded-full text-xs font-bold transition-all hover:shadow-md ${activeFilterCount > 0
                        ? "bg-[#3db87a] text-white"
                        : "bg-[#E8F3EC] text-[#3db87a] hover:bg-[#C7D2C9]"
                        }`}
                      aria-label="Mở bộ lọc nâng cao"
                    >
                      <SlidersHorizontal className="w-4 h-4" />
                      <span>Bộ lọc {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
                    </button>
                  </div>
                  {/* Sort Dropdown */}
                  <div className="relative" ref={sortDropdownRef}>
                    <button
                      onClick={() => setShowSortDropdown(!showSortDropdown)}
                      className="w-full sm:w-[200px] h-11 px-4 rounded-full bg-[#E8F3EC] hover:bg-[#C7D2C9]/60 text-[#3db87a] text-xs font-bold flex items-center justify-between border border-[#3db87a]/10 focus:ring-2 focus:ring-[#3db87a] transition-all"
                      aria-label="Sắp xếp khảo sát"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <ArrowUpDown className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">Sắp xếp: {sortOption}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 rotate-90 flex-shrink-0" />
                    </button>

                    {showSortDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl z-50 overflow-hidden py-1 animate-fade-in">
                        {[
                          "Mới nhất",
                          "Deadline gần nhất",
                          "Thưởng cao nhất",
                          "Thời gian ngắn nhất",
                          "Độ phù hợp cao nhất",
                          "Còn ít suất nhất"
                        ].map((option) => (
                          <button
                            key={option}
                            onClick={() => {
                              setSortOption(option)
                              setShowSortDropdown(false)
                              showToast(`Đã sắp xếp theo: ${option}`, "info")
                            }}
                            className={`w-full px-4 py-2.5 text-xs text-left font-medium transition-colors hover:bg-[#FAF8F1] ${sortOption === option ? "text-[#3db87a] bg-[#E8F3EC]/50 font-bold" : "text-[#1A1A1A]"
                              }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

                {/* Match response count indicator */}
                <div className="flex items-center justify-between text-xs text-[#6B7280] px-1">
                  <span aria-live="polite">
                    Tìm thấy <strong className="text-[#1A1A1A] font-bold">{sortedSurveys.length}</strong> khảo sát phù hợp
                  </span>

                  {/* Ẩn khảo sát đã làm Checkbox */}
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-[#3db87a]">
                    <input
                      type="checkbox"
                      checked={hideCompleted}
                      onChange={(e) => setHideCompleted(e.target.checked)}
                      className="rounded border-[#E5E7EB] text-[#3db87a] focus:ring-[#3db87a] w-4 h-4 cursor-pointer"
                    />
                    <span>Ẩn khảo sát đã làm</span>
                  </label>
                </div>

              </div>

              {/* 3D. FILTER PILLS ROW */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none border-b border-[#E5E7EB]/50 pt-1">
                {[
                  { id: "Tất cả", label: "Tất cả", icon: null },
                  { id: "Phù hợp", label: "Phù hợp", icon: <Sparkles className="w-3.5 h-3.5" /> },
                  { id: "Thưởng cao", label: "Thưởng cực cao", icon: <TrendingUp className="w-3.5 h-3.5" /> },
                  { id: "Nhanh", label: "Làm siêu nhanh", icon: <Clock className="w-3.5 h-3.5" /> }
                ].map((pill) => (
                  <button
                    key={pill.id}
                    onClick={() => {
                      startTransition(() => {
                        setActiveFilter(pill.id as any)
                      })
                    }}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all active:scale-95 border ${activeFilter === pill.id
                      ? "bg-[#3db87a] text-white border-[#3db87a] shadow-sm"
                      : "bg-[#E8F3EC] text-[#3db87a] border-[#3db87a]/10 hover:bg-[#C7D2C9]/60"
                      }`}
                  >
                    {pill.icon}
                    <span>{pill.label}</span>
                  </button>
                ))}
              </div>

            </div>{/* /collapsible 3C+3D */}
          </div>
        </div>

        {/* 5. SURVEY CARDS GRID (SCROLLABLE REGION) */}
        <section
          id="survey-grid-region"
          className="flex-1 px-4 py-6 md:px-8 md:py-8"
          aria-live="polite"
        >
          {sortedSurveys.length === 0 ? (

            /* 6. EMPTY STATES */
            <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-white rounded-3xl border border-[#E5E7EB] shadow-sm max-w-xl mx-auto space-y-6">
              <div className="w-24 h-24 rounded-full bg-[#FAF8F1] flex items-center justify-center text-[#3db87a]">
                <BookOpen className="w-12 h-12 stroke-[1.2]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[#1A1A1A]">Không tìm thấy khảo sát phù hợp</h3>
                <p className="text-xs text-[#6B7280] max-w-sm">
                  Thử thay đổi từ khóa tìm kiếm hoặc đặt lại các bộ lọc nâng cao để tiếp tục xem danh sách.
                </p>
              </div>
              <button
                onClick={handleClearFilters}
                className="px-6 py-2.5 rounded-full bg-[#3db87a] text-white text-xs font-bold hover:bg-[#13422C] transition-all"
              >
                Xem tất cả khảo sát
              </button>
            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedSurveys.map((survey) => {
                const isNew = survey.createdHoursAgo <= 48
                const spotsLeft = survey.targetResponses - survey.currentResponses
                const progressPercent = Math.round((survey.currentResponses / survey.targetResponses) * 100)

                // Color tiers for match score badge
                let matchBadgeStyle = ""
                if (survey.matchScore >= 90) {
                  matchBadgeStyle = "bg-[#3db87a] text-white"
                } else if (survey.matchScore >= 70) {
                  matchBadgeStyle = "bg-[#3db87a] text-white"
                } else if (survey.matchScore >= 50) {
                  matchBadgeStyle = "bg-[#E8F3EC] text-[#3db87a]"
                }

                // Deadline Color Logic
                let deadlineStyle = "text-[#6B7280]"
                let deadlineUrgent = false
                if (survey.deadlineDays < 1) {
                  deadlineStyle = "text-[#DC2626] font-bold animate-pulse"
                  deadlineUrgent = true
                } else if (survey.deadlineDays < 3) {
                  deadlineStyle = "text-[#DC2626] font-bold"
                } else if (survey.deadlineDays <= 7) {
                  deadlineStyle = "text-[#F59E0B] font-semibold"
                }

                return (
                  <article
                    key={survey.id}
                    id={`survey-card-${survey.id}`}
                    onClick={(e) => !survey.completed && handleStartSurvey(survey, e)}
                    className="group relative flex flex-col bg-white rounded-2xl border border-[#E5E7EB] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer"
                    aria-label={`Khảo sát: ${survey.title}. Phần thưởng: ${survey.pointBounty}đ`}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        if (!survey.completed) handleStartSurvey(survey, e as any)
                      }
                    }}
                  >

                    {/* TOP HALF — Visual hero */}
                    <div className="h-44 bg-[#F5EFE0] relative flex items-center justify-center p-6 border-b border-[#E5E7EB] transition-colors group-hover:bg-[#efe8d9]">

                      {/* Match score badge (50%+) */}
                      {survey.matchScore >= 50 && (
                        <div
                          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm ${matchBadgeStyle}`}
                          title="Phù hợp dựa trên ngành học, độ tuổi và sở thích của bạn"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Phù hợp {survey.matchScore}%</span>
                        </div>
                      )}

                      {/* "Mới" Ribbon (<48h) */}
                      {isNew && (
                        <div className="absolute top-0 right-0 bg-[#3db87a] text-white text-[9px] font-extrabold px-3 py-1 rounded-bl-xl uppercase tracking-wider shadow-sm z-10">
                          Mới
                        </div>
                      )}

                      {/* Center Topic Illustration */}
                      <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-md transform group-hover:scale-105 transition-transform duration-300 relative">
                        {getTopicIcon(survey.topic)}
                        {/* Semi-transparent reward overlay */}
                        <div className="absolute -bottom-1 -right-1 bg-[#FEFCF7]/95 border border-[#E5E7EB] px-2 py-0.5 rounded-md text-[10px] font-bold text-[#3db87a] shadow-sm">
                          +{survey.pointBounty}đ
                        </div>
                      </div>

                    </div>

                    {/* BOTTOM HALF — Info section */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">

                        {/* Header title + bounty pill */}
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="font-bold text-sm text-[#1A1A1A] line-clamp-2 leading-snug flex-1">
                            {highlightText(survey.title, searchQuery)}
                          </h4>
                          <span className="px-2.5 py-1 rounded-md bg-[#E8F3EC] text-[#3db87a] text-xs font-bold flex-shrink-0">
                            +{survey.pointBounty}đ
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-[#6B7280] line-clamp-2 leading-relaxed">
                          {highlightText(survey.description, searchQuery)}
                        </p>

                        {/* Tag Chips */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {survey.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2.5 py-0.5 bg-[#E8F3EC]/70 text-[#3db87a] text-[10px] font-bold rounded-full border border-[#3db87a]/5"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Progress and Meta Row */}
                      <div className="space-y-3.5 pt-2 border-t border-[#FAF8F1]">

                        {/* Meta metrics */}
                        <div className="flex items-center justify-between text-[11px] text-[#6B7280] font-semibold">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#6B7280]" />
                            <span>~{survey.estimatedTime} phút</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-[#6B7280]" />
                            <span>Còn {spotsLeft} suất</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                            <span className={deadlineStyle}>
                              {survey.deadlineDays < 1
                                ? `Hết hạn sau ${Math.round(survey.deadlineDays * 24)}h`
                                : `Còn ${Math.round(survey.deadlineDays)} ngày`}
                            </span>
                          </div>
                        </div>

                        {/* Progress slider bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-[#6B7280]">Tiến độ thu thập</span>
                            <span className="text-[#1A1A1A]">{progressPercent}%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden border border-[#E5E7EB]/40">
                            <div
                              className="h-full bg-[#3db87a] rounded-full transition-all duration-700 ease-out"
                              style={{ width: `${progressPercent}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Call to action button */}
                        <button
                          className="w-full h-10 rounded-full bg-[#3db87a] hover:bg-[#13422C] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm focus:ring-2 focus:ring-green-700"
                          aria-label={`Bắt đầu làm bài khảo sát ${survey.title}`}
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Bắt đầu làm</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>

                    {/* COMPLETED CARD STATE OVERLAY */}
                    {survey.completed && (
                      <div className="absolute inset-0 bg-white/75 backdrop-blur-[1px] flex flex-col items-center justify-center p-6 text-center z-10 transition-all">
                        <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center text-green-600 mb-3 shadow-md border border-green-200 animate-scale-in">
                          <Check className="w-8 h-8 stroke-[3]" />
                        </div>
                        <h5 className="font-bold text-sm text-[#1A1A1A]">Đã hoàn thành khảo sát</h5>
                        <p className="text-xs text-[#6B7280] mb-5 max-w-[200px]">Phần thưởng điểm đã được cộng vào ví của bạn.</p>

                        <button
                          disabled
                          className="w-44 h-9 rounded-full bg-green-100 text-[#3db87a] text-xs font-bold cursor-not-allowed border border-[#3db87a]/10 flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Đã nhận thưởng</span>
                        </button>
                      </div>
                    )}

                  </article>
                )
              })}
            </div>
          )}
        </section>

      </main>

      {/* 8. FLOATING ACTION BUTTON (FAB) */}
      <div className="fixed bottom-6 right-6 z-40 group">
        <button
          onClick={() => setShowFABModal(true)}
          className="w-14 h-14 rounded-full bg-[#3db87a] hover:bg-[#13422C] text-white flex items-center justify-center shadow-lg shadow-green-900/30 hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-green-200"
          aria-label="Đăng khảo sát mới"
          title="Đăng khảo sát mới"
        >
          <Plus className="w-7 h-7 stroke-[2.5]" />
        </button>
        {/* Tooltip */}
        <div className="absolute bottom-16 right-0 bg-[#1A1A1A] text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
          Đăng khảo sát mới
        </div>
      </div>

      {/* 9. ADVANCED FILTER PANEL (Right Slide-in Drawer) */}
      {showAdvancedFilters && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Bộ lọc khảo sát nâng cao">

          {/* Backdrop */}
          <div
            onClick={() => setShowAdvancedFilters(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
          ></div>

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full animate-slide-left">

              {/* Header */}
              <div className="px-6 py-5 bg-[#FEFCF7] border-b border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#1A1A1A]">Bộ lọc nâng cao</h3>
                  <p className="text-xs text-[#6B7280]">Nhắm đúng mục tiêu khảo sát lý tưởng</p>
                </div>
                <button
                  onClick={() => setShowAdvancedFilters(false)}
                  className="p-1 rounded-full text-[#6B7280] hover:bg-[#FAF8F1] transition-colors"
                  aria-label="Đóng bảng bộ lọc"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Scrollable Filters Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* 1. Ngành Học targeted */}
                <div className="space-y-2.5">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#6B7280]">Ngành học mục tiêu</span>
                  <div className="flex flex-wrap gap-2">
                    {["CNTT", "Marketing", "Kinh tế", "Y tế", "Tâm lý học", "Xã hội học"].map((major) => {
                      const selected = selectedMajors.includes(major)
                      return (
                        <button
                          key={major}
                          onClick={() => {
                            if (selected) {
                              setSelectedMajors(selectedMajors.filter((m) => m !== major))
                            } else {
                              setSelectedMajors([...selectedMajors, major])
                            }
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${selected
                            ? "bg-[#3db87a] text-white"
                            : "bg-[#E8F3EC] text-[#3db87a] hover:bg-[#C7D2C9]/60"
                            }`}
                        >
                          {major}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* 2. Trường targeted */}
                <div className="space-y-2.5">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#6B7280]">Trường học mục tiêu</span>
                  <div className="flex flex-wrap gap-2">
                    {["ĐH CNTT", "ĐH Bách Khoa", "ĐH Ngoại thương", "ĐH KHXH&NV"].map((uni) => {
                      const selected = selectedUniversities.includes(uni)
                      return (
                        <button
                          key={uni}
                          onClick={() => {
                            if (selected) {
                              setSelectedUniversities(selectedUniversities.filter((u) => u !== uni))
                            } else {
                              setSelectedUniversities([...selectedUniversities, uni])
                            }
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${selected
                            ? "bg-[#3db87a] text-white"
                            : "bg-[#E8F3EC] text-[#3db87a] hover:bg-[#C7D2C9]/60"
                            }`}
                        >
                          {uni}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* 3. Độ tuổi Range Slider */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#6B7280]">Độ tuổi giới hạn</span>
                    <span className="text-xs font-bold text-[#3db87a]">{ageRange[0]} - {ageRange[1]} tuổi</span>
                  </div>
                  <input
                    type="range"
                    min="16"
                    max="30"
                    value={ageRange[1]}
                    onChange={(e) => setAgeRange([16, parseInt(e.target.value)])}
                    className="w-full accent-[#3db87a] bg-gray-200 h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#6B7280]">
                    <span>16 tuổi</span>
                    <span>30 tuổi</span>
                  </div>
                </div>

                {/* 4. Mức thưởng minimum */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#6B7280]">Mức thưởng tối thiểu</span>
                    <span className="text-xs font-bold text-[#3db87a]">{bountyRange}đ</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    value={bountyRange}
                    onChange={(e) => setBountyRange(parseInt(e.target.value))}
                    className="w-full accent-[#3db87a] bg-gray-200 h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#6B7280]">
                    <span>5đ</span>
                    <span>50đ</span>
                  </div>
                </div>

                {/* 5. Thời gian làm */}
                <div className="space-y-2.5">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#6B7280]">Thời gian hoàn thành</span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "<5", label: "Dưới 5 phút" },
                      { id: "5-10", label: "Từ 5 - 10 phút" },
                      { id: "10-20", label: "Từ 10 - 20 phút" },
                      { id: ">20", label: "Trên 20 phút" }
                    ].map((time) => (
                      <button
                        key={time.id}
                        onClick={() => setSelectedDuration(selectedDuration === time.id ? "" : time.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold text-center border transition-all ${selectedDuration === time.id
                          ? "bg-[#3db87a] text-white border-[#3db87a]"
                          : "bg-white text-[#1A1A1A] border-[#E5E7EB] hover:bg-[#FAF8F1]"
                          }`}
                      >
                        {time.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 6. Deadline */}
                <div className="space-y-2.5">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#6B7280]">Hạn chót còn lại</span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "1", label: "Trong 24 giờ" },
                      { id: "3", label: "Trong 3 ngày" },
                      { id: "7", label: "Trong 1 tuần" },
                      { id: "30", label: "Trong 1 tháng" }
                    ].map((deadline) => (
                      <button
                        key={deadline.id}
                        onClick={() => setSelectedDeadline(selectedDeadline === deadline.id ? "" : deadline.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold text-center border transition-all ${selectedDeadline === deadline.id
                          ? "bg-[#3db87a] text-white border-[#3db87a]"
                          : "bg-white text-[#1A1A1A] border-[#E5E7EB] hover:bg-[#FAF8F1]"
                          }`}
                      >
                        {deadline.label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="p-6 bg-[#FEFCF7] border-t border-[#E5E7EB] flex items-center justify-between gap-4">
                <button
                  onClick={() => {
                    handleClearFilters()
                    showToast("Đã xóa mọi thiết lập lọc", "info")
                  }}
                  className="text-xs font-bold text-[#DC2626] hover:underline"
                >
                  Xóa bộ lọc
                </button>
                <button
                  onClick={() => {
                    setShowAdvancedFilters(false)
                    showToast("Áp dụng bộ lọc thành công!", "success")
                  }}
                  className="flex-1 h-11 bg-[#3db87a] hover:bg-[#13422C] text-white rounded-full text-xs font-bold shadow-md shadow-green-950/20 active:scale-95 transition-all"
                >
                  Áp dụng
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* FULL SURVEY SIMULATION DIALOG / INTERACTIVE MODAL */}
      {activeSurveyForModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Xác minh khảo sát">
          <div className="bg-white rounded-3xl w-full max-w-lg border border-[#E5E7EB] shadow-2xl p-6 md:p-8 animate-scale-in relative space-y-6">

            {/* Top Close */}
            <button
              onClick={() => {
                setActiveSurveyForModal(null)
                setSurveyInProgress(false)
              }}
              className="absolute top-5 right-5 p-1 rounded-full text-[#6B7280] hover:bg-[#FAF8F1]"
              aria-label="Đóng hộp thoại"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header Title */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1 bg-[#E8F3EC] text-[#3db87a] font-bold px-3 py-1.5 rounded-full text-xs">
                <Award className="w-4 h-4" />
                <span>Hoàn thành để nhận +{activeSurveyForModal.pointBounty}đ</span>
              </div>
              <h3 className="font-bold text-lg md:text-xl text-[#1A1A1A] px-2">{activeSurveyForModal.title}</h3>
            </div>

            {/* Description Details */}
            <div className="bg-[#FAF8F1] border border-[#E5E7EB] rounded-2xl p-4 space-y-3.5">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-[#3db87a] mt-0.5 flex-shrink-0" />
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  Để đảm bảo chất lượng phản hồi, vui lòng thực hiện khảo sát nghiêm túc. Biểu mẫu chính thức đã được mở ở một tab mới trên trình duyệt của bạn.
                </p>
              </div>

              {/* Anti-cheat countdown status */}
              <div className="flex items-center justify-between text-xs border-t border-[#E5E7EB] pt-3">
                <span className="font-semibold text-[#6B7280]">Trạng thái làm bài:</span>
                {countdown > 0 ? (
                  <span className="text-[#F59E0B] font-bold flex items-center gap-1.5 animate-pulse">
                    <Clock className="w-4 h-4" />
                    Đang làm (còn {countdown} giây)
                  </span>
                ) : (
                  <span className="text-[#16A34A] font-bold flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" />
                    Đã hoàn tất thời gian tối thiểu
                  </span>
                )}
              </div>
            </div>

            {/* Input code validation form */}
            <form onSubmit={handleSubmitCompletionCode} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-[#6B7280] block">
                  Nhập mã xác minh (Xem cuối Google Form)
                </label>
                <input
                  type="text"
                  value={enteredCode}
                  onChange={(e) => {
                    setEnteredCode(e.target.value)
                    setCodeError("")
                  }}
                  placeholder="Nhập mã hoàn thành..."
                  className="w-full h-12 text-center text-lg font-bold font-mono tracking-widest uppercase border-2 border-[#E5E7EB] rounded-2xl focus:border-[#3db87a] focus:ring-4 focus:ring-green-100 outline-none transition-all"
                  maxLength={15}
                  required
                />

                {/* Visual Cheat hint helper for testing */}
                <div className="flex items-center justify-between text-[10px] text-[#6B7280] pt-1">
                  <span>Mẹo: Mã xác nhận của khảo sát này là:</span>
                  <span className="font-bold text-[#3db87a] bg-[#E8F3EC] px-2 py-0.5 rounded select-all cursor-pointer">
                    {activeSurveyForModal.completionCode}
                  </span>
                </div>
              </div>

              {codeError && (
                <p className="text-xs text-[#DC2626] font-semibold text-center animate-shake leading-snug">
                  ❌ {codeError}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setActiveSurveyForModal(null)
                    setSurveyInProgress(false)
                  }}
                  className="w-1/3 h-12 border border-[#E5E7EB] text-[#1A1A1A] hover:bg-[#FAF8F1] font-bold text-xs rounded-full transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCode || countdown > 0}
                  className={`flex-1 h-12 text-white font-bold text-xs rounded-full transition-all shadow-md flex items-center justify-center gap-2 ${countdown > 0
                    ? "bg-gray-300 cursor-not-allowed shadow-none"
                    : "bg-[#3db87a] hover:bg-[#13422C] shadow-green-950/20 active:scale-95"
                    }`}
                >
                  {isSubmittingCode ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang xác nhận...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Xác nhận hoàn thành</span>
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* FAB MODAL - CREATE NEW SURVEY (PUB WIZARD MOCK) */}
      {showFABModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Tạo khảo sát mới">
          <div className="bg-white rounded-3xl w-full max-w-xl border border-[#E5E7EB] shadow-2xl p-6 md:p-8 animate-scale-in relative space-y-6 max-h-[90vh] overflow-y-auto">

            {/* Top Close */}
            <button
              onClick={() => setShowFABModal(false)}
              className="absolute top-5 right-5 p-1 rounded-full text-[#6B7280] hover:bg-[#FAF8F1]"
              aria-label="Đóng hộp thoại"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Title */}
            <div className="space-y-1.5 border-b border-[#E5E7EB] pb-4">
              <h3 className="text-xl font-bold text-[#3db87a] flex items-center gap-2">
                <PlusCircle className="w-6 h-6" />
                <span>Đăng khảo sát mới</span>
              </h3>
              <p className="text-xs text-[#6B7280]">
                Phân phối khảo sát của bạn tới sinh viên trường phù hợp. Điểm sẽ ký quỹ an toàn.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateSurvey} className="space-y-4">

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-[#6B7280]">
                  Tiêu đề khảo sát <strong className="text-[#DC2626]">*</strong>
                </label>
                <input
                  type="text"
                  value={newSurveyTitle}
                  onChange={(e) => setNewSurveyTitle(e.target.value)}
                  placeholder="Ví dụ: Đánh giá dịch vụ Grab tại TP.HCM..."
                  className="w-full h-11 px-4 text-sm border border-[#E5E7EB] rounded-xl focus:border-[#3db87a] focus:ring-4 focus:ring-green-100 outline-none transition-all font-medium"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-[#6B7280]">
                  Đường dẫn Google Form <strong className="text-[#DC2626]">*</strong>
                </label>
                <input
                  type="url"
                  value={newSurveyUrl}
                  onChange={(e) => setNewSurveyUrl(e.target.value)}
                  placeholder="https://docs.google.com/forms/d/..."
                  className="w-full h-11 px-4 text-sm border border-[#E5E7EB] rounded-xl focus:border-[#3db87a] focus:ring-4 focus:ring-green-100 outline-none transition-all font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-[#6B7280]">
                    Số phản hồi mong muốn
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    value={newSurveyTarget}
                    onChange={(e) => setNewSurveyTarget(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full h-11 px-4 text-sm border border-[#E5E7EB] rounded-xl focus:border-[#3db87a] focus:ring-4 focus:ring-green-100 outline-none transition-all font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-[#6B7280]">
                    Thưởng mỗi lượt (đ)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={newSurveyBounty}
                    onChange={(e) => setNewSurveyBounty(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full h-11 px-4 text-sm border border-[#E5E7EB] rounded-xl focus:border-[#3db87a] focus:ring-4 focus:ring-green-100 outline-none transition-all font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-[#6B7280]">
                    Mã xác nhận hoàn thành <strong className="text-[#DC2626]">*</strong>
                  </label>
                  <input
                    type="text"
                    value={newSurveyCode}
                    onChange={(e) => setNewSurveyCode(e.target.value)}
                    placeholder="VD: HOANTHANH99"
                    className="w-full h-11 px-4 text-sm border border-[#E5E7EB] rounded-xl focus:border-[#3db87a] focus:ring-4 focus:ring-green-100 outline-none transition-all font-mono font-bold uppercase tracking-wider text-center"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-[#6B7280]">
                    Chủ đề minh họa
                  </label>
                  <select
                    value={newSurveyTopic}
                    onChange={(e) => setNewSurveyTopic(e.target.value as any)}
                    className="w-full h-11 px-3 text-sm border border-[#E5E7EB] rounded-xl focus:border-[#3db87a] focus:ring-4 focus:ring-green-100 outline-none transition-all font-medium bg-white"
                  >
                    <option value="shopping">Thời trang & Mua sắm</option>
                    <option value="ai">Trí tuệ nhân tạo (AI)</option>
                    <option value="health">Sức khỏe tâm lý</option>
                    <option value="finance">Tài chính & Ví điện tử</option>
                    <option value="food">Giao hàng ẩm thực</option>
                    <option value="english">Tiếng Anh & IELTS</option>
                    <option value="gaming">Trải nghiệm chơi game</option>
                    <option value="library">Dịch vụ Thư viện</option>
                    <option value="social">Mạng xã hội</option>
                  </select>
                </div>
              </div>

              {/* Escrow Breakdown Info Box */}
              <div className="bg-[#FAF8F1] border border-amber-200 rounded-2xl p-4 space-y-2">
                <h4 className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-amber-700" />
                  <span>Ký quỹ tài khoản tự động</span>
                </h4>
                <div className="flex justify-between text-xs text-[#6B7280]">
                  <span>Tổng số tiền ký quỹ (Lượt x Thưởng):</span>
                  <span className="font-bold text-[#1A1A1A]">{newSurveyTarget} x {newSurveyBounty} = {(newSurveyTarget * newSurveyBounty).toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="flex justify-between text-xs border-t border-[#E5E7EB] pt-2">
                  <span className="font-medium text-[#6B7280]">Số dư khả dụng hiện tại:</span>
                  <span className={`font-bold ${balance >= newSurveyTarget * newSurveyBounty ? "text-[#3db87a]" : "text-[#DC2626]"}`}>
                    {balance.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFABModal(false)}
                  className="w-1/3 h-11 border border-[#E5E7EB] text-[#1A1A1A] hover:bg-[#FAF8F1] font-bold text-xs rounded-full transition-colors"
                >
                  Hủy đăng
                </button>
                <button
                  type="submit"
                  disabled={balance < newSurveyTarget * newSurveyBounty}
                  className={`flex-1 h-11 text-white font-bold text-xs rounded-full transition-all shadow-md flex items-center justify-center gap-2 ${balance < newSurveyTarget * newSurveyBounty
                    ? "bg-gray-300 cursor-not-allowed shadow-none"
                    : "bg-[#3db87a] hover:bg-[#13422C] shadow-green-950/20 active:scale-95"
                    }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Đăng khảo sát & Ký quỹ</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  )
}
