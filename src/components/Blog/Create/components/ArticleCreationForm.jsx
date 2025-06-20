import React, { useState } from "react";
import Step from "./Step";
import EditableField from "./EditableField";
import SubtitlesDownloadButton from "./SubtitlesDownloadButton";
import PromptGenerator from "./PromptGenerator";
import AIResponseField from "./AIResponseField";

export default function ArticleCreationForm({ form, handleChange, onParseResponse }) {
    const [copied, setCopied] = useState(false);

    const hasUrl = !!form.videoUrl?.trim();
    const hasDownloaded = !!form.subtitleDownloaded;
    const hasSubtitles = !!form.subtitleSource?.trim();
    const hasPrompt = !!form.generatedPrompt?.trim();
    const hasContent = !!form.content?.trim();

    const handleCopyPrompt = () => {
        navigator.clipboard.writeText(form.generatedPrompt);
        setCopied(true);
    };

    return (
        <div className="mx-auto mb-8 bg-white rounded-2xl shadow p-6">
            <h2 className="text-2xl font-bold mb-6 text-blue-900">AI-Quick Article Generator</h2>
            <div className="mb-6 space-y-1">
                <Step number={1} done={hasUrl}>
                    Collez l’URL de la vidéo (YouTube)
                </Step>
                <Step number={2} done={hasDownloaded}>
                    Téléchargez les sous-titres
                </Step>
                <Step number={3} done={hasSubtitles}>
                    Collez les sous-titres
                </Step>
                <Step number={4} done={hasPrompt}>
                    Générez et copiez le prompt IA
                </Step>
                <Step number={5} done={hasContent}>
                    Collez la réponse de l’IA dans le contenu
                </Step>
            </div>

            {/* Étape 1 */}
            <EditableField
                label="URL de la vidéo"
                name="videoUrl"
                value={form.videoUrl}
                onChange={handleChange}
                placeholder="Collez ici l’URL de votre vidéo"
            />

            {/* Étape 2 */}
            <SubtitlesDownloadButton
                videoUrl={form.videoUrl}
                onDownload={() =>
                    handleChange({ target: { name: "subtitleDownloaded", value: true } })
                }
            />

            {/* Étape 3 */}
            {hasDownloaded && (
                <EditableField
                    label="Sous-titres (collez ici)"
                    name="subtitleSource"
                    value={form.subtitleSource || ""}
                    onChange={handleChange}
                    placeholder="Texte des sous-titres…"
                />
            )}

            {/* Étape 4 */}
            {hasSubtitles && (
                <PromptGenerator
                    textSource={form.subtitleSource}
                    generatedPrompt={form.generatedPrompt}
                    onGenerate={(p) =>
                        handleChange({ target: { name: "generatedPrompt", value: p } })
                    }
                    onCopyPrompt={handleCopyPrompt}
                />
            )}

            {/* Étape 5 */}
            {copied && onParseResponse && (
                <AIResponseField
                    value={form.content}
                    onChange={handleChange}
                    onParse={onParseResponse}
                />
            )}
        </div>
    );
}
