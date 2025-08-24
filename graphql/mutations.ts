export const createArticle = /* GraphQL */ `
    mutation CreateArticle($input: CreateArticleInput!) {
        createArticle(input: $input) {
            id
            title
            summary
            content
            status
            owner
            createdAt
            updatedAt
        }
    }
`;
