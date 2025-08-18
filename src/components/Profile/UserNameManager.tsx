// src/app/profile/UserNameManager.tsx
"use client";
import { useEffect } from "react";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import EntityEditor from "@components/forms/EntityEditor";
import { label as fieldLabel } from "./utilsUserName";
import PersonIcon from "@mui/icons-material/Person";
import { useUserNameForm } from "@entities/models/userName/hooks";
import { onUserNameUpdated } from "@entities/models/userName/bus"; // ← optionnel
import { type UserNameFormType, type UserNameUpdateInput } from "@entities/models/userName/types";

const fields: (keyof UserNameFormType)[] = ["userName"];

export default function UserNameManager() {
    const { user } = useAuthenticator();
    const manager = useUserNameForm();

    // 🔄 Charger/rafraîchir au montage et quand l'utilisateur change
    useEffect(() => {
        if (user) void manager.refresh();
    }, [user, manager.refresh]); // ✅ dépend seulement de la fonction stable

    // 🔔 (optionnel) se resynchroniser si un autre écran met à jour le pseudo
    useEffect(() => {
        const unsub = onUserNameUpdated(() => {
            void manager.refresh();
        });
        return unsub;
    }, [manager.refresh]);

    if (!user) return <Authenticator />;

    return (
        <EntityEditor<UserNameFormType>
            title="Mon pseudo public"
            requiredFields={["userName"]}
            deleteLabel="Supprimer le pseudo"
            renderIcon={() => <PersonIcon fontSize="small" className="text-gray-800" />}
            onClearField={(field, clear) => {
                if (
                    confirm(
                        `Supprimer le contenu du champ "${fieldLabel(field as keyof UserNameUpdateInput)}" ?`
                    )
                ) {
                    void clear(field);
                }
            }}
            form={manager.form}
            mode={manager.mode}
            dirty={manager.dirty}
            // Typage propre : pas besoin de cast si UserNameFormType est correct
            handleChange={
                manager.handleChange as (field: keyof UserNameFormType, value: unknown) => void
            }
            submit={manager.submit} // submit refetch via useModelForm + event-bus côté hook
            reset={manager.reset}
            setForm={manager.setForm}
            fields={fields}
            labels={fieldLabel as (field: keyof UserNameFormType) => string}
            saveField={manager.saveField} // saveField → refresh + event-bus
            clearField={manager.clearField}
            deleteEntity={manager.remove} // remove → refresh + event-bus
        />
    );
}
