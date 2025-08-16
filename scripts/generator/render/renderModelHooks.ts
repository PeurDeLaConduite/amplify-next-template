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
import { ${low}Service } from "./service";

const use${m.name}Base = createEntityHooks<${m.name}FormType>({
    ...${low}Config,
    service: ${low}Service,
});

export const use${m.name}Manager = use${m.name}Base;

export const use${m.name}Form = () => {
    const {
        form,
        mode,
        dirty,
        reset,
        submit,
        refresh,
        setForm,
        handleChange,
        fields,
        labels,
        saveField,
        clearField,
        remove,
        loading,
        error,
    } = use${m.name}Base();
    return {
        form,
        mode,
        dirty,
        reset,
        submit,
        refresh,
        setForm,
        handleChange,
        fields,
        labels,
        saveField,
        clearField,
        remove,
        loading,
        error,
    } as const;
};
`;
    safeWrite(path.join(dir, "hooks.ts"), content);
}
