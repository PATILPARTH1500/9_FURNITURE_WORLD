# 3D Asset Guidelines & GLB Drop-In Specification

The **Atelier Archetyp** 3D engine is architected to seamlessly support custom binary glTF (`.glb`) assets or fallback to our high-precision architectural procedural model.

## Target Production Model Hierarchy

To support the real scroll-driven exploded view (`Scene 2`) and material transitions (`Scene 3`), a production GLB should have discrete, separated nodes matching this hierarchy:

```
KronosLoungeChair (Root Group)
├── SeatCushion (Mesh with Upholstery Material)
│   └── WeltBeading (Child Mesh / Chamfer)
├── BackrestCushion (Mesh tilted at 112° with Upholstery Material)
│   └── BackrestSpineSupport (Solid Timber Mesh)
├── FrameLeft (Solid Timber Armature Left)
├── FrameRight (Solid Timber Armature Right)
├── SeatSubFrame (Stretcher Assembly & Webbing Slats)
├── LegsAssembly (Group)
│   ├── Leg_FL (Front Left Tapered Leg)
│   ├── Leg_FR (Front Right Tapered Leg)
│   ├── Leg_RL (Rear Left Raked Leg)
│   ├── Leg_RR (Rear Right Raked Leg)
│   └── Ferrules (Solid Milled Brass Foot Caps)
└── JoineryPins (Group)
    ├── Pin_FL (Front Left Brass Milled Tenon Dowel)
    ├── Pin_FR (Front Right Brass Milled Tenon Dowel)
    ├── Pin_RL (Rear Left Brass Milled Tenon Dowel)
    └── Pin_RR (Rear Right Brass Milled Tenon Dowel)
```

## Optimization Checklist

- **Geometry**: Quad-dominant topology, sub-divided with chamfers, < 45,000 polygons total.
- **Compression**: Draco geometry compression or Meshopt (`gltf-transform optimize`).
- **Textures**: 2K PBR channels (Albedo, Normal, Roughness/Metallic packed into ORM channels), KTX2 / Basis Universal.
- **Origin**: Pivots centered at the seat base `[0, 0, 0]` on floor level.
- **Units**: Real-world meters (1 unit = 1 meter).

