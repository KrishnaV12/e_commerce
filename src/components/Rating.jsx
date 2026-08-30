// ============================================================================
// Rating — renders a 0–5 star rating (supports halves) as inline SVG.
// ----------------------------------------------------------------------------
// Pure presentational + reusable. Uses the --star token so it stays consistent
// across both themes. Accessible: the numeric value is announced via aria-label
// while the stars are decorative (aria-hidden).
// ============================================================================

import './Rating.css';

function Star({ fill }) {
  // fill: 0 (empty) .. 1 (full). We clip a full star with a linear gradient.
  const id = `star-${Math.random().toString(36).slice(2)}`;
  return (
    <svg viewBox="0 0 24 24" className="star" aria-hidden="true">
      <defs>
        <linearGradient id={id}>
          <stop offset={`${fill * 100}%`} stopColor="var(--star)" />
          <stop offset={`${fill * 100}%`} stopColor="var(--border-strong)" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${id})`}
        d="M12 2l2.9 6.26L21.5 9.3l-4.75 4.64 1.12 6.56L12 17.5l-5.87 3 1.12-6.56L2.5 9.3l6.6-1.04L12 2z"
      />
    </svg>
  );
}

export default function Rating({ value = 0, reviews }) {
  const stars = [0, 1, 2, 3, 4].map((i) => {
    const fill = Math.max(0, Math.min(1, value - i)); // per-star fill fraction
    return <Star key={i} fill={fill} />;
  });

  return (
    <span
      className="rating"
      aria-label={`Rated ${value} out of 5${reviews ? `, ${reviews} reviews` : ''}`}
    >
      <span className="rating__stars">{stars}</span>
      <span className="rating__value">{value.toFixed(1)}</span>
      {reviews != null && <span className="rating__reviews">({reviews})</span>}
    </span>
  );
}
