import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

console.log('Three.js loaded:', THREE.REVISION);

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);
scene.fog = new THREE.FogExp2(0x1a1a2e, 0.03); // Enhanced exponential fog for better depth

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 8, 20);
camera.lookAt(0, 2, 0);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
console.log('Renderer created:', renderer);
console.log('WebGL context:', renderer.getContext());
renderer.setSize(window.innerWidth, window.innerHeight);
console.log('Renderer size set:', window.innerWidth, 'x', window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
document.body.appendChild(renderer.domElement);
console.log('Canvas appended to body. Canvas element:', renderer.domElement);
console.log('Canvas dimensions:', renderer.domElement.width, 'x', renderer.domElement.height);

// Post-processing setup for bloom effect
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5, // strength
    0.4, // radius
    0.85 // threshold
);
composer.addPass(bloomPass);

// Basic lighting
const ambientLight = new THREE.AmbientLight(0x404040, 3);
scene.add(ambientLight);

// Add bright directional lights to illuminate the disco ball
const directionalLight1 = new THREE.DirectionalLight(0xffffff, 5);
directionalLight1.position.set(5, 10, 7.5);
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 5);
directionalLight2.position.set(-5, 10, -7.5);
scene.add(directionalLight2);

console.log('Scene setup complete. Objects in scene:', scene.children.length);

// Create room
const roomSize = 20;
const roomHeight = 10;

// Dance Floor
const danceFloorSize = roomSize; // Fill entire floor
const gridSize = 20;
const tileSize = danceFloorSize / gridSize;

// Create dance floor tiles
const danceFloorGroup = new THREE.Group();
const danceFloorTiles = [];

const tileColors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff, 0xffffff];

for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
        // Start with random color
        const randomColor = tileColors[Math.floor(Math.random() * tileColors.length)];

        const tileGeometry = new THREE.PlaneGeometry(tileSize * 0.9, tileSize * 0.9);
        const tileMaterial = new THREE.MeshStandardMaterial({
            color: randomColor,
            roughness: 0.1, // More reflective
            metalness: 0.9, // Higher metalness for reflections
            emissive: randomColor,
            emissiveIntensity: 0.3,
            envMapIntensity: 1.5 // Enhanced environment map reflections
        });

        const tile = new THREE.Mesh(tileGeometry, tileMaterial);
        tile.position.set(
            (i - gridSize / 2) * tileSize + tileSize / 2,
            0.01, // Slightly above the main floor
            (j - gridSize / 2) * tileSize + tileSize / 2
        );
        tile.rotation.x = -Math.PI / 2;
        tile.receiveShadow = true;

        danceFloorGroup.add(tile);
        danceFloorTiles.push({
            mesh: tile,
            material: tileMaterial,
            baseColor: new THREE.Color(randomColor),
            targetColor: new THREE.Color(randomColor),
            currentColor: new THREE.Color(randomColor)
        });
    }
}

// Main floor under dance floor
const floorGeometry = new THREE.PlaneGeometry(roomSize, roomSize);
const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.9,
    metalness: 0.1
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

scene.add(danceFloorGroup);

// Ceiling
const ceilingGeometry = new THREE.PlaneGeometry(roomSize, roomSize);
const ceilingMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.3,
    metalness: 0.5
});
const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
ceiling.position.y = roomHeight;
ceiling.rotation.x = Math.PI / 2;
scene.add(ceiling);

// Ceiling Light Panels
const ceilingPanels = [];
const panelSize = 1.5;
const panelSpacing = 3;
const panelsPerRow = 4;

for (let i = 0; i < panelsPerRow; i++) {
    for (let j = 0; j < panelsPerRow; j++) {
        const panelGeometry = new THREE.PlaneGeometry(panelSize, panelSize);
        const panelMaterial = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            emissive: 0xff0000,
            emissiveIntensity: 2,
            roughness: 0.1,
            metalness: 0.2
        });

        const panel = new THREE.Mesh(panelGeometry, panelMaterial);
        const xPos = (i - panelsPerRow / 2 + 0.5) * panelSpacing;
        const zPos = (j - panelsPerRow / 2 + 0.5) * panelSpacing;

        panel.position.set(xPos, roomHeight - 0.1, zPos);
        panel.rotation.x = Math.PI / 2;
        scene.add(panel);

        ceilingPanels.push({
            mesh: panel,
            material: panelMaterial,
            targetColor: new THREE.Color(0xff0000),
            currentColor: new THREE.Color(0xff0000),
            targetIntensity: 2,
            currentIntensity: 2
        });
    }
}

