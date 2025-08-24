# Audit UI ↔ Services CRUD

_Next.js 15 (App Router, RSC/Server Actions) + AWS Amplify v6/v2_

## Résumé

- Harmonisation des callbacks `on<Xxx>Saved` et du shell générique `onItemSaved`.
- Adoption de `<entity>Id` pour l’état d’édition et `itemId`/`activeId` côté UI.
- Normalisation des fonctions N↔N : `replaceXxxZzzs` & `toggleRelationXxx`.

## Renommages par module

- Blog / Posts : `onSaveSuccess` → `onPostSaved`, `editingId` → `postId`, `toggleTag` → `toggleRelationTag`, `syncPostTags` → `replacePostTags`, etc.
- Blog / Tags : `onSaveSuccess` → `onTagSaved`, `toggle` → `toggleRelationPost`, …
- Utilitaires : `createM2MSync` → `createM2MReplace`, `syncManyToMany` → `replaceManyToMany`.

## Matrice d’impact

| Module           | Fichiers modifiés                              | Tests impactés           |
| ---------------- | ---------------------------------------------- | ------------------------ |
| Posts            | PostForm.tsx, usePostForm.tsx, CreatePost.tsx… | usePostForm.test.ts      |
| Tags             | TagForm.tsx, useTagForm.tsx, CreateTag.tsx…    | —                        |
| Sections/Authors | SectionsForm.tsx, AuthorForm.tsx…              | —                        |
| Core utils       | createM2MSync.ts, syncManyToMany.ts            | relations services tests |

## Cas `needs-review`

Voir tableau ci‑dessus (état dérivé vs stocké, callback toggle ambigu, nom de prop des listes).

## Glossaire appliqué

- Violations avant : `onSaveSuccess`, `editingId`, `syncPostTags`, `toggleTag`, …
- Violations après : aucune restante, hors cas `needs-review`.

## Prochaines étapes

- Remplacer l’état objet (`editingPost`, etc.) par un dérivé conforme.
- Supprimer les alias dépréciés après migration.
- Ajouter tests unitaires sur les relations N↔N.

## 1. Tableau par composant

### TagForm

| Prop            | Type               | Source             | Action détectée                    | Amplify cat. | Endpoint/op                  | Boundary | Effets secondaires                  | Preuve | Score | Renommage proposé | Notes            |
| --------------- | ------------------ | ------------------ | ---------------------------------- | ------------ | ---------------------------- | -------- | ----------------------------------- | ------ | ----- | ----------------- | ---------------- |
| `manager`       | `UseTagFormReturn` | TagForm.tsx L11‑13 | fournit `form`, `submit`, `toggle` | Data/GraphQL | `tagService.create`/`update` | Client   | création/màj Tag + sync PostTag     | —      | 2     | `tagFormManager`  | nom générique    |
| `onSaveSuccess` | `() => void`       | TagForm.tsx L12‑13 | rafraîchit liste après `submit`    | —            | —                            | Client   | rechargement via parent `CreateTag` | —      | 3     | `onTagSaved`      | préciser domaine |

### AuthorForm

| Prop            | Type                               | Source               | Action détectée                          | Amplify cat. | Endpoint/op                   | Boundary | Effets secondaires          | Preuve | Score | Renommage proposé   | Notes |
| --------------- | ---------------------------------- | -------------------- | ---------------------------------------- | ------------ | ----------------------------- | -------- | --------------------------- | ------ | ----- | ------------------- | ----- |
| `manager`       | `ReturnType<typeof useAuthorForm>` | AuthorForm.tsx L8‑10 | `submit` → `authorService.create/update` | Data/GraphQL | `authorService.create/update` | Client   | maj Author                  | —      | 2     | `authorFormManager` | —     |
| `onSaveSuccess` | `() => void`                       | L8‑11                | rechargement liste                       | —            | —                             | Client   | reset formulaire via parent | —      | 3     | `onAuthorSaved`     | —     |

### SectionForm

