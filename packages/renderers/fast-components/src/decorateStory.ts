import type {
    DecoratorFunction,
    LegacyStoryFn,
    StoryContext,
} from "@storybook/core/types";
import { sanitizeStoryContextUpdate } from "@storybook/core/preview-api";
import type { FASTComponentsRenderer } from "./types.mjs";

function unWrap<T>(obj: { default: T } | T): T {
    return obj && typeof obj === "object" && "default" in obj ? obj.default : obj;
}

function prepareStory(
    context: StoryContext<FASTComponentsRenderer>,
    rawStory: FASTComponentsRenderer["storyResult"],
    rawInnerStory?: FASTComponentsRenderer["storyResult"]
) {
    const story = rawStory;
    const innerStory = rawInnerStory;
    // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
    let preparedStory;

    if (!story || Object.keys(story).length === 0) {
        // story is empty or an empty object, use the component from the context
        preparedStory = {
            Component: context.component,
        };
        //@ts-ignore
    } else if (story.component) {
        // the story is already prepared
        preparedStory = story;
    } else {
        // we must assume that the story is a Svelte component
        preparedStory = {
            Component: story,
        };
    }

    // if (innerStory) {
    //     // render a SlotDecorator with innerStory as its regular component,
    //     // and the prepared story as the decorating component
    //     return {
    //         // Component: SlotDecorator,
    //         // props: {
    //         // inner stories will already have been prepared, keep as is
    //         // ...innerStory,
    //         // decorator: preparedStory,
    //         // },
    //     };
    // }

    // no innerStory means this is the last story in the decorator chain, so it should create events from argTypes
    return { ...(preparedStory as any), argTypes: context.argTypes };
}

export function decorateStory(
    storyFn: LegacyStoryFn<FASTComponentsRenderer>,
    decorators: DecoratorFunction<FASTComponentsRenderer>[]
) {
    return decorators.reduce(
        (
            decorated: LegacyStoryFn<FASTComponentsRenderer>,
            decorator: DecoratorFunction<FASTComponentsRenderer>
        ) =>
            (context: StoryContext<FASTComponentsRenderer>) => {
                let story: FASTComponentsRenderer["storyResult"] | undefined;

                const decoratedStory: FASTComponentsRenderer["storyResult"] = decorator(
                    update => {
                        story = decorated({
                            ...context,
                            ...sanitizeStoryContextUpdate(update),
                        });
                        return story;
                    },
                    context
                );

                if (!story) {
                    story = decorated(context);
                }

                // return story;

                if (decoratedStory === story) {
                    return story;
                }

                return prepareStory(context, decoratedStory, story);
            },
        (context: StoryContext<FASTComponentsRenderer>) =>
            prepareStory(context, storyFn(context))
    );
}
