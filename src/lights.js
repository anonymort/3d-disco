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
    const panelSpacing = CEILING_PANEL_CONFIG.spacing;
    const panelsPerRow = CEILING_PANEL_CONFIG.panelsPerRow;
    const totalPanels = panelsPerRow * panelsPerRow;

    const panelGeometry = new THREE.PlaneGeometry(
        CEILING_PANEL_CONFIG.size,
        CEILING_PANEL_CONFIG.size
    );

    // Use MeshBasicMaterial for emissive panels
    const panelMaterial = new THREE.MeshBasicMaterial({
        vertexColors: true,
        toneMapped: false
    });

    const instancedPanels = new THREE.InstancedMesh(
        panelGeometry,
        panelMaterial,
        totalPanels
    );
    instancedPanels.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(totalPanels * 3), 3);

    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();
    quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);

    const currentColors = new Float32Array(totalPanels * 3);
    const targetColors = new Float32Array(totalPanels * 3);
    const currentIntensities = new Float32Array(totalPanels);
    const targetIntensities = new Float32Array(totalPanels);

    let index = 0;
    for (let i = 0; i < panelsPerRow; i++) {
        for (let j = 0; j < panelsPerRow; j++) {
            const xPos = (i - panelsPerRow / 2 + 0.5) * panelSpacing;
            const zPos = (j - panelsPerRow / 2 + 0.5) * panelSpacing;

            matrix.compose(
                new THREE.Vector3(xPos, ROOM_CONFIG.height - 0.1, zPos),
                quaternion,
                new THREE.Vector3(1, 1, 1)
            );
            instancedPanels.setMatrixAt(index, matrix);

            const color = new THREE.Color(0xff0000);
            currentColors[index * 3] = color.r;
            currentColors[index * 3 + 1] = color.g;
            currentColors[index * 3 + 2] = color.b;
            targetColors[index * 3] = color.r;
            targetColors[index * 3 + 1] = color.g;
            targetColors[index * 3 + 2] = color.b;

            currentIntensities[index] = CEILING_PANEL_CONFIG.emissiveIntensity;
            targetIntensities[index] = CEILING_PANEL_CONFIG.emissiveIntensity;

            instancedPanels.setColorAt(index, color);
            index++;
        }
    }

    instancedPanels.instanceMatrix.needsUpdate = true;
    instancedPanels.instanceColor.needsUpdate = true;

    return {
        mesh: instancedPanels,
        currentColors: currentColors,
        targetColors: targetColors,
        currentIntensities: currentIntensities,
        targetIntensities: targetIntensities,
        panelCount: totalPanels
    };
}

export function createBackWallPanels() {
    const panelCount = 8;
    const panelWidth = 1.2;
    const panelHeight = 1.5;

    const panelGeometry = new THREE.BoxGeometry(panelWidth, panelHeight, 0.1);

    // Use MeshBasicMaterial for emissive panels
    const panelMaterial = new THREE.MeshBasicMaterial({
        vertexColors: true,
        toneMapped: false
    });

    const instancedPanels = new THREE.InstancedMesh(
        panelGeometry,
        panelMaterial,
        panelCount
    );
    instancedPanels.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(panelCount * 3), 3);

    const matrix = new THREE.Matrix4();
    const currentColors = new Float32Array(panelCount * 3);
    const targetColors = new Float32Array(panelCount * 3);

    for (let i = 0; i < panelCount; i++) {
        const xPos = (i - panelCount / 2 + 0.5) * (panelWidth + 0.3);

        matrix.compose(
            new THREE.Vector3(xPos, ROOM_CONFIG.height - 2, -ROOM_CONFIG.size / 2 + 0.05),
            new THREE.Quaternion(),
            new THREE.Vector3(1, 1, 1)
        );
        instancedPanels.setMatrixAt(i, matrix);

        const color = new THREE.Color(0xff0000);
        currentColors[i * 3] = color.r;
        currentColors[i * 3 + 1] = color.g;
        currentColors[i * 3 + 2] = color.b;
        targetColors[i * 3] = color.r;
        targetColors[i * 3 + 1] = color.g;
        targetColors[i * 3 + 2] = color.b;

        instancedPanels.setColorAt(i, color);
    }

    instancedPanels.instanceMatrix.needsUpdate = true;
    instancedPanels.instanceColor.needsUpdate = true;

    return {
        mesh: instancedPanels,
        currentColors: currentColors,
        targetColors: targetColors,
        panelCount: panelCount
    };
}

export function createCornerNeonLights() {
    const neonHeight = ROOM_CONFIG.height;
    const tileSize = ROOM_CONFIG.size / 20; // gridSize from danceFloor
    const neonRadius = (tileSize * 0.9 * 2/3) / 2;
    const neonCount = 4;

    const corners = [
        { x: -ROOM_CONFIG.size / 2 + tileSize / 2, z: -ROOM_CONFIG.size / 2 + tileSize / 2 },
        { x: ROOM_CONFIG.size / 2 - tileSize / 2, z: -ROOM_CONFIG.size / 2 + tileSize / 2 },
        { x: -ROOM_CONFIG.size / 2 + tileSize / 2, z: ROOM_CONFIG.size / 2 - tileSize / 2 },
        { x: ROOM_CONFIG.size / 2 - tileSize / 2, z: ROOM_CONFIG.size / 2 - tileSize / 2 }
    ];

    const neonGeometry = new THREE.CylinderGeometry(neonRadius, neonRadius, neonHeight, 16);

    // Use MeshBasicMaterial for emissive neon
    const neonMaterial = new THREE.MeshBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        toneMapped: false
    });

    const instancedNeons = new THREE.InstancedMesh(
        neonGeometry,
        neonMaterial,
        neonCount
    );
    instancedNeons.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(neonCount * 3), 3);

    const matrix = new THREE.Matrix4();
    const currentColors = new Float32Array(neonCount * 3);
    const targetColors = new Float32Array(neonCount * 3);

    corners.forEach((corner, index) => {
        matrix.compose(
            new THREE.Vector3(corner.x, ROOM_CONFIG.height / 2, corner.z),
            new THREE.Quaternion(),
            new THREE.Vector3(1, 1, 1)
        );
        instancedNeons.setMatrixAt(index, matrix);

        const color = new THREE.Color(COLORS.neon[index]);
        const intensity = 2.5;
        currentColors[index * 3] = color.r * intensity;
        currentColors[index * 3 + 1] = color.g * intensity;
        currentColors[index * 3 + 2] = color.b * intensity;
        targetColors[index * 3] = color.r * intensity;
        targetColors[index * 3 + 1] = color.g * intensity;
        targetColors[index * 3 + 2] = color.b * intensity;

        instancedNeons.setColorAt(index, new THREE.Color(color.r * intensity, color.g * intensity, color.b * intensity));
    });

    instancedNeons.instanceMatrix.needsUpdate = true;
    instancedNeons.instanceColor.needsUpdate = true;

    return {
        mesh: instancedNeons,
        currentColors: currentColors,
        targetColors: targetColors,
        neonCount: neonCount
    };
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
