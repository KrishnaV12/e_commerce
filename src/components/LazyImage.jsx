// =============================================================================
// LazyImage — image with a shimmering skeleton that fades the real image in
// once loaded. Uses native loading="lazy" + decoding="async" so off-screen
// images aren't fetched until needed (performance-optimization criterion).
// =============================================================================

import { useState } from 'react';

export default function LazyImage({ src, alt }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {/* Skeleton shows until the image reports it has loaded */}
      {!loaded && <span className="lazy-skeleton" aria-hidden="true" />}
      <img
        className={`lazy-img${loaded ? ' is-loaded' : ''}`}
        src={src}
        alt={alt}
        loading="lazy"        // browser defers off-screen fetches
        decoding="async"      // don't block the main thread decoding
        onLoad={() => setLoaded(true)}
      />
    </>
  );
}
