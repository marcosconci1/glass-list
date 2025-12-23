"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface AddProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProjectAdd?: (project: { name: string; color: string; isFavorite: boolean }) => void
}

export function AddProjectDialog({ open, onOpenChange, onProjectAdd }: AddProjectDialogProps) {
  const [name, setName] = useState("")
  const [color, setColor] = useState("rgb(64, 64, 64)")
  const [addToFavorites, setAddToFavorites] = useState(true)

  const colors = [
    { name: "Charcoal", value: "rgb(64, 64, 64)" },
    { name: "Red", value: "rgb(239, 68, 68)" },
    { name: "Orange", value: "rgb(249, 115, 22)" },
    { name: "Yellow", value: "rgb(234, 179, 8)" },
    { name: "Green", value: "rgb(34, 197, 94)" },
    { name: "Blue", value: "rgb(59, 130, 246)" },
    { name: "Purple", value: "rgb(168, 85, 247)" },
    { name: "Pink", value: "rgb(236, 72, 153)" },
  ]

  const selectedColor = colors.find((c) => c.value === color)

  const resetForm = () => {
    setName("")
    setColor("rgb(64, 64, 64)")
    setAddToFavorites(true)
  }

  const handleDialogOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetForm()
    }
    onOpenChange(nextOpen)
  }

  const handleAdd = () => {
    const projectData = { name, color, isFavorite: addToFavorites }
    
    onProjectAdd?.(projectData)

    resetForm()
    onOpenChange(false)
  }

  const handleCancel = () => {
    resetForm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#1a1a1a] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            Add project
            <span className="text-muted-foreground text-sm">ⓘ</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Add to Favorites */}
          <div className="flex items-center justify-between">
            <Label htmlFor="favorites" className="text-white/90">
              Add to favorites
            </Label>
            <Switch id="favorites" checked={addToFavorites} onCheckedChange={setAddToFavorites} />
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white/90">
              Name
            </Label>
            <div className="relative">
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={120}
                className="bg-[#0a0a0a] border-white/10 text-white"
                placeholder="Project name"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                {name.length}/120
              </span>
            </div>
          </div>

          {/* Color Select */}
          <div className="space-y-2">
            <Label htmlFor="color" className="text-white/90">
              Color
            </Label>
            <Select value={color} onValueChange={setColor}>
              <SelectTrigger id="color" className="w-full bg-[#0a0a0a] border-white/10 text-white">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                  <span>{selectedColor?.name || "Select color"}</span>
                </div>
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-white/10">
                {colors.map((c) => (
                  <SelectItem key={c.value} value={c.value} className="text-white">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: c.value }} />
                      {c.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="bg-transparent border-white/10 text-white hover:bg-white/5"
          >
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={!name.trim()} className="bg-red-600 hover:bg-red-700 text-white">
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