// Walls
const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.4,
    metalness: 0.6
});

// Back wall
const backWallGeometry = new THREE.PlaneGeometry(roomSize, roomHeight);
const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
backWall.position.z = -roomSize / 2;
backWall.position.y = roomHeight / 2;
backWall.receiveShadow = true;
scene.add(backWall);

// DJ Booth on back wall
const djBoothWidth = 6;
const djBoothHeight = 2;
const djBoothDepth = 1.5;

// DJ booth base
const djBoothGeometry = new THREE.BoxGeometry(djBoothWidth, djBoothHeight, djBoothDepth);
const djBoothMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.3,
    metalness: 0.7
});
const djBooth = new THREE.Mesh(djBoothGeometry, djBoothMaterial);
djBooth.position.set(0, djBoothHeight / 2, -roomSize / 2 + djBoothDepth / 2 + 0.1);
djBooth.receiveShadow = true;
djBooth.castShadow = true;
scene.add(djBooth);

// DJ booth LED strip
const djLEDGeometry = new THREE.BoxGeometry(djBoothWidth - 0.2, 0.1, djBoothDepth + 0.2);
const djLEDMaterial = new THREE.MeshStandardMaterial({
    color: 0xff00ff,
    emissive: 0xff00ff,
    emissiveIntensity: 2,
    roughness: 0.1,
    metalness: 0.3
});
const djLED = new THREE.Mesh(djLEDGeometry, djLEDMaterial);
djLED.position.set(0, djBoothHeight, -roomSize / 2 + djBoothDepth / 2 + 0.1);
scene.add(djLED);

// Speakers - Left and Right
function createSpeaker(x, z) {
    const speakerGroup = new THREE.Group();

    // Main speaker box
    const speakerGeometry = new THREE.BoxGeometry(1.5, 3, 1.2);
    const speakerMaterial = new THREE.MeshStandardMaterial({
        color: 0x0a0a0a,
        roughness: 0.8,
        metalness: 0.2
    });
    const speaker = new THREE.Mesh(speakerGeometry, speakerMaterial);
    speaker.castShadow = true;
    speaker.receiveShadow = true;
    speakerGroup.add(speaker);

    // Speaker cone (bottom)
    const coneGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32);
    const coneMaterial = new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.6,
        metalness: 0.4
    });
    const cone1 = new THREE.Mesh(coneGeometry, coneMaterial);
    cone1.position.y = -0.7;
    cone1.position.z = 0.61;
    cone1.rotation.x = Math.PI / 2;
    speakerGroup.add(cone1);

    // Speaker cone (top)
    const cone2 = new THREE.Mesh(coneGeometry, coneMaterial);
    cone2.position.y = 0.7;
    cone2.position.z = 0.61;
    cone2.rotation.x = Math.PI / 2;
    speakerGroup.add(cone2);

    // LED indicator
    const ledGeometry = new THREE.CircleGeometry(0.1, 16);
    const ledMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 3
    });
    const led = new THREE.Mesh(ledGeometry, ledMaterial);
    led.position.y = -1.2;
    led.position.z = 0.61;
    speakerGroup.add(led);

    speakerGroup.position.set(x, 1.5, z);
    return speakerGroup;
}

// Add speakers
const leftSpeaker = createSpeaker(-roomSize / 2 + 1.5, -roomSize / 2 + 1);
const rightSpeaker = createSpeaker(roomSize / 2 - 1.5, -roomSize / 2 + 1);
scene.add(leftSpeaker);
scene.add(rightSpeaker);

// Back wall decorative panels
const backWallPanels = [];
const panelCount = 8;
const panelWidth = 1.2;
const panelHeight = 1.5;

