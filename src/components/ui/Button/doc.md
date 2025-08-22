Parfait, tu as validé l’utilisation de la consigne tout en fournissant des précisions cruciales pour une implémentation **encore plus robuste** 💪

Voici la version **finalisée** de la consigne, prenant **en compte** :

* L’ajout d’une **règle ESLint personnalisée**
* L’unification des props `buttonProps` / `iconButtonProps` (communs à tous les wrappers)
* Le **contexte MUI** pour les icônes
* L’objectif de migration vers un **design system scalable**
* La nécessité de **documentation technique ou visuelle (README/Storybook)** pour chaque wrapper

---

## ✅ Consigne révisée (finale)

> Agis en tant que **développeur front-end senior spécialisé en Design System, React, TypeScript et MUI**.
>
> Tu dois effectuer une **refactorisation structurée et typée** du système de boutons de l’application afin d’assurer :
>
> * Une API claire et discriminée par action
> * La compatibilité accessibilité (a11y)
> * La migration progressive vers un **Design System générique et réutilisable**
>
> ### 🎯 Objectif :
>
> Standardiser les boutons pour :
>
> * Renforcer la lisibilité et la sécurité des interfaces (props typées)
> * Préparer la montée en design system commun (interne ou externe)
> * Améliorer l’expérience développeur (DX) via des composants clairs, documentés et testés
>
> ---
>
> ### 🔧 Étapes de la tâche :
>
> #### 1. Refactor `UiButton.tsx`
>
> * Ajouter une prop discriminante `variantType: "button" | "icon"`
> * En mode `button` :
>
>   * `label` requis
>   * `icon` optionnelle
>   * `ariaLabel` interdit
> * En mode `icon` :
>
>   * `icon` + `ariaLabel` requis
>   * `label` interdit
> * Support des deux cas d’usage : `href` (navigation) **ou** action via `onClick` injecté par `buttonProps` ou `iconButtonProps` (communs)
> * Typage strict via `UiButtonProps` discriminé par `variantType` et `href`/callback
> * Icônes : proviennent toutes de `@mui/icons-material`
>
> #### 2. Refactor `Buttons.tsx`
>
> * Créer ou refactorer chaque wrapper pour exposer **uniquement une prop d’action spécifique**, sans exposer `onClick` :
>
>   | Composant          | Prop attendue     |
>   | ------------------ | ----------------- |
>   | `EditButton`       | `onEdit`          |
>   | `DeleteButton`     | `onDelete`        |
>   | `CancelButton`     | `onCancel`        |
>   | `AddButton`        | `onAdd`           |
>   | `SubmitButton`     | `onSubmit`        |
>   | `UpdateButton`     | `onUpdate`        |
>   | `BackButton`       | `onReturn` / `href` |
>   | `PowerButton`      | `onPowerOff`      |
>   | `RefreshButton`    | `onRefresh`       |
>   | `ClearFieldButton` | `onClear`         |
>
> * Tous les wrappers injectent leur callback via une **seule prop d’action métier** dans `buttonProps` ou `iconButtonProps`, **selon `variantType`**
>
> * Chaque wrapper fixe par défaut :
>
>   * `variantType`
>   * l’icône (MUI)
>   * `intent`, `title`, `label`, accessibilité
>
> * `label` et `title` sont personnalisables
>
> #### 3. Créer `SubmitButton` et `UpdateButton`
>
> * `SubmitButton` : bouton, icône `Save`, label par défaut = `"Créer"`, title = `"Créer"`, intent = `primary`
> * `UpdateButton` : bouton, icône `Save`, label par défaut = `"Enregistrer"`, title = `"Enregistrer"`, intent = `primary`
>
> #### 4. Mettre à jour `ActionButtons.tsx`
>
> * Remplacer `SaveButton` par `UpdateButton`
> * Changer `onSave` → `onUpdate`
> * Garder logique conditionnelle avec `isEditing`
>
> #### 5. Mettre à jour les exports (`index.ts`)
>
> * Exporter tous les boutons via `Buttons.tsx`
> * Réexporter `UiButton`, `UiButtonProps`
> * Ajouter compatibilité historique via :
>
>   ```ts
>   // Button.tsx
>   export { default } from "./UiButton";
>   export type { UiButtonProps as ButtonProps } from "./UiButton";
>   ```
>
> #### 6. Ajout ESLint
>
> * Ajouter une règle ESLint personnalisée interdisant l’usage de `onClick` directement sur les wrappers de bouton (`EditButton`, `DeleteButton`, etc.)
> * La règle doit pointer l’usage valide de la prop métier correspondante (`onEdit`, `onDelete`, etc.)
>
> #### 7. Documentation
>
> * Créer une doc (README.md ou Storybook) pour chaque wrapper :
>
>   * Usage
>   * Props attendues
>   * Accessibilité (ex : `ariaLabel` obligatoire en mode `icon`)
>   * Exemples visuels
>
> #### 8. Vérification finale
>
> * ✅ Aucun wrapper ne doit exposer `onClick`
> * ✅ `UiButton` est 100% générique et piloté via `buttonProps` / `iconButtonProps`
> * ✅ `variantType` respecte les contraintes `label`/`ariaLabel`
> * ✅ Accessibilité respectée (`ariaLabel` pour tous les boutons icônes)
> * ✅ Tous les wrappers sont testés (optionnel mais recommandé)
>
> ---
>
> ### 🧪 Format attendu :
>
> Code React + TypeScript + MUI modulaire, strictement typé, documenté. Chaque composant est clair, réutilisable et prêt pour design system.

