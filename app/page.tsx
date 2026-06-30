"use client"

import React, { useState, useEffect, useRef, useTransition } from "react"
import './landing/landing.css'
import Link from "next/link"
import { Slider } from "@/components/ui/slider"
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
  FileText,
  MapPin,
  Tag,
  ChevronDown,
  ArrowLeft,
  AlertCircle,
  ArrowRight,
  ClipboardCheck,
  Target,
  GraduationCap,
  Briefcase
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
  const [authChecked, setAuthChecked] = useState(false)
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(true)
  const [starterMissionDone, setStarterMissionDone] = useState(true)
  const [showStarterBanner, setShowStarterBanner] = useState(false)

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
  const [selectedAges, setSelectedAges] = useState<string[]>([])
  const [selectedGenders, setSelectedGenders] = useState<string[]>([])
  const [selectedLocation, setSelectedLocation] = useState<string>("")
  const [selectedOccupations, setSelectedOccupations] = useState<string[]>([])
  const [selectedMajors, setSelectedMajors] = useState<string[]>([])
  const [incomeRange, setIncomeRange] = useState<[number, number]>([3, 10])
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([])
  const [bountyRange, setBountyRange] = useState<number>(5)
  const [selectedDuration, setSelectedDuration] = useState<string[]>([])

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
  const [newSurveyStep, setNewSurveyStep] = useState(1)
  const [newSurveyRegion, setNewSurveyRegion] = useState("Toàn quốc")

  const PROVINCES_BY_REGION: Record<string, string[]> = {
    "Miền Bắc": ["Hà Nội", "Hải Phòng", "Quảng Ninh", "Bắc Ninh"],
    "Miền Trung": ["Đà Nẵng", "Thừa Thiên Huế", "Nghệ An", "Khánh Hòa"],
    "Miền Nam": ["TP. Hồ Chí Minh", "Cần Thơ", "Bình Dương", "Đồng Nai"],
  }

  // Survey Topic Multi-select States
  const ALL_SURVEY_TOPICS = [
    "Thời trang & Mua sắm", "Mỹ phẩm & Làm đẹp", "Ẩm thực & Giao hàng", "Công nghệ & Thiết bị số", "Trí tuệ nhân tạo (AI)",
    "Mạng xã hội & Giải trí số", "Tài chính & Ví điện tử", "Giáo dục & Học tập", "Kỹ năng & Nghề nghiệp", "Sức khỏe tâm lý",
    "Sức khỏe & Thể chất", "Du lịch & Trải nghiệm", "Thương hiệu & Quảng cáo", "Khởi nghiệp & Kinh doanh", "Môi trường & Lối sống bền vững",
    "Giao thông & Đô thị", "Dịch vụ trường học (Thư viện, CLB...)"
  ];
  const [selectedSurveyTopics, setSelectedSurveyTopics] = useState<string[]>(['Thời trang & Mua sắm', 'Công nghệ & Thiết bị số', 'Trí tuệ nhân tạo (AI)', 'Giáo dục & Học tập'])
  const [isSurveyTopicDropdownOpen, setIsSurveyTopicDropdownOpen] = useState(false)
  const [surveyTopicSearch, setSurveyTopicSearch] = useState("")

  const topicDropdownRef = useRef<HTMLDivElement>(null)

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

  // Auth guard: redirect to login if not logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    if (!isLoggedIn) {
      window.location.href = '/login'
      return
    }
    const onboardingDone = localStorage.getItem('isOnboardingComplete') === 'true'
    const missionDone = localStorage.getItem('rescom_starter_mission_done') === 'true'
    setIsOnboardingComplete(onboardingDone)
    setStarterMissionDone(missionDone)
    // Show banner if onboarding done but hasn't completed first survey yet
    setShowStarterBanner(onboardingDone && !missionDone)
    setAuthChecked(true)
  }, [])

  // Load state from localStorage on mount
  useEffect(() => {
    if (!authChecked) return
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
  }, [authChecked])

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
      if (topicDropdownRef.current && !topicDropdownRef.current.contains(e.target as Node)) {
        setIsSurveyTopicDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [])

  // Recalculate Active Filter Count
  useEffect(() => {
    let count = 0
    if (selectedAges.length > 0) count++
    if (selectedGenders.length > 0) count++
    if (selectedLocation !== "") count++
    if (selectedOccupations.length > 0) count++
    if (selectedMajors.length > 0) count++
    if (incomeRange[0] !== 0 || incomeRange[1] !== 20) count++
    if (selectedHobbies.length > 0) count++
    if (bountyRange > 5) count++
    if (selectedDuration.length > 0) count++
    setActiveFilterCount(count)
  }, [selectedAges, selectedGenders, selectedLocation, selectedOccupations, selectedMajors, incomeRange, selectedHobbies, bountyRange, selectedDuration])

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
      if (!matchesMajor && !selectedMajors.includes("Khác")) return false
    }

    if (survey.pointBounty < bountyRange) return false

    // Time ranges filter
    if (selectedDuration.length > 0) {
      const time = survey.estimatedTime
      let timeMatch = false
      if (selectedDuration.includes("Dưới 5 phút") && time < 5) timeMatch = true
      if (selectedDuration.includes("Từ 5 - 10 phút") && time >= 5 && time <= 10) timeMatch = true
      if (selectedDuration.includes("Từ 10 - 15 phút") && time >= 10 && time <= 15) timeMatch = true
      if (selectedDuration.includes("Trên 15 phút") && time > 15) timeMatch = true

      if (!timeMatch) return false
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

    // Starter Mission: first survey completion awards 100 bonus points
    if (!starterMissionDone) {
      const bonusPoints = 100
      const balanceAfterBonus = nextBalance + bonusPoints
      setBalance(balanceAfterBonus)
      localStorage.setItem("rescom_balance", balanceAfterBonus.toString())
      setStarterMissionDone(true)
      setShowStarterBanner(false)
      localStorage.setItem('rescom_starter_mission_done', 'true')

      setTimeout(() => {
        showToast(`🏆 Nhiệm vụ khởi đầu hoàn thành! Nhận thêm +${bonusPoints}đ thưởng!`, "reward")
      }, 1500)

      const missionNotif: RescomNotification = {
        id: `starter-${Date.now()}`,
        type: "points_received",
        title: `Thưởng nhiệm vụ khởi đầu +${bonusPoints}đ!`,
        description: "Chúc mừng bạn đã hoàn thành khảo sát đầu tiên và nhận 100đ thưởng.",
        timeAgo: "Vừa xong",
        unread: true
      }
      setNotifications((prev) => [missionNotif, ...prev])
    }

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
    setSelectedAges([])
    setSelectedGenders([])
    setSelectedLocation("")
    setSelectedOccupations([])
    setSelectedMajors([])
    setIncomeRange([3, 10])
    setSelectedHobbies([])
    setBountyRange(5)
    setSelectedDuration([])
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


  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper bg-landing-bg">
        <div className="w-8 h-8 border-4 border-landing-accent border-t-transparent radius-wobbly animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-landing-bg bg-paper text-landing-fg font-patrick antialiased overflow-x-clip relative select-none selection:bg-landing-yellow selection:text-landing-fg">

      <a
        href="#survey-grid-region"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[999] focus:bg-landing-accent focus:text-white focus:px-5 focus:py-3 radius-wobbly shadow-hard focus:outline-none"
      >
        Bỏ qua, đến danh sách khảo sát
      </a>

      {/* Styled webkit scrollbar injection */}
      <style>{`
        ::-webkit-scrollbar {
          width: 10px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #2d2d2d;
          border: 2px solid #fdfbf7;
          border-radius: 8px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #ff4d4d;
        }
        @keyframes float-points {
          0% { transform: translateY(0) scale(1) rotate(-5deg); opacity: 1; }
          100% { transform: translateY(-120px) scale(1.4) rotate(5deg); opacity: 0; }
        }
        .animate-float-points {
          animation: float-points 1.5s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards;
        }
      `}</style>

      {/* Custom Floating Reward Animation */}
      {floatingReward && (
        <div
          className="fixed z-[9999] pointer-events-none font-bold font-kalam text-4xl text-landing-accent drop-shadow-[2px_2px_0px_#2d2d2d] flex items-center gap-1.5 animate-float-points"
          style={{ left: floatingReward.x - 20, top: floatingReward.y - 20 }}
        >
          <Award className="w-10 h-10 text-landing-yellow fill-landing-yellow drop-shadow-[2px_2px_0px_#2d2d2d]" />
          <span>+{floatingReward.amount}đ</span>
        </div>
      )}

      {/* Global Toast Panel */}
      <div className="fixed top-6 right-6 z-[99999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 radius-wobbly shadow-hard border-[3px] border-landing-border pointer-events-auto transition-all duration-300 flex items-start gap-3 animate-fade-scale-in rotate-1 ${toast.type === 'success' ? 'bg-landing-yellow' : 'bg-white'}`}
          >
            <div className="w-8 h-8 rounded-full bg-white/50 border-2 border-landing-border flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4 text-landing-fg" />
            </div>
            <div className="flex-1">
              <p className="text-lg font-bold text-landing-fg">{toast.text}</p>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="text-landing-fg/60 hover:text-landing-accent transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {/* 2. LEFT SIDEBAR (Desktop / Collapsed Tablet) */}
      <aside
        className={`fixed left-0 top-0 h-screen z-50 bg-white border-r-[3px] border-landing-border flex flex-col transition-all duration-300 w-[256px] shadow-[4px_0_0_0_#2d2d2d] ${isSidebarMobileOpen ? "translate-x-0" : "max-md:-translate-x-full"}`}
      >
        <div className="flex flex-col h-full bg-paper">

          {/* Top Logo */}
          <div className="px-6 pt-6 pb-3">
            <img
              src="/rescom-logo.png"
              alt="Rescom"
              className="w-[130px] h-auto object-contain -rotate-2"
            />
          </div>

          {/* Navigation stack */}
          <nav className="px-4 space-y-3 mt-4" aria-label="Menu chính">
            <button
              onClick={() => {
                setIsSidebarMobileOpen(false)
                showToast("Đang ở màn hình Khám Phá", "success")
              }}
              className="w-full flex items-center gap-3 px-4 py-3 radius-wobbly text-lg font-bold transition-all duration-200 bg-landing-accent text-white border-[3px] border-landing-border shadow-hard hover:translate-x-[-2px] hover:translate-y-[-2px] -rotate-1 active:shadow-none active:translate-x-0 active:translate-y-0"
            >
              <Compass className="w-6 h-6 flex-shrink-0" />
              <span className="flex-1 text-left">Khám Phá</span>
              <ChevronRight className="w-5 h-5" />
            </button>
            {[
              { label: "Đăng Khảo Sát", icon: <PlusCircle className="w-6 h-6 flex-shrink-0" />, action: () => setShowFABModal(true) },
              { label: "Tạo Khảo Sát", icon: <FileText className="w-6 h-6 flex-shrink-0" />, href: "/survey-builder" },
              { label: "Ví Điểm", icon: <Wallet className="w-6 h-6 flex-shrink-0" /> }
            ].map((item) => (
              item.href ? (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsSidebarMobileOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-3 radius-wobbly text-lg font-bold text-landing-fg hover:text-landing-accent hover:bg-landing-yellow/30 border-2 border-transparent hover:border-landing-border transition-all duration-200"
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
                  className="w-full flex items-center gap-3 px-4 py-3 radius-wobbly text-lg font-bold text-landing-fg hover:text-landing-accent hover:bg-landing-yellow/30 border-2 border-transparent hover:border-landing-border transition-all duration-200 rotate-1 hover:-rotate-1"
                >
                  {item.icon}
                  <span className="text-left">{item.label}</span>
                </button>
              )
            ))}
          </nav>

          {/* Mascot section */}
          <div className="flex-1 px-4 mt-6 min-h-0">
            <div className="w-full h-full relative overflow-hidden radius-wobbly border-2 border-landing-border bg-white flex flex-col -rotate-1 shadow-hard-sm" style={{ minHeight: "160px" }}>
              {/* Mascot */}
              <div className="flex-1 flex justify-center items-end relative z-10 pt-4">
                <img
                  src="/Artboard 1.png"
                  alt="Mascot"
                  style={{ width: 148, height: 148, objectFit: "contain", marginBottom: "20px", filter: "drop-shadow(4px 4px 0px rgba(45,45,45,0.2))" }}
                  className="animate-bounce-subtle"
                />
              </div>
              {/* Green hills - replaced with a hand-drawn squiggle ground */}
              <div className="absolute bottom-0 left-0 right-0 h-10 bg-landing-yellow border-t-2 border-landing-border radius-wobbly opacity-50"></div>
            </div>
          </div>

          {/* Bottom user profile & settings */}
          <div className="border-t-[3px] border-dashed border-landing-border/30 px-4 pt-4 pb-4 space-y-2 mt-4">
            <button
              onClick={() => showToast("Mở trang cá nhân", "info")}
              className="w-full flex items-center gap-3 px-3 py-3 radius-wobbly hover:bg-white border-2 border-transparent hover:border-landing-border hover:shadow-hard-sm transition-all group"
            >
              <div className="w-12 h-12 radius-wobbly border-2 border-landing-border overflow-hidden flex-shrink-0 bg-landing-yellow">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=nguyen"
                  alt="Avatar người dùng"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="text-lg font-bold text-landing-fg truncate font-kalam">Nguyễn Văn A</p>
                <p className="text-sm text-landing-fg/70 truncate font-bold">Sinh viên CNTT</p>
              </div>
              <ChevronRight className="w-5 h-5 text-landing-border/40 group-hover:text-landing-accent flex-shrink-0" />
            </button>
            <button
              onClick={() => showToast("Mở cài đặt tài khoản", "info")}
              className="w-full flex items-center gap-3 px-3 py-2 radius-wobbly text-lg text-landing-fg/70 hover:text-landing-fg hover:bg-white border-2 border-transparent hover:border-landing-border transition-all"
            >
              <Settings className="w-5 h-5 flex-shrink-0" />
              <span className="font-bold">Cài đặt tài khoản</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Hamburger Overlay backdrop for Mobile Drawer */}
      {isSidebarMobileOpen && (
        <div
          onClick={() => setIsSidebarMobileOpen(false)}
          className="fixed inset-0 z-40 bg-landing-fg/20 backdrop-blur-[2px] md:hidden"
        ></div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="transition-all duration-300 md:ml-[256px] min-h-screen flex flex-col">

        {/* Mobile Header Bar (<768px sticky) */}
        <header className="sticky top-0 z-40 bg-white border-b-[3px] border-landing-border shadow-[0_4px_0_0_#2d2d2d] md:hidden">
          {/* Row 1: Nav + Logo | Actions */}
          <div className="px-4 py-3 flex items-center justify-between bg-paper">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarMobileOpen(true)}
                className="p-2 radius-wobbly border-2 border-landing-border bg-white shadow-hard-sm hover:translate-y-[-2px] focus:outline-none"
                aria-label="Mở menu điều hướng"
              >
                <SlidersHorizontal className="w-6 h-6 rotate-90" />
              </button>
              <img src="/rescom-logo.png" alt="Rescom" className="h-8 w-auto object-contain -rotate-2" />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 radius-wobbly border-2 border-landing-border bg-white shadow-hard-sm hover:bg-landing-yellow focus:outline-none transition-colors"
                aria-label="Thông báo"
              >
                <Bell className="w-6 h-6" />
                {notifications.some((n) => n.unread) && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-landing-accent radius-wobbly border-2 border-landing-border animate-ping"></span>
                )}
              </button>
              <div className="w-10 h-10 radius-wobbly border-2 border-landing-border overflow-hidden bg-landing-yellow shadow-hard-sm">
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
            className="w-full flex items-center justify-between px-4 py-3 bg-white border-t-[3px] border-dashed border-landing-border/30 transition-colors"
            aria-expanded={!isStatsBarCollapsed}
            aria-label={isStatsBarCollapsed ? "Mở rộng thống kê" : "Thu gọn thống kê"}
          >
            <div className="flex items-center gap-2 text-sm font-bold">
              <Wallet className="w-4 h-4 text-landing-accent" />
              <span className="text-landing-fg">{balance.toLocaleString("vi-VN")}đ</span>
              <span className="text-landing-border/30 mx-1">•</span>
              <CheckCircle className="w-4 h-4 text-landing-secondary" />
              <span className="text-landing-fg/70">{completedCount} KS</span>
              <span className="text-landing-border/30 mx-1">•</span>
              <TrendingUp className="w-4 h-4 text-landing-yellow" />
              <span className="text-landing-secondary">+{weeklyPoints}đ</span>
            </div>
            <ChevronRight className={`w-5 h-5 text-landing-border transition-transform duration-300 ${isStatsBarCollapsed ? "" : "rotate-90"}`} />
          </button>
        </header>

        {/* 3. STICKY HEADER REGION (Solid Solid Background) */}
        <div
          className={`sticky md:top-0 top-[88px] z-30 bg-transparent transition-all duration-200 ${scrolled ? "backdrop-blur-md bg-paper/80 border-b-[3px] border-landing-border shadow-[0_4px_0_0_#2d2d2d]" : ""
            }`}
          style={{ willChange: "transform" }}
        >
          {/* Wrapper with padding */}
          <div className="px-4 py-4 md:px-8 md:py-6 space-y-6">

            {/* 3A. STATS BAR CARD */}
            <div className={`${isStatsBarCollapsed ? "hidden md:block" : ""} relative z-50`}>
              {/* We replace the plain div with a HandCard with tape */}
              <div className="bg-white border-[3px] border-landing-border radius-wobbly shadow-hard p-4 md:p-6 relative rotate-1">
                {/* Tape decoration */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-6 bg-gray-400/30 backdrop-blur-sm -rotate-2 skew-x-12 mix-blend-multiply z-10" />

                <div className="flex flex-col md:flex-row items-stretch justify-between">
                  <div className="flex flex-col sm:flex-row flex-1 divide-y-[3px] divide-dashed divide-landing-border/30 sm:divide-y-0 sm:divide-x-[3px]">

                    {/* Stats Block 1 - Ví điểm */}
                    <div className="flex items-center gap-4 py-3 sm:py-0 sm:px-6 first:pl-0 flex-1 group">
                      <div className="radius-wobbly bg-landing-yellow/30 border-2 border-landing-border flex items-center justify-center flex-shrink-0 w-14 h-14 group-hover:-rotate-6 transition-transform">
                        <Wallet className="text-landing-fg w-7 h-7" />
                      </div>
                      <div>
                        <p className="text-sm text-landing-fg/60 font-bold uppercase tracking-wider font-kalam">Ví điểm</p>
                        <div className="flex items-baseline gap-1">
                          <span className="font-bold tabular-nums text-landing-fg text-3xl font-kalam">
                            {balance.toLocaleString("vi-VN")}
                          </span>
                          <span className="text-lg font-bold text-landing-fg/80">đ</span>
                        </div>
                        <p className="text-sm text-landing-accent font-bold mt-0.5 -rotate-1">
                          {lockedBalance.toLocaleString("vi-VN")} đ ký quỹ
                        </p>
                      </div>
                    </div>

                    {/* Stats Block 2 - Hoàn thành */}
                    <div className="flex items-center gap-4 py-3 sm:py-0 sm:px-6 flex-1 group">
                      <div className="radius-wobbly bg-landing-secondary/20 border-2 border-landing-border flex items-center justify-center flex-shrink-0 w-14 h-14 group-hover:rotate-6 transition-transform">
                        <CheckCircle className="text-landing-secondary w-7 h-7" />
                      </div>
                      <div>
                        <p className="text-sm text-landing-fg/60 font-bold uppercase tracking-wider font-kalam">Hoàn thành</p>
                        <div className="flex items-baseline gap-1">
                          <span className="font-bold tabular-nums text-landing-fg text-3xl font-kalam">
                            {completedCount}
                          </span>
                          <span className="text-lg font-bold text-landing-fg/80">khảo sát</span>
                        </div>
                      </div>
                    </div>

                    {/* Stats Block 3 - Tuần này */}
                    <div className="flex items-center gap-4 py-3 sm:py-0 sm:px-6 flex-1 group">
                      <div className="radius-wobbly bg-[#ffcc00]/30 border-2 border-landing-border flex items-center justify-center flex-shrink-0 w-14 h-14 group-hover:-rotate-3 transition-transform">
                        <TrendingUp className="text-landing-fg w-7 h-7" />
                      </div>
                      <div>
                        <p className="text-sm text-landing-fg/60 font-bold uppercase tracking-wider font-kalam">Tuần này</p>
                        <div className="flex items-baseline gap-1">
                          <span className="font-bold tabular-nums text-landing-secondary text-3xl font-kalam">
                            +{weeklyPoints}
                          </span>
                          <span className="text-lg font-bold text-landing-secondary">đ</span>
                        </div>
                        <p className="text-sm text-landing-fg/60 font-bold mt-0.5 rotate-1">
                          đã tích lũy
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Far right - profile bell indicator for desktop only */}
                  <div className="hidden md:flex items-center gap-4 pl-6 border-l-[3px] border-dashed border-landing-border/30">
                    <div className="relative z-[9999]" ref={notificationRef}>
                      <button
                        ref={bellDesktopRef}
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-3 radius-wobbly border-[3px] border-landing-border bg-white hover:bg-landing-yellow text-landing-fg hover:-translate-y-1 shadow-hard-sm transition-all focus:outline-none"
                        aria-haspopup="true"
                        aria-expanded={showNotifications}
                        aria-label="Thông báo"
                      >
                        <Bell className="w-7 h-7" />
                        {notifications.some((n) => n.unread) && (
                          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-landing-accent radius-wobbly border-2 border-landing-border animate-bounce-subtle"></span>
                        )}
                      </button>

                      {/* 7. NOTIFICATION PANEL DROPDOWN */}
                      {showNotifications && (
                        <div
                          className="fixed w-80 bg-white border-[3px] border-landing-border radius-wobbly shadow-hard z-[9999] overflow-hidden animate-fade-scale-in"
                          style={{
                            top: bellDesktopRef.current
                              ? bellDesktopRef.current.getBoundingClientRect().bottom + 16
                              : 100,
                            right: bellDesktopRef.current
                              ? window.innerWidth - bellDesktopRef.current.getBoundingClientRect().right
                              : 24,
                          }}
                        >
                          <div className="p-4 bg-landing-yellow/20 border-b-[3px] border-dashed border-landing-border flex items-center justify-between">
                            <span className="font-bold text-xl font-kalam text-landing-fg">Thông báo</span>
                            <button
                              onClick={handleMarkAllNotificationsRead}
                              className="text-sm font-bold text-landing-secondary hover:line-through decoration-2"
                            >
                              Đánh dấu đã đọc
                            </button>
                          </div>

                          <div className="max-h-[300px] overflow-y-auto divide-y-[3px] divide-dashed divide-landing-border/20 custom-scrollbar">
                            {notifications.length === 0 ? (
                              <div className="p-8 text-center text-lg text-landing-fg/60 font-bold">Chưa có thông báo nào</div>
                            ) : (
                              notifications.map((notif) => (
                                <div
                                  key={notif.id}
                                  className={`p-4 flex items-start gap-3 hover:bg-landing-yellow/10 transition-colors ${notif.unread ? "bg-landing-accent/10" : ""
                                    }`}
                                >
                                  <div className="mt-1 w-3 h-3 flex-shrink-0 radius-wobbly flex items-center justify-center border-2 border-landing-border bg-white">
                                    {notif.unread && <span className="w-1.5 h-1.5 bg-landing-accent radius-wobbly"></span>}
                                  </div>
                                  <div className="flex-1 space-y-1">
                                    <p className="text-lg font-bold text-landing-fg leading-tight">{notif.title}</p>
                                    <p className="text-sm text-landing-fg/70 leading-snug font-bold">{notif.description}</p>
                                    <p className="text-xs text-landing-fg/50 font-bold pt-1">{notif.timeAgo}</p>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>

                          <div className="p-3 bg-white border-t-[3px] border-dashed border-landing-border text-center">
                            <button
                              onClick={() => {
                                showToast("Chuyển tới tất cả thông báo", "info")
                                setShowNotifications(false)
                              }}
                              className="text-lg font-bold text-landing-secondary hover:line-through decoration-2"
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
            </div>

            {/* 3B. FROZEN CREDIT BANNER (CONDITIONAL) */}
            {showFrozenBanner && frozenCount < 3 && (
              <div className="bg-[#fff9c4] border-[3px] border-landing-border radius-wobbly shadow-hard p-5 md:p-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6 animate-bounce-subtle rotate-[-1deg] relative">
                {/* Tack decoration */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 -mt-4 w-6 h-6 rounded-full bg-landing-accent shadow-[2px_4px_0_rgba(0,0,0,0.3)] z-10 before:content-[''] before:absolute before:top-1 before:left-1 before:w-2 before:h-2 before:bg-white/40 before:rounded-full" />

                <div className="flex items-start sm:items-center gap-4 pt-2">
                  <div className="w-12 h-12 radius-wobbly border-[3px] border-landing-border bg-white flex items-center justify-center flex-shrink-0 text-landing-fg rotate-3">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-bold font-kalam text-landing-fg">
                      Nhiệm vụ: Hoàn thành {frozenCount}/3 khảo sát để mở khóa 50đ ký quỹ!
                    </p>
                    {/* Progress Bar sketched */}
                    <div className="flex items-center gap-3">
                      <div className="w-48 h-3 radius-wobbly bg-white border-2 border-landing-border overflow-hidden">
                        <div
                          className="h-full bg-landing-accent transition-all duration-500 border-r-2 border-landing-border"
                          style={{ width: `${(frozenCount / 3) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-lg font-bold text-landing-fg font-kalam">{frozenCount}/3</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 self-end sm:self-center">
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
                    className="px-6 py-2 text-lg font-bold bg-landing-accent text-white radius-wobbly border-[3px] border-landing-border shadow-hard hover:translate-y-[-2px] hover:translate-x-[-2px] transition-all -rotate-2"
                  >
                    Làm khảo sát
                  </button>
                  <button
                    onClick={handleDismissFrozenBanner}
                    className="p-2 radius-wobbly border-2 border-landing-border bg-white text-landing-fg hover:bg-landing-accent hover:text-white transition-colors rotate-2"
                    aria-label="Đóng biểu ngữ"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
            )}

            {/* Celebrate Toast Banner after Frozen unlocked */}
            {frozenCount === 3 && showFrozenBanner && (
              <div className="bg-landing-yellow/30 border-[3px] border-landing-border radius-wobbly shadow-hard p-5 flex items-center justify-between animate-confetti-pop rotate-1">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 radius-wobbly bg-white border-2 border-landing-border flex items-center justify-center text-landing-accent -rotate-3">
                    <Unlock className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-xl font-bold font-kalam text-landing-fg">🎉 Đã mở khóa 50đ thành công!</p>
                    <p className="text-lg text-landing-fg/80 font-bold">Tiền thưởng ký quỹ đã được cộng vào số dư của bạn.</p>
                  </div>
                </div>
                <button
                  onClick={handleDismissFrozenBanner}
                  className="p-2 radius-wobbly border-2 border-landing-border bg-white text-landing-fg hover:bg-landing-accent hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            )}

            {/* Filter toggle - mobile only */}
            <button
              onClick={() => setIsFiltersCollapsed(prev => !prev)}
              className="md:hidden w-full flex items-center justify-between py-3 px-4 radius-wobbly border-[3px] border-landing-border bg-white shadow-hard-sm"
              aria-expanded={!isFiltersCollapsed}
              aria-label={isFiltersCollapsed ? "Mở rộng tìm kiếm & bộ lọc" : "Thu gọn tìm kiếm & bộ lọc"}
            >
              <div className="flex items-center gap-2 text-lg font-bold text-landing-fg">
                <Search className="w-5 h-5" />
                <span>Tìm kiếm & Bộ lọc</span>
                {activeFilterCount > 0 && (
                  <span className="px-2 py-0.5 radius-wobbly bg-landing-accent text-white border-2 border-landing-border text-sm">{activeFilterCount}</span>
                )}
                {debouncedSearch && (
                  <span className="px-2 py-0.5 radius-wobbly bg-landing-yellow text-landing-fg border-2 border-landing-border text-sm">Đang tìm</span>
                )}
              </div>
              <ChevronRight className={`w-5 h-5 text-landing-fg transition-transform duration-300 ${isFiltersCollapsed ? "" : "rotate-90"}`} />
            </button>
            {/* 3C + 3D collapsible - always shown on desktop */}
            <div className={`${isFiltersCollapsed ? "max-h-0" : "max-h-screen"} md:max-h-screen overflow-hidden transition-[max-height] duration-300 ease-in-out space-y-4`}>
              {/* 3C. SECTION HEADER + SEARCH + SORT */}
              <div className="space-y-4 relative z-20">

                {/* Row 2 */}
                <div className="flex flex-col sm:flex-row gap-4">

                  {/* Search Input wrapper */}
                  <div className="relative flex-1 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-landing-fg/50 group-focus-within:text-landing-fg transition-colors z-10" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm khảo sát theo tên, chủ đề..."
                      className="w-full h-14 pl-14 pr-12 text-lg bg-white border-[3px] border-landing-border radius-wobbly focus:outline-none focus:translate-y-[-2px] focus:shadow-hard-sm transition-all font-bold text-landing-fg placeholder:text-landing-fg/40"
                      aria-label="Tìm kiếm khảo sát"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-landing-fg/60 hover:text-landing-accent z-10"
                        aria-label="Xóa văn bản tìm kiếm"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setShowAdvancedFilters(true)}
                      className={`flex items-center gap-2 px-6 h-14 radius-wobbly text-lg font-bold border-[3px] border-landing-border transition-all hover:translate-y-[-2px] shadow-hard-sm ${activeFilterCount > 0
                        ? "bg-landing-accent text-white rotate-1"
                        : "bg-white text-landing-fg hover:bg-landing-yellow -rotate-1"
                        }`}
                      aria-label="Mở bộ lọc nâng cao"
                    >
                      <SlidersHorizontal className="w-5 h-5" />
                      <span>Bộ lọc {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
                    </button>
                  </div>
                  {/* Sort Dropdown */}
                  <div className="relative z-50" ref={sortDropdownRef}>
                    <button
                      onClick={() => setShowSortDropdown(!showSortDropdown)}
                      className="w-full sm:w-[220px] h-14 px-5 radius-wobbly bg-white hover:bg-landing-yellow text-landing-fg text-lg font-bold flex items-center justify-between border-[3px] border-landing-border shadow-hard-sm hover:translate-y-[-2px] transition-all rotate-1"
                      aria-label="Sắp xếp khảo sát"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <ArrowUpDown className="w-5 h-5 flex-shrink-0" />
                        <span className="truncate">Sắp xếp: {sortOption}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 rotate-90 flex-shrink-0" />
                    </button>

                    {showSortDropdown && (
                      <div className="absolute right-0 mt-3 w-56 bg-white border-[3px] border-landing-border radius-wobbly shadow-hard z-[99] overflow-hidden py-2 animate-fade-scale-in rotate-[-1deg]">
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
                            className={`w-full px-5 py-3 text-lg text-left font-bold transition-colors hover:bg-landing-yellow/30 ${sortOption === option ? "text-landing-accent bg-landing-yellow/10" : "text-landing-fg"
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
                <div className="flex items-center justify-between text-lg text-landing-fg/80 font-bold px-2 relative z-10">
                  <span aria-live="polite">
                    Tìm thấy <strong className="text-landing-accent font-kalam text-2xl">{sortedSurveys.length}</strong> khảo sát phù hợp
                  </span>

                  {/* Ẩn khảo sát đã làm Checkbox */}
                  <label className="flex items-center gap-3 cursor-pointer select-none text-lg font-bold text-landing-fg group">
                    <div className={`w-6 h-6 radius-wobbly border-[3px] flex items-center justify-center transition-all ${hideCompleted ? 'bg-landing-accent border-landing-accent' : 'bg-white border-landing-border group-hover:bg-landing-yellow'}`}>
                      {hideCompleted && <Check className="w-4 h-4 text-white stroke-[4]" />}
                    </div>
                    <input
                      type="checkbox"
                      checked={hideCompleted}
                      onChange={(e) => setHideCompleted(e.target.checked)}
                      className="hidden"
                    />
                    <span className="group-hover:underline decoration-wavy decoration-2 decoration-landing-accent">Ẩn khảo sát đã làm</span>
                  </label>
                </div>

              </div>

              {/* 3D. FILTER PILLS ROW */}
              <div className="flex items-center gap-3 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none pt-2 relative z-10">
                {[
                  { id: "Tất cả", label: "Tất cả", icon: null },
                  { id: "Phù hợp", label: "Phù hợp", icon: <Sparkles className="w-4 h-4" /> },
                  { id: "Thưởng cao", label: "Thưởng cực cao", icon: <TrendingUp className="w-4 h-4" /> },
                  { id: "Nhanh", label: "Làm siêu nhanh", icon: <Clock className="w-4 h-4" /> }
                ].map((pill, i) => (
                  <button
                    key={pill.id}
                    onClick={() => {
                      startTransition(() => {
                        setActiveFilter(pill.id as any)
                      })
                    }}
                    className={`flex items-center gap-2 px-5 py-2 radius-wobbly text-lg font-bold whitespace-nowrap transition-all border-[3px] shadow-hard-sm ${activeFilter === pill.id
                      ? "bg-landing-fg text-white border-landing-fg translate-y-[-2px] translate-x-[-2px]"
                      : "bg-white text-landing-fg border-landing-border hover:bg-landing-yellow hover:translate-y-[-1px]"
                      }`}
                    style={{ transform: activeFilter === pill.id ? 'translate(-2px, -2px) rotate(1deg)' : `rotate(${i % 2 === 0 ? '-1deg' : '1deg'})` }}
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
          className="flex-1 px-4 py-8 md:px-8 md:py-10 relative z-0"
          aria-live="polite"
        >
          {sortedSurveys.length === 0 ? (

            /* 6. EMPTY STATES */
            <div className="flex flex-col items-center justify-center text-center py-24 px-6 bg-white radius-wobbly border-[3px] border-landing-border shadow-hard max-w-xl mx-auto space-y-8 -rotate-1 relative">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-6 bg-gray-400/30 backdrop-blur-sm rotate-2 skew-x-12 mix-blend-multiply z-10" />
              <div className="w-32 h-32 radius-wobbly bg-landing-yellow/30 border-2 border-landing-border flex items-center justify-center text-landing-fg rotate-3 shadow-hard-sm">
                <BookOpen className="w-16 h-16 stroke-[2]" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-bold font-kalam text-landing-fg">Không tìm thấy khảo sát phù hợp</h3>
                <p className="text-lg font-bold text-landing-fg/70 max-w-sm mx-auto font-patrick">
                  Thử thay đổi từ khóa tìm kiếm hoặc đặt lại các bộ lọc nâng cao để tiếp tục xem danh sách.
                </p>
              </div>
              <button
                onClick={handleClearFilters}
                className="px-8 py-3 radius-wobbly border-[3px] border-landing-border bg-landing-accent text-white text-lg font-bold hover:translate-y-[-2px] hover:translate-x-[-2px] shadow-hard transition-all rotate-2"
              >
                Xem tất cả khảo sát
              </button>
            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {sortedSurveys.map((survey, i) => {
                const isNew = survey.createdHoursAgo <= 48
                const spotsLeft = survey.targetResponses - survey.currentResponses
                const progressPercent = Math.round((survey.currentResponses / survey.targetResponses) * 100)

                // Color tiers for match score badge
                let matchBadgeStyle = ""
                if (survey.matchScore >= 90) {
                  matchBadgeStyle = "bg-landing-accent text-white"
                } else if (survey.matchScore >= 70) {
                  matchBadgeStyle = "bg-landing-accent text-white"
                } else if (survey.matchScore >= 50) {
                  matchBadgeStyle = "bg-landing-yellow text-landing-fg"
                }

                // Deadline Color Logic
                let deadlineStyle = "text-landing-fg/70"
                let deadlineUrgent = false
                if (survey.deadlineDays < 1) {
                  deadlineStyle = "text-landing-accent font-bold animate-pulse"
                  deadlineUrgent = true
                } else if (survey.deadlineDays < 3) {
                  deadlineStyle = "text-landing-accent font-bold"
                } else if (survey.deadlineDays <= 7) {
                  deadlineStyle = "text-landing-secondary font-bold"
                }

                // Random rotation per card
                const rotateClass = i % 3 === 0 ? 'rotate-1' : i % 3 === 1 ? '-rotate-1' : 'rotate-2'

                return (
                  <article
                    key={survey.id}
                    id={`survey-card-${survey.id}`}
                    onClick={(e) => !survey.completed && handleStartSurvey(survey, e)}
                    className={`group relative flex flex-col bg-white radius-wobbly border-[3px] border-landing-border shadow-hard hover:translate-y-[-4px] hover:translate-x-[-4px] transition-all duration-300 cursor-pointer ${rotateClass} hover:rotate-0 overflow-hidden`}
                    aria-label={`Khảo sát: ${survey.title}. Phần thưởng: ${survey.pointBounty}đ`}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        if (!survey.completed) handleStartSurvey(survey, e as any)
                      }
                    }}
                  >
                    {/* Tape decoration if urgent or new */}
                    {(isNew || deadlineUrgent) && (
                      <div className="absolute top-0 right-8 w-16 h-6 bg-red-400/30 backdrop-blur-sm rotate-[35deg] mix-blend-multiply z-20" />
                    )}

                    {/* TOP HALF — Visual hero */}
                    <div className="h-48 bg-landing-yellow/20 relative flex items-center justify-center p-6 border-b-[3px] border-dashed border-landing-border transition-colors group-hover:bg-landing-yellow/40">

                      {/* Match score badge (50%+) */}
                      {survey.matchScore >= 50 && (
                        <div
                          className={`absolute top-4 left-4 px-4 py-1.5 radius-wobbly border-2 border-landing-border text-sm font-bold flex items-center gap-1.5 shadow-hard-sm -rotate-2 ${matchBadgeStyle}`}
                          title="Phù hợp dựa trên ngành học, độ tuổi và sở thích của bạn"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>Phù hợp {survey.matchScore}%</span>
                        </div>
                      )}

                      {/* "Mới" Ribbon (<48h) */}
                      {isNew && (
                        <div className="absolute top-0 right-0 bg-landing-accent text-white text-xs font-bold px-4 py-2 border-b-2 border-l-2 border-landing-border radius-wobbly-b-l uppercase tracking-wider shadow-hard-sm z-10 rotate-2">
                          Mới
                        </div>
                      )}

                      {/* Center Topic Illustration */}
                      <div className="w-24 h-24 radius-wobbly bg-white border-[3px] border-landing-border flex items-center justify-center shadow-hard transform group-hover:scale-110 transition-transform duration-300 relative rotate-2">
                        {getTopicIcon(survey.topic)}
                        {/* Semi-transparent reward overlay */}
                        <div className="absolute -bottom-3 -right-3 bg-white border-2 border-landing-border px-3 py-1 radius-wobbly text-sm font-bold font-kalam text-landing-accent shadow-hard-sm -rotate-6">
                          +{survey.pointBounty}đ
                        </div>
                      </div>

                    </div>

                    {/* BOTTOM HALF — Info section */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                      <div className="space-y-3">

                        {/* Header title + bounty pill */}
                        <div className="flex items-start justify-between gap-4">
                          <h4 className="font-bold font-kalam text-xl text-landing-fg line-clamp-2 leading-snug flex-1">
                            {highlightText(survey.title, searchQuery)}
                          </h4>
                        </div>

                        {/* Description */}
                        <p className="text-sm font-bold text-landing-fg/70 line-clamp-2 leading-relaxed">
                          {highlightText(survey.description, searchQuery)}
                        </p>

                        {/* Tag Chips */}
                        <div className="flex flex-wrap gap-2 pt-2">
                          {survey.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 bg-white border-2 border-landing-border text-landing-fg text-sm font-bold radius-wobbly shadow-[2px_2px_0_0_#2d2d2d]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Progress and Meta Row */}
                      <div className="space-y-4 pt-3 border-t-[3px] border-dashed border-landing-border/20">

                        {/* Meta metrics */}
                        <div className="flex items-center justify-between text-sm text-landing-fg/70 font-bold">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-landing-fg/50" />
                            <span>~{survey.estimatedTime} phút</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-landing-fg/50" />
                            <span>Còn {spotsLeft} suất</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-landing-fg/50" />
                            <span className={deadlineStyle}>
                              {survey.deadlineDays < 1
                                ? `Hết hạn sau ${Math.round(survey.deadlineDays * 24)}h`
                                : `Còn ${Math.round(survey.deadlineDays)} ngày`}
                            </span>
                          </div>
                        </div>

                        {/* Progress slider bar */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-bold uppercase tracking-wide">
                            <span className="text-landing-fg/60">Tiến độ thu thập</span>
                            <span className="text-landing-fg font-kalam text-sm">{progressPercent}%</span>
                          </div>
                          <div className="w-full h-3 radius-wobbly bg-white overflow-hidden border-2 border-landing-border">
                            <div
                              className="h-full bg-landing-accent border-r-2 border-landing-border transition-all duration-700 ease-out"
                              style={{ width: `${progressPercent}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Call to action button */}
                        <button
                          className="w-full h-12 radius-wobbly bg-landing-fg hover:bg-landing-accent text-white text-lg font-bold flex items-center justify-center gap-2 transition-all shadow-hard active:translate-y-[2px] active:translate-x-[2px] active:shadow-none focus:outline-none rotate-1 group-hover:rotate-0"
                          aria-label={`Bắt đầu làm bài khảo sát ${survey.title}`}
                        >
                          <Zap className="w-5 h-5 fill-white" />
                          <span>Bắt đầu làm</span>
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>

                    </div>

                    {/* COMPLETED CARD STATE OVERLAY */}
                    {survey.completed && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center z-30 transition-all">
                        <div className="w-20 h-20 radius-wobbly bg-landing-yellow border-[3px] border-landing-border flex items-center justify-center text-landing-fg mb-4 shadow-hard animate-scale-in rotate-3">
                          <Check className="w-10 h-10 stroke-[3]" />
                        </div>
                        <h5 className="font-bold font-kalam text-2xl text-landing-fg mb-1">Đã hoàn thành</h5>
                        <p className="text-lg font-bold text-landing-fg/70 mb-6 max-w-[200px]">Phần thưởng điểm đã được cộng vào ví.</p>

                        <button
                          disabled
                          className="w-48 h-12 radius-wobbly bg-landing-muted text-landing-fg/50 text-lg font-bold cursor-not-allowed border-2 border-landing-border flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-5 h-5" />
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
      <div className="fixed bottom-8 right-8 z-40 group">
        <button
          onClick={() => setShowFABModal(true)}
          className="w-16 h-16 radius-wobbly bg-landing-accent border-[3px] border-landing-border text-white flex items-center justify-center shadow-[4px_4px_0_0_#2d2d2d] hover:translate-y-[-2px] hover:translate-x-[-2px] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all focus:outline-none -rotate-3 hover:rotate-0"
          aria-label="Đăng khảo sát mới"
          title="Đăng khảo sát mới"
        >
          <Plus className="w-8 h-8 stroke-[3]" />
        </button>
        {/* Tooltip */}
        <div className="absolute bottom-20 right-0 bg-white border-2 border-landing-border radius-wobbly shadow-hard-sm text-landing-fg text-lg font-bold py-2 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none rotate-2">
          Đăng khảo sát mới
        </div>
      </div>

      {/* 9. ADVANCED FILTER PANEL (Centered Modal) */}
      {showAdvancedFilters && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-label="Bộ lọc khảo sát nâng cao">

          {/* Backdrop */}
          <div
            onClick={() => setShowAdvancedFilters(false)}
            className="absolute inset-0 bg-landing-fg/40 backdrop-blur-[2px] transition-opacity"
          ></div>

          <div className="relative w-full max-w-3xl bg-white radius-wobbly border-[3px] border-landing-border shadow-hard flex flex-col max-h-[95vh] animate-scale-in rotate-1">
            {/* Tape decoration */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-gray-400/30 backdrop-blur-sm rotate-2 skew-x-12 mix-blend-multiply z-10" />

            {/* Header */}
            <div className="px-8 py-6 border-b-[3px] border-dashed border-landing-border flex items-center justify-between bg-landing-yellow/20">
              <div>
                <h3 className="text-3xl font-bold font-kalam text-landing-fg">Bộ lọc nâng cao</h3>
                <p className="text-lg font-bold text-landing-fg/70">Tìm đúng đối tượng khảo sát</p>
              </div>
              <button
                onClick={() => setShowAdvancedFilters(false)}
                className="p-2 radius-wobbly bg-white border-2 border-landing-border text-landing-fg hover:bg-landing-accent hover:text-white transition-colors rotate-3"
                aria-label="Đóng bảng bộ lọc"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Filters Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">

              {/* 1. ĐỘ TUỔI */}
              <div className="space-y-4">
                <span className="text-lg font-bold uppercase tracking-wider text-landing-fg font-kalam">Độ tuổi</span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {["Dưới 18 tuổi", "18 - 22 tuổi", "23 - 25 tuổi", "Trên 25 tuổi"].map((age) => {
                    const selected = selectedAges.includes(age)
                    return (
                      <button
                        key={age}
                        onClick={() => {
                          if (selected) {
                            setSelectedAges(selectedAges.filter((a) => a !== age))
                          } else {
                            setSelectedAges([...selectedAges, age])
                          }
                        }}
                        className={`flex items-center gap-3 px-4 py-3 radius-wobbly text-lg font-bold border-2 transition-all ${selected
                          ? "bg-landing-yellow text-landing-fg border-landing-border shadow-[2px_2px_0_0_#2d2d2d] translate-y-[-2px]"
                          : "bg-white text-landing-fg border-landing-border hover:bg-landing-yellow/30"
                          }`}
                      >
                        <div className={`w-5 h-5 radius-wobbly border-2 flex items-center justify-center transition-colors ${selected ? "bg-landing-accent border-landing-accent" : "border-landing-border bg-white"}`}>
                          {selected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                        </div>
                        <span className="whitespace-nowrap">{age}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* GIỚI TÍNH */}
                <div className="space-y-4">
                  <span className="text-lg font-bold uppercase tracking-wider text-landing-fg font-kalam">Giới tính</span>
                  <div className="flex flex-wrap gap-4">
                    {["Nam", "Nữ", "Khác"].map((gender) => {
                      const selected = selectedGenders.includes(gender)
                      return (
                        <button
                          key={gender}
                          onClick={() => {
                            if (selected) {
                              setSelectedGenders(selectedGenders.filter((g) => g !== gender))
                            } else {
                              setSelectedGenders([...selectedGenders, gender])
                            }
                          }}
                          className={`flex flex-1 items-center justify-center gap-3 px-4 py-3 radius-wobbly text-lg font-bold border-2 transition-all ${selected
                            ? "bg-landing-yellow text-landing-fg border-landing-border shadow-[2px_2px_0_0_#2d2d2d] translate-y-[-2px]"
                            : "bg-white text-landing-fg border-landing-border hover:bg-landing-yellow/30"
                            }`}
                        >
                          <div className={`w-5 h-5 radius-wobbly border-2 flex items-center justify-center transition-colors ${selected ? "bg-landing-accent border-landing-accent" : "border-landing-border bg-white"}`}>
                            {selected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                          </div>
                          <span>{gender}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* KHU VỰC SINH SỐNG */}
                <div className="space-y-4">
                  <span className="text-lg font-bold uppercase tracking-wider text-landing-fg font-kalam">Khu vực sinh sống</span>
                  <div className="relative group">
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full h-[52px] px-5 appearance-none border-2 border-landing-border radius-wobbly text-lg font-bold text-landing-fg focus:outline-none focus:translate-y-[-2px] focus:shadow-hard-sm bg-white transition-all cursor-pointer"
                    >
                      <option value="">Chọn tỉnh / thành phố</option>
                      <option value="Hà Nội">Hà Nội</option>
                      <option value="TP.HCM">TP.HCM</option>
                      <option value="Đà Nẵng">Đà Nẵng</option>
                      <option value="Khác">Khác</option>
                    </select>
                    <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-landing-fg rotate-90 pointer-events-none" />
                  </div>
                </div>

                {/* NGHỀ NGHIỆP */}
                <div className="space-y-4">
                  <span className="text-lg font-bold uppercase tracking-wider text-landing-fg font-kalam">Nghề nghiệp</span>
                  <div className="flex flex-wrap gap-3">
                    {["Học sinh / Sinh viên", "Nhân viên văn phòng", "Freelancer", "Chủ doanh nghiệp", "Khác"].map((occ) => {
                      const selected = selectedOccupations.includes(occ)
                      return (
                        <button
                          key={occ}
                          onClick={() => {
                            if (selected) {
                              setSelectedOccupations(selectedOccupations.filter((o) => o !== occ))
                            } else {
                              setSelectedOccupations([...selectedOccupations, occ])
                            }
                          }}
                          className={`flex items-center gap-3 px-4 py-2.5 radius-wobbly text-lg font-bold border-2 transition-all ${selected
                            ? "bg-landing-yellow text-landing-fg border-landing-border shadow-[2px_2px_0_0_#2d2d2d] translate-y-[-2px]"
                            : "bg-white text-landing-fg border-landing-border hover:bg-landing-yellow/30"
                            }`}
                        >
                          <div className={`w-5 h-5 flex-shrink-0 radius-wobbly border-2 flex items-center justify-center transition-colors ${selected ? "bg-landing-accent border-landing-accent" : "border-landing-border bg-white"}`}>
                            {selected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                          </div>
                          <span>{occ}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* KHỐI NGÀNH */}
                <div className="space-y-4">
                  <span className="text-lg font-bold uppercase tracking-wider text-landing-fg font-kalam">Khối ngành</span>
                  <div className="flex flex-wrap gap-3">
                    {["Kinh tế - Marketing", "Truyền thông - Báo chí", "CNTT - Kỹ thuật phần mềm", "Ngôn ngữ - Du lịch", "Khác"].map((major) => {
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
                          className={`flex items-center gap-3 px-4 py-2.5 radius-wobbly text-lg font-bold border-2 transition-all ${selected
                            ? "bg-landing-yellow text-landing-fg border-landing-border shadow-[2px_2px_0_0_#2d2d2d] translate-y-[-2px]"
                            : "bg-white text-landing-fg border-landing-border hover:bg-landing-yellow/30"
                            }`}
                        >
                          <div className={`w-5 h-5 radius-wobbly border-2 flex-shrink-0 flex items-center justify-center transition-colors ${selected ? "bg-landing-accent border-landing-accent" : "border-landing-border bg-white"}`}>
                            {selected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                          </div>
                          <span>{major}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* THU NHẬP HÀNG THÁNG */}
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold uppercase tracking-wider text-landing-fg font-kalam">Thu nhập hàng tháng</span>
                  <span className="text-xl font-bold text-landing-accent font-kalam">{incomeRange[0]} - {incomeRange[1]} triệu VNĐ</span>
                </div>
                <div className="px-3 border-[3px] border-landing-border radius-wobbly bg-landing-muted p-4 shadow-hard-sm">
                  <Slider
                    min={0}
                    max={20}
                    step={1}
                    value={incomeRange}
                    onValueChange={(val) => setIncomeRange(val as [number, number])}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between text-lg text-landing-fg/70 font-bold">
                  <span className="w-1/4 text-left">Dưới 3 triệu</span>
                  <span className="w-1/4 text-center">3 - 5 triệu</span>
                  <span className="w-1/4 text-center">5 - 10 triệu</span>
                  <span className="w-1/4 text-right">Trên 10 triệu</span>
                </div>
              </div>

              {/* SỞ THÍCH */}
              <div className="space-y-4">
                <span className="text-lg font-bold uppercase tracking-wider text-landing-fg font-kalam">Sở thích</span>
                <div className="flex flex-wrap gap-3">
                  {ALL_SURVEY_TOPICS.map((hobby) => {
                    const selected = selectedHobbies.includes(hobby)
                    return (
                      <button
                        key={hobby}
                        onClick={() => {
                          if (selected) {
                            setSelectedHobbies(selectedHobbies.filter((h) => h !== hobby))
                          } else {
                            setSelectedHobbies([...selectedHobbies, hobby])
                          }
                        }}
                        className={`flex items-center gap-3 px-4 py-2.5 radius-wobbly text-lg font-bold border-2 transition-all ${selected
                          ? "bg-landing-yellow text-landing-fg border-landing-border shadow-[2px_2px_0_0_#2d2d2d] translate-y-[-2px]"
                          : "bg-white text-landing-fg border-landing-border hover:bg-landing-yellow/30"
                          }`}
                      >
                        <div className={`w-5 h-5 radius-wobbly border-2 flex items-center justify-center transition-colors ${selected ? "bg-landing-accent border-landing-accent" : "border-landing-border bg-white"}`}>
                          {selected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                        </div>
                        <span>{hobby}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* MỨC THƯỞNG TỐI THIỂU */}
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold uppercase tracking-wider text-landing-fg font-kalam">Mức thưởng tối thiểu</span>
                  <span className="text-xl font-bold text-landing-accent font-kalam">{bountyRange}đ</span>
                </div>
                <div className="px-3 border-[3px] border-landing-border radius-wobbly bg-landing-muted p-4 shadow-hard-sm">
                  <Slider
                    min={5}
                    max={50}
                    step={5}
                    value={[bountyRange]}
                    onValueChange={(val) => setBountyRange(val[0])}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between text-lg text-landing-fg/70 font-bold">
                  <span>5đ</span>
                  <span>50đ</span>
                </div>
              </div>

              {/* THỜI GIAN HOÀN THÀNH */}
              <div className="space-y-4">
                <span className="text-lg font-bold uppercase tracking-wider text-landing-fg font-kalam">Thời gian hoàn thành</span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {["Dưới 5 phút", "Từ 5 - 10 phút", "Từ 10 - 15 phút", "Trên 15 phút"].map((time) => {
                    const selected = selectedDuration.includes(time)
                    return (
                      <button
                        key={time}
                        onClick={() => {
                          if (selected) {
                            setSelectedDuration(selectedDuration.filter((t) => t !== time))
                          } else {
                            setSelectedDuration([...selectedDuration, time])
                          }
                        }}
                        className={`px-4 py-3 radius-wobbly text-lg font-bold text-center border-2 transition-all ${selected
                          ? "bg-landing-yellow text-landing-fg border-landing-border shadow-[2px_2px_0_0_#2d2d2d] translate-y-[-2px]"
                          : "bg-white text-landing-fg border-landing-border hover:bg-landing-yellow/30"
                          }`}
                      >
                        {time}
                      </button>
                    )
                  })}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-6 border-t-[3px] border-dashed border-landing-border flex items-center justify-between gap-6 bg-paper">
              <button
                onClick={() => {
                  handleClearFilters()
                  showToast("Đã xóa mọi thiết lập lọc", "info")
                }}
                className="text-lg font-bold text-landing-accent hover:line-through decoration-2 px-2"
              >
                Xóa bộ lọc
              </button>
              <button
                onClick={() => {
                  setShowAdvancedFilters(false)
                  showToast("Áp dụng bộ lọc thành công!", "success")
                }}
                className="w-48 md:w-64 h-14 bg-landing-fg hover:bg-landing-accent text-white radius-wobbly text-xl font-bold shadow-hard active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all rotate-1"
              >
                Áp dụng
              </button>
            </div>

          </div>
        </div>
      )}

      {/* FULL SURVEY SIMULATION DIALOG / INTERACTIVE MODAL */}
      {activeSurveyForModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-landing-fg/60 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Xác minh khảo sát">
          <div className="bg-white radius-wobbly w-full max-w-lg border-[3px] border-landing-border shadow-hard p-6 md:p-10 animate-scale-in relative space-y-6 rotate-1">

            {/* Tack decoration */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-landing-accent shadow-[2px_4px_0_rgba(0,0,0,0.3)] z-10 before:content-[''] before:absolute before:top-1 before:left-1 before:w-2 before:h-2 before:bg-white/40 before:rounded-full" />

            {/* Top Close */}
            <button
              onClick={() => {
                setActiveSurveyForModal(null)
                setSurveyInProgress(false)
              }}
              className="absolute top-6 right-6 p-2 radius-wobbly border-2 border-transparent hover:border-landing-border bg-white text-landing-fg hover:bg-landing-yellow transition-colors"
              aria-label="Đóng hộp thoại"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header Title */}
            <div className="text-center space-y-4 mt-4">
              <div className="inline-flex items-center gap-2 bg-landing-yellow text-landing-fg border-2 border-landing-border font-bold px-4 py-2 radius-wobbly text-sm shadow-hard-sm -rotate-2">
                <Award className="w-5 h-5 fill-landing-accent text-landing-accent" />
                <span>Hoàn thành để nhận +{activeSurveyForModal.pointBounty}đ</span>
              </div>
              <h3 className="font-bold text-3xl font-kalam text-landing-fg px-2">{activeSurveyForModal.title}</h3>
            </div>

            {/* Description Details */}
            <div className="bg-paper border-[3px] border-dashed border-landing-border radius-wobbly p-5 space-y-4 rotate-1">
              <div className="flex gap-4">
                <Info className="w-6 h-6 text-landing-accent mt-0.5 flex-shrink-0" />
                <p className="text-lg font-bold text-landing-fg/80 leading-relaxed">
                  Để đảm bảo chất lượng phản hồi, vui lòng thực hiện khảo sát nghiêm túc. Biểu mẫu chính thức đã được mở ở một tab mới trên trình duyệt của bạn.
                </p>
              </div>

              {/* Anti-cheat countdown status */}
              <div className="flex items-center justify-between text-sm border-t-[3px] border-dashed border-landing-border/20 pt-4">
                <span className="font-bold font-kalam text-xl text-landing-fg/60">Trạng thái:</span>
                {countdown > 0 ? (
                  <span className="text-landing-secondary font-bold flex items-center gap-2 animate-pulse text-lg">
                    <Clock className="w-5 h-5" />
                    Đang làm (còn {countdown}s)
                  </span>
                ) : (
                  <span className="text-landing-accent font-bold flex items-center gap-2 text-lg">
                    <CheckCircle className="w-5 h-5" />
                    Đã hoàn tất thời gian
                  </span>
                )}
              </div>
            </div>

            {/* Input code validation form */}
            <form onSubmit={handleSubmitCompletionCode} className="space-y-6">
              <div className="space-y-3">
                <label className="text-xl font-bold font-kalam text-landing-fg block ml-2">
                  Nhập mã xác minh (Xem cuối form)
                </label>
                <input
                  type="text"
                  value={enteredCode}
                  onChange={(e) => {
                    setEnteredCode(e.target.value)
                    setCodeError("")
                  }}
                  placeholder="Nhập mã hoàn thành..."
                  className="w-full h-14 px-4 text-center text-xl font-bold tracking-widest uppercase border-[3px] border-landing-border radius-wobbly focus:outline-none focus:translate-y-[-2px] focus:shadow-hard-sm transition-all bg-white"
                  maxLength={15}
                  required
                />

                {/* Visual Cheat hint helper for testing */}
                <div className="flex items-center justify-between text-sm text-landing-fg/70 pt-2 font-bold px-2">
                  <span>Mẹo: Mã là:</span>
                  <span className="font-bold text-landing-accent bg-landing-yellow px-3 py-1 radius-wobbly border-2 border-landing-border select-all cursor-pointer shadow-[2px_2px_0_0_#2d2d2d] rotate-2">
                    {activeSurveyForModal.completionCode}
                  </span>
                </div>
              </div>

              {codeError && (
                <p className="text-lg text-landing-accent font-bold text-center animate-shake leading-snug bg-red-100 p-3 radius-wobbly border-2 border-landing-accent -rotate-1">
                  ❌ {codeError}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setActiveSurveyForModal(null)
                    setSurveyInProgress(false)
                  }}
                  className="w-1/3 h-14 border-[3px] border-landing-border bg-white text-landing-fg hover:bg-landing-yellow font-bold text-lg radius-wobbly transition-colors shadow-hard active:translate-y-[2px] active:translate-x-[2px] active:shadow-none rotate-1"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCode || countdown > 0}
                  className={`flex-1 h-14 text-white font-bold text-lg radius-wobbly transition-all border-[3px] shadow-hard flex items-center justify-center gap-2 ${countdown > 0
                    ? "bg-landing-muted border-landing-border/50 text-landing-fg/50 cursor-not-allowed shadow-none"
                    : "bg-landing-accent border-landing-border hover:bg-[#d43f3f] hover:translate-y-[-2px] hover:translate-x-[-2px] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none -rotate-1"
                    }`}
                >
                  {isSubmittingCode ? (
                    <>
                      <div className="w-6 h-6 border-[3px] border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang xác nhận...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Xác nhận hoàn thành</span>
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* FAB MODAL - CREATE NEW SURVEY */}
      {showFABModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-landing-fg/60 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Tạo khảo sát mới">
          <div className="bg-white radius-wobbly w-full max-w-[900px] border-[3px] border-landing-border shadow-hard relative flex flex-col max-h-[95vh] overflow-hidden rotate-[0.5deg]">

            {/* Header */}
            <div className="px-8 pt-8 pb-6 border-b-[3px] border-dashed border-landing-border flex justify-between items-start bg-landing-yellow/20">
              <div className="flex gap-5">
                <div className="w-12 h-12 radius-wobbly border-[3px] border-landing-border bg-white flex items-center justify-center text-landing-accent shrink-0 mt-0.5 rotate-3 shadow-hard-sm">
                  <Plus className="w-7 h-7 stroke-[3]" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold font-kalam text-landing-fg">Đăng khảo sát mới</h2>
                  <p className="text-lg text-landing-fg/70 font-bold mt-1">Phân phối khảo sát của bạn tới sinh viên phù hợp. Điểm sẽ ký quỹ an toàn.</p>
                </div>
              </div>
              <button onClick={() => { setShowFABModal(false); setNewSurveyStep(1); }} className="p-2 radius-wobbly border-2 border-transparent hover:border-landing-border bg-white text-landing-fg hover:bg-landing-accent hover:text-white transition-colors rotate-3">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar">

              {/* Progress Steps Sketched */}
              <div className="flex items-center justify-between mb-10 bg-paper p-4 radius-wobbly border-[3px] border-dashed border-landing-border/30 -rotate-1">
                {/* Step 1 */}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 radius-wobbly border-2 border-landing-border flex items-center justify-center font-bold text-xl shrink-0 ${newSurveyStep > 1 ? 'bg-landing-accent text-white' : newSurveyStep === 1 ? 'bg-landing-accent text-white' : 'bg-white text-landing-fg'}`}>
                    {newSurveyStep > 1 ? <Check className="w-6 h-6" /> : "1"}
                  </div>
                  <span className={`text-xl font-kalam whitespace-nowrap ${newSurveyStep >= 1 ? 'text-landing-fg font-bold' : 'text-landing-fg/50'}`}>Thông tin khảo sát</span>
                </div>
                <div className="flex-1 h-1 mx-4 bg-landing-border border-t-2 border-dashed border-landing-border opacity-30" />

                {/* Step 2 */}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 radius-wobbly border-2 border-landing-border flex items-center justify-center font-bold text-xl shrink-0 ${newSurveyStep > 2 ? 'bg-landing-accent text-white' : newSurveyStep === 2 ? 'bg-landing-accent text-white' : 'bg-white text-landing-fg'}`}>
                    {newSurveyStep > 2 ? <Check className="w-6 h-6" /> : "2"}
                  </div>
                  <span className={`text-xl font-kalam whitespace-nowrap ${newSurveyStep >= 2 ? 'text-landing-fg font-bold' : 'text-landing-fg/50'}`}>Cấu hình phân phối</span>
                </div>
                <div className="flex-1 h-1 mx-4 bg-landing-border border-t-2 border-dashed border-landing-border opacity-30" />

                {/* Step 3 */}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 radius-wobbly border-2 border-landing-border flex items-center justify-center font-bold text-xl shrink-0 ${newSurveyStep === 3 ? 'bg-landing-accent text-white' : 'bg-white text-landing-fg'}`}>
                    3
                  </div>
                  <span className={`text-xl font-kalam whitespace-nowrap ${newSurveyStep === 3 ? 'text-landing-fg font-bold' : 'text-landing-fg/50'}`}>Đối tượng khảo sát</span>
                </div>
              </div>

              {/* Form Section */}
              {newSurveyStep === 1 && (
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold font-kalam text-landing-fg flex items-center gap-3 uppercase tracking-wide">
                    <FileText className="w-7 h-7 text-landing-accent" />
                    THÔNG TIN KHẢO SÁT (NỘI DUNG VÀ LIÊN KẾT)
                  </h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-lg font-bold text-landing-fg ml-2">Tiêu đề khảo sát <span className="text-landing-accent">*</span></label>
                      <input type="text" value={newSurveyTitle} onChange={(e) => setNewSurveyTitle(e.target.value)} placeholder="Ví dụ: Đánh giá dịch vụ Grab tại TP.HCM..." className="w-full h-14 px-5 text-xl bg-white border-[3px] border-landing-border radius-wobbly focus:outline-none focus:translate-y-[-2px] focus:shadow-hard-sm transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-lg font-bold text-landing-fg ml-2">Đường dẫn Google Form <span className="text-landing-accent">*</span></label>
                      <input type="url" value={newSurveyUrl} onChange={(e) => setNewSurveyUrl(e.target.value)} placeholder="https://docs.google.com/forms/d/..." className="w-full h-14 px-5 text-xl bg-white border-[3px] border-landing-border radius-wobbly focus:outline-none focus:translate-y-[-2px] focus:shadow-hard-sm transition-all" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 relative">
                      <div className="space-y-2">
                        <label className="text-lg font-bold text-landing-fg ml-2">Mã xác nhận <span className="text-landing-accent">*</span></label>
                        <input type="text" value={newSurveyCode} onChange={(e) => setNewSurveyCode(e.target.value)} placeholder="VD: HOANTHANH" className="w-full h-14 px-5 text-xl font-bold bg-white border-[3px] border-landing-border radius-wobbly focus:outline-none focus:translate-y-[-2px] focus:shadow-hard-sm transition-all font-mono uppercase" />
                      </div>
                      <div className="space-y-2 relative" ref={topicDropdownRef}>
                        <label className="text-lg font-bold text-landing-fg ml-2">Chủ đề khảo sát <span className="text-landing-accent">*</span> <span className="text-landing-fg/60 font-bold text-sm">(Chọn nhiều)</span></label>

                        <div
                          onClick={() => setIsSurveyTopicDropdownOpen(!isSurveyTopicDropdownOpen)}
                          className={`min-h-[56px] border-[3px] radius-wobbly bg-white p-2 flex items-center flex-wrap gap-2 pr-12 relative cursor-pointer transition-all ${isSurveyTopicDropdownOpen ? 'border-landing-accent ring-2 ring-landing-accent/20' : 'border-landing-border'}`}
                        >
                          {selectedSurveyTopics.length === 0 && (
                            <span className="text-lg text-landing-fg/50 px-3 font-bold">Chọn chủ đề...</span>
                          )}
                          {selectedSurveyTopics.map((topic) => (
                            <div key={topic} className="flex items-center gap-2 bg-landing-yellow text-landing-fg border-2 border-landing-border px-3 py-1 radius-wobbly text-sm font-bold shadow-[2px_2px_0_0_#2d2d2d] rotate-1">
                              {topic}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedSurveyTopics(selectedSurveyTopics.filter(t => t !== topic));
                                }}
                                className="hover:text-landing-accent rounded-full p-0.5"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-landing-fg transition-transform ${isSurveyTopicDropdownOpen ? 'rotate-180' : ''}`} />
                        </div>

                        {/* Dropdown Panel */}
                        {isSurveyTopicDropdownOpen && (
                          <div className="absolute top-[calc(100%+8px)] right-0 w-[calc(100vw-32px)] sm:w-[500px] md:w-[600px] max-w-[85vw] bg-white border-[3px] border-landing-border radius-wobbly shadow-hard z-50 overflow-hidden flex flex-col max-h-[400px] animate-scale-in">
                            {/* Search */}
                            <div className="p-4 border-b-[3px] border-dashed border-landing-border bg-paper">
                              <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-landing-fg/50" />
                                <input
                                  type="text"
                                  placeholder="Tìm kiếm chủ đề"
                                  value={surveyTopicSearch}
                                  onChange={(e) => setSurveyTopicSearch(e.target.value)}
                                  className="w-full h-12 pl-12 pr-4 bg-white radius-wobbly border-2 border-landing-border text-lg font-bold outline-none focus:shadow-hard-sm transition-all"
                                />
                              </div>
                            </div>

                            {/* Grid */}
                            <div className="p-5 overflow-y-auto flex-1 custom-scrollbar">
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-4">
                                {ALL_SURVEY_TOPICS.filter(t => removeDiacritics(t).includes(removeDiacritics(surveyTopicSearch))).map((topic) => {
                                  const isSelected = selectedSurveyTopics.includes(topic);
                                  return (
                                    <label key={topic} className="flex items-start gap-3 cursor-pointer group">
                                      <div className={`w-5 h-5 shrink-0 radius-wobbly border-2 mt-0.5 flex items-center justify-center transition-colors ${isSelected ? 'bg-landing-accent border-landing-accent' : 'border-landing-border bg-white group-hover:bg-landing-yellow'}`}>
                                        {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                                      </div>
                                      <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={isSelected}
                                        onChange={() => {
                                          if (isSelected) {
                                            setSelectedSurveyTopics(selectedSurveyTopics.filter(t => t !== topic));
                                          } else {
                                            setSelectedSurveyTopics([...selectedSurveyTopics, topic]);
                                          }
                                        }}
                                      />
                                      <span className={`text-lg leading-snug font-bold ${isSelected ? 'text-landing-fg underline decoration-wavy decoration-landing-accent' : 'text-landing-fg/70'}`}>{topic}</span>
                                    </label>
                                  )
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {newSurveyStep === 2 && (
                <div className="space-y-8 animate-fade-scale-in">
                  <h3 className="text-2xl font-bold font-kalam text-landing-fg flex items-center gap-3 uppercase tracking-wide">
                    <Zap className="w-7 h-7 text-landing-yellow fill-landing-yellow drop-shadow-[2px_2px_0_#2d2d2d]" />
                    CẤU HÌNH PHÂN PHỐI & PHẦN THƯỞNG
                  </h3>
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center bg-paper border-[3px] border-dashed border-landing-border radius-wobbly p-4 rotate-1">
                        <div>
                          <label className="text-lg font-bold text-landing-fg">Mức thưởng mỗi khảo sát</label>
                          <p className="text-sm font-bold text-landing-fg/70 mt-1">Nên đặt từ 25-50đ để tăng tốc độ phản hồi.</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="number" min="5" value={newSurveyBounty} onChange={(e) => setNewSurveyBounty(Number(e.target.value))} className="w-20 h-12 text-center text-xl font-bold bg-white border-2 border-landing-border radius-wobbly outline-none focus:shadow-hard-sm" />
                          <span className="text-xl font-bold font-kalam text-landing-fg">điểm</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center bg-paper border-[3px] border-dashed border-landing-border radius-wobbly p-4 -rotate-1">
                        <div>
                          <label className="text-lg font-bold text-landing-fg">Số lượng phản hồi mục tiêu</label>
                          <p className="text-sm font-bold text-landing-fg/70 mt-1">Khảo sát sẽ tự đóng khi đạt đủ số lượng.</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="number" min="10" value={newSurveyTarget} onChange={(e) => setNewSurveyTarget(Number(e.target.value))} className="w-20 h-12 text-center text-xl font-bold bg-white border-2 border-landing-border radius-wobbly outline-none focus:shadow-hard-sm" />
                          <span className="text-xl font-bold font-kalam text-landing-fg">người</span>
                        </div>
                      </div>
                    </div>

                    {/* Cost Calculation Banner */}
                    <div className="bg-landing-yellow/30 border-[3px] border-landing-border radius-wobbly p-6 mt-6 shadow-hard rotate-2 relative">
                      <div className="absolute top-2 left-2 w-4 h-4 bg-white border-2 border-landing-border rounded-full" />
                      <div className="absolute top-2 right-2 w-4 h-4 bg-white border-2 border-landing-border rounded-full" />
                      <h4 className="text-xl font-bold font-kalam text-landing-fg text-center mb-4 border-b-2 border-dashed border-landing-border/50 pb-2">Dự Toán Chi Phí Ký Quỹ</h4>
                      <div className="flex justify-between items-center mb-3 text-lg font-bold text-landing-fg/80">
                        <span>Chi phí trả thưởng ({newSurveyBounty}đ x {newSurveyTarget})</span>
                        <span>{newSurveyBounty * newSurveyTarget}đ</span>
                      </div>
                      <div className="flex justify-between items-center mb-4 text-lg font-bold text-landing-fg/80">
                        <span>Phí nền tảng (0đ - Khuyến mãi)</span>
                        <span className="text-landing-secondary">0đ</span>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t-[3px] border-landing-border">
                        <span className="font-bold text-xl text-landing-fg">Tổng ký quỹ:</span>
                        <span className="text-4xl font-bold font-kalam text-landing-accent">
                          {newSurveyBounty * newSurveyTarget}<span className="text-2xl">đ</span>
                        </span>
                      </div>

                      {balance < (newSurveyBounty * newSurveyTarget) && (
                        <div className="mt-4 p-3 bg-red-100 border-2 border-landing-accent radius-wobbly flex items-center gap-3 text-landing-accent font-bold text-lg animate-shake">
                          <AlertCircle className="w-6 h-6 flex-shrink-0" />
                          <p>Số dư không đủ! Bạn cần thêm {(newSurveyBounty * newSurveyTarget) - balance}đ.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {newSurveyStep === 3 && (
                <div className="space-y-8 animate-fade-scale-in">
                  <h3 className="text-2xl font-bold font-kalam text-landing-fg flex items-center gap-3 uppercase tracking-wide">
                    <Target className="w-7 h-7 text-landing-secondary" />
                    ĐỐI TƯỢNG KHẢO SÁT (TARGETING)
                  </h3>

                  <div className="bg-landing-yellow/20 border-[3px] border-landing-border radius-wobbly p-6 shadow-hard-sm rotate-1">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 radius-wobbly bg-white border-2 border-landing-border flex items-center justify-center text-landing-secondary shrink-0 rotate-3">
                        <Info className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-landing-fg">Rescom sẽ tự động phân phối khảo sát của bạn dựa trên chủ đề đã chọn ở Bước 1.</p>
                        <p className="text-sm font-bold text-landing-fg/70 mt-2">Tính năng chọn lọc sinh viên theo trường và khu vực đang được nâng cấp trong phiên bản Beta tiếp theo.</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-lg font-bold text-landing-fg ml-2">Phạm vi ưu tiên</label>
                    <select value={newSurveyRegion} onChange={(e) => setNewSurveyRegion(e.target.value)} className="w-full h-14 px-5 appearance-none border-[3px] border-landing-border radius-wobbly text-xl font-bold text-landing-fg focus:outline-none focus:translate-y-[-2px] focus:shadow-hard-sm bg-white transition-all cursor-pointer">
                      <option value="Toàn quốc">Toàn quốc (Tất cả khu vực)</option>
                      <option value="Miền Bắc">Khu vực Miền Bắc (Hà Nội,...)</option>
                      <option value="Miền Trung">Khu vực Miền Trung (Đà Nẵng,...)</option>
                      <option value="Miền Nam">Khu vực Miền Nam (TP.HCM,...)</option>
                    </select>
                  </div>
                </div>
              )}

            </div>

            {/* Footer Actions */}
            <div className="px-8 py-6 border-t-[3px] border-dashed border-landing-border bg-paper flex items-center justify-between">
              {newSurveyStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setNewSurveyStep(prev => prev - 1)}
                  className="px-6 h-12 radius-wobbly border-[3px] border-landing-border bg-white text-landing-fg font-bold text-lg hover:bg-landing-yellow shadow-hard-sm transition-all -rotate-1"
                >
                  Quay lại
                </button>
              ) : (
                <div />
              )}

              {newSurveyStep < 3 ? (
                <button
                  type="button"
                  onClick={() => setNewSurveyStep(prev => prev + 1)}
                  className="px-8 h-14 radius-wobbly border-[3px] border-landing-border bg-landing-fg text-white font-bold text-lg hover:bg-landing-accent shadow-hard active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all rotate-1"
                >
                  Tiếp theo
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCreateSurvey}
                  disabled={balance < (newSurveyBounty * newSurveyTarget)}
                  className={`px-8 h-14 radius-wobbly border-[3px] border-landing-border font-bold text-lg shadow-hard flex items-center gap-2 transition-all rotate-2 ${balance < (newSurveyBounty * newSurveyTarget)
                    ? 'bg-landing-muted text-landing-fg/50 cursor-not-allowed shadow-none'
                    : 'bg-landing-accent text-white hover:bg-[#d43f3f] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none'
                    }`}
                >
                  <CheckCircle className="w-6 h-6" />
                  Đăng khảo sát
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
