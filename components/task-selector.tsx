"use client"

import type { Task } from "@/lib/types"
import { cn } from "@/lib/utils"
import { CreateFocusDialog } from "./create-focus-dialog"

interface TaskSelectorProps {
  selectedTask: Task | null
  tasks: Task[]
  onSelectTask: (task: Task) => void
  onCreateTask: (task: Omit<Task, "id" | "type">) => void
  disabled?: boolean
}

export function TaskSelector({ selectedTask, tasks, onSelectTask, onCreateTask, disabled }: TaskSelectorProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      {!disabled && (
        <div className="flex flex-wrap gap-2 justify-center items-center max-w-lg">
          {tasks.map((task) => (
            <button
              key={task.id}
              onClick={() => onSelectTask(task)}
              disabled={disabled}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-all",
                selectedTask?.id === task.id
                  ? "bg-white/30 text-white ring-2 ring-white/40 scale-105 shadow-lg"
                  : "bg-white/10 text-white/80 hover:bg-white/20 hover:scale-105",
                disabled && "opacity-50 cursor-not-allowed",
              )}
            >
              {task.name}
            </button>
          ))}
          <CreateFocusDialog onCreateTask={onCreateTask} />
        </div>
      )}
    </div>
  )
}