Voici un **prompt Codex** prêt à coller (texte brut) pour opérer la refacto demandée.
Il impose des props **distinctes par type de bouton**, remplace `SaveButton` par `UpdateButton` dans `ActionButtons`, et crée un `SubmitButton` qui utilise l’icône **Save** avec le titre **“Créer”**.

---

# Refactor UI Buttons — enforce per-button props, add UpdateButton, redefine SubmitButton

## Objectif

1. Introduire/mettre à jour `UiButton` (discriminé par `variantType: "button" | "icon"`)
2. Dans `Buttons.tsx`, donner à chaque bouton **sa propre prop d’action** (pas `onClick` générique) :

   * `EditButton` → `onEdit`
   * `DeleteButton` → `onDelete`
   * `CancelButton` → `onCancel`
   * `AddButton` → `onAdd`
   * `SubmitButton` → `onSubmit` (icône Save, title "Créer")
   * `UpdateButton` → `onUpdate` (icône Save, title "Enregistrer")
   * `BackButton` → `onBack` (ou `href`)
   * `PowerButton` → `onPowerOff`
   * `RefreshButton` → `onRefresh`
   * `ClearFieldButton` → `onClear`
3. Corriger `ActionButtons.tsx` pour utiliser `UpdateButton` (et `onUpdate`) au lieu de `SaveButton`.
4. Garder compat avec `href` (NextLink) et accessibilité (`ariaLabel` obligatoire en mode `icon`).
5. Mettre à jour `index.ts` des boutons.

## Contraintes TypeScript

* En mode `variantType: "button"` : `label` **requis** (pas d’`ariaLabel`), icône optionnelle via `icon`.
* En mode `variantType: "icon"` : `icon` **requis**, `ariaLabel` **requis**, **pas** de `label`.
* Navigation vs action est discriminée : **soit** `href` **soit** une prop d’action propre (`onEdit`, `onDelete`, etc.).
* Chaque wrapper (`EditButton`, `DeleteButton`, …) **n’expose pas** `onClick`. Il expose **sa** prop (`onEdit`, `onDelete`, …) et la mappe en interne vers `UiButton`.

## Fichiers et modifications

1. src/components/ui/button/UiButton.tsx (créer/mettre à jour)

---

