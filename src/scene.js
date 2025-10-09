import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { CAMERA_CONFIG, RENDERER_CONFIG, BLOOM_CONFIG, COLORS } from './config.js';

export function createScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(COLORS.background);
    scene.fog = new THREE.FogExp2(COLORS.fog, 0.03);
    return scene;
}

export function createCamera() {
    const camera = new THREE.PerspectiveCamera(
        CAMERA_CONFIG.fov,
        window.innerWidth / window.innerHeight,
        CAMERA_CONFIG.near,
        CAMERA_CONFIG.far
    );
    camera.position.set(
        CAMERA_CONFIG.initialPosition.x,
        CAMERA_CONFIG.initialPosition.y,
        CAMERA_CONFIG.initialPosition.z
    );
    return camera;
}

export function createRenderer() {
    const renderer = new THREE.WebGLRenderer({
        antialias: RENDERER_CONFIG.antialias,
        powerPreference: 'high-performance', // Use dedicated GPU
        stencil: false, // Disable stencil buffer if not needed
        depth: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap at 2x for performance
    renderer.shadowMap.enabled = false; // Disable shadows for performance
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = RENDERER_CONFIG.toneMappingExposure;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    return renderer;
}

export function createComposer(renderer, scene, camera) {
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // Use 50% resolution for bloom to improve performance
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth * 0.5, window.innerHeight * 0.5),
        BLOOM_CONFIG.strength,
        BLOOM_CONFIG.radius,
        BLOOM_CONFIG.threshold
    );
    composer.addPass(bloomPass);

    return composer;
}

export function setupResizeHandler(camera, renderer, composer) {
    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        composer.setSize(width, height);
    });
}
