// src/lib/userNameService.ts
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";
import { Amplify } from "aws-amplify";

Amplify.configure(outputs);
const client = generateClient<Schema>();

/**
 * Crée un nouveau record UserName pour l'utilisateur  
 * @param sub  Sub Cognito (id du user)  
 * @param name Le pseudo à créer  
 */
export async function createUserName(sub: string, name: string) {
  return client.models.UserName.create({
    id: sub,
    userName: name,
    owner: sub,
  });
}

/**
 * Met à jour le record UserName existant  
 * @param sub  Sub Cognito (id du user)  
 * @param name Le pseudo à mettre à jour  
 */
export async function updateUserName(sub: string, name: string) {
  return client.models.UserName.update({
    id: sub,
    userName: name,
    owner: sub,
  });
}

/**
 * Récupère le pseudo courant (ou renvoie null)  
 * @param sub Sub Cognito  
 */
export async function getUserName(sub: string) {
  const { data } = await client.models.UserName.get({ id: sub });
  return data?.userName ?? null;
}