* Implémente `variantType: "button" | "icon"`.
* Discrimine :

  * Mode `button`: `label` requis, `ariaLabel` interdit.
  * Mode `icon`: `icon` + `ariaLabel` requis, `label` interdit.
* Supporte `href` (NextLink) OU callback (via props transmises par les wrappers).
* Propose `intent: "primary" | "neutral" | "success" | "danger" | "warning" | "ghost"`.
* Gère `loading` (spinner), `disabled`, `tooltip`, `title`, `size`, `variant`, `sx`, `className`.
* Exemple d’API interne :

```tsx
export type UiButtonIntent =
  | "primary" | "neutral" | "success" | "danger" | "warning" | "ghost";

type Common = {
  intent?: UiButtonIntent;
  variant?: MuiButtonProps["variant"];
  size?: MuiButtonProps["size"];
  loading?: boolean;
  tooltip?: string;
  title?: string;
  className?: string;
  sx?: SxProps<Theme>;
  disabled?: boolean;
  type?: MuiButtonProps["type"];
  buttonProps?: Partial<MuiButtonProps>;
  iconButtonProps?: Partial<MuiIconButtonProps>;
};

type ButtonMode = Common & {
  variantType: "button";
  label: string;
  icon?: React.ReactNode;
  ariaLabel?: never;
};

type IconMode = Common & {
  variantType: "icon";
  icon: React.ReactNode;
  ariaLabel: string;
  label?: never;
};

type AsLink = { href: string };
type AsAction = { href?: undefined };

export type UiButtonProps = (ButtonMode | IconMode) & (AsLink);
```

* Note: les **wrappers** ci-dessous injecteront eux-mêmes la callback (via `onClick`) dans `buttonProps`/`iconButtonProps`, pour garder `UiButtonProps` indépendant des noms d’actions métier.

2. src/components/ui/button/Buttons.tsx (refactor massif)

---

* Remplacer les anciens wrappers pour exposer des props **spécifiques** :

  * `EditButton({ onEdit, ...rest })`
  * `DeleteButton({ onDelete, ...rest })`
  * `CancelButton({ onCancel, ...rest })`
  * `AddButton({ onAdd, ...rest })`
  * `SubmitButton({ onSubmit, ...rest })` → **icône Save**, `title="Créer"`
  * `UpdateButton({ onUpdate, ...rest })` → **icône Save**, `title="Enregistrer"`
  * `BackButton({ href, onBack, ...rest })` (permet soit lien, soit action)
  * `PowerButton({ onPowerOff, ...rest })`
  * `RefreshButton({ onRefresh, ...rest })`
  * `ClearFieldButton({ onClear, ...rest })`

* Chaque wrapper :

  * choisit `variantType` par défaut (`"button"` si label attendu, `"icon"` si usage icône-only),
  * mappe sa prop d’action vers `onClick` interne via `buttonProps={{ onClick: onXxx }}` ou `iconButtonProps={{ onClick: onXxx }}`,
  * passe `href` si fourni,
  * met l’icône dédiée et le `title` dédié,
  * fixe un `intent` cohérent.

* Exemples de signatures (extraits) :

```tsx
type CommonExpose = Pick<UiButtonProps, "className"|"sx"|"size"|"tooltip"|"title"> & {
  href?: string;
};

export type CancelButtonProps = CommonExpose & {
  onCancel: () => void;
  label?: string; // par défaut "Annuler" si non fourni en mode button
  variantType?: "button" | "icon"; // permet les 2 usages
};

export function CancelButton({ onCancel, label = "Annuler", variantType = "button", ...rest }: CancelButtonProps) {
  return (
    <UiButton
      {...rest}
      variantType={variantType}
      {...(variantType === "button"
        ? { label, icon: <CancelIcon />, intent: "ghost", variant: "outlined",
            buttonProps: { onClick: onCancel } }
        : { icon: <CancelIcon />, ariaLabel: label, intent: "ghost", variant: "outlined",
            iconButtonProps: { onClick: onCancel } })}
    />
  );
}
```

* Créer `SubmitButton` (icône Save, title "Créer") :

