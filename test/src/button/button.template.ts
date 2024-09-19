import {
    type ElementViewTemplate,
    html,
    slotted,
} from "@microsoft/fast-element";
import type { Button } from "./button.js";

/**
 * The template for the Button component.
 */
export const template: ElementViewTemplate<Button> = html<Button>`
    <template
      tabindex="${x => (x.disabled ? null : (x.tabIndex ?? 0))}"
      @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
      @keypress="${(x, c) => x.keypressHandler(c.event as KeyboardEvent)}"
    >
      <span class="content" part="content">
        <slot></slot>
      </span>
    </template>
  `;
