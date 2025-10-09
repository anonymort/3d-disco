import * as THREE from 'three';
import { DISCO_BALL_CONFIG } from './config.js';

export function createDiscoBall() {
    const discoBallGroup = new THREE.Group();

    // Create base sphere
    const baseSphereGeometry = new THREE.SphereGeometry(
        DISCO_BALL_CONFIG.radius * 0.98,
        32,
        32
    );
    const baseSphereMaterial = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.9,
        metalness: 0.1
    });
    const baseSphere = new THREE.Mesh(baseSphereGeometry, baseSphereMaterial);
    discoBallGroup.add(baseSphere);

    // Calculate total number of facets
    let totalFacets = 0;
    const facetData = [];

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

            // Calculate rotation to face outward
            const normal = new THREE.Vector3(x, y, z).normalize();
            const quaternion = new THREE.Quaternion();
            const targetPos = normal.clone().multiplyScalar(100);
            const tempObj = new THREE.Object3D();
            tempObj.position.set(x, y, z);
            tempObj.lookAt(targetPos);
            tempObj.getWorldQuaternion(quaternion);

            facetData.push({
                position: new THREE.Vector3(x, y, z),
                quaternion: quaternion,
                sparkleOffset: tile * 0.1 + row * 0.05
            });
            totalFacets++;
        }
    }

    // Create single InstancedMesh for all facets
    const facetGeometry = new THREE.PlaneGeometry(
        DISCO_BALL_CONFIG.tileSize,
        DISCO_BALL_CONFIG.tileSize
    );

    // Use MeshBasicMaterial for better performance (no lighting calculations)
    const facetMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        toneMapped: false
    });

    const instancedFacets = new THREE.InstancedMesh(
        facetGeometry,
        facetMaterial,
        totalFacets
    );
    instancedFacets.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(totalFacets * 3), 3);

    // Set up instances
    const matrix = new THREE.Matrix4();
    const sparkleOffsets = new Float32Array(totalFacets);

    facetData.forEach((data, i) => {
        matrix.compose(data.position, data.quaternion, new THREE.Vector3(1, 1, 1));
        instancedFacets.setMatrixAt(i, matrix);
        sparkleOffsets[i] = data.sparkleOffset;
    });

    // Store sparkle offsets as instance attribute
    instancedFacets.geometry.setAttribute(
        'sparkleOffset',
        new THREE.InstancedBufferAttribute(sparkleOffsets, 1)
    );

    instancedFacets.instanceMatrix.needsUpdate = true;
    instancedFacets.instanceColor.needsUpdate = true;
    discoBallGroup.add(instancedFacets);

    discoBallGroup.position.set(
        DISCO_BALL_CONFIG.position.x,
        DISCO_BALL_CONFIG.position.y,
        DISCO_BALL_CONFIG.position.z
    );

    return {
        group: discoBallGroup,
        instancedFacets: instancedFacets,
        facetCount: totalFacets,
        baseIntensity: DISCO_BALL_CONFIG.material.emissiveIntensity
    };
}
