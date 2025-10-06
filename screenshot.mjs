import { chromium } from '@playwright/test';

async function captureScreenshots() {
    console.log('Launching browser...');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    console.log('Setting viewport...');
    await page.setViewportSize({ width: 1920, height: 1080 });

    console.log('Navigating to disco app...');
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle' });

    // Wait for the page to load and render
    console.log('Waiting for scene to render...');
    await page.waitForTimeout(3000);

    // Take a single screenshot
    console.log('Taking screenshot...');
    await page.screenshot({
        path: 'disco-screenshot.png',
        fullPage: false,
        timeout: 60000
    });
    console.log('Screenshot saved as disco-screenshot.png');

    await browser.close();
    console.log('Done!');
}

captureScreenshots().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
