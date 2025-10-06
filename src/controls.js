import { CAMERA_CONFIG, ROOM_CONFIG, ENTRANCE_CONFIG } from './config.js';

export function setupCameraControls(camera) {
    const keys = {};
    let cameraRotation = 0;
    const moveSpeed = 0.1;
    const collisionMargin = 0.5; // Distance from wall to stop

    window.addEventListener('keydown', (e) => {
        keys[e.key.toLowerCase()] = true;
    });

    window.addEventListener('keyup', (e) => {
        keys[e.key.toLowerCase()] = false;
    });

    function checkCollision(newX, newZ) {
        const roomBoundary = ROOM_CONFIG.size / 2 - collisionMargin;

        // Check left wall with entrance exception
        if (newX < -roomBoundary) {
            // Check if in entrance area
            const entranceMinZ = ENTRANCE_CONFIG.zOffset - ENTRANCE_CONFIG.width / 2;
            const entranceMaxZ = ENTRANCE_CONFIG.zOffset + ENTRANCE_CONFIG.width / 2;
            if (newZ >= entranceMinZ && newZ <= entranceMaxZ) {
                return false; // Allow movement through entrance
            }
            return true; // Collision with left wall
        }

        // Check right wall
        if (newX > roomBoundary) {
            return true;
        }

        // Check back wall
        if (newZ < -roomBoundary) {
            return true;
        }

        // Check front wall (no wall here, but keep boundary)
        if (newZ > roomBoundary) {
            return true;
        }

        return false; // No collision
    }

    function updateCameraMovement() {
        // Rotate left/right
        if (keys['a']) {
            cameraRotation += CAMERA_CONFIG.rotationSpeed;
        }
        if (keys['d']) {
            cameraRotation -= CAMERA_CONFIG.rotationSpeed;
        }

        // Calculate new position for forward/backward movement
        let newX = camera.position.x;
        let newZ = camera.position.z;

        if (keys['w']) {
            newX += Math.sin(cameraRotation) * moveSpeed;
            newZ += Math.cos(cameraRotation) * moveSpeed;
        }
        if (keys['s']) {
            newX -= Math.sin(cameraRotation) * moveSpeed;
            newZ -= Math.cos(cameraRotation) * moveSpeed;
        }

        // Only update position if no collision
        if (!checkCollision(newX, newZ)) {
            camera.position.x = newX;
            camera.position.z = newZ;
        }

        // Update camera look direction
        const lookDistance = 10;
        const lookX = Math.sin(cameraRotation) * lookDistance;
        const lookZ = Math.cos(cameraRotation) * lookDistance;
        camera.lookAt(
            camera.position.x + lookX,
            camera.position.y,
            camera.position.z + lookZ
        );
    }

    return { updateCameraMovement };
}
