import type { PartialFASTElementDefinition } from "@microsoft/fast-element";
import { global } from "@storybook/global";

export function isFASTElementDefinition(
    value: any,
): value is PartialFASTElementDefinition {
    return (value as PartialFASTElementDefinition).name?.split("-")?.length > 1;
}

export function isValidComponent(component: any) {
    if (!component) {
        return false;
    }
    if (typeof component === "string") {
        return true;
    }
    if (isFASTElementDefinition(component)) {
        return true;
    }

    throw new Error(
        'Provided component needs to be a string or component. e.g. component: "my-element"',
    );
}

export function isValidMetaData(customElements: any) {
    if (!customElements) {
        return false;
    }

    if (
        (customElements.tags && Array.isArray(customElements.tags)) ||
        (customElements.modules && Array.isArray(customElements.modules))
    ) {
        return true;
    }
    throw new Error(`You need to setup valid meta data in your config.js via setCustomElements().
    See the readme of addon-docs for web components for more details.`);
}

/** @param customElements `any` for now as spec is not super stable yet */
export function setCustomElements(customElements: any) {
    global.__STORYBOOK_CUSTOM_ELEMENTS__ = customElements;
}

export function setCustomElementsManifest(customElements: any) {
    global.__STORYBOOK_CUSTOM_ELEMENTS_MANIFEST__ = customElements;
}

export function getCustomElements() {
    return (
        global.__STORYBOOK_CUSTOM_ELEMENTS__ ||
        global.__STORYBOOK_CUSTOM_ELEMENTS_MANIFEST__
    );
}
