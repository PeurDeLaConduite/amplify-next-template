// src/entities/core/services/amplifyClient.ts

import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { AuthModeStrategyType } from "@aws-amplify/datastore";
import outputs from "@/amplify_outputs.json";
import type { Schema } from "@/amplify/data/resource";

Amplify.configure(outputs);
export const client = generateClient<Schema>({
    authModeStrategyType: AuthModeStrategyType.MULTI,
});
export type { Schema } from "@/amplify/data/resource";
