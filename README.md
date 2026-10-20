# FURNITURE VILLAGE — React + Vite Architecture

A luxury retro-modern furniture brand website featuring an immersive 7-scene cinematic residence tour with scroll-driven video seeking, interactive product discovery, curated collections, dynamic cart, and high-performance client rendering powered by Vite and React 18.

## Technology Stack

- **Framework**: React 18
- **Bundler & Dev Server**: Vite 8
- **Routing**: React Router v6 (`react-router-dom`)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS Variables
- **Animations**: GSAP + ScrollTrigger, Framer Motion
- **State Management**: Zustand
- **Icons**: Lucide React
- **3D / Canvas**: Three.js, React Three Fiber, Canvas Confetti

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Starts the Vite local dev server with lightning-fast Hot Module Replacement (HMR) at `http://localhost:3000`.

### 3. Production Build
```bash
npm run build
```
Typechecks with `tsc` and generates the optimized production bundle in `dist/`.

### 4. Preview Production Build
```bash
npm run preview
```
Previews the local production build on `http://localhost:4173`.

---

## Environment Variables

Create a `.env` file in the root directory if configuring custom CDN video delivery or Supabase:

```env
# Optional Video CDN Delivery URL (e.g. Cloudflare R2, Vercel Blob, Supabase Storage)
# If omitted or empty, videos load locally from /public/videos/scenes/
VITE_VIDEO_CDN_URL=

# Optional Supabase Configuration
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

---

## Application Structure

```text
├── index.html                   # HTML entry point with Google Fonts preconnected
├── vite.config.ts               # Vite configuration and path aliases
├── tsconfig.json                # TypeScript config targeting ES2020 + React-JSX
├── public/                      # Static assets (videos, scene posters, editorial photography)
│   ├── videos/scenes/           # 7 cinematic tour video files (1080p WebM/MP4)
│   └── images/film/             # High-resolution architectural photography
├── src/
│   ├── main.tsx                 # Client application entry point (BrowserRouter)
│   ├── App.tsx                  # Root layout, routes, navbar, cart drawer, footer
│   ├── pages/                   # Route wrapper components
│   │   ├── CollectionDetailPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── components/
│   │   ├── cinema/              # CinematicResidenceTour (7-scene GSAP tour)
│   │   ├── layout/              # Navbar, Footer
│   │   ├── landing/             # Curated collections, craft, reviews, discovery
│   │   ├── cart/                # CartDrawer
│   │   ├── discovery/           # ProductQuickDrawer
│   │   ├── ui/motion/           # MagneticButton, AnimatedHeading, SpotlightCard, etc.
│   │   └── common/              # Framework-agnostic Image, Link, dynamic, navigation
│   ├── config/                  # Brand configuration, cinematic tour scene config
│   ├── data/                    # Product catalog, materials, dimensions
│   ├── store/                   # Zustand stores (useCartStore, useSceneStore)
│   └── styles/ & app/globals.css # Tailwind & design system theme tokens
```

---

## Key Features & Highlights

1. **Seven-Scene Cinematic Video Tour**:
   - Scroll-driven frame seeking with GSAP ScrollTrigger.
   - Pinned viewport with smooth scene-to-scene transitions across all 7 living spaces.
   - Preserved video sources, scene order, and editorial progress cues.
2. **Instant Visual Feedback**:
   - Client-rendered React 18 architecture eliminates Next.js SSR hydration mismatches, server/client boundary hurdles, and stale chunk caching.
   - Hot Module Replacement updates changes instantaneously.
3. **Responsive Client Routing**:
   - Direct navigation and deep link refreshing for `/`, `/collections`, `/collections/:slug`, `/products/:slug`, and `/cart`.
