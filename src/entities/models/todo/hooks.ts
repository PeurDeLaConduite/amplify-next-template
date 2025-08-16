// AUTO-GENERATED – DO NOT EDIT
import { createEntityHooks } from "@entities/core/createEntityHooks";
import type { TodoFormType } from "./types";
import { todoConfig } from "./config";
import { todoService } from "./service";

const useTodoBase = createEntityHooks<TodoFormType>({
    ...todoConfig,
    service: todoService,
});

export const useTodoManager = useTodoBase;

export const useTodoForm = () => {
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
    } = useTodoBase();
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
