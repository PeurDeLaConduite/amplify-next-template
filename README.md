## AWS Amplify Next.js (App Router) Starter Template

This repository provides a starter template for creating applications using Next.js (App Router) and AWS Amplify, emphasizing easy setup for authentication, API, and database capabilities.

## Overview

This template equips you with a foundational Next.js application integrated with AWS Amplify, streamlined for scalability and performance. It is ideal for developers looking to jumpstart their project with pre-configured AWS services like Cognito, AppSync, and DynamoDB.

## Features

- **Authentication**: Setup with Amazon Cognito for secure user authentication.
- **API**: Ready-to-use GraphQL endpoint with AWS AppSync.
- **Database**: Real-time database powered by Amazon DynamoDB.

## Examples

Des exemples d'utilisation du composant `EntityEditor` sont disponibles :

- [UserProfileExample.tsx](src/examples/UserProfileExample.tsx)
- [UserNameExample.tsx](src/examples/UserNameExample.tsx)

### Autocomplétion des champs

Le composant `EntityForm` accepte désormais la prop `fieldAutoComplete`,
un objet qui associe à chaque champ un token d'autocomplétion HTML
(`email`, `given-name`, `family-name`, etc.).
Cela permet aux navigateurs de proposer des valeurs pertinentes lors de la saisie.

```tsx
<EntityEditor
    fieldAutoComplete={{
        email: "email",
        firstName: "given-name",
        familyName: "family-name",
    }}
    {...autresProps}
/>
```

## Deploying to AWS

For detailed instructions on deploying your application, refer to the [deployment section](https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/#deploy-a-fullstack-app-to-aws) of our documentation.

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.
