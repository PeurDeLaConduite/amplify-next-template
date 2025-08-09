import path from "node:path";
import { ensureDir, safeWrite } from "../utils/fs";
import { GEN } from "../generator.config";
import type { Field } from "../types";

export function modelOutDir(modelName: string) {
  const dir = path.join(process.cwd(), GEN.out.models, modelName.charAt(0).toLowerCase() + modelName.slice(1));
  ensureDir(dir);
  return dir;
}

export const isCustomField = (f: Field): f is Extract<Field, { kind: "custom"; refType: string }> => f.kind === "custom";
export const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
export const singular = (s: string) => (s.endsWith("s") ? s.slice(0, -1) : s);

export { safeWrite, GEN };

