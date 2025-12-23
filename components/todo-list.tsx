"use client"

import { useState } from "react"
import { TodoListItem } from "./todo-list-item"
import { AddTaskDialog } from "./add-task-dialog"
import type { TodoItem } from "@/lib/types"

interface TodoListProps {
  todos: TodoItem[]
  onToggle: (id: string) => void
  onUpdate: (id: string, updates: Partial<TodoItem>) => void
  onDelete: (id: string) => void
  onAdd: (title: string, description?: string, dueDate?: Date, priority?: number, projectId?: string) => void
  projects: Array<{ id: string; name: string; color: string }>
  currentProjectId?: string
  accentColor?: string
  viewName?: string
}

export function TodoList({
  todos,
  onToggle,
  onUpdate,
  onDelete,
  onAdd,
  projects,
  currentProjectId,
  accentColor,
  viewName,
}: TodoListProps) {
  const [showAddDialog, setShowAddDialog] = useState(false)

  // Sort todos: incomplete first, then by order
  const sortedTodos = [...todos].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }
    return a.order - b.order
  })

  // Filter out subtasks - they'll be shown inside parent items
  const topLevelTodos = sortedTodos.filter((t) => !t.parentId)

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-6"></div>

      <AddTaskDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAdd={onAdd}
        projects={projects}
        currentProjectId={currentProjectId}
        accentColor={accentColor}
        viewName={viewName}
      />

      {/* Todo items */}
      <div className="space-y-1 mt-4">
        {topLevelTodos.map((todo) => {
          const subtasks = sortedTodos.filter((t) => t.parentId === todo.id)
          return (
            <TodoListItem
              key={todo.id}
              todo={todo}
              subtasks={subtasks}
              onToggle={onToggle}
              onUpdate={onUpdate}
              onDelete={onDelete}
              accentColor={accentColor}
              projects={projects}
            />
          )
        })}
      </div>

      {topLevelTodos.length === 0 && (
        <div className="text-center text-white/30 text-sm py-12">No tasks yet. Add one to get started!</div>
      )}
    </div>
  )
}
