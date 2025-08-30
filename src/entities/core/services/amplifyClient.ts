// src/entities/core/services/amplifyClient.ts

import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import outputs from "@/amplify_outputs.json";
import type { Schema } from "@/amplify/data/resource";

// La configuration Amplify peut être absente dans les environnements de build.
Amplify.configure(outputs);

let generatedClient: ReturnType<typeof generateClient<Schema>>;
try {
    generatedClient = generateClient<Schema>();
} catch {
    // Fournit un client factice lorsque la configuration est incomplète.
    generatedClient = {} as unknown as ReturnType<typeof generateClient<Schema>>;
}

export const client = generatedClient;
export type { Schema } from "@/amplify/data/resource";
