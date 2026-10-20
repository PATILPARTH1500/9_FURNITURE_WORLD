export interface TourSceneConfig {
  id: string;
  sceneFile: string;
  roomNumber: string;
  roomTitle: string;
  roomSubtitle: string;
  statement: string;
  description: string;
  architecturalDetails: { label: string; value: string }[];
  videoSrc: string;
  posterSrc: string;
  duration: number;
  featuredProductId: string;
  isAvailable?: boolean;
  hotspot?: {
    xPercent: number;
    yPercent: number;
    label: string;
  };
}

/**
 * Optional CDN base URL for production video delivery (e.g. Supabase, Vercel Blob, Cloudflare R2).
 * Falls back to local public directory paths if not configured.
 */
const VIDEO_CDN_BASE = (
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_VIDEO_CDN_URL) ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_VIDEO_CDN_URL) ||
  ''
).replace(/\/+$/, '');
export const resolveVideoUrl = (path: string): string => {
  if (!VIDEO_CDN_BASE) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${VIDEO_CDN_BASE}${cleanPath}`;
};

/**
 * SOURCE OF TRUTH: 7-Scene Production Video Tour for Furniture Village
 * Mapped to the 7 new Google Flow 1080p footage files:
 * 1. Grand_living_room_reveal -> scene-1-living.mp4
 * 2. Camera_tracking_dining_room -> scene-2-dining.mp4
 * 3. Camera_tilting_down_in_kitchen -> scene-3-kitchen.mp4
 * 4. Children_racing_toy_cars -> scene-4-lounge.mp4
 * 5. Camera_pushes_into_bedroom -> scene-5-bedroom.mp4
 * 6. Macro_shots_of_luxury_furniture -> scene-6-craft.mp4
 * 7. Furniture_Village_brand_reveal -> scene-7-outro.mp4
 */
export const CINEMATIC_TOUR_ALL_SCENES: TourSceneConfig[] = [
  {
    id: 'scene-01-living',
    sceneFile: 'scene-1-living.mp4',
    roomNumber: '01',
    roomTitle: 'The Living Room',
    roomSubtitle: 'Curved Cream Bouclé Sofa & Tangerine Accent Table',
    statement: '“A cheerful, light-filled space designed for family relaxation and easy conversation.”',
    description:
      'Sunlight fills the living room, highlighting our curved cream bouclé sofa, sculptural orange coffee table, and comfortable olive green armchairs.',
    architecturalDetails: [
      { label: 'Sofa Fabric', value: 'Plush Cream Bouclé Upholstery' },
      { label: 'Accent Table', value: 'Glossy Tangerine Petal Lacquer' },
      { label: 'Chairs', value: 'Deep Olive Velvet Lounge Chairs' },
    ],
    videoSrc: resolveVideoUrl('/videos/scenes/scene-1-living.mp4'),
    posterSrc: '/videos/scenes/posters/scene-1-living.webp',
    duration: 10.0,
    featuredProductId: 'prod-003',
    isAvailable: true,
    hotspot: {
      xPercent: 48,
      yPercent: 62,
      label: 'Curved Bouclé Sofa',
    },
  },
  {
    id: 'scene-02-dining',
    sceneFile: 'scene-2-dining.mp4',
    roomNumber: '02',
    roomTitle: 'The Dining Room',
    roomSubtitle: 'Round Solid Walnut Table & Velvet Dining Chairs',
    statement: '“Where good meals and long conversations naturally happen around warm natural wood.”',
    description:
      'A welcoming round solid walnut table framed by twin orange dome pendant lights and comfortable velvet chairs in olive green and dusty coral pink.',
    architecturalDetails: [
      { label: 'Dining Table', value: 'Solid European Walnut with Sculpted Base' },
      { label: 'Lighting', value: 'Twin Tangerine Gloss Pendant Domes' },
      { label: 'Seating', value: 'Olive Green & Dusty Coral Velvet Chairs' },
    ],
    videoSrc: resolveVideoUrl('/videos/scenes/scene-2-dining.mp4'),
    posterSrc: '/videos/scenes/posters/scene-2-dining.webp',
    duration: 10.0,
    featuredProductId: 'prod-002',
    isAvailable: true,
    hotspot: {
      xPercent: 52,
      yPercent: 68,
      label: 'Round Walnut Table',
    },
  },
  {
    id: 'scene-03-kitchen',
    sceneFile: 'scene-3-kitchen.mp4',
    roomNumber: '03',
    roomTitle: 'The Kitchen & Breakfast Corner',
    roomSubtitle: 'Terracotta Peach Tiles & Open Walnut Shelves',
    statement: '“A welcoming kitchen where warm colors and open shelves keep daily essentials close at hand.”',
    description:
      'Warm peach square wall tiles and solid walnut floating shelves bring warmth to deep olive shaker cabinets and morning coffee rituals.',
    architecturalDetails: [
      { label: 'Wall Finish', value: 'Glazed Peach & Terracotta Ceramic Tiles' },
      { label: 'Shelving', value: 'Solid Walnut Open Display Ledges' },
      { label: 'Cabinetry', value: 'Olive Green Shaker Millwork with Brass Knobs' },
    ],
    videoSrc: resolveVideoUrl('/videos/scenes/scene-3-kitchen.mp4'),
    posterSrc: '/videos/scenes/posters/scene-3-kitchen.webp',
    duration: 10.0,
    featuredProductId: 'prod-006',
    isAvailable: true,
    hotspot: {
      xPercent: 42,
      yPercent: 36,
      label: 'Walnut Floating Ledges',
    },
  },
  {
    id: 'scene-04-lounge',
    sceneFile: 'scene-4-lounge.mp4',
    roomNumber: '04',
    roomTitle: 'The Family Play Lounge',
    roomSubtitle: 'Checkerboard Floors & Room to Play',
    statement: '“Bright, open space built for real family life, childhood laughter, and everyday play.”',
    description:
      'Children race ride-on sports cars across classic black-and-cream checkerboard floors in this open, sun-drenched family space.',
    architecturalDetails: [
      { label: 'Flooring', value: 'Classic Checkerboard Black & Cream Floor' },
      { label: 'Atmosphere', value: 'Wide Open Sunlit Family Play Space' },
      { label: 'Living', value: 'Comfortable Modular Family Seating' },
    ],
    videoSrc: resolveVideoUrl('/videos/scenes/scene-4-lounge.mp4'),
    posterSrc: '/videos/scenes/posters/scene-4-lounge.webp',
    duration: 10.0,
    featuredProductId: 'prod-001',
    isAvailable: true,
    hotspot: {
      xPercent: 45,
      yPercent: 65,
      label: 'Checkerboard Play Hall',
    },
  },
  {
    id: 'scene-05-bedroom',
    sceneFile: 'scene-5-bedroom.mp4',
    roomNumber: '05',
    roomTitle: 'The Master Bedroom',
    roomSubtitle: 'Olive Velvet Headboard & Washed Peach Bedding',
    statement: '“A peaceful bedroom retreat made with soft velvet, natural stone, and breathable linens.”',
    description:
      'A statement bed with an olive green channel-tufted velvet headboard, washed peach linen duvet, and a fluted travertine stone nightstand.',
    architecturalDetails: [
      { label: 'Headboard', value: 'Channel-Tufted Olive Green Velvet' },
      { label: 'Bedding', value: 'Washed Pure Linen in Dusty Peach & Coral' },
      { label: 'Bedside Table', value: 'Fluted Navona Travertine Pedestal' },
    ],
    videoSrc: resolveVideoUrl('/videos/scenes/scene-5-bedroom.mp4'),
    posterSrc: '/videos/scenes/posters/scene-5-bedroom.webp',
    duration: 10.0,
    featuredProductId: 'prod-004',
    isAvailable: true,
    hotspot: {
      xPercent: 35,
      yPercent: 55,
      label: 'Olive Velvet Bed',
    },
  },
  {
    id: 'scene-06-craft',
    sceneFile: 'scene-6-craft.mp4',
    roomNumber: '06',
    roomTitle: 'Craftsmanship & Textures',
    roomSubtitle: 'Cream Bouclé Weave & Natural Walnut Grain',
    statement: '“Furniture made to be touched: durable textured fabrics and sustainably sourced timber.”',
    description:
      'Close-up craftsmanship: soft looped bouclé yarns, smooth organic walnut grain, and durable finishes designed for years of everyday use.',
    architecturalDetails: [
      { label: 'Fabric Weave', value: 'Heavyweight Virgin Wool & Bouclé Looped Yarns' },
      { label: 'Timber Surface', value: 'Hand-Finished Solid European Walnut' },
      { label: 'Joinery', value: 'Durable Precision Mortise & Tenon Assembly' },
    ],
    videoSrc: resolveVideoUrl('/videos/scenes/scene-6-craft.mp4'),
    posterSrc: '/videos/scenes/posters/scene-6-craft.webp',
    duration: 10.0,
    featuredProductId: 'prod-001',
    isAvailable: true,
    hotspot: {
      xPercent: 50,
      yPercent: 50,
      label: 'Tactile Bouclé Fabric',
    },
  },
  {
    id: 'scene-07-outro',
    sceneFile: 'scene-7-outro.mp4',
    roomNumber: '07',
    roomTitle: 'FURNITURE VILLAGE',
    roomSubtitle: 'Colourful Living, Beautifully Made',
    statement: '“Welcome home to warm colors, comfortable design, and furniture made for living.”',
    description:
      'Step into a world of vibrant retro-modern furniture and home collections created to bring warmth and joy to every room.',
    architecturalDetails: [
      { label: 'Collections', value: 'Living, Dining, Bedroom & Accents' },
      { label: 'Design Language', value: 'Warm Retro-Modern with Playful Color' },
      { label: 'Craftsmanship', value: 'Handcrafted Solid Wood & Lifetime Care' },
    ],
    videoSrc: resolveVideoUrl('/videos/scenes/scene-7-outro.mp4'),
    posterSrc: '/videos/scenes/posters/scene-7-outro.webp',
    duration: 10.0,
    featuredProductId: 'prod-001',
    isAvailable: true,
    hotspot: {
      xPercent: 50,
      yPercent: 50,
      label: 'Furniture Village Outro',
    },
  },
];

/**
 * All 7 active scenes for the continuous tour
 */
export const CINEMATIC_TOUR_SCENES: TourSceneConfig[] = CINEMATIC_TOUR_ALL_SCENES.filter(
  (s) => s.isAvailable !== false
);
