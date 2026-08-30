// =============================================================================
// ProductGrid — dumb presentational component: given an array of products it
// renders a responsive CSS grid of ProductCards. No data logic here.
// =============================================================================

import ProductCard from './ProductCard.jsx';

export default function ProductGrid({ products }) {
  return (
    <div className="grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
