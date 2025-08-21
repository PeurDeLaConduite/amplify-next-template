import type { BaseModel, CreateOmit, UpdateInput, CreateInput } from "@entities/core";

export type PostTagType = BaseModel<"PostTag">;
export type PostTagTypeOmit = CreateOmit<"PostTag">;
export type PostTagTypeCreateInput = CreateInput<"PostTag">;
export type PostTagTypeUpdateInput = UpdateInput<"PostTag">;
