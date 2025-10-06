import * as THREE from 'three';
import { ROOM_CONFIG, LIGHTING_CONFIG, CEILING_PANEL_CONFIG, LASER_CONFIG, COLORS } from './config.js';

export function createBasicLights() {
    const lights = [];

    // Ambient light
    const ambientLight = new THREE.AmbientLight(
        LIGHTING_CONFIG.ambient.color,
        LIGHTING_CONFIG.ambient.intensity
    );
    lights.push(ambientLight);

    // Directional lights
    LIGHTING_CONFIG.directional.positions.forEach(pos => {
        const directionalLight = new THREE.DirectionalLight(
            LIGHTING_CONFIG.directional.color,
            LIGHTING_CONFIG.directional.intensity
        );
        directionalLight.position.set(pos.x, pos.y, pos.z);
        lights.push(directionalLight);
    });

    return lights;
}

export function createCeilingPanels() {
    const ceilingPanels = [];
    const panelSpacing = CEILING_PANEL_CONFIG.spacing;
    const panelsPerRow = CEILING_PANEL_CONFIG.panelsPerRow;

    for (let i = 0; i < panelsPerRow; i++) {
        for (let j = 0; j < panelsPerRow; j++) {
            const panelGeometry = new THREE.PlaneGeometry(
                CEILING_PANEL_CONFIG.size,
                CEILING_PANEL_CONFIG.size
            );
            const panelMaterial = new THREE.MeshStandardMaterial({
                color: 0xff0000,
                emissive: 0xff0000,
                emissiveIntensity: CEILING_PANEL_CONFIG.emissiveIntensity,
                roughness: 0.1,
                metalness: 0.2
            });

            const panel = new THREE.Mesh(panelGeometry, panelMaterial);
            const xPos = (i - panelsPerRow / 2 + 0.5) * panelSpacing;
            const zPos = (j - panelsPerRow / 2 + 0.5) * panelSpacing;

            panel.position.set(xPos, ROOM_CONFIG.height - 0.1, zPos);
            panel.rotation.x = Math.PI / 2;

            ceilingPanels.push({
                mesh: panel,
                material: panelMaterial,
                targetColor: new THREE.Color(0xff0000),
                currentColor: new THREE.Color(0xff0000),
                targetIntensity: CEILING_PANEL_CONFIG.emissiveIntensity,
                currentIntensity: CEILING_PANEL_CONFIG.emissiveIntensity
            });
        }
    }

    return ceilingPanels;
}

export function createBackWallPanels() {
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
        panel.position.set(xPos, ROOM_CONFIG.height - 2, -ROOM_CONFIG.size / 2 + 0.05);

        backWallPanels.push({
            mesh: panel,
            material: panelMaterial,
            targetColor: new THREE.Color(0xff0000),
            currentColor: new THREE.Color(0xff0000)
        });
    }

    return backWallPanels;
}

export function createCornerNeonLights() {
    const cornerNeonLights = [];
    const neonHeight = ROOM_CONFIG.height;
    const tileSize = ROOM_CONFIG.size / 20; // gridSize from danceFloor

    const corners = [
        { x: -ROOM_CONFIG.size / 2 + tileSize / 2, z: -ROOM_CONFIG.size / 2 + tileSize / 2 },
        { x: ROOM_CONFIG.size / 2 - tileSize / 2, z: -ROOM_CONFIG.size / 2 + tileSize / 2 },
        { x: -ROOM_CONFIG.size / 2 + tileSize / 2, z: ROOM_CONFIG.size / 2 - tileSize / 2 },
        { x: ROOM_CONFIG.size / 2 - tileSize / 2, z: ROOM_CONFIG.size / 2 - tileSize / 2 }
    ];

    corners.forEach((corner, index) => {
        const neonRadius = (tileSize * 0.9 * 2/3) / 2;

        const neonGeometry = new THREE.CylinderGeometry(neonRadius, neonRadius, neonHeight, 16); // Reduced from 32
        const neonMaterial = new THREE.MeshStandardMaterial({
            color: COLORS.neon[index],
            emissive: COLORS.neon[index],
            emissiveIntensity: 2.5,
            roughness: 0.1,
            metalness: 0.3,
            transparent: true,
            opacity: 0.8
        });

        const neon = new THREE.Mesh(neonGeometry, neonMaterial);
        neon.position.set(corner.x, ROOM_CONFIG.height / 2, corner.z);

        cornerNeonLights.push({
            mesh: neon,
            material: neonMaterial,
            targetColor: new THREE.Color(COLORS.neon[index]),
            currentColor: new THREE.Color(COLORS.neon[index])
        });
    });

    return cornerNeonLights;
}

