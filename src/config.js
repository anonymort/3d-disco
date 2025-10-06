// Configuration and constants for the 3D disco

export const ROOM_CONFIG = {
    size: 20,
    height: 10
};

export const CAMERA_CONFIG = {
    fov: 100,
    near: 0.1,
    far: 1000,
    initialPosition: { x: 0, y: 1.76, z: 0 },
    rotationSpeed: 0.02
};

export const DANCE_FLOOR_CONFIG = {
    gridSize: 20,
    tileColors: [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff, 0xffffff],
    tileMaterial: {
        roughness: 0.1,
        metalness: 0.9,
        emissiveIntensity: 0.3,
        envMapIntensity: 1.5
    }
};

export const DISCO_BALL_CONFIG = {
    radius: 1.5,
    rows: 30,
    tilesPerRow: 40,
    tileSize: 0.12,
    position: { x: 0, y: 8, z: 0 }, // roomHeight - 2
    material: {
        roughness: 0.01,
        metalness: 1.0,
        emissiveIntensity: 0.3,
        envMapIntensity: 2.0
    }
};

export const LIGHTING_CONFIG = {
    ambient: {
        color: 0x404040,
        intensity: 3
    },
    directional: {
        color: 0xffffff,
        intensity: 5,
        positions: [
            { x: 5, y: 10, z: 7.5 },
            { x: -5, y: 10, z: -7.5 }
        ]
    },
    spotlights: {
        colors: [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff],
        intensity: 10,
        distance: 30,
        angle: Math.PI / 8,
        penumbra: 0.3
    },
    pointLights: {
        count: 8,
        baseIntensity: 1,
        distance: 10
    }
};

export const CEILING_PANEL_CONFIG = {
    size: 1.5,
    spacing: 3,
    panelsPerRow: 4,
    emissiveIntensity: 2
};

export const DJ_BOOTH_CONFIG = {
    width: 6,
    height: 2,
    depth: 1.5
};

export const ENTRANCE_CONFIG = {
    width: 4,
    height: 5,
    zOffset: 3,
    tunnelDepth: 2,
    stepCount: 5,
    stepWidth: 4.5,
    stepDepth: 0.8,
    stepHeight: 0.3
};

export const LASER_CONFIG = {
    count: 6,
    colors: [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff],
    radius: 0.05,
    opacity: 0.8
};

export const PARTICLE_CONFIG = {
    count: 300,
    size: 0.15,
    opacity: 0.8
};

export const AUDIO_CONFIG = {
    volume: 0.15,
    lowPassFrequency: 800,
    bpm: 120,
    beatInterval: 500, // milliseconds
    beatsPerBar: 4
};

export const RENDERER_CONFIG = {
    antialias: true,
    shadowMap: true,
    toneMapping: 'ACESFilmicToneMapping',
    toneMappingExposure: 1.2
};

export const BLOOM_CONFIG = {
    strength: 1.5,
    radius: 0.4,
    threshold: 0.85
};

export const COLORS = {
    background: 0x1a1a2e,
    fog: 0x1a1a2e,
    wall: 0x1a1a1a,
    ceiling: 0x1a1a1a,
    floor: 0x111111,
    neon: [0xff00ff, 0x00ffff, 0xff0000, 0x00ff00],
    disco: [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff]
};
