import { Router } from "express";
import { readFileSync } from "fs";
import { join, resolve } from "path";

const router = Router();

const MODULE_FILES: Record<string, string> = {
  "snabba-svar-sms": resolve(join(process.cwd(), "..", "..", "assets", "modules", "snabba-svar-sms.json")),
};

router.get("/modules/:name", (req, res) => {
  const { name } = req.params;
  const filePath = MODULE_FILES[name];

  if (!filePath) {
    res.status(404).json({ error: "Modul hittades inte." });
    return;
  }

  let content: string;
  try {
    content = readFileSync(filePath, "utf-8");
  } catch {
    res.status(500).json({ error: "Kunde inte läsa modulfilen." });
    return;
  }

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${name}.json"`);
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(content);
});

export default router;
