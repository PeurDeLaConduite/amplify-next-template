import type { ModelMeta, RelationsMap } from "../types";
import { renderModelTypes } from "./renderModelTypes";
import { renderModelConfig } from "./renderModelConfig";
import { renderModelForm } from "./renderModelForm";
import { renderModelServices } from "./renderModelServices";
import { renderModelHooks } from "./renderModelHooks";
import { renderModelIndex } from "./renderModelIndex";

export function renderModel(m: ModelMeta, relations: RelationsMap) {
    renderModelTypes(m, relations);
    renderModelConfig(m, relations);
    renderModelForm(m, relations);
    renderModelServices(m);
    renderModelHooks(m);
    renderModelIndex(m);
}