| Prop            | Type                                | Source                  | Action                                                        | Amplify cat. | Endpoint/op                    | Boundary | Effets              | Preuve | Score | Renommage            | Notes          |
| --------------- | ----------------------------------- | ----------------------- | ------------------------------------------------------------- | ------------ | ------------------------------ | -------- | ------------------- | ------ | ----- | -------------------- | -------------- |
| `manager`       | `ReturnType<typeof useSectionForm>` | SectionsForm.tsx L19‑22 | `submit` → `sectionService.create/update`, `syncSectionPosts` | Data/GraphQL | `sectionService.create/update` | Client   | sync relations Post | —      | 2     | `sectionFormManager` | —              |
| `onSaveSuccess` | `() => void`                        | L19‑22                  | rafraîchit via parent                                         | —            | —                              | Client   | rechargement        | —      | 3     | `onSectionSaved`     | —              |
| `editingId`     | `string \| null`                    | L19‑23                  | ordre dans `OrderSelector`                                    | —            | —                              | Client   | gestion UI          | —      | 3     | `activeSectionId`    | clarifie usage |

### PostForm

| Prop            | Type                             | Source              | Action                                                          | Amplify cat. | Endpoint/op                 | Boundary | Effets             | Preuve | Score | Renommage         | Notes          |
| --------------- | -------------------------------- | ------------------- | --------------------------------------------------------------- | ------------ | --------------------------- | -------- | ------------------ | ------ | ----- | ----------------- | -------------- |
| `manager`       | `ReturnType<typeof usePostForm>` | PostForm.tsx L21‑25 | `submit` → `postService.create/update`, `syncPostTags/Sections` | Data/GraphQL | `postService.create/update` | Client   | multiple relations | —      | 2     | `postFormManager` | —              |
| `onSaveSuccess` | `() => void`                     | L21‑24              | rafraîchit liste                                                | —            | —                           | Client   | reset              | —      | 3     | `onPostSaved`     | —              |
| `posts`         | `PostType[]`                     | L21‑25              | données pour `OrderSelector`                                    | —            | `postService.list`          | Client   | lecture            | —      | 3     | `existingPosts`   | plus explicite |
| `editingId`     | `string \| null`                 | L21‑26              | ordre/édition                                                   | —            | —                           | Client   | état UI            | —      | 3     | `activePostId`    | —              |

### BlogFormShell

| Prop            | Type                 | Source                   | Action                | Amplify cat.               | Endpoint/op       | Boundary | Effets               | Preuve | Score | Renommage         | Notes          |
| --------------- | -------------------- | ------------------------ | --------------------- | -------------------------- | ----------------- | -------- | -------------------- | ------ | ----- | ----------------- | -------------- |
| `manager`       | `BlogFormManager<F>` | BlogFormShell.tsx L17‑24 | gère `submit`, `mode` | Data/GraphQL (via manager) | dépend du manager | Client   | reset en mode create | —      | 2     | `formManager`     | générique      |
| `initialForm`   | `F`                  | L17‑24                   | reset après save      | —                          | —                 | Client   | clean state          | —      | 4     | —                 | clair          |
| `onSaveSuccess` | `() => void`         | L17‑24                   | callback post‑submit  | —                          | —                 | Client   | rechargement parent  | —      | 3     | `onSaveCompleted` | préciser étape |
| `submitLabel`   | `{create,edit}`      | L21‑23                   | libellés              | —                          | —                 | Client   | UI                   | —      | 4     | —                 | —              |
| `className`     | `string`             | L22‑23                   | style                 | —                          | —                 | Client   | —                    | —      | 4     | —                 | —              |

### EntityForm

