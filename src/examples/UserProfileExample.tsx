"use client";

// @ts-nocheck
/* eslint-disable */

// Exemple d'utilisation du composant EntitySection pour l'entité UserProfile
import EntitySection from "@/src/components/shared/EntitySection";
import type { MinimalProfile } from "@/src/components/Profile/utilsProfile";
import { label as profileLabel } from "@/src/components/Profile/utilsProfile";
import {
    createUserProfile,
    updateUserProfile,
    deleteUserProfile,
    observeUserProfile,
} from "@/src/services";

// Définition des champs gérés par la section
const fields: (keyof MinimalProfile)[] = [
    "firstName",
    "familyName",
    "address",
    "postalCode",
    "city",
    "country",
    "phoneNumber",
];

export default function UserProfileExample() {
    const sub = "user-sub"; // identifiant de l'utilisateur courant

    return (
        <EntitySection<MinimalProfile>
            title="Profil utilisateur"
            fields={fields}
            labels={profileLabel}
            service={{
                // Abonnement temps réel au profil
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                fetch: (setData: (data: any) => void) => observeUserProfile(sub, setData),
                // Création d'un nouveau profil
                create: (data: MinimalProfile) => createUserProfile(sub, data),
                // Mise à jour partielle du profil existant
                update: (entity: { id: string }, data: Partial<MinimalProfile>) =>
                    updateUserProfile(entity.id, data),
                // Suppression du profil
                remove: (entity: { id: string }) => deleteUserProfile(entity.id),
            }}
        />
    );
}
