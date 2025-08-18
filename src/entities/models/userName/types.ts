import type { BaseModel, UpdateInput, ModelForm } from "@entities/core";

export type UserNameType = BaseModel<"UserName">;
export type UserNameCreateInput = { userName: string };
export type UserNameUpdateInput = UpdateInput<"UserName">;
export type UserNameFormType = ModelForm<"UserName", "comments", "comments" | "postComments">;
