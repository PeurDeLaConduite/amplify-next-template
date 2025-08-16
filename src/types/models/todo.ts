import type { BaseModel, CreateOmit, UpdateInput, ModelForm } from "@entities/core";

export type TodoModel = BaseModel<"Todo">;
export type TodoCreateInput = CreateOmit<"Todo">;
export type TodoUpdateInput = UpdateInput<"Todo">;
export type TodoFormType = ModelForm<"Todo">;
