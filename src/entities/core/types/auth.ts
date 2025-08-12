export interface UserProfile {
    roles?: string[];
    [key: string]: unknown;
}

export interface ProfileRule {
    allow: "profile";
    field: string;
    values: (string | number | boolean)[];
}
