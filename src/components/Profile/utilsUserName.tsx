import { toUserNameForm } from "@src/entities";

export type MinimalUserName = { userName: string };

export const label = (field: keyof MinimalUserName): string => {
    switch (field) {
        case "userName":
            return "Pseudo public";
        default:
            return field;
    }
};

export const normalizeFormData = toUserNameForm;
