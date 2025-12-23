"use client"

import type React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Plus, X } from "lucide-react"
import { AddProjectDialog } from "./add-project-dialog"
import { useProjects } from "@/hooks/use-projects"

interface ModeSelectorProps {
  selectedView?: { type: "today" | "project"; projectId?: string }
  onViewChange?: (viewType: "today" | "project", projectId?: string) => void
}

export function ModeSelector({ selectedView, onViewChange }: ModeSelectorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { projects, addProject, deleteProject } = useProjects()

  const handleTodayClick = () => {
    onViewChange?.("today")
  }

  const handleProjectClick = (projectId: string) => {
    onViewChange?.("project", projectId)
  }

  const handleAddProject = () => {
    setIsDialogOpen(true)
  }

  const handleProjectAdded = (project: { name: string; color: string; isFavorite: boolean }) => {
    addProject(project)
  }

  const handleDeleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    deleteProject(id)
  }

  const sortedProjects = [...projects].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1
    if (!a.isFavorite && b.isFavorite) return 1
    return 0
  })

  const isTodaySelected = selectedView?.type === "today"

  return (
    <>
      <div className="flex items-center gap-1 p-1 bg-white/5 backdrop-blur-lg border border-white/10 rounded-full shadow-lg h-10">
        <button
          onClick={handleTodayClick}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300",
            isTodaySelected ? "bg-white/20 text-white shadow-sm" : "text-white/60 hover:text-white hover:bg-white/5",
          )}
          aria-label="Switch to Today"
          aria-pressed={isTodaySelected}
        >
          Today
        </button>
        {sortedProjects.map((project) => {
          const isProjectSelected = selectedView?.type === "project" && selectedView?.projectId === project.id
          return (
            <div key={project.id} className="relative group">
              <button
                onClick={() => handleProjectClick(project.id)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 flex items-center gap-2",
                  isProjectSelected
                    ? "bg-white/20 text-white shadow-sm"
                    : "text-white/60 hover:text-white hover:bg-white/5",
                )}
                aria-label={`Switch to ${project.name}`}
                aria-pressed={isProjectSelected}
              >
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: project.color }} />
                {project.name}
              </button>
              <button
                onClick={(e) => handleDeleteProject(project.id, e)}
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                aria-label={`Delete ${project.name}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )
        })}
        <button
          onClick={handleAddProject}
          className={cn(
            "w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300",
            "text-white/60 hover:text-white hover:bg-white/5",
          )}
          aria-label="Add project"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <AddProjectDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onProjectAdd={handleProjectAdded} />
    </>
  )
}
