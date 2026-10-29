# RomsToFun Hub 🎮

[![GitHub Repository](https://img.shields.io/badge/GitHub-romstofun-181717?logo=github)](https://github.com/ramy-mohamed-rashad/romstofun)
[![License: MIT](https://img.shields.io/badge/License-MIT-pink.svg)](https://opensource.org/licenses/MIT)

A high-performance, mobile-responsive retro gaming and emulation portal featuring classic console showcases, genre collections, ROM guides, and technical emulation retrospectives.

**Repository URL:** [https://github.com/ramy-mohamed-rashad/romstofun.git](https://github.com/ramy-mohamed-rashad/romstofun.git)

---

## ✨ Features & User Experience

- **Dynamic Landing Page (`index.html`)**:
  - **Hero Banner**: Engaging welcome banner with direct action shortcuts.
  - **Multi-Facet Search & Filter Hub**: Filter games by console emulator, collection/genre (Action, Adventure, Fighting, Sports, Racing, Platformers, RPG, Shooters, Horror, Classic Hits), and sort criteria.
  - **Popular Emulators Showcase**: 4-column balanced grid featuring **PS2**, **PSP**, **PS3**, and **PSX** engineered to seamlessly stretch and fill 100% of the container width across desktop and mobile screens.
  - **Reactive Section Toggling**: The Popular Emulators showcase automatically hides when active search/genre filters are applied, focusing visual attention on matching game results.
  - **Featured Game Guides Showcase**: Instant preview of top community-rated retro games.

- **Active Emulators Directory (`emulators.html`)**:
  - Comprehensive catalog of supported consoles (PS2, PSP, PS3, PSX, GBA, NES, 3DS, N64, NDS, SNES, Wii, SG).
  - High-clarity vector SVG logos for each console platform.
  - Direct links to console-filtered game directories.

- **Curated Collections (`collections.html`)**:
  - 10 curated genre collections (Action & Adventure, RPG & JRPG, Fighting, Platformer, Racing & Speed, Survival Horror, Sports & Wrestling, Strategy & Tactics, Shooters, Classic Arcade).
  - Quick-navigation cards linking directly to genre-filtered game views.

- **Games Directory (`games.html`)**:
  - **Seamless SPA Switching**: Instant console and genre transitions with smooth CSS fade/slide animations (zero full-page reloads).
  - **State & URL Synchronization**: Real-time query parameter syncing (`?emulator=...`, `?genre=...`) with browser History API support.
  - **Real-Time Search & Pagination**: Client-side debounced search and progressive "Load More Games" pagination.
  - **Safe Application Integration**: "Get on Google Play" companion app buttons (no direct ROM downloads).

- **Blog & Technical Game Reports (`blog.html` & `blog-detail.html`)**:
  - Technical retrospective guides and performance reports for classic titles.
  - Dynamic game report reader (`blog-detail.html?id=<game_id>`) providing background history, technical specs, optimal emulation settings, and controller mappings.
  - Live search and console filter tabs.

- **Clean Architecture & High Performance**:
  - **Modular JavaScript**: Strict clean architecture separating `core/` (config, utils, dataService), `components/` (navigation, gameCard, blogCard), and `pages/` (homePage, gamesPage, blogPage, blogDetail).
  - **Image Compression & Optimization**: Over 70% asset size reduction, resized web covers, responsive retina support, and native lazy loading (`loading="lazy"`, `decoding="async"`).
  - **Optimized Catalog**: 20 games prioritized for popular PlayStation platforms (PS2, PSP, PS3, PSX) and top 10 ranked titles for all other systems.
  - **Cohesive Primary Pink Styling**: Primary pink navigation header, simplified clean footer, and accessible responsive mobile menu drawer.

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

## 🚀 Quick Start & Deployment

### 1. Run Local Development Server
Serve static files locally via Python's built-in HTTP server:

```bash
python -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

### 2. Connect with Remote Repository
To push local changes to the remote GitHub repository:

```bash
git remote add origin https://github.com/ramy-mohamed-rashad/romstofun.git
git branch -M main
git push -u origin main
```

---

## 📄 License
MIT License © 2026 RomsToFun Hub.
