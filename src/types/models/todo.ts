import type { BaseModel, CreateOmit, UpdateInput } from "../amplifyBaseTypes";

export type Todo = BaseModel<"Todo">;
export type TodoOmit = CreateOmit<"Todo">;
export type TodoUpdateInput = UpdateInput<"Todo">;