| Prop             | Type              | Source               | Action                    | Amplify cat.            | Endpoint      | Boundary | Effets          | Preuve | Score | Renommage      | Notes               |
| ---------------- | ----------------- | -------------------- | ------------------------- | ----------------------- | ------------- | -------- | --------------- | ------ | ----- | -------------- | ------------------- |
| `formData`       | `Partial<T>`      | EntityForm.tsx L7‑16 | données UI                | —                       | —             | Client   | —               | —      | 4     | —              | —                   |
| `fields`         | `FieldKey<T>[]`   | L7‑16                | liste champs              | —                       | —             | Client   | rendu dynamique | —      | 4     | —              | —                   |
| `labels`         | `(field)=>string` | L7‑16                | affichage                 | —                       | —             | Client   | —               | —      | 4     | —              | —                   |
| `setFieldValue`  | `(field,value)`   | L7‑16                | mise à jour locale        | —                       | —             | Client   | modif state     | —      | 4     | —              | —                   |
| `handleSubmit`   | `() => void`      | L7‑16                | déclenche `submit` parent | Data/GraphQL via parent | dépend parent | Client   | envoi mutation  | —      | 3     | `onSubmitForm` | aligner conventions |
| `isEdit`         | `boolean`         | L7‑16                | toggle Add/Update         | —                       | —             | Client   | UI              | —      | 4     | —              | —                   |
| `onCancel`       | `() => void`      | L7‑16                | reset parent              | —                       | —             | Client   | reset           | —      | 4     | —              | —                   |
| `requiredFields` | `FieldKey<T>[]`   | L7‑16                | validation HTML           | —                       | —             | Client   | —               | —      | 4     | —              | —                   |

### EntityEditor

| Prop                | Type                       | Source                 | Action                            | Amplify cat.                  | Endpoint                         | Boundary | Effets             | Preuve | Score | Renommage             | Notes          |
| ------------------- | -------------------------- | ---------------------- | --------------------------------- | ----------------------------- | -------------------------------- | -------- | ------------------ | ------ | ----- | --------------------- | -------------- |
| `title`             | `string`                   | EntityEditor.tsx L9‑12 | libellé                           | —                             | —                                | Client   | UI                 | —      | 4     | —                     | —              |
| `requiredFields`    | `FieldKey<T>[]`            | L9‑13                  | validation                        | —                             | —                                | Client   | —                  | —      | 4     | —                     | —              |
| `labelIcon`         | `(field)=>ReactNode`       | L9‑16                  | icône                             | —                             | —                                | Client   | UI                 | —      | 4     | —                     | —              |
| `renderValue`       | `(field,value)=>ReactNode` | L9‑17                  | rendu champ                       | —                             | —                                | Client   | UI                 | —      | 4     | —                     | —              |
| `extraButtons`      | `(field,value)=>ReactNode` | L9‑19                  | actions additionnelles            | —                             | —                                | Client   | UI                 | —      | 3     | `renderExtraButtons`  | clarifier rôle |
| `deleteButtonLabel` | `string`                   | L9‑21                  | texte suppression                 | —                             | —                                | Client   | UI                 | —      | 4     | —                     | —              |
| `className`         | `string`                   | L9‑23                  | style                             | —                             | —                                | Client   | —                  | —      | 4     | —                     | —              |
| `onClearField`      | `(field,clearFn)=>void`    | L9‑25                  | déclenche `clearField` service    | Data/GraphQL via `clearField` | dépend service                   | Client   | efface côté API    | —      | 3     | `onRequestClearField` | aligner action |
| `form`              | `T`                        | L9‑27                  | état local                        | —                             | —                                | Client   | —                  | —      | 4     | —                     | —              |
| `mode`              | `FormMode`                 | L9‑29                  | create/edit                       | —                             | —                                | Client   | UI                 | —      | 4     | —                     | —              |
| `dirty`             | `boolean`                  | L9‑31                  | état modif                        | —                             | —                                | Client   | UI                 | —      | 4     | —                     | —              |
| `setFieldValue`     | `(field,value)=>void`      | L9‑33                  | modif state                       | —                             | —                                | Client   | —                  | —      | 4     | —                     | —              |
| `submit`            | `() => Promise<boolean>`   | L9‑35                  | `handleSubmit` → services parents | Data/GraphQL                  | dépend                           | Client   | envoi mutation     | —      | 3     | `onSubmit`            | —              |
| `reset`             | `() => void`               | L9‑37                  | reset local                       | —                             | —                                | Client   | —                  | —      | 4     | —                     | —              |
| `setForm`           | `Dispatch`                 | L9‑39                  | remplacer state                   | —                             | —                                | Client   | —                  | —      | 4     | —                     | —              |
| `fields`            | `FieldKey<T>[]`            | L9‑41                  | liste champs                      | —                             | —                                | Client   | UI                 | —      | 4     | —                     | —              |
| `labels`            | `(field)=>string`          | L9‑43                  | libellés                          | —                             | —                                | Client   | UI                 | —      | 4     | —                     | —              |
| `updateEntity`      | `(field,value)=>Promise`   | L9‑45                  | mutation partielle                | Data/GraphQL                  | `userProfileService.update` etc. | Client   | persistance champ  | —      | 4     | `updateField`         | —              |
| `clearField`        | `(field)=>Promise`         | L9‑47                  | set champ vide via service        | Data/GraphQL                  | `update` partiel                 | Client   | effacement         | —      | 4     | —                     | —              |
| `deleteEntity`      | `() => Promise`            | L9‑49                  | suppression entité                | Data/GraphQL                  | `...Service.delete`              | Client   | cascade éventuelle | —      | 4     | `onDeleteEntity`      | aligner conv.  |

