/**
 * Prepends Astro's configured BASE_URL to the target path.
 * Ensures consistent link formatting across local dev and GitHub Pages subpath deployment.
 */
export function formatPath(path: string): string {
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  if (cleanPath === '/') {
    return cleanBase ? `${cleanBase}/` : '/';
  }
  
  return `${cleanBase}${cleanPath}`;
}
