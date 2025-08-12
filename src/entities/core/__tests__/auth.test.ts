import { describe, it, expect } from "vitest";
import { canAccess } from "@src/entities/core/auth";
import type { AuthRule } from "@src/entities/core/types";

const entity = { owner: "alice", authorId: "alice" };
const user = { username: "alice", groups: ["editor"] };

describe("canAccess", () => {
    it("autorise le propriétaire", () => {
        const rules: AuthRule[] = [{ allow: "owner" }];
        expect(canAccess(user, entity, rules)).toBe(true);
    });

    it("autorise le propriétaire avec champ personnalisé", () => {
        const rules: AuthRule[] = [{ allow: "owner", ownerField: "authorId" }];
        expect(canAccess(user, entity, rules)).toBe(true);
    });

    it("refuse si l'utilisateur n'est pas propriétaire", () => {
        const rules: AuthRule[] = [{ allow: "owner" }];
        expect(canAccess({ username: "bob" }, entity, rules)).toBe(false);
    });

    it("autorise le groupe editor", () => {
        const rules: AuthRule[] = [{ allow: "groups", groups: ["editor"] }];
        expect(canAccess(user, entity, rules)).toBe(true);
    });

    it("refuse un utilisateur du groupe restricted", () => {
        const rules: AuthRule[] = [{ allow: "groups", groups: ["editor"] }];
        const restrictedUser = { username: "charlie", groups: ["restricted"] };
        expect(canAccess(restrictedUser, entity, rules)).toBe(false);
    });

    it("autorise le groupe restricted si la règle l'inclut", () => {
        const rules: AuthRule[] = [{ allow: "groups", groups: ["editor", "restricted"] }];
        const restrictedUser = { username: "charlie", groups: ["restricted"] };
        expect(canAccess(restrictedUser, entity, rules)).toBe(true);
    });

    it("autorise selon un rôle de profil", () => {
        const rules: AuthRule[] = [{ allow: "profile", attribute: "roles", values: ["admin"] }];
        const profiledUser = {
            username: "alice",
            profile: { roles: ["admin"] },
        };
        expect(canAccess(profiledUser, entity, rules)).toBe(true);
    });

    it("refuse si le rôle de profil ne correspond pas", () => {
        const rules: AuthRule[] = [{ allow: "profile", attribute: "roles", values: ["admin"] }];
        const profiledUser = {
            username: "bob",
            profile: { roles: ["user"] },
        };
        expect(canAccess(profiledUser, entity, rules)).toBe(false);
    });

    it("autorise l'accès public", () => {
        const rules: AuthRule[] = [{ allow: "public" }];
        expect(canAccess(null, entity, rules)).toBe(true);
    });

    it("autorise l'accès privé uniquement pour un utilisateur authentifié", () => {
        const rules: AuthRule[] = [{ allow: "private" }];
        expect(canAccess(user, entity, rules)).toBe(true);
        expect(canAccess(null, entity, rules)).toBe(false);
    });

    it("refuse pour une règle inconnue", () => {
        const rules = [{ allow: "custom" }] as AuthRule[];
        expect(canAccess(user, entity, rules)).toBe(false);
    });

    it("refuse en absence de règles", () => {
        expect(canAccess(user, entity)).toBe(false);
    });
});
