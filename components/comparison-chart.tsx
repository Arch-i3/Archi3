"use client"

import { useState, useMemo } from "react"
import { environments, type Environment, type Category } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  ComposedChart,
  LabelList,
} from "recharts"
import {
  X,
  Plus,
  BarChart3,
  Monitor,
  Layout,
  Info,
  Cpu,
  HardDrive,
  MemoryStickIcon,
  TrendingUp,
  TrendingDown,
  Gauge,
  PieChartIcon,
} from "lucide-react"
import { GlossaryTooltip } from "./glossary-tooltip"

type MetricType = "memory" | "cpu" | "disk"

interface ComparisonChartProps {
  onClose: () => void
}

const COLORS = {
  primary: "hsl(187, 80%, 50%)",
  secondary: "hsl(280, 60%, 60%)",
  tertiary: "hsl(45, 90%, 55%)",
  quaternary: "hsl(340, 70%, 55%)",
  memory: "hsl(187, 80%, 50%)",
  cpu: "hsl(280, 60%, 60%)",
  disk: "hsl(45, 90%, 55%)",
}

export function ComparisonChart({ onClose }: ComparisonChartProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>("desktop-environment")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [selectedMetric, setSelectedMetric] = useState<MetricType>("memory")

  const availableItems = useMemo(() => {
    return environments.filter((env) => env.category === selectedCategory)
  }, [selectedCategory])

  const comparisonData = useMemo(() => {
    return selectedItems
      .map((id) => environments.find((env) => env.id === id))
      .filter((env): env is Environment => env !== undefined)
      .map((env) => ({
        name: env.name,
        memory: env.memoryUsageMB,
        cpu: env.cpuUsagePercent,
        disk: env.diskSpaceMB,
        id: env.id,
      }))
  }, [selectedItems])

  const allCategoryData = useMemo(() => {
    return availableItems
      .map((env) => ({
        name: env.name,
        memory: env.memoryUsageMB,
        cpu: env.cpuUsagePercent,
        disk: env.diskSpaceMB,
        id: env.id,
      }))
      .sort((a, b) => {
        if (selectedMetric === "memory") return a.memory - b.memory
        if (selectedMetric === "cpu") return a.cpu - b.cpu
        return a.disk - b.disk
      })
  }, [availableItems, selectedMetric])

  const radarData = useMemo(() => {
    if (comparisonData.length === 0) return []

    const maxMemory = Math.max(...environments.map((d) => d.memoryUsageMB), 1000)
    const maxCpu = Math.max(...environments.map((d) => d.cpuUsagePercent), 5)
    const maxDisk = Math.max(...environments.map((d) => d.diskSpaceMB), 2000)

    return [
      {
        metric: "RAM",
        fullMark: 100,
        ...Object.fromEntries(comparisonData.map((d) => [d.name, Math.round((d.memory / maxMemory) * 100)])),
      },
      {
        metric: "CPU",
        fullMark: 100,
        ...Object.fromEntries(comparisonData.map((d) => [d.name, Math.round((d.cpu / maxCpu) * 100)])),
      },
      {
        metric: "Tárhely",
        fullMark: 100,
        ...Object.fromEntries(comparisonData.map((d) => [d.name, Math.round((d.disk / maxDisk) * 100)])),
      },
    ]
  }, [comparisonData])

  const pieData = useMemo(() => {
    if (comparisonData.length === 0) return []
    return comparisonData.map((item, index) => ({
      name: item.name,
      value: selectedMetric === "memory" ? item.memory : selectedMetric === "cpu" ? item.cpu : item.disk,
      fill: [COLORS.primary, COLORS.secondary, COLORS.tertiary, COLORS.quaternary][index],
    }))
  }, [comparisonData, selectedMetric])

  const composedData = useMemo(() => {
    return comparisonData.map((item) => ({
      ...item,
      efficiency: Math.round((1000 / item.memory) * 100), // Higher = more efficient
    }))
  }, [comparisonData])

  const statsData = useMemo(() => {
    if (comparisonData.length === 0) return null

    const totalMemory = comparisonData.reduce((sum, d) => sum + d.memory, 0)
    const totalCpu = comparisonData.reduce((sum, d) => sum + d.cpu, 0)
    const totalDisk = comparisonData.reduce((sum, d) => sum + d.disk, 0)
    const avgMemory = totalMemory / comparisonData.length
    const avgCpu = totalCpu / comparisonData.length
    const avgDisk = totalDisk / comparisonData.length

    const minMemory = Math.min(...comparisonData.map((d) => d.memory))
    const maxMemory = Math.max(...comparisonData.map((d) => d.memory))
    const minCpu = Math.min(...comparisonData.map((d) => d.cpu))
    const maxCpu = Math.max(...comparisonData.map((d) => d.cpu))
    const minDisk = Math.min(...comparisonData.map((d) => d.disk))
    const maxDisk = Math.max(...comparisonData.map((d) => d.disk))

    const mostEfficient = comparisonData.reduce((prev, curr) => (prev.memory < curr.memory ? prev : curr))
    const leastEfficient = comparisonData.reduce((prev, curr) => (prev.memory > curr.memory ? prev : curr))

    return {
      avgMemory: avgMemory.toFixed(0),
      avgCpu: avgCpu.toFixed(2),
      avgDisk: avgDisk.toFixed(0),
      minMemory,
      maxMemory,
      minCpu,
      maxCpu,
      minDisk,
      maxDisk,
      memoryDiff: maxMemory - minMemory,
      cpuDiff: (maxCpu - minCpu).toFixed(2),
      diskDiff: maxDisk - minDisk,
      mostEfficient,
      leastEfficient,
      savingsPercent: Math.round(((maxMemory - minMemory) / maxMemory) * 100),
    }
  }, [comparisonData])

  const handleAddItem = (id: string) => {
    if (selectedItems.length < 4 && !selectedItems.includes(id)) {
      setSelectedItems([...selectedItems, id])
    }
  }

  const handleRemoveItem = (id: string) => {
    setSelectedItems(selectedItems.filter((item) => item !== id))
  }

  const handleCategoryChange = (category: Category) => {
    setSelectedCategory(category)
    setSelectedItems([])
  }

  const getBarColor = (index: number) => {
    const colors = [COLORS.primary, COLORS.secondary, COLORS.tertiary, COLORS.quaternary]
    return colors[index % colors.length]
  }

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean
    payload?: Array<{ value: number; payload: { name: string; memory: number; cpu: number; disk: number } }>
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-popover border border-border rounded-xl p-4 shadow-xl">
          <p className="font-bold text-foreground mb-3 text-base border-b border-border pb-2">{data.name}</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${COLORS.memory}20` }}
              >
                <MemoryStickIcon className="w-5 h-5" style={{ color: COLORS.memory }} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">RAM használat</p>
                <p className="font-bold text-lg" style={{ color: COLORS.memory }}>
                  {data.memory} MB
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${COLORS.cpu}20` }}
              >
                <Cpu className="w-5 h-5" style={{ color: COLORS.cpu }} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">CPU (idle)</p>
                <p className="font-bold text-lg" style={{ color: COLORS.cpu }}>
                  {data.cpu}%
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${COLORS.disk}20` }}
              >
                <HardDrive className="w-5 h-5" style={{ color: COLORS.disk }} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tárhely igény</p>
                <p className="font-bold text-lg" style={{ color: COLORS.disk }}>
                  {data.disk} MB
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  const getMetricInfo = (metric: MetricType) => {
    switch (metric) {
      case "memory":
        return { label: "RAM használat", unit: "MB", icon: MemoryStickIcon, dataKey: "memory", color: COLORS.memory }
      case "cpu":
        return { label: "CPU használat (idle)", unit: "%", icon: Cpu, dataKey: "cpu", color: COLORS.cpu }
      case "disk":
        return { label: "Tárhely igény", unit: "MB", icon: HardDrive, dataKey: "disk", color: COLORS.disk }
    }
  }

  const metricInfo = getMetricInfo(selectedMetric)

  const ProgressBar = ({ value, max, color, label }: { value: number; max: number; color: string; label: string }) => {
    const percentage = Math.min((value / max) * 100, 100)
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-medium">
            {value} {label === "CPU" ? "%" : "MB"}
          </span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%`, backgroundColor: color }}
          />
        </div>
      </div>
    )
  }

  const GaugeIndicator = ({
    value,
    max,
    label,
    color,
  }: { value: number; max: number; label: string; color: string }) => {
    const percentage = Math.min((value / max) * 100, 100)
    const circumference = 2 * Math.PI * 40
    const strokeDashoffset = circumference - (percentage / 100) * circumference * 0.75

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 transform -rotate-135" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference * 0.75}
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference * 0.75}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold">{Math.round(percentage)}%</span>
          </div>
        </div>
        <span className="text-xs text-muted-foreground mt-1">{label}</span>
      </div>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Erőforrás-használat összehasonlítása</CardTitle>
              <p className="text-sm text-muted-foreground">RAM, CPU és tárhely igény vizuális összehasonlítása</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
            <Info className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Arch Linux alaprendszer</p>
            <p className="text-sm text-muted-foreground">
              Minden mérés azonos <strong className="text-foreground">Arch Linux</strong> alaprendszeren, friss
              telepítés után, minimális háttérfolyamatokkal. A <GlossaryTooltip term="CPU" /> használat idle állapotban
              mért érték.
            </p>
          </div>
        </div>

        {/* Category Selection */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant={selectedCategory === "desktop-environment" ? "default" : "outline"}
            onClick={() => handleCategoryChange("desktop-environment")}
            className="gap-2 rounded-xl"
            size="lg"
          >
            <Monitor className="w-5 h-5" />
            <GlossaryTooltip term="DE">Desktop Environments</GlossaryTooltip>
          </Button>
          <Button
            variant={selectedCategory === "window-manager" ? "default" : "outline"}
            onClick={() => handleCategoryChange("window-manager")}
            className="gap-2 rounded-xl"
            size="lg"
          >
            <Layout className="w-5 h-5" />
            <GlossaryTooltip term="WM">Window Managers</GlossaryTooltip>
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 p-4 bg-muted/30 rounded-xl border border-border">
          <span className="text-sm text-muted-foreground self-center mr-3 font-medium">Metrika:</span>
          <Button
            variant={selectedMetric === "memory" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedMetric("memory")}
            className="gap-2 rounded-lg"
            style={selectedMetric === "memory" ? { backgroundColor: COLORS.memory } : {}}
          >
            <MemoryStickIcon className="w-4 h-4" />
            RAM
          </Button>
          <Button
            variant={selectedMetric === "cpu" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedMetric("cpu")}
            className="gap-2 rounded-lg"
            style={selectedMetric === "cpu" ? { backgroundColor: COLORS.cpu } : {}}
          >
            <Cpu className="w-4 h-4" />
            CPU
          </Button>
          <Button
            variant={selectedMetric === "disk" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedMetric("disk")}
            className="gap-2 rounded-lg"
            style={selectedMetric === "disk" ? { backgroundColor: COLORS.disk } : {}}
          >
            <HardDrive className="w-4 h-4" />
            Tárhely
          </Button>
        </div>

        <Tabs defaultValue="compare" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted h-12 rounded-xl p-1">
            <TabsTrigger value="compare" className="rounded-lg gap-2 data-[state=active]:bg-background">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Oszlop</span>
            </TabsTrigger>
            <TabsTrigger value="visual" className="rounded-lg gap-2 data-[state=active]:bg-background">
              <Gauge className="w-4 h-4" />
              <span className="hidden sm:inline">Vizuális</span>
            </TabsTrigger>
            <TabsTrigger value="radar" className="rounded-lg gap-2 data-[state=active]:bg-background">
              <PieChartIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Radar</span>
            </TabsTrigger>
            <TabsTrigger value="all" className="rounded-lg gap-2 data-[state=active]:bg-background">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Összes</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visual" className="space-y-4 mt-4">
            {/* Item Selection */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-muted-foreground">Kiválasztva ({selectedItems.length}/4):</span>
              {selectedItems.map((id) => {
                const env = environments.find((e) => e.id === id)
                return (
                  <Button
                    key={id}
                    variant="secondary"
                    size="sm"
                    onClick={() => handleRemoveItem(id)}
                    className="gap-1 rounded-lg"
                  >
                    {env?.name}
                    <X className="w-3 h-3" />
                  </Button>
                )
              })}
              {selectedItems.length < 4 && (
                <Select onValueChange={handleAddItem}>
                  <SelectTrigger className="w-[180px] bg-transparent rounded-lg">
                    <div className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      <span>Hozzáadás</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {availableItems
                      .filter((env) => !selectedItems.includes(env.id))
                      .map((env) => (
                        <SelectItem key={env.id} value={env.id}>
                          {env.name} ({env.memoryUsageMB} MB)
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {comparisonData.length > 0 ? (
              <div className="space-y-6">
                {/* Gauge indicators */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {comparisonData.map((item, index) => (
                    <div key={item.id} className="p-4 rounded-xl bg-muted/30 border border-border">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getBarColor(index) }} />
                        <span className="font-semibold text-sm">{item.name}</span>
                      </div>
                      <div className="flex justify-center mb-4">
                        <GaugeIndicator
                          value={
                            selectedMetric === "memory" ? item.memory : selectedMetric === "cpu" ? item.cpu : item.disk
                          }
                          max={selectedMetric === "memory" ? 1000 : selectedMetric === "cpu" ? 5 : 2000}
                          label={metricInfo.label}
                          color={getBarColor(index)}
                        />
                      </div>
                      <div className="space-y-2">
                        <ProgressBar value={item.memory} max={1000} color={COLORS.memory} label="RAM" />
                        <ProgressBar value={item.cpu} max={5} color={COLORS.cpu} label="CPU" />
                        <ProgressBar value={item.disk} max={2000} color={COLORS.disk} label="Tárhely" />
                      </div>
                    </div>
                  ))}
                </div>

                {statsData && comparisonData.length > 1 && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                    <div className="flex items-center gap-3 mb-3">
                      <TrendingDown className="w-5 h-5 text-green-500" />
                      <span className="font-semibold">Gyors összehasonlítás</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-bold text-green-500">{statsData.mostEfficient.name}</span>
                      <span className="text-muted-foreground">a leghatékonyabb,</span>
                      <span className="font-bold">{statsData.savingsPercent}%</span>
                      <span className="text-muted-foreground">RAM megtakarítás a</span>
                      <span className="font-bold text-red-400">{statsData.leastEfficient.name}</span>
                      <span className="text-muted-foreground">-hoz képest.</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center border border-dashed border-border rounded-xl">
                <div className="text-center text-muted-foreground">
                  <Gauge className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Válassz ki legalább egy {selectedCategory === "desktop-environment" ? "DE" : "WM"}-t</p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="compare" className="space-y-4 mt-4">
            {/* Item Selection */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-muted-foreground">Kiválasztva ({selectedItems.length}/4):</span>
              {selectedItems.map((id) => {
                const env = environments.find((e) => e.id === id)
                return (
                  <Button
                    key={id}
                    variant="secondary"
                    size="sm"
                    onClick={() => handleRemoveItem(id)}
                    className="gap-1 rounded-lg"
                  >
                    {env?.name}
                    <X className="w-3 h-3" />
                  </Button>
                )
              })}
              {selectedItems.length < 4 && (
                <Select onValueChange={handleAddItem}>
                  <SelectTrigger className="w-[180px] bg-transparent rounded-lg">
                    <div className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      <span>Hozzáadás</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {availableItems
                      .filter((env) => !selectedItems.includes(env.id))
                      .map((env) => (
                        <SelectItem key={env.id} value={env.id}>
                          {env.name} ({env.memoryUsageMB} MB)
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {comparisonData.length > 0 ? (
              <>
                <div className="h-[350px] w-full rounded-xl bg-muted/20 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={comparisonData}
                      layout="vertical"
                      margin={{ top: 10, right: 60, left: 80, bottom: 10 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--border))"
                        horizontal={true}
                        vertical={false}
                      />
                      <XAxis
                        type="number"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={13}
                        fontWeight={500}
                        tickLine={false}
                        axisLine={false}
                        width={70}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }} />
                      <Bar dataKey={metricInfo.dataKey} radius={[0, 8, 8, 0]} maxBarSize={45}>
                        {comparisonData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={getBarColor(index)} />
                        ))}
                        <LabelList
                          dataKey={metricInfo.dataKey}
                          position="right"
                          fill="hsl(var(--foreground))"
                          fontSize={12}
                          fontWeight={600}
                          formatter={(value: number) => `${value} ${metricInfo.unit}`}
                        />
                      </Bar>
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                {statsData && comparisonData.length > 1 && (
                  <div className="space-y-4">
                    {/* Winner/Loser cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/30">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingDown className="w-5 h-5 text-green-500" />
                          <span className="text-sm text-green-400 font-medium">Legkevesebb erőforrás</span>
                        </div>
                        <p className="text-xl font-bold">{statsData.mostEfficient.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {statsData.mostEfficient.memory} MB RAM, {statsData.mostEfficient.cpu}% CPU
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-red-500/20 to-red-500/5 border border-red-500/30">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-5 h-5 text-red-400" />
                          <span className="text-sm text-red-400 font-medium">Legtöbb erőforrás</span>
                        </div>
                        <p className="text-xl font-bold">{statsData.leastEfficient.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {statsData.leastEfficient.memory} MB RAM, {statsData.leastEfficient.cpu}% CPU
                        </p>
                      </div>
                    </div>

                    {/* Detailed stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div
                        className="p-4 rounded-xl border border-border"
                        style={{ backgroundColor: `${COLORS.memory}10` }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <MemoryStickIcon className="w-5 h-5" style={{ color: COLORS.memory }} />
                          <span className="font-semibold">RAM</span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Átlag:</span>
                            <span className="font-bold">{statsData.avgMemory} MB</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Tartomány:</span>
                            <span className="font-medium">
                              {statsData.minMemory} - {statsData.maxMemory} MB
                            </span>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-border">
                            <span className="text-muted-foreground">Különbség:</span>
                            <span className="font-bold text-lg" style={{ color: COLORS.memory }}>
                              {statsData.memoryDiff} MB
                            </span>
                          </div>
                        </div>
                      </div>

                      <div
                        className="p-4 rounded-xl border border-border"
                        style={{ backgroundColor: `${COLORS.cpu}10` }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <Cpu className="w-5 h-5" style={{ color: COLORS.cpu }} />
                          <span className="font-semibold">CPU (idle)</span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Átlag:</span>
                            <span className="font-bold">{statsData.avgCpu}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Tartomány:</span>
                            <span className="font-medium">
                              {statsData.minCpu} - {statsData.maxCpu}%
                            </span>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-border">
                            <span className="text-muted-foreground">Különbség:</span>
                            <span className="font-bold text-lg" style={{ color: COLORS.cpu }}>
                              {statsData.cpuDiff}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div
                        className="p-4 rounded-xl border border-border"
                        style={{ backgroundColor: `${COLORS.disk}10` }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <HardDrive className="w-5 h-5" style={{ color: COLORS.disk }} />
                          <span className="font-semibold">Tárhely</span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Átlag:</span>
                            <span className="font-bold">{statsData.avgDisk} MB</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Tartomány:</span>
                            <span className="font-medium">
                              {statsData.minDisk} - {statsData.maxDisk} MB
                            </span>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-border">
                            <span className="text-muted-foreground">Különbség:</span>
                            <span className="font-bold text-lg" style={{ color: COLORS.disk }}>
                              {statsData.diskDiff} MB
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="h-[200px] flex items-center justify-center border border-dashed border-border rounded-xl">
                <div className="text-center text-muted-foreground">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>
                    Válassz ki legalább egy {selectedCategory === "desktop-environment" ? "DE" : "WM"}-t az
                    összehasonlításhoz
                  </p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="radar" className="space-y-4 mt-4">
            {/* Item Selection */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-muted-foreground">Kiválasztva ({selectedItems.length}/4):</span>
              {selectedItems.map((id) => {
                const env = environments.find((e) => e.id === id)
                return (
                  <Button
                    key={id}
                    variant="secondary"
                    size="sm"
                    onClick={() => handleRemoveItem(id)}
                    className="gap-1 rounded-lg"
                  >
                    {env?.name}
                    <X className="w-3 h-3" />
                  </Button>
                )
              })}
              {selectedItems.length < 4 && (
                <Select onValueChange={handleAddItem}>
                  <SelectTrigger className="w-[180px] bg-transparent rounded-lg">
                    <div className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      <span>Hozzáadás</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {availableItems
                      .filter((env) => !selectedItems.includes(env.id))
                      .map((env) => (
                        <SelectItem key={env.id} value={env.id}>
                          {env.name} ({env.memoryUsageMB} MB)
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {comparisonData.length >= 2 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Radar Chart */}
                <div className="h-[400px] w-full rounded-xl bg-muted/20 p-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2 text-center">Radar összehasonlítás</h4>
                  <ResponsiveContainer width="100%" height="90%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis
                        dataKey="metric"
                        tick={{ fill: "hsl(var(--foreground))", fontSize: 13, fontWeight: 500 }}
                      />
                      <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                      />
                      {comparisonData.map((item, index) => (
                        <Radar
                          key={item.id}
                          name={item.name}
                          dataKey={item.name}
                          stroke={getBarColor(index)}
                          fill={getBarColor(index)}
                          fillOpacity={0.25}
                          strokeWidth={2}
                        />
                      ))}
                      <Legend wrapperStyle={{ paddingTop: "10px" }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div className="h-[400px] w-full rounded-xl bg-muted/20 p-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2 text-center">
                    {metricInfo.label} eloszlás
                  </h4>
                  <ResponsiveContainer width="100%" height="90%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value} ${metricInfo.unit}`}
                        labelLine={{ stroke: "hsl(var(--muted-foreground))" }}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "12px",
                        }}
                        formatter={(value: number) => [`${value} ${metricInfo.unit}`, metricInfo.label]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center border border-dashed border-border rounded-xl">
                <div className="text-center text-muted-foreground">
                  <PieChartIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>
                    Válassz ki legalább kettő {selectedCategory === "desktop-environment" ? "DE" : "WM"}-t a radar
                    diagramhoz
                  </p>
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
              A radar diagram az értékeket relatív skálán (0-100%) mutatja.{" "}
              <strong>Alacsonyabb érték = kevesebb erőforrás-igény = jobb hatékonyság.</strong>
            </p>
          </TabsContent>

          <TabsContent value="all" className="mt-4 space-y-4">
            <div className="h-[500px] w-full rounded-xl bg-muted/20 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={allCategoryData}
                  layout="vertical"
                  margin={{ top: 10, right: 80, left: 100, bottom: 10 }}
                >
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={metricInfo.color} stopOpacity={0.8} />
                      <stop offset="100%" stopColor={metricInfo.color} stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={true} vertical={false} />
                  <XAxis
                    type="number"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={13}
                    fontWeight={500}
                    tickLine={false}
                    axisLine={false}
                    width={95}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }} />
                  <Bar dataKey={metricInfo.dataKey} fill="url(#barGradient)" radius={[0, 8, 8, 0]} maxBarSize={35}>
                    <LabelList
                      dataKey={metricInfo.dataKey}
                      position="right"
                      fill="hsl(var(--foreground))"
                      fontSize={12}
                      fontWeight={600}
                      formatter={(value: number) => `${value} ${metricInfo.unit}`}
                    />
                  </Bar>
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <metricInfo.icon className="w-4 h-4" style={{ color: metricInfo.color }} />
              <span>
                {metricInfo.label} - Összes{" "}
                {selectedCategory === "desktop-environment" ? "Desktop Environment" : "Window Manager"}
              </span>
              <span className="text-xs">(növekvő sorrendben)</span>
            </div>
          </TabsContent>
        </Tabs>

        <p className="text-xs text-muted-foreground text-center">
          * Az adatok hozzávetőlegesek, és függnek a konfigurációtól, a futó alkalmazásoktól és a rendszer állapotától.
        </p>
      </CardContent>
    </Card>
  )
}
