"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Usb,
  Download,
  HardDrive,
  CheckCircle2,
  Terminal,
  Copy,
  Check,
  ExternalLink,
  Monitor,
  FolderOpen,
  Play,
  Globe,
  ChevronRight,
} from "lucide-react"

const usbSteps = [
  {
    step: 1,
    title: "BalenaEtcher letöltése",
    description: "Töltsd le a BalenaEtcher alkalmazást a hivatalos oldalról.",
    icon: Download,
    action: {
      label: "BalenaEtcher letöltése",
      url: "https://etcher.balena.io/",
    },
  },
  {
    step: 2,
    title: "ISO fájl kiválasztása",
    description: "Kattints a 'Flash from file' gombra és válaszd ki a Pure de Arch ISO fájlt.",
    icon: FolderOpen,
    highlight: "Flash from file",
  },
  {
    step: 3,
    title: "USB eszköz kiválasztása",
    description: "Kattints a 'Select target' gombra és válaszd ki az USB meghajtót. Figyelem: minden adat törlődik róla!",
    icon: Usb,
    highlight: "Select target",
    warning: true,
  },
  {
    step: 4,
    title: "Írás indítása",
    description: "Kattints a 'Flash!' gombra és várd meg, amíg a folyamat befejeződik.",
    icon: Play,
    highlight: "Flash!",
  },
  {
    step: 5,
    title: "Kész!",
    description: "Az USB telepítő elkészült. Indítsd újra a számítógépet és bootolj az USB-ről.",
    icon: CheckCircle2,
  },
]

const wmApps = [
  {
    name: "alacritty",
    description: "GPU-gyorsított terminál emulátor",
    icon: Terminal,
    command: "sudo pacman -S alacritty",
    configPath: "~/.config/alacritty/alacritty.toml",
  },
  {
    name: "thunar",
    description: "Könnyű, gyors fájlkezelő (Xfce)",
    icon: FolderOpen,
    command: "sudo pacman -S thunar thunar-volman gvfs",
    configPath: "~/.config/Thunar/",
  },
  {
    name: "mpv",
    description: "Minimalista, hatékony médialejátszó",
    icon: Play,
    command: "sudo pacman -S mpv",
    configPath: "~/.config/mpv/mpv.conf",
  },
  {
    name: "firefox",
    description: "Nyílt forráskódú webböngésző",
    icon: Globe,
    command: "sudo pacman -S firefox firefox-i18n-hu",
    configPath: "~/.mozilla/firefox/",
  },
]

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleCopy}
      className="h-8 w-8 text-muted-foreground hover:text-foreground"
    >
      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
    </Button>
  )
}

export function InstallationGuide() {
  return (
    <div className="space-y-8">
      <Tabs defaultValue="usb" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="usb" className="gap-2">
            <Usb className="w-4 h-4" />
            USB telepítő
          </TabsTrigger>
          <TabsTrigger value="apps" className="gap-2">
            <Terminal className="w-4 h-4" />
            WM alkalmazások
          </TabsTrigger>
        </TabsList>

        <TabsContent value="usb">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-foreground">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <HardDrive className="w-5 h-5 text-primary" />
                </div>
                USB telepítő létrehozása BalenaEtcher-rel
              </CardTitle>
              <CardDescription>
                Kövesd az alábbi lépéseket a bootolható USB meghajtó elkészítéséhez.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {usbSteps.map((step, index) => (
                  <div key={step.step} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          step.step === 5
                            ? "bg-green-500/20 text-green-400"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        <step.icon className="w-5 h-5" />
                      </div>
                      {index < usbSteps.length - 1 && (
                        <div className="w-0.5 h-full bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {step.step}. lépés
                        </Badge>
                        {step.warning && (
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                            Figyelem
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-semibold text-foreground mb-1">{step.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                      {step.highlight && (
                        <code className="inline-flex items-center gap-1 px-2 py-1 rounded bg-muted text-sm text-primary font-mono">
                          <ChevronRight className="w-3 h-3" />
                          {step.highlight}
                        </code>
                      )}
                      {step.action && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 gap-2 bg-transparent"
                          asChild
                        >
                          <a href={step.action.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                            {step.action.label}
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Visual diagram */}
              <div className="mt-8 p-6 rounded-xl bg-muted/50 border border-border">
                <h4 className="font-semibold text-foreground mb-4 text-center">BalenaEtcher felülete</h4>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background border border-border min-w-[140px]">
                    <FolderOpen className="w-8 h-8 text-primary" />
                    <span className="text-xs text-center font-medium">Flash from file</span>
                    <span className="text-xs text-muted-foreground">ISO kiválasztása</span>
                  </div>
                  <ChevronRight className="w-6 h-6 text-muted-foreground rotate-90 sm:rotate-0" />
                  <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background border border-border min-w-[140px]">
                    <Usb className="w-8 h-8 text-primary" />
                    <span className="text-xs text-center font-medium">Select target</span>
                    <span className="text-xs text-muted-foreground">USB kiválasztása</span>
                  </div>
                  <ChevronRight className="w-6 h-6 text-muted-foreground rotate-90 sm:rotate-0" />
                  <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-primary/20 border border-primary/30 min-w-[140px]">
                    <Play className="w-8 h-8 text-primary" />
                    <span className="text-xs text-center font-medium text-primary">Flash!</span>
                    <span className="text-xs text-muted-foreground">Írás indítása</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="apps">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-foreground">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-primary" />
                </div>
                Alapvető alkalmazások Window Managerekhez
              </CardTitle>
              <CardDescription>
                A Window Managerek önmagukban nem tartalmaznak alkalmazásokat. Az alábbi parancsokkal
                telepítheted a legfontosabb programokat.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {wmApps.map((app) => (
                  <div
                    key={app.name}
                    className="p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <app.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground">{app.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            pacman
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{app.description}</p>
                        <div className="flex items-center gap-2 p-2 rounded bg-background border border-border font-mono text-sm">
                          <code className="flex-1 text-primary overflow-x-auto">{app.command}</code>
                          <CopyButton text={app.command} />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Konfiguráció: <code className="text-foreground">{app.configPath}</code>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* All at once */}
                <div className="mt-6 p-4 rounded-lg border-2 border-primary/30 bg-primary/5">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-primary" />
                    Összes telepítése egyszerre
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Egy paranccsal telepítheted az összes fent említett alkalmazást:
                  </p>
                  <div className="flex items-center gap-2 p-3 rounded bg-background border border-border font-mono text-sm">
                    <code className="flex-1 text-primary overflow-x-auto">
                      sudo pacman -S alacritty thunar thunar-volman gvfs mpv firefox firefox-i18n-hu
                    </code>
                    <CopyButton text="sudo pacman -S alacritty thunar thunar-volman gvfs mpv firefox firefox-i18n-hu" />
                  </div>
                </div>

                {/* Tips */}
                <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
                  <h4 className="font-semibold text-foreground mb-3">Tippek Window Manager használóknak</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Állíts be billentyű-kombinációkat a gyakran használt alkalmazásokhoz</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Használj alkalmazás-indítót mint <code className="text-foreground">rofi</code> vagy <code className="text-foreground">dmenu</code></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span>A <code className="text-foreground">picom</code> kompozitor átlátszóságot és árnyékokat ad az ablakokhoz</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Háttérkép beállításához használd a <code className="text-foreground">feh</code> vagy <code className="text-foreground">nitrogen</code> programot</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
