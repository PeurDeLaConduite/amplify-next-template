"use client";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import EntitySection from "./shared/EntitySection";
import PersonIcon from "@mui/icons-material/Person";
import { createUserName, updateUserName, getUserName, deleteUserName } from "@src/entities";
import { MinimalUserName, normalizeUserName, fieldLabel } from "./utilsUserName";

export default function UserNameManager() {
    const { user } = useAuthenticator();
    const sub = user?.userId ?? user?.username;
    if (!user) return <Authenticator />;

    const fetchUserName = async () => {
        if (!sub) return null;
        const item = await getUserName(sub);
        if (!item) return null;
        const data: MinimalUserName & { id?: string } = {
            userName: item.userName ?? "",
        };
        return data;
    };

    return (
        <EntitySection<MinimalUserName>
            title="Mon pseudo public"
            fields={["userName"]}
            labels={fieldLabel}
            initialData={normalizeUserName()}
            fetch={fetchUserName}
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
                await deleteUserName(sub);
                const after = await getUserName(sub);
                console.log("Après suppression, record UserName:", after); // Doit être null si bien supprimé
            }}
            requiredFields={["userName"]}
            renderIcon={() => <PersonIcon fontSize="small" className="text-gray-800" />}
            // Si tu utilises la nouvelle version du hook useEntityManager, tu pourras aussi passer fetchData pour refresh à la demande
        />
    );
}
