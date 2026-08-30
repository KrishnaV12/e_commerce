// =============================================================================
// products.js — the "database". A JSON-like dataset generated deterministically
// so the list is large enough to demonstrate filtering, sorting, lazy image
// loading and infinite scroll. In a real app this lives behind a server.
// =============================================================================

const CATEGORIES = ['Electronics', 'Clothing', 'Home', 'Books', 'Sports', 'Beauty'];

const NAMES = {
  Electronics: ['Wireless Earbuds', 'Smart Watch', 'Bluetooth Speaker', '4K Webcam', 'Mechanical Keyboard', 'USB-C Hub', 'Noise-Cancel Headset', 'Portable SSD'],
  Clothing: ['Organic Cotton Tee', 'Merino Hoodie', 'Rain Shell Jacket', 'Linen Shirt', 'Wool Beanie', 'Chino Trousers', 'Running Socks', 'Denim Jacket'],
  Home: ['Ceramic Planter', 'Bamboo Cutting Board', 'Scented Candle', 'Cotton Throw', 'Cast Iron Pan', 'Glass Carafe', 'Desk Lamp', 'Storage Basket'],
  Books: ['The Green Path', 'Coding Calm', 'Forest Recipes', 'Design Systems', 'Deep Work', 'Atomic Habits Jr', 'The Pragmatic Coder', 'Clean UI'],
  Sports: ['Yoga Mat', 'Resistance Bands', 'Trail Runners', 'Water Bottle', 'Foam Roller', 'Cycling Gloves', 'Jump Rope', 'Camp Hammock'],
  Beauty: ['Aloe Face Wash', 'Bamboo Toothbrush', 'Matcha Mask', 'Herbal Shampoo', 'Lip Balm Trio', 'Rosewater Mist', 'Body Butter', 'Sea Salt Scrub'],
};

// Small seeded pseudo-random so prices/ratings are stable between reloads.
function seeded(n) {
  const x = Math.sin(n) * 10000;
  return x - Math.floor(x);
}

function buildProducts(count = 100) {
  const products = [];
  for (let i = 1; i <= count; i++) {
    const category = CATEGORIES[i % CATEGORIES.length];
    const names = NAMES[category];
    const name = names[i % names.length];
    // rating between 3.0 and 5.0 in 0.5 steps
    const rating = Math.round((3 + seeded(i) * 2) * 2) / 2;
    // price between $9 and $259
    const price = Math.round((9 + seeded(i * 7) * 250) * 100) / 100;

    products.push({
      id: i,
      name: `${name}`,
      category,
      price,
      rating,
      // picsum gives a real, unique image per seed → good lazy-load demo
      image: `https://picsum.photos/seed/greenshop${i}/400/300`,
    });
  }
  return products;
}

export const PRODUCTS = buildProducts();
export { CATEGORIES };
