// src/entities/core/services/amplifyClient.ts

import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import outputs from "@/amplify_outputs.json";
import type { Schema } from "@/amplify/data/resource";

Amplify.configure(outputs);
export const client = generateClient<Schema>();
export type { Schema } from "@/amplify/data/resource";
