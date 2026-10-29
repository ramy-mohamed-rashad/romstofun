# RomsToFun Hub 🎮 (Static SEO Branch)

[![GitHub Repository](https://img.shields.io/badge/GitHub-romstofun-181717?logo=github)](https://github.com/ramy-mohamed-rashad/romstofun)
[![Branch: static-pages](https://img.shields.io/badge/Branch-static--pages-e11d48.svg)](https://github.com/ramy-mohamed-rashad/romstofun/tree/static-pages)
[![License: MIT](https://img.shields.io/badge/License-MIT-pink.svg)](https://opensource.org/licenses/MIT)

A 100% static, pre-rendered retro gaming portal and comprehensive emulation guide directory engineered for **maximum SEO performance**, instant crawlability, and lightning-fast static hosting via **Nginx**.

**Repository:** [https://github.com/ramy-mohamed-rashad/romstofun.git](https://github.com/ramy-mohamed-rashad/romstofun.git)  
**Branch:** `static-pages`

---

## 🚀 Architectural Highlights

- **Zero Client-Side Rendering Dependencies**:
  - No `games.json` runtime fetch requests or dynamic client-side templating.
  - Every page, title, meta tag, and game card is pre-rendered directly in pure HTML.
  - Web crawlers (Googlebot, Bingbot, Yandex) and social media scrapers receive fully structured content on initial HTTP GET.

- **Curated 80-Game Benchmark Catalog**:
  - **10 Games per Popular Console**: PlayStation 2 (PS2), PlayStation Portable (PSP), PlayStation 3 (PS3), and PlayStation 1 (PSX) = 40 games.
  - **5 Games per Classic Console**: Game Boy Advance (GBA), Nintendo NES, Nintendo 3DS, Nintendo 64 (N64), Nintendo DS (NDS), Super Nintendo (SNES), Nintendo Wii, and Sega Genesis (SG) = 40 games.
  - Exact 1-to-1 matching cover artwork (79 unused images pruned, saving bandwidth and disk space).

- **80 Standalone Static Blog & Retrospective Guides (`blog/<slug>.html`)**:
  - Each curated title has its own standalone HTML document with human-written analysis, retrospective background, performance recommendations, and mobile emulation setup tips.
  - Rich OpenGraph (`og:title`, `og:image`, `og:description`, `og:url`) and Twitter Card metadata.
  - Valid Schema.org `TechArticle` structured data (`application/ld+json`) on every guide for rich Google Search snippet indexing.
  - Fully mobile-responsive layout with score pills tested for small screens.

- **Search Engine Discovery (`sitemap.xml` & `robots.txt`)**:
  - Valid XML sitemap indexing all 85 site URLs (5 hub pages + 80 individual blog guides).
  - Production `robots.txt` granting crawling access and declaring the sitemap location.

- **Lightweight Progressive Enhancement (`js/main.js`)**:
  - Zero framework overhead.
  - DOM-based instant search and platform filtering for `games.html` and `blog.html`.
  - Accessible mobile hamburger navigation drawer with backdrop handling and Escape-key support.
  - Reactive home page filter toggling (popular console showcase hides cleanly when active search filters are applied).

---

## 📁 Directory Structure

```text
romstofun-hub/
├── assets/
│   └── images/
│       ├── background.jpg         # Hero background image
│       ├── emulators/             # Vector SVG console logos (PS2, PSP, PS3, PSX, GBA, etc.)
│       └── games/                 # Exactly 80 curated cover images (1:1 with games)
├── blog/                          # 80 pre-rendered static retrospective guides
│   ├── gba-pokemon-fire-red-version.html
│   ├── n64-super-mario-64.html
│   ├── ps2-god-of-war-ii.html
│   ├── ps2-grand-theft-auto-san-andreas.html
│   ├── ps3-the-last-of-us.html
│   ├── psp-god-of-war-ghost-of-sparta.html
│   └── ... (80 total static guides)
├── css/
│   ├── 01-variables.css           # Color tokens, typography metrics, spacing
│   ├── 02-reset.css               # Modern CSS reset
│   ├── 03-typography.css          # Fluid typography system
│   ├── 04-layout.css              # Container constraints and responsive layout
│   └── 05-components.css          # Navigation, cards, score boxes, mobile styles
├── js/
│   └── main.js                    # DOM progressive enhancement (Search, pills, drawer)
├── blog.html                      # All 80 guides directory with instant DOM search
├── collections.html               # 10 curated genre collections with updated counts
├── emulators.html                 # 12 active console cards with exact game counters
├── games.html                     # 80 pre-rendered ROM cards with instant live search
├── index.html                     # Pre-rendered landing page with 4-column popular emulators
├── robots.txt                     # Crawler directives & sitemap location
├── sitemap.xml                    # 85 pre-computed URLs for Google Search Console
├── .gitignore
└── README.md
```

---

## 🌐 Nginx Production Deployment Guide

Deploying `romstofun` on an Nginx server is straightforward since all pages are pre-rendered static HTML files.

### 1. Nginx Server Block Configuration (`/etc/nginx/sites-available/romstofun.conf`)

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name romstofun.com www.romstofun.com;

    # Enforce HTTPS redirect
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name romstofun.com www.romstofun.com;

    # SSL Certificate Configuration (Certbot / Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/romstofun.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/romstofun.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Web Root Directory
    root /var/www/romstofun;
    index index.html;

    # Security Headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip Compression for Fast SEO Delivery
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/xml+rss application/atom+xml image/svg+xml;

    # Static Assets Long-Term Caching
    location ~* \.(?:jpg|jpeg|gif|png|webp|svg|ico)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    location ~* \.(?:css|js)$ {
        expires 30d;
        add_header Cache-Control "public, must-revalidate";
    }

    # Clean URL & Fallback Routing
    location / {
        try_files $uri $uri/ $uri.html =404;
    }

    # Sitemap and Robots access
    location = /sitemap.xml {
        access_log off;
        log_not_found off;
    }

    location = /robots.txt {
        access_log off;
        log_not_found off;
    }

    # Custom 404 Error
    error_page 404 /index.html;
}
```

### 2. Deployment Steps

```bash
# 1. Clone the static-pages branch to your web root
git clone -b static-pages https://github.com/ramy-mohamed-rashad/romstofun.git /var/www/romstofun

# 2. Set optimal file permissions
sudo chown -R www-data:www-data /var/www/romstofun
sudo find /var/www/romstofun -type d -exec chmod 755 {} \;
sudo find /var/www/romstofun -type f -exec chmod 644 {} \;

# 3. Test and reload Nginx
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔍 SEO Verification Checklist

| Feature | Status | Details |
|---|---|---|
| **Static HTML Pre-rendering** | ✅ Ready | All 80 games and 80 blog posts exist directly in HTML files |
| **OpenGraph Metadata** | ✅ Ready | `og:title`, `og:image`, `og:description` populated per guide |
| **Schema.org Structured Data**| ✅ Ready | `TechArticle` JSON-LD embedded on all 80 blog posts |
| **Sitemap Coverage** | ✅ Ready | 85 URLs declared in `sitemap.xml` |
| **Robots Directives** | ✅ Ready | Disallows zero content, points crawlers to `sitemap.xml` |
| **Clean Asset Footprint** | ✅ Ready | 80 active game covers, 0 dead or orphaned image files |
| **Mobile Responsiveness** | ✅ Ready | Verified on mobile screens (score cards, dropdown chevrons) |

---

## 📜 Legal & Compliance

romstofun is a preservation indexing resource and community database. No copyrighted game ROM binaries are stored, hosted, or directly transmitted from our servers. Companion links point to verified emulators and applications on the Google Play Store.

Licensed under the [MIT License](LICENSE).
