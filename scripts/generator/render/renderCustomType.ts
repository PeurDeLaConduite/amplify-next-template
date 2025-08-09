import path from "node:path";
import { safeWrite, GEN } from "./common";
import type { CustomTypeMeta } from "../types";

export function renderCustomType(ct: CustomTypeMeta) {
  const outDir = path.join(process.cwd(), GEN.out.customTypes, ct.name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase());

  const fieldsTs = ct.fields
    .map((f) => {
      if ((f as any).kind === "number") return `  ${(f as any).name}?: number | null;`;
      if ((f as any).kind === "boolean") return `  ${(f as any).name}?: boolean | null;`;
      return `  ${(f as any).name}?: string | null;`;
    })
    .join("\n");
  const typesTs = `// AUTO-GENERATED – DO NOT EDIT
export type ${ct.name} = {
${fieldsTs}
};
`;

  const initialLines = ct.fields
    .map((f) => {
      if ((f as any).kind === "number") return `  ${(f as any).name}: 0,`;
      if ((f as any).kind === "boolean") return `  ${(f as any).name}: false,`;
      return `  ${(f as any).name}: "",`;
    })
    .join("\n");
  const formTs = `// AUTO-GENERATED – DO NOT EDIT
export type ${ct.name}Form = {
${ct.fields.map((f)=>{
  if ((f as any).kind === "number") return `  ${(f as any).name}: number;`;
  if ((f as any).kind === "boolean") return `  ${(f as any).name}: boolean;`;
  return `  ${(f as any).name}: string;`;
}).join("\n")}
};

export const initial${ct.name}Form: ${ct.name}Form = {
${initialLines}
};

export function to${ct.name}Form(value: Partial<${ct.name}Form> | null | undefined): ${ct.name}Form {
  if (!value) return { ...initial${ct.name}Form };
  return {
${ct.fields.map((f)=>{
  if ((f as any).kind === "number") return `    ${(f as any).name}: value.${(f as any).name} ?? 0,`;
  if ((f as any).kind === "boolean") return `    ${(f as any).name}: value.${(f as any).name} ?? false,`;
  return `    ${(f as any).name}: value.${(f as any).name} ?? "",`;
}).join("\n")}
  };
}
`;

  const indexTs = `// AUTO-GENERATED – DO NOT EDIT
export * from "./types";
export * from "./form";
`;

  safeWrite(path.join(outDir, "types.ts"), typesTs);
  safeWrite(path.join(outDir, "form.ts"), formTs);
  safeWrite(path.join(outDir, "index.ts"), indexTs);
}

