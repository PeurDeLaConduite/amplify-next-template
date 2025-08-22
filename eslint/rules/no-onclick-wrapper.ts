import { Rule } from "eslint";
import { JSXOpeningElement } from "estree";

const rule: Rule.RuleModule = {
    meta: {
        type: "problem",
        docs: {
            description:
                "Interdit l'utilisation de onClick sur les composants *Button pour encourager les props métier spécifiques.",
        },
        messages: {
            noOnClick:
                "Évitez onClick sur {{name}}. Utilisez une prop métier spécifique (ex. onEdit, onDelete, onSubmit).",
        },
        schema: [],
    },
    create(context) {
        return {
            JSXOpeningElement(node: JSXOpeningElement) {
                const filename = context.getFilename();
                if (filename.includes("UiButton.tsx")) return;

                let elementName: string | undefined;
                if (node.name.type === "JSXIdentifier") {
                    elementName = node.name.name;
                } else if (node.name.type === "JSXMemberExpression") {
                    // handle cases like <UI.PowerButton>
                    let current: any = node.name;
                    while (current.type === "JSXMemberExpression") {
                        current = current.property;
                    }
                    elementName = current.name;
                }
                if (
                    elementName &&
                    elementName.endsWith("Button") &&
                    elementName !== "MuiButton" &&
                    elementName !== "MuiIconButton"
                ) {
                    const hasOnClick = node.attributes.some(
                        (attr) =>
                            attr.type === "JSXAttribute" &&
                            attr.name &&
                            attr.name.name === "onClick"
                    );
                    if (hasOnClick) {
                        context.report({
                            node,
                            messageId: "noOnClick",
                            data: { name: elementName },
                        });
                    }
                }
            },
        };
    },
};

export default rule;
