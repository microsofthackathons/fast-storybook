import type { Plugin } from "@custom-elements-manifest/analyzer";
import { resolveModuleOrPackageSpecifier } from "./utils.js";

type Prefixes = { [key: string]: string }[];
export function cemFASTAddDefinitions(
    options: { prefixes: Prefixes } = {
        prefixes: [],
    },
): Plugin {
    const invalidChars =
        // biome-ignore lint/suspicious/noMisleadingCharacterClass: "[\u200C-\u200D]" is a valid character class
        /[^-._0-9a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\{u10000}-\u{EFFFF}]/gu;

    return {
        name: "cem-plugin-fast-extended--add-definitions",
        analyzePhase({ ts, node, moduleDoc, context }) {
            if (!ts.isCallExpression(node)) {
                return;
            }

            const expression = node.expression;

            if (expression.getText() === "Object.freeze") {
                const firstArgument = node.arguments[0];

                if (!ts.isObjectLiteralExpression(firstArgument)) {
                    return;
                }
                const parent = node.parent;
                if (!ts.isVariableDeclaration(parent)) {
                    return;
                }
                const properties = firstArgument.properties;
                properties.forEach(n => {
                    if (
                        ts.isPropertyAssignment(n) &&
                        n.name.getText() === "prefix"
                    ) {
                        context.prefixes = [
                            ...((context.prefixes as Prefixes) ?? []),
                            {
                                [`${parent.name?.getText()}.${n.name.getText()}`]:
                                    n.initializer
                                        .getText()
                                        .replace(invalidChars, ""),
                            },
                        ];
                    }
                });
            }

            if (expression.getLastToken()?.getText() === "compose") {
                const elementClass = expression.getFirstToken()?.getText();
                if (elementClass) {
                    // The first argument of the "compose" call should be an object literal
                    // TODO: what if it's a reference to an object?
                    const firstArgument = node.arguments[0];
                    if (ts.isObjectLiteralExpression(firstArgument)) {
                        const properties = firstArgument.properties;
                        const elementTagNameNode = properties.find(
                            n =>
                                ts.isPropertyAssignment(n) &&
                                n.name.getText() === "name",
                        ) as any;

                        if (ts.isPropertyAssignment(elementTagNameNode)) {
                            // Find the "name" property in the object literal
                            const elementTag =
                                elementTagNameNode.initializer.getText();

                            const definitionDoc = {
                                kind: "custom-element-definition",
                                name: elementTag,
                                declaration: {
                                    name: elementClass,
                                    ...resolveModuleOrPackageSpecifier(
                                        moduleDoc as any,
                                        context as any,
                                        elementClass,
                                    ),
                                },
                            };

                            moduleDoc.exports = [
                                ...((moduleDoc.exports || []) as any),
                                definitionDoc,
                            ];
                        }
                    }
                }
            }
        },

        packageLinkPhase({ context, customElementsManifest }) {
            const prefixes: Prefixes = [
                ...(options.prefixes ?? []),
                ...((context?.prefixes as Prefixes) ?? []),
            ];
            if (!prefixes) {
                return;
            }

            for (const prefixObj of prefixes) {
                Object.keys(prefixObj).forEach(key => {
                    customElementsManifest.modules?.forEach(_module => {
                        // Replace the exported custom element names with the prefixes
                        _module.exports
                            ?.filter(
                                ({ kind }) =>
                                    kind === "custom-element-definition",
                            )
                            .forEach(_export => {
                                _export.name = _export.name
                                    .replace(
                                        new RegExp(`\`\\$\\{${key}\\}(.*)\``),
                                        (_, p1) => `${prefixObj[key]}${p1}`,
                                    )
                                    .replace(/['"]/g, "");
                            });

                        // Replace the declaration members that have a `tagName` property with the prefixes
                        _module.declarations
                            ?.filter(({ kind }) => kind === "class")
                            .forEach((_declaration: any) => {
                                if (!_declaration.tagName) {
                                    return;
                                }

                                _declaration.tagName = (
                                    _declaration.tagName as string
                                ).replace(
                                    new RegExp(`\`\\$\\{${key}\\}(.*)\``),
                                    (_, p1) => `${prefixObj[key]}${p1}`,
                                );
                            });
                    });
                });
            }
        },
    };
}
