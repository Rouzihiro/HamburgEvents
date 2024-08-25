const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// List of URLs to capture
const urls = [
  'https://www.knusthamburg.de/programm/',
  'https://nochtspeicher.de/',
  'https://molotowclub.com/programm/programm.php',
  'https://spielbudenplatz.eu/erleben/events',
  'https://www.cinemaxx.de/kinoprogramm/hamburg-dammtor/jetzt-im-kino/top-kinofilme?Datum=26-08-2024',
  'https://schanzenkino.de/programm',
  'http://www.abaton.de/page.pl?index',
  'https://programm.ponybar.de/',
  'https://www.uebelundgefaehrlich.com/',
  'https://www.hafenklang.com/programm/'
];

(async () => {
  // Launch the browser
  const browser = await puppeteer.launch();
  
  // Ensure the 'images' directory exists
  const imagesDir = path.join(__dirname, 'images');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir);
  }
  
  // Iterate through the URLs
  for (let i = 0; i < urls.length; i++) {
    const page = await browser.newPage();
    
    // Set the URL of the website
    const url = urls[i];
    
    // Navigate to the URL
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    // Set the viewport size (optional)
    await page.setViewport({ width: 1200, height: 800 });
    
    // Optional: Automatically accept cookies
    try {
      // Wait for the cookie consent button and click it
      await page.waitForSelector('button.cookie-consent-button', { timeout: 5000 });
      await page.click('button.cookie-consent-button');
    } catch (error) {
      console.log('Cookie consent button not found or not needed.');
    }

    try {
      await page.waitForSelector('a.cookie-consent-link', { timeout: 5000 });
      await page.click('a.cookie-consent-link');
    } catch (error) {
      console.log('Cookie consent link not found or not needed.');
    }

    // Define the screenshot file path in the 'images' directory
    const screenshotPath = path.join(imagesDir, `${i + 1}.png`);
    
    // Capture screenshot
    await page.screenshot({ path: screenshotPath });
    
    console.log(`Screenshot of ${url} saved as ${screenshotPath}`);
    
    // Close the page
    await page.close();
  }
  
  // Close the browser
  await browser.close();
})();

