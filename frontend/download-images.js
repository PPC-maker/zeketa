const https = require('https');
const fs = require('fs');
const path = require('path');

// Fashion/Streetwear images from Unsplash
const images = {
  // Hero slides
  'images/hero/slide1.jpg': 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=1920&q=80', // streetwear model
  'images/hero/slide2.jpg': 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1920&q=80', // fashion model
  'images/hero/slide3.jpg': 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1920&q=80', // urban fashion

  // Categories - need men.jpg and women.jpg
  'images/categories/men.jpg': 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80', // man streetwear
  'images/categories/women.jpg': 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80', // woman fashion
  'images/categories/hoodies.jpg': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80', // hoodie
  'images/categories/sweatshirts.jpg': 'https://images.unsplash.com/photo-1578681994506-b8f463449011?w=800&q=80', // sweatshirt
  'images/categories/jackets.jpg': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80', // jacket
  'images/categories/bottoms.jpg': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80', // pants/jeans
  'images/categories/accessories.jpg': 'https://images.unsplash.com/photo-1523779105320-d1cd346ff52b?w=800&q=80', // accessories
  'images/categories/kids.jpg': 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&q=80', // kids fashion

  // Products
  'images/products/hoodie1.jpg': 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80', // black hoodie
  'images/products/hoodie1-alt.jpg': 'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=600&q=80', // hoodie alt
  'images/products/sweatshirt1.jpg': 'https://images.unsplash.com/photo-1572495532056-8583af1cbae0?w=600&q=80', // sweatshirt
  'images/products/jacket1.jpg': 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80', // jacket
  'images/products/pants1.jpg': 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80', // pants
  'images/products/bomber1.jpg': 'https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=600&q=80', // bomber jacket
  'images/products/tee1.jpg': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80', // t-shirt
  'images/products/sweat1.jpg': 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80', // sweatshirt

  // Collections
  'images/collections/summer.jpg': 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80', // summer fashion
  'images/collections/streetwear.jpg': 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80', // streetwear
  'images/collections/limited.jpg': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', // exclusive fashion

  // Looks
  'images/looks/look1.jpg': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80', // look 1
  'images/looks/look2.jpg': 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=600&q=80', // look 2
  'images/looks/look3.jpg': 'https://images.unsplash.com/photo-1506634572416-48cdfe530110?w=600&q=80', // look 3
  'images/looks/look4.jpg': 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80', // look 4

  // Instagram posts
  'images/instagram/post1.jpg': 'https://images.unsplash.com/photo-1544441893-675973e31985?w=400&q=80',
  'images/instagram/post2.jpg': 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80',
  'images/instagram/post3.jpg': 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=400&q=80',
  'images/instagram/post4.jpg': 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80',
  'images/instagram/post5.jpg': 'https://images.unsplash.com/photo-1475180429745-bd45ce60b095?w=400&q=80',
  'images/instagram/post6.jpg': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80',

  // Placeholder
  'images/placeholder.jpg': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80',
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
        // Follow redirect
        https.get(response.headers.location, (res) => {
          res.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`✓ Downloaded: ${filepath}`);
            resolve();
          });
        }).on('error', reject);
      } else {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✓ Downloaded: ${filepath}`);
          resolve();
        });
      }
    }).on('error', (err) => {
      fs.unlink(fullPath, () => {});
      reject(err);
    });
  });
}

async function downloadAll() {
  console.log('Starting download of fashion images...\n');

  const entries = Object.entries(images);
  let success = 0;
  let failed = 0;

  for (const [filepath, url] of entries) {
    try {
      await downloadImage(url, filepath);
      success++;
      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 500));
    } catch (err) {
      console.error(`✗ Failed: ${filepath} - ${err.message}`);
      failed++;
    }
  }

  console.log(`\n=============================`);
  console.log(`Done! ${success} downloaded, ${failed} failed`);
  console.log(`=============================`);
}

downloadAll();
