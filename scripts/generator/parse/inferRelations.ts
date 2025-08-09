// scripts/generator/parse/inferRelations.ts
import { ModelMeta, RelationsMap, RelationDef, Assoc } from "../types";
import pluralize from "pluralize";
import { lower, singular, kebab } from "../utils/naming";

export function inferRelations(manifest: ModelMeta[]) {
    const models = manifest.filter((m) => m.type === "model");
    const byName = Object.fromEntries(models.map((m) => [m.name, m]));

    // Pivot = modèle avec exactement 2 belongsTo ET un identifier composite à 2 clés
    const pivots = models.filter((m) => {
        const belongsToCount = m.assocs.filter((a) => a.kind === "belongsTo").length;
        const hasCompositeId2 = Array.isArray(m.identifier) && m.identifier.length === 2;
        return belongsToCount === 2 && hasCompositeId2;
    });

    const pivotNames = new Set(pivots.map((p) => p.name));
    const relations: RelationsMap = {};

    const addRel = (model: string, relName: string, def: RelationDef) => {
        relations[model] ??= {};
        relations[model][relName] = def;
    };

    // N↔N à partir des pivots
    for (const p of pivots) {
        const belongs = p.assocs.filter((a) => a.kind === "belongsTo") as Extract<
            Assoc,
            { kind: "belongsTo" }
        >[];
        const [A, B] = belongs; // A: parentKey, B: childKey (peu importe l'ordre, on couvre les deux côtés)
        addRel(A.target, pluralize(lower(B.target)), {
            kind: "manyToMany",
            through: p.name,
            parentKey: A.fk,
            childKey: B.fk,
            child: B.target,
        });
        addRel(B.target, pluralize(lower(A.target)), {
            kind: "manyToMany",
            through: p.name,
            parentKey: B.fk,
            childKey: A.fk,
            child: A.target,
        });
    }

    // 1→N (hasMany + back belongsTo) — ignorer si la cible est un pivot
    for (const m of models) {
        for (const a of m.assocs) {
            if (a.kind !== "hasMany") continue;
            if (pivotNames.has(a.target)) continue; // un hasMany vers pivot sera géré par manyToMany
            const child = byName[a.target];
            const back = child?.assocs.some(
                (b) => b.kind === "belongsTo" && b.target === m.name && b.fk === a.targetFk
            );
            if (back) {
                addRel(m.name, pluralize(lower(a.target)), {
                    kind: "hasMany",
                    child: a.target,
                    childFk: a.targetFk,
                });
            }
        }
    }

    return { relations, pivots: Array.from(pivotNames) };
}
