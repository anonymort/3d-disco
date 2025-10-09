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
    animateCornerNeonLights
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

const { mesh: ceilingPanelsMesh, currentColors: ceilingCurrentColors, targetColors: ceilingTargetColors, currentIntensities: ceilingCurrentIntensities, targetIntensities: ceilingTargetIntensities, panelCount: ceilingPanelCount } = createCeilingPanels();
scene.add(ceilingPanelsMesh);

const { mesh: backWallPanelsMesh, currentColors: backWallCurrentColors, targetColors: backWallTargetColors, panelCount: backWallPanelCount } = createBackWallPanels();
scene.add(backWallPanelsMesh);

const { mesh: cornerNeonMesh, currentColors: neonCurrentColors, targetColors: neonTargetColors, neonCount: cornerNeonCount } = createCornerNeonLights();
scene.add(cornerNeonMesh);

// Create disco ball
const { group: discoBallGroup, instancedFacets: discoBallInstancedFacets, facetCount: discoBallFacetCount, baseIntensity: discoBallBaseIntensity } = createDiscoBall();
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

// Setup audio
const { audioContext, masterGain } = createAudioSystem();
startBeat(audioContext, masterGain);

// Setup controls
const { updateCameraMovement } = setupCameraControls(camera);

// Animation loop
let time = 0;
let frameCount = 0;

function animate() {
    requestAnimationFrame(animate);

    time += 16; // Approximate milliseconds per frame
    frameCount++;

    updateCameraMovement();

    // Animate disco ball and core elements every frame
    animateDiscoBall(discoBallGroup, discoBallInstancedFacets, discoBallFacetCount, discoBallBaseIntensity, time);
    animateSpotlights(spotlights, discoBallGroup, time);
    animateLaserBeams(laserBeams, time);

    // Animate lights and panels every other frame
    if (frameCount % 2 === 0) {
        animateDanceFloor(danceFloorTiles);
        animatePointLights(pointLights, time);
        animateCeilingPanels(ceilingPanelsMesh, ceilingCurrentColors, ceilingTargetColors, ceilingCurrentIntensities, ceilingTargetIntensities, ceilingPanelCount);
        animateBackWallPanels(backWallPanelsMesh, backWallCurrentColors, backWallTargetColors, backWallPanelCount);
        animateCornerNeonLights(cornerNeonMesh, neonCurrentColors, neonTargetColors, cornerNeonCount);
    }

    composer.render();
}

console.log('Starting animation loop...');
animate();
console.log('Animation loop started');
