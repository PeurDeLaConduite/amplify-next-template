export type Operation = "read" | "create" | "update" | "delete";
export type AuthAllow = "public" | "private" | "owner" | "groups" | "profile";

export interface UserProfile {
    roles?: string[];
    [key: string]: unknown;
}
export interface AuthUser {
    username?: string;
    groups?: string[];
    profile?: UserProfile;
}

export interface AuthRule {
    allow: AuthAllow;
    operations: Operation[];
    ownerField?: string;
    groups?: string[];
    field?: string;
    values?: (string | number | boolean)[];
}

// Interface simplifiée
export type SimpleAccess =
    | "public"
    | "private"
    | { groups: string[] }
    | { owner?: true; ownerField?: string }
    | { profile: { field: string; values: (string | number | boolean)[] } };

export type SimplePolicy = {
    read: SimpleAccess | SimpleAccess[];
    create?: SimpleAccess | SimpleAccess[];
    update?: SimpleAccess | SimpleAccess[];
    delete?: SimpleAccess | SimpleAccess[];
};
