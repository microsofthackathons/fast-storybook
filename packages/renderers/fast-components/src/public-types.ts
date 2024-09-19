import type {
    AnnotatedStoryFn,
    Args,
    ComponentAnnotations,
    DecoratorFunction,
    StoryContext as GenericStoryContext,
    LoaderFunction,
    ProjectAnnotations,
    StoryAnnotations,
    StrictArgs,
} from "@storybook/core/types";

import type { FASTComponentsRenderer, StoryArgs } from "./types.mjs";

export type {
    Args,
    ArgTypes,
    Parameters,
    StrictArgs,
} from "@storybook/core/types";
export type { FASTComponentsRenderer, StoryArgs };

/**
 * Metadata to configure the stories for a component.
 *
 * @see [Default export](https://storybook.js.org/docs/formats/component-story-format/#default-export)
 */
export type Meta<TArgs = Args> = ComponentAnnotations<
    FASTComponentsRenderer,
    StoryArgs<TArgs>
>;

/**
 * Story function that represents a CSFv2 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type StoryFn<TArgs = Args> = AnnotatedStoryFn<
    FASTComponentsRenderer,
    StoryArgs<TArgs>
>;

/**
 * Story object that represents a CSFv3 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type StoryObj<TArgs = Args> = StoryAnnotations<
    FASTComponentsRenderer,
    StoryArgs<TArgs>
>;

export type Decorator<TArgs = StrictArgs> = DecoratorFunction<
    FASTComponentsRenderer,
    StoryArgs<TArgs>
>;
export type Loader<TArgs = StrictArgs> = LoaderFunction<
    FASTComponentsRenderer,
    StoryArgs<TArgs>
>;
export type StoryContext<TArgs = StrictArgs> = GenericStoryContext<
    FASTComponentsRenderer,
    StoryArgs<TArgs>
>;
export type Preview = ProjectAnnotations<FASTComponentsRenderer>;
