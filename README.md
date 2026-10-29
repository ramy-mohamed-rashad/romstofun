# RomsToFun Hub 🎮

A high-performance, responsive retro gaming and emulation portal featuring classic console showcases, genre collections, ROM guides, and technical emulation retrospectives.

---

## ✨ Features

- **Dynamic Landing Page (`index.html`)**:
  - Hero banner with quick action links.
  - Multi-facet search and filter card (Emulator, Genre, Collection, Sort).
  - Popular Emulators section (featuring **PS2**, **PSP**, **PS3**, and **PSX**) with reactive visibility (automatically hides when filters are active to focus on results).
  - Featured Game Guides showcase.

- **Active Emulators Directory (`emulators.html`)**:
  - Comprehensive listing of supported consoles (PS2, PSP, PS3, PSX, GBA, NES, 3DS, N64, NDS, SNES, Wii, SG).
  - Clean vector SVG logos for each console platform.
  - Direct links to console-filtered game directories.

- **Curated Collections (`collections.html`)**:
  - 10 curated genre collections (Action & Adventure, RPG & JRPG, Fighting, Platformer, Racing & Speed, Survival Horror, Sports & Wrestling, Strategy & Tactics, Shooters, Classic Arcade).
  - Quick-navigation cards linking directly to genre-filtered game views.

- **Games Directory (`games.html`)**:
  - Smooth SPA-style transitions between emulators and genres with no page reloads.
  - URL query parameter synchronization (`?emulator=...`, `?genre=...`).
  - Real-time client-side search across titles and genres.
  - Client-side pagination with "Load More Games" button.
  - Safe "Get Application" action buttons directing to mobile emulator tools (no direct ROM downloads).

- **Blog & Technical Game Reports (`blog.html` & `blog-detail.html`)**:
  - Directory of retrospectives and technical emulation guides for classic games.
  - Dynamic game report reader (`blog-detail.html?id=<game_id>`) providing background history, technical specs, optimal emulation settings, and controller mappings.
  - Live search and console filter tabs.

- **Clean Architecture & High Performance**:
  - **Modular JavaScript**: Clean architecture separation across `core/`, `components/`, and `pages/`.
  - **Image Compression & Optimization**: Over 70% asset size reduction, resized web covers, responsive retina support, and native lazy loading (`loading="lazy"`, `decoding="async"`).
  - **Optimized Catalog**: 20 games prioritized for popular PlayStation platforms (PS2, PSP, PS3, PSX) and top 10 ranked titles for all other systems.
  - **Cohesive Primary Pink Styling**: Consistent header, simplified clean footer, and accessible responsive mobile menu drawer.

---

## 📁 Project Structure

```text
romstofun-hub/
├── assets/
│   ├── data/
│   │   ├── emulators.json         # Active console platforms (PS2, PSP, PS3, PSX prioritized)
│   │   ├── games.json             # 159 curated retro titles with ratings, loves, views, genres
│   │   └── games_data.js          # Synchronous data bundle for client-side routing & search
│   └── images/
│       ├── background.jpg         # Optimized hero background image
│       ├── emulators/             # Vector SVG console logos
│       └── games/                 # Compressed game cover artwork
├── css/
│   ├── 01-variables.css           # Color palette, spacing, transitions, shadows
│   ├── 02-reset.css               # Box sizing and baseline resets
│   ├── 03-typography.css          # Typography scales and font families
│   ├── 04-layout.css              # Grid systems, containers, flex wrappers
│   └── 05-components.css          # Headers, footers, cards, search bars, blog styling
├── js/
│   ├── core/
│   │   ├── config.js              # Application constants and configuration
│   │   ├── utils.js               # Escaping, formatting, debounce helpers
│   │   └── dataService.js         # Unified data access and query layer
│   ├── components/
│   │   ├── navigation.js          # Header navbar & mobile drawer controller
│   │   ├── gameCard.js            # Game card component renderer & factory
│   │   └── blogCard.js            # Blog card component renderer & factory
│   ├── pages/
│   │   ├── homePage.js            # Landing page controller & reactive filters
│   │   ├── gamesPage.js           # Games directory SPA transitions & pagination
│   │   ├── blogPage.js            # Blog listing & console filter controller
│   │   └── blogDetail.js          # Dynamic game report generator & related titles
│   └── main.js                    # App bootstrap coordinating page lifecycle
├── blog-detail.html               # Dynamic in-depth game retrospective & guide reader
├── blog.html                      # Blog directory page
├── collections.html               # Curated genre collections page
├── emulators.html                 # All active emulators directory
├── games.html                     # Games catalogue with instant switching & filtering
├── index.html                     # Landing page
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

Run the static web app with any local HTTP server (for example Python):

```bash
python -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## 📄 License
MIT License.
