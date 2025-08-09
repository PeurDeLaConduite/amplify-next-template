import path from "node:path";
import { modelOutDir, safeWrite, GEN } from "./common";
import type { ModelMeta } from "../types";

export function renderModelHooks(m: ModelMeta) {
    const dir = modelOutDir(m.name);
    const low = m.name[0].toLowerCase() + m.name.slice(1);
    const content = `// AUTO-GENERATED – DO NOT EDIT
import { createEntityHooks } from "${GEN.paths.createEntityHooks}";
import type { ${m.name}FormType } from "./types";
import { ${low}Config } from "./config";

export const use${m.name}Manager = createEntityHooks<${m.name}FormType>(${low}Config);
`;
    safeWrite(path.join(dir, "hooks.ts"), content);
}
