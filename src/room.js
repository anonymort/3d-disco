import * as THREE from 'three';
import { ROOM_CONFIG, ENTRANCE_CONFIG, DJ_BOOTH_CONFIG, COLORS } from './config.js';

export function createFloor() {
    const floorGeometry = new THREE.PlaneGeometry(ROOM_CONFIG.size, ROOM_CONFIG.size);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: COLORS.floor,
        roughness: 0.9,
        metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.matrixAutoUpdate = false;
    floor.updateMatrix();
    return floor;
}

export function createCeiling() {
    const ceilingGeometry = new THREE.PlaneGeometry(ROOM_CONFIG.size, ROOM_CONFIG.size);
    const ceilingMaterial = new THREE.MeshStandardMaterial({
        color: COLORS.ceiling,
        roughness: 0.3,
        metalness: 0.5
    });
    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceiling.position.y = ROOM_CONFIG.height;
    ceiling.rotation.x = Math.PI / 2;
    ceiling.matrixAutoUpdate = false;
    ceiling.updateMatrix();
    return ceiling;
}

export function createWalls() {
    const wallMaterial = new THREE.MeshStandardMaterial({
        color: COLORS.wall,
        roughness: 0.4,
        metalness: 0.6
    });

    const walls = [];

    // Back wall
    const backWallGeometry = new THREE.PlaneGeometry(ROOM_CONFIG.size, ROOM_CONFIG.height);
    const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    backWall.position.z = -ROOM_CONFIG.size / 2;
    backWall.position.y = ROOM_CONFIG.height / 2;
    backWall.matrixAutoUpdate = false;
    backWall.updateMatrix();
    walls.push(backWall);

    // Right wall
    const rightWallGeometry = new THREE.PlaneGeometry(ROOM_CONFIG.size, ROOM_CONFIG.height);
    const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
    rightWall.position.x = ROOM_CONFIG.size / 2;
    rightWall.position.y = ROOM_CONFIG.height / 2;
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.matrixAutoUpdate = false;
    rightWall.updateMatrix();
    walls.push(rightWall);

    // Left wall with entrance
    const leftWall = createLeftWallWithEntrance(wallMaterial);
    walls.push(leftWall);

    return walls;
}

function createLeftWallWithEntrance(wallMaterial) {
    const leftWallShape = new THREE.Shape();
    leftWallShape.moveTo(-ROOM_CONFIG.size / 2, 0);
    leftWallShape.lineTo(ROOM_CONFIG.size / 2, 0);
    leftWallShape.lineTo(ROOM_CONFIG.size / 2, ROOM_CONFIG.height);
    leftWallShape.lineTo(-ROOM_CONFIG.size / 2, ROOM_CONFIG.height);
    leftWallShape.lineTo(-ROOM_CONFIG.size / 2, 0);

    // Create entrance archway hole - negate zOffset because wall is rotated
    const holePath = new THREE.Path();
    holePath.moveTo(-ENTRANCE_CONFIG.zOffset - ENTRANCE_CONFIG.width / 2, 0);
    holePath.lineTo(-ENTRANCE_CONFIG.zOffset + ENTRANCE_CONFIG.width / 2, 0);
    holePath.lineTo(-ENTRANCE_CONFIG.zOffset + ENTRANCE_CONFIG.width / 2, ENTRANCE_CONFIG.height - 1);
    holePath.quadraticCurveTo(
        -ENTRANCE_CONFIG.zOffset + ENTRANCE_CONFIG.width / 2,
        ENTRANCE_CONFIG.height,
        -ENTRANCE_CONFIG.zOffset,
        ENTRANCE_CONFIG.height
    );
    holePath.quadraticCurveTo(
        -ENTRANCE_CONFIG.zOffset - ENTRANCE_CONFIG.width / 2,
        ENTRANCE_CONFIG.height,
        -ENTRANCE_CONFIG.zOffset - ENTRANCE_CONFIG.width / 2,
        ENTRANCE_CONFIG.height - 1
    );
    holePath.lineTo(-ENTRANCE_CONFIG.zOffset - ENTRANCE_CONFIG.width / 2, 0);
    leftWallShape.holes.push(holePath);

    const leftWallGeometry = new THREE.ShapeGeometry(leftWallShape);
    const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    leftWall.position.x = -ROOM_CONFIG.size / 2;
    leftWall.rotation.y = Math.PI / 2;
    leftWall.matrixAutoUpdate = false;
    leftWall.updateMatrix();

    return leftWall;
}

