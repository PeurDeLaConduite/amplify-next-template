import type { Schema } from "@/amplify/data/resource";

export type Todo = Schema["Todo"]["type"];

export type TodoCreateInput = Omit<Todo, "id" | "createdAt" | "updatedAt">;

export type TodoUpdateInput = Partial<TodoCreateInput>;