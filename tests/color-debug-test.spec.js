import { test } from '@playwright/test';

test('debug instance colors', async ({ page }) => {
    page.on('console', msg => console.log('CONSOLE:', msg.text()));

    await page.goto('http://localhost:5174');
    await page.waitForTimeout(2000);

    // Execute JavaScript to check if instanceColor is set
    const debugInfo = await page.evaluate(() => {
        const scene = window.scene || document.querySelector('canvas')?.__three_scene__;
        if (!scene) return { error: 'No scene found' };

        let danceFloorInfo = null;
        scene.traverse((obj) => {
            if (obj.isInstancedMesh && obj.count === 400) {
                danceFloorInfo = {
                    count: obj.count,
                    hasInstanceColor: !!obj.instanceColor,
                    instanceColorLength: obj.instanceColor?.array?.length,
                    materialType: obj.material.type,
                    vertexColors: obj.material.vertexColors,
                    firstColors: obj.instanceColor ? [
                        obj.instanceColor.array[0],
                        obj.instanceColor.array[1],
                        obj.instanceColor.array[2]
                    ] : null
                };
            }
        });

        return { danceFloorInfo };
    });

    console.log('=== Debug Info ===');
    console.log(JSON.stringify(debugInfo, null, 2));
});