export function createSpotlights(discoBall) {
    const spotlights = [];
    const spotlightPositions = [
        { x: -ROOM_CONFIG.size/2 + 2, z: -ROOM_CONFIG.size/2 + 2 },
        { x: ROOM_CONFIG.size/2 - 2, z: -ROOM_CONFIG.size/2 + 2 },
        { x: -ROOM_CONFIG.size/2 + 2, z: ROOM_CONFIG.size/2 - 2 },
        { x: ROOM_CONFIG.size/2 - 2, z: ROOM_CONFIG.size/2 - 2 },
        { x: 0, z: -ROOM_CONFIG.size/2 + 2 },
        { x: 0, z: ROOM_CONFIG.size/2 - 2 }
    ];

    for (let i = 0; i < spotlightPositions.length; i++) {
        const spotlight = new THREE.SpotLight(
            LIGHTING_CONFIG.spotlights.colors[i],
            LIGHTING_CONFIG.spotlights.intensity,
            LIGHTING_CONFIG.spotlights.distance,
            Math.PI / 6,
            0.5,
            2
        );
        spotlight.position.set(
            spotlightPositions[i].x,
            ROOM_CONFIG.height - 3,
            spotlightPositions[i].z
        );

        const target = new THREE.Object3D();
        target.position.copy(discoBall.position);
        spotlight.target = target;

        spotlight.castShadow = true;
        spotlight.angle = LIGHTING_CONFIG.spotlights.angle;
        spotlight.penumbra = LIGHTING_CONFIG.spotlights.penumbra;

        spotlights.push({
            light: spotlight,
            target: target,
            basePosition: { ...spotlightPositions[i] },
            rotationAngle: 0,
            rotationSpeed: (Math.random() - 0.5) * 0.002
        });
    }

    return spotlights;
}

export function createPointLights() {
    const pointLights = [];
    const pointLightRadius = ROOM_CONFIG.size * 0.4;

    for (let i = 0; i < LIGHTING_CONFIG.pointLights.count; i++) {
        const angle = (i / LIGHTING_CONFIG.pointLights.count) * Math.PI * 2;
        const light = new THREE.PointLight(
            0xffffff,
            LIGHTING_CONFIG.pointLights.baseIntensity,
            LIGHTING_CONFIG.pointLights.distance
        );
        light.position.set(
            Math.cos(angle) * pointLightRadius,
            ROOM_CONFIG.height * 0.7,
            Math.sin(angle) * pointLightRadius
        );
        light.castShadow = true;

        pointLights.push({
            light: light,
            baseIntensity: LIGHTING_CONFIG.pointLights.baseIntensity,
            targetIntensity: LIGHTING_CONFIG.pointLights.baseIntensity,
            currentIntensity: LIGHTING_CONFIG.pointLights.baseIntensity,
            color: new THREE.Color(0xffffff),
            targetColor: new THREE.Color(0xffffff),
            changeSpeed: Math.random() * 0.02 + 0.01,
            radius: pointLightRadius
        });
    }

    return pointLights;
}

export function createLaserBeams() {
    const laserBeams = [];

    for (let i = 0; i < LASER_CONFIG.count; i++) {
        const laserGeometry = new THREE.CylinderGeometry(
            LASER_CONFIG.radius,
            LASER_CONFIG.radius,
            ROOM_CONFIG.height,
            8
        );
        const laserMaterial = new THREE.MeshBasicMaterial({
            color: LASER_CONFIG.colors[i],
            transparent: true,
            opacity: LASER_CONFIG.opacity
        });

        const laser = new THREE.Mesh(laserGeometry, laserMaterial);
        const angle = (i / LASER_CONFIG.count) * Math.PI * 2;
        const radius = ROOM_CONFIG.size * 0.3;

        laser.position.set(
            Math.cos(angle) * radius,
            ROOM_CONFIG.height / 2,
            Math.sin(angle) * radius
        );

        laserBeams.push({
            mesh: laser,
            material: laserMaterial,
            angle: angle,
            radius: radius,
            baseAngle: angle,
            rotationSpeed: (Math.random() - 0.5) * 0.001
        });
    }

    return laserBeams;
}
