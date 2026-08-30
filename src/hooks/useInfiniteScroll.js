// =============================================================================
// useInfiniteScroll — grows a "visibleCount" as the user scrolls near the
// bottom, giving client-side infinite scrolling (an "Additional Challenge").
//
// It combines two things from the brief:
//   • a THROTTLED scroll handler (via useThrottle) so we don't run the
//     near-bottom check on every one of the ~60 scroll events/second, and
//   • a reset whenever the total/among-filter changes, so switching filters
//     starts you back at the top of a fresh page.
//
// Returns { visibleCount, hasMore, sentinelRef } — attach sentinelRef to an
// element at the end of the list (belt-and-suspenders with the scroll check).
// =============================================================================

import { useCallback, useEffect, useRef, useState } from 'react';
import { useThrottle } from './useThrottle.js';

export function useInfiniteScroll(total, { pageSize = 12, resetKey } = {}) {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const sentinelRef = useRef(null);

  const hasMore = visibleCount < total;

  // When filters change (resetKey), jump back to the first page.
  useEffect(() => {
    setVisibleCount(pageSize);
  }, [resetKey, pageSize]);

  const loadMore = useCallback(() => {
    setVisibleCount((c) => Math.min(c + pageSize, total));
  }, [pageSize, total]);

  // The raw check — throttled below so it runs at most ~5x/second.
  const onScrollCheck = useCallback(() => {
    if (!hasMore) return;
    const nearBottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 600;
    if (nearBottom) loadMore();
  }, [hasMore, loadMore]);

  const throttledCheck = useThrottle(onScrollCheck, 200);

  useEffect(() => {
    window.addEventListener('scroll', throttledCheck, { passive: true });
    // Also run once in case the first page doesn't fill the viewport.
    throttledCheck();
    return () => window.removeEventListener('scroll', throttledCheck);
  }, [throttledCheck]);

  // IntersectionObserver on the sentinel as a robust backup to the scroll math.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const io = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && loadMore(),
      { rootMargin: '400px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, loadMore, visibleCount]);

  return { visibleCount, hasMore, sentinelRef };
}