### FormActionButtons

| Prop                | Type                    | Source                     | Action                    | Amplify cat.            | Endpoint       | Boundary | Effets                | Preuve | Score | Renommage         | Notes          |
| ------------------- | ----------------------- | -------------------------- | ------------------------- | ----------------------- | -------------- | -------- | --------------------- | ------ | ----- | ----------------- | -------------- |
| `editingId`         | `IdLike \| null`        | FormActionButtons.tsx L4‑6 | contrôle mode             | —                       | —              | Client   | UI                    | —      | 4     | `activeId`        | —              |
| `currentId`         | `IdLike`                | L4‑7                       | item courant              | —                       | —              | Client   | —                     | —      | 4     | —                 | —              |
| `onEdit`            | `() => void`            | L4‑8                       | passer en édition         | —                       | —              | Client   | —                     | —      | 4     | —                 | —              |
| `onUpdate`          | `() => void`            | L4‑9                       | déclenche `submit` parent | Data/GraphQL via parent | dépend         | Client   | mutation              | —      | 2     | `onSubmitUpdate`  | clarifier      |
| `onCancel`          | `() => void`            | L4‑9                       | annule                    | —                       | —              | Client   | reset                 | —      | 4     | —                 | —              |
| `onDelete`          | `() => void`            | L4‑10                      | suppression               | Data/GraphQL via parent | service.delete | Client   | cascade selon service | —      | 4     | `onConfirmDelete` | plus précis    |
| `isFormNew`         | `boolean`               | L4‑11                      | branche bouton ajout      | —                       | —              | Client   | UI                    | —      | 2     | `isNewItem`       | plus générique |
| `addButtonLabel`    | `string`                | L4‑12                      | texte création            | —                       | —              | Client   | UI                    | —      | 4     | —                 | —              |
| `className`         | `string`                | L4‑13                      | style                     | —                       | —              | Client   | —                     | —      | 4     | —                 | —              |
| `variant`           | `"no-Icon" \| "normal"` | L4‑14                      | rendu                     | —                       | —              | Client   | —                     | —      | 4     | —                 | —              |
| `editButtonLabel`   | `string`                | L4‑15                      | libellé                   | —                       | —              | Client   | —                     | —      | 4     | —                 | —              |
| `deleteButtonLabel` | `string`                | L4‑16                      | libellé                   | —                       | —              | Client   | —                     | —      | 4     | —                 | —              |

### PostTagsRelationManager

