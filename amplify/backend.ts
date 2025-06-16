import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource.js";
import { data } from "./data/resource.js";
import { deleteTodoWithComments } from "./functions/delete-todo/resource.js"; // 👈

defineBackend({
    auth,
    data,
    deleteTodoWithComments, // 👈 N'OUBLIE PAS
});
