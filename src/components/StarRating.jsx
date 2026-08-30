// =============================================================================
// StarRating — tiny presentational helper that renders a rating as ★ glyphs
// plus the numeric value. Pure, memo-friendly, no state.
// =============================================================================

export default function StarRating({ value }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const stars = '★'.repeat(full) + (half ? '½' : '');
  return (
    <span className="card__rating">
      <span className="stars" aria-hidden="true">{stars || '☆'}</span>
      <span>{value.toFixed(1)}</span>
    </span>
  );
}