for (let i = 0; i < panelCount; i++) {
    const panelGeometry = new THREE.BoxGeometry(panelWidth, panelHeight, 0.1);
    const panelMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 1,
        roughness: 0.2,
        metalness: 0.5
    });

    const panel = new THREE.Mesh(panelGeometry, panelMaterial);
    const xPos = (i - panelCount / 2 + 0.5) * (panelWidth + 0.3);
    panel.position.set(xPos, roomHeight - 2, -roomSize / 2 + 0.05);
    scene.add(panel);

    backWallPanels.push({
        mesh: panel,
        material: panelMaterial,
        targetColor: new THREE.Color(0xff0000),
        currentColor: new THREE.Color(0xff0000)
    });
}

// Front wall - REMOVED so we can see inside
// const frontWallGeometry = new THREE.PlaneGeometry(roomSize, roomHeight);
// const frontWall = new THREE.Mesh(frontWallGeometry, wallMaterial);
// frontWall.position.z = roomSize / 2;
// frontWall.position.y = roomHeight / 2;
// frontWall.receiveShadow = true;
// scene.add(frontWall);

// Left wall with entrance hole
const entranceWidth = 4;
const entranceHeight = 5;
const entranceZ = 3; // Offset from center

const leftWallShape = new THREE.Shape();
leftWallShape.moveTo(-roomSize / 2, 0);
leftWallShape.lineTo(roomSize / 2, 0);
leftWallShape.lineTo(roomSize / 2, roomHeight);
leftWallShape.lineTo(-roomSize / 2, roomHeight);
leftWallShape.lineTo(-roomSize / 2, 0);

// Create hole for entrance (grand archway)
const holePath = new THREE.Path();
holePath.moveTo(entranceZ - entranceWidth / 2, 0);
holePath.lineTo(entranceZ + entranceWidth / 2, 0);
holePath.lineTo(entranceZ + entranceWidth / 2, entranceHeight - 1);
// Arch top
holePath.quadraticCurveTo(
    entranceZ + entranceWidth / 2,
    entranceHeight,
    entranceZ,
    entranceHeight
);
holePath.quadraticCurveTo(
    entranceZ - entranceWidth / 2,
    entranceHeight,
    entranceZ - entranceWidth / 2,
    entranceHeight - 1
);
holePath.lineTo(entranceZ - entranceWidth / 2, 0);
leftWallShape.holes.push(holePath);

const leftWallGeometry = new THREE.ShapeGeometry(leftWallShape);
const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
leftWall.position.x = -roomSize / 2;
leftWall.rotation.y = Math.PI / 2;
leftWall.receiveShadow = true;
scene.add(leftWall);

// Create entrance tunnel/depth to hide the blackness
const tunnelDepth = 2;
const tunnelGeometry = new THREE.BoxGeometry(tunnelDepth, entranceHeight, entranceWidth);
const tunnelMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.8,
    metalness: 0.3
});
const tunnel = new THREE.Mesh(tunnelGeometry, tunnelMaterial);
tunnel.position.set(-roomSize / 2 - tunnelDepth / 2, entranceHeight / 2, entranceZ);
tunnel.receiveShadow = true;
scene.add(tunnel);

// Entrance archway frame (decorative) - complete frame
const archFrameMaterial = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    roughness: 0.1,
    metalness: 1.0,
    envMapIntensity: 2.0
});

// Top arch
const archFrameGeometry = new THREE.TorusGeometry(entranceWidth / 2, 0.15, 16, 32, Math.PI);
const archFrame = new THREE.Mesh(archFrameGeometry, archFrameMaterial);
archFrame.position.set(-roomSize / 2 + 0.1, entranceHeight - 1, entranceZ);
archFrame.rotation.y = Math.PI / 2;
scene.add(archFrame);

// Left vertical frame
const leftFrameGeometry = new THREE.CylinderGeometry(0.15, 0.15, entranceHeight - 1, 16);
const leftFrame = new THREE.Mesh(leftFrameGeometry, archFrameMaterial);
leftFrame.position.set(-roomSize / 2 + 0.1, (entranceHeight - 1) / 2, entranceZ - entranceWidth / 2);
scene.add(leftFrame);

