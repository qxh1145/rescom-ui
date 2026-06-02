"use client"

import React, { useState, useRef, useCallback, useEffect } from "react"
import Link from "next/link"
import {
  Type,
  AlignLeft,
  CircleDot,
  CheckSquare,
  ChevronDown,
  Star,
  SlidersHorizontal,
  Calendar,
  Mail,
  Phone,
  Heading,
  ImageIcon,
  Plus,
  Trash2,
  Copy,
  GripVertical,
  Eye,
  Save,
  Send,
  ArrowLeft,
  X,
  ChevronRight,
  Sparkles,
  FileText,
  ToggleLeft,
  PlusCircle,
  Pencil,
  MousePointerClick,
  Layers,
  Settings,
  Check,
} from "lucide-react"

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

type ComponentType =
  | "short_text"
  | "long_text"
  | "multiple_choice"
  | "checkbox"
  | "dropdown"
  | "rating"
  | "likert"
  | "date"
  | "email"
  | "phone"
  | "heading"
  | "image"

interface FormComponent {
  id: string
  type: ComponentType
  label: string
  description: string
  placeholder: string
  required: boolean
  options: string[] // For multiple_choice, checkbox, dropdown
  ratingMax: number // For rating
  likertLabels: string[] // For likert
}

interface ToastMsg {
  id: string
  text: string
}

// ──────────────────────────────────────────────
// Component Definitions (Palette)
// ──────────────────────────────────────────────

const COMPONENT_DEFS: {
  type: ComponentType
  label: string
  icon: React.ReactNode
  category: "input" | "choice" | "special"
}[] = [
    { type: "short_text", label: "Câu hỏi Ngắn", icon: <Type className="w-4 h-4" />, category: "input" },
    { type: "long_text", label: "Câu hỏi Dài", icon: <AlignLeft className="w-4 h-4" />, category: "input" },
    { type: "email", label: "Email", icon: <Mail className="w-4 h-4" />, category: "input" },
    { type: "phone", label: "Số điện thoại", icon: <Phone className="w-4 h-4" />, category: "input" },
    { type: "date", label: "Ngày tháng", icon: <Calendar className="w-4 h-4" />, category: "input" },
    { type: "multiple_choice", label: "Trắc nghiệm", icon: <CircleDot className="w-4 h-4" />, category: "choice" },
    { type: "checkbox", label: "Checkbox", icon: <CheckSquare className="w-4 h-4" />, category: "choice" },
    { type: "dropdown", label: "Dropdown", icon: <ChevronDown className="w-4 h-4" />, category: "choice" },
    { type: "rating", label: "Thang điểm", icon: <Star className="w-4 h-4" />, category: "choice" },
    { type: "likert", label: "Likert Scale", icon: <SlidersHorizontal className="w-4 h-4" />, category: "choice" },
    { type: "heading", label: "Tiêu đề", icon: <Heading className="w-4 h-4" />, category: "special" },
    { type: "image", label: "Hình ảnh", icon: <ImageIcon className="w-4 h-4" />, category: "special" },
  ]

// ──────────────────────────────────────────────
// Default values for new components
// ──────────────────────────────────────────────

