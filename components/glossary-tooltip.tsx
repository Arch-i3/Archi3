"use client"

import { useState, useRef, useEffect, type ReactNode } from "react"
import { HelpCircle } from "lucide-react"

interface GlossaryTooltipProps {
  term: string
  children: ReactNode
  showIcon?: boolean
}

const glossary: Record<string, string> = {
  // Display Servers
  X11: "Az X Window System (X11) a hagyományos Linux grafikus szerverprotokoll. 35+ éves, stabil, de elavult architektúrával. Minden alkalmazás közvetlenül rajzolhat a képernyőre.",
  Wayland:
    "Modern grafikus protokoll, az X11 utódja. Jobb biztonság (alkalmazások nem látják egymás ablakait), alacsonyabb késleltetés, jobb HiDPI és multi-monitor támogatás.",
  "Display Server":
    "A grafikus szerver felelős a képernyő kirajzolásáért, az ablakok kezeléséért és a bemeneti eszközök (egér, billentyűzet) kezeléséért.",

  // Window Management Types
  Stacking:
    "Hagyományos ablakkezelés, ahol az ablakok egymásra pakolhatók (mint Windows/macOS). Szabadon átméretezhető és mozgatható ablakok.",
  Tiling:
    "Csempézett ablakkezelés: az ablakok automatikusan kitöltik a képernyőt átfedés nélkül. Hatékony képernyő-kihasználás, billentyűzet-központú.",
  Dynamic:
    "Dinamikus ablakkezelés: váltható a tiling és stacking módok között. Több előre definiált elrendezés közül választhatsz.",
  Manual:
    "Kézi csempézés: te határozod meg az ablakok pontos elhelyezkedését a képernyőn, a rendszer nem oszt ki automatikusan helyet.",

  // Categories
  "Desktop Environment":
    "Teljes asztali környezet: ablakkezelő + fájlkezelő + panel + beállítások + alkalmazások egyben. Komplett, összehangolt felhasználói élmény.",
  DE: "Desktop Environment rövidítése - teljes asztali környezet alkalmazásokkal és integrált komponensekkel.",
  "Window Manager":
    "Csak az ablakok kezeléséért felelős program. Minimális, gyors, de külön kell telepíteni a kiegészítő programokat (panel, fájlkezelő, stb.).",
  WM: "Window Manager rövidítése - önálló ablakkezelő program.",

  // Resource Usage
  Könnyű: "Alacsony erőforrás-igény: ~15-100 MB RAM, régi hardveren is fut gördülékenyen. Ideális gyenge gépekhez.",
  Közepes: "Közepes erőforrás-igény: ~200-600 MB RAM. A legtöbb modern gépen jól fut.",
  Nehéz: "Magas erőforrás-igény: 600+ MB RAM. Modern hardvert igényel a gördülékeny működéshez.",

  // Customization
  Testreszabhatóság:
    "Mennyire változtatható meg a megjelenés és viselkedés. Alacsony = fix design, Magas = minden módosítható.",

  // Technical Features
  IPC: "Inter-Process Communication - folyamatok közötti kommunikáció. Lehetővé teszi külső szkriptek/programok számára az ablakkezelő vezérlését.",
  EWMH: "Extended Window Manager Hints - szabvány, ami biztosítja, hogy az alkalmazások és az ablakkezelő megfelelően kommunikáljanak.",
  Compositor: "A compositor felelős az ablakok összerakásáért és effektekért (árnyékok, átlátszóság, animációk).",
  wlroots:
    "Wayland compositor könyvtár, amit sok WM használ alapként (Sway, Hyprland). Közös kódbázis az alapfunkciókhoz.",
  HDR: "High Dynamic Range - szélesebb színtartomány és fényerő-tartomány támogatása a kijelzőkön.",
  HiDPI: "Magas pixelsűrűségű kijelzők támogatása (4K, Retina). Megfelelő méretezés éles megjelenítéshez.",
  "Multi-monitor": "Több monitor egyidejű támogatása különböző felbontásokkal és elrendezésekkel.",
  GTK: "GIMP Toolkit - grafikus felület könyvtár, amit a GNOME és sok Linux alkalmazás használ.",
  Qt: "Cross-platform grafikus könyvtár, amit a KDE és sok alkalmazás használ. Modern, C++ alapú.",
  Lua: "Könnyű, beágyazható szkriptnyelv. Néhány WM (Awesome) ezt használja konfigurációhoz.",
  Panel: "Az asztal széléhez rögzített sáv, ami tartalmazza az alkalmazásindítót, tálcát, órát, stb.",
  Workspaces: "Virtuális asztalok - több munkaterület, amik között váltogathatunk a zsúfoltság elkerülésére.",
  "Virtual Desktops": "Virtuális asztalok - több munkaterület, amik között váltogathatunk a zsúfoltság elkerülésére.",
  Activities: "GNOME/KDE funkció: munkaterületek és alkalmazások áttekintő nézete, gyors váltás és keresés.",
  Extensions: "Bővítmények, amikkel új funkciókkal egészítheted ki az asztali környezetet.",
  Plugins: "Bővítmények/modulok, amik új funkcionalitást adnak a rendszerhez.",
  Scratchpad: "Rejtett munkaterület, ahova ideiglenesen elrejthetsz ablakokat, majd gyorsan előhívhatod őket.",
  Tags: "Címkék a munkaterületek helyett - egy ablak több címkéhez is tartozhat egyszerre (dwm, bspwm).",
  "Arch Linux": "Minimalista, rolling-release Linux disztribúció. A felhasználó maga építi fel a rendszert.",
  Memóriahasználat: "RAM (memória) fogyasztás megabájtban. Alacsonyabb = kevesebb erőforrás-igény.",
}

export function GlossaryTooltip({ term, children, showIcon = true }: GlossaryTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState<"top" | "bottom">("bottom")
  const triggerRef = useRef<HTMLButtonElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const explanation = glossary[term]

  useEffect(() => {
    if (!explanation) return // Skip if no explanation
    if (triggerRef.current && isOpen) {
      const rect = triggerRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const spaceAbove = rect.top

      // If less than 200px below, show above
      if (spaceBelow < 200 && spaceAbove > spaceBelow) {
        setPosition("top")
      } else {
        setPosition("bottom")
      }
    }
  }, [isOpen, explanation])

  // Close on outside click
  useEffect(() => {
    if (!explanation || !isOpen) return // Skip if no explanation or not open

    const handleClickOutside = (e: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [isOpen, explanation])

  // If no explanation exists, just render children (after hooks)
  if (!explanation) {
    return <>{children}</>
  }

  return (
    <span className="relative inline-flex items-center gap-1">
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="inline-flex items-center gap-1 text-inherit underline decoration-dotted decoration-primary/50 underline-offset-2 hover:decoration-primary cursor-help transition-colors"
        aria-expanded={isOpen}
        aria-describedby={isOpen ? `tooltip-${term}` : undefined}
      >
        {children}
        {showIcon && <HelpCircle className="w-3.5 h-3.5 text-primary/60" />}
      </button>

      {isOpen && (
        <div
          ref={tooltipRef}
          id={`tooltip-${term}`}
          role="tooltip"
          className={`absolute z-50 w-72 p-3 rounded-lg border border-border bg-popover text-popover-foreground shadow-xl text-sm leading-relaxed
            ${position === "top" ? "bottom-full mb-2" : "top-full mt-2"}
            left-1/2 -translate-x-1/2
            animate-in fade-in-0 zoom-in-95 duration-200
          `}
        >
          <div className="font-semibold text-primary mb-1">{term}</div>
          <div className="text-muted-foreground">{explanation}</div>
          {/* Arrow */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-popover border-border rotate-45
              ${position === "top" ? "bottom-0 translate-y-1/2 border-r border-b" : "top-0 -translate-y-1/2 border-l border-t"}
            `}
          />
        </div>
      )}
    </span>
  )
}

// Helper component for wrapping terms automatically
export function Term({ children }: { children: string }) {
  return <GlossaryTooltip term={children}>{children}</GlossaryTooltip>
}
