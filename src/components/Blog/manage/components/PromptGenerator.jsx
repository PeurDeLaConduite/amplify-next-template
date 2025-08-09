"use client";
import React from "react";

// Ta liste de services
const SERVICES = [
    "Gestion du stress avant examen",
    "Gestion des situations de conduite difficiles",
    "Conduite accompagnée ou supervisée",
    "Coaching Concentration",
    "Maîtrise de la trajectoire",
    "Peur de la conduite (Amaxophobie)",
    "Perfectionnement de la Conduite",
];

// Génération du prompt amélioré
function makePrompt(textSource) {
    return `
  Tu es un rédacteur expert en blogging pédagogique sur la conduite et la gestion du stress au volant.
  Intègre, sans jamais les énumérer, les services suivants :
  ${SERVICES.map((s) => `- ${s}`).join("\\n")}
  
  À partir du texte source ci-dessous, renvoie **uniquement** un objet JSON valide ayant les clés :
  
  - **title**   : titre accrocheur  
  - **excerpt** : phrase d’accroche (≤ 150 caractères)  
  - **content** : corps de l’article au format Markdown avec **cinq** sections. Pour chaque section :  
    - un titre de niveau 2 vraiment personnalisé ; il **ne doit contenir** aucun des mots suivants : « Introduction », « Causes », « Conseils », « Conclusion ».  
      *Exemple :* \`## Des premiers tours de roue en toute sérénité\`  
    - immédiatement après, un paragraphe de 2 à 3 phrases qui développe l’idée.  
  - **tags**    : tableau de mots-clés  
  - **seo**     :  
    - **title**       (≤ 60 caractères)  
    - **description** (≤ 155 caractères)
  
  **Ordre sémantique à suivre dans _content_** :  
  1. Introduction rassurante  
  2. Causes traumatiques  
  3. Causes techniques  
  4. Conseils pratiques  
  5. Conclusion motivante  
  
  **Contraintes supplémentaires** :  
  - Le champ **content** commence par la première section renommée avec son titre personnalisé.  
  - N’ajoute aucun texte, balise ou console.log en dehors de l’objet JSON.  
  - Optimise naturellement pour : « peur de la conduite » et « progresser au volant ».  
  - Le JSON retourné doit être strictement valide (guillemets doubles, pas de virgule finale).
  
  **Texte source**  
\`\`\`
  ${textSource}
\`\`\`
  `.trim();
}

export default function PromptGenerator({ textSource, onGenerate, generatedPrompt, onCopyPrompt }) {
    const handleGenerate = () => {
        onGenerate(makePrompt(textSource));
    };
    return (
        <section className="bg-white rounded-xl shadow p-4 mb-6">
            <h3 className="text-lg font-semibold mb-2">Générateur de prompt ChatGPT</h3>
            <textarea
                className="w-full min-h-32 border rounded px-3 py-2 mb-2"
                placeholder="Collez ici le texte source de ta vidéo…"
                value={textSource}
                readOnly
            />
            <button
                onClick={handleGenerate}
                disabled={!textSource.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mb-4"
            >
                Générer le prompt
            </button>

            {generatedPrompt && (
                <>
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Prompt généré :</span>
                        <button
                            onClick={onCopyPrompt}
                            className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 text-sm"
                        >
                            Copier le prompt
                        </button>
                    </div>
                    <textarea
                        readOnly
                        className="w-full min-h-32 border rounded px-3 py-2 font-mono bg-gray-50"
                        value={generatedPrompt}
                    />
                </>
            )}
        </section>
    );
}
