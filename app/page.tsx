"use client"

import { useState, useMemo } from "react"
import { environments } from "@/lib/data"
import { EnvironmentCard } from "@/components/environment-card"
import { FilterSidebar } from "@/components/filter-sidebar"
import { SearchBar } from "@/components/search-bar"
import { MobileFilters } from "@/components/mobile-filters"
import { ComparisonChart } from "@/components/comparison-chart"
import { InstallationGuide } from "@/components/installation-guide"
import { Button } from "@/components/ui/button"
import { RotateCcw, Github, Monitor, LayoutGrid, BarChart3, Info, BookOpen } from "lucide-react"
import { GlossaryTooltip } from "@/components/glossary-tooltip"

const initialFilters = {
  category: "all",
  tilingType: "all",
  displayServer: "all",
  resourceUsage: "all",
  customization: "all",
  beginnerFriendly: false,
  features: [] as string[],
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState(initialFilters)
  const [showComparison, setShowComparison] = useState(false)
  const [showGuide, setShowGuide] = useState(false)

  const handleFilterChange = (key: string, value: string | boolean | string[]) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters(initialFilters)
    setSearchQuery("")
  }

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.category !== "all") count++
    if (filters.tilingType !== "all") count++
    if (filters.displayServer !== "all") count++
    if (filters.resourceUsage !== "all") count++
    if (filters.customization !== "all") count++
    if (filters.beginnerFriendly) count++
    count += filters.features.length
    return count
  }, [filters])

  const filteredEnvironments = useMemo(() => {
    return environments.filter((env) => {
      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          env.name.toLowerCase().includes(query) ||
          env.description.toLowerCase().includes(query) ||
          env.features.some((f) => f.toLowerCase().includes(query))
        if (!matchesSearch) return false
      }

      // Category
      if (filters.category !== "all" && env.category !== filters.category) return false

      // Tiling Type
      if (filters.tilingType !== "all" && env.tilingType !== filters.tilingType) return false

      // Display Server
      if (filters.displayServer !== "all") {
        if (filters.displayServer === "both" && env.displayServer !== "both") return false
        if (
          filters.displayServer !== "both" &&
          env.displayServer !== filters.displayServer &&
          env.displayServer !== "both"
        )
          return false
      }

      // Resource Usage
      if (filters.resourceUsage !== "all" && env.resourceUsage !== filters.resourceUsage) return false

      // Customization
      if (filters.customization !== "all" && env.customization !== filters.customization) return false

      // Beginner Friendly
      if (filters.beginnerFriendly && !env.beginnerFriendly) return false

      // Features
      if (filters.features.length > 0) {
        const hasAllFeatures = filters.features.every((f) => env.features.includes(f))
        if (!hasAllFeatures) return false
      }

      return true
    })
  }, [searchQuery, filters])

  const deCount = filteredEnvironments.filter((e) => e.category === "desktop-environment").length
  const wmCount = filteredEnvironments.filter((e) => e.category === "window-manager").length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Monitor className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Pure de Arch</h1>
                <p className="text-xs text-muted-foreground">
                  <GlossaryTooltip term="DE" showIcon={false}>
                    DE
                  </GlossaryTooltip>
                  {" & "}
                  <GlossaryTooltip term="WM" showIcon={false}>
                    WM
                  </GlossaryTooltip>
                  {" Kereső"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant={showGuide ? "default" : "outline"}
                size="sm"
                onClick={() => setShowGuide(!showGuide)}
                className="gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Utmutato</span>
              </Button>
              <Button
                variant={showComparison ? "default" : "outline"}
                size="sm"
                onClick={() => setShowComparison(!showComparison)}
                className="gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Osszehasonlitas</span>
              </Button>
              <a
                href="https://github.com/orgs/Pure-de-Arch/repositories"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="w-5 h-5" />
                <span className="hidden sm:inline text-sm">GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 py-12 lg:py-16 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Találd meg a tökéletes
            <br />
            <span className="text-primary">asztali környezetet</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            Szűrj a <GlossaryTooltip term="Desktop Environment">Desktop Environment</GlossaryTooltip>-ek és{" "}
            <GlossaryTooltip term="Window Manager">Window Manager</GlossaryTooltip>-ek tulajdonságai alapján, hogy
            megtaláld a számodra ideális Linux asztali élményt.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border text-sm">
            <Info className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">
              Minden adat{" "}
              <GlossaryTooltip term="Arch Linux">
                <strong className="text-foreground">Arch Linux</strong>
              </GlossaryTooltip>{" "}
              alaprendszeren mérve
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {showGuide && (
          <div className="mb-8">
            <InstallationGuide />
          </div>
        )}

        {showComparison && (
          <div className="mb-8">
            <ComparisonChart onClose={() => setShowComparison(false)} />
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block">
            <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Search & Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
              </div>
              <div className="flex gap-2">
                <MobileFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  activeFiltersCount={activeFiltersCount}
                />
                {activeFiltersCount > 0 && (
                  <Button variant="outline" onClick={resetFilters} className="gap-2 bg-transparent">
                    <RotateCcw className="w-4 h-4" />
                    <span className="hidden sm:inline">Törlés</span>
                  </Button>
                )}
              </div>
            </div>

            {/* Results Info */}
            <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4" />
                <span>
                  <strong className="text-foreground">{filteredEnvironments.length}</strong> találat
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span>
                  <strong className="text-foreground">{deCount}</strong>{" "}
                  <GlossaryTooltip term="DE" showIcon={false}>
                    DE
                  </GlossaryTooltip>
                </span>
                <span>
                  <strong className="text-foreground">{wmCount}</strong>{" "}
                  <GlossaryTooltip term="WM" showIcon={false}>
                    WM
                  </GlossaryTooltip>
                </span>
              </div>
            </div>

            {/* Grid */}
            {filteredEnvironments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredEnvironments.map((env) => (
                  <EnvironmentCard key={env.id} environment={env} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Monitor className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Nincs találat</h3>
                <p className="text-muted-foreground mb-4">A megadott szűrőkkel nem található megfelelő környezet.</p>
                <Button variant="outline" onClick={resetFilters}>
                  Szűrők törlése
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p className="mb-2">
            <strong className="text-foreground">Mérési környezet:</strong>{" "}
            <GlossaryTooltip term="Arch Linux" showIcon={false}>
              Arch Linux
            </GlossaryTooltip>
            , friss telepítés, minimális háttérfolyamatok
          </p>
          <p>
            A funkciók az egyes projektek hivatalos oldalairól származnak. •{" "}
            <a
              href="https://github.com/orgs/Pure-de-Arch/repositories"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Pure de Arch
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
