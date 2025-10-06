import * as THREE from 'three';
import { ROOM_CONFIG, PARTICLE_CONFIG, LASER_CONFIG } from './config.js';

export function createParticleSystem() {
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(PARTICLE_CONFIG.count * 3);
    const particleVelocities = [];
    const particleColors = new Float32Array(PARTICLE_CONFIG.count * 3);

    for (let i = 0; i < PARTICLE_CONFIG.count; i++) {
        // Random positions within the room
        particlePositions[i * 3] = (Math.random() - 0.5) * ROOM_CONFIG.size * 0.8;
        particlePositions[i * 3 + 1] = Math.random() * ROOM_CONFIG.height * 0.8;
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * ROOM_CONFIG.size * 0.8;

        // Random velocities
        particleVelocities.push({
            x: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 0.5) * 0.02,
            z: (Math.random() - 0.5) * 0.02
        });

        // Random colors
        const colorChoice = Math.floor(Math.random() * LASER_CONFIG.colors.length);
        const color = new THREE.Color(LASER_CONFIG.colors[colorChoice]);
        particleColors[i * 3] = color.r;
        particleColors[i * 3 + 1] = color.g;
        particleColors[i * 3 + 2] = color.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
        size: PARTICLE_CONFIG.size,
        vertexColors: true,
        transparent: true,
        opacity: PARTICLE_CONFIG.opacity,
        blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);

    return { system: particleSystem, velocities: particleVelocities };
}
