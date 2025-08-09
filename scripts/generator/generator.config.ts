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
        myTypes: "@myTypes/amplifyBaseTypes",
        createModelForm: "@src/entities/core/createModelForm",
        crudService: "@src/services",
        relationService: "@src/entities/core/services/relationService",
        createEntityHooks: "@src/entities/core/createEntityHooks",
        customTypeFormDir: (refType: string) =>
            `@src/entities/customTypes/${refType.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()}/form`,
    },
    rules: {
        includeIdInForm: false,
        omitSystemFields: true,
        exposeHasManyIds: {} as Record<string, string[]>,
    },
} as const;
