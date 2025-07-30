// Nouvelle version du hook (dans le fichier useAutoGenFields.ts) :

import { useState, useEffect } from "react";

type AutoGenConfig = {
    editingKey: string; // ex: "title" ou "description"
    source: string;
    target: string;
    setter: (v: string) => void;
    transform?: (s: string) => string;
};

type UseAutoGenFieldsProps = {
    configs: AutoGenConfig[];
};

export function useAutoGenFields({ configs }: UseAutoGenFieldsProps) {
    // autoFlags pour chaque cible (slug, seo.title, seo.description…)
    const [autoFlags, setAutoFlags] = useState(
        configs.reduce((obj, c) => ({ ...obj, [c.target]: true }), {} as Record<string, boolean>)
    );
    // édition indépendante de chaque champ source
    const [isEditing, setIsEditing] = useState<Record<string, boolean>>({});

    // Génération automatique
    useEffect(() => {
        configs.forEach((cfg) => {
            if (isEditing[cfg.editingKey] && autoFlags[cfg.target]) {
                const value = cfg.transform ? cfg.transform(cfg.source) : cfg.source;
                cfg.setter(value ?? "");
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        ...configs.map((c) => c.source),
        ...configs.map((c) => autoFlags[c.target]),
        ...configs.map((c) => isEditing[c.editingKey]),
    ]);

    function handleSourceFocus(key: string) {
        setIsEditing((prev) => ({ ...prev, [key]: true }));
    }
    function handleSourceBlur(key: string) {
        setIsEditing((prev) => ({ ...prev, [key]: false }));
    }
    function handleManualEdit(target: string) {
        setAutoFlags((f) => ({ ...f, [target]: false }));
    }

    return {
        autoFlags,
        handleSourceFocus,
        handleSourceBlur,
        handleManualEdit,
    };
}
export function slugify(text: string) {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[\s_]+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-");
}
