import path from "node:path";
import { modelOutDir, safeWrite, GEN } from "./common";
import type { ModelMeta } from "../types";

export function renderModelServices(m: ModelMeta) {
    const dir = modelOutDir(m.name);
    const low = m.name[0].toLowerCase() + m.name.slice(1);
    const content = `// AUTO-GENERATED – DO NOT EDIT
import { crudService } from "@src/entities/core";
export const ${low}Service = crudService("${m.name}");
`;
    safeWrite(path.join(dir, "service.ts"), content);
}
