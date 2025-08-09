import path from "node:path";
import { modelOutDir, safeWrite } from "./common";
import type { ModelMeta } from "../types";

export function renderModelIndex(m: ModelMeta) {
    const dir = modelOutDir(m.name);
    const low = m.name[0].toLowerCase() + m.name.slice(1);
    const content = `// AUTO-GENERATED – DO NOT EDIT
export * from "./types";
export { ${low}Config } from "./config";
export * from "./form";
export { ${low}Service } from "./service";
export * from "./hooks";
`;
    safeWrite(path.join(dir, "index.ts"), content);
}
