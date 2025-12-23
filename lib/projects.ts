import type { Project } from "./types"

const STORAGE_KEY = "todo-projects"

export function getProjects(): Project[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Error loading projects:", error)
    return []
  }
}

export function saveProjects(projects: Project[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
  } catch (error) {
    console.error("Error saving projects:", error)
    throw new Error("Failed to save projects.", {
      cause: error instanceof Error ? error : undefined,
    })
  }
}

export function addProject(project: Omit<Project, "id" | "createdAt">): Project {
  const newProject: Project = {
    ...project,
    id: `project-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
    createdAt: Date.now(),
  }

  const projects = getProjects()
  const updatedProjects = [...projects, newProject]
  try {
    saveProjects(updatedProjects)
  } catch (error) {
    throw new Error("Failed to add project.", {
      cause: error instanceof Error ? error : undefined,
    })
  }

  return newProject
}

export function deleteProject(id: string): void {
  const projects = getProjects()
  const updatedProjects = projects.filter((p) => p.id !== id)
  try {
    saveProjects(updatedProjects)
  } catch (error) {
    throw new Error("Failed to delete project.", {
      cause: error instanceof Error ? error : undefined,
    })
  }
}
