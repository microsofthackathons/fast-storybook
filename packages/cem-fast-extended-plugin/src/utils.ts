import ts from "typescript";

/**
 * GENERAL UTILITIES
 */

export const has = (arr: string | any[]) =>
    Array.isArray(arr) && arr.length > 0;

export function isBareModuleSpecifier(specifier: {
    replace: (arg0: RegExp, arg1: string) => string[];
}) {
    return !!specifier?.replace(/'/g, "")[0].match(/[@a-zA-Z]/g);
}

export const url = (path: any) => new URL("", `file:///${path}`)?.pathname;

export function resolveModuleOrPackageSpecifier(
    moduleDoc: { path: any },
    context: { imports: any[] },
    name: any,
) {
    const foundImport = context?.imports?.find(
        (_import: { name: any }) => _import.name === name,
    );

    /* item is imported from another file */
    if (foundImport) {
        if (foundImport.isBareModuleSpecifier) {
            /* import is from 3rd party package */
            return { package: foundImport.importPath };
        }
        /* import is imported from a local module */
        return {
            module: new URL(foundImport.importPath, `file:///${moduleDoc.path}`)
                .pathname,
        };
    }
    /* item is in current module */
    return { module: moduleDoc.path };
}

export const toKebabCase = (str: string) => {
    return str
        .split("")
        .map((letter: string, idx: number) => {
            return letter.toUpperCase() === letter
                ? `${idx !== 0 ? "-" : ""}${letter.toLowerCase()}`
                : letter;
        })
        .join("");
};

/**
 * TS seems to struggle sometimes with the `.getText()` method on JSDoc annotations, like `@deprecated` in ts v4.0.0 and `@override` in ts v4.3.2
 * This is a bug in TS, but still annoying, so we add some safety rails here
 */
export const safe = (cb: () => any, returnType = "") => {
    try {
        return cb();
    } catch {
        return returnType;
    }
};

export function withErrorHandling(name: string, cb: () => void) {
    try {
        cb();
    } catch (e: unknown) {
        let errorMessage = "";
        const externalError = `Looks like you've hit an error in third party plugin: ${name}. Please try to create a minimal reproduction and inform the author of the ${name} plugin.`;
        const coreError = `Looks like you've hit an error in the core library. Please try to create a minimal reproduction at https://custom-elements-manifest.netlify.com and create an issue at: https://github.com/open-wc/custom-elements-manifest/issues`;
        if (name) {
            errorMessage = name.startsWith("CORE") ? coreError : externalError;
        }

        throw new Error(
            `\n\n[${name ?? "unnamed-plugin"}]: ${errorMessage}\n\n ${(e as any).stack}\n`,
        );
    }
}
