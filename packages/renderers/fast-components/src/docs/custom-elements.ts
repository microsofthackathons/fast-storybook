import type { FASTElementDefinition } from "@microsoft/fast-element";
import { logger } from "@storybook/core/client-logger";
import type { ArgTypes, InputType } from "@storybook/core/types";
import invariant from "tiny-invariant";
import {
    getCustomElements,
    isValidComponent,
    isValidMetaData,
} from "../framework-api.js";
import type { FASTComponentsRenderer } from "../types.mjs";

interface TagItem {
    name: string;
    type: { [key: string]: any };
    description: string;
    default?: any;
    kind?: string;
    defaultValue?: any;
}

interface Tag {
    name: string;
    description: string;
    attributes?: TagItem[];
    properties?: TagItem[];
    events?: TagItem[];
    methods?: TagItem[];
    members?: TagItem[];
    slots?: TagItem[];
    cssProperties?: TagItem[];
    cssParts?: TagItem[];
}

interface CustomElements {
    tags: Tag[];
    modules?: [];
}

interface Module {
    declarations?: [];
    exports?: [];
}

interface Declaration {
    tagName: string;
}

function mapItem(item: TagItem, category: string): InputType {
    let type: any;
    switch (category) {
        case "attributes":
        case "properties": {
            // TODO: import type consts somehow
            type = { name: item.type?.text || item.type };
            break;
        }
        case "slots": {
            type = { name: "string" };
            break;
        }
        default: {
            type = { name: "other" };
            break;
        }
    }

    const newItem = {
        name: item.name,
        required: false,
        description: item.description,
        type,
        table: {
            category,
            type: { summary: item.type?.text || item.type },
            defaultValue: {
                summary: item.default ?? item.defaultValue,
            },
        },
    };

    return newItem;
}

function mapEvent(item: TagItem): InputType[] {
    let name = item.name
        .replace(/(-|_|:|\.|\s)+(.)?/g, (_match, _separator, chr: string) => {
            return chr?.toUpperCase() ?? "";
        })
        .replace(/^([A-Z])/, match => match.toLowerCase());

    name = `on${name.charAt(0).toUpperCase() + name.substr(1)}`;

    return [
        { name, action: { name: item.name }, table: { disable: true } },
        mapItem(item, "events"),
    ];
}

function mapData(data: TagItem[], category: string) {
    return (
        data
            // ?.filter(item => item.name)
            .reduce((acc, item) => {
                if (item.kind === "method") {
                    return acc;
                }

                switch (category) {
                    case "events":
                        mapEvent(item).forEach(argType => {
                            invariant(
                                argType.name,
                                `${argType} should have a name property.`
                            );
                            acc[argType.name] = argType;
                        });
                        break;
                    default:
                        acc[item.name] = mapItem(item, category);
                        break;
                }

                return acc;
            }, {} as ArgTypes)
    );
}

function getComponentName(component: FASTComponentsRenderer["component"]): string {
    return (component as FASTElementDefinition)?.name ?? component;
}

const getMetaDataExperimental = (
    t: string | FASTElementDefinition,
    customElements: CustomElements
) => {
    const tagName = getComponentName(t);
    if (!isValidComponent(tagName) || !isValidMetaData(customElements)) {
        return null;
    }
    const metaData = customElements.tags.find(
        tag => tag.name.toUpperCase() === tagName.toUpperCase()
    );
    if (!metaData) {
        logger.warn(`Component not found in custom-elements.json: ${tagName}`);
    }
    return metaData;
};

const getMetaDataV1 = (t: string, customElements: CustomElements) => {
    const tagName = getComponentName(t);

    if (!isValidComponent(tagName) || !isValidMetaData(customElements)) {
        return null;
    }

    let metadata: Tag | Declaration | undefined;
    customElements?.modules?.forEach((_module: Module) => {
        _module?.declarations?.forEach((declaration: Declaration) => {
            if (declaration.tagName === tagName) {
                metadata = declaration;
            }
        });
    });

    if (!metadata) {
        logger.warn(`Component not found in custom-elements.json: ${tagName}`);
    }
    return metadata;
};

const getMetaData = (t: string, manifest: any) => {
    const tagName = getComponentName(t);

    if (manifest?.version === "experimental") {
        return getMetaDataExperimental(tagName, manifest);
    }
    return getMetaDataV1(tagName, manifest);
};

export const extractArgTypesFromElements = (
    t: string,
    customElements: CustomElements
) => {
    const tagName = getComponentName(t);
    const metaData = getMetaData(tagName, customElements) as Tag;
    if (metaData) {
        return {
            ...mapData(metaData.members ?? [], "properties"),
            ...mapData(metaData.properties ?? [], "properties"),
            ...mapData(metaData.attributes ?? [], "attributes"),
            ...mapData(metaData.events ?? [], "events"),
            ...mapData(metaData.slots ?? [], "slots"),
            ...mapData(metaData.cssProperties ?? [], "css custom properties"),
            ...mapData(metaData.cssParts ?? [], "css shadow parts"),
        };
    }
};

export const extractArgTypes = (t: string) => {
    const tagName = getComponentName(t);
    const cem = getCustomElements();
    return extractArgTypesFromElements(tagName, cem);
};

export const extractComponentDescription = (t: string) => {
    const tagName = getComponentName(t);
    const metaData = getMetaData(tagName, getCustomElements()) as Tag;
    return metaData?.description;
};
