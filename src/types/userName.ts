import type { Schema } from "@/amplify/data/resource";

export type UserName = Schema["UserName"]["type"];

export type UserNameCreateInput = Omit<UserName, "id" | "createdAt" | "updatedAt">;

export type UserNameUpdateInput = Partial<UserNameCreateInput>;