import { MinimalProfile } from "./utilsProfile";
import { EditButton, DeleteButton } from "@/src/components/buttons/Buttons";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";

function formatPhoneNumber(number?: string): string {
    if (!number) return "";
    return number.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
}

type Props = {
    profile: Partial<MinimalProfile>;
    label: (field: keyof MinimalProfile) => string;
    onEditField: (edit: { field: keyof MinimalProfile; value: string }) => void;
    onClearField: (field: keyof MinimalProfile) => void;
};

export default function ReadOnlyProfileView({ profile, onEditField, onClearField, label }: Props) {
    const fields: (keyof MinimalProfile)[] = [
        "userName",
        "firstName",
        "familyName",
        "phoneNumber",
        "address",
        "postalCode",
        "city",
        "country",
    ];

    function getIcon(field: keyof MinimalProfile) {
        switch (field) {
            case "phoneNumber":
                return <PhoneIcon fontSize="small" className="text-gray-800" />;
            case "firstName":
            case "userName":
            case "familyName":
                return <PersonIcon fontSize="small" className="text-gray-800" />;
            case "address":
            case "postalCode":
            case "city":
            case "country":
                return <HomeIcon fontSize="small" className="text-gray-800" />;
            default:
                return null;
        }
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-6 sm:px-6 sm:py-8 bg-violet-100 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-left">
                Gestion du profil
            </h2>

            <div className="space-y-6">
                {fields.map((field) => {
                    const value = profile[field];

                    return (
                        <div
                            key={field}
                            className="bg-white rounded-lg shadow-md px-4 py-5 sm:px-5 sm:py-4"
                        >
                            {/* Ligne du label et des actions */}
                            <div className="flex items-center justify-between mb-0 sm:mb-2 ">
                                <label
                                    className="text-gray-800 font-semibold flex items-center gap-2 select-none cursor-default"
                                    title={`Modifier ${label(field)}`}
                                >
                                    {getIcon(field)}{" "}
                                    <span className="capitalize">{label(field)}</span>
                                </label>

                                <div className="flex gap-2">
                                    <EditButton
                                        onClick={() =>
                                            onEditField({
                                                field,
                                                value: value || "",
                                            })
                                        }
                                        className="!w-8 !h-8"
                                        color="#1976d2"
                                    />
                                    {value && (
                                        <DeleteButton
                                            onClick={() => onClearField(field)}
                                            className="!w-8 !h-8"
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Valeur ou message d’absence */}
                            <div>
                                {field === "phoneNumber" && value ? (
                                    <a
                                        href={`tel:${value}`}
                                        className="text-base text-gray-900 hover:underline break-all"
                                    >
                                        {formatPhoneNumber(value)}
                                    </a>
                                ) : value ? (
                                    <p className="text-base text-gray-900 break-words">{value}</p>
                                ) : (
                                    <p className="text-sm text-gray-400 italic font-light">
                                        {field === "phoneNumber"
                                            ? "Numéro non renseigné"
                                            : "Information non disponible"}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
