import fs from "node:fs";
import path from "node:path";

export function ensureDir(p: string) {
  fs.mkdirSync(p, { recursive: true });
}

export function safeWrite(file: string, content: string) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, content, "utf-8");
}

export async function writeJSON(file: string, data: unknown) {
  ensureDir(path.dirname(file));
  await fs.promises.writeFile(file, JSON.stringify(data, null, 2), "utf-8");
}

