"use client"

import { useState } from "react"
import type { Project } from "@/lib/types"
import {
  getProjects,
  addProject as addProjectToStorage,
  deleteProject as deleteProjectFromStorage,
} from "@/lib/projects"

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      return getProjects()
    } catch (error) {
      console.error("Failed to load projects:", error)
      return []
    }
  })

  const addProject = (project: Omit<Project, "id" | "createdAt">) => {
    try {
      const newProject = addProjectToStorage(project)
      setProjects((prev) => [...prev, newProject])
      return newProject
    } catch (error) {
      console.error("Failed to add project:", error)
      throw error
    }
  }

  const deleteProject = (id: string) => {
    try {
      deleteProjectFromStorage(id)
      setProjects((prev) => prev.filter((p) => p.id !== id))
    } catch (error) {
      console.error("Failed to delete project:", error)
      throw error
    }
  }

  return {
    projects,
    addProject,
    deleteProject,
  }
}