export function createEntrance() {
    const entranceObjects = [];

    // Entrance tunnel
    const tunnelGeometry = new THREE.BoxGeometry(
        ENTRANCE_CONFIG.tunnelDepth,
        ENTRANCE_CONFIG.height,
        ENTRANCE_CONFIG.width
    );
    const tunnelMaterial = new THREE.MeshStandardMaterial({
        color: COLORS.wall,
        roughness: 0.8,
        metalness: 0.3
    });
    const tunnel = new THREE.Mesh(tunnelGeometry, tunnelMaterial);
    tunnel.position.set(
        -ROOM_CONFIG.size / 2 - ENTRANCE_CONFIG.tunnelDepth / 2,
        ENTRANCE_CONFIG.height / 2,
        ENTRANCE_CONFIG.zOffset
    );
    tunnel.receiveShadow = true;
    entranceObjects.push(tunnel);

    // Archway frame
    const archFrameMaterial = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        roughness: 0.1,
        metalness: 1.0,
        envMapIntensity: 2.0
    });

    const archFrameGeometry = new THREE.TorusGeometry(ENTRANCE_CONFIG.width / 2, 0.15, 16, 32, Math.PI);
    const archFrame = new THREE.Mesh(archFrameGeometry, archFrameMaterial);
    archFrame.position.set(-ROOM_CONFIG.size / 2 + 0.1, ENTRANCE_CONFIG.height - 1, ENTRANCE_CONFIG.zOffset);
    archFrame.rotation.y = Math.PI / 2;
    entranceObjects.push(archFrame);

    // Vertical frames
    const leftFrameGeometry = new THREE.CylinderGeometry(0.15, 0.15, ENTRANCE_CONFIG.height - 1, 16);
    const leftFrame = new THREE.Mesh(leftFrameGeometry, archFrameMaterial);
    leftFrame.position.set(
        -ROOM_CONFIG.size / 2 + 0.1,
        (ENTRANCE_CONFIG.height - 1) / 2,
        ENTRANCE_CONFIG.zOffset - ENTRANCE_CONFIG.width / 2
    );
    entranceObjects.push(leftFrame);

    const rightFrame = new THREE.Mesh(leftFrameGeometry, archFrameMaterial);
    rightFrame.position.set(
        -ROOM_CONFIG.size / 2 + 0.1,
        (ENTRANCE_CONFIG.height - 1) / 2,
        ENTRANCE_CONFIG.zOffset + ENTRANCE_CONFIG.width / 2
    );
    entranceObjects.push(rightFrame);

    // Steps
    for (let i = 0; i < ENTRANCE_CONFIG.stepCount; i++) {
        const stepGeometry = new THREE.BoxGeometry(
            ENTRANCE_CONFIG.stepDepth,
            ENTRANCE_CONFIG.stepHeight,
            ENTRANCE_CONFIG.stepWidth
        );
        const stepMaterial = new THREE.MeshStandardMaterial({
            color: 0x2a2a2a,
            roughness: 0.8,
            metalness: 0.2
        });
        const step = new THREE.Mesh(stepGeometry, stepMaterial);
        step.position.set(
            -ROOM_CONFIG.size / 2 - ENTRANCE_CONFIG.tunnelDepth - (i * ENTRANCE_CONFIG.stepDepth),
            ENTRANCE_CONFIG.stepHeight / 2 + (ENTRANCE_CONFIG.stepCount - 1 - i) * ENTRANCE_CONFIG.stepHeight,
            ENTRANCE_CONFIG.zOffset
        );
        step.castShadow = true;
        step.receiveShadow = true;
        entranceObjects.push(step);
    }

    // Exit sign
    const signWidth = 2.5;
    const signHeight = 0.6;
    const signDepth = 0.1;

    const signGeometry = new THREE.BoxGeometry(signWidth, signHeight, signDepth);
    const signMaterial = new THREE.MeshStandardMaterial({
        color: 0x00aa00,
        emissive: 0x00ff00,
        emissiveIntensity: 1.5,
        roughness: 0.3,
        metalness: 0.1
    });
    const exitSign = new THREE.Mesh(signGeometry, signMaterial);
    exitSign.position.set(-ROOM_CONFIG.size / 2 + 0.15, ENTRANCE_CONFIG.height + 1.8, ENTRANCE_CONFIG.zOffset);
    exitSign.rotation.y = Math.PI / 2;
    entranceObjects.push(exitSign);

    // Exit text
    const exitTextGroup = createExitText();
    exitTextGroup.position.copy(exitSign.position);
    exitTextGroup.rotation.y = Math.PI / 2;
    entranceObjects.push(exitTextGroup);

    return entranceObjects;
}

