// ============================================================================
// States — skeletons, empty state, and error state.
// ----------------------------------------------------------------------------
// Good UX means every async outcome has a designed state:
//   - SkeletonGrid: shown on first load so the layout appears instantly.
//   - EmptyState:   filters matched nothing (an invitation to adjust).
//   - ErrorState:   the (occasionally failing) mock API errored -> offer retry.
// Copy follows the design guidance: errors explain + offer a fix, no apology.
// ============================================================================

import './States.css';

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="grid" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div className="skeleton" key={i}>
          <div className="skeleton__media" />
          <div className="skeleton__line skeleton__line--lg" />
          <div className="skeleton__line" />
          <div className="skeleton__line skeleton__line--sm" />
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ onReset }) {
  return (
    <div className="state">
      <div className="state__icon">🌱</div>
      <h3 className="state__title">Nothing matches those filters</h3>
      <p className="state__text">Try widening your search or clearing a filter.</p>
      <button className="state__btn" onClick={onReset}>Clear filters</button>
    </div>
  );
}

export function ErrorState({ onRetry }) {
  return (
    <div className="state">
      <div className="state__icon">⚠️</div>
      <h3 className="state__title">Couldn't load the shelf</h3>
      <p className="state__text">The store didn't respond. Check your connection and try again.</p>
      <button className="state__btn" onClick={onRetry}>Try again</button>
    </div>
  );
}
