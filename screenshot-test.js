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
    
    // Execute JavaScript to hide cookie banners
    await page.evaluate(() => {
      // Example: Remove elements by class name or ID
      const banners = document.querySelectorAll('.cookie-banner, .cookie-consent, #cookie-consent, .cookie-notice');
      banners.forEach(banner => banner.style.display = 'none');
    });
    
    // Set the viewport size (optional)
    await page.setViewport({ width: 1200, height: 800 });
    
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

