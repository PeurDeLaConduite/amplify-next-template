# 📖 Projet Test Amplify Data — Documentation pas-à-pas

## Index

1. [Étape 1 – Set up Amplify Data](#etape-1--set-up-amplify-data)

---

## Étape 1 – Set up Amplify Data

### 🎯 Objectif  
Configurer Amplify Data pour créer une API temps réel et une base NoSQL (DynamoDB) avec un schéma TypeScript-first, sécurisée par des règles d’authentification, prête à être consommée en front-end React/Next.js.

---

### 🚦 Prérequis

- Node.js **v18.16.0** ou +
- npm **v6.14.4** ou +
- git **v2.14.1** ou +

---

### 🛠️ Initialisation du backend

1. **Créer le projet Amplify**  
   ```bash
   npm create amplify@latest
   ```

2. **Structure générée**  
   Un fichier essentiel :  
   ```
   amplify/data/resource.ts
   ```
   C’est ici que tu déclares **tous tes modèles** (avec `a.model()`), requêtes custom, mutations, subscriptions, etc.

---

### 🧩 Exemple de schéma minimal

```ts
import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

const schema = a.schema({
  Todo: a.model({
      content: a.string(),
      isDone: a.boolean()
    })
    .authorization(allow => [allow.publicApiKey()]) // ⚠️ Accès public total (déconseillé en prod)
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: { expiresInDays: 30 }
  }
});
```
**Particularité Amplify Gen2 :**
- Chaque `a.model()` crée :  
  - 1 table DynamoDB  
  - Les API CRUD + abonnement temps réel  
  - Champs `createdAt`, `updatedAt` auto
- Règle `.authorization(allow => [allow.publicApiKey()])` = tout le monde peut tout faire (⚠️ à restreindre en prod !)

---

### 🚀 Déploiement (sandbox cloud)

```bash
npx ampx sandbox
```
- Déploie tout dans le cloud sandbox (par défaut)
- Génére **amplify_outputs.json** (URL API, clé API...)

---

### 🔗 Connexion du front à l’API

**1. Installer la lib Amplify côté front :**
```bash
npm add aws-amplify
```
**2. Configurer Amplify dans l’entrée de ton app :**
```js
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';
Amplify.configure(outputs);
```

---

### ✨ Points à retenir

- **Amplify Gen2** = schéma TypeScript-first + CRUD + subscriptions temps réel + auth ultra simple
- **API REST/GraphQL** générée automatiquement
- **DynamoDB** utilisé par défaut
- **Clé API** activée dans cet exemple (attention à la sécurité)
- **Fichier `resource.ts`** = single source of truth pour tout ton backend data

---

### 📌 Sommaire des particularités

- *Le modèle est déployé en NoSQL (DynamoDB)*
- *API GraphQL en temps réel auto-générée*
- *Champs systeme ajoutés (createdAt/updatedAt)*
- *Auth ultra flexible, mais attention au mode public en prod !*

---
