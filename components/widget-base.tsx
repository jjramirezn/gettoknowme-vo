"use client"

import type React from "react"
import { useState, useCallback, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Settings, Eye, GripVertical } from "lucide-react"

interface WidgetConfig {
  id: string
  type: "social" | "profile" | "service"
  platform?: string
  gridPosition: { x: number; y: number }
  gridSize: { width: number; height: number }
  visible: boolean
}

interface WidgetBaseProps {
  config: WidgetConfig
  onConfigChange: (id: string, newConfig: Partial<WidgetConfig>) => void
  isEditMode: boolean
  children: React.ReactNode
  className?: string
}

const GRID_SIZE = 120 // Each grid cell is 120px
const GRID_GAP = 16 // Gap between grid cells

function isResizeHandleClick(offsetX: number, offsetY: number, width: number, height: number): boolean {
  const handleSize = 16
  return offsetX >= width - handleSize && offsetY >= height - handleSize
}

export function WidgetBase({ config, onConfigChange, isEditMode, children, className = "" }: WidgetBaseProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, gridX: 0, gridY: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [dragPreview, setDragPreview] = useState<{ x: number; y: number } | null>(null)
  const [resizePreview, setResizePreview] = useState<{ width: number; height: number } | null>(null)
  const widgetRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number>()

  // Convert grid position to pixel position
  const pixelPosition = {
    x: config.gridPosition.x * (GRID_SIZE + GRID_GAP),
    y: config.gridPosition.y * (GRID_SIZE + GRID_GAP),
  }

  // Convert grid size to pixel size
  const pixelSize = {
    width: config.gridSize.width * GRID_SIZE + (config.gridSize.width - 1) * GRID_GAP,
    height: config.gridSize.height * GRID_SIZE + (config.gridSize.height - 1) * GRID_GAP,
  }

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!isEditMode) return
      e.preventDefault()

      onConfigChange(config.id, { gridPosition: config.gridPosition })

      const rect = widgetRef.current?.getBoundingClientRect()
      if (!rect) return

      const offsetX = e.clientX - rect.left
      const offsetY = e.clientY - rect.top

      if (isResizeHandleClick(offsetX, offsetY, rect.width, rect.height)) {
        setIsResizing(true)
        setResizeStart({
          x: e.clientX,
          y: e.clientY,
          width: config.gridSize.width,
          height: config.gridSize.height,
        })
      } else {
        setIsDragging(true)
        setDragStart({
          x: e.clientX,
          y: e.clientY,
          gridX: config.gridPosition.x,
          gridY: config.gridPosition.y,
        })
      }
    },
    [isEditMode, config, onConfigChange],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if ((!isDragging && !isResizing) || !isEditMode) return

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        if (isDragging) {
          const deltaX = e.clientX - dragStart.x
          const deltaY = e.clientY - dragStart.y

          const newGridX = Math.max(0, Math.round(dragStart.gridX + deltaX / (GRID_SIZE + GRID_GAP)))
          const newGridY = Math.max(0, Math.round(dragStart.gridY + deltaY / (GRID_SIZE + GRID_GAP)))

          setDragPreview({ x: newGridX, y: newGridY })
        } else if (isResizing) {
          const deltaX = e.clientX - resizeStart.x
          const deltaY = e.clientY - resizeStart.y

          const newWidth = Math.max(1, Math.round(resizeStart.width + deltaX / (GRID_SIZE + GRID_GAP)))
          const newHeight = Math.max(1, Math.round(resizeStart.height + deltaY / (GRID_SIZE + GRID_GAP)))

          setResizePreview({ width: newWidth, height: newHeight })
        }
      })
    },
    [isDragging, isResizing, isEditMode, dragStart, resizeStart],
  )

  const handleMouseUp = useCallback(() => {
    if (!isDragging && !isResizing) return

    if (isDragging && dragPreview) {
      onConfigChange(config.id, { gridPosition: dragPreview })
      setDragPreview(null)
    }

    if (isResizing && resizePreview) {
      onConfigChange(config.id, { gridSize: resizePreview })
      setResizePreview(null)
    }

    setIsDragging(false)
    setIsResizing(false)

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [isDragging, isResizing, dragPreview, resizePreview, config.id, onConfigChange])

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove, { passive: false })
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
      }
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp])

  const toggleVisibility = () => {
    onConfigChange(config.id, { visible: !config.visible })
  }

  if (!config.visible) return null

  // Use preview positions/sizes during drag/resize
  const currentPosition = dragPreview
    ? {
        x: dragPreview.x * (GRID_SIZE + GRID_GAP),
        y: dragPreview.y * (GRID_SIZE + GRID_GAP),
      }
    : pixelPosition

  const currentSize = resizePreview
    ? {
        width: resizePreview.width * GRID_SIZE + (resizePreview.width - 1) * GRID_GAP,
        height: resizePreview.height * GRID_SIZE + (resizePreview.height - 1) * GRID_GAP,
      }
    : pixelSize

  return (
    <>
      {/* Grid preview during drag/resize */}
      {isDragging && dragPreview && (
        <div
          className="absolute border-2 border-dashed border-primary bg-primary/10 pointer-events-none z-40 rounded-lg"
          style={{
            left: dragPreview.x * (GRID_SIZE + GRID_GAP),
            top: dragPreview.y * (GRID_SIZE + GRID_GAP),
            width: pixelSize.width,
            height: pixelSize.height,
          }}
        />
      )}

      {isResizing && resizePreview && (
        <div
          className="absolute border-2 border-dashed border-primary bg-primary/10 pointer-events-none z-40 rounded-lg"
          style={{
            left: pixelPosition.x,
            top: pixelPosition.y,
            width: resizePreview.width * GRID_SIZE + (resizePreview.width - 1) * GRID_GAP,
            height: resizePreview.height * GRID_SIZE + (resizePreview.height - 1) * GRID_GAP,
          }}
        />
      )}

      <Card
        ref={widgetRef}
        className={`absolute border-2 transition-all duration-100 ${
          isDragging ? "shadow-2xl scale-[1.02] z-50" : "hover:shadow-lg"
        } ${isEditMode ? "cursor-move" : ""} bg-card border-border ${isResizing ? "z-30" : ""} ${className}`}
        style={{
          left: currentPosition.x,
          top: currentPosition.y,
          width: currentSize.width,
          height: currentSize.height,
        }}
        onMouseDown={handleMouseDown}
      >
        <CardContent className="p-4 h-full overflow-hidden relative">
          {children}

          {/* Edit mode controls */}
          {isEditMode && (
            <div className="absolute top-2 right-2 flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 bg-background/80">
                    <Settings className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={toggleVisibility}>
                    <Eye className="w-4 h-4 mr-2" />
                    Hide Widget
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="cursor-move bg-background/80 rounded p-1">
                <GripVertical className="w-3 h-3 text-muted-foreground" />
              </div>
            </div>
          )}

          {/* Resize handle */}
          {isEditMode && (
            <div
              className={`absolute bottom-0 right-0 w-4 h-4 cursor-nw-resize transition-all duration-150 ${
                isResizing ? "bg-primary/60 scale-110" : "bg-primary/20 hover:bg-primary/40"
              }`}
              style={{
                clipPath: "polygon(100% 0, 0 100%, 100% 100%)",
              }}
            >
              <div
                className={`absolute bottom-1 right-1 w-1 h-1 bg-primary rounded-full transition-all ${
                  isResizing ? "scale-125" : ""
                }`}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}

export type { WidgetConfig }
