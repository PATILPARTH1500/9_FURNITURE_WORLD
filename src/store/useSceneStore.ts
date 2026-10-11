import { create } from 'zustand';

export interface SceneStoreState {
  scrollProgress: number;
  activeScene: number; // 0: Hero, 1: Exploded, 2: Materials, 3: Interior, 4: Collection
  explodedProgress: number; // 0 (assembled) to 1 (fully separated)
  selectedWoodId: string;
  selectedFabricId: string;
  activeAnnotationId: string | null;
  isReducedMotion: boolean;
  isModelReady: boolean;
  hasWebGLError: boolean;
  manualMaterialOverride: boolean;

  setScrollProgress: (progress: number) => void;
  setActiveScene: (sceneIndex: number) => void;
  setExplodedProgress: (progress: number) => void;
  setSelectedWood: (woodId: string) => void;
  setSelectedFabric: (fabricId: string) => void;
  setActiveAnnotation: (id: string | null) => void;
  setReducedMotion: (reduced: boolean) => void;
  setModelReady: (ready: boolean) => void;
  setWebGLError: (error: boolean) => void;
  resetScene: () => void;
}

export const useSceneStore = create<SceneStoreState>((set) => ({
  scrollProgress: 0,
  activeScene: 0,
  explodedProgress: 0,
  selectedWoodId: 'oak-natural',
  selectedFabricId: 'boucle-ivory',
  activeAnnotationId: null,
  isReducedMotion: false,
  isModelReady: false,
  hasWebGLError: false,
  manualMaterialOverride: false,

  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  setActiveScene: (sceneIndex) => set({ activeScene: sceneIndex }),
  setExplodedProgress: (progress) => set({ explodedProgress: progress }),
  setSelectedWood: (woodId) => set({ selectedWoodId: woodId, manualMaterialOverride: true }),
  setSelectedFabric: (fabricId) => set({ selectedFabricId: fabricId, manualMaterialOverride: true }),
  setActiveAnnotation: (id) => set({ activeAnnotationId: id }),
  setReducedMotion: (reduced) => set({ isReducedMotion: reduced }),
  setModelReady: (ready) => set({ isModelReady: ready }),
  setWebGLError: (error) => set({ hasWebGLError: error }),
  resetScene: () =>
    set({
      scrollProgress: 0,
      activeScene: 0,
      explodedProgress: 0,
      selectedWoodId: 'oak-natural',
      selectedFabricId: 'boucle-ivory',
      activeAnnotationId: null,
      manualMaterialOverride: false,
    }),
}));

