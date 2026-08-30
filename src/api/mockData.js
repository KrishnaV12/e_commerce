// ============================================================================
// mockData.js — the "database" behind our mock API
// ----------------------------------------------------------------------------
// We generate a deterministic catalog once at module load. Deterministic means
// the same products appear on every reload (nice for demos and for verifying
// caching), because we seed all randomness from the product index rather than
// Math.random().
// ============================================================================

export const CATEGORIES = [
  'Vegetables',
  'Fruits',
  'Bakery',
  'Dairy',
  'Beverages',
  'Pantry',
];

// Small, seeded pseudo-random generator so the catalog is stable across reloads.
function seeded(n) {
  const x = Math.sin(n * 999.13) * 10000;
  return x - Math.floor(x); // -> 0..1
}

const NOUNS = {
  Vegetables: ['Heirloom Tomatoes', 'Baby Spinach', 'Rainbow Carrots', 'Broccolini', 'Sweet Peppers', 'Kale Bunch'],
  Fruits: ['Alphonso Mangoes', 'Wild Blueberries', 'Pink Guava', 'Green Apples', 'Seedless Grapes', 'Ripe Avocados'],
  Bakery: ['Sourdough Loaf', 'Multigrain Rolls', 'Focaccia', 'Croissants', 'Bagels', 'Rye Bread'],
  Dairy: ['Farm Butter', 'Greek Yogurt', 'Aged Cheddar', 'Paneer Block', 'Fresh Cream', 'Cottage Cheese'],
  Beverages: ['Cold Brew', 'Green Tea', 'Kombucha', 'Coconut Water', 'Almond Milk', 'Ginger Ale'],
  Pantry: ['Olive Oil', 'Basmati Rice', 'Raw Honey', 'Sea Salt', 'Quinoa', 'Peanut Butter'],
};

// Build ~120 products (6 categories x 20). Each is a plain serializable object,
// exactly like a JSON API row would give you.
function buildCatalog() {
  const items = [];
  let id = 1;
  for (const category of CATEGORIES) {
    for (let i = 0; i < 20; i++) {
      const r = seeded(id);
      const name = `${NOUNS[category][i % NOUNS[category].length]} ${
        i < 6 ? '' : `#${i}`
      }`.trim();
      items.push({
        id,
        name,
        category,
        // price between 1.99 and 39.99, stable per id
        price: Number((1.99 + r * 38).toFixed(2)),
        // rating 3.0 – 5.0 in 0.5 steps
        rating: Math.round((3 + seeded(id * 7) * 2) * 2) / 2,
        // review count adds realism to sorting/threshold logic
        reviews: Math.floor(20 + seeded(id * 13) * 900),
        // Remote images so we can demonstrate lazy-loading. picsum is seeded
        // by id, so a product keeps its image. Requires internet at runtime.
        image: `https://picsum.photos/seed/verdant-${id}/480/360`,
      });
      id++;
    }
  }
  return items;
}

export const PRODUCTS = buildCatalog();
