import { toUserNameForm } from "@entities/models/userName/form";
import { type UserNameTypeUpdateInput } from "@entities/models/userName/types";

export const label = (field: keyof UserNameTypeUpdateInput): string => {
    switch (field) {
        case "userName":
            return "Pseudo public";
        default:
            return field;
    }
};

export const normalizeFormData = toUserNameForm;
