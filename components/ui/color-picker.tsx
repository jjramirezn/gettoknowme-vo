"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Palette } from "lucide-react"

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  className?: string
  size?: "sm" | "default"
  presetColors?: string[]
}

const PRESET_COLORS = [
  "#f8fafc", // slate-50
  "#f1f5f9", // slate-100
  "#e2e8f0", // slate-200
  "#fef7ed", // orange-50
  "#fff7ed", // orange-100
  "#fef3c7", // amber-100
  "#fef9e3", // yellow-50
  "#f0fdf4", // green-50
  "#ecfdf5", // green-100
  "#f0f9ff", // sky-50
  "#eff6ff", // blue-50
  "#f5f3ff", // violet-50
  "#fdf4ff", // fuchsia-50
  "#fdf2f8", // pink-50
  "#fff1f2", // rose-50
]

export function ColorPicker({
  value,
  onChange,
  className,
  size = "default",
  presetColors = PRESET_COLORS,
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (size === "sm") {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            className={`w-5 h-5 rounded-full border-2 border-gray-300 hover:scale-110 transition-transform ${className}`}
            style={{ backgroundColor: value }}
            title="Change color"
          />
        </PopoverTrigger>
        <PopoverContent className="w-48 p-3" align="start">
          <div className="space-y-2">
            <h4 className="font-medium text-xs">Widget color</h4>
            <div className="grid grid-cols-4 gap-1">
              {presetColors.map((color) => (
                <button
                  key={color}
                  className={`w-6 h-6 rounded border transition-all hover:scale-110 ${
                    value === color ? "border-primary ring-1 ring-primary/20" : "border-border"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    onChange(color)
                    setIsOpen(false)
                  }}
                  title={color}
                />
              ))}
            </div>
            <div className="pt-1 border-t">
              <div className="relative">
                <label className="text-xs text-muted-foreground mb-1 block">Custom color:</label>
                <input
                  type="color"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-full h-8 rounded-md border-2 border-dashed border-gray-300 hover:border-primary cursor-pointer transition-all hover:shadow-sm bg-white"
                  title="Click to open color picker"
                />
                <div className="absolute inset-0 rounded-md pointer-events-none border border-gray-200 flex items-center justify-center">
                  <Palette className="w-3 h-3 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className={`flex items-center gap-2 ${className}`}>
          <div className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: value }} />
          <Palette className="w-4 h-4" />
          Background
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4" align="start">
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Choose background color</h4>
          <div className="grid grid-cols-5 gap-2">
            {presetColors.map((color) => (
              <button
                key={color}
                className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                  value === color ? "border-primary ring-2 ring-primary/20" : "border-border"
                }`}
                style={{ backgroundColor: color }}
                onClick={() => {
                  onChange(color)
                  setIsOpen(false)
                }}
                title={color}
              />
            ))}
          </div>
          <div className="pt-2 border-t">
            <div className="relative">
              <label className="text-xs text-muted-foreground mb-2 block">Custom color:</label>
              <input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-10 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary cursor-pointer transition-all hover:shadow-md bg-white"
                title="Click to open color picker"
              />
              <div className="absolute inset-0 rounded-lg pointer-events-none border border-gray-200 flex items-center justify-center">
                <Palette className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