function createDefaultComponent(type: ComponentType): FormComponent {
  const id = `comp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
  const base: FormComponent = {
    id,
    type,
    label: "",
    description: "",
    placeholder: "",
    required: false,
    options: [],
    ratingMax: 5,
    likertLabels: ["Rất không đồng ý", "Không đồng ý", "Bình thường", "Đồng ý", "Rất đồng ý"],
  }

  switch (type) {
    case "short_text":
      base.label = "Câu hỏi ngắn"
      base.placeholder = "Nhập câu trả lời..."
      break
    case "long_text":
      base.label = "Câu hỏi dài"
      base.placeholder = "Nhập câu trả lời chi tiết..."
      break
    case "multiple_choice":
      base.label = "Câu hỏi trắc nghiệm"
      base.options = ["Lựa chọn 1", "Lựa chọn 2", "Lựa chọn 3"]
      break
    case "checkbox":
      base.label = "Câu hỏi nhiều đáp án"
      base.options = ["Tùy chọn 1", "Tùy chọn 2", "Tùy chọn 3"]
      break
    case "dropdown":
      base.label = "Câu hỏi chọn từ danh sách"
      base.options = ["Mục 1", "Mục 2", "Mục 3"]
      break
    case "rating":
      base.label = "Đánh giá mức độ hài lòng"
      base.ratingMax = 5
      break
    case "likert":
      base.label = "Mức độ đồng ý với nhận định"
      break
    case "date":
      base.label = "Chọn ngày"
      break
    case "email":
      base.label = "Địa chỉ Email"
      base.placeholder = "example@email.com"
      break
    case "phone":
      base.label = "Số điện thoại"
      base.placeholder = "0912 345 678"
      break
    case "heading":
      base.label = "Phần mới"
      base.description = "Mô tả cho phần này"
      break
    case "image":
      base.label = "Hình ảnh minh họa"
      base.description = "Thêm mô tả cho hình ảnh"
      break
  }

  return base
}

// ──────────────────────────────────────────────
// Category labels
// ──────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  input: "Nhập liệu",
  choice: "Lựa chọn",
  special: "Đặc biệt",
}

// ──────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────

export default function SurveyBuilderPage() {
  // Form data
  const [formTitle, setFormTitle] = useState("Khảo sát không tiêu đề")
  const [formDescription, setFormDescription] = useState("")
  const [components, setComponents] = useState<FormComponent[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isEditingTitle, setIsEditingTitle] = useState(false)

  // Drag state
  const [dragType, setDragType] = useState<"palette" | "reorder" | null>(null)
  const [dragData, setDragData] = useState<ComponentType | string | null>(null)
  const [dropIndex, setDropIndex] = useState<number | null>(null)
  const [isDraggingOver, setIsDraggingOver] = useState(false)

  // UI state
  const [showPreview, setShowPreview] = useState(false)
  const [toasts, setToasts] = useState<ToastMsg[]>([])
  const [publishSuccess, setPublishSuccess] = useState(false)

  const canvasRef = useRef<HTMLDivElement>(null)
  const titleInputRef = useRef<HTMLInputElement>(null)

  // Selected component
  const selectedComponent = components.find((c) => c.id === selectedId) || null

  // Toast
  const showToast = useCallback((text: string) => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, text }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }, [])

  // Focus title input when editing
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus()
      titleInputRef.current.select()
    }
  }, [isEditingTitle])

  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowPreview(false)
        setSelectedId(null)
        setIsEditingTitle(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // ──────────────────────────────────────
  // Drag & Drop — Palette → Canvas
  // ──────────────────────────────────────

  const handlePaletteDragStart = (e: React.DragEvent, type: ComponentType) => {
    setDragType("palette")
    setDragData(type)
    e.dataTransfer.effectAllowed = "copy"
    e.dataTransfer.setData("text/plain", type)
    // Custom drag image
    const ghost = document.createElement("div")
    ghost.textContent = COMPONENT_DEFS.find((d) => d.type === type)?.label || type
    ghost.style.cssText =
      "position:absolute;top:-9999px;padding:8px 16px;background:#3db87a;color:white;border-radius:12px;font-size:13px;font-weight:600;box-shadow:0 4px 12px rgba(0,0,0,0.15);"
    document.body.appendChild(ghost)
    e.dataTransfer.setDragImage(ghost, 60, 20)
    requestAnimationFrame(() => document.body.removeChild(ghost))
  }

  // ──────────────────────────────────────
  // Drag & Drop — Reorder within Canvas
  // ──────────────────────────────────────

  const handleReorderDragStart = (e: React.DragEvent, compId: string) => {
    setDragType("reorder")
    setDragData(compId)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", compId)
  }

  // ──────────────────────────────────────
  // Canvas Drop handlers
  // ──────────────────────────────────────

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = dragType === "palette" ? "copy" : "move"
    setIsDraggingOver(true)

    // Calculate insertion index from mouse position
    if (canvasRef.current) {
      const children = Array.from(canvasRef.current.querySelectorAll("[data-comp-index]"))
      let insertIdx = components.length

      for (let i = 0; i < children.length; i++) {
        const rect = children[i].getBoundingClientRect()
        const midY = rect.top + rect.height / 2
        if (e.clientY < midY) {
          insertIdx = parseInt(children[i].getAttribute("data-comp-index") || "0", 10)
          break
        }
      }
      setDropIndex(insertIdx)
    }
  }

  const handleCanvasDragLeave = (e: React.DragEvent) => {
    // Only reset if leaving the canvas entirely
    if (canvasRef.current && !canvasRef.current.contains(e.relatedTarget as Node)) {
      setIsDraggingOver(false)
      setDropIndex(null)
    }
  }

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingOver(false)

    const insertAt = dropIndex ?? components.length
    setDropIndex(null)

    if (dragType === "palette" && dragData) {
      // Create new component from palette
      const newComp = createDefaultComponent(dragData as ComponentType)
      setComponents((prev) => {
        const copy = [...prev]
        copy.splice(insertAt, 0, newComp)
        return copy
      })
      setSelectedId(newComp.id)
      showToast("✨ Đã thêm component mới!")
    } else if (dragType === "reorder" && dragData) {
      // Reorder existing component
      const fromIdx = components.findIndex((c) => c.id === dragData)
      if (fromIdx !== -1 && fromIdx !== insertAt) {
        setComponents((prev) => {
          const copy = [...prev]
          const [moved] = copy.splice(fromIdx, 1)
          const adjustedIdx = insertAt > fromIdx ? insertAt - 1 : insertAt
          copy.splice(adjustedIdx, 0, moved)
          return copy
        })
      }
    }

    setDragType(null)
    setDragData(null)
  }

  const handleDragEnd = () => {
    setDragType(null)
    setDragData(null)
    setIsDraggingOver(false)
    setDropIndex(null)
  }

  // ──────────────────────────────────────
  // Component CRUD
  // ──────────────────────────────────────

  const updateComponent = (id: string, updates: Partial<FormComponent>) => {
    setComponents((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)))
  }

  const deleteComponent = (id: string) => {
    setComponents((prev) => prev.filter((c) => c.id !== id))
    if (selectedId === id) setSelectedId(null)
    showToast("🗑️ Đã xóa component")
  }

  const duplicateComponent = (id: string) => {
    const original = components.find((c) => c.id === id)
    if (!original) return
    const duplicate: FormComponent = {
      ...original,
      id: `comp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      label: `${original.label} (bản sao)`,
    }
    const idx = components.findIndex((c) => c.id === id)
    setComponents((prev) => {
      const copy = [...prev]
      copy.splice(idx + 1, 0, duplicate)
      return copy
    })
    setSelectedId(duplicate.id)
    showToast("📋 Đã nhân đôi component")
  }

  // Option management for choice-based components
  const addOption = (id: string) => {
    const comp = components.find((c) => c.id === id)
    if (!comp) return
    updateComponent(id, { options: [...comp.options, `Lựa chọn ${comp.options.length + 1}`] })
  }

  const updateOption = (id: string, optIdx: number, value: string) => {
    const comp = components.find((c) => c.id === id)
    if (!comp) return
    const newOpts = [...comp.options]
    newOpts[optIdx] = value
    updateComponent(id, { options: newOpts })
  }

  const removeOption = (id: string, optIdx: number) => {
    const comp = components.find((c) => c.id === id)
    if (!comp || comp.options.length <= 1) return
    updateComponent(id, { options: comp.options.filter((_, i) => i !== optIdx) })
  }

  // ──────────────────────────────────────
  // Save & Publish
  // ──────────────────────────────────────

  const handleSave = () => {
    showToast("💾 Đã lưu nháp thành công!")
  }

  const handlePublish = () => {
    if (components.length === 0) {
      showToast(" Vui lòng thêm ít nhất 1 câu hỏi!")
      return
    }
    setPublishSuccess(true)
    showToast(" Khảo sát đã được xuất bản thành công!")
    setTimeout(() => setPublishSuccess(false), 3000)
  }

  // ──────────────────────────────────────
  // Render Component Icon
  // ──────────────────────────────────────

  const getCompIcon = (type: ComponentType) => {
    const def = COMPONENT_DEFS.find((d) => d.type === type)
    return def?.icon || <FileText className="w-4 h-4" />
  }

  const getCompLabel = (type: ComponentType) => {
    const def = COMPONENT_DEFS.find((d) => d.type === type)
    return def?.label || type
  }

  // ──────────────────────────────────────
  // Render Component Preview on Canvas
  // ──────────────────────────────────────

  const renderComponentPreview = (comp: FormComponent) => {
    switch (comp.type) {
      case "short_text":
        return (
          <div className="mt-2">
            <div className="w-full h-10 bg-[#FAF8F1] border border-[#E5E7EB] rounded-xl px-3 flex items-center text-sm text-[#9CA3AF]">
              {comp.placeholder || "Nhập câu trả lời..."}
            </div>
          </div>
        )
      case "long_text":
        return (
          <div className="mt-2">
            <div className="w-full h-20 bg-[#FAF8F1] border border-[#E5E7EB] rounded-xl px-3 pt-2.5 text-sm text-[#9CA3AF]">
              {comp.placeholder || "Nhập câu trả lời chi tiết..."}
            </div>
          </div>
        )
      case "multiple_choice":
        return (
          <div className="mt-2 space-y-2">
            {comp.options.map((opt, i) => (
              <label key={i} className="flex items-center gap-2.5 text-sm text-[#374151]">
                <div className="w-4 h-4 rounded-full border-2 border-[#C7D2C9] flex-shrink-0" />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        )
      case "checkbox":
        return (
          <div className="mt-2 space-y-2">
            {comp.options.map((opt, i) => (
              <label key={i} className="flex items-center gap-2.5 text-sm text-[#374151]">
                <div className="w-4 h-4 rounded border-2 border-[#C7D2C9] flex-shrink-0" />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        )
      case "dropdown":
        return (
          <div className="mt-2">
            <div className="w-full h-10 bg-[#FAF8F1] border border-[#E5E7EB] rounded-xl px-3 flex items-center justify-between text-sm text-[#9CA3AF]">
              <span>Chọn một mục...</span>
              <ChevronDown className="w-4 h-4 text-[#6B7280]" />
            </div>
          </div>
        )
      case "rating":
        return (
          <div className="mt-2 flex gap-1.5">
            {Array.from({ length: comp.ratingMax }).map((_, i) => (
              <Star
                key={i}
                className={`w-7 h-7 ${i < 3 ? "text-amber-400 fill-amber-400" : "text-[#D1D5DB]"} transition-colors cursor-pointer hover:text-amber-400 hover:fill-amber-400`}
              />
            ))}
          </div>
        )
      case "likert":
        return (
          <div className="mt-2 overflow-x-auto">
            <div className="flex gap-1">
              {comp.likertLabels.map((lbl, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 min-w-[72px]">
                  <div className="w-4 h-4 rounded-full border-2 border-[#C7D2C9]" />
                  <span className="text-[10px] text-[#6B7280] text-center leading-tight">{lbl}</span>
                </div>
              ))}
            </div>
          </div>
        )
      case "date":
        return (
          <div className="mt-2">
            <div className="w-full max-w-[220px] h-10 bg-[#FAF8F1] border border-[#E5E7EB] rounded-xl px-3 flex items-center justify-between text-sm text-[#9CA3AF]">
              <span>dd/mm/yyyy</span>
              <Calendar className="w-4 h-4 text-[#6B7280]" />
            </div>
          </div>
        )
      case "email":
        return (
          <div className="mt-2">
            <div className="w-full h-10 bg-[#FAF8F1] border border-[#E5E7EB] rounded-xl px-3 flex items-center gap-2 text-sm text-[#9CA3AF]">
              <Mail className="w-4 h-4 text-[#9CA3AF]" />
              <span>{comp.placeholder || "example@email.com"}</span>
            </div>
          </div>
        )
      case "phone":
        return (
          <div className="mt-2">
            <div className="w-full h-10 bg-[#FAF8F1] border border-[#E5E7EB] rounded-xl px-3 flex items-center gap-2 text-sm text-[#9CA3AF]">
              <Phone className="w-4 h-4 text-[#9CA3AF]" />
              <span>{comp.placeholder || "0912 345 678"}</span>
            </div>
          </div>
        )
      case "heading":
        return (
          <div className="mt-1">
            <div className="w-full h-px bg-[#E5E7EB] mt-1" />
            {comp.description && <p className="text-xs text-[#6B7280] mt-2">{comp.description}</p>}
          </div>
        )
      case "image":
        return (
          <div className="mt-2 w-full h-28 bg-[#FAF8F1] border-2 border-dashed border-[#C7D2C9] rounded-xl flex flex-col items-center justify-center gap-1.5 text-[#6B7280]">
            <ImageIcon className="w-8 h-8" />
            <span className="text-xs font-medium">Kéo thả hoặc nhấp để tải ảnh lên</span>
          </div>
        )
      default:
        return null
    }
  }

  // ──────────────────────────────────────
  // Render Preview Form (in modal)
  // ──────────────────────────────────────

  const renderPreviewField = (comp: FormComponent, index: number) => {
    return (
      <div key={comp.id} className="space-y-2">
        {comp.type === "heading" ? (
          <div className="pt-4 first:pt-0">
            <h3 className="text-lg font-bold text-[#1A1A1A]">{comp.label}</h3>
            {comp.description && <p className="text-sm text-[#6B7280] mt-0.5">{comp.description}</p>}
            <div className="w-full h-px bg-[#E5E7EB] mt-3" />
          </div>
        ) : (
          <>
            <label className="text-sm font-semibold text-[#1A1A1A] flex items-center gap-1">
              <span>
                {index + 1}. {comp.label}
              </span>
              {comp.required && <span className="text-red-500">*</span>}
            </label>
            {comp.description && <p className="text-xs text-[#6B7280] -mt-1">{comp.description}</p>}
            {comp.type === "short_text" && (
              <input
                type="text"
                placeholder={comp.placeholder}
                className="w-full h-11 px-4 text-sm border border-[#E5E7EB] rounded-xl bg-white focus:border-[#3db87a] focus:ring-4 focus:ring-green-100 outline-none transition-all"
              />
            )}
            {comp.type === "long_text" && (
              <textarea
                placeholder={comp.placeholder}
                rows={3}
                className="w-full px-4 py-3 text-sm border border-[#E5E7EB] rounded-xl bg-white focus:border-[#3db87a] focus:ring-4 focus:ring-green-100 outline-none transition-all resize-none"
              />
            )}
            {comp.type === "multiple_choice" && (
              <div className="space-y-2">
                {comp.options.map((opt, i) => (
                  <label key={i} className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name={`preview-${comp.id}`} className="sr-only peer" />
                    <div className="w-5 h-5 rounded-full border-2 border-[#C7D2C9] peer-checked:border-[#3db87a] peer-checked:bg-[#3db87a] flex items-center justify-center transition-all group-hover:border-[#3db87a]">
                      <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100" />
                    </div>
                    <span className="text-sm text-[#374151]">{opt}</span>
                  </label>
                ))}
              </div>
            )}
            {comp.type === "checkbox" && (
              <div className="space-y-2">
                {comp.options.map((opt, i) => (
                  <label key={i} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-5 h-5 rounded border-2 border-[#C7D2C9] peer-checked:border-[#3db87a] peer-checked:bg-[#3db87a] flex items-center justify-center transition-all group-hover:border-[#3db87a]">
                      <Check className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" />
                    </div>
                    <span className="text-sm text-[#374151]">{opt}</span>
                  </label>
                ))}
              </div>
            )}
            {comp.type === "dropdown" && (
              <select className="w-full h-11 px-4 text-sm border border-[#E5E7EB] rounded-xl bg-white focus:border-[#3db87a] focus:ring-4 focus:ring-green-100 outline-none transition-all">
                <option value="">Chọn một mục...</option>
                {comp.options.map((opt, i) => (
                  <option key={i} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}
            {comp.type === "rating" && (
              <div className="flex gap-1.5">
                {Array.from({ length: comp.ratingMax }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className="text-[#D1D5DB] hover:text-amber-400 transition-colors"
                  >
                    <Star className="w-8 h-8 hover:fill-amber-400" />
                  </button>
                ))}
              </div>
            )}
            {comp.type === "likert" && (
              <div className="overflow-x-auto">
                <div className="flex justify-between min-w-[320px]">
                  {comp.likertLabels.map((lbl, i) => (
                    <label key={i} className="flex flex-col items-center gap-2 cursor-pointer">
                      <input type="radio" name={`preview-likert-${comp.id}`} className="sr-only peer" />
                      <div className="w-5 h-5 rounded-full border-2 border-[#C7D2C9] peer-checked:border-[#3db87a] peer-checked:bg-[#3db87a] transition-all" />
                      <span className="text-[11px] text-[#6B7280] text-center max-w-[72px]">{lbl}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            {comp.type === "date" && (
              <input
                type="date"
                className="w-full max-w-[220px] h-11 px-4 text-sm border border-[#E5E7EB] rounded-xl bg-white focus:border-[#3db87a] focus:ring-4 focus:ring-green-100 outline-none transition-all"
              />
            )}
            {comp.type === "email" && (
              <input
                type="email"
                placeholder={comp.placeholder || "example@email.com"}
                className="w-full h-11 px-4 text-sm border border-[#E5E7EB] rounded-xl bg-white focus:border-[#3db87a] focus:ring-4 focus:ring-green-100 outline-none transition-all"
              />
            )}
            {comp.type === "phone" && (
              <input
                type="tel"
                placeholder={comp.placeholder || "0912 345 678"}
                className="w-full h-11 px-4 text-sm border border-[#E5E7EB] rounded-xl bg-white focus:border-[#3db87a] focus:ring-4 focus:ring-green-100 outline-none transition-all"
              />
            )}
            {comp.type === "image" && (
              <div className="w-full h-32 bg-[#FAF8F1] border-2 border-dashed border-[#C7D2C9] rounded-xl flex flex-col items-center justify-center gap-1.5 text-[#6B7280]">
                <ImageIcon className="w-8 h-8" />
                <span className="text-xs">Tải ảnh lên</span>
              </div>
            )}
          </>
        )}
      </div>
    )
  }

  // ──────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────

  return (
    <div className="h-screen flex flex-col bg-[#FAF8F1] text-[#1A1A1A] font-sans antialiased overflow-hidden select-none">
      {/* Toast */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-xs pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="p-3 rounded-xl shadow-xl bg-white border border-[#E5E7EB] pointer-events-auto flex items-center gap-2.5 animate-fade-scale-in"
          >
            <div className="w-7 h-7 rounded-full bg-[#E8F3EC] flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-[#3db87a]" />
            </div>
            <p className="text-xs font-semibold text-[#1A1A1A] flex-1">{toast.text}</p>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="text-[#9CA3AF] hover:text-[#374151] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* ─── HEADER BAR ─── */}
      <header className="h-16 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-5 flex-shrink-0 z-20 shadow-sm">
        {/* Left: Back + Title */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Link
            href="/"
            className="p-2 rounded-xl text-[#6B7280] hover:text-[#3db87a] hover:bg-[#E8F3EC] transition-all flex-shrink-0"
            title="Quay lại Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="w-px h-8 bg-[#E5E7EB] flex-shrink-0" />

          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#3db87a] flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-white" />
            </div>

            {isEditingTitle ? (
              <input
                ref={titleInputRef}
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setIsEditingTitle(false)
                }}
                className="flex-1 min-w-0 h-9 px-2 text-base font-bold text-[#1A1A1A] border border-[#3db87a] rounded-lg focus:ring-4 focus:ring-green-100 outline-none transition-all bg-white"
              />
            ) : (
              <button
                onClick={() => setIsEditingTitle(true)}
                className="flex items-center gap-1.5 min-w-0 group"
              >
                <h1 className="text-base font-bold text-[#1A1A1A] truncate group-hover:text-[#3db87a] transition-colors">
                  {formTitle}
                </h1>
                <Pencil className="w-3.5 h-3.5 text-[#9CA3AF] group-hover:text-[#3db87a] flex-shrink-0 transition-colors" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#6B7280] hover:text-[#3db87a] hover:bg-[#E8F3EC] border border-[#E5E7EB] transition-all"
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">Lưu nháp</span>
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#3db87a] bg-[#E8F3EC] hover:bg-[#C7D2C9]/60 border border-[#3db87a]/10 transition-all"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Xem trước</span>
          </button>
          <button
            onClick={handlePublish}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#3db87a] hover:bg-[#13422C] shadow-md shadow-green-950/20 active:scale-95 transition-all"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Xuất bản</span>
          </button>
        </div>
      </header>

      {/* ─── MAIN 3-PANEL LAYOUT ─── */}
      <div className="flex-1 flex overflow-hidden">
        {/* ─── LEFT SIDEBAR: Component Palette ─── */}
        <aside className="w-[260px] bg-white border-r border-[#E5E7EB] flex flex-col flex-shrink-0 overflow-hidden">
          {/* Palette Header */}
          <div className="p-4 border-b border-[#E5E7EB] bg-[#FEFCF7]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#E8F3EC] flex items-center justify-center">
                <Layers className="w-4 h-4 text-[#3db87a]" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#1A1A1A]">Thành phần</h2>
                <p className="text-[10px] text-[#6B7280]">Kéo thả vào form của bạn</p>
              </div>
            </div>
          </div>

          {/* Palette Items grouped by category */}
          <div className="flex-1 overflow-y-auto builder-scroll p-3 space-y-4">
            {(["input", "choice", "special"] as const).map((cat) => {
              const items = COMPONENT_DEFS.filter((d) => d.category === cat)
              return (
                <div key={cat}>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#9CA3AF] mb-2 px-1">
                    {CATEGORY_LABELS[cat]}
                  </p>
                  <div className="space-y-1">
                    {items.map((def) => (
                      <div
                        key={def.type}
                        draggable
                        onDragStart={(e) => handlePaletteDragStart(e, def.type)}
                        onDragEnd={handleDragEnd}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-transparent hover:border-[#E5E7EB] hover:bg-[#FAF8F1] cursor-grab active:cursor-grabbing transition-all group active:scale-[0.97] select-none"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#E8F3EC] flex items-center justify-center text-[#3db87a] flex-shrink-0 group-hover:bg-[#3db87a] group-hover:text-white transition-all">
                          {def.icon}
                        </div>
                        <span className="text-xs font-semibold text-[#374151] group-hover:text-[#3db87a] transition-colors">
                          {def.label}
                        </span>
                        <GripVertical className="w-3.5 h-3.5 text-[#D1D5DB] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Palette Footer: component count */}
          <div className="p-3 border-t border-[#E5E7EB] bg-[#FEFCF7]">
            <div className="flex items-center justify-between text-[11px] text-[#6B7280]">
              <span className="font-semibold">Câu hỏi trong form:</span>
              <span className="font-bold text-[#3db87a] bg-[#E8F3EC] px-2 py-0.5 rounded-md">
                {components.length}
              </span>
            </div>
          </div>
        </aside>

        {/* ─── CENTER: Canvas (Drop Zone) ─── */}
        <main className="flex-1 overflow-y-auto builder-scroll bg-[#F0EDE4]">
          <div className="max-w-2xl mx-auto py-8 px-6">
            {/* Form Title Card */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6 mb-6">
              <div className="border-l-4 border-[#3db87a] pl-4">
                <h2 className="text-xl font-bold text-[#1A1A1A]">{formTitle}</h2>
                <input
                  type="text"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Thêm mô tả cho khảo sát (không bắt buộc)..."
                  className="mt-1.5 w-full text-sm text-[#6B7280] placeholder-[#C7D2C9] bg-transparent border-none outline-none"
                />
              </div>
            </div>

            {/* Drop Zone */}
            <div
              ref={canvasRef}
              onDragOver={handleCanvasDragOver}
              onDragLeave={handleCanvasDragLeave}
              onDrop={handleCanvasDrop}
              className={`min-h-[300px] rounded-2xl transition-all duration-200 ${isDraggingOver
                ? "border-2 border-dashed border-[#3db87a]/40 bg-[#E8F3EC]/20 animate-drop-zone-pulse"
                : components.length === 0
                  ? "border-2 border-dashed border-[#D1D5DB]"
                  : ""
                }`}
            >
              {components.length === 0 && !isDraggingOver ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-[#C7D2C9] shadow-sm">
                    <MousePointerClick className="w-10 h-10" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-[#374151]">Kéo thả câu hỏi vào đây</h3>
                    <p className="text-xs text-[#9CA3AF] max-w-sm">
                      Chọn các thành phần từ bảng bên trái và kéo thả vào khu vực này để bắt đầu xây dựng khảo sát
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const newComp = createDefaultComponent("short_text")
                      setComponents([newComp])
                      setSelectedId(newComp.id)
                    }}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#3db87a] text-white text-xs font-bold hover:bg-[#13422C] shadow-md shadow-green-950/20 active:scale-95 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Thêm câu hỏi đầu tiên</span>
                  </button>
                </div>
              ) : (
                /* Component Cards */
                <div className="space-y-3 p-1">
                  {components.map((comp, index) => {
                    const isSelected = selectedId === comp.id
                    const isDraggedItem = dragType === "reorder" && dragData === comp.id

                    return (
                      <React.Fragment key={comp.id}>
                        {/* Drop Insertion Line */}
                        {dropIndex === index && isDraggingOver && (
                          <div className="flex items-center gap-2 py-1 animate-insertion-line">
                            <div className="w-3 h-3 rounded-full bg-[#3db87a] border-2 border-white shadow" />
                            <div className="flex-1 h-0.5 bg-[#3db87a] rounded-full" />
                            <div className="w-3 h-3 rounded-full bg-[#3db87a] border-2 border-white shadow" />
                          </div>
                        )}

                        <div
                          data-comp-index={index}
                          draggable
                          onDragStart={(e) => handleReorderDragStart(e, comp.id)}
                          onDragEnd={handleDragEnd}
                          onClick={() => setSelectedId(isSelected ? null : comp.id)}
                          className={`group relative bg-white rounded-2xl border-2 transition-all duration-200 cursor-pointer ${isDraggedItem
                            ? "opacity-40 scale-95"
                            : isSelected
                              ? "border-[#3db87a] shadow-lg shadow-green-950/5 ring-4 ring-green-100"
                              : "border-[#E5E7EB] hover:border-[#C7D2C9] hover:shadow-md"
                            }`}
                        >
                          {/* Component Card Content */}
                          <div className="p-5">
                            {/* Top bar: drag handle + type badge + actions */}
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {/* Drag Handle */}
                                <div
                                  className="p-1 rounded cursor-grab active:cursor-grabbing text-[#C7D2C9] hover:text-[#6B7280] transition-colors"
                                  title="Kéo để sắp xếp lại"
                                >
                                  <GripVertical className="w-4 h-4" />
                                </div>

                                {/* Type Badge */}
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#E8F3EC] text-[#3db87a]">
                                  {getCompIcon(comp.type)}
                                  <span className="text-[10px] font-bold">{getCompLabel(comp.type)}</span>
                                </div>

                                {/* Required badge */}
                                {comp.required && (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-50 text-red-500 border border-red-100">
                                    Bắt buộc
                                  </span>
                                )}
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    duplicateComponent(comp.id)
                                  }}
                                  className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#3db87a] hover:bg-[#E8F3EC] transition-all"
                                  title="Nhân đôi"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    deleteComponent(comp.id)
                                  }}
                                  className="p-1.5 rounded-lg text-[#6B7280] hover:text-red-500 hover:bg-red-50 transition-all"
                                  title="Xóa"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Question Label */}
                            {comp.type === "heading" ? (
                              <h3 className="text-base font-bold text-[#1A1A1A]">{comp.label}</h3>
                            ) : (
                              <p className="text-sm font-semibold text-[#1A1A1A]">
                                {comp.label}
                              </p>
                            )}

                            {/* Component Preview */}
                            {renderComponentPreview(comp)}
                          </div>

                          {/* Selected indicator bar */}
                          {isSelected && (
                            <div className="absolute left-0 top-3 bottom-3 w-1 bg-[#3db87a] rounded-r-full" />
                          )}
                        </div>
                      </React.Fragment>
                    )
                  })}

                  {/* Bottom insertion line */}
                  {dropIndex === components.length && isDraggingOver && (
                    <div className="flex items-center gap-2 py-1 animate-insertion-line">
                      <div className="w-3 h-3 rounded-full bg-[#3db87a] border-2 border-white shadow" />
                      <div className="flex-1 h-0.5 bg-[#3db87a] rounded-full" />
                      <div className="w-3 h-3 rounded-full bg-[#3db87a] border-2 border-white shadow" />
                    </div>
                  )}

                  {/* Add component button at bottom */}
                  {components.length > 0 && !isDraggingOver && (
                    <button
                      onClick={() => {
                        const newComp = createDefaultComponent("short_text")
                        setComponents((prev) => [...prev, newComp])
                        setSelectedId(newComp.id)
                      }}
                      className="w-full py-3 rounded-xl border-2 border-dashed border-[#D1D5DB] text-[#9CA3AF] hover:border-[#3db87a]/30 hover:text-[#3db87a] hover:bg-[#E8F3EC]/30 transition-all flex items-center justify-center gap-1.5 text-xs font-semibold"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Thêm câu hỏi</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* ─── RIGHT: Properties Panel ─── */}
        <aside
          className={`w-[320px] bg-white border-l border-[#E5E7EB] flex flex-col flex-shrink-0 overflow-hidden transition-all duration-300 ${selectedComponent ? "translate-x-0" : "translate-x-full w-0 border-none"
            }`}
        >
          {selectedComponent && (
            <>
              {/* Panel Header */}
              <div className="p-4 border-b border-[#E5E7EB] bg-[#FEFCF7] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#3db87a] flex items-center justify-center text-white">
                    <Settings className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1A1A1A]">Thuộc tính</h3>
                    <p className="text-[10px] text-[#6B7280]">Chỉnh sửa câu hỏi</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedId(null)}
                  className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#1A1A1A] hover:bg-[#FAF8F1] transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-y-auto builder-scroll p-4 space-y-5">
                {/* Component Type Display */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#E8F3EC]/50 border border-[#3db87a]/10">
                  <div className="text-[#3db87a]">{getCompIcon(selectedComponent.type)}</div>
                  <span className="text-xs font-bold text-[#3db87a]">{getCompLabel(selectedComponent.type)}</span>
                </div>

                {/* Label */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7280]">
                    {selectedComponent.type === "heading" ? "Tiêu đề" : "Nội dung câu hỏi"}
                  </label>
                  <input
                    type="text"
                    value={selectedComponent.label}
                    onChange={(e) => updateComponent(selectedComponent.id, { label: e.target.value })}
                    className="w-full h-10 px-3 text-sm font-medium border border-[#E5E7EB] rounded-xl bg-white focus:border-[#3db87a] focus:ring-4 focus:ring-green-100 outline-none transition-all"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7280]">
                    Mô tả phụ
                  </label>
                  <input
                    type="text"
                    value={selectedComponent.description}
                    onChange={(e) => updateComponent(selectedComponent.id, { description: e.target.value })}
                    placeholder="Thêm hướng dẫn cho câu hỏi..."
                    className="w-full h-10 px-3 text-sm border border-[#E5E7EB] rounded-xl bg-white focus:border-[#3db87a] focus:ring-4 focus:ring-green-100 outline-none transition-all"
                  />
                </div>

                {/* Placeholder (for text inputs) */}
                {["short_text", "long_text", "email", "phone"].includes(selectedComponent.type) && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7280]">
                      Placeholder
                    </label>
                    <input
                      type="text"
                      value={selectedComponent.placeholder}
                      onChange={(e) => updateComponent(selectedComponent.id, { placeholder: e.target.value })}
                      className="w-full h-10 px-3 text-sm border border-[#E5E7EB] rounded-xl bg-white focus:border-[#3db87a] focus:ring-4 focus:ring-green-100 outline-none transition-all"
                    />
                  </div>
                )}

                {/* Required Toggle */}
                {selectedComponent.type !== "heading" && selectedComponent.type !== "image" && (
                  <div className="flex items-center justify-between p-3 rounded-xl border border-[#E5E7EB] bg-[#FAF8F1]">
                    <div className="flex items-center gap-2">
                      <ToggleLeft className="w-4 h-4 text-[#6B7280]" />
                      <span className="text-xs font-semibold text-[#374151]">Bắt buộc trả lời</span>
                    </div>
                    <button
                      onClick={() =>
                        updateComponent(selectedComponent.id, { required: !selectedComponent.required })
                      }
                      className={`w-10 h-6 rounded-full transition-all flex items-center px-0.5 ${selectedComponent.required ? "bg-[#3db87a]" : "bg-[#D1D5DB]"
                        }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${selectedComponent.required ? "translate-x-4" : "translate-x-0"
                          }`}
                      />
                    </button>
                  </div>
                )}

                {/* Options Management (for choice types) */}
                {["multiple_choice", "checkbox", "dropdown"].includes(selectedComponent.type) && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7280]">
                      Danh sách lựa chọn
                    </label>
                    <div className="space-y-1.5">
                      {selectedComponent.options.map((opt, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-md bg-[#E8F3EC] flex items-center justify-center text-[10px] font-bold text-[#3db87a] flex-shrink-0">
                            {i + 1}
                          </div>
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => updateOption(selectedComponent.id, i, e.target.value)}
                            className="flex-1 h-9 px-3 text-xs border border-[#E5E7EB] rounded-lg bg-white focus:border-[#3db87a] focus:ring-2 focus:ring-green-100 outline-none transition-all"
                          />
                          <button
                            onClick={() => removeOption(selectedComponent.id, i)}
                            disabled={selectedComponent.options.length <= 1}
                            className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => addOption(selectedComponent.id)}
                      className="w-full py-2 rounded-lg border border-dashed border-[#C7D2C9] text-[#3db87a] text-xs font-semibold hover:bg-[#E8F3EC]/30 hover:border-[#3db87a]/30 transition-all flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm lựa chọn</span>
                    </button>
                  </div>
                )}

                {/* Rating Max */}
                {selectedComponent.type === "rating" && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7280]">
                      Số sao tối đa
                    </label>
                    <div className="flex items-center gap-2">
                      {[3, 4, 5, 7, 10].map((n) => (
                        <button
                          key={n}
                          onClick={() => updateComponent(selectedComponent.id, { ratingMax: n })}
                          className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${selectedComponent.ratingMax === n
                            ? "bg-[#3db87a] text-white shadow-md"
                            : "bg-[#FAF8F1] text-[#374151] border border-[#E5E7EB] hover:bg-[#E8F3EC]"
                            }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Likert Labels */}
                {selectedComponent.type === "likert" && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7280]">
                      Nhãn thang đo
                    </label>
                    <div className="space-y-1.5">
                      {selectedComponent.likertLabels.map((lbl, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-md bg-[#E8F3EC] flex items-center justify-center text-[10px] font-bold text-[#3db87a] flex-shrink-0">
                            {i + 1}
                          </div>
                          <input
                            type="text"
                            value={lbl}
                            onChange={(e) => {
                              const newLabels = [...selectedComponent.likertLabels]
                              newLabels[i] = e.target.value
                              updateComponent(selectedComponent.id, { likertLabels: newLabels })
                            }}
                            className="flex-1 h-9 px-3 text-xs border border-[#E5E7EB] rounded-lg bg-white focus:border-[#3db87a] focus:ring-2 focus:ring-green-100 outline-none transition-all"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Danger Zone */}
                <div className="pt-3 border-t border-[#E5E7EB]">
                  <div className="flex gap-2">
                    <button
                      onClick={() => duplicateComponent(selectedComponent.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#E5E7EB] text-[#6B7280] hover:text-[#3db87a] hover:bg-[#E8F3EC]/30 hover:border-[#3db87a]/20 text-xs font-semibold transition-all"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Nhân đôi</span>
                    </button>
                    <button
                      onClick={() => deleteComponent(selectedComponent.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 text-xs font-semibold transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </aside>
      </div>

      {/* ─── PREVIEW MODAL ─── */}
      {showPreview && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 pt-8 overflow-y-auto"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-xl border border-[#E5E7EB] shadow-2xl animate-fade-scale-in relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Preview Header */}
            <div className="p-6 border-b border-[#E5E7EB] bg-[#FEFCF7] rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#3db87a] flex items-center justify-center">
                    <Eye className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1A1A1A]">Xem trước khảo sát</h3>
                    <p className="text-[10px] text-[#6B7280]">Đây là giao diện mà người trả lời sẽ thấy</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 rounded-xl text-[#6B7280] hover:bg-[#FAF8F1] transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Preview Body */}
            <div className="p-6 space-y-6">
              {/* Form Title */}
              <div className="border-l-4 border-[#3db87a] pl-4 space-y-1">
                <h2 className="text-xl font-bold text-[#1A1A1A]">{formTitle}</h2>
                {formDescription && <p className="text-sm text-[#6B7280]">{formDescription}</p>}
              </div>

              {components.length === 0 ? (
                <div className="py-12 text-center text-sm text-[#9CA3AF]">
                  Chưa có câu hỏi nào. Hãy thêm câu hỏi vào form.
                </div>
              ) : (
                <div className="space-y-5">
                  {components.map((comp, idx) => renderPreviewField(comp, idx))}
                </div>
              )}

              {/* Submit button preview */}
              {components.length > 0 && (
                <div className="pt-4 border-t border-[#E5E7EB]">
                  <button
                    type="button"
                    className="w-full h-12 rounded-full bg-[#3db87a] text-white text-sm font-bold hover:bg-[#13422C] transition-all shadow-md shadow-green-950/20 active:scale-[0.98]"
                  >
                    Gửi khảo sát
                  </button>
                </div>
              )}
            </div>

            {/* Preview Footer */}
            <div className="p-4 bg-[#FEFCF7] rounded-b-3xl border-t border-[#E5E7EB] flex items-center justify-between">
              <span className="text-[10px] text-[#9CA3AF]">Powered by Rescom</span>
              <span className="text-[10px] text-[#9CA3AF]">{components.length} câu hỏi</span>
            </div>
          </div>
        </div>
      )}

      {/* ─── PUBLISH SUCCESS OVERLAY ─── */}
      {publishSuccess && (
        <div className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-3xl p-8 max-w-sm text-center space-y-4 shadow-2xl animate-fade-scale-in pointer-events-auto">
            <div className="w-16 h-16 rounded-full bg-[#E8F3EC] flex items-center justify-center text-[#3db87a] mx-auto">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h3 className="text-lg font-bold text-[#1A1A1A]">Xuất bản thành công! 🎉</h3>
            <p className="text-xs text-[#6B7280]">
              Khảo sát &quot;{formTitle}&quot; đã được xuất bản và sẵn sàng nhận phản hồi.
            </p>
            <button
              onClick={() => setPublishSuccess(false)}
              className="px-6 py-2.5 rounded-full bg-[#3db87a] text-white text-xs font-bold hover:bg-[#13422C] transition-all"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
