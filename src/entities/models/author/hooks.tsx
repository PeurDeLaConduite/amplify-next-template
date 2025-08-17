import { createEntityHooks } from "@entities/core/factory";
import { authorConfig, type AuthorExtras } from "./config";
import type { AuthorFormType, AuthorType } from "@entities/models/author/types";

export const useAuthorForm = createEntityHooks<AuthorFormType, AuthorExtras, AuthorType>(
    authorConfig
);
