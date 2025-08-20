# AGENTS.md

## Installation

- Toujours commencer par `yarn install` pour installer toutes les dépendances.
- Si vous utilisez Yarn v4.x (Berry/PnP), ajoutez ou vérifiez dans `.yarnrc.yml` :

    ```yaml
    nodeLinker: node-modules
    ```

## Scripts

Utilisez les scripts définis dans le `package.json` :

- **`yarn dev`** : lance l’application en mode développement (`next dev`).
- **`yarn build`** : construit la production (`next build`).
- **`yarn start`** : démarre le serveur en production (`next start`).
- **`yarn lint`** : exécute le lint via Next.js (`next lint`).

## Style de code

- Utiliser **Prettier** pour formater le code :

    ```bash
    yarn prettier --write .
    ```

- Respecter les règles **ESLint** intégrées à Next.js :

    ```bash
    yarn lint
    ```

- Respecter les norme **Typscript** intégrées à Next.js :
  Jamais de any

            ```bash
            yarn tsc
            ```

## Dépendances clés

- **Framework** : Next.js v15.0.3
- **AWS & Amplify** : aws-amplify 6.9.0 et @aws-amplify/ui-react

## Tests

- Si vous ajoutez des tests, créez un script `yarn test` et assurez-vous qu’il passe avant chaque PR.

## Pull Request

- **Titre de la PR** : `[Fix|Feat] courte description`
- **Description** : expliquer l’objectif du changement.
- **Tests effectués** : listez les commandes exécutées (ex. `yarn dev`, `yarn lint`, `yarn tsc`, `yarn build`).

---

## Metre a jour l'avancer de **Contrat Manager**.

📋 ContratManager — Suivi d’implémentation

Ce fichier trace l’avancement de l’implémentation du **Contrat Manager**.  
Chaque étape validée doit être cochée `[X]`.  
De nouvelles étapes nécessaires peuvent être ajoutées au fur et à mesure.

Quand tu génères du code, n’argumente pas sur la forme des imports ni sur l’utilisation des alias relatifs :

Toujours utiliser un alias qui contient au minimum un /, jamais d’alias simple sans /.

Si j’ai un dossier (par exemple services) qui contient un fichier index.ts pour regrouper les exports, alors j’utilise l’alias :
@src/services
(et pas @services ni @src/services)

Si je n’utilise pas d’index pour centraliser les exports dans un dossier, alors importe directement le module voulu, ex :
@example/monComposant
