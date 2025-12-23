"use client"

import { useMemo, useState } from "react"
import type { TodoItem } from "@/lib/types"
import { addTodo, updateTodo, deleteTodo, getTodosForView } from "@/lib/todos"

export function useTodos(viewType: "today" | "project", projectId?: string) {
  const [version, setVersion] = useState(0)

  const todos = useMemo(() => {
    void version
    return getTodosForView(viewType, projectId)
  }, [viewType, projectId, version])

  const refreshTodos = () => {
    setVersion((prev) => prev + 1)
  }

  const handleAddTodo = (
    title: string,
    description?: string,
    dueDate?: Date,
    priority?: number,
    taskProjectId?: string,
  ) => {
    try {
      addTodo({
        title,
        description,
        completed: false,
        projectId: taskProjectId || (viewType === "project" ? (projectId || "today") : "today"),
        dueDate: dueDate ? dueDate.getTime() : undefined,
        priority,
      })
      refreshTodos()
    } catch (error) {
      console.error("Failed to add todo:", error)
    }
  }

  const handleToggleTodo = (id: string) => {
    const todo = todos.find((t) => t.id === id)
    if (!todo) return

    const completed = !todo.completed
    const completedAt = completed ? Date.now() : undefined
    try {
      updateTodo(id, {
        completed,
        completedAt,
      })
      refreshTodos()
    } catch (error) {
      console.error("Failed to update todo:", error)
    }
  }

  const handleUpdateTodo = (id: string, updates: Partial<TodoItem>) => {
    try {
      updateTodo(id, updates)
      refreshTodos()
    } catch (error) {
      console.error("Failed to update todo:", error)
    }
  }

  const handleDeleteTodo = (id: string) => {
    try {
      deleteTodo(id)
      refreshTodos()
    } catch (error) {
      console.error("Failed to delete todo:", error)
    }
  }

  return {
    todos,
    addTodo: handleAddTodo,
    toggleTodo: handleToggleTodo,
    updateTodo: handleUpdateTodo,
    deleteTodo: handleDeleteTodo,
  }
}
