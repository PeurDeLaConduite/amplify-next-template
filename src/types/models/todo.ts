import type { BaseModel, UpdateInput, ModelForm } from "@entities/core";

export type TodoModel = BaseModel<"Todo">;
export type TodoCreateInput = { content?: string };
export type TodoUpdateInput = UpdateInput<"Todo">;
export type TodoFormType = ModelForm<"Todo">;
