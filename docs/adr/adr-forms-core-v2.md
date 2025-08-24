# ADR — Refonte forms-core-v2

## Contexte

La première version de `useModelForm` mélangeait logique métier et UI.  
Objectif : stabiliser un cœur générique réutilisable par toutes les entités.

## Décision

- Un hook générique `useModelForm` fournit l’état et les opérations (submit, cancel, exitEditMode…).
- Les hooks métiers (`usePostForm`, `useTagForm`…) s’appuient sur ce core et se concentrent sur la persistance.
- `BlogFormShell` devient le composant UI standard, recevant `onCancel` et éventuellement `cancelChanges`.

## Conséquences

- API uniforme (`cancelChanges`, `exitEditMode`, `onPostSaved`, etc.).
- Migration progressive des entités : Post → Tag → Section → Author.
- Nettoyage ultérieur des alias (`deleteEntity`…), mises à jour du glossaire et des tests.