// Right vertical frame
const rightFrameGeometry = new THREE.CylinderGeometry(0.15, 0.15, entranceHeight - 1, 16);
const rightFrame = new THREE.Mesh(rightFrameGeometry, archFrameMaterial);
rightFrame.position.set(-roomSize / 2 + 0.1, (entranceHeight - 1) / 2, entranceZ + entranceWidth / 2);
scene.add(rightFrame);

// Steps leading up to entrance - OUTSIDE the wall, facing inward
const stepCount = 5;
const stepWidth = entranceWidth + 0.5;
const stepDepth = 0.8;
const stepHeight = 0.3;

for (let i = 0; i < stepCount; i++) {
    const stepGeometry = new THREE.BoxGeometry(stepDepth, stepHeight, stepWidth);
    const stepMaterial = new THREE.MeshStandardMaterial({
        color: 0x2a2a2a,
        roughness: 0.8,
        metalness: 0.2
    });
    const step = new THREE.Mesh(stepGeometry, stepMaterial);
    // Position steps outside the wall, descending away from entrance
    step.position.set(
        -roomSize / 2 - tunnelDepth - (i * stepDepth),
        stepHeight / 2 + (stepCount - 1 - i) * stepHeight,
        entranceZ
    );
    step.castShadow = true;
    step.receiveShadow = true;
    scene.add(step);
}

// UK-style green EXIT sign above entrance - adjusted position
const signWidth = 2.5;
const signHeight = 0.6;
const signDepth = 0.1;

// Sign box
const signGeometry = new THREE.BoxGeometry(signWidth, signHeight, signDepth);
const signMaterial = new THREE.MeshStandardMaterial({
    color: 0x00aa00,
    emissive: 0x00ff00,
    emissiveIntensity: 1.5,
    roughness: 0.3,
    metalness: 0.1
});
const exitSign = new THREE.Mesh(signGeometry, signMaterial);
exitSign.position.set(-roomSize / 2 + 0.15, entranceHeight + 1.8, entranceZ);
exitSign.rotation.y = Math.PI / 2;
scene.add(exitSign);

// Add "EXIT" text using simple geometry
const textMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 2
});

// Simple EXIT text representation
const exitTextGroup = new THREE.Group();
// E
let letterGeo = new THREE.PlaneGeometry(0.3, 0.4);
let letter = new THREE.Mesh(letterGeo, textMaterial);
letter.position.set(-0.7, 0, 0.06);
exitTextGroup.add(letter);

// X
letterGeo = new THREE.PlaneGeometry(0.3, 0.4);
letter = new THREE.Mesh(letterGeo, textMaterial);
letter.position.set(-0.25, 0, 0.06);
exitTextGroup.add(letter);

// I
letterGeo = new THREE.PlaneGeometry(0.15, 0.4);
letter = new THREE.Mesh(letterGeo, textMaterial);
letter.position.set(0.15, 0, 0.06);
exitTextGroup.add(letter);

// T
letterGeo = new THREE.PlaneGeometry(0.3, 0.4);
letter = new THREE.Mesh(letterGeo, textMaterial);
letter.position.set(0.6, 0, 0.06);
exitTextGroup.add(letter);

exitTextGroup.position.copy(exitSign.position);
exitTextGroup.rotation.y = Math.PI / 2;
scene.add(exitTextGroup);

// Right wall
const rightWallGeometry = new THREE.PlaneGeometry(roomSize, roomHeight);
const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
rightWall.position.x = roomSize / 2;
rightWall.position.y = roomHeight / 2;
rightWall.rotation.y = -Math.PI / 2;
rightWall.receiveShadow = true;
scene.add(rightWall);

// Corner Neon Lights - Standing circular lights on corner tiles
const cornerNeonLights = [];
const neonHeight = roomHeight; // Floor to ceiling

// Create corner neon lights positioned on corner tiles
const corners = [
    { x: -roomSize / 2 + tileSize / 2, z: -roomSize / 2 + tileSize / 2 }, // Back left corner tile
    { x: roomSize / 2 - tileSize / 2, z: -roomSize / 2 + tileSize / 2 },  // Back right corner tile
    { x: -roomSize / 2 + tileSize / 2, z: roomSize / 2 - tileSize / 2 },  // Front left corner tile
    { x: roomSize / 2 - tileSize / 2, z: roomSize / 2 - tileSize / 2 }    // Front right corner tile
];

