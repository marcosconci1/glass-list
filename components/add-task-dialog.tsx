"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, Flag, Plus, Hash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"

interface AddTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (title: string, description?: string, dueDate?: Date, priority?: number, projectId?: string) => void
  projects: Array<{ id: string; name: string; color: string }>
  currentProjectId?: string
  accentColor?: string
  viewName?: string
}

export function AddTaskDialog({
  open,
  onOpenChange,
  onAdd,
  projects,
  currentProjectId,
  accentColor = "#ffffff",
  viewName = "Today",
}: AddTaskDialogProps) {
  const [taskName, setTaskName] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState<Date | undefined>()
  const [priority, setPriority] = useState<number | undefined>()
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(currentProjectId)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showPriorityPicker, setShowPriorityPicker] = useState(false)
  const [showProjectPicker, setShowProjectPicker] = useState(false)
  const [dateAnchor, setDateAnchor] = useState(() => new Date())

  useEffect(() => {
    setSelectedProjectId(currentProjectId)
  }, [currentProjectId])

  const handleAdd = () => {
    if (taskName.trim()) {
      onAdd(taskName.trim(), description.trim() || undefined, dueDate, priority, selectedProjectId)
      handleReset()
      onOpenChange(false)
    }
  }

  const handleReset = () => {
    setTaskName("")
    setDescription("")
    setDueDate(undefined)
    setPriority(undefined)
    setSelectedProjectId(currentProjectId)
  }

  const handleCancel = () => {
    handleReset()
    onOpenChange(false)
  }

  const priorities = [
    { level: 1, label: "Priority 1", color: "text-red-400", bgColor: "hover:bg-red-500/10" },
    { level: 2, label: "Priority 2", color: "text-orange-400", bgColor: "hover:bg-orange-500/10" },
    { level: 3, label: "Priority 3", color: "text-blue-400", bgColor: "hover:bg-blue-500/10" },
    { level: 4, label: "Priority 4", color: "text-white/40", bgColor: "hover:bg-white/5" },
  ]

  const today = new Date(dateAnchor)
  const tomorrow = new Date(dateAnchor)
  tomorrow.setDate(today.getDate() + 1)

  const quickDateOptions = [
    { label: "Today", value: today, icon: "📅" },
    { label: "Tomorrow", value: tomorrow, icon: "☀️" },
  ]

  const handleDatePickerOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setDateAnchor(new Date())
    }
    setShowDatePicker(nextOpen)
  }

  if (!open) {
    return (
      <button
        onClick={() => onOpenChange(true)}
        className="w-full bg-white/5 backdrop-blur-lg rounded-xl p-4 shadow-lg flex items-center justify-between hover:bg-white/10 transition-colors"
        style={{ borderWidth: 1, borderStyle: "solid", borderColor: `${accentColor}33` }}
      >
        <span className="text-sm text-white/40">Add task</span>
        <Plus className="h-4 w-4" style={{ color: accentColor }} />
      </button>
    )
  }

  const selectedProject = selectedProjectId ? projects.find((p) => p.id === selectedProjectId) : null
  const displayProjectName = selectedProject?.name || viewName
  const displayProjectColor = selectedProject?.color || accentColor

  return (
    <div
      className="w-full bg-white/5 backdrop-blur-lg rounded-xl p-4 shadow-lg space-y-4"
      style={{ borderWidth: 1, borderStyle: "solid", borderColor: `${accentColor}40` }}
    >
      {/* Task Name */}
      <input
        type="text"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder="Task name"
        className="w-full bg-transparent text-white placeholder:text-white/40 outline-none text-lg font-medium"
        autoFocus
      />

      {/* Description */}
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="w-full bg-transparent text-white/60 placeholder:text-white/30 outline-none text-sm"
      />

      {/* Action Buttons Row */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Date Button */}
        <Popover open={showDatePicker} onOpenChange={handleDatePickerOpenChange}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:text-white"
              style={dueDate ? { borderColor: `${accentColor}50`, color: accentColor } : {}}
            >
              <Calendar className="h-4 w-4 mr-1" />
              {dueDate ? format(dueDate, "MMM d") : "Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-[#1a1a1a]/90 backdrop-blur-lg border-white/10" align="start">
            <div className="p-3 space-y-2">
              {quickDateOptions.map((option) => (
                <button
                  key={option.label}
                  onClick={() => {
                    setDueDate(option.value)
                    setShowDatePicker(false)
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-white/80 hover:bg-white/5 rounded flex items-center gap-2"
                >
                  <span>{option.icon}</span>
                  <span>{option.label}</span>
                  <span className="ml-auto text-white/40 text-xs">{format(option.value, "EEE")}</span>
                </button>
              ))}
            </div>
            <CalendarComponent
              mode="single"
              selected={dueDate}
              onSelect={(date) => {
                setDueDate(date)
                setShowDatePicker(false)
              }}
              className="bg-transparent text-white border-t border-white/10"
            />
          </PopoverContent>
        </Popover>

        {/* Deadline Button */}
        <Button
          variant="outline"
          size="sm"
          className="bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:text-white"
          onClick={() => handleDatePickerOpenChange(true)}
        >
          <Clock className="h-4 w-4 mr-1" />
          Deadline
        </Button>

        {/* Priority Button */}
        <Popover open={showPriorityPicker} onOpenChange={setShowPriorityPicker}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={`bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:text-white ${
                priority ? priorities[priority - 1]?.color : ""
              }`}
            >
              <Flag className="h-4 w-4 mr-1" />
              Priority
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2 bg-[#1a1a1a]/90 backdrop-blur-lg border-white/10" align="start">
            {priorities.map((p) => (
              <button
                key={p.level}
                onClick={() => {
                  setPriority(p.level)
                  setShowPriorityPicker(false)
                }}
                className={`w-full text-left px-3 py-2 text-sm rounded flex items-center gap-2 ${p.bgColor} ${
                  priority === p.level ? "bg-white/10" : ""
                }`}
              >
                <Flag className={`h-4 w-4 ${p.color}`} fill="currentColor" />
                <span className="text-white/80">{p.label}</span>
                {priority === p.level && <span className="ml-auto text-white">✓</span>}
              </button>
            ))}
          </PopoverContent>
        </Popover>
      </div>

      {/* Bottom Row: Project & Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-white/10">
        <Popover open={showProjectPicker} onOpenChange={setShowProjectPicker}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="hover:bg-white/5 gap-1.5">
              <Hash className="h-4 w-4" style={{ color: displayProjectColor }} />
              <span className="text-white/60 text-sm">{displayProjectName}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2 bg-[#1a1a1a]/90 backdrop-blur-lg border-white/10" align="start">
            <button
              onClick={() => {
                setSelectedProjectId(undefined)
                setShowProjectPicker(false)
              }}
              className="w-full text-left px-3 py-2 text-sm text-white/80 hover:bg-white/5 rounded flex items-center gap-2"
            >
              <Hash className="h-3.5 w-3.5 text-white" />
              <span>Today</span>
              {!selectedProjectId && <span className="ml-auto text-white">✓</span>}
            </button>
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => {
                  setSelectedProjectId(project.id)
                  setShowProjectPicker(false)
                }}
                className="w-full text-left px-3 py-2 text-sm text-white/80 hover:bg-white/5 rounded flex items-center gap-2"
              >
                <Hash className="h-3.5 w-3.5" style={{ color: project.color }} />
                <span>{project.name}</span>
                {selectedProjectId === project.id && <span className="ml-auto text-white">✓</span>}
              </button>
            ))}
          </PopoverContent>
        </Popover>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            className="bg-white/5 border-white/10 text-white/80 hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={!taskName.trim()}
            className="text-white disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              backgroundColor: `${accentColor}33`,
              borderColor: accentColor,
            }}
          >
            Add task
          </Button>
        </div>
      </div>
    </div>
  )
}
