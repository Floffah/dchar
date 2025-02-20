"use client";

import * as Separator from "@radix-ui/react-separator";
import stylex from "@stylexjs/stylex";
import { ComponentProps, PropsWithChildren, forwardRef } from "react";

import { composeStyles } from "@/lib/utils/composeStyles";
import { fontSizes, fontWeights, lineHeights } from "@/styles/fonts.stylex";
import { sizes } from "@/styles/sizes.stylex";

export const Divider = forwardRef<
    HTMLDivElement,
    PropsWithChildren<Omit<ComponentProps<(typeof Separator)["Root"]>, "ref">>
>(({ children, className, orientation = "horizontal", ...props }, ref) => {
    return (
        <Separator.Root
            {...props}
            ref={ref}
            orientation={orientation}
            {...composeStyles(
                stylex.props(
                    !!children && styles.withChildren,
                    !!children &&
                        orientation === "horizontal" &&
                        styles.withChildrenHorizontal,
                    !!children &&
                        orientation === "vertical" &&
                        styles.withChildrenVertical,

                    !children &&
                        orientation === "horizontal" &&
                        styles.withoutChildrenHorizontal,
                    !children &&
                        orientation === "vertical" &&
                        styles.withoutChildrenVertical,
                ),
                className,
            )}
        >
            {children}
        </Separator.Root>
    );
});

// rewrite the above tailwindcss code to stylex rules based on the format of the other components remembering that variants are expressed as variants of css properties e.g. border: { default: something, ":before": value for before pseudo element }
const DARK = "@media (prefers-color-scheme: dark)";
const styles = stylex.create({
    withChildren: {
        display: "flex",
        alignItems: "center",
        gap: sizes.spacing3,
        fontSize: fontSizes.sm,
        lineHeight: lineHeights.sm,
        fontWeight: fontWeights.semibold,
        color: {
            default: "rgb(from black r g b / 40%)",
            [DARK]: "rgb(from white r g b / 40%)",
        },
        content: {
            "::before": "''",
            "::after": "''",
        },
        flex: {
            "::before": 1,
            "::after": 1,
        },
        background: {
            "::before": "rgb(from black r g b / 20%)",
            "::after": "rgb(from black r g b / 20%)",
            [DARK]: {
                "::before": "rgb(from white r g b / 20%)",
                "::after": "rgb(from white r g b / 20%)",
            },
        },
    },
    withChildrenHorizontal: {
        height: {
            "::before": 1,
            "::after": 1,
        },
    },
    withChildrenVertical: {
        width: {
            "::before": 1,
            "::after": 1,
        },
        flexDirection: "column",
    },

    withoutChildrenHorizontal: {
        height: 1,
        width: "100%",
        background: "rgb(from white r g b / 20%)",
    },
    withoutChildrenVertical: {
        height: "100%",
        width: 1,
        background: "rgb(from white r g b / 20%)",
    },
});
