export const GEN = {
    schemaRel: "amplify/data/resource.ts",
    tsconfigRel: "tsconfig.json",
    out: {
        models: "src/entities/models",
        customTypes: "src/entities/customTypes",
        introspection: "src/entities/introspection",
        relations: "src/entities/relations",
    },
    paths: {
        myTypes: "@entities/core",
        createModelForm: "@entities/core",
        crudService: "@entities/core",
        relationService: "@entities/core",
        createEntityHooks: "@entities/core/createEntityHooks",
        customTypeFormDir: (refType: string) =>
            `@entities/customTypes/${refType.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()}/form`,
    },
    rules: {
        includeIdInForm: false,
        omitSystemFields: true,
        exposeHasManyIds: {} as Record<string, string[]>,
    },
} as const;
