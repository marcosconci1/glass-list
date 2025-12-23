"use client"

import { useState } from "react"
import { ModeSelector } from "@/components/mode-selector"
import { TodoListContainer } from "@/components/todo-list-container"
import { useProjects } from "@/hooks/use-projects"

export default function Home() {
  const { projects } = useProjects()

  const [selectedView, setSelectedView] = useState<{ type: "today" | "project"; projectId?: string }>({
    type: "today",
  })

  const handleViewChange = (viewType: "today" | "project", projectId?: string) => {
    setSelectedView({ type: viewType, projectId })
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <header className="mb-12">
          <div className="flex items-center justify-center mb-8">
            <ModeSelector
              selectedView={selectedView}
              onViewChange={handleViewChange}
            />
          </div>
        </header>

        <div className="w-full">
          <TodoListContainer selectedView={selectedView} projects={projects} />
        </div>
      </div>
    </main>
  )
}
