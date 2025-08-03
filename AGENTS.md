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

## Dépendances clés

- **Framework** : Next.js v15.0.3
- **AWS & Amplify** : aws-amplify 6.9.0 et @aws-amplify/ui-react

## Tests

- Actuellement, il n’y a pas de script de test défini.
- Si vous ajoutez des tests, créez un script `yarn test` et assurez-vous qu’il passe avant chaque PR.

## Pull Request

- **Titre de la PR** : `[Fix|Feat] courte description`
- **Description** : expliquer l’objectif du changement.
- **Tests effectués** : listez les commandes exécutées (ex. `yarn dev`, `yarn lint`, `yarn build`).

---

# Mission / Processus de refonte du code

Ce projet fait l’objet d’une refonte structurée de la gestion des données et des formulaires pour :

- Centraliser la logique de gestion CRUD, relations et mapping dans des services factorisés (ex. `crudService`, `relationService`)
- Uniformiser la définition des types (models, forms, CreateInput, UpdateInput) via des utilitaires génériques, pour éviter toute duplication
- Organiser le code métier par entité dans `/src/entities/{entity}/` : chaque entité dispose de ses types, forms, services et hooks dédiés, exposés via un index
- Séparer clairement :
    - les services (accès données et logique métier)
    - les hooks d’UI/présentation
    - les composants de rendu
- Nettoyer le code mort et les utilitaires/fichiers non utilisés
- Documenter l’architecture cible et le pattern d’ajout d’entité dans le README

---

## Plan d’action attendu (à suivre impérativement) :

- [x] Nettoyage du code mort et des fichiers inutilisés
- [x] Déplacement et centralisation de tous les services métier dans `/src/services` (provisoirement)
- [ ] Factorisation et uniformisation des types et formulaires avec des utilitaires génériques
- [ ] Migration vers une structure par entité dans `/src/entities/{entity}`
- [ ] Refonte des hooks pour ne laisser dans `/src/hooks` que les hooks de présentation
- [ ] Mise à jour progressive des composants pour consommer la nouvelle API métier
- [ ] Tests, lint et validation après chaque étape
- [ ] Documentation finale de l’architecture cible dans le README

Chaque étape doit être traitée séquentiellement, avec commit et validation avant de passer à la suivante.
Aucune étape ne doit être sautée ni mélangée, afin de garantir la cohérence et la maintenabilité du projet.

---

## Avancement de la refonte (mise à jour : 2024-08-01)

- [x]   1. Nettoyage du code mort et des fichiers inutilisés (hooks CRUD, omitId.ts…)
- [x]   2. Déplacement et centralisation des services profil (`userProfileService`, `userNameService`)
- [ ]   3. Factorisation/Uniformisation des types et formulaires avec utilitaires génériques
- [ ]   4. Migration vers structure par entité dans `/src/entities/{entity}`
- [ ]   5. Refonte des hooks (UI/présentation séparés)
- [ ]   6. Mise à jour des composants pour la nouvelle API métier
- [ ]   7. Tests, lint, validation étape par étape
- [ ]   8. Documentation finale de l’architecture cible dans le README

**Dernière mise à jour :** 2024-08-01

**Difficultés rencontrées :** (à compléter si besoin)
