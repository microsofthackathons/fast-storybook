import {
    setProjectAnnotations as originalSetProjectAnnotations,
    setDefaultProjectAnnotations,
} from "@storybook/core/preview-api";
import type {
    NamedOrDefaultProjectAnnotations,
    NormalizedProjectAnnotations,
} from "@storybook/core/types";

import * as FASTComponentsAnnotations from "./entry-preview.mjs";
import type { FASTComponentsRenderer } from "./types.mjs";

/**
 * Function that sets the globalConfig of your storybook. The global config is the preview module of
 * your .storybook folder.
 *
 * It should be run a single time, so that your global config (e.g. decorators) is applied to your
 * stories when using `composeStories` or `composeStory`.
 *
 * Example:
 *
 * ```jsx
 * // setup-file.js
 * import { setProjectAnnotations } from '@microsoft/storybook-fast-components';
 * import projectAnnotations from './.storybook/preview';
 *
 * setProjectAnnotations(projectAnnotations);
 * ```
 *
 * @param projectAnnotations - E.g. (import projectAnnotations from '../.storybook/preview')
 */
export function setProjectAnnotations(
    projectAnnotations:
        | NamedOrDefaultProjectAnnotations<any>
        | NamedOrDefaultProjectAnnotations<any>[],
): NormalizedProjectAnnotations<FASTComponentsRenderer> {
    setDefaultProjectAnnotations(FASTComponentsAnnotations);
    return originalSetProjectAnnotations(
        projectAnnotations,
    ) as NormalizedProjectAnnotations<FASTComponentsRenderer>;
}
