import type {
    FASTElement,
    FASTElementDefinition,
    ViewTemplate,
} from "@microsoft/fast-element";
import type {
    Args,
    Renderer,
    StoryContext as StoryContextBase,
} from "@storybook/csf";

/**
 * Combined Storybook story args.
 */
export type StoryArgs<TArgs = Args> = Partial<Omit<TArgs, keyof FASTElement>> &
    Args;

export type StoryFnHtmlReturnType =
    | string
    | Node
    | DocumentFragment
    | HTMLElement
    | FASTElement
    | ViewTemplate;

export type StoryContext = StoryContextBase<FASTComponentsRenderer>;

export interface FASTComponentsRenderer extends Renderer {
    component: string | FASTElementDefinition;
    canvasElement: HTMLElement;
    storyResult: StoryFnHtmlReturnType;
}
