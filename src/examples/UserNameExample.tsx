"use client";


// Exemple d'utilisation du composant EntitySection pour l'entité UserName
// @ts-expect-error Le composant est fourni par l'architecture finale
// @ts-nocheck
/* eslint-disable */
import EntitySection from "@/src/components/shared/EntitySection";
import type { UserNameData } from "@/src/components/Profile/utilsUserName";
import { fieldLabel } from "@/src/components/Profile/utilsUserName";
import { createUserName, updateUserName, getUserName } from "@/src/services";

const fields: (keyof UserNameData)[] = ["userName"];

export default function UserNameExample() {
    const sub = "user-sub";

    return (
        <EntitySection<UserNameData>
            title="Pseudo public"
            fields={fields}
            labels={fieldLabel}
            service={{
                // Récupération initiale du pseudo
                fetch: async (setData: (data: { id: string; userName: string }) => void) => {
                    const current = await getUserName(sub);
                    setData({ id: sub, userName: current ?? "" });
                },
                // Création du pseudo
                create: (data: UserNameData) => createUserName(sub, data.userName),
                // Mise à jour du pseudo
                update: (entity: { id: string }, data: UserNameData) =>
                    updateUserName(entity.id, data.userName),
                // Suppression du pseudo (exemple)
                remove: () => Promise.resolve(),
            }}
        />
    );
}
