"use client"

import { TodoList } from "./todo-list"
import { useTodos } from "@/hooks/use-todos"
import type { Project } from "@/lib/types"

interface TodoListContainerProps {
  selectedView: { type: "today" | "project"; projectId?: string }
  projects: Project[]
}

export function TodoListContainer({ selectedView, projects }: TodoListContainerProps) {
  const { todos, addTodo, toggleTodo, updateTodo, deleteTodo } = useTodos(selectedView.type, selectedView.projectId)

  const projectsForDialog = projects.map((p) => ({
    id: p.id,
    name: p.name,
    color: p.color,
  }))

  let accentColor = "#ffffff" // Default white for Today
  let viewName = selectedView.type === "project" ? "Project" : "Today"

  if (selectedView.type === "project") {
    const currentProject = projects.find((p) => p.id === selectedView.projectId)
    if (currentProject) {
      accentColor = currentProject.color
      viewName = currentProject.name
    }
  }

  return (
    <div className="w-full">
      <TodoList
        todos={todos}
        onToggle={toggleTodo}
        onUpdate={updateTodo}
        onDelete={deleteTodo}
        onAdd={addTodo}
        projects={projectsForDialog}
        currentProjectId={selectedView.projectId}
        accentColor={accentColor}
        viewName={viewName}
      />
    </div>
  )
}
