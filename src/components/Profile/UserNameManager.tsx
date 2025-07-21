// "use client";

// import React, { useState, useEffect } from "react";
// import { Amplify, Auth } from "aws-amplify";
// import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
// import "@aws-amplify/ui-react/styles.css";
// import { generateClient } from "aws-amplify/data";
// import type { Schema } from "@/amplify/data/resource";
// import outputs from "@/amplify_outputs.json";
// // import { Button } from "@/src/components/buttons";

// // 1) Configure Amplify
// Amplify.configure(outputs);

// // 2) Génère un client qui forcera le mode User Pools sur mutations
// const client = generateClient<Schema>({
//     defaultAuthMode: "AMAZON_COGNITO_USER_POOLS",
//     authModeStrategies: async () => {
//         const session = await Auth.currentSession();
//         return {
//             type: "AMAZON_COGNITO_USER_POOLS",
//             jwtToken: session.getAccessToken().getJwtToken(),
//         };
//     },
// });

// export default function UserNameManager() {
//     const { user } = useAuthenticator();
//     const sub = user?.username; // par défaut, Amplify UI React place le sub Cognito dans `username`

//     const [currentName, setCurrentName] = useState<string>("");
//     const [draftName, setDraftName] = useState<string>("");
//     const [loading, setLoading] = useState<boolean>(false);

//     // 3) Au montage (ou quand l'user change), on fetch le UserName existant
//     useEffect(() => {
//         if (!sub) return;
//         setLoading(true);
//         client.models.UserName.get({ id: sub })
//             .then(({ data }) => {
//                 setCurrentName(data?.userName ?? "");
//             })
//             .catch(() => {
//                 // pas de record -> pas encore de userName
//                 setCurrentName("");
//             })
//             .finally(() => setLoading(false));
//     }, [sub]);

//     // 4) Création ou mise à jour en fonction de l'existence
//     const saveUserName = async () => {
//         if (!sub || !draftName.trim()) return;
//         setLoading(true);
//         try {
//             // on tente d'abord la MAJ
//             await client.models.UserName.update({
//                 id: sub,
//                 userName: draftName.trim(),
//                 owner: sub,
//             });
//         } catch (err: any) {
//             // si record introuvable -> on crée
//             const errMsg = err?.errors?.[0]?.message ?? err?.message;
//             if (err.name === "NotFound" || /not found/i.test(errMsg)) {
//                 await client.models.UserName.create({
//                     id: sub,
//                     userName: draftName.trim(),
//                     owner: sub,
//                 });
//             } else {
//                 console.error(err);
//                 alert("Erreur inattendue : " + errMsg);
//                 setLoading(false);
//                 return;
//             }
//         }
//         // on rafraîchit l'affichage
//         setCurrentName(draftName.trim());
//         setDraftName("");
//         setLoading(false);
//     };

//     // 5) UI
//     if (!user) {
//         return <Authenticator />;
//     }

//     return (
//         <div className="max-w-sm mx-auto p-4 bg-white shadow rounded">
//             <h2 className="text-xl font-semibold mb-4">Mon pseudo public</h2>

//             {loading ? (
//                 <p>Chargement…</p>
//             ) : (
//                 <>
//                     {currentName ? (
//                         <p className="mb-4">
//                             Votre pseudo actuel :{" "}
//                             <span className="font-bold text-blue-600">{currentName}</span>
//                         </p>
//                     ) : (
//                         <p className="mb-4 text-gray-600">
//                             Vous n’avez pas encore de pseudo public.
//                         </p>
//                     )}

//                     <div className="flex gap-2">
//                         <input
//                             type="text"
//                             placeholder="Nouveau pseudo"
//                             className="flex-1 border rounded p-2"
//                             value={draftName}
//                             onChange={(e) => setDraftName(e.target.value)}
//                             disabled={loading}
//                         />
//                         <button
//                             type="submit"
//                             // label={currentName ? "Mettre à jour" : "Créer"}
//                             onClick={saveUserName}
//                             disabled={loading || !draftName.trim()}
//                         >
//                             {currentName ? "Mettre à jour" : "Créer"}
//                         </button>
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// }
