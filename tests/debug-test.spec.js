import { test, expect } from '@playwright/test';

test('debug console output', async ({ page }) => {
    const consoleMessages = [];
    const consoleErrors = [];

    page.on('console', msg => {
        const text = msg.text();
        consoleMessages.push(text);
        console.log('CONSOLE:', text);
        if (msg.type() === 'error') {
            consoleErrors.push(text);
            console.error('ERROR:', text);
        }
    });

    page.on('pageerror', error => {
        console.error('PAGE ERROR:', error.message);
        consoleErrors.push(error.message);
    });

    await page.goto('http://localhost:5173');
    await page.waitForTimeout(3000);

    console.log('\n=== All Console Messages ===');
    consoleMessages.forEach(msg => console.log(msg));

    console.log('\n=== All Errors ===');
    consoleErrors.forEach(err => console.error(err));

    await page.screenshot({ path: 'tests/screenshots/debug-scene.png' });
});