const neonColors = [0xff00ff, 0x00ffff, 0xff0000, 0x00ff00];

corners.forEach((corner, index) => {
    // Create vertical cylindrical neon light - inner 2/3rds of tile diameter
    const neonRadius = (tileSize * 0.9 * 2/3) / 2; // 2/3rds of tile diameter

    const neonGeometry = new THREE.CylinderGeometry(neonRadius, neonRadius, neonHeight, 32);
    const neonMaterial = new THREE.MeshStandardMaterial({
        color: neonColors[index],
        emissive: neonColors[index],
        emissiveIntensity: 2.5,
        roughness: 0.1,
        metalness: 0.3,
        transparent: true,
        opacity: 0.8
    });

    const neon = new THREE.Mesh(neonGeometry, neonMaterial);
    neon.position.set(corner.x, roomHeight / 2, corner.z); // Center vertically
    scene.add(neon);

    cornerNeonLights.push({
        mesh: neon,
        material: neonMaterial,
        targetColor: new THREE.Color(neonColors[index]),
        currentColor: new THREE.Color(neonColors[index])
    });
});

// Note: Corner neon lights are now the primary corner lighting (ledStrips removed to avoid duplicates)

// Disco Ball - Create with structured grid of mirror tiles
const discoBallGroup = new THREE.Group();
const discoBallRadius = 1.5;

// Create base sphere (dark)
const baseSphereGeometry = new THREE.SphereGeometry(discoBallRadius * 0.98, 64, 64);
const baseSphereMaterial = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.9,
    metalness: 0.1
});
const baseSphere = new THREE.Mesh(baseSphereGeometry, baseSphereMaterial);
discoBallGroup.add(baseSphere);

// Add mirror tiles in a grid pattern with enhanced detail
const rows = 30; // Increased horizontal rows for more detail
const tilesPerRow = 40; // More tiles around each row
const discoBallFacets = []; // Store facets for animation

for (let row = 0; row < rows; row++) {
    const phi = (row / rows) * Math.PI; // 0 to PI (top to bottom)
    const rowRadius = Math.sin(phi) * discoBallRadius;
    const tilesInThisRow = Math.max(3, Math.floor(tilesPerRow * Math.sin(phi))); // Fewer tiles at poles

    for (let tile = 0; tile < tilesInThisRow; tile++) {
        const theta = (tile / tilesInThisRow) * Math.PI * 2;

        // Position on sphere
        const x = rowRadius * Math.cos(theta);
        const y = discoBallRadius * Math.cos(phi);
        const z = rowRadius * Math.sin(theta);

        // Create mirror tile with enhanced reflectivity
        const tileSize = 0.12;
        const facetGeometry = new THREE.PlaneGeometry(tileSize, tileSize);
        const facetMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.01,
            metalness: 1.0,
            emissive: 0xffffff,
            emissiveIntensity: 0.3,
            envMapIntensity: 2.0
        });

        const facet = new THREE.Mesh(facetGeometry, facetMaterial);
        facet.position.set(x, y, z);

        // Point outward from center
        const normal = new THREE.Vector3(x, y, z).normalize();
        facet.lookAt(normal.multiplyScalar(100));

        discoBallGroup.add(facet);
        discoBallFacets.push({
            mesh: facet,
            material: facetMaterial,
            baseIntensity: 0.3
        });
    }
}

discoBallGroup.position.set(0, roomHeight - 2, 0);
scene.add(discoBallGroup);

// Reference for animation
const discoBall = discoBallGroup;

// Spotlights pointing at disco ball
const spotlightColors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
const spotlights = [];
const spotlightPositions = [
    { x: -roomSize/2 + 2, z: -roomSize/2 + 2 },
    { x: roomSize/2 - 2, z: -roomSize/2 + 2 },
    { x: -roomSize/2 + 2, z: roomSize/2 - 2 },
    { x: roomSize/2 - 2, z: roomSize/2 - 2 },
    { x: 0, z: -roomSize/2 + 2 },
    { x: 0, z: roomSize/2 - 2 }
];