```tsx
export type SubmitButtonProps = CommonExpose & { onSubmit: () => void; label?: string; };

export function SubmitButton({ onSubmit, label = "Créer", ...rest }: SubmitButtonProps) {
  return (
    <UiButton
      {...rest}
      variantType="button"
      label={label}
      icon={<SaveIcon />}
      intent="primary"
      title="Créer"
      buttonProps={{ onClick: onSubmit }}
    />
  );
}
```

* Créer `UpdateButton` (icône Save, title "Enregistrer") :

```tsx
export type UpdateButtonProps = CommonExpose & { onUpdate: () => void; label?: string; };

export function UpdateButton({ onUpdate, label = "Enregistrer", ...rest }: UpdateButtonProps) {
  return (
    <UiButton
      {...rest}
      variantType="button"
      label={label}
      icon={<SaveIcon />}
      intent="primary"
      title="Enregistrer"
      buttonProps={{ onClick: onUpdate }}
    />
  );
}
```

3. src/components/ui/button/ActionButtons.tsx (corriger)

---

* Remplacer l’usage de `SaveButton` par `UpdateButton` + changer la prop en `onUpdate`.
* Signature :

```tsx
type Props = {
  isEditing: boolean;
  onEdit: () => void;
  onUpdate: () => void;   // <-- remplace onSave
  onCancel: () => void;
  className?: string;
  size?: "small"|"medium"|"large";
};
```

* Rendu :

```tsx
<div className={className} style={{ display: "flex", gap: ".5rem" }}>
  {!isEditing && <EditButton onEdit={onEdit} label="Modifier" size={size} />}
  {isEditing && (
    <>
      <UpdateButton onUpdate={onUpdate} label="Enregistrer" size={size} />
      <CancelButton onCancel={onCancel} label="Annuler" size={size} />
    </>
  )}
</div>
```

4. src/components/ui/button/index.ts (exports)

---

* Exporter `UiButton`, `UiButtonProps`, et tous les wrappers refactorés :

```ts
export { default as UiButton } from "./UiButton";
export type { UiButtonProps } from "./UiButton";
export * from "./Buttons";
export { default as ActionButtons } from "./ActionButtons";
```

5. Compat optionnelle (Button.tsx / IconButton.tsx)

---

* Si des imports historiques existent, ré-exporter :

```ts
// Button.tsx
export { default } from "./UiButton";
export type { UiButtonProps as ButtonProps } from "./UiButton";

// IconButton.tsx
export { default } from "./UiButton";
export type { UiButtonProps as IconButtonProps } from "./UiButton";
```

6. Remplacements ciblés (codebase)

---

* Remplacer les usages dans `ActionButtons.tsx` :

  * `onSave` → `onUpdate`
  * `SaveButton` → `UpdateButton`
* (Optionnel mais recommandé) Passer progressivement :

  * `EditButton onClick=` → `EditButton onEdit=`
  * `DeleteButton onClick=` → `DeleteButton onDelete=`
  * `CancelButton onClick=` → `CancelButton onCancel=`
  * `AddButton onClick=` → `AddButton onAdd=`
  * `SubmitButton onClick=` → `SubmitButton onSubmit=`
  * `RefreshButton onClick=` → `RefreshButton onRefresh=`
  * `PowerButton onClick=` → `PowerButton onPowerOff=`
  * `ClearFieldButton onClick=` → `ClearFieldButton onClear=`
  * `BackButton onClick=` → `BackButton onBack=` (ou utiliser `href`)

## Vérifications

* Type-check : aucun wrapper n’expose `onClick` générique, seulement sa prop dédiée.
* Accessibilité : en `variantType="icon"`, chaque bouton a un `ariaLabel`.
* `SubmitButton` affiche l’icône **Save** et `title="Créer"`.
* `UpdateButton` affiche l’icône **Save** et `title="Enregistrer"`.
* `ActionButtons` utilise `UpdateButton` + `onUpdate`.

Fin.

