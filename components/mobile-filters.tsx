"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { FilterSidebar } from "./filter-sidebar"
import { Filter } from "lucide-react"

interface MobileFiltersProps {
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
  activeFiltersCount: number
}

export function MobileFilters({ filters, onFilterChange, activeFiltersCount }: MobileFiltersProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="lg:hidden gap-2 bg-transparent">
          <Filter className="w-4 h-4" />
          Szűrők
          {activeFiltersCount > 0 && (
            <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 overflow-y-auto bg-background border-border">
        <SheetHeader>
          <SheetTitle className="text-foreground">Szűrők</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <FilterSidebar filters={filters} onFilterChange={onFilterChange} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