for (let i = 0; i < spotlightPositions.length; i++) {
    const spotlight = new THREE.SpotLight(spotlightColors[i], 10, 30, Math.PI / 6, 0.5, 2);
    spotlight.position.set(
        spotlightPositions[i].x,
        roomHeight - 3,
        spotlightPositions[i].z
    );

    // Create target for spotlight
    const target = new THREE.Object3D();
    target.position.copy(discoBall.position);
    scene.add(target);
    spotlight.target = target;

    spotlight.castShadow = true;
    spotlight.angle = Math.PI / 8;
    spotlight.penumbra = 0.3;

    scene.add(spotlight);
    spotlights.push({
        light: spotlight,
        target: target,
        basePosition: { ...spotlightPositions[i] },
        rotationAngle: 0,
        rotationSpeed: (Math.random() - 0.5) * 0.002
    });
}

// Point lights around the room for ambient disco effect
const pointLights = [];
const pointLightCount = 8;
const pointLightRadius = roomSize * 0.4;

for (let i = 0; i < pointLightCount; i++) {
    const angle = (i / pointLightCount) * Math.PI * 2;
    const light = new THREE.PointLight(0xffffff, 1, 10);
    light.position.set(
        Math.cos(angle) * pointLightRadius,
        roomHeight * 0.7,
        Math.sin(angle) * pointLightRadius
    );
    light.castShadow = true;
    scene.add(light);
    pointLights.push({
        light: light,
        baseIntensity: 1,
        targetIntensity: 1,
        currentIntensity: 1,
        color: new THREE.Color(0xffffff),
        targetColor: new THREE.Color(0xffffff),
        changeSpeed: Math.random() * 0.02 + 0.01
    });
}

// Laser Beams
const laserBeams = [];
const laserCount = 6;
const laserColors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];

for (let i = 0; i < laserCount; i++) {
    const laserGeometry = new THREE.CylinderGeometry(0.05, 0.05, roomHeight, 8);
    const laserMaterial = new THREE.MeshBasicMaterial({
        color: laserColors[i],
        transparent: true,
        opacity: 0.8
    });

    const laser = new THREE.Mesh(laserGeometry, laserMaterial);
    const angle = (i / laserCount) * Math.PI * 2;
    const radius = roomSize * 0.3;

    laser.position.set(
        Math.cos(angle) * radius,
        roomHeight / 2,
        Math.sin(angle) * radius
    );

    scene.add(laser);

    laserBeams.push({
        mesh: laser,
        material: laserMaterial,
        angle: angle,
        radius: radius,
        baseAngle: angle,
        rotationSpeed: (Math.random() - 0.5) * 0.001
    });
}

// Particle System - Sparkles and light particles
const particleCount = 300;
const particleGeometry = new THREE.BufferGeometry();
const particlePositions = new Float32Array(particleCount * 3);
const particleVelocities = [];
const particleColors = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
    // Random positions within the room
    particlePositions[i * 3] = (Math.random() - 0.5) * roomSize * 0.8;
    particlePositions[i * 3 + 1] = Math.random() * roomHeight * 0.8;
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * roomSize * 0.8;

    // Random velocities
    particleVelocities.push({
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.02
    });

    // Random colors
    const colorChoice = Math.floor(Math.random() * laserColors.length);
    const color = new THREE.Color(laserColors[colorChoice]);
    particleColors[i * 3] = color.r;
    particleColors[i * 3 + 1] = color.g;
    particleColors[i * 3 + 2] = color.b;
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

const particleMaterial = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particleSystem);

// Handle window resize
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    composer.setSize(width, height);
    console.log('Resized to:', width, 'x', height);
});

// Animation variables
let time = 0;

// Audio context for background music
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const masterGain = audioContext.createGain();
masterGain.gain.value = 0.15; // Muffled volume
masterGain.connect(audioContext.destination);