| Prop          | Type                      | Source                            | Action                           | Amplify cat. | Endpoint                       | Boundary | Effets                  | Preuve | Score | Renommage         |
| ------------- | ------------------------- | --------------------------------- | -------------------------------- | ------------ | ------------------------------ | -------- | ----------------------- | ------ | ----- | ----------------- |
| `posts`       | `PostType[]`              | PostTagsRelationManager.tsx L8‑14 | rendu liste                      | —            | —                              | Client   | —                       | —      | 4     | —                 |
| `tags`        | `TagType[]`               | L8‑14                             | —                                | —            | —                              | Client   | —                       | —      | 4     | —                 |
| `tagsForPost` | `(postId)=>TagType[]`     | L8‑14                             | lecture associations via manager | Data         | `postTagService.listByParent`  | Client   | lecture relation        | —      | 3     | `getTagsForPost`  |
| `isTagLinked` | `(postId,tagId)=>boolean` | L8‑14                             | vérifie association              | Data         | `postTags` state               | Client   | —                       | —      | 3     | `hasTagLink`      |
| `toggle`      | `(postId,tagId)=>Promise` | L8‑14                             | crée/supprime relation           | Data/GraphQL | `postTagService.create/delete` | Client   | mutation + state update | —      | 3     | `onToggleTagLink` |
| `loading`     | `boolean`                 | L8‑14                             | feedback                         | —            | —                              | Client   | UI                      | —      | 4     | —                 |

### UserNameModal

| Prop      | Type         | Source                   | Action           | Amplify cat. | Endpoint | Boundary | Effets | Preuve | Score | Renommage |
| --------- | ------------ | ------------------------ | ---------------- | ------------ | -------- | -------- | ------ | ------ | ----- | --------- |
| `isOpen`  | `boolean`    | UserNameModal.tsx L11‑14 | état d’ouverture | —            | —        | Client   | UI     | —      | 5     | —         |
| `onClose` | `() => void` | L11‑14                   | ferme modal      | —            | —        | Client   | UI     | —      | 5     | —         |

### TodoList

| Prop              | Type                  | Source            | Action               | Amplify cat. | Endpoint                     | Boundary | Effets                  | Preuve | Score | Renommage               |
| ----------------- | --------------------- | ----------------- | -------------------- | ------------ | ---------------------------- | -------- | ----------------------- | ------ | ----- | ----------------------- |
| `todos`           | `Todo[]`              | TodoList.tsx L7‑9 | rendu                | Data         | `todoService.observeQuery`   | Client   | lecture temps réel      | —      | 4     | —                       |
| `comments`        | `CommentWithTodoId[]` | L7‑9              | rendu                | Data         | `commentClient.observeQuery` | Client   | lecture                 | —      | 4     | —                       |
| `onDeleteTodo`    | `(id:string)=>void`   | L7‑13             | supprime Todo        | Data/GraphQL | `todoService.delete`         | Client   | supprime + commentaires | —      | 4     | `onDeleteTodoConfirmed` |
| `onAddComment`    | `(todoId)=>void`      | L7‑12             | création commentaire | Data/GraphQL | `commentService.create`      | Client   | mutation                | —      | 4     | `onAddCommentToTodo`    |
| `onEditComment`   | `(id,ownerId?)=>void` | L7‑12             | modif commentaire    | Data/GraphQL | `commentService.update`      | Client   | mutation                | —      | 4     | `onEditTodoComment`     |
| `onDeleteComment` | `(id,ownerId?)=>void` | L7‑13             | suppr commentaire    | Data/GraphQL | `commentService.delete`      | Client   | mutation                | —      | 4     | `onDeleteTodoComment`   |
| `canModify`       | `(ownerId?)=>boolean` | L7‑14             | contrôle accès       | Auth         | `useCommentPermissions`      | Client   | vérification            | —      | 4     | —                       |

