export interface Project {
  id: string
  name: string
  color: string
  isFavorite: boolean
  createdAt: number
}

export interface Task {
  id: string
  name: string
  color: string
  gradient: {
    from: string
    via: string
    to: string
  }
  type: string
}

export type ViewState =
  | {
      type: "today"
    }
  | {
      type: "project"
      projectId: string
    }

export interface TodoItem {
  id: string
  title: string
  description?: string
  completed: boolean
  projectId?: string // For "Today" view or specific project
  dueDate?: number // timestamp
  priority?: number // 1-4, where 1 is highest
  createdAt: number
  completedAt?: number
  parentId?: string // For subtasks
  order: number
}
