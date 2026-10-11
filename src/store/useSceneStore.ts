import { create } from 'zustand';

export interface SceneStoreState {
  scrollProgress: number;
  activeScene: number; // 0: Foyer, 1: Salon, 2: Fireside, 3: Dining, 4: Sanctuary, 5: Panorama
  activeRoomIndex: number;
  explodedProgress: number; // 0 (assembled) to 1 (fully separated)
  selectedWoodId: string;
  selectedFabricId: string;
  activeAnnotationId: string | null;
  activeProductId: string | null;
  isQuickDrawerOpen: boolean;
  isReducedMotion: boolean;
  isModelReady: boolean;
  hasWebGLError: boolean;
  manualMaterialOverride: boolean;

  setScrollProgress: (progress: number) => void;
  setActiveScene: (sceneIndex: number) => void;
  setActiveRoomIndex: (roomIndex: number) => void;
  setExplodedProgress: (progress: number) => void;
  setSelectedWood: (woodId: string) => void;
  setSelectedFabric: (fabricId: string) => void;
  setActiveAnnotation: (id: string | null) => void;
  setActiveProduct: (productId: string | null) => void;
  setQuickDrawerOpen: (open: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
  setModelReady: (ready: boolean) => void;
  setWebGLError: (error: boolean) => void;
  resetScene: () => void;
}

export const useSceneStore = create<SceneStoreState>((set) => ({
  scrollProgress: 0,
  activeScene: 0,
  activeRoomIndex: 0,
  explodedProgress: 0,
  selectedWoodId: 'oak-natural',
  selectedFabricId: 'boucle-ivory',
  activeAnnotationId: null,
  activeProductId: null,
  isQuickDrawerOpen: false,
  isReducedMotion: false,
  isModelReady: false,
  hasWebGLError: false,
  manualMaterialOverride: false,

  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  setActiveScene: (sceneIndex) => set({ activeScene: sceneIndex, activeRoomIndex: sceneIndex }),
  setActiveRoomIndex: (roomIndex) => set({ activeRoomIndex: roomIndex, activeScene: roomIndex }),
  setExplodedProgress: (progress) => set({ explodedProgress: progress }),
  setSelectedWood: (woodId) => set({ selectedWoodId: woodId, manualMaterialOverride: true }),
  setSelectedFabric: (fabricId) => set({ selectedFabricId: fabricId, manualMaterialOverride: true }),
  setActiveAnnotation: (id) => set({ activeAnnotationId: id }),
  setActiveProduct: (productId) =>
    set({
      activeProductId: productId,
      isQuickDrawerOpen: !!productId,
    }),
  setQuickDrawerOpen: (open) =>
    set((state) => ({
      isQuickDrawerOpen: open,
      activeProductId: open ? state.activeProductId : null,
    })),
  setReducedMotion: (reduced) => set({ isReducedMotion: reduced }),
  setModelReady: (ready) => set({ isModelReady: ready }),
  setWebGLError: (error) => set({ hasWebGLError: error }),
  resetScene: () =>
    set({
      scrollProgress: 0,
      activeScene: 0,
      activeRoomIndex: 0,
      explodedProgress: 0,
      selectedWoodId: 'oak-natural',
      selectedFabricId: 'boucle-ivory',
      activeAnnotationId: null,
      activeProductId: null,
      isQuickDrawerOpen: false,
      manualMaterialOverride: false,
    }),
}));
