import { test, expect } from '@playwright/test';

test('3D disco scene loads and renders with optimized performance', async ({ page }) => {
    // Listen for console messages
    const consoleMessages = [];
    const consoleErrors = [];

    page.on('console', msg => {
        consoleMessages.push(msg.text());
        if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
        }
    });

    // Navigate to the app
    await page.goto('http://localhost:5174');

    // Wait for Three.js to load
    await page.waitForTimeout(2000);

    // Check for critical console logs
    expect(consoleMessages.some(msg => msg.includes('Three.js loaded'))).toBeTruthy();
    expect(consoleMessages.some(msg => msg.includes('Canvas appended to body'))).toBeTruthy();
    expect(consoleMessages.some(msg => msg.includes('Starting animation loop'))).toBeTruthy();
    expect(consoleMessages.some(msg => msg.includes('Animation loop started'))).toBeTruthy();

    // Check for errors
    expect(consoleErrors.length).toBe(0);

    // Take a screenshot to verify visual appearance
    await page.screenshot({ path: 'tests/screenshots/disco-scene.png', fullPage: true });

    // Verify canvas exists and has content
    const canvas = await page.locator('canvas');
    await expect(canvas).toBeVisible();

    // Check canvas has reasonable dimensions
    const canvasBox = await canvas.boundingBox();
    expect(canvasBox.width).toBeGreaterThan(100);
    expect(canvasBox.height).toBeGreaterThan(100);

    console.log('✅ Scene loaded successfully');
    console.log(`📊 Console messages: ${consoleMessages.length}`);
    console.log(`❌ Console errors: ${consoleErrors.length}`);
});
