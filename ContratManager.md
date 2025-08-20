# 📋 ContratManager — Suivi d’implémentation

Ce fichier trace l’avancement de l’implémentation du **Contrat Manager**.  
Chaque étape validée doit être cochée `[X]`.  
De nouvelles étapes nécessaires peuvent être ajoutées au fur et à mesure.

---

## 1. Contrat commun

- [ ] Créer `src/entities/core/managerContract.ts` (interface `ManagerContract` + `MaybePromise`)

## 2. Fabrique générique

- [ ] Créer `src/entities/core/createManager.ts` (gestion état local + services + flags)

---

## 3. Implémentations par entité

### Tag

- [ ] Implémenter `ManagerContract<Tag, TagForm, string, { posts: Post[] }>`
- [ ] État (`entities`, `form`, `editingId/isEditing`, flags, pagination)
- [ ] Méthodes `listEntities`, `refresh`, `refreshExtras`, `getEntityById`, `loadEntityById`
- [ ] CRUD : `createEntity`, `updateEntity`, `deleteById`
- [ ] Relations : `syncManyToMany(postId, { add/remove/replace })` via service `PostTag`
- [ ] Validation : `validateField('name', …)` anti-doublon local + check serveur
- [ ] Cascade delete : pivots `PostTag`

### Post

- [ ] Implémenter `ManagerContract<Post, PostForm, string, { authors: Author[], tags: Tag[], sections: Section[] }>`
- [ ] CRUD + extras (authors, tags, sections)
- [ ] Relations : `syncManyToMany` (tags, sections)
- [ ] Cascade delete : `PostTag`, `SectionPost`, `Comment`

### Section

- [ ] Implémenter `ManagerContract<Section, SectionForm, string, { posts: Post[] }>`
- [ ] Relations : `syncManyToMany(sectionId, …)` via `SectionPost`
- [ ] Cascade delete : pivots `SectionPost`

### Author

- [ ] Implémenter `ManagerContract<Author, AuthorForm>`
- [ ] CRUD + stratégie cascade (posts : interdire, réassigner ou supprimer)

### UserName

- [ ] Implémenter `ManagerContract<UserName, UserNameForm>`
- [ ] CRUD + form local (`updateField/patchForm/clear*`)
- [ ] `loadEntityById` (profil simple)

### UserProfile

- [ ] Implémenter `ManagerContract<UserProfile, UserProfileForm>`
- [ ] CRUD + extras éventuels
- [ ] `loadEntityById` + `refreshExtras`

### Comment

- [ ] Implémenter `ManagerContract<Comment, CommentForm>`
- [ ] CRUD + form local
- [ ] Relation obligatoire : `userNameId`, optionnelle : `postId`/`todoId`
- [ ] Cascade delete si supprimé via Post/Todo

### Todo

- [ ] Implémenter `ManagerContract<Todo, TodoForm>`
- [ ] CRUD + form local
- [ ] Cascade delete : `Comment` liés

---

## 4. Hooks React

- [ ] Créer `useXxxManager` basé sur `useSyncExternalStore`
- [ ] Appeler `refresh()` et `refreshExtras()` au montage

---

## 5. Migration UI

- [ ] Remplacer anciens hooks (`useTagForm`, `usePostForm`, …) par `useXxxManager`
- [x] `useAuthorForm` → `useAuthorManager`
- [ ] Mappage fonctions :
    - `setForm → patchForm`
    - `handleChange → updateField`
    - `submit → createEntity/updateEntity + refresh`
    - `cancel → cancelEdit`
    - `remove → deleteById`

---

## 6. Relations N:N

- [ ] Implémenter `syncManyToMany` (services pivots `PostTag`, `SectionPost`)
- [ ] Cascade delete documentée et appliquée

---

## 7. Validation

- [ ] Implémenter `validateField` + `validateForm` (anti-doublons locaux + check serveur)

---

## 8. Pagination

- [ ] Support complet (`pageSize`, `nextToken`, `prevTokens`, `loadNextPage`, `loadPrevPage`)

---

## 9. Tests

- [ ] Créer tests CRUD/refresh pour chaque manager
- [ ] Vérifier flags (loading/saving)
- [ ] Vérifier cascade delete et relations
