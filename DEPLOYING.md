# Deploying Pyydys to GitHub Pages

This repo already contains a GitHub Actions workflow (`.github/workflows/deploy.yml`) that
builds and publishes the PWA to GitHub Pages on every push to `main`. **No code edits required.**

## One-time setup (≈ 2 minutes)

1. **Push the code to GitHub.** Either use Emergent's *Save to GitHub* button or
   `git push` from your machine. Use a **public** repository (free GitHub Pages tier).

2. **Enable Pages.**
   - In the repo on GitHub: **Settings → Pages**.
   - **Source**: `Deploy from a branch`.
   - **Branch**: `gh-pages` / `/ (root)` → **Save**.
   - *(The `gh-pages` branch will be created automatically the first time the
     workflow runs. If it isn't there yet, push once or click "Run workflow"
     under the Actions tab.)*

3. **Allow Actions to push.**
   - **Settings → Actions → General → Workflow permissions** →
     **Read and write permissions** → **Save**.
   - You only have to do this once per repo.

That's it. Within a minute or two your app will be live at:

    https://<your-github-username>.github.io/<repo-name>/

The workflow automatically:

- Installs deps from the locked `frontend/yarn.lock`.
- Builds the React app with `PUBLIC_URL=/<repo-name>` so all asset, manifest,
  and service-worker URLs are correct under the GH Pages sub-path.
- Stamps a unique cache version into `service-worker.js` (handled by the
  `postbuild` script) so updates invalidate the offline cache.
- Copies `index.html` → `404.html` so React Router routes work after a refresh.
- Adds `.nojekyll` so GH Pages serves all files verbatim.
- Publishes the `frontend/build/` folder to the `gh-pages` branch.

## Updating the app

Just push to `main`. The workflow rebuilds and redeploys automatically. Users
with the PWA already installed will pick up the new version next time they
launch it (the service worker auto-bumps its cache key).

## Installing on a device

Once the URL is live and you've opened it on HTTPS (GitHub Pages provides
this for free):

- **Desktop Chrome / Edge** — an "Install Pyydys" banner appears at the
  bottom of the screen, or click the install icon in the address bar.
- **Android Chrome** — same banner → "Install".
- **iOS Safari** — tap **Share** → **Add to Home Screen** (iOS doesn't show
  a banner, but the app still works fully offline once added).

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Blank page, 404s for `*.js` / `*.css` | `PUBLIC_URL` mismatch. Make sure the repo name matches the published URL. The workflow handles this automatically. |
| Refresh on `/archive` shows GH 404 | `404.html` is missing. Re-run the workflow. |
| Workflow fails: "Resource not accessible by integration" | Settings → Actions → General → Workflow permissions → **Read and write permissions**. |
| Old version keeps loading | Close all Pyydys windows / PWA instances, then reopen. The build-stamped cache key (`pyydys-cache-vXXXX`) refreshes on next launch. |
| Banner doesn't appear on desktop | DevTools → Application → Service Workers. SW only registers on HTTPS production builds. Verify the worker is "activated and running". |

## Costs

GitHub Pages on a public repo is **free, forever**. No Emergent subscription
is required for the app to keep running once it's deployed here. The only
recurring cost would be an optional custom domain (~$10–15 / year).
