// src/entities/user/hooks.ts
import { createEntityHooks } from "@src/entities/createEntityHooks";
import { fieldLabel, MinimalUserName } from "@src/components/Profile/utilsUserName";
import {
    getUserName,
    createUserName,
    updateUserName,
    deleteUserName,
} from "@src/entities/models/userName/service";

export const useUserNameManager = createEntityHooks<MinimalUserName>({
    model: "UserName",
    fields: ["userName"],
    labels: fieldLabel,
    service: {
        get: getUserName,
        create: (id, data) => createUserName(id, data.userName).then(() => {}),
        update: (id, data) => updateUserName(id, data.userName ?? "").then(() => {}),
        delete: (id) => deleteUserName(id).then(() => {}),
    },
});
