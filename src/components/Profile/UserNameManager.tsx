"use client";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import EntitySection from "../shared/EntitySection";
import PersonIcon from "@mui/icons-material/Person";
import { createUserName, updateUserName, getUserName } from "@src/entities";
import { MinimalUserName, normalizeUserName, fieldLabel } from "./utilsUserName";

export default function UserNameManager() {
    const { user } = useAuthenticator();
    const sub = user?.userId ?? user?.username;
    if (!user) return <Authenticator />;

    return (
        <EntitySection<MinimalUserName>
            title="Mon pseudo public"
            fields={["userName"]}
            labels={fieldLabel}
            initialData={normalizeUserName()}
            fetch={async () => {
                if (!sub) return null;
                const name = await getUserName(sub);
                return name ? { userName: name } : null;
            }}
            create={async (data) => {
                if (!sub) return;
                await createUserName(sub, data.userName);
            }}
            update={async (_entity, data) => {
                if (!sub) return;
                await updateUserName(sub, data.userName ?? "");
            }}
            remove={async () => {
                if (!sub) return;
                await updateUserName(sub, "");
            }}
            requiredFields={["userName"]}
            renderIcon={() => <PersonIcon fontSize="small" className="text-gray-800" />}
        />
    );
}
