# 📖 Projet Test Amplify Data — Documentation pas-à-pas

## Index

1. [Étape 1 – Set up Amplify Data](#etape-1--set-up-amplify-data)
2. [Étape 2 – Connect your app code to API](#etape-2--connect-your-app-code-to-api)

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
import { a, defineData, type ClientSchema } from "@aws-amplify/backend";

const schema = a.schema({
    Todo: a
        .model({
            content: a.string(),
            isDone: a.boolean(),
        })
        .authorization((allow) => [allow.publicApiKey()]), // ⚠️ Accès public total (déconseillé en prod)
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
    schema,
    authorizationModes: {
        defaultAuthorizationMode: "apiKey",
        apiKeyAuthorizationMode: { expiresInDays: 30 },
    },
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
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
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

- _Le modèle est déployé en NoSQL (DynamoDB)_
- _API GraphQL en temps réel auto-générée_
- _Champs systeme ajoutés (createdAt/updatedAt)_
- _Auth ultra flexible, mais attention au mode public en prod !_

---

## Étape 2 – Connect your app code to API

### 🎯 Objectif

Connecter ton application front-end à l’API Amplify Data, gérer l’authentification, personnaliser les headers et, si besoin, consommer plusieurs endpoints.

---

### 🚦 Prérequis

- Cloud sandbox Amplify Data actif (`npx ampx sandbox`)
- Application front avec Amplify installé (`npm add aws-amplify`)
- npm installé

---

### 🛠️ Configuration de la librairie Amplify

**Dans l’entrypoint de ton app :**

```js
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);
```

- `amplify_outputs.json` contient toutes les infos (URL, API Key, user pool, etc.).

---

### 🧩 Générer le client Data Amplify

**Avec TypeScript pour avoir l’autocomplétion :**

```ts
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";

const client = generateClient<Schema>();
```

- **Tu peux ensuite faire :**
    ```ts
    const { data: todos, errors } = await client.models.Todo.list();
    ```

---

### 🔐 Gestion du mode d’authentification (Authorization Mode)

- **Mode par défaut** : défini dans `amplify_outputs.json` (`userPool` ou `apiKey`)
- **Pour forcer un mode d’auth globalement sur un client :**
    ```ts
    const client = generateClient<Schema>({ authMode: "apiKey" });
    ```
- **Pour forcer un mode d’auth sur une requête :**
    ```ts
    const { data } = await client.models.Todo.list({
        authMode: "apiKey",
    });
    ```

---

### 📦 Personnaliser les headers (ex : tracking, auth, signatures)

- **Headers statiques :**
    ```ts
    const client = generateClient<Schema>({
        headers: {
            "My-Custom-Header": "my value",
        },
    });
    ```
- **Headers dynamiques (fonction async) :**
    ```ts
    const client = generateClient<Schema>({
        headers: async (requestOptions) => ({
            Authorization: "Bearer " + getToken(),
        }),
    });
    ```
- **Ou sur une seule requête :**
    ```ts
    await client.models.Todo.list({
        headers: { "X-Tracking": "on" },
    });
    ```

---

### 🌐 Utiliser un endpoint de données supplémentaire

- **Changer l’endpoint côté client :**

    ```ts
    const client = generateClient({
        endpoint: "https://my-other-endpoint.com/graphql",
        authMode: "apiKey",
        apiKey: "my-api-key",
    });
    ```

- **Si l’authentification diffère, passe le header d’auth manuellement (voir headers plus haut).**

---

### ✨ Points à retenir

- **Initialise Amplify dans l’entrypoint avec le fichier outputs**
- **Génère toujours un client typé (TypeScript) pour le confort dev**
- **Gère le mode d’auth soit globalement, soit par requête**
- **Personnalise headers et endpoints selon les besoins**
- **Possible de connecter plusieurs backends Amplify depuis une même app**

---

### 📌 Particularités

- _Possibilité de typage complet même en JS (avec JSDoc)_
- _Support multi-endpoints, multi-auth_
- _Ultra flexible pour tests, intégrations, microservices…_

---


