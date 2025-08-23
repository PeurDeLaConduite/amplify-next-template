Parfait 👍

# 📘 Guide d’utilisation des Boutons `@components/ui/Button`

## 🎯 Objectif

Les composants `Button` sont des **wrappers standardisés** autour de `UiButton` (MUI).
Ils permettent de :

- Appliquer des styles cohérents (`outlined`, couleurs par intent).
- Simplifier l’utilisation de boutons récurrents (Ajouter, Supprimer, Retour…).
- Faciliter la gestion des actions (`onEdit`, `onDelete`, `onBack`, etc.).

---

## 🚀 Importer les composants

```tsx
import {
    EditButton,
    DeleteButton,
    UpdateButton,
    CancelButton,
    AddButton,
    BackButton,
    SubmitButton,
    ClearFieldButton,
    RefreshButton,
    PowerButton,
} from "@components/ui/Button";
```

---

## 🧩 API commune (`ButtonWrapperProps`)

Chaque bouton hérite des props suivantes :

| Prop          | Type                                 | Description                                                 |
| ------------- | ------------------------------------ | ----------------------------------------------------------- |
| `label`       | `string`                             | Texte affiché (ou utilisé pour `ariaLabel` si icône seule). |
| `title`       | `string`                             | Titre du bouton (fallback automatique = `label`).           |
| `variantType` | `"button"` \| `"icon"`               | Mode d’affichage (`button` classique ou `icon` seul).       |
| `size`        | `"small"` \| `"medium"` \| `"large"` | Taille MUI (`icon` → `small` forcé par défaut).             |
| `sx`          | `SxProps<Theme>`                     | Styles additionnels MUI.                                    |
| `className`   | `string`                             | Classes Tailwind ou custom.                                 |
| `ariaLabel`   | `string`                             | Accessibilité (fallback automatique).                       |
| `editColor`   | `string` (optionnel)                 | Couleur custom pour le contour (ex: `#1976d2`).             |

---

## 🔧 Boutons disponibles

### ✏️ `EditButton`

- Action : **éditer une entité**.

```tsx
<EditButton onEdit={() => console.log("edit")} label="Modifier" editColor="#1976d2" />
```

---

### 🗑️ `DeleteButton`

- Action : **supprimer une entité**.

```tsx
<DeleteButton onDelete={() => console.log("delete")} label="Supprimer" editColor="red" />
```

---

### 💾 `UpdateButton`

- Action : **sauvegarder des modifications**.

```tsx
<UpdateButton onUpdate={() => console.log("update")} label="Enregistrer" />
```

---

### 📥 `SubmitButton`

- Action : **créer une entité**.

```tsx
<SubmitButton onSubmit={() => console.log("create")} label="Créer" />
```

---

### ❌ `CancelButton`

- Action : **annuler une action**.

```tsx
<CancelButton onCancel={() => console.log("cancel")} label="Annuler" editColor="#9e9e9e" />
```

---

### ➕ `AddButton`

- Action : **ajouter un élément**.

```tsx
<AddButton onAdd={() => console.log("add")} label="Ajouter" editColor="green" />
```

---

### 🔙 `BackButton`

- Action : **retourner en arrière** (naviguer ou quitter un mode).

```tsx
<BackButton onBack={() => console.log("back")} label="Retour" editColor="#1976d2" />
<BackButton href="/dashboard" label="Retour au dashboard" />
```

---

### 🧹 `ClearFieldButton`

- Action : **vider un champ**.

```tsx
<ClearFieldButton onClear={() => console.log("clear")} label="Vider le champ" />
```

---

### 🔄 `RefreshButton`

- Action : **rafraîchir les données**.

```tsx
<RefreshButton onRefresh={() => console.log("refresh")} label="Rafraîchir" />
```

---

### 🔌 `PowerButton`

- Action : **déconnexion**.

```tsx
<PowerButton onPowerOff={() => console.log("logout")} label="Déconnexion" />
```

---

## 📚 Exemple complet : Champ éditable

```tsx
import { UpdateButton, BackButton } from "@components/ui/Button";

<fieldset>
    <input
        id="edit-field"
        value={value}
        onChange={(e) => setEditModeField({ field, value: e.target.value })}
    />

    <div className="flex gap-4">
        <UpdateButton onUpdate={saveField} label="Sauvegarder" />
        <BackButton onBack={() => setEditModeField(null)} label="Retour" />
    </div>
</fieldset>;
```

---

## ✅ Points clés

