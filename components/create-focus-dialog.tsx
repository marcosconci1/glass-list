"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { Task } from "@/lib/types"

interface CreateFocusDialogProps {
  onCreateTask: (task: Omit<Task, "id" | "type">) => void
}

const PRESET_COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#8B5CF6", // Purple
  "#F59E0B", // Orange
  "#EAB308", // Yellow
  "#EF4444", // Red
  "#EC4899", // Pink
  "#06B6D4", // Cyan
]

export function CreateFocusDialog({ onCreateTask }: CreateFocusDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0])

  const handleCreate = () => {
    if (!name.trim()) return

    const newTask: Omit<Task, "id" | "type"> = {
      name: name.trim(),
      color: selectedColor,
      gradient: {
        from: selectedColor,
        via: selectedColor,
        to: selectedColor,
      },
    }

    onCreateTask(newTask)
    setName("")
    setSelectedColor(PRESET_COLORS[0])
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm bg-white/20 hover:bg-white/30 text-white transition-colors font-medium"
          aria-label="Create custom focus type"
        >
          <Plus className="h-4 w-4" />
          New Focus
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Focus Type</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="focus-name">Focus Name</Label>
            <Input
              id="focus-name"
              placeholder="e.g., Writing, Coding, Reading"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
          </div>
          <div className="grid gap-2">
            <Label>Choose Color</Label>
            <div className="grid grid-cols-8 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    "h-8 w-8 rounded-md border-2 transition-all",
                    selectedColor === color ? "border-black scale-110" : "border-transparent hover:scale-105",
                  )}
                  style={{ backgroundColor: color }}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!name.trim()}>
            Create Focus
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
