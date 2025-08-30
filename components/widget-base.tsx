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
  customColor?: string // Added customColor property to persist widget colors
}

interface WidgetBaseProps {
  config: WidgetConfig
  onConfigChange: (id: string, newConfig: Partial<WidgetConfig>) => void
  isEditMode: boolean
  children: React.ReactNode
  className?: string
  allWidgets?: WidgetConfig[] // Added allWidgets prop to enable collision detection
}

const GRID_SIZE = 120 // Each grid cell is 120px
const GRID_GAP = 16 // Gap between grid cells

function isResizeHandleClick(offsetX: number, offsetY: number, width: number, height: number): boolean {
  const handleSize = 20 // Increased handle size from 16 to 20 for easier clicking
  return offsetX >= width - handleSize && offsetY >= height - handleSize
}

function checkCollision(
  widget1: { x: number; y: number; width: number; height: number },
  widget2: { x: number; y: number; width: number; height: number },
): boolean {
  return !(
    widget1.x + widget1.width <= widget2.x ||
    widget2.x + widget2.width <= widget1.x ||
    widget1.y + widget1.height <= widget2.y ||
    widget2.y + widget2.height <= widget1.y
  )
}

function findNearestAvailablePosition(
  desiredPosition: { x: number; y: number },
  size: { width: number; height: number },
  allWidgets: WidgetConfig[],
  currentWidgetId: string,
): { x: number; y: number } {
  const otherWidgets = allWidgets.filter((w) => w.id !== currentWidgetId && w.visible)

  // Check if desired position is available
  const hasCollision = otherWidgets.some((widget) =>
    checkCollision(
      { x: desiredPosition.x, y: desiredPosition.y, width: size.width, height: size.height },
      {
        x: widget.gridPosition.x,
        y: widget.gridPosition.y,
        width: widget.gridSize.width,
        height: widget.gridSize.height,
      },
    ),
  )

  if (!hasCollision) {
    return desiredPosition
  }

  // Find nearest available position in expanding spiral pattern
  for (let radius = 1; radius <= 10; radius++) {
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) continue

        const testPosition = {
          x: Math.max(0, desiredPosition.x + dx),
          y: Math.max(0, desiredPosition.y + dy),
        }

        const testHasCollision = otherWidgets.some((widget) =>
          checkCollision(
            { x: testPosition.x, y: testPosition.y, width: size.width, height: size.height },
            {
              x: widget.gridPosition.x,
              y: widget.gridPosition.y,
              width: widget.gridSize.width,
              height: widget.gridSize.height,
            },
          ),
        )

        if (!testHasCollision) {
          return testPosition
        }
      }
    }
  }

  // Fallback to original position if no space found
  return desiredPosition
}

export function WidgetBase({
  config,
  onConfigChange,
  isEditMode,
  children,
  className = "",
  allWidgets = [],
}: WidgetBaseProps) {
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
      e.stopPropagation() // Added stopPropagation to prevent event bubbling

      console.log("[v0] Mouse down event triggered") // Added debug logging

      onConfigChange(config.id, { gridPosition: config.gridPosition })

      const rect = widgetRef.current?.getBoundingClientRect()
      if (!rect) return

      const offsetX = e.clientX - rect.left
      const offsetY = e.clientY - rect.top

      console.log("[v0] Click position:", { offsetX, offsetY, width: rect.width, height: rect.height }) // Added debug logging

      if (isResizeHandleClick(offsetX, offsetY, rect.width, rect.height)) {
        console.log("[v0] Resize handle clicked") // Added debug logging
        setIsResizing(true)
        setResizeStart({
          x: e.clientX,
          y: e.clientY,
          width: config.gridSize.width,
          height: config.gridSize.height,
        })
      } else {
        console.log("[v0] Drag initiated") // Added debug logging
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

          const desiredGridX = Math.max(0, Math.round(dragStart.gridX + deltaX / (GRID_SIZE + GRID_GAP)))
          const desiredGridY = Math.max(0, Math.round(dragStart.gridY + deltaY / (GRID_SIZE + GRID_GAP)))

          const availablePosition = findNearestAvailablePosition(
            { x: desiredGridX, y: desiredGridY },
            config.gridSize,
            allWidgets,
            config.id,
          )

          setDragPreview(availablePosition)
        } else if (isResizing) {
          const deltaX = e.clientX - resizeStart.x
          const deltaY = e.clientY - resizeStart.y

          const newWidth = Math.max(1, Math.round(resizeStart.width + deltaX / (GRID_SIZE + GRID_GAP)))
          const newHeight = Math.max(1, Math.round(resizeStart.height + deltaY / (GRID_SIZE + GRID_GAP)))

          const otherWidgets = allWidgets.filter((w) => w.id !== config.id && w.visible)
          const wouldCollide = otherWidgets.some((widget) =>
            checkCollision(
              { x: config.gridPosition.x, y: config.gridPosition.y, width: newWidth, height: newHeight },
              {
                x: widget.gridPosition.x,
                y: widget.gridPosition.y,
                width: widget.gridSize.width,
                height: widget.gridSize.height,
              },
            ),
          )

          if (!wouldCollide) {
            setResizePreview({ width: newWidth, height: newHeight })
          }
        }
      })
    },
    [isDragging, isResizing, isEditMode, dragStart, resizeStart, config, allWidgets],
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
          backgroundColor: config.customColor || "transparent", // Added custom color styling
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
              className={`absolute -bottom-0 -right-0 w-5 h-5 cursor-nw-resize transition-all duration-150 z-10 ${
                isResizing ? "bg-primary/60 scale-110" : "bg-primary/30 hover:bg-primary/50"
              }`}
              style={{
                clipPath: "polygon(100% 0, 0 100%, 100% 100%)",
                bottom: "-2px",
                right: "-2px",
              }}
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log("[v0] Resize handle directly clicked")
                setIsResizing(true)
                setResizeStart({
                  x: e.clientX,
                  y: e.clientY,
                  width: config.gridSize.width,
                  height: config.gridSize.height,
                })
              }}
            >
              <div
                className={`absolute bottom-1 right-1 w-1.5 h-1.5 bg-primary rounded-full transition-all ${
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
