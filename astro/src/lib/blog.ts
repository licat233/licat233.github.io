// Preserve the exact stylesheet order and cache-busted blog CSS URL
// from the Jekyll blog layout; do not add unrelated site-section CSS.
export const blogStyles = [
 '/assets/vendor/open-props/open-props-core-1.7.23.min.css',
 '/assets/portfolio.css?v=20261008-glass1',
 '/assets/site-header.css?v=20261028-ai-glass1',
 '/assets/portfolio-liquid-glass.css?v=20261028-ai-active-group1',
 '/assets/blog.css?v=20261027',
] as const;