- `title` tombe **toujours sur `label`** si non fourni.
- `editColor` permet de **forcer une couleur** autre que celle de l’intent (`primary`, `danger`…).
- `variantType="icon"` pour n’afficher **que l’icône** (taille forcée à `small` sauf override).
- Accessibilité (`ariaLabel`) est automatiquement gérée.

# 📚 Documentation des Boutons UI

Tous les boutons sont accessibles via :

```tsx
import {
    UiButton,
    EditButton,
    DeleteButton,
    UpdateButton,
    CancelButton,
    AddButton,
    BackButton,
    SubmitButton,
    ClearFieldButton,
    RefreshButton,
    PowerButton,
} from "@components/ui/Button";
```

---

## 🔘 UiButton (base)

Le composant générique utilisé par tous les autres boutons.

**Props communes :**

- `label?: string` — texte visible (si `variantType="button"`)
- `title?: string` — attribut HTML title (fallback = `label`)
- `icon?: React.ReactNode` — icône à afficher
- `variantType?: "button" | "icon"` — rendu classique ou icône seule (défaut `"button"`)
- `size?: "small" | "medium" | "large"` — taille du bouton
- `sx?: SxProps<Theme>` — styles additionnels
- `onClick?: () => void` — callback action

---

## ✏️ EditButton

**Usage :** Sélectionner un objet à modifier (ouvre un mode édition).

```tsx
<EditButton onEdit={() => setEditingId(id)} />
```

**Props spécifiques :**

- `onEdit: () => void` — callback obligatoire
- `editColor?: string` — couleur personnalisée (défaut `"blue"`)

---

## 🗑️ DeleteButton

**Usage :** Supprime complètement un objet.

```tsx
<DeleteButton onDelete={() => removeById(id)} />
```

**Props spécifiques :**

- `onDelete: () => void`
- `editColor?: string` (défaut `"red"`)

---

## 💾 UpdateButton

**Usage :** Met à jour un objet existant (souvent après édition).

```tsx
<UpdateButton onUpdate={saveChanges} label="Sauvegarder" />
```

**Props spécifiques :**

- `onUpdate: () => void`
- `editColor?: string` (défaut `"blue"`)

---

## ❌ CancelButton

**Usage :**

- Sort du mode édition **sans sauvegarder**
- Peut rétablir l’état initial du formulaire

```tsx
<CancelButton onCancel={() => setEditingId(null)} />
```

**Props spécifiques :**

- `onCancel: () => void`
- `editColor?: string` (défaut `"#9e9e9e"`)

---

## ➕ AddButton

**Usage :** Ouvrir un mode création (ajout d’un nouvel objet).

```tsx
<AddButton onAdd={() => setCreateMode(true)} />
```

**Props spécifiques :**

- `onAdd: () => void`
- `editColor?: string` (défaut `"green"`)

---

## 🔙 BackButton

**Usage :**

- Dans un formulaire : sort du mode édition (`setEditModeField(null)`)
- Dans une page : redirige vers une autre URL (App Router)

```tsx
<BackButton onBack={() => setEditModeField(null)} />
<BackButton href="/dashboard" />
```

**Props spécifiques :**

- `onBack?: () => void` | `href?: string`
- `editColor?: string` (défaut `"#1976d2"`)

---

## 🆕 SubmitButton

**Usage :** Crée un nouvel objet (appel `create`).

```tsx
<SubmitButton onSubmit={createItem} />
```

**Props spécifiques :**

- `onSubmit: () => void`
- `editColor?: string` (défaut `"blue"`)

---

## 🧹 ClearFieldButton

**Usage :** Vide un champ, fait un reset puis update avec champ vide.

```tsx
<ClearFieldButton onClear={() => updateEntity("name", "")} />
```

**Props spécifiques :**

- `onClear: () => void`
- `editColor?: string` (défaut orange `#ed6c02`)

---

## 🔄 RefreshButton

**Usage :** Rafraîchit la page, recharge les données, reset du formulaire.

```tsx
<RefreshButton onRefresh={fetchData} />
```

**Props spécifiques :**

- `onRefresh: () => void`
- `editColor?: string` (défaut `"blue"`)

---

## 🔌 PowerButton

**Usage :** Déconnexion utilisateur (`signOut`).

```tsx
<PowerButton onPowerOff={signOut} />
```

**Props spécifiques :**

- `onPowerOff: () => void`
- `editColor?: string` (défaut `"red"`)

---

# ✅ Notes

- Tous les boutons acceptent les **props communes** (`label`, `title`, `size`, `variantType`, etc.).
- `title` est automatiquement fallback sur `label`.
- `editColor` permet de surcharger la couleur de base définie par `intent`.
