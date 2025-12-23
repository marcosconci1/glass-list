"use client"

import { useState } from "react"
import { Calendar, Clock, Flag, Hash, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format } from "date-fns"
import type { TodoItem } from "@/lib/types"

interface EditTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  todo: TodoItem
  onUpdate: (id: string, updates: Partial<TodoItem>) => void
  onDelete: (id: string) => void
  projects: Array<{ id: string; name: string; color: string }>
  accentColor?: string
}

export function EditTaskDialog({
  open,
  onOpenChange,
  todo,
  onUpdate,
  onDelete,
  projects,
  accentColor = "#ffffff",
}: EditTaskDialogProps) {
  const [taskName, setTaskName] = useState(todo.title)
  const [description, setDescription] = useState(todo.description || "")
  const [dueDate, setDueDate] = useState<Date | undefined>(todo.dueDate ? new Date(todo.dueDate) : undefined)
  const [priority, setPriority] = useState<number | undefined>(todo.priority)
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(todo.projectId)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showPriorityPicker, setShowPriorityPicker] = useState(false)
  const [showProjectPicker, setShowProjectPicker] = useState(false)

  const handleDialogOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setTaskName(todo.title)
      setDescription(todo.description || "")
      setDueDate(todo.dueDate ? new Date(todo.dueDate) : undefined)
      setPriority(todo.priority)
      setSelectedProjectId(todo.projectId)
    }
    onOpenChange(nextOpen)
  }

  const handleSave = () => {
    if (taskName.trim()) {
      onUpdate(todo.id, {
        title: taskName.trim(),
        description: description.trim() || undefined,
        dueDate: dueDate?.getTime(),
        priority,
        projectId: selectedProjectId,
      })
      onOpenChange(false)
    }
  }

  const handleDelete = () => {
    onDelete(todo.id)
    onOpenChange(false)
  }

  const priorities = [
    { level: 1, label: "Priority 1", color: "text-red-400", bgColor: "hover:bg-red-500/10" },
    { level: 2, label: "Priority 2", color: "text-orange-400", bgColor: "hover:bg-orange-500/10" },
    { level: 3, label: "Priority 3", color: "text-blue-400", bgColor: "hover:bg-blue-500/10" },
    { level: 4, label: "Priority 4", color: "text-white/40", bgColor: "hover:bg-white/5" },
  ]

  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  const quickDateOptions = [
    { label: "Today", value: today, icon: "📅" },
    { label: "Tomorrow", value: tomorrow, icon: "☀️" },
  ]

  const selectedProject = selectedProjectId ? projects.find((p) => p.id === selectedProjectId) : null
  const displayProjectName = selectedProject?.name || "Today"
  const displayProjectColor = selectedProject?.color || accentColor

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="sm:max-w-lg bg-[#1a1a1a]/95 backdrop-blur-xl border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-white text-base font-normal">Edit task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
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
            <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
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
                  {dueDate && (
                    <button
                      onClick={() => {
                        setDueDate(undefined)
                        setShowDatePicker(false)
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded"
                    >
                      Remove date
                    </button>
                  )}
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
                {priority && (
                  <button
                    onClick={() => {
                      setPriority(undefined)
                      setShowPriorityPicker(false)
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded mt-1 border-t border-white/10 pt-2"
                  >
                    Remove priority
                  </button>
                )}
              </PopoverContent>
            </Popover>
          </div>

          {/* Bottom Row: Project & Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <div className="flex items-center gap-2">
              {/* Project Picker */}
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

              {/* Delete Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="hover:bg-red-500/10 text-red-400 hover:text-red-300"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="bg-white/5 border-white/10 text-white/80 hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={!taskName.trim()}
                className="text-white disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: `${accentColor}33`,
                  borderColor: accentColor,
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
