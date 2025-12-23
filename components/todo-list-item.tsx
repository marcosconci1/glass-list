"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, ChevronRight, Calendar } from "lucide-react"
import type { TodoItem } from "@/lib/types"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { EditTaskDialog } from "./edit-task-dialog"

interface TodoListItemProps {
  todo: TodoItem
  subtasks?: TodoItem[]
  onToggle: (id: string) => void
  onUpdate: (id: string, updates: Partial<TodoItem>) => void
  onDelete: (id: string) => void
  accentColor?: string
  projects?: Array<{ id: string; name: string; color: string }>
}

export function TodoListItem({
  todo,
  subtasks = [],
  onToggle,
  onUpdate,
  onDelete,
  accentColor = "#ffffff",
  projects = [],
}: TodoListItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const hasSubtasks = subtasks.length > 0
  const completedSubtasks = subtasks.filter((st) => st.completed).length
  const subtasksId = hasSubtasks ? `subtasks-${todo.id}` : undefined
  const dueDateLabel = (() => {
    if (todo.dueDate == null) return null
    const parsed = new Date(Number(todo.dueDate))
    if (Number.isNaN(parsed.getTime())) {
      console.error("Invalid due date value:", todo.dueDate)
      return null
    }
    try {
      return format(parsed, "MMM d")
    } catch (error) {
      console.error("Failed to format due date:", error)
      return null
    }
  })()

  const handleClick = (e: React.MouseEvent) => {
    // Don't open dialog if clicking on checkbox or chevron
    if ((e.target as HTMLElement).closest("button")) return
    setIsEditDialogOpen(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      if ((e.target as HTMLElement).closest("button")) {
        return
      }
      e.preventDefault()
      setIsEditDialogOpen(true)
    }
  }

  return (
    <div className="group">
      {/* Main todo item */}
      <div
        className="flex items-start gap-2 py-2 px-2 rounded hover:bg-white/5 transition-colors cursor-pointer"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`Edit task: ${todo.title}`}
      >
        {/* Expand/Collapse chevron */}
        {hasSubtasks && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
            className="mt-0.5 text-white/40 hover:text-white/70 transition-colors flex-shrink-0"
            aria-label={isExpanded ? "Collapse subtasks" : "Expand subtasks"}
            aria-expanded={isExpanded}
            aria-controls={subtasksId}
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        )}

        {/* Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggle(todo.id)
          }}
          className={cn(
            "w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all mt-0.5",
            !todo.completed && "border-white/30 hover:border-white/50",
          )}
          style={todo.completed ? { backgroundColor: `${accentColor}33`, borderColor: accentColor } : {}}
          role="checkbox"
          aria-checked={todo.completed}
          aria-label={`Mark "${todo.title}" as ${todo.completed ? "incomplete" : "complete"}`}
        >
          {todo.completed && (
            <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" style={{ color: accentColor }}>
              <path
                d="M2 6L5 9L10 3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className={cn("text-sm", todo.completed ? "line-through text-white/40" : "text-white")}>
            {todo.title}
          </div>
          {todo.description && <div className="text-xs text-white/50 mt-1">{todo.description}</div>}
          {dueDateLabel && (
            <div className="flex items-center gap-1 mt-1 text-xs" style={{ color: accentColor }}>
              <Calendar className="h-3 w-3" />
              <span>{dueDateLabel}</span>
            </div>
          )}
          {hasSubtasks && (
            <div className="text-xs text-white/40 mt-1">
              {completedSubtasks}/{subtasks.length}
            </div>
          )}
        </div>
      </div>

      {/* Subtasks */}
      {isExpanded && hasSubtasks && (
        <div className="ml-7 pl-4 border-l border-white/10" id={subtasksId}>
          {subtasks.map((subtask) => (
            <TodoListItem
              key={subtask.id}
              todo={subtask}
              onToggle={onToggle}
              onUpdate={onUpdate}
              onDelete={onDelete}
              accentColor={accentColor}
              projects={projects}
            />
          ))}
        </div>
      )}

      <EditTaskDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        todo={todo}
        onUpdate={onUpdate}
        onDelete={onDelete}
        projects={projects}
        accentColor={accentColor}
      />
    </div>
  )
}