_(Les composants `UserProfileManager` et `UserNameManager` n'acceptent pas de props.)_

---

## 2. Matrice UI ↔ API (principales entités)

| Description    | API cible                        | Post                                 | Tag                        | Section                        | Author                        | UserName                 | UserProfile                 | Comment                 | Todo                       | Autres                          |
| -------------- | -------------------------------- | ------------------------------------ | -------------------------- | ------------------------------ | ----------------------------- | ------------------------ | --------------------------- | ----------------------- | -------------------------- | ------------------------------- |
| Création       | Data/GraphQL `create`            | `postService.create`                 | `tagService.create`        | `sectionService.create`        | `authorService.create`        | `userNameService.create` | `userProfileService.create` | `commentService.create` | `todoService.create`       | —                               |
| Lecture liste  | Data/GraphQL `list`              | `postService.list`                   | `tagService.list`          | `sectionService.list`          | `authorService.list`          | `userNameService.list`   | —                           | `commentService.list`   | `todoService.observeQuery` | `blogDataService.fetchBlogData` |
| Mise à jour    | Data/GraphQL `update`            | `postService.update`                 | `tagService.update`        | `sectionService.update`        | `authorService.update`        | `userNameService.update` | `userProfileService.update` | `commentService.update` | —                          | —                               |
| Suppression    | Data/GraphQL `delete`/cascade    | `postService.deleteCascade`          | `tagService.deleteCascade` | `sectionService.deleteCascade` | `authorService.deleteCascade` | `userNameService.delete` | `userProfileService.delete` | `commentService.delete` | `todoService.delete`       | —                               |
| Sync relations | Data/GraphQL M2M                 | Post↔Tag, Post↔Section             | Tag↔Post                  | Section↔Post                  | —                             | —                        | —                           | —                       | —                          | —                               |
| Auth requis    | `userPool` sauf lecture publique | Mix (public read)                    | Mix                        | Mix                            | Mix                           | apiKey read              | userPool                    | apiKey/public           | apiKey/public              | —                               |
| Revalidation   | aucune                           | `manager.refresh` (Post/Tag/Section) | idem                       | idem                           | idem                          | `refresh()` bus          | —                           | observeQuery temps réel | observeQuery temps réel    | —                               |

---

## 3. Cas `needs-review`

| Prop                | Composant                                                     | Problème                     | Hypothèse                     | Suggestion(s)                               | Justification                    | Étapes d’enquête                              | Critères d’acceptation       |
| ------------------- | ------------------------------------------------------------- | ---------------------------- | ----------------------------- | ------------------------------------------- | -------------------------------- | --------------------------------------------- | ---------------------------- | ------------------------------------------ | -------------------------------- |
| `manager`           | TagForm / AuthorForm / SectionForm / PostForm / BlogFormShell | Nom générique                | Gère `form`, `submit`, `mode` | `tagFormManager`, `authorFormManager`, etc. | Clarifier rôle métier            | Rechercher toutes utilisations et MAJ imports | Prop renommée, build OK      |
| `onSaveSuccess`     | mêmes formulaires                                             | Ambigu sur contenu           | callback après mutation       | `on<Tag                                     | Author                           | ...>Saved`                                    | explicite domaine/action     | Vérifier usages parent (`CreateTag`, etc.) | Composant compile, tests lint OK |
| `onUpdate`          | FormActionButtons / GenericList                               | Confusion submit vs update   | déclenche `requestSubmit`     | `onSubmitUpdate` ou `onSubmit`              | cohérence callbacks `on{Action}` | Trouver toutes props `onUpdate` et renommer   | Nouveaux noms propagés       |
| `isFormNew`         | FormActionButtons                                             | Nom non métier               | contrôle bouton ajout         | `isNewItem`                                 | plus générique                   | Vérifier usages                               | Tests visuels OK             |
| `toggle`            | PostTagsRelationManager                                       | Verbe ambigu                 | crée/supprime lien post/tag   | `onToggleTagLink`                           | exprime intention                | MAJ `useTagForm.toggle` → prop                | UI conserve fonctionnalité   |
| `posts` (PostForm)  | PostForm                                                      | Nom générique                | liste pour ordre              | `existingPosts`                             | souligne usage                   | MAJ parent `CreatePost`                       | Noms cohérents, pas d’erreur |
| `editingId`         | SectionForm / PostForm etc.                                   | Sens ambigu                  | ID de l’item en cours         | `activeSectionId`, `activePostId`           | clarifie                         | Renommer + MAJ listes                         | Build OK                     |
| `onDeleteTodo` etc. | TodoList                                                      | manque confirmation dans nom | déclenche suppression         | `onDeleteTodoConfirmed`                     | reflète comportement             | vérifier hook                                 | nom aligné avec conventions  |

### Tâches (exemple)

:::task-stub{title="Renommer prop manager dans TagForm"}

1. Ouvrir `src/components/Blog/manage/tags/TagForm.tsx`.
2. Renommer la prop `manager` en `tagFormManager`.
3. Mettre à jour l’appel dans `CreateTag.tsx` (`manager={manager}` → `tagFormManager={manager}`).
4. Propager la modification dans `TagForm` (`BlogFormShell` etc.).
5. Vérifier `yarn lint` et `yarn build`.
   :::

_(Créer des stubs similaires pour chaque ligne du tableau ci-dessus.)_

---

## 4. Synthèse des renommages proposés

| Prop actuelle   | Nouveau nom             | Score | Domaine/API | Composant               | Commentaires                         |
| --------------- | ----------------------- | ----- | ----------- | ----------------------- | ------------------------------------ |
| `manager`       | `tagFormManager`        | 2     | Data/Tag    | TagForm                 | même logique pour autres formulaires |
| `onSaveSuccess` | `onTagSaved`            | 3     | Data/Tag    | TagForm                 | idem pour Author/Section/Post        |
| `manager`       | `authorFormManager`     | 2     | Data/Author | AuthorForm              | —                                    |
| `editingId`     | `activeSectionId`       | 3     | UI          | SectionForm             | —                                    |
| `onUpdate`      | `onSubmitUpdate`        | 2     | Data        | FormActionButtons       | —                                    |
| `isFormNew`     | `isNewItem`             | 2     | UI          | FormActionButtons       | —                                    |
| `toggle`        | `onToggleTagLink`       | 3     | Relation    | PostTagsRelationManager | —                                    |
| `posts`         | `existingPosts`         | 3     | Data/Post   | PostForm                | —                                    |
| `onDeleteTodo`  | `onDeleteTodoConfirmed` | 4     | Data/Todo   | TodoList                | renforce intention                   |

---

## 5. Plan d’adaptation service unifié

| Domaine                 | Fonction adapter                          | Impl. cible                                    | Amplify cat. | API                           | Notes                   |
| ----------------------- | ----------------------------------------- | ---------------------------------------------- | ------------ | ----------------------------- | ----------------------- |
| Post                    | `postService`                             | `entities/models/post/service.ts` L1‑31        | Data/GraphQL | `client.models.Post.*`        | déjà CRUD + cascade     |
| Tag                     | `tagService`                              | `entities/models/tag/service.ts` L1‑27         | Data/GraphQL | `client.models.Tag.*`         | cascade PostTag         |
| Section                 | `sectionService`                          | `entities/models/section/service.ts` L1‑27     | Data/GraphQL | `client.models.Section.*`     | cascade SectionPost     |
| Author                  | `authorService`                           | `entities/models/author/service.ts` L1‑24      | Data/GraphQL | `client.models.Author.*`      | setNull posts           |
| UserName                | `userNameService`                         | `entities/models/userName/service.ts` L1‑13    | Data/GraphQL | lecture publique              | —                       |
| UserProfile             | `userProfileService`                      | `entities/models/userProfile/service.ts` L1‑14 | Data/GraphQL | `client.models.UserProfile.*` | auth userPool           |
| Relations Post↔Tag     | `postTagService` & `syncTagPosts`         | `entities/relations/postTag/*`                 | Data/GraphQL | `client.models.PostTag.*`     | utilise `createM2MSync` |
| Relations Section↔Post | `sectionPostService` & `syncSectionPosts` | `entities/relations/sectionPost/*`             | Data/GraphQL | `client.models.SectionPost.*` | idem                    |

---

### Tests/Analyse statique

- N/A (analyse statique uniquement)

### Notes

- Les renommages proposés nécessitent mise à jour en cascade des appels, tests lint/build.
- Aucune Server Action détectée (`rg "use server"`).
