import { type UserNameFormType } from "@entities/models/userName";

export const label = (field: keyof UserNameFormType): string => {
    switch (field) {
        case "userName":
            return "Pseudo public";
        default:
            return field as string;
    }
};
