// Verifies every exercise video still exists and allows embedding (YouTube oEmbed).
// Usage: npm run check:videos
import { readFileSync } from "node:fs";

const src = readFileSync(new URL("../content/videos.ts", import.meta.url), "utf8");
const entries = [...src.matchAll(/"([^"]+)":\s*\{\s*id:\s*"([^"]+)"/g)].map((m) => ({ slug: m[1], id: m[2] }));

let failed = 0;
for (const { slug, id } of entries) {
  const url = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}`;
  const res = await fetch(url);
  if (res.ok) {
    const data = await res.json();
    console.log(`OK    ${slug.padEnd(32)} ${data.author_name}`);
  } else {
    failed++;
    console.log(`FAIL  ${slug.padEnd(32)} ${id} (HTTP ${res.status})`);
  }
}
console.log(`\n${entries.length - failed}/${entries.length} videos OK`);
process.exit(failed ? 1 : 0);
