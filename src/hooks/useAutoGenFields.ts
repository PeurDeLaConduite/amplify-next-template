// Nouvelle version du hook (dans le fichier useAutoGenFields.ts) :

import { useState, useEffect } from "react";

type AutoGenConfig = {
    editingKey: string; // ex: "title" ou "description"
    source: string;
    /** Valeur actuelle du champ cible */
    current: string;
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

    // Génération automatique (avec délai)
    useEffect(() => {
        const timer = setTimeout(() => {
            configs.forEach((cfg) => {
                if (isEditing[cfg.editingKey] && autoFlags[cfg.target]) {
                    const value = cfg.transform ? cfg.transform(cfg.source) : cfg.source;
                    if (value !== cfg.current) {
                        cfg.setter(value ?? "");
                    }
                }
            });
        }, 200);

        return () => {
            clearTimeout(timer);
        };
    }, [configs, autoFlags, isEditing]);

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
