import { crudService } from "@entities/core";
import type {
    SectionTypesCreateInput,
    SectionTypesUpdateInput,
} from "@entities/models/section/types";
import type { IdArg } from "@entities/core/types";

export const sectionService = crudService<
    "Section",
    SectionTypesCreateInput,
    SectionTypesUpdateInput,
    IdArg,
    IdArg
>("Section", {
    auth: { read: ["apiKey", "userPool"], write: "userPool" },
});
