import { ViewTemplate, html } from "@microsoft/fast-element";
import { SNIPPET_RENDERED, SourceType } from "@storybook/core/docs-tools";
import { addons, useEffect } from "@storybook/core/preview-api";
import type { ArgsStoryFn, PartialStoryFn, StoryContext } from "@storybook/csf";
import prettierPluginHTML from "prettier/plugins/html.mjs";
import * as prettier from "prettier/standalone.mjs";
import type { FASTComponentsRenderer } from "../types.mjs";

const FAST_EXPRESSION_COMMENTS = /<!--((fast-\w+)\{.*\}\2)?-->/g;

function skipSourceRender(context: StoryContext<FASTComponentsRenderer>) {
    const sourceParams = context?.parameters.docs?.source;
    const isArgsStory = context?.parameters.__isArgsStory;

    // always render if the user forces it
    if (sourceParams?.type === SourceType.DYNAMIC) {
        return false;
    }

    // never render if the user is forcing the block to render code, or
    // if the user provides code, or if it's not an args story.
    return (
        !isArgsStory ||
        sourceParams?.code ||
        sourceParams?.type === SourceType.CODE
    );
}

export function sourceDecorator(
    storyFn: PartialStoryFn<FASTComponentsRenderer>,
    context: StoryContext<FASTComponentsRenderer>,
): FASTComponentsRenderer["storyResult"] {
    const story = storyFn();
    const renderedForSource = context?.parameters.docs?.source
        ?.excludeDecorators
        ? (context.originalStoryFn as ArgsStoryFn<FASTComponentsRenderer>)(
              context.args,
              context,
          )
        : story;

    let source: string;

    useEffect(() => {
        const { id, unmappedArgs } = context;

        if (source) {
            prettier
                .format(source, {
                    parser: "html",
                    plugins: [prettierPluginHTML],
                })
                .then((formattedSource: string) => {
                    addons.getChannel().emit(SNIPPET_RENDERED, {
                        id,
                        source: formattedSource,
                        args: unmappedArgs,
                    });
                });
        }
    });

    if (!skipSourceRender(context)) {
        const container = window.document.createElement("div");
        if (
            renderedForSource instanceof DocumentFragment ||
            renderedForSource instanceof Node
        ) {
            container.appendChild(renderedForSource.cloneNode(true));
        } else if (typeof renderedForSource === "string") {
            const partial = html.partial(renderedForSource);
            html`${partial}`.create(container);
        } else if (renderedForSource instanceof ViewTemplate) {
            renderedForSource.render(context.args, container);
        }

        source = container.innerHTML.replace(FAST_EXPRESSION_COMMENTS, "");
    }

    return story;
}
