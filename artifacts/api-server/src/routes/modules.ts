import { Router } from "express";
import { readFileSync, existsSync } from "fs";
import { join, resolve } from "path";

const router = Router();

function getModulePath(name: string): string {
  return resolve(join(process.cwd(), "..", "..", "assets", "modules", `${name}.json`));
}

const KNOWN_MODULES: Record<string, string> = {
  "snabba-svar-sms": "Snabba svar SMS",
};

router.get("/download/:name.json", (req, res) => {
  const { name } = req.params;
  const filePath = getModulePath(name);

  if (!KNOWN_MODULES[name] || !existsSync(filePath)) {
    res.status(404).send("Modul hittades inte.");
    return;
  }

  let content: string;
  try {
    content = readFileSync(filePath, "utf-8");
  } catch {
    res.status(500).send("Kunde inte läsa modulfilen.");
    return;
  }

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${name}.json"`);
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(content);
});

router.get("/download/:name", (req, res) => {
  const { name } = req.params;
  const filePath = getModulePath(name);
  const moduleName = KNOWN_MODULES[name];

  if (!moduleName || !existsSync(filePath)) {
    res.status(404).send("Modul hittades inte.");
    return;
  }

  let content: string;
  try {
    content = readFileSync(filePath, "utf-8");
  } catch {
    res.status(500).send("Kunde inte läsa modulfilen.");
    return;
  }

  const escaped = content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/'/g, "&#39;")
    .replace(/`/g, "&#96;");

  const html = `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ladda ner – ${moduleName}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #f0f4f8;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      background: #fff;
      border-radius: 20px;
      padding: 36px 28px;
      max-width: 420px;
      width: 100%;
      box-shadow: 0 4px 24px rgba(0,0,0,0.10);
      text-align: center;
    }
    .icon {
      width: 72px; height: 72px;
      background: #e8f4f8;
      border-radius: 20px;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 20px;
      font-size: 36px;
    }
    h1 { font-size: 22px; font-weight: 700; color: #111; margin-bottom: 8px; }
    p { font-size: 14px; color: #666; line-height: 1.5; margin-bottom: 24px; }
    .meta { display: flex; justify-content: center; gap: 20px; margin-bottom: 28px; }
    .meta span { font-size: 13px; color: #0a7ea4; font-weight: 600; }
    .btn {
      display: block;
      width: 100%;
      padding: 16px;
      background: #0a7ea4;
      color: #fff;
      border: none;
      border-radius: 14px;
      font-size: 17px;
      font-weight: 700;
      cursor: pointer;
      text-decoration: none;
      margin-bottom: 12px;
    }
    .btn:active { opacity: 0.85; }
    .hint { font-size: 12px; color: #999; line-height: 1.6; }
    .steps {
      text-align: left;
      background: #f8fafb;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 24px;
    }
    .steps li { font-size: 13px; color: #444; line-height: 1.8; padding-left: 4px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">📦</div>
    <h1>${moduleName}</h1>
    <p>Svar Direkt-modul · Klicka på knappen för att ladda ner filen till din telefon.</p>
    <div class="meta">
      <span>📝 ${JSON.parse(content).quickResponses?.length ?? 0} snabba svar</span>
      <span>📁 JSON-modul</span>
    </div>
    <ol class="steps">
      <li>Tryck på <strong>Ladda ner</strong> nedan</li>
      <li>Spara filen när telefonen frågar</li>
      <li>Öppna Svar Direkt → <strong>Lägg till modul</strong></li>
      <li>Välj filen från Nedladdningar</li>
    </ol>
    <a class="btn" href="/api/download/${name}.json" download="${name}.json">
      ⬇ Ladda ner ${name}.json
    </a>
    <p class="hint">Filen sparas i mappen Nedladdningar på din telefon.</p>
  </div>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(html);
});

export default router;
