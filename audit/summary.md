# Audit — Résumé
Généré: 2025-08-08T14:00:46.838Z
Totaux: entités=9, hooks=9, services=23, forms=11

| Entité | hasConfig | hasForm | hasService | hasHook | #forms | #services | #hooks | #authRefs | Flags |
|---|:---:|:---:|:---:|:---:|---:|---:|---:|---:|---|
| author | — | ✔ | ✔ | — | 1 | 1 | 0 | 0 | — |
| createEntityHooks.ts | — | — | — | — | 0 | 0 | 0 | 10 | — |
| post | — | ✔ | ✔ | — | 1 | 1 | 0 | 0 | — |
| relations | — | — | ✔ | — | 0 | 2 | 0 | 0 | — |
| section | — | ✔ | ✔ | — | 1 | 1 | 0 | 0 | — |
| tag | — | ✔ | ✔ | — | 1 | 1 | 0 | 0 | — |
| unknown | — | — | ✔ | ✔ | 5 | 7 | 6 | 2 | service-bypass, ui-auth-leak |
| userName | — | ✔ | ✔ | ✔ | 1 | 5 | 2 | 16 | service-bypass |
| userProfile | — | ✔ | ✔ | ✔ | 1 | 5 | 1 | 10 | service-bypass |

## author
<details><summary>Fichiers</summary>

- C:/Users/super/Desktop/TEST BCK/peur-de-la-conduite/amplify-next-template/src/entities/models/author/form.ts
- C:/Users/super/Desktop/TEST BCK/peur-de-la-conduite/amplify-next-template/src/entities/models/author/service.ts

</details>
Aucun red flag détecté par les heuristiques.

## createEntityHooks.ts
<details><summary>Fichiers</summary>

- C:/Users/super/Desktop/TEST BCK/peur-de-la-conduite/amplify-next-template/src/entities/createEntityHooks.ts

</details>
Aucun red flag détecté par les heuristiques.

## post
<details><summary>Fichiers</summary>

- C:/Users/super/Desktop/TEST BCK/peur-de-la-conduite/amplify-next-template/src/entities/models/post/form.ts
- C:/Users/super/Desktop/TEST BCK/peur-de-la-conduite/amplify-next-template/src/entities/models/post/service.ts

</details>
Aucun red flag détecté par les heuristiques.

## relations
<details><summary>Fichiers</summary>

- C:/Users/super/Desktop/TEST BCK/peur-de-la-conduite/amplify-next-template/src/entities/relations/postTag/service.ts
- C:/Users/super/Desktop/TEST BCK/peur-de-la-conduite/amplify-next-template/src/entities/relations/sectionPost/service.ts

</details>
Aucun red flag détecté par les heuristiques.

## section
<details><summary>Fichiers</summary>

- C:/Users/super/Desktop/TEST BCK/peur-de-la-conduite/amplify-next-template/src/entities/models/section/form.ts
- C:/Users/super/Desktop/TEST BCK/peur-de-la-conduite/amplify-next-template/src/entities/models/section/service.ts

</details>
Aucun red flag détecté par les heuristiques.

## tag
<details><summary>Fichiers</summary>

- C:/Users/super/Desktop/TEST BCK/peur-de-la-conduite/amplify-next-template/src/entities/models/tag/form.ts
- C:/Users/super/Desktop/TEST BCK/peur-de-la-conduite/amplify-next-template/src/entities/models/tag/service.ts

</details>
Aucun red flag détecté par les heuristiques.

## unknown
<details><summary>Fichiers</summary>

