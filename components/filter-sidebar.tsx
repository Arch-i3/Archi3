"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroupItem } from "@/components/ui/radio-group"
import { RadioGroup } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { filterOptions, allFeatures } from "@/lib/data"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import { GlossaryTooltip } from "@/components/glossary-tooltip"
import { cn } from "@/lib/utils"

interface FilterSidebarProps {
  filters: {
    category: string
    tilingType: string
    displayServer: string
    resourceUsage: string
    customization: string
    beginnerFriendly: boolean
    features: string[]
  }
  onFilterChange: (key: string, value: string | boolean | string[]) => void
}

const termMapping: Record<string, string> = {
  "desktop-environment": "Desktop Environment",
  "window-manager": "Window Manager",
  stacking: "Stacking",
  tiling: "Tiling",
  dynamic: "Dynamic",
  manual: "Manual",
  x11: "X11",
  wayland: "Wayland",
  both: "X11",
  lightweight: "Könnyű",
  moderate: "Közepes",
  heavy: "Nehéz",
}

interface FilterChipProps {
  label: string
  isSelected: boolean
  onClick: () => void
  glossaryTerm?: string
}

function FilterChip({ label, isSelected, onClick, glossaryTerm }: FilterChipProps) {
  const content = (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
        "border cursor-pointer",
        isSelected
          ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/25"
          : "bg-muted/50 text-muted-foreground border-border hover:bg-muted hover:border-muted-foreground/30"
      )}
    >
      {label}
    </button>
  )

  if (glossaryTerm) {
    return (
      <GlossaryTooltip term={glossaryTerm} showIcon={false}>
        {content}
      </GlossaryTooltip>
    )
  }

  return content
}

export function FilterSidebar({ filters, onFilterChange }: FilterSidebarProps) {
  const [featuresExpanded, setFeaturesExpanded] = useState(false)
  const displayedFeatures = featuresExpanded ? allFeatures : allFeatures.slice(0, 10)

  const handleFeatureToggle = (feature: string) => {
    const newFeatures = filters.features.includes(feature)
      ? filters.features.filter((f) => f !== feature)
      : [...filters.features, feature]
    onFilterChange("features", newFeatures)
  }

  const renderOptionLabel = (value: string, label: string) => {
    const term = termMapping[value]
    if (term && value !== "all") {
      return (
        <GlossaryTooltip term={term} showIcon={false}>
          {label}
        </GlossaryTooltip>
      )
    }
    return label
  }

  return (
    <aside className="w-full lg:w-72 shrink-0">
      <div className="sticky top-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Szűrők</h2>
        </div>

        {/* Category */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Típus</Label>
          <RadioGroup
            value={filters.category}
            onValueChange={(value) => onFilterChange("category", value)}
            className="space-y-2"
          >
            {filterOptions.category.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`category-${option.value}`} />
                <Label htmlFor={`category-${option.value}`} className="text-sm text-muted-foreground cursor-pointer">
                  {renderOptionLabel(option.value, option.label)}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Separator className="bg-border" />

        {/* Display Server */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">
            <GlossaryTooltip term="Display Server">Display Server</GlossaryTooltip>
          </Label>
          <RadioGroup
            value={filters.displayServer}
            onValueChange={(value) => onFilterChange("displayServer", value)}
            className="space-y-2"
          >
            {filterOptions.displayServer.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`display-${option.value}`} />
                <Label htmlFor={`display-${option.value}`} className="text-sm text-muted-foreground cursor-pointer">
                  {renderOptionLabel(option.value, option.label)}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Separator className="bg-border" />

        {/* Tiling Type */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Ablakkezelés</Label>
          <RadioGroup
            value={filters.tilingType}
            onValueChange={(value) => onFilterChange("tilingType", value)}
            className="space-y-2"
          >
            {filterOptions.tilingType.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`tiling-${option.value}`} />
                <Label htmlFor={`tiling-${option.value}`} className="text-sm text-muted-foreground cursor-pointer">
                  {renderOptionLabel(option.value, option.label)}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Separator className="bg-border" />

        {/* Resource Usage */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Erőforrás-igény</Label>
          <RadioGroup
            value={filters.resourceUsage}
            onValueChange={(value) => onFilterChange("resourceUsage", value)}
            className="space-y-2"
          >
            {filterOptions.resourceUsage.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`resource-${option.value}`} />
                <Label htmlFor={`resource-${option.value}`} className="text-sm text-muted-foreground cursor-pointer">
                  {renderOptionLabel(option.value, option.label)}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Separator className="bg-border" />

        {/* Customization */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">
            <GlossaryTooltip term="Testreszabhatóság">Testreszabhatóság</GlossaryTooltip>
          </Label>
          <RadioGroup
            value={filters.customization}
            onValueChange={(value) => onFilterChange("customization", value)}
            className="space-y-2"
          >
            {filterOptions.customization.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`custom-${option.value}`} />
                <Label htmlFor={`custom-${option.value}`} className="text-sm text-muted-foreground cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Separator className="bg-border" />

        {/* Beginner Friendly */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="beginner"
            checked={filters.beginnerFriendly}
            onCheckedChange={(checked) => onFilterChange("beginnerFriendly", checked as boolean)}
          />
          <Label htmlFor="beginner" className="text-sm text-muted-foreground cursor-pointer">
            Csak kezdőbarát
          </Label>
        </div>

        <Separator className="bg-border" />

        {/* Features */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Funkciók</Label>
          <div className="space-y-2">
            {displayedFeatures.map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox
                  id={`feature-${feature}`}
                  checked={filters.features.includes(feature)}
                  onCheckedChange={() => handleFeatureToggle(feature)}
                />
                <Label htmlFor={`feature-${feature}`} className="text-sm text-muted-foreground cursor-pointer truncate">
                  {feature}
                </Label>
              </div>
            ))}
          </div>
          {allFeatures.length > 10 && (
            <button
              onClick={() => setFeaturesExpanded(!featuresExpanded)}
              className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              {featuresExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Kevesebb
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Több ({allFeatures.length - 10})
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}
