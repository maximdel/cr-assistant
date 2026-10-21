// rename-badges-to-ids.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 1) get script directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2) load the JSON mapping
const allBadges = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'alliance_badges.json'), 'utf-8')
);

// 3) build name→id map
const nameToId = Object.fromEntries(
  allBadges.map(({ name, id }) => [name, id])
);

// 4) directory with your files
const BADGE_DIR = path.resolve(__dirname, '../public/badges');

fs.readdirSync(BADGE_DIR).forEach((file) => {
  if (!file.endsWith('.png')) return;
  const baseName = file.slice(0, -4); // e.g. "Flame_01"
  const id = nameToId[baseName];
  if (id != null) {
    const oldPath = path.join(BADGE_DIR, file);
    const newPath = path.join(BADGE_DIR, `${id}.png`);
    fs.renameSync(oldPath, newPath);
    console.log(`✔ Renamed ${file} → ${id}.png`);
  } else {
    console.warn(`⚠️  No mapping for "${baseName}", skipping.`);
  }
});
