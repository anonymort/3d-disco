import * as THREE from 'three';
import { ROOM_CONFIG, DANCE_FLOOR_CONFIG } from './config.js';

export function createDanceFloor() {
    const danceFloorGroup = new THREE.Group();
    const danceFloorTiles = [];

    const danceFloorSize = ROOM_CONFIG.size;
    const tileSize = danceFloorSize / DANCE_FLOOR_CONFIG.gridSize;

    // Share single geometry for all tiles (major performance boost)
    const sharedTileGeometry = new THREE.PlaneGeometry(tileSize * 0.9, tileSize * 0.9);

    for (let i = 0; i < DANCE_FLOOR_CONFIG.gridSize; i++) {
        for (let j = 0; j < DANCE_FLOOR_CONFIG.gridSize; j++) {
            const randomColor = DANCE_FLOOR_CONFIG.tileColors[
                Math.floor(Math.random() * DANCE_FLOOR_CONFIG.tileColors.length)
            ];

            const tileMaterial = new THREE.MeshStandardMaterial({
                color: randomColor,
                roughness: DANCE_FLOOR_CONFIG.tileMaterial.roughness,
                metalness: DANCE_FLOOR_CONFIG.tileMaterial.metalness,
                emissive: randomColor,
                emissiveIntensity: DANCE_FLOOR_CONFIG.tileMaterial.emissiveIntensity,
                envMapIntensity: DANCE_FLOOR_CONFIG.tileMaterial.envMapIntensity
            });

            const tile = new THREE.Mesh(sharedTileGeometry, tileMaterial);
            tile.position.set(
                (i - DANCE_FLOOR_CONFIG.gridSize / 2) * tileSize + tileSize / 2,
                0.01,
                (j - DANCE_FLOOR_CONFIG.gridSize / 2) * tileSize + tileSize / 2
            );
            tile.rotation.x = -Math.PI / 2;
            tile.receiveShadow = true;
            tile.matrixAutoUpdate = false; // Static object - disable matrix updates
            tile.updateMatrix();

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

    return { group: danceFloorGroup, tiles: danceFloorTiles };
}