// Low-pass filter for muffled effect
const lowPassFilter = audioContext.createBiquadFilter();
lowPassFilter.type = 'lowpass';
lowPassFilter.frequency.value = 800; // Muffled sound
lowPassFilter.Q.value = 1;
masterGain.connect(lowPassFilter);
lowPassFilter.connect(audioContext.destination);

// Beat timing - 120 BPM (500ms per beat)
const beatInterval = 500; // milliseconds
const beatsPerBar = 4;

// Function to create kick drum sound
function playKick(time) {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);

    gain.gain.setValueAtTime(1, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(time);
    osc.stop(time + 0.5);
}

// Function to create hi-hat sound
function playHiHat(time) {
    const bufferSize = audioContext.sampleRate * 0.1;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize / 20));
    }

    const noise = audioContext.createBufferSource();
    noise.buffer = buffer;

    const gain = audioContext.createGain();
    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);

    noise.connect(gain);
    gain.connect(masterGain);

    noise.start(time);
}

// Function to create bass synth
function playBass(time, frequency) {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(frequency, time);

    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(time);
    osc.stop(time + 0.2);
}

// Schedule beats
let beatCount = 0;
function scheduleBeat() {
    const now = audioContext.currentTime;
    const beatTime = now + 0.1;

    // Kick on every beat
    if (beatCount % 2 === 0) {
        playKick(beatTime);
    }

    // Hi-hat on off-beats
    if (beatCount % 2 === 1) {
        playHiHat(beatTime);
    }

    // Bass pattern
    if (beatCount % 8 === 0) {
        playBass(beatTime, 65.41); // C2
    } else if (beatCount % 8 === 4) {
        playBass(beatTime, 82.41); // E2
    }

    beatCount++;
}

// Start the beat
setInterval(scheduleBeat, beatInterval);

// Dance floor animation
function animateDanceFloor() {
    for (let i = 0; i < danceFloorTiles.length; i++) {
        const tile = danceFloorTiles[i];

        // Random color changes
        if (Math.random() < 0.01) {
            const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff, 0xffffff];
            tile.targetColor.setHex(colors[Math.floor(Math.random() * colors.length)]);
        }

        // Interpolate color smoothly
        tile.currentColor.lerp(tile.targetColor, 0.1);
        tile.material.color.copy(tile.currentColor);
        tile.material.emissive.copy(tile.currentColor);
        tile.material.emissiveIntensity = 0.3; // Constant glow, no flashing
    }
}

