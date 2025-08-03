import React from "react";
import { EditButton } from "@/src/components/buttons/Buttons";
import PersonIcon from "@mui/icons-material/Person";
import type { UserNameData } from "./utilsUserName";

const Icon = () => <PersonIcon fontSize="small" className="text-gray-800" />;

type Props = {
    profile: Partial<UserNameData>;
    fields: (keyof UserNameData)[];
    label: (field: keyof UserNameData) => string;
    onEditField: (edit: { field: keyof UserNameData; value: string }) => void;
    title?: string;
};

export default function ReadOnlyUserNameView({
    profile,
    fields,
    label,
    onEditField,
    title = "Gestion du pseudo public",
}: Props) {
    return (
        <div className="max-w-3xl mx-auto px-4 py-6 bg-violet-100 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">{title}</h2>

            <div className="space-y-6">
                {fields.map((field) => {
                    const value = profile[field] ?? "";
                    return (
                        <div key={field} className="bg-white rounded-lg shadow-md px-4 py-5">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-gray-800 font-semibold flex items-center gap-2 select-none">
                                    <Icon /> <span>{label(field)}</span>
                                </label>

                                <EditButton
                                    onClick={() => onEditField({ field, value })}
                                    className="!w-8 !h-8"
                                    color="#1976d2"
                                />
                            </div>

                            {value ? (
                                <p className="text-base text-gray-900 break-words">{value}</p>
                            ) : (
                                <p className="text-sm text-gray-400 italic">
                                    Information non disponible
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
