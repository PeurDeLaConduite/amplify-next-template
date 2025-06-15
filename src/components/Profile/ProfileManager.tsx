"use client";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from "@aws-amplify/ui-react";
import type { Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import EditSingleField from "./EditSingleField";
import ReadOnlyProfileView from "./ReadOnlyProfileView";
import ProfileForm from "./ProfileForm";
import { label as fieldLabel, normalizeFormData } from "./utilsProfile";
import { DeleteButton } from "@/src/components/buttons/Buttons";
Amplify.configure(outputs);
const client = generateClient<Schema>();
import { useAuth } from "@/src/context/AuthContext";
export default function ProfileManager() {
    const { user } = useAuthenticator();
    const { refreshProfile } = useAuth();
    const [profile, setProfile] = useState<Schema["UserProfile"]["type"] | null>(null);

    const [formData, setFormData] = useState(() => normalizeFormData({}));

    const [editMode, setEditMode] = useState(false);
    const [editModeField, setEditModeField] = useState<{
        field: keyof typeof formData;
        value: string;
    } | null>(null);

    // 🔁 Sync du profil temps-réel

    useEffect(() => {
        if (!user) return;

        const sub = client.models.UserProfile.observeQuery().subscribe({
            next: ({ items }) => {
                const item = items[0] ?? null;
                setProfile(item);

                if (item && !editMode) {
                    const normalized = {
                        firstName: item.firstName ?? "",
                        familyName: item.familyName ?? "",
                        address: item.address ?? "",
                        postalCode: item.postalCode ?? "",
                        city: item.city ?? "",
                        country: item.country ?? "",
                        phoneNumber: item.phoneNumber ?? "",
                    };
                    setFormData(normalized);

                    // Mise à jour du cookie
                    Cookies.set("userProfile", JSON.stringify(normalized), {
                        expires: 7,
                        secure: true,
                        sameSite: "Strict",
                    });

                    /*

                    Cookies.set("userProfile", JSON.stringify(normalized), {
                        domain: ".peur-de-la-conduite.fr", 
                        path: "/",
                        secure: true,
                        sameSite: "None", 
                        expires: 7,
                    });

                    */

                    // --- APPEL DU REFRESH ICI ---
                    refreshProfile();
                }
            },
        });

        return () => sub.unsubscribe();
    }, [user, editMode, refreshProfile]);

    // 🔧 Gestion des champs de formulaire
    const handleChange = ({ target: { name, value } }: React.ChangeEvent<HTMLInputElement>) =>
        setFormData((f) => ({ ...f, [name]: value }));

    // 💾 Enregistrer (création ou édition globale)
    const saveProfile = async () => {
        try {
            if (profile) {
                await client.models.UserProfile.update({
                    id: profile.id,
                    ...formData,
                });
                alert("Profil mis à jour ✔");
            } else {
                await client.models.UserProfile.create({ ...formData });
                alert("Profil créé ✔");
            }
            setEditMode(false);
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la sauvegarde");
        }
    };

    // 💾 Mise à jour d’un champ unique
    const saveSingleField = async () => {
        if (!profile || !editModeField) return;
        const { field, value } = editModeField;
        try {
            await client.models.UserProfile.update({
                id: profile.id,
                [field]: value,
            });
            setEditModeField(null);
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la mise à jour");
        }
    };

    // ❌ Vider un champ
    const clearField = async (field: keyof typeof formData) => {
        if (!profile) return;
        if (!confirm(`Supprimer le contenu du champ "${fieldLabel(field)}" ?`)) return;
        try {
            await client.models.UserProfile.update({
                id: profile.id,
                [field]: "",
            });
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la suppression du champ");
        }
    };

    // 🗑️ Supprimer le profil
    const deleteProfile = async () => {
        if (!profile) return;
        if (!confirm("Supprimer définitivement votre profil ?")) return;
        try {
            await client.models.UserProfile.delete({ id: profile.id });
            alert("Profil supprimé ✔");
            setFormData({
                firstName: "",
                familyName: "",
                address: "",
                postalCode: "",
                city: "",
                country: "",
                phoneNumber: "",
            });
            setEditMode(false);
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la suppression");
        }
    };

    // 👤 Utilisateur non connecté
    if (!user) return null;

    return (
        <section className="w-full max-w-md mx-auto px-4 py-6 sm:px-6 sm:py-8 bg-white shadow-sm rounded-lg mb-8">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Mon profil</h1>

            {/* 👁️ Lecture seule */}
            {!editMode && profile && !editModeField && (
                <ReadOnlyProfileView
                    profile={profile}
                    onEditField={setEditModeField}
                    onClearField={clearField}
                    label={fieldLabel}
                />
            )}

            {/* 📝 Édition d’un champ unique */}
            {editModeField && (
                <EditSingleField
                    editModeField={editModeField}
                    setEditModeField={setEditModeField}
                    saveSingleField={saveSingleField}
                    label={fieldLabel}
                />
            )}

            {/* 🆕 Création ou édition complète */}
            {(editMode || !profile) && !editModeField && (
                <ProfileForm
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={saveProfile}
                    isEdit={!!profile}
                    onCancel={() => {
                        setEditMode(false);
                        setFormData({
                            firstName: profile?.firstName ?? "",
                            familyName: profile?.familyName ?? "",
                            address: profile?.address ?? "",
                            postalCode: profile?.postalCode ?? "",
                            city: profile?.city ?? "",
                            country: profile?.country ?? "",
                            phoneNumber: profile?.phoneNumber ?? "",
                        });
                    }}
                />
            )}

            {/* ❌ Supprimer le profil */}
            {profile && !editMode && !editModeField && (
                <div className="flex items-center justify-center mt-8">
                    <DeleteButton onClick={deleteProfile} label={"Supprimer le profil"} />
                </div>
            )}
        </section>
    );
}
