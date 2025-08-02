import type { BaseModel, CreateOmit, UpdateInput } from "@myTypes/amplifyBaseTypes";

export type Author = BaseModel<"Author">;
export type AuthorOmit = CreateOmit<"Author">;
export type AuthorUpdateInput = UpdateInput<"Author">;
