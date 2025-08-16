// AUTO-GENERATED – DO NOT EDIT
import { createEntityHooks } from "@src/entities/core/createEntityHooks";
import type { AuthorFormType } from "./types";
import { authorConfig } from "./config";
import { authorService } from "./service";

export const useAuthorManager = createEntityHooks<AuthorFormType>({
    ...authorConfig,
    service: authorService,
});
