/**
 * Values for the `target` attribute.
 */
export const ButtonFormTarget = {
    blank: "_blank",
    self: "_self",
    parent: "_parent",
    top: "_top",
} as const;

/**
 * Type for the `target` attribute options.
 */
export type ButtonFormTarget =
    (typeof ButtonFormTarget)[keyof typeof ButtonFormTarget];

/**
 * Values for the `type` attribute.
 */
export const ButtonType = {
    submit: "submit",
    reset: "reset",
    button: "button",
} as const;

/**
 * Type for the `type` attribute options.
 */
export type ButtonType = (typeof ButtonType)[keyof typeof ButtonType];

/**
 * Values for the `appearance` attribute.
 */
export const ButtonAppearance = {
    primary: "primary",
    secondary: "secondary",
} as const;

/**
 * Type for the `appearance` attribute options.
 */
export type ButtonAppearance =
    (typeof ButtonAppearance)[keyof typeof ButtonAppearance];

/**
 * Values for the `size` attribute.
 */
export const ButtonSize = {
    small: "small",
    medium: "medium",
    large: "large",
} as const;

/**
 * Type for the `size` attribute options.
 */
export type ButtonSize = (typeof ButtonSize)[keyof typeof ButtonSize];
