/**
 * Furniture World Navigation & Smooth Scroll Utility
 * Provides sticky-header offset compensated scrolling across all sections and tour scenes.
 */

export const SECTION_ALIASES: Record<string, string> = {
  home: 'home',
  explore: 'residence-tour',
  'residence-tour': 'residence-tour',
  tour: 'residence-tour',
  collections: 'collections',
  collection: 'collections',
  'our-story': 'our-story',
  'art-of-living': 'our-story',
  materials: 'materials',
  'materials-craft': 'materials',
  journal: 'journal',
  'editorial-spread': 'journal',
  reviews: 'customer-reviews',
  'customer-reviews': 'customer-reviews',
  gazette: 'gazette',
  newsletter: 'gazette',
};

export const TOUR_ROOM_INDICES: Record<string, number> = {
  living: 0,
  dining: 1,
  kitchen: 2,
  lounge: 3,
  bedroom: 4,
};

export function scrollToSection(rawTarget: string, offset: number = 76): boolean {
  if (typeof window === 'undefined') return false;

  // Restore body overflow in case mobile menu was locking it
  document.body.style.overflow = '';

  const cleanTarget = rawTarget.replace(/^\/?#/, '').toLowerCase().trim();
  if (!cleanTarget) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return true;
  }

  if (cleanTarget === 'home') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      window.history.pushState(null, '', '#home');
    } catch {}
    return true;
  }

  // Check if target is a specific room in the 5-scene cinematic residence tour
  if (cleanTarget in TOUR_ROOM_INDICES) {
    const roomIdx = TOUR_ROOM_INDICES[cleanTarget];
    const tourEl = document.getElementById('residence-tour') || document.getElementById('explore');
    if (tourEl) {
      const containerTop = tourEl.offsetTop;
      const totalScrollableHeight = Math.max(0, tourEl.offsetHeight - window.innerHeight);
      const targetY = containerTop + (roomIdx / 4) * totalScrollableHeight;
      window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
      try {
        window.history.pushState(null, '', `#${cleanTarget}`);
      } catch {}
      return true;
    }
  }

  // Resolve canonical section ID or alias
  const canonicalId = SECTION_ALIASES[cleanTarget] || cleanTarget;
  let targetEl = document.getElementById(canonicalId);
  if (!targetEl && canonicalId !== cleanTarget) {
    targetEl = document.getElementById(cleanTarget);
  }

  if (targetEl) {
    const rect = targetEl.getBoundingClientRect();
    const targetY = rect.top + window.scrollY - offset;
    window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
    try {
      window.history.pushState(null, '', `#${cleanTarget}`);
    } catch {}
    return true;
  }

  return false;
}

