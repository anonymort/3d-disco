import * as THREE from 'three';
import { ROOM_CONFIG, DANCE_FLOOR_CONFIG } from './config.js';

export function createDanceFloor() {
    const danceFloorSize = ROOM_CONFIG.size;
    const tileSize = danceFloorSize / DANCE_FLOOR_CONFIG.gridSize;
    const totalTiles = DANCE_FLOOR_CONFIG.gridSize * DANCE_FLOOR_CONFIG.gridSize;

    // Create InstancedMesh for all tiles
    const tileGeometry = new THREE.PlaneGeometry(tileSize * 0.9, tileSize * 0.9);

    // Use MeshBasicMaterial for better performance (emissive effect doesn't need lighting)
    const tileMaterial = new THREE.MeshBasicMaterial({
        vertexColors: true,
        toneMapped: false // Prevent tone mapping from darkening bright colors
    });

    const instancedTiles = new THREE.InstancedMesh(
        tileGeometry,
        tileMaterial,
        totalTiles
    );
    instancedTiles.receiveShadow = true;

    // Important: Must set count property for InstancedMesh to render
    instancedTiles.count = totalTiles;

    // Set up instances and color data
    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();
    quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);

    // Arrays to store tile color data
    const currentColors = new Float32Array(totalTiles * 3);
    const targetColors = new Float32Array(totalTiles * 3);

    let index = 0;
    for (let i = 0; i < DANCE_FLOOR_CONFIG.gridSize; i++) {
        for (let j = 0; j < DANCE_FLOOR_CONFIG.gridSize; j++) {
            const x = (i - DANCE_FLOOR_CONFIG.gridSize / 2) * tileSize + tileSize / 2;
            const z = (j - DANCE_FLOOR_CONFIG.gridSize / 2) * tileSize + tileSize / 2;

            matrix.compose(
                new THREE.Vector3(x, 0.01, z),
                quaternion,
                new THREE.Vector3(1, 1, 1)
            );
            instancedTiles.setMatrixAt(index, matrix);

            // Set random initial color with emissive brightness
            const randomColor = DANCE_FLOOR_CONFIG.tileColors[
                Math.floor(Math.random() * DANCE_FLOOR_CONFIG.tileColors.length)
            ];
            const color = new THREE.Color(randomColor);

            // Boost brightness significantly to simulate emissive effect
            const brightness = 3.0; // Much brighter for visibility

            currentColors[index * 3] = color.r * brightness;
            currentColors[index * 3 + 1] = color.g * brightness;
            currentColors[index * 3 + 2] = color.b * brightness;

            targetColors[index * 3] = color.r * brightness;
            targetColors[index * 3 + 1] = color.g * brightness;
            targetColors[index * 3 + 2] = color.b * brightness;

            instancedTiles.setColorAt(index, new THREE.Color(color.r * brightness, color.g * brightness, color.b * brightness));
            index++;
        }
    }

    instancedTiles.instanceMatrix.needsUpdate = true;
    instancedTiles.instanceColor.needsUpdate = true;

    return {
        mesh: instancedTiles,
        currentColors: currentColors,
        targetColors: targetColors,
        tileCount: totalTiles
    };
}
