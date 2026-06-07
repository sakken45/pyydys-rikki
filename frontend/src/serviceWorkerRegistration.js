/*
 * Register the offline service worker.
 *
 * Skipped in dev (CRA hot-reload + SW play badly together). In production
 * the SW is fetched from `${PUBLIC_URL}/service-worker.js`, which becomes
 * the site root when hosted on Netlify / Vercel / Cloudflare Pages /
 * GitHub Pages (with PUBLIC_URL set at build time).
 */

export function registerServiceWorker() {
  if (
    typeof window === "undefined" ||
    !("serviceWorker" in navigator) ||
    process.env.NODE_ENV !== "production"
  ) {
    return;
  }

  // Use PUBLIC_URL when available so the app also works under a sub-path
  // (e.g. GitHub Pages at /repo-name/).
  const publicUrl = new URL(
    process.env.PUBLIC_URL || "/",
    window.location.href,
  );
  if (publicUrl.origin !== window.location.origin) return;

  window.addEventListener("load", () => {
    const swUrl = `${process.env.PUBLIC_URL || ""}/service-worker.js`;
    navigator.serviceWorker
      .register(swUrl)
      .then((reg) => {
        // If a new worker is waiting on first install of an updated build,
        // tell it to skip waiting so updates are picked up on next reload.
        reg.onupdatefound = () => {
          const installing = reg.installing;
          if (!installing) return;
          installing.onstatechange = () => {
            if (
              installing.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // New version available — will activate on next navigation.
              // Users can also reload manually.
              // eslint-disable-next-line no-console
              console.info("Pyydys: new version cached, refresh to update.");
            }
          };
        };
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.warn("Pyydys SW register failed:", err);
      });
  });
}
