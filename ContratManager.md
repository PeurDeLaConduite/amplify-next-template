# 📋 ContratManager — Suivi d’implémentation

Ce fichier trace l’avancement de l’implémentation du **Contrat Manager**.  
Chaque étape validée doit être cochée `[X]`.  
De nouvelles étapes nécessaires peuvent être ajoutées au fur et à mesure.

---

## 1. Contrat commun

- [x] Créer `src/entities/core/managerContract.ts` (interface `ManagerContract` + `MaybePromise`)

## 2. Fabrique générique

- [x] Créer `src/entities/core/createManager.ts` (gestion état local + services + flags)

---

## 3. Implémentations par entité

### Tag

- [x] Implémenter `ManagerContract<Tag, TagForm, string, { posts: Post[] }>`
- [x] État (`entities`, `form`, `editingId/isEditing`, flags, pagination)
- [x] Méthodes `listEntities`, `refresh`, `refreshExtras`, `getEntityById`, `loadEntityById`
- [x] CRUD : `createEntity`, `updateEntity`, `deleteById`
- [x] Relations : `syncManyToMany(postId, { add/remove/replace })` via service `PostTag`
- [x] Validation : `validateField('name', …)` anti-doublon local + check serveur
- [x] Cascade delete : pivots `PostTag`

### Post

- [x] Implémenter `ManagerContract<Post, PostForm, string, { authors: Author[], tags: Tag[], sections: Section[] }>`
- [x] CRUD + extras (authors, tags, sections)
- [x] Relations : `syncManyToMany` (tags, sections)
- [x] Cascade delete : `PostTag`, `SectionPost`, `Comment`

### Section

- [x] Implémenter `ManagerContract<Section, SectionForm, string, { posts: Post[] }>`
- [x] Relations : `syncManyToMany(sectionId, …)` via `SectionPost`
- [x] Cascade delete : pivots `SectionPost`

### Author

- [x] Implémenter `ManagerContract<Author, AuthorForm>`
- [x] CRUD + stratégie cascade (posts : interdire, réassigner ou supprimer)

### UserName

- [x] Implémenter `ManagerContract<UserName, UserNameForm>`
- [x] CRUD + form local (`updateField/patchForm/clear*`)
- [x] `loadEntityById` (profil simple)

### UserProfile

- [x] Implémenter `ManagerContract<UserProfile, UserProfileForm>`
- [x] CRUD (pas d'extras)
- [x] `loadEntityById` (pas de `refreshExtras`)

### Comment

- [x] Implémenter `ManagerContract<Comment, CommentForm>`
- [x] CRUD + form local
- [x] Relation obligatoire : `userNameId`, optionnelle : `postId`/`todoId`
- [ ] Cascade delete si supprimé via Todo (Post ✅)

### Todo

- [x] Implémenter `ManagerContract<Todo, TodoForm>`
- [x] CRUD + form local
- [ ] Cascade delete : `Comment` liés

---

## 4. Hooks React

- [x] Créer `useXxxManager` basé sur `useSyncExternalStore`
- [x] Appeler `refresh()` et `refreshExtras()` au montage

---

## 5. Migration UI

- [x] Remplacer anciens hooks (`useTagForm`, `usePostForm`, …) par `useXxxManager`
- [x] `useAuthorForm` → `useAuthorManager`
- [x] Mappage fonctions :
    - `setForm → patchForm`
    - `handleChange → updateField`
    - `submit → createEntity/updateEntity + refresh`
    - `cancel → cancelEdit`
    - `remove → deleteById`

---

## 6. Relations N:N

- [x] Implémenter `syncManyToMany` (services pivots `PostTag`, `SectionPost`)
- [x] Cascade delete documentée et appliquée

---

## 7. Validation

- [ ] Implémenter `validateField` + `validateForm` dans tous les managers (Tag ✅)

---

## 8. Pagination

- [x] Support complet (`pageSize`, `nextToken`, `prevTokens`, `loadNextPage`, `loadPrevPage`)

---

## 9. Tests

- [ ] Créer tests CRUD/refresh pour chaque manager
- [ ] Vérifier flags (loading/saving)
- [ ] Vérifier cascade delete et relations
