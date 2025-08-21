import { describe, it, expect } from "vitest";
import { faker } from "@faker-js/faker";
import { toUserNameForm, toUserNameCreate, toUserNameUpdate } from "@entities/models/userName/form";
import type { UserNameType, UserNameFormType } from "@entities/models/userName/types";

describe("toUserNameForm", () => {
    it("convertit UserNameType en UserNameFormType", () => {
        const userName = {
            id: faker.string.uuid(),
            userName: faker.internet.username(),
        } as unknown as UserNameType;

        const commentsIds = [faker.string.uuid()];
        const postCommentsIds = [faker.string.uuid()];
        const form = toUserNameForm(userName, commentsIds, postCommentsIds);
        expect(form).toEqual({
            id: userName.id,
            userName: userName.userName,
            commentsIds,
            postCommentsIds,
        });
    });
});

describe("toUserNameCreate / toUserNameUpdate", () => {
    it("conserve id et supprime commentsIds et postCommentsIds", () => {
        const form: UserNameFormType = {
            id: faker.string.uuid(),
            userName: faker.internet.username(),
            commentsIds: [faker.string.uuid()],
            postCommentsIds: [faker.string.uuid()],
        };

        const expectedCreate = { id: form.id, userName: form.userName };
        const expectedUpdate = { userName: form.userName };
        expect(toUserNameCreate(form)).toEqual(expectedCreate);
        expect(toUserNameUpdate(form)).toEqual(expectedUpdate);
    });
});
