const https = require('https');
const fs = require('fs');
const path = require('path');

// Better fashion images for collections
const images = {
  'images/collections/limited.jpg': 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80', // exclusive fashion rack
  'images/collections/summer.jpg': 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80', // summer fashion
  'images/collections/streetwear.jpg': 'https://images.unsplash.com/photo-1511746315387-c4a76990fdce?w=800&q=80', // streetwear style
};

const publicDir = path.join(__dirname, 'public');

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const fullPath = path.join(publicDir, filepath);
    const dir = path.dirname(fullPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const file = fs.createWriteStream(fullPath);

    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        https.get(response.headers.location, (res) => {
          res.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`Downloaded: ${filepath}`);
            resolve();
          });
        }).on('error', reject);
      } else {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded: ${filepath}`);
          resolve();
        });
      }
    }).on('error', reject);
  });
}

async function downloadAll() {
  console.log('Fixing collection images...\n');

  for (const [filepath, url] of Object.entries(images)) {
    try {
      await downloadImage(url, filepath);
      await new Promise(r => setTimeout(r, 300));
    } catch (err) {
      console.error(`Failed: ${filepath} - ${err.message}`);
    }
  }

  console.log('\nDone! Now restart the Next.js server and clear browser cache.');
}

downloadAll();
