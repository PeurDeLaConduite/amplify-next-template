# AGENTS.md

## Installation

-   Toujours commencer par `yarn install` pour installer toutes les dépendances.
-   Si vous utilisez Yarn v4.x (Berry/PnP), ajoutez ou vérifiez dans `.yarnrc.yml` :

    ```yaml
    nodeLinker: node-modules
    ```

## Scripts

Utilisez les scripts définis dans le `package.json` :

-   **`yarn dev`** : lance l’application en mode développement (`next dev`).
-   **`yarn build`** : construit la production (`next build`).
-   **`yarn start`** : démarre le serveur en production (`next start`).
-   **`yarn lint`** : exécute le lint via Next.js (`next lint`).
-   **`yarn generate:sitemap`** : génère le sitemap (`node scripts/generate-sitemap.js`).

## Style de code

-   Utiliser **Prettier** pour formater le code :

    ```bash
    yarn prettier --write .
    ```

-   Respecter les règles **ESLint** intégrées à Next.js :

    ```bash
    yarn lint
    ```

## Dépendances clés

-   **Framework** : Next.js v15.0.3
-   **AWS & Amplify** : aws-amplify 6.9.0 et @aws-amplify/ui-react

## Tests

-   Actuellement, il n’y a pas de script de test défini.
-   Si vous ajoutez des tests, créez un script `yarn test` et assurez-vous qu’il passe avant chaque PR.

## Pull Request

-   **Titre de la PR** : `[Fix|Feat] courte description`
-   **Description** : expliquer l’objectif du changement.
-   **Tests effectués** : listez les commandes exécutées (ex. `yarn dev`, `yarn lint`, `yarn build`).

---

