"use client"

import type React from "react"

import { TooltipProvider } from "@/components/ui/tooltip"

type TooltipProviderProps = {
  children: React.ReactNode
}

export function AppTooltipProvider({ children }: TooltipProviderProps) {
  return <TooltipProvider>{children}</TooltipProvider>
}
