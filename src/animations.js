import * as THREE from 'three';
import { ROOM_CONFIG, DANCE_FLOOR_CONFIG, AUDIO_CONFIG, PARTICLE_CONFIG, LIGHTING_CONFIG } from './config.js';

export function animateDanceFloor(danceFloorTiles) {
    for (let i = 0; i < danceFloorTiles.length; i++) {
        const tile = danceFloorTiles[i];

        // Random color changes
        if (Math.random() < 0.01) {
            const colors = DANCE_FLOOR_CONFIG.tileColors;
            tile.targetColor.setHex(colors[Math.floor(Math.random() * colors.length)]);
        }

        // Interpolate color smoothly
        tile.currentColor.lerp(tile.targetColor, 0.1);
        tile.material.color.copy(tile.currentColor);
        tile.material.emissive.copy(tile.currentColor);
        tile.material.emissiveIntensity = DANCE_FLOOR_CONFIG.tileMaterial.emissiveIntensity;
    }
}

export function animateDiscoBall(discoBall, discoBallFacets, time) {
    // Rotate disco ball
    discoBall.rotation.y += 0.01;

    // Animate disco ball facets for sparkle effect
    const beatPhase = (time % AUDIO_CONFIG.beatInterval) / AUDIO_CONFIG.beatInterval;
    discoBallFacets.forEach((facet, index) => {
        const beatPulse = Math.sin(beatPhase * Math.PI) * 0.5;
        const sparkle = Math.sin(time * 0.005 + index * 0.1) * 0.5 + 0.5;
        facet.material.emissiveIntensity = facet.baseIntensity + (sparkle + beatPulse) * 0.5;
    });
}

export function animateSpotlights(spotlights, discoBall, time) {
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
}

export function animatePointLights(pointLights, time) {
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
        const angle = (index / LIGHTING_CONFIG.pointLights.count) * Math.PI * 2 + time * 0.0005;
        pointLight.light.position.x = Math.cos(angle) * pointLight.radius;
        pointLight.light.position.z = Math.sin(angle) * pointLight.radius;
    });
}

export function animateCeilingPanels(ceilingPanels) {
    ceilingPanels.forEach((panel) => {
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
}

export function animateLaserBeams(laserBeams, time) {
    laserBeams.forEach((laser, index) => {
        // Rotate laser beams around the room
        laser.angle += laser.rotationSpeed;
        laser.mesh.position.x = Math.cos(laser.angle) * laser.radius;
        laser.mesh.position.z = Math.sin(laser.angle) * laser.radius;

        // Slight rotation for scanning effect
        laser.mesh.rotation.z = Math.sin(time * 0.001 + index) * 0.3;
    });
}

export function animateBackWallPanels(backWallPanels) {
    backWallPanels.forEach((panel) => {
        if (Math.random() < 0.015) {
            const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
            panel.targetColor.setHex(colors[Math.floor(Math.random() * colors.length)]);
        }

        panel.currentColor.lerp(panel.targetColor, 0.05);
        panel.material.color.copy(panel.currentColor);
        panel.material.emissive.copy(panel.currentColor);
    });
}

export function animateCornerNeonLights(cornerNeonLights) {
    // All corner neons sync to same color
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
}

export function animateParticles(particleSystem, particleVelocities) {
    const positions = particleSystem.geometry.attributes.position.array;

    for (let i = 0; i < PARTICLE_CONFIG.count; i++) {
        positions[i * 3] += particleVelocities[i].x;
        positions[i * 3 + 1] += particleVelocities[i].y;
        positions[i * 3 + 2] += particleVelocities[i].z;

        // Wrap around room boundaries
        if (Math.abs(positions[i * 3]) > ROOM_CONFIG.size / 2) particleVelocities[i].x *= -1;
        if (positions[i * 3 + 1] > ROOM_CONFIG.height || positions[i * 3 + 1] < 0) particleVelocities[i].y *= -1;
        if (Math.abs(positions[i * 3 + 2]) > ROOM_CONFIG.size / 2) particleVelocities[i].z *= -1;
    }

    particleSystem.geometry.attributes.position.needsUpdate = true;
}
