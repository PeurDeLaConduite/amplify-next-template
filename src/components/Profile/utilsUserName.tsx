import { type UserNameUpdateInput } from "@entities/models/userName/types";

export const label = (field: keyof UserNameUpdateInput): string => {
    switch (field) {
        case "userName":
            return "Pseudo public";
        default:
            return field as string;
    }
};
