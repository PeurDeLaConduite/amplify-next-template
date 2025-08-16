// AUTO-GENERATED – DO NOT EDIT
import { createEntityHooks } from "@entities/core/createEntityHooks";
import type { TodoFormType } from "./types";
import { todoConfig } from "./config";
import { todoService } from "./service";

export const useTodoManager = createEntityHooks<TodoFormType>({
    ...todoConfig,
    service: todoService,
});
