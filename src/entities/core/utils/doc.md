# Utilitaires d'interface Amplify

## `amplifyUiConfig`

Ce module centralise la configuration de l'interface d'authentification d'AWS Amplify.

- `configureI18n` définit la langue en français et injecte les traductions via `I18n.setLanguage` et `I18n.putVocabularies`.
- `formFields` personnalise les champs des formulaires `signIn` et `signUp` (labels, placeholders, ordre...).

## `createModelForm`

`createModelForm` renvoie un objet `{ initialForm, toForm, toInput }`
permettant de centraliser la transformation des modèles et la conversion
vers le format d'entrée attendu par l'API.

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

function toUtilisateurForm(user: Utilisateur): FormulaireUtilisateur {
    return {
        email: user.email,
        nomComplet: `${user.prenom} ${user.nom}`,
    };
}

function toUtilisateurInput(form: FormulaireUtilisateur): Utilisateur {
    const [prenom, nom = ""] = form.nomComplet.split(" ");
    return { id: "", email: form.email, prenom, nom };
}

export const utilisateurForm = createModelForm<Utilisateur, FormulaireUtilisateur, [], Utilisateur>(
    { email: "", nomComplet: "" },
    toUtilisateurForm,
    toUtilisateurInput
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
