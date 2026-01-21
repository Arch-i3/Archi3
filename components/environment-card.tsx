"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Monitor, Cpu, Palette, User, Maximize2, X, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlossaryTooltip } from "@/components/glossary-tooltip"
import type { Environment } from "@/lib/data"

interface EnvironmentCardProps {
  environment: Environment
}

const resourceColors = {
  lightweight: "bg-green-500/20 text-green-400 border-green-500/30",
  moderate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  heavy: "bg-red-500/20 text-red-400 border-red-500/30",
}

const customizationColors = {
  low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  medium: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  high: "bg-pink-500/20 text-pink-400 border-pink-500/30",
}

export function EnvironmentCard({ environment }: EnvironmentCardProps) {
  const [showPreview, setShowPreview] = useState(false)

  const getDisplayServerLabel = (ds: string) => {
    if (ds === "x11") return "X11"
    if (ds === "wayland") return "Wayland"
    return "X11 & Wayland"
  }

  const getTilingLabel = (type: string) => {
    switch (type) {
      case "stacking":
        return "Stacking"
      case "tiling":
        return "Tiling"
      case "dynamic":
        return "Dynamic"
      case "manual":
        return "Manual"
      default:
        return type
    }
  }

  const getResourceLabel = (usage: string) => {
    switch (usage) {
      case "lightweight":
        return "Könnyű"
      case "moderate":
        return "Közepes"
      case "heavy":
        return "Nehéz"
      default:
        return usage
    }
  }

  return (
    <>
      <Card className="group bg-card border-border hover:border-primary/50 transition-all duration-300 h-full flex flex-col">
        <CardHeader className="pb-3">
          <div
            className="relative w-full h-36 rounded-lg overflow-hidden mb-3 cursor-pointer group/screenshot"
            onClick={() => setShowPreview(true)}
          >
            <img
              src={environment.screenshot || "/placeholder.svg"}
              alt={`${environment.name} asztali előkép`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover/screenshot:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover/screenshot:bg-black/40 transition-colors flex items-center justify-center">
              <Maximize2 className="w-8 h-8 text-white opacity-0 group-hover/screenshot:opacity-100 transition-opacity" />
            </div>
          </div>

          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                <img
                  src={environment.logo || "/placeholder.svg"}
                  alt={`${environment.name} logo`}
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {environment.name}
                </CardTitle>
                <Badge
                  variant="outline"
                  className="mt-1 text-xs capitalize bg-secondary text-secondary-foreground border-border"
                >
                  <GlossaryTooltip term={environment.category === "desktop-environment" ? "DE" : "WM"} showIcon={false}>
                    {environment.category === "desktop-environment" ? "DE" : "WM"}
                  </GlossaryTooltip>
                </Badge>
              </div>
            </div>
            <a
              href={environment.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label={`Visit ${environment.name} website`}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          <CardDescription className="text-muted-foreground mt-2 text-sm leading-relaxed">
            {environment.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4">
          {/* Stats - Added tooltips to display server and tiling type */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Monitor className="w-3.5 h-3.5" />
              <GlossaryTooltip term={getDisplayServerLabel(environment.displayServer)} showIcon={false}>
                <span className="capitalize">{getDisplayServerLabel(environment.displayServer)}</span>
              </GlossaryTooltip>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Cpu className="w-3.5 h-3.5" />
              <GlossaryTooltip term={getTilingLabel(environment.tilingType)} showIcon={false}>
                <span className="capitalize">{getTilingLabel(environment.tilingType)}</span>
              </GlossaryTooltip>
            </div>
          </div>

          {/* Badges - Added tooltips to resource and customization badges */}
          <div className="flex flex-wrap gap-2">
            <Badge className={`text-xs border ${resourceColors[environment.resourceUsage]}`}>
              <Cpu className="w-3 h-3 mr-1" />
              <GlossaryTooltip term={getResourceLabel(environment.resourceUsage)} showIcon={false}>
                {getResourceLabel(environment.resourceUsage)}
              </GlossaryTooltip>
            </Badge>
            <Badge className={`text-xs border ${customizationColors[environment.customization]}`}>
              <Palette className="w-3 h-3 mr-1" />
              <GlossaryTooltip term="Testreszabhatóság" showIcon={false}>
                {environment.customization === "low"
                  ? "Alacsony"
                  : environment.customization === "medium"
                    ? "Közepes"
                    : "Magas"}{" "}
                testreszabás
              </GlossaryTooltip>
            </Badge>
            {environment.beginnerFriendly && (
              <Badge className="text-xs border bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                <User className="w-3 h-3 mr-1" />
                Kezdőbarát
              </Badge>
            )}
          </div>

          {/* Features */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Fobb funkciok:</p>
            <div className="flex flex-wrap gap-1.5">
              {environment.features.slice(0, 6).map((feature) => (
                <span
                  key={feature}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-secondary/80 text-secondary-foreground border border-border hover:bg-primary/20 hover:text-primary hover:border-primary/40 transition-all cursor-default"
                >
                  {feature}
                </span>
              ))}
              {environment.features.length > 6 && (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-muted/50 text-muted-foreground border border-border">
                  +{environment.features.length - 6}
                </span>
              )}
            </div>
          </div>

          {/* Download Button */}
          <div className="mt-auto pt-4">
            <Button
              variant="outline"
              className="w-full gap-2 bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 hover:border-primary/50"
              disabled
            >
              <Download className="w-4 h-4" />
              Letöltés
            </Button>
          </div>
        </CardContent>
      </Card>

      {showPreview && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setShowPreview(false)}
        >
          <button
            onClick={() => setShowPreview(false)}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            aria-label="Bezárás"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={environment.screenshot || "/placeholder.svg"}
              alt={`${environment.name} asztali előkép`}
              className="w-full h-auto rounded-lg shadow-2xl"
            />
            <div className="mt-4 text-center">
              <h3 className="text-xl font-semibold text-white">{environment.name}</h3>
              <p className="text-white/70 text-sm mt-1">
                {environment.category === "desktop-environment" ? "Desktop Environment" : "Window Manager"}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
