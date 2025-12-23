import type { TodoItem } from "./types"

const STORAGE_KEY = "todo-items"

export function getTodos(): TodoItem[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Error loading todos:", error)
    return []
  }
}

export function saveTodos(todos: TodoItem[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  } catch (error) {
    console.error("Error saving todos:", error)
    throw error
  }
}

export function addTodo(todo: Omit<TodoItem, "id" | "createdAt" | "order">): TodoItem {
  const todos = getTodos()
  const maxOrder = todos.reduce((max, t) => Math.max(max, t.order), -1)

  const newTodo: TodoItem = {
    ...todo,
    id: `todo-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
    createdAt: Date.now(),
    order: maxOrder + 1,
  }

  const updatedTodos = [...todos, newTodo]
  try {
    saveTodos(updatedTodos)
  } catch (error) {
    throw new Error("Failed to add todo.", {
      cause: error instanceof Error ? error : undefined,
    })
  }

  return newTodo
}

export function updateTodo(id: string, updates: Partial<TodoItem>): void {
  const todos = getTodos()
  const { id: _id, createdAt: _createdAt, order: _order, ...safeUpdates } = updates
  const updatedTodos = todos.map((t) => (t.id === id ? { ...t, ...safeUpdates } : t))
  try {
    saveTodos(updatedTodos)
  } catch (error) {
    throw new Error("Failed to update todo.", {
      cause: error instanceof Error ? error : undefined,
    })
  }
}

export function deleteTodo(id: string): void {
  const todos = getTodos()
  // Also delete all subtasks
  const updatedTodos = todos.filter((t) => t.id !== id && t.parentId !== id)
  try {
    saveTodos(updatedTodos)
  } catch (error) {
    throw new Error("Failed to delete todo.", {
      cause: error instanceof Error ? error : undefined,
    })
  }
}

export function getTodosForView(viewType: "today" | "project", projectId?: string): TodoItem[] {
  const todos = getTodos()

  if (viewType === "today") {
    // Show all todos without a specific project, or all todos
    return todos.filter((t) => !t.projectId || t.projectId === "today")
  }

  if (viewType === "project" && projectId) {
    return todos.filter((t) => t.projectId === projectId)
  }

  return []
}
