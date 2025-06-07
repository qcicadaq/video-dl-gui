const puppeteer = require('puppeteer');

async function detectM3U8(url) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const links = new Set();

    // Capture all network requests and find .m3u8
    page.on('request', (request) => {
        const reqUrl = request.url();
        if (reqUrl.includes('.m3u8')) {
            links.add(reqUrl);
        }
    });

    try {
        await page.goto(url, {
            waitUntil: 'networkidle0', // Wait for the page to be fully loaded
            timeout: 30000,
        });

        // Give time for video players to load stream URLs
        await page.waitForTimeout(5000);
    } catch (err) {
        console.error('detectM3U8 Puppeteer error:', err.message);
    } finally {
        await browser.close();
    }

    return [...links];
}

module.exports = detectM3U8;
