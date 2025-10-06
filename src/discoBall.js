import * as THREE from 'three';
import { DISCO_BALL_CONFIG } from './config.js';

export function createDiscoBall() {
    const discoBallGroup = new THREE.Group();
    const discoBallFacets = [];

    // Create base sphere
    const baseSphereGeometry = new THREE.SphereGeometry(
        DISCO_BALL_CONFIG.radius * 0.98,
        64,
        64
    );
    const baseSphereMaterial = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.9,
        metalness: 0.1
    });
    const baseSphere = new THREE.Mesh(baseSphereGeometry, baseSphereMaterial);
    discoBallGroup.add(baseSphere);

    // Add mirror tiles in a grid pattern
    for (let row = 0; row < DISCO_BALL_CONFIG.rows; row++) {
        const phi = (row / DISCO_BALL_CONFIG.rows) * Math.PI;
        const rowRadius = Math.sin(phi) * DISCO_BALL_CONFIG.radius;
        const tilesInThisRow = Math.max(
            3,
            Math.floor(DISCO_BALL_CONFIG.tilesPerRow * Math.sin(phi))
        );

        for (let tile = 0; tile < tilesInThisRow; tile++) {
            const theta = (tile / tilesInThisRow) * Math.PI * 2;

            // Position on sphere
            const x = rowRadius * Math.cos(theta);
            const y = DISCO_BALL_CONFIG.radius * Math.cos(phi);
            const z = rowRadius * Math.sin(theta);

            // Create mirror tile
            const facetGeometry = new THREE.PlaneGeometry(
                DISCO_BALL_CONFIG.tileSize,
                DISCO_BALL_CONFIG.tileSize
            );
            const facetMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                roughness: DISCO_BALL_CONFIG.material.roughness,
                metalness: DISCO_BALL_CONFIG.material.metalness,
                emissive: 0xffffff,
                emissiveIntensity: DISCO_BALL_CONFIG.material.emissiveIntensity,
                envMapIntensity: DISCO_BALL_CONFIG.material.envMapIntensity
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
                baseIntensity: DISCO_BALL_CONFIG.material.emissiveIntensity
            });
        }
    }

    discoBallGroup.position.set(
        DISCO_BALL_CONFIG.position.x,
        DISCO_BALL_CONFIG.position.y,
        DISCO_BALL_CONFIG.position.z
    );

    return { group: discoBallGroup, facets: discoBallFacets };
}