// Light animations
function animateLights() {
    // Rotate disco ball (only horizontal spin) - synced to beat
    discoBall.rotation.y += 0.01;

    // Animate disco ball facets for sparkle effect - synced to beat (120 BPM = 500ms per beat)
    const beatPhase = (time % beatInterval) / beatInterval; // 0 to 1 per beat
    discoBallFacets.forEach((facet, index) => {
        // Pulse on beat
        const beatPulse = Math.sin(beatPhase * Math.PI) * 0.5;
        const sparkle = Math.sin(time * 0.005 + index * 0.1) * 0.5 + 0.5;
        facet.material.emissiveIntensity = facet.baseIntensity + (sparkle + beatPulse) * 0.5;
    });

    // Animate spotlights with rotation
    spotlights.forEach((spotlightObj, index) => {
        const spotlight = spotlightObj.light;
        const intensity = Math.sin(time * 0.001 + index) * 5 + 8;
        spotlight.intensity = intensity;

        // Rotate spotlight around the room
        spotlightObj.rotationAngle += spotlightObj.rotationSpeed;
        const radius = 3;
        const newX = Math.cos(spotlightObj.rotationAngle) * radius;
        const newZ = Math.sin(spotlightObj.rotationAngle) * radius;
        spotlight.position.x = newX;
        spotlight.position.z = newZ;

        // Rotate spotlight targets slightly around the disco ball
        const targetX = Math.sin(time * 0.0005 + index * 0.5) * 0.5;
        const targetZ = Math.cos(time * 0.0005 + index * 0.5) * 0.5;
        spotlightObj.target.position.set(targetX, discoBall.position.y, targetZ);
    });
    
    // Animate point lights
    pointLights.forEach((pointLight, index) => {
        // Change color randomly
        if (Math.random() < 0.02) {
            const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
            pointLight.targetColor.setHex(colors[Math.floor(Math.random() * colors.length)]);
            pointLight.targetIntensity = Math.random() * 2 + 0.5;
        }
        
        // Interpolate color and intensity
        pointLight.color.lerp(pointLight.targetColor, 0.05);
        pointLight.currentIntensity += (pointLight.targetIntensity - pointLight.currentIntensity) * 0.05;
        
        pointLight.light.color.copy(pointLight.color);
        pointLight.light.intensity = pointLight.currentIntensity;
        
        // Move lights in a circle
        const angle = (index / pointLightCount) * Math.PI * 2 + time * 0.0005;
        pointLight.light.position.x = Math.cos(angle) * pointLightRadius;
        pointLight.light.position.z = Math.sin(angle) * pointLightRadius;
    });


    // Animate ceiling panels
    ceilingPanels.forEach((panel, index) => {
        // Change color randomly
        if (Math.random() < 0.02) {
            const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
            panel.targetColor.setHex(colors[Math.floor(Math.random() * colors.length)]);
            panel.targetIntensity = Math.random() * 2 + 1;
        }

        // Interpolate color and intensity
        panel.currentColor.lerp(panel.targetColor, 0.05);
        panel.currentIntensity += (panel.targetIntensity - panel.currentIntensity) * 0.05;

        panel.material.color.copy(panel.currentColor);
        panel.material.emissive.copy(panel.currentColor);
        panel.material.emissiveIntensity = panel.currentIntensity;
    });

    // Animate laser beams
    laserBeams.forEach((laser, index) => {
        // Rotate laser beams around the room
        laser.angle += laser.rotationSpeed;
        laser.mesh.position.x = Math.cos(laser.angle) * laser.radius;
        laser.mesh.position.z = Math.sin(laser.angle) * laser.radius;

        // Slight rotation for scanning effect
        laser.mesh.rotation.z = Math.sin(time * 0.001 + index) * 0.3;
    });

    // Animate back wall panels
    backWallPanels.forEach((panel, index) => {
        if (Math.random() < 0.015) {
            const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
            panel.targetColor.setHex(colors[Math.floor(Math.random() * colors.length)]);
        }

        panel.currentColor.lerp(panel.targetColor, 0.05);
        panel.material.color.copy(panel.currentColor);
        panel.material.emissive.copy(panel.currentColor);
    });

    // Animate corner neon lights - all in sync
    if (Math.random() < 0.015) {
        const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
        const newColor = colors[Math.floor(Math.random() * colors.length)];
        cornerNeonLights.forEach((neon) => {
            neon.targetColor.setHex(newColor);
        });
    }

    cornerNeonLights.forEach((neon) => {
        neon.currentColor.lerp(neon.targetColor, 0.05);
        neon.material.color.copy(neon.currentColor);
        neon.material.emissive.copy(neon.currentColor);
    });

    // Animate particles
    const positions = particleSystem.geometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += particleVelocities[i].x;
        positions[i * 3 + 1] += particleVelocities[i].y;
        positions[i * 3 + 2] += particleVelocities[i].z;

        // Wrap around room boundaries
        if (Math.abs(positions[i * 3]) > roomSize / 2) particleVelocities[i].x *= -1;
        if (positions[i * 3 + 1] > roomHeight || positions[i * 3 + 1] < 0) particleVelocities[i].y *= -1;
        if (Math.abs(positions[i * 3 + 2]) > roomSize / 2) particleVelocities[i].z *= -1;
    }
    particleSystem.geometry.attributes.position.needsUpdate = true;
}

// Animation loop
let frameCount = 0;
function animate() {
    requestAnimationFrame(animate);

    time += 16; // Approximate milliseconds per frame

    animateDanceFloor();
    animateLights();

    composer.render(); // Use composer instead of renderer for post-processing

    frameCount++;
    if (frameCount === 1) {
        console.log('First frame rendered');
        console.log('Camera position:', camera.position);
        console.log('Renderer info:', renderer.info);
    }
}

console.log('Starting animation loop...');
animate();
console.log('Animation loop started');