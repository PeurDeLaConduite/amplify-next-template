#!/bin/bash

set -e

# Saisie de l'email utilisateur

read -p "Enter email address: " user_email

# 1. Récupération des infos SSO Instance

response=$(aws sso-admin list-instances)
ssoId=$(echo "$response" | jq -r '.Instances[0].IdentityStoreId')
ssoArn=$(echo "$response" | jq -r '.Instances[0].InstanceArn')

# Vérif

[ -z "$ssoId" ] && { echo "Erreur : ssoId vide"; exit 1; }
[ -z "$ssoArn" ] && { echo "Erreur : ssoArn vide"; exit 1; }

# 2. Récupération de l'UserId

userId=$(aws identitystore list-users --identity-store-id "$ssoId" \
 | jq -r ".Users[] | select(.Emails[].Value==\"$user_email\") | .UserId")
[ -z "$userId" ] && { echo "Erreur : userId introuvable pour $user_email"; exit 1; }

# 3. Récupération du PermissionSetArn "amplify-policy"

permissionSetArn=$(
  for arn in $(aws sso-admin list-permission-sets --instance-arn "$ssoArn" | jq -r '.PermissionSets[]'); do
aws sso-admin describe-permission-set --instance-arn "$ssoArn" --permission-set-arn "$arn" \
 | jq -r 'select(.PermissionSet.Name=="amplify-policy") | .PermissionSet.PermissionSetArn'
done
)
[ -z "$permissionSetArn" ] && { echo "Erreur : permissionSetArn \"amplify-policy\" introuvable"; exit 1; }

# 4. Récupération de l'AccountId courant

accountId=$(aws sts get-caller-identity | jq -r '.Account')
[ -z "$accountId" ] && { echo "Erreur : accountId vide"; exit 1; }

# 5. Assignation du PermissionSet à l'utilisateur

echo
echo "==> Attribution du permission set à $user_email..."
aws sso-admin create-account-assignment \
  --instance-arn "$ssoArn" \
 --target-id "$accountId" \
  --target-type AWS_ACCOUNT \
  --permission-set-arn "$permissionSetArn" \
 --principal-type USER \
 --principal-id "$userId"

echo "✅ Fini. PermissionSet \"$permissionSetArn\" attribué à $user_email sur $accountId"

Log

aws sso login --profile JADMIN

npx ampx sandbox --profile JADMIN
