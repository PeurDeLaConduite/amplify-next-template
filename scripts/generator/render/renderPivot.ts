import path from "node:path";
import { safeWrite, GEN } from "./common";
import type { ModelMeta } from "../types";

export function renderPivot(m: ModelMeta, relationsDir: string) {
    const dir = path.join(relationsDir, m.name.charAt(0).toLowerCase() + m.name.slice(1));
    const low = m.name.charAt(0).toLowerCase() + m.name.slice(1);

    const [assocA, assocB] = m.assocs.filter((a) => a.kind === "belongsTo") as any[];
    const k1 = assocA?.target
        ? assocA.target.charAt(0).toLowerCase() + assocA.target.slice(1)
        : "parent";
    const k2 = assocB?.target
        ? assocB.target.charAt(0).toLowerCase() + assocB.target.slice(1)
        : "child";

    const typesTs = `// AUTO-GENERATED – DO NOT EDIT
export type ${m.name}Type = {
  id: string;
  ${k1}Id: string;
  ${k2}Id: string;
};
`;

    const serviceTs = `// AUTO-GENERATED – DO NOT EDIT
import { relationService } from "${GEN.paths.relationService}";
export const ${low}Service = relationService("${m.name}", "${k1}Id", "${k2}Id");
`;

    const indexTs = `// AUTO-GENERATED – DO NOT EDIT
export * from "./types";
export { ${low}Service } from "./service";
`;

    safeWrite(path.join(dir, "types.ts"), typesTs);
    safeWrite(path.join(dir, "service.ts"), serviceTs);
    safeWrite(path.join(dir, "index.ts"), indexTs);
}
