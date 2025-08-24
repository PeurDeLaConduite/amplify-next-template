import { Amplify } from "aws-amplify";

export const amplifyOutputs = {
    auth: {
        aws_region: "eu-west-3",
        userPoolId: "eu-west-3_cVrLIne9H",
        userPoolWebClientId: "5i8l89k5muqtfpb3v2l53h2noe",
        identityPoolId: "eu-west-3:1ee02197-0a9c-4134-9d76-a724e3b870d2",
        cookieStorage: {
            domain: ".peur-de-la-conduite.fr", // 🔑 cookies valables partout
            path: "/",
            expires: 365,
            secure: true,
        },
    },
    data: {
        url: "https://o2x2izy77rg4fnmjoqywvso4cm.appsync-api.eu-west-3.amazonaws.com/graphql",
        aws_region: "eu-west-3",
        api_key: "da2-xxxxx", // ton API key
        default_authorization_type: "AMAZON_COGNITO_USER_POOLS",
        authorization_types: ["API_KEY", "AWS_IAM"],
        model_introspection: {
            /* … ton schema models … */
        },
    },
    storage: {
        aws_region: "eu-west-3",
        bucket_name: "amplify-xxxx",
    },
    version: "1.3",
} as const;

Amplify.configure(amplifyOutputs);
export default amplifyOutputs;
