import type { BaseModel, CreateOmit, UpdateInput, ModelForm } from "@entities/core";

export type TodoModel = BaseModel<"Todo">;
export type TodoTypeOmit = CreateOmit<"Todo">;
export type TodoTypeCreateInput = Omit<TodoTypeOmit, "id" | "comments"> & { id?: string };
export type TodoTypeUpdateInput = UpdateInput<"Todo">;
export type TodoCreateInput = TodoTypeCreateInput;
export type TodoUpdateInput = TodoTypeUpdateInput;
export type TodoFormType = ModelForm<"Todo", "comments", "comment">;
