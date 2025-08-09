import path from "node:path";
import { safeWrite, GEN } from "./common";
import type { ModelMeta } from "../types";

export function renderPivot(m: ModelMeta) {
  const dir = path.join(process.cwd(), GEN.out.models, m.name.charAt(0).toLowerCase() + m.name.slice(1));
  const low = m.name.charAt(0).toLowerCase() + m.name.slice(1);
  const serviceTs = `// AUTO-GENERATED – DO NOT EDIT
import { relationService } from "@src/services/relationService";
export const ${low}Service = relationService("${m.name}");
`;
  const indexTs = `// AUTO-GENERATED – DO NOT EDIT
export * from "./service";
`;
  safeWrite(path.join(dir, "service.ts"), serviceTs);
  safeWrite(path.join(dir, "index.ts"), indexTs);
}

