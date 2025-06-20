//@hooks/utilsFormFn.js

// Génère un slug à partir d'un titre
export function generateSlug(input = "") {
    return input
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

// Génère un ID du style "S1", "P3", "A2" selon le prefix et les items existants
export function generateCustomId(items, prefix) {
    const ids = items
        .map((item) => item.id)
        .filter((id) => typeof id === "string" && id.startsWith(prefix))
        .map((id) => parseInt(id.slice(1), 10))
        .filter((n) => !isNaN(n));
    const max = ids.length > 0 ? Math.max(...ids) : 0;
    return `${prefix}${max + 1}`;
}