function createExitText() {
    const textMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 2
    });

    const exitTextGroup = new THREE.Group();

    const letters = [
        { width: 0.3, x: -0.7 },
        { width: 0.3, x: -0.25 },
        { width: 0.15, x: 0.15 },
        { width: 0.3, x: 0.6 }
    ];

    letters.forEach(letter => {
        const letterGeo = new THREE.PlaneGeometry(letter.width, 0.4);
        const letterMesh = new THREE.Mesh(letterGeo, textMaterial);
        letterMesh.position.set(letter.x, 0, 0.06);
        exitTextGroup.add(letterMesh);
    });

    return exitTextGroup;
}

export function createDJBooth() {
    const djBoothObjects = [];

    // DJ booth base
    const djBoothGeometry = new THREE.BoxGeometry(
        DJ_BOOTH_CONFIG.width,
        DJ_BOOTH_CONFIG.height,
        DJ_BOOTH_CONFIG.depth
    );
    const djBoothMaterial = new THREE.MeshStandardMaterial({
        color: COLORS.wall,
        roughness: 0.3,
        metalness: 0.7
    });
    const djBooth = new THREE.Mesh(djBoothGeometry, djBoothMaterial);
    djBooth.position.set(
        0,
        DJ_BOOTH_CONFIG.height / 2,
        -ROOM_CONFIG.size / 2 + DJ_BOOTH_CONFIG.depth / 2 + 0.1
    );
    djBooth.receiveShadow = true;
    djBooth.castShadow = true;
    djBoothObjects.push(djBooth);

    // DJ booth LED strip
    const djLEDGeometry = new THREE.BoxGeometry(
        DJ_BOOTH_CONFIG.width - 0.2,
        0.1,
        DJ_BOOTH_CONFIG.depth + 0.2
    );
    const djLEDMaterial = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 2,
        roughness: 0.1,
        metalness: 0.3
    });
    const djLED = new THREE.Mesh(djLEDGeometry, djLEDMaterial);
    djLED.position.set(
        0,
        DJ_BOOTH_CONFIG.height,
        -ROOM_CONFIG.size / 2 + DJ_BOOTH_CONFIG.depth / 2 + 0.1
    );
    djBoothObjects.push(djLED);

    return djBoothObjects;
}

export function createSpeakers() {
    function createSpeaker(x, z) {
        const speakerGroup = new THREE.Group();

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

        // Speaker cones
        const coneGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 16); // Reduced from 32
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

        const cone2 = new THREE.Mesh(coneGeometry, coneMaterial);
        cone2.position.y = 0.7;
        cone2.position.z = 0.61;
        cone2.rotation.x = Math.PI / 2;
        speakerGroup.add(cone2);

        // LED indicator
        const ledGeometry = new THREE.CircleGeometry(0.1, 8); // Reduced from 16
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

    const leftSpeaker = createSpeaker(-ROOM_CONFIG.size / 2 + 1.5, -ROOM_CONFIG.size / 2 + 1);
    const rightSpeaker = createSpeaker(ROOM_CONFIG.size / 2 - 1.5, -ROOM_CONFIG.size / 2 + 1);

    return [leftSpeaker, rightSpeaker];
}
