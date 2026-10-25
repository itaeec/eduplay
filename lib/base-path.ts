/** Sub-folder the site is served from (see next.config.ts); "" at a domain root. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** Prefixes a root-relative asset path with the base path, for plain <img>/<a>. */
export const withBase = (path: string) => (path.startsWith("/") ? BASE_PATH + path : path);
