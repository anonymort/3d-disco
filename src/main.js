import * as THREE from 'three';
import { createScene, createCamera, createRenderer, createComposer, setupResizeHandler } from './scene.js';
import { createFloor, createCeiling, createWalls, createEntrance, createDJBooth, createSpeakers } from './room.js';
import { createDanceFloor } from './danceFloor.js';
import {
    createBasicLights,
    createCeilingPanels,
    createBackWallPanels,
    createCornerNeonLights,
    createSpotlights,
    createPointLights,
    createLaserBeams
} from './lights.js';
import { createDiscoBall } from './discoBall.js';
import { createParticleSystem } from './particles.js';
import { createAudioSystem, startBeat } from './audio.js';
import { setupCameraControls } from './controls.js';
import {
    animateDanceFloor,
    animateDiscoBall,
    animateSpotlights,
    animatePointLights,
    animateCeilingPanels,
    animateLaserBeams,
    animateBackWallPanels,
    animateCornerNeonLights,
    animateParticles
} from './animations.js';

console.log('Three.js loaded:', THREE.REVISION);

// Scene setup
const scene = createScene();
const camera = createCamera();
const renderer = createRenderer();
const composer = createComposer(renderer, scene, camera);

document.body.appendChild(renderer.domElement);
console.log('Canvas appended to body');

// Setup resize handler
setupResizeHandler(camera, renderer, composer);

// Create room
const floor = createFloor();
scene.add(floor);

const ceiling = createCeiling();
scene.add(ceiling);

const walls = createWalls();
walls.forEach(wall => scene.add(wall));

const entranceObjects = createEntrance();
entranceObjects.forEach(obj => scene.add(obj));

const djBoothObjects = createDJBooth();
djBoothObjects.forEach(obj => scene.add(obj));

const speakers = createSpeakers();
speakers.forEach(speaker => scene.add(speaker));

// Create dance floor
const { group: danceFloorGroup, tiles: danceFloorTiles } = createDanceFloor();
scene.add(danceFloorGroup);

// Create lights
const basicLights = createBasicLights();
basicLights.forEach(light => scene.add(light));

const ceilingPanels = createCeilingPanels();
ceilingPanels.forEach(panel => scene.add(panel.mesh));

const backWallPanels = createBackWallPanels();
backWallPanels.forEach(panel => scene.add(panel.mesh));

const cornerNeonLights = createCornerNeonLights();
cornerNeonLights.forEach(neon => scene.add(neon.mesh));

// Create disco ball
const { group: discoBallGroup, facets: discoBallFacets } = createDiscoBall();
scene.add(discoBallGroup);

// Create spotlights (requires disco ball position)
const spotlights = createSpotlights(discoBallGroup);
spotlights.forEach(spotlight => {
    scene.add(spotlight.light);
    scene.add(spotlight.target);
});

const pointLights = createPointLights();
pointLights.forEach(pointLight => scene.add(pointLight.light));

const laserBeams = createLaserBeams();
laserBeams.forEach(laser => scene.add(laser.mesh));

// Create particles
const { system: particleSystem, velocities: particleVelocities } = createParticleSystem();
scene.add(particleSystem);

// Setup audio
const { audioContext, masterGain } = createAudioSystem();
startBeat(audioContext, masterGain);

// Setup controls
const { updateCameraMovement } = setupCameraControls(camera);

// Animation loop
let time = 0;

function animate() {
    requestAnimationFrame(animate);

    time += 16; // Approximate milliseconds per frame

    updateCameraMovement();
    animateDanceFloor(danceFloorTiles);
    animateDiscoBall(discoBallGroup, discoBallFacets, time);
    animateSpotlights(spotlights, discoBallGroup, time);
    animatePointLights(pointLights, time);
    animateCeilingPanels(ceilingPanels);
    animateLaserBeams(laserBeams, time);
    animateBackWallPanels(backWallPanels);
    animateCornerNeonLights(cornerNeonLights);
    animateParticles(particleSystem, particleVelocities);

    composer.render();
}

console.log('Starting animation loop...');
animate();
console.log('Animation loop started');
