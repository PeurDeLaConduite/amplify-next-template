# Utilitaires d'interface Amplify

## `amplifyUiConfig`

Ce module centralise la configuration de l'interface d'authentification d'AWS Amplify.

- `configureI18n` définit la langue en français et injecte les traductions via `I18n.setLanguage` et `I18n.putVocabularies`.
- `formFields` personnalise les champs des formulaires `signIn` et `signUp` (labels, placeholders, ordre...).

## `createModelForm`

`createModelForm` génère un objet `{ initialForm, toForm }` permettant de convertir un modèle en valeurs de formulaire.

### Exemple

```ts
interface Utilisateur {
    id: string;
    email: string;
    prenom: string;
    nom: string;
}

interface FormulaireUtilisateur {
    email: string;
    nomComplet: string;
}

const utilisateurForm = createModelForm<Utilisateur, FormulaireUtilisateur>(
    { email: "", nomComplet: "" },
    (user) => ({
        email: user.email,
        nomComplet: `${user.prenom} ${user.nom}`,
    })
);

const exemple: Utilisateur = {
    id: "42",
    email: "foo@bar.com",
    prenom: "Foo",
    nom: "Bar",
};

const valeursFormulaire = utilisateurForm.toForm(exemple);
// { email: "foo@bar.com", nomComplet: "Foo Bar" }
```
