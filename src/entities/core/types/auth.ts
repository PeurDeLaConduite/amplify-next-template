// src/entities/core/types/auth.ts


export interface UserProfile {
    roles?: string[];
    [key: string]: unknown;
}

export interface AuthUser {
    username?: string; // sub / username
    groups?: string[]; // groupes Cognito
    profile?: UserProfile;
}

