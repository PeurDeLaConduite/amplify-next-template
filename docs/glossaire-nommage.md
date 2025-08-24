# Glossaire — Conventions de nommage

## Callbacks normalisés

| Nom             | Rôle                                                           |
| --------------- | -------------------------------------------------------------- |
| `cancelChanges` | Annule les modifications locales sans quitter le mode courant. |
| `exitEditMode`  | Quitte le mode édition et repasse en mode création.            |
| `onCancel`      | Callback UI lorsque l’utilisateur quitte le formulaire.        |
| `onPostSaved`   | Callback métier déclenché après la persistance d’un Post.      |

Les types doivent rester immuables (`readonly`), utiliser des unions discriminées et `Exact<T>` quand c’est nécessaire.  
Aucun `any` n’est autorisé. `unknown` doit être justifié par un commentaire.
