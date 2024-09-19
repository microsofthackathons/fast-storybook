import { SourceType, enhanceArgTypes } from "@storybook/core/docs-tools";
import type {
    ArgTypesEnhancer,
    DecoratorFunction,
    InputType,
} from "@storybook/core/types";

import {
    extractArgTypes,
    extractComponentDescription,
} from "./docs/custom-elements.js";
import { sourceDecorator } from "./docs/sourceDecorator.js";
import type { FASTComponentsRenderer } from "./types.mjs";

export const decorators: DecoratorFunction<FASTComponentsRenderer>[] = [
    sourceDecorator,
];

export const parameters: {
    docs: {
        extractArgTypes: (tagName: string) =>
            | {
                  [x: string]: InputType;
              }
            | null
            | undefined;
        extractComponentDescription: (
            tagName: string,
        ) => string | null | undefined;
        story: {
            inline: true;
        };
        source: {
            type: SourceType;
            language: string;
        };
    };
} = {
    docs: {
        extractArgTypes,
        extractComponentDescription,
        story: { inline: true },
        source: {
            type: SourceType.DYNAMIC,
            language: "html",
        },
    },
};

export const argTypesEnhancers: ArgTypesEnhancer<FASTComponentsRenderer>[] = [
    enhanceArgTypes,
];
