import { BaseButton } from "@fluentui/web-components/button/index.js";
import { attr } from "@microsoft/fast-element";
import { ButtonAppearance, ButtonSize } from "./button.options.js";

/**
 * The Button component.
 *
 * @slot - The default slot for the button content.
 */
export class Button extends BaseButton {
    /**
     * The stylistic appearance of the button.
     */
    @attr
    appearance: ButtonAppearance = ButtonAppearance.primary;

    /**
     * The size of the button.
     */
    @attr
    size: ButtonSize = ButtonSize.medium;

    attributeChangedCallback(
        name: string,
        oldValue: string | null,
        newValue: string | null
    ): void {
        super.attributeChangedCallback(name, oldValue, newValue);

        switch (name) {
            case "appearance":
            case "size": {
                this.elementInternals.states.delete(`${name}-${oldValue}`);
                this.elementInternals.states.add(`${name}-${newValue}`);
                break;
            }
        }
    }
}
