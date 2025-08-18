import { type UserNameTypeUpdateInput } from "@entities/models/userName/types";

export const label = (field: keyof UserNameTypeUpdateInput): string => {
    switch (field) {
        case "userName":
            return "Pseudo public";
        default:
            return field;
    }
};
