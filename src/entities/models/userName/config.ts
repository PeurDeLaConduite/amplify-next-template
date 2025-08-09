// AUTO-GENERATED – DO NOT EDIT
import type { UserNameType } from "./types";
import { z } from "zod";

export type UserNameEditableKeys =
  | "userName";

export const userNameConfig = {
  model: "UserName" as const,

  fields: [
    "userName"
  ] as UserNameEditableKeys[],

  labels(field: UserNameEditableKeys): string {
    switch (field) {
    case "userName": return "UserName";
      default: return field;
    }
  },

  zodSchema: z.object({
  userName: z.string().min(1),
  }),

  toInput(form: Partial<Record<UserNameEditableKeys, unknown>>) {
    const f = form as Partial<Pick<UserNameType, "userName">>;
    const input = {
    userName: f.userName,
    } satisfies Partial<UserNameType>;
    return input;
  },

  relations: {
    manyToManyKeys: [] as const
  }
} as const;
