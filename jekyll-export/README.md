# Pure de Arch - DE & WM Kereso

GitHub Pages kompatibilis statikus weboldal Desktop Environmentek es Window Managerek osszehasonlitasahoz.

## Telepites

### 1. Repository klonozasa

```bash
git clone https://github.com/Pure-de-Arch/pure-de-arch.github.io.git
cd pure-de-arch.github.io
```

### 2. Kepek masolasa

Masold at a kepeket a `public/` mappabol az `assets/images/` mappaba es nevezd at oket:

```
assets/images/
├── gnome-logo.jpg
├── gnome-screenshot.jpg
├── kde-plasma-logo.jpg
├── kde-plasma-screenshot.jpg
├── xfce-logo.jpg
├── xfce-screenshot.jpg
... stb.
```

### 3. Lokalis fejlesztes

```bash
# Ruby es Bundler szukseges
bundle install
bundle exec jekyll serve
```

A weboldal elerheto: http://localhost:4000

### 4. GitHub Pages deploy

1. Push-old a kodot a GitHub repository-ba
2. Menj a Settings > Pages menupontba
3. Source: "Deploy from a branch"
4. Branch: "main" (vagy "master") es "/ (root)"
5. Save

A weboldal par percen belul elerheto lesz: https://[username].github.io/[repo-name]/

## Struktura

```
jekyll-export/
├── _config.yml          # Jekyll konfiguracio
├── _data/
│   └── environments.yml # DE/WM adatok
├── _layouts/
│   └── default.html     # Alap sablon
├── assets/
│   ├── css/
│   │   └── style.css    # Stilusok
│   ├── images/          # Kepek (masolando)
│   └── js/
│       └── main.js      # JavaScript
├── index.html           # Fooldal
├── Gemfile              # Ruby fuggosegek
└── README.md            # Ez a fajl
```

## Funkciok

- Szures tipus, display server, ablakkezeles, eroforras-igeny es testreszabhatosag alapjan
- Kereses nev, leiras es funkciok alapjan
- Memoria, CPU es tarhely osszehasonlitas
- USB telepito utmutato (BalenaEtcher)
- WM alkalmazasok telepitesi utmutatoja
- Reszponziv dizajn (mobil es desktop)
- Sotet tema

## Licenc

MIT License
