const fs = require("fs");
const path = require("path");

function findRoot(start) {
  let dir = start;
  while (dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, "pnpm-workspace.yaml"))) return dir;
    dir = path.dirname(dir);
  }
  return null;
}

const projectDir = path.resolve(__dirname, "..");
const workspaceRoot = findRoot(projectDir);

if (!workspaceRoot) {
  console.log("[eas-pre-install] No pnpm-workspace.yaml found. Nothing to do.");
  process.exit(0);
}

console.log(`[eas-pre-install] Workspace root: ${workspaceRoot}`);

const wsFile = path.join(workspaceRoot, "pnpm-workspace.yaml");
const backup = wsFile + ".eas-backup";

try {
  fs.renameSync(wsFile, backup);
  console.log("[eas-pre-install] Renamed pnpm-workspace.yaml → pnpm-workspace.yaml.eas-backup");
  console.log("[eas-pre-install] pnpm will now install only the Expo app dependencies.");
} catch (e) {
  console.log("[eas-pre-install] Could not rename pnpm-workspace.yaml:", e.message);
}

process.exit(0);
