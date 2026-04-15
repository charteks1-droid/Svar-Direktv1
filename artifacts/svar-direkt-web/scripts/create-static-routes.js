#!/usr/bin/env node
// Creates index.html copies at every SPA route so ANY static host works (no server config needed)
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "../dist/public");
const indexHtml = path.join(distDir, "index.html");

const ROUTES = [
  "blogg",
  "paket",
  "kontakt",
  "funktioner",
  "om-appen",
  "mallar",
  "pdf-guider",
  "generator",
  "forum",
  // Blog articles
  "blogg/varfor-ar-det-svart-att-skriva-till-myndigheter",
  "blogg/ratt-ton-i-myndighetsbrev",
  "blogg/svara-pa-krav-fran-kronofogden",
  "blogg/forsakringskassan-skriver-till-dig",
  "blogg/konsten-att-svara-professionellt",
  "blogg/stress-och-radsla-infor-myndighetskontakt",
  "blogg/overvinna-radslan-for-myndigheter",
  "blogg/ekonomi-under-press-vad-gor-du",
  "blogg/radsla-fran-alla-hall-en-otrygg-tid",
  "blogg/vad-hander-om-du-inte-svarar-myndigheter",
  "blogg/skatteverket-6-vanliga-situationer",
  "blogg/hyresgastens-rattigheter-i-sverige",
];

const html = fs.readFileSync(indexHtml, "utf8");
let count = 0;

for (const route of ROUTES) {
  const dir = path.join(distDir, route);
  const dest = path.join(dir, "index.html");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(dest, html);
  count++;
  console.log(`  ✓ /${route}/`);
}

console.log(`\nCreated ${count} static route files.`);
