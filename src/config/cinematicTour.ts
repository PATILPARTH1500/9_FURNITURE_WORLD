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
  videoSrcDesktop: string;
  videoSrcMobile: string;
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

/**
 * Determine whether client viewport is mobile (<=768px).
 * Safely defaults to desktop on SSR / node environments.
 */
export const isMobileViewport = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768;
};

/**
 * Resolves the video asset URL, routing to optimized 1080p desktop or 720p mobile variants.
 */
export const resolveVideoUrl = (path: string, forcedVariant?: 'desktop' | 'mobile'): string => {
  let targetPath = path;

  // Auto-detect variant based on viewport if not explicitly passed
  const activeVariant = forcedVariant || (isMobileViewport() ? 'mobile' : 'desktop');

  if (
    targetPath.includes('/videos/scenes/') &&
    !targetPath.includes('/desktop/') &&
    !targetPath.includes('/mobile/')
  ) {
    targetPath = targetPath.replace('/videos/scenes/', `/videos/scenes/${activeVariant}/`);
  }

  if (!VIDEO_CDN_BASE) return targetPath;
  const cleanPath = targetPath.startsWith('/') ? targetPath : `/${targetPath}`;
  return `${VIDEO_CDN_BASE}${cleanPath}`;
};

/**
 * SOURCE OF TRUTH: 5-Scene Production Video Tour for Furniture Village
 * Mapped to the 5 Google Flow 1080p footage files:
 * 1. Grand_living_room_reveal -> scene-1-living.mp4
 * 2. Camera_tracking_dining_room -> scene-2-dining.mp4
 * 3. Camera_tilting_down_in_kitchen -> scene-3-kitchen.mp4
 * 4. Children_racing_toy_cars -> scene-4-lounge.mp4
 * 5. Camera_pushes_into_bedroom -> scene-5-bedroom.mp4
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
    get videoSrc() {
      return resolveVideoUrl('/videos/scenes/scene-1-living.mp4');
    },
    get videoSrcDesktop() {
      return resolveVideoUrl('/videos/scenes/scene-1-living.mp4', 'desktop');
    },
    get videoSrcMobile() {
      return resolveVideoUrl('/videos/scenes/scene-1-living.mp4', 'mobile');
    },
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
    get videoSrc() {
      return resolveVideoUrl('/videos/scenes/scene-2-dining.mp4');
    },
    get videoSrcDesktop() {
      return resolveVideoUrl('/videos/scenes/scene-2-dining.mp4', 'desktop');
    },
    get videoSrcMobile() {
      return resolveVideoUrl('/videos/scenes/scene-2-dining.mp4', 'mobile');
    },
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
    get videoSrc() {
      return resolveVideoUrl('/videos/scenes/scene-3-kitchen.mp4');
    },
    get videoSrcDesktop() {
      return resolveVideoUrl('/videos/scenes/scene-3-kitchen.mp4', 'desktop');
    },
    get videoSrcMobile() {
      return resolveVideoUrl('/videos/scenes/scene-3-kitchen.mp4', 'mobile');
    },
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
    get videoSrc() {
      return resolveVideoUrl('/videos/scenes/scene-4-lounge.mp4');
    },
    get videoSrcDesktop() {
      return resolveVideoUrl('/videos/scenes/scene-4-lounge.mp4', 'desktop');
    },
    get videoSrcMobile() {
      return resolveVideoUrl('/videos/scenes/scene-4-lounge.mp4', 'mobile');
    },
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
    get videoSrc() {
      return resolveVideoUrl('/videos/scenes/scene-5-bedroom.mp4');
    },
    get videoSrcDesktop() {
      return resolveVideoUrl('/videos/scenes/scene-5-bedroom.mp4', 'desktop');
    },
    get videoSrcMobile() {
      return resolveVideoUrl('/videos/scenes/scene-5-bedroom.mp4', 'mobile');
    },
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
];

/**
 * All 5 active scenes for the continuous tour
 */
export const CINEMATIC_TOUR_SCENES: TourSceneConfig[] = CINEMATIC_TOUR_ALL_SCENES.filter(
  (s) => s.isAvailable !== false
);
