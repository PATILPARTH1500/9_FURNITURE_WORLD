# ATELIER ARCHETYP — SYSTEM ARCHITECTURE & 3D PIPELINE

## 1. Architectural Philosophy

Atelier Archetyp is engineered as an editorial 3D product monograph. Unlike conventional e-commerce templates that layer standard CSS transforms or spin isolated meshes, this platform implements a unified scroll-linked cinematic experience where scroll progress drives:
- Camera vector trajectories (position, target, and focal angle)
- 3D model component deconstruction (real separated mesh geometry)
- Physically based material property transitions (roughness, metalness, albedo)
- Architectural lighting, soft contact shadows, and interior environment reveals

## 2. Directory Structure

```
.
├── docs/
│   └── architecture/
│       └── SYSTEM_ARCHITECTURE.md
├── public/
│   └── models/
│       └── README.md
├── src/
│   ├── app/
│   │   ├── cart/
│   │   │   └── page.tsx              # Full cart & architectural checkout breakdown
│   │   ├── collections/
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx          # Collection detail & series dossier
│   │   │   └── page.tsx              # All collections & category filters
│   │   ├── products/
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # Product detail with interactive 3D studio viewer
│   │   ├── globals.css               # Film grain, typography variables, custom scrollbars
│   │   ├── layout.tsx                # Root layout with editorial font variables & chrome
│   │   └── page.tsx                  # Landing page & scroll-driven 3D story
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── ArchitecturalEnvironment.tsx # Studio & gallery lighting, travertine plinth
│   │   │   ├── CameraController.tsx         # GSAP & mouse parallax camera choreography
│   │   │   ├── FurnitureModel.tsx           # Separated meshes, exploded transforms, 3D annotations
│   │   │   ├── ProductStudioViewer.tsx      # OrbitControls studio viewer for PDP
│   │   │   └── SceneCanvas.tsx              # Persistent R3F WebGL Canvas with fallback
│   │   ├── cart/
│   │   │   └── CartDrawer.tsx        # Slide-over cart with free delivery indicator
│   │   ├── landing/
│   │   │   ├── CuratedCollectionSection.tsx # Editorial grid & craft statement
│   │   │   └── ScrollStoryOverlay.tsx       # GSAP ScrollTrigger timeline controller
│   │   └── layout/
│   │       ├── Footer.tsx            # Atelier addresses in Copenhagen & Tokyo
│   │       └── Navbar.tsx            # Minimal editorial navigation header
│   ├── config/
│   │   └── brand.ts                  # Centralized brand tokens, contacts, links
│   ├── data/
│   │   └── catalog.ts                # Products, materials, variants, and dimensions
│   ├── lib/
│   │   └── supabase/
│   │       ├── client.ts             # Browser Supabase client with graceful fallback
│   │       ├── server.ts             # Server component Supabase client
│   │       └── service-role.ts       # Server-only admin client with leak prevention
│   ├── store/
│   │   ├── useCartStore.ts           # Persistent Zustand cart store
│   │   └── useSceneStore.ts          # 3D scene & scroll coordination store
│   └── types/
│       └── index.ts                  # Domain models, 3D states, and materials
└── supabase/
    └── migrations/
        └── 20240101000000_initial_schema.sql # PostgreSQL schema, constraints, RLS policies
```

## 3. The 5-Scene Scroll Engine

| Scene | Narrative | Camera Coordinates | 3D Transformations |
|---|---|---|---|
| **01 // Hero** | Cinematic Introduction | `[2.4, 1.25, 3.4]` $\to$ `[1.9, 1.0, 2.7]` | Subtle breathing rotation, assembled product on plinth |
| **02 // Engineering** | Deconstructed Anatomy | `[1.9, 1.3, 2.3]` | Cushion floats up/forward, backrest tilts, armrests move laterally, legs descend, brass pins push out with 5 interactive 3D annotations |
| **03 // Materiality** | PBR Surface Response | `[1.4, 0.8, 1.6]` (Macro close-up) | Live roughness & albedo transitions between Oak, Walnut, Ash and Bouclé, Leather, Linen |
| **04 // In Situ** | Architectural Equilibrium | `[3.6, 2.0, 4.4]` (Wide pull-back) | Travertine plinth, room wall, and diagonal sunbeam cast shadows |
| **05 // Curation** | Permanent Repertoire | Stable transition to editorial plane | Curated series cards, product discovery, and cart actions |

## 4. Supabase Architecture & Security

- **Row Level Security (RLS)** is enabled on all tables (`products`, `variants`, `inventory`, `carts`, `cart_items`, `orders`, `profiles`).
- Public catalog tables allow anonymous `SELECT`.
- Carts and customer orders are strictly partitioned by `auth.uid()`.
- Inventory adjustments and order settlements are strictly guarded on the server via `service-role.ts` with explicit runtime checks prohibiting client-side execution.

