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
import { label as fieldLabel, normalizeFormData, MinimalProfile } from "./utilsProfile";
import { DeleteButton } from "@/src/components/buttons/Buttons";
import { useUserName } from "@/src/hooks/useUserName";

Amplify.configure(outputs);
const client = generateClient<Schema>();

export default function ProfileManager() {
    const { user } = useAuthenticator();
    const { userName, updateUserName } = useUserName();
    const [profile, setProfile] = useState<Schema["UserProfile"]["type"] | null>(null);

    // Centralise tout dans un seul formData (profil + pseudo)
    const [formData, setFormData] = useState<MinimalProfile>(() => normalizeFormData({}));

    const [editMode, setEditMode] = useState(false);
    const [editModeField, setEditModeField] = useState<{
        field: keyof typeof formData;
        value: string;
    } | null>(null);

    // Synchronise userName dès qu'il change
    useEffect(() => {
        setFormData((f) => ({ ...f, userName: userName ?? "" }));
    }, [userName]);

    // Charger le profil principal (UserProfile) et fusionner dans formData
    useEffect(() => {
        if (!user) return;
        const sub = client.models.UserProfile.observeQuery().subscribe({
            next: ({ items }) => {
                const item = items[0] ?? null;
                setProfile(item);

                if (item && !editMode) {
                    const normalized = {
                        ...formData,
                        firstName: item.firstName ?? "",
                        familyName: item.familyName ?? "",
                        address: item.address ?? "",
                        postalCode: item.postalCode ?? "",
                        city: item.city ?? "",
                        country: item.country ?? "",
                        phoneNumber: item.phoneNumber ?? "",
                    };
                    setFormData(normalized);

                    Cookies.set("userProfile", JSON.stringify(normalized), {
                        expires: 7,
                        secure: true,
                        sameSite: "Strict",
                    });
                }
            },
        });

        return () => sub.unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, editMode]);

    // Champ universel
    const handleChange = ({ target: { name, value } }: React.ChangeEvent<HTMLInputElement>) =>
        setFormData((f) => ({ ...f, [name]: value }));

    // Enregistrer tout le profil (profil + pseudo)
    const saveProfile = async () => {
        try {
            const { userName: formUserName, ...userProfileData } = formData;
            // 1. UserProfile
            if (profile) {
                await client.models.UserProfile.update({
                    id: profile.id,
                    ...userProfileData,
                });
            } else {
                await client.models.UserProfile.create({ ...userProfileData });
            }
            // 2. UserName (si fourni et différent de l’actuel)
            if (formUserName && formUserName !== userName) {
                await updateUserName(formUserName);
            }
            alert("Profil et pseudo public enregistrés ✔");
            setEditMode(false);
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la sauvegarde");
        }
    };

    // Mise à jour d'un champ unique (profil ou userName)
    const saveSingleField = async () => {
        if (!profile || !editModeField) return;
        const { field, value } = editModeField;
        try {
            if (field === "userName") {
                await updateUserName(value);
                setFormData((f) => ({
                    ...f,
                    userName: value,
                }));
            } else {
                await client.models.UserProfile.update({
                    id: profile.id,
                    [field]: value,
                });
                setFormData((f) => ({
                    ...f,
                    [field]: value,
                }));
            }
            setEditModeField(null);
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la mise à jour");
        }
    };

    // Efface un champ
    const clearField = async (field: keyof typeof formData) => {
        if (!profile) return;
        if (!confirm(`Supprimer le contenu du champ "${fieldLabel(field)}" ?`)) return;
        try {
            if (field === "userName") {
                await updateUserName("");
                setFormData((f) => ({ ...f, userName: "" }));
            } else {
                await client.models.UserProfile.update({
                    id: profile.id,
                    [field]: "",
                });
                setFormData((f) => ({ ...f, [field]: "" }));
            }
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la suppression du champ");
        }
    };

    // Suppression
    const deleteProfile = async () => {
        if (!profile) return;
        if (!confirm("Supprimer définitivement votre profil ?")) return;
        try {
            // 1. Supprimer UserProfile
            await client.models.UserProfile.delete({ id: profile.id });

            // 2. Supprimer aussi UserName si présent
            if (userName) {
                await updateUserName("");
            }

            alert("Profil et pseudo public supprimés ✔");
            setFormData({
                userName: "",
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

    if (!user) return null;

    return (
        <section className="w-full max-w-md mx-auto px-4 py-6 sm:px-6 sm:py-8 bg-white shadow-sm rounded-lg mb-8">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Mon profil</h1>
            {/* 👁️ Lecture seule */}
            {!editMode && profile && !editModeField && (
                <ReadOnlyProfileView
                    profile={formData}
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
                            ...formData,
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
