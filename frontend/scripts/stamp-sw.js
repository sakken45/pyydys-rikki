/* eslint-disable */
// Stamps a unique build id into build/service-worker.js so each deploy
// invalidates the previous offline cache. Runs automatically after
// `yarn build` via the "postbuild" npm script.
const fs = require("fs");
const path = require("path");

const swPath = path.join(__dirname, "..", "build", "service-worker.js");
if (!fs.existsSync(swPath)) {
  console.warn("[postbuild] build/service-worker.js not found — skipping.");
  process.exit(0);
}

const buildId = `${Date.now().toString(36)}`;
const content = fs.readFileSync(swPath, "utf8").replace(/__BUILD_ID__/g, buildId);
fs.writeFileSync(swPath, content, "utf8");
console.log(`[postbuild] service-worker.js cache version → ${buildId}`);