- C:/Users/super/Desktop/TEST BCK/peur-de-la-conduite/amplify-next-template/src/components/Blog/manage/authors/useAuthorForm.ts
- C:/Users/super/Desktop/TEST BCK/peur-de-la-conduite/amplify-next-template/src/components/Blog/manage/posts/usePostForm.ts
- C:/Users/super/Desktop/TEST BCK/peur-de-la-conduite/amplify-next-template/src/components/Blog/manage/sections/useSectionForm.ts
- C:/Users/super/Desktop/TEST BCK/peur-de-la-conduite/amplify-next-template/src/components/Blog/manage/tags/useTagForm.ts
- C:/Users/super/Desktop/TEST BCK/peur-de-la-conduite/amplify-next-template/src/components/Header/Header.jsx
- C:/Users/super/Desktop/TEST BCK/peur-de-la-conduite/amplify-next-template/src/components/Profile/UserNameManager.tsx
- C:/Users/super/Desktop/TEST BCK/peur-de-la-conduite/amplify-next-template/src/components/Profile/UserNameModal.tsx
- C:/Users/super/Desktop/TEST BCK/peur-de-la-conduite/amplify-next-template/src/components/Profile/UserProfileManager.tsx
- C:/Users/super/Desktop/TEST BCK/peur-de-la-conduite/amplify-next-template/src/components/Profile/shared/EditField.tsx
- C:/Users/super/Desktop/TEST BCK/peur-de-la-conduite/amplify-next-template/src/components/Profile/shared/EntityForm.tsx
- C:/Users/super/Desktop/TEST BCK/peur-de-la-conduite/amplify-next-template/src/components/Profile/shared/EntitySection.tsx
- C:/Users/super/Desktop/TEST BCK/peur-de-la-conduite/amplify-next-template/src/components/Profile/shared/ReadOnlyView.tsx
- C:/Users/super/Desktop/TEST BCK/peur-de-la-conduite/amplify-next-template/src/components/Profile/utilsUserName.ts
- C:/Users/super/Desktop/TEST BCK/peur-de-la-conduite/amplify-next-template/src/components/RequireAdmin.tsx
- C:/Users/super/Desktop/TEST BCK/peur-de-la-conduite/amplify-next-template/src/hooks/useAutoGenFields.ts
- C:/Users/super/Desktop/TEST BCK/peur-de-la-conduite/amplify-next-template/src/hooks/useEntityManager.ts
- C:/Users/super/Desktop/TEST BCK/peur-de-la-conduite/amplify-next-template/src/hooks/useEntityManagerGeneral.ts
- C:/Users/super/Desktop/TEST BCK/peur-de-la-conduite/amplify-next-template/src/services/blogDataService.ts
- C:/Users/super/Desktop/TEST BCK/peur-de-la-conduite/amplify-next-template/src/services/crudService.ts
- C:/Users/super/Desktop/TEST BCK/peur-de-la-conduite/amplify-next-template/src/services/index.ts
- C:/Users/super/Desktop/TEST BCK/peur-de-la-conduite/amplify-next-template/src/services/relationService.ts
- C:/Users/super/Desktop/TEST BCK/peur-de-la-conduite/amplify-next-template/src/utils/createModelForm.ts

</details>
**Red flags**:
- service-bypass: Appel direct à client.models.* au lieu de crudService
- ui-auth-leak: Logique d'auth (owner/ADMINS) présente dans l'UI (à déplacer en service)

## userName
<details><summary>Fichiers</summary>

- C:/Users/super/Desktop/TEST BCK/peur-de-la-conduite/amplify-next-template/src/entities/models/userName/form.ts
- C:/Users/super/Desktop/TEST BCK/peur-de-la-conduite/amplify-next-template/src/entities/models/userName/hooks.tsx
- C:/Users/super/Desktop/TEST BCK/peur-de-la-conduite/amplify-next-template/src/entities/models/userName/service.ts

</details>
**Red flags**:
- service-bypass: Appel direct à client.models.* au lieu de crudService

## userProfile
<details><summary>Fichiers</summary>

- C:/Users/super/Desktop/TEST BCK/peur-de-la-conduite/amplify-next-template/src/entities/models/userProfile/form.ts
- C:/Users/super/Desktop/TEST BCK/peur-de-la-conduite/amplify-next-template/src/entities/models/userProfile/hooks.tsx
- C:/Users/super/Desktop/TEST BCK/peur-de-la-conduite/amplify-next-template/src/entities/models/userProfile/service.ts

</details>
**Red flags**:
- service-bypass: Appel direct à client.models.* au lieu de crudService
