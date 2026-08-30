// =============================================================================
// ProductCard — reusable card for a single product (image, category, name,
// rating, price, favorite toggle, add button).
//
// • React.memo keeps a card from re-rendering unless its own props change, so
//   toggling one favorite doesn't re-render the whole grid.
// • It reads/writes favorite state straight from Redux, keeping the grid dumb.
// • Favorited cards get the `card--fav` class → visual highlight (requirement).
// =============================================================================

import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite, selectFavoriteIds } from '../store/favoritesSlice.js';
import LazyImage from './LazyImage.jsx';
import StarRating from './StarRating.jsx';

function ProductCard({ product }) {
  const dispatch = useDispatch();
  // Select just the ids array; derive this card's boolean locally. This avoids
  // creating a new selector per card while still being cheap.
  const favoriteIds = useSelector(selectFavoriteIds);
  const isFav = favoriteIds.includes(product.id);

  return (
    <article className={`card${isFav ? ' card--fav' : ''}`}>
      <div className="card__media">
        <span className="card__cat">{product.category}</span>
        <button
          type="button"
          className={`card__fav-btn${isFav ? ' is-active' : ''}`}
          aria-pressed={isFav}
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
          onClick={() => dispatch(toggleFavorite(product.id))}
        >
          {isFav ? '♥' : '♡'}
        </button>
        <LazyImage src={product.image} alt={product.name} />
      </div>

      <div className="card__body">
        <h3 className="card__name">{product.name}</h3>
        <StarRating value={product.rating} />
        <div className="card__foot">
          <span className="card__price">${product.price.toFixed(2)}</span>
          <button type="button" className="card__add">Add</button>
        </div>
      </div>
    </article>
  );
}

// memo → skip re-render when props are shallow-equal.
export default memo(ProductCard);
