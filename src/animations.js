import * as THREE from 'three';
import { DANCE_FLOOR_CONFIG, AUDIO_CONFIG, LIGHTING_CONFIG } from './config.js';

export function animateDanceFloor(instancedTiles, currentColors, targetColors, tileCount) {
    const color = new THREE.Color();
    const brightness = 3.0; // Much brighter for visibility

    for (let i = 0; i < tileCount; i++) {
        // Random color changes
        if (Math.random() < 0.01) {
            const colors = DANCE_FLOOR_CONFIG.tileColors;
            const newColor = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);
            targetColors[i * 3] = newColor.r * brightness;
            targetColors[i * 3 + 1] = newColor.g * brightness;
            targetColors[i * 3 + 2] = newColor.b * brightness;
        }

        // Interpolate color smoothly
        currentColors[i * 3] += (targetColors[i * 3] - currentColors[i * 3]) * 0.1;
        currentColors[i * 3 + 1] += (targetColors[i * 3 + 1] - currentColors[i * 3 + 1]) * 0.1;
        currentColors[i * 3 + 2] += (targetColors[i * 3 + 2] - currentColors[i * 3 + 2]) * 0.1;

        // Set instance color
        color.setRGB(currentColors[i * 3], currentColors[i * 3 + 1], currentColors[i * 3 + 2]);
        instancedTiles.setColorAt(i, color);
    }

    instancedTiles.instanceColor.needsUpdate = true;
}

export function animateDiscoBall(discoBallGroup, instancedFacets, facetCount, baseIntensity, time) {
    // Rotate disco ball
    discoBallGroup.rotation.y += 0.01;

    // Animate disco ball facets for sparkle effect using color variation
    const beatPhase = (time % AUDIO_CONFIG.beatInterval) / AUDIO_CONFIG.beatInterval;
    const beatPulse = Math.sin(beatPhase * Math.PI) * 0.5;

    // Update color based on sparkle effect
    const color = new THREE.Color();
    const sparkleOffsets = instancedFacets.geometry.attributes.sparkleOffset.array;

    for (let i = 0; i < facetCount; i++) {
        const sparkle = Math.sin(time * 0.005 + sparkleOffsets[i]) * 0.5 + 0.5;
        const intensity = baseIntensity + (sparkle + beatPulse) * 0.5;

        // Vary brightness by changing color intensity
        const brightness = 0.5 + intensity * 0.5;
        color.setRGB(brightness, brightness, brightness);
        instancedFacets.setColorAt(i, color);
    }

    instancedFacets.instanceColor.needsUpdate = true;
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

export function animateCeilingPanels(instancedPanels, currentColors, targetColors, currentIntensities, targetIntensities, panelCount) {
    const color = new THREE.Color();

    for (let i = 0; i < panelCount; i++) {
        // Change color randomly
        if (Math.random() < 0.02) {
            const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
            const newColor = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);
            targetColors[i * 3] = newColor.r;
            targetColors[i * 3 + 1] = newColor.g;
            targetColors[i * 3 + 2] = newColor.b;
            targetIntensities[i] = Math.random() * 2 + 1;
        }

        // Interpolate color and intensity
        currentColors[i * 3] += (targetColors[i * 3] - currentColors[i * 3]) * 0.05;
        currentColors[i * 3 + 1] += (targetColors[i * 3 + 1] - currentColors[i * 3 + 1]) * 0.05;
        currentColors[i * 3 + 2] += (targetColors[i * 3 + 2] - currentColors[i * 3 + 2]) * 0.05;
        currentIntensities[i] += (targetIntensities[i] - currentIntensities[i]) * 0.05;

        // Apply intensity to color
        const intensity = currentIntensities[i];
        color.setRGB(
            currentColors[i * 3] * intensity,
            currentColors[i * 3 + 1] * intensity,
            currentColors[i * 3 + 2] * intensity
        );
        instancedPanels.setColorAt(i, color);
    }

    instancedPanels.instanceColor.needsUpdate = true;
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

export function animateBackWallPanels(instancedPanels, currentColors, targetColors, panelCount) {
    const color = new THREE.Color();

    for (let i = 0; i < panelCount; i++) {
        if (Math.random() < 0.015) {
            const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
            const newColor = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);
            targetColors[i * 3] = newColor.r;
            targetColors[i * 3 + 1] = newColor.g;
            targetColors[i * 3 + 2] = newColor.b;
        }

        currentColors[i * 3] += (targetColors[i * 3] - currentColors[i * 3]) * 0.05;
        currentColors[i * 3 + 1] += (targetColors[i * 3 + 1] - currentColors[i * 3 + 1]) * 0.05;
        currentColors[i * 3 + 2] += (targetColors[i * 3 + 2] - currentColors[i * 3 + 2]) * 0.05;

        color.setRGB(currentColors[i * 3], currentColors[i * 3 + 1], currentColors[i * 3 + 2]);
        instancedPanels.setColorAt(i, color);
    }

    instancedPanels.instanceColor.needsUpdate = true;
}

export function animateCornerNeonLights(instancedNeons, currentColors, targetColors, neonCount) {
    const color = new THREE.Color();

    // All corner neons sync to same color
    if (Math.random() < 0.015) {
        const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
        const newColor = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);
        const intensity = 2.5;

        for (let i = 0; i < neonCount; i++) {
            targetColors[i * 3] = newColor.r * intensity;
            targetColors[i * 3 + 1] = newColor.g * intensity;
            targetColors[i * 3 + 2] = newColor.b * intensity;
        }
    }

    for (let i = 0; i < neonCount; i++) {
        currentColors[i * 3] += (targetColors[i * 3] - currentColors[i * 3]) * 0.05;
        currentColors[i * 3 + 1] += (targetColors[i * 3 + 1] - currentColors[i * 3 + 1]) * 0.05;
        currentColors[i * 3 + 2] += (targetColors[i * 3 + 2] - currentColors[i * 3 + 2]) * 0.05;

        color.setRGB(currentColors[i * 3], currentColors[i * 3 + 1], currentColors[i * 3 + 2]);
        instancedNeons.setColorAt(i, color);
    }

    instancedNeons.instanceColor.needsUpdate = true;
}
