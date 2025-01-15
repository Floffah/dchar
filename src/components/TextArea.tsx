import stylex, { StyleXStyles } from "@stylexjs/stylex";
import { ComponentProps, forwardRef } from "react";
import TextareaAutosize from "react-textarea-autosize";

import { composeStyles } from "@/lib/utils/composeStyles";
import { fontSizes, lineHeights } from "@/styles/fonts.stylex";
import { rounded } from "@/styles/rounded.stylex";
import { sizes } from "@/styles/sizes.stylex";
import { theme } from "@/styles/theme.stylex";

export interface TextAreaProps
    extends Omit<ComponentProps<typeof TextareaAutosize>, "style" | "ref"> {
    error?: boolean;
    style?: StyleXStyles;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    ({ className, style, error, disabled, ...props }, ref) => {
        return (
            <TextareaAutosize
                {...props}
                ref={ref}
                disabled={disabled}
                {...composeStyles(
                    stylex.props(
                        styles.base,
                        error && !disabled && styles.error,
                        disabled && styles.disabled,
                        error && disabled && styles.disabledError,
                        style,
                    ),
                    className,
                )}
            ></TextareaAutosize>
        );
    },
);

const styles = stylex.create({
    base: {
        transitionProperty: "color, background-color, border-color",
        transitionDuration: "150ms",
        background: theme.controlBackground,
        borderRadius: rounded.lg,
        border: {
            default: theme.controlBorder,
            ":focus": theme.controlFocusedBorder,
        },
        outline: "none",
        padding: `${sizes.spacing1} ${sizes.spacing2}`,
        fontSize: fontSizes.base,
        lineHeight: lineHeights.base,
        color: {
            "::placeholder": theme.controlPlaceholderForeground,
        },
    },

    error: {
        border: theme.controlErrorBorder,
    },

    disabled: {
        color: {
            default: theme.controlDisabledForeground,
            "::placeholder": theme.controlDisabledPlaceholderForeground,
        },
        border: theme.controlDisabledBorder,
    },

    disabledError: {
        border: theme.controlDisabledErrorBorder,
    },
});
