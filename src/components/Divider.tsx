"use client";

import * as Separator from "@radix-ui/react-separator";
import stylex from "@stylexjs/stylex";
import clsx from "clsx";
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
                clsx(
                    className,
                    !!children &&
                        clsx(
                            "flex items-center gap-3 text-sm font-semibold text-black/40 before:flex-1 before:bg-black/20 after:flex-1 after:bg-black/20 dark:text-white/40 dark:before:flex-1 dark:before:bg-white/20 dark:after:flex-1 dark:after:bg-white/20",
                            {
                                "before:h-[1px] after:h-[1px]":
                                    orientation === "horizontal",
                                "flex-col before:w-[1px] after:w-[1px]":
                                    orientation === "vertical",
                            },
                        ),
                    !children &&
                        orientation === "horizontal" &&
                        "h-[1px] w-full bg-white/20",
                    !children &&
                        orientation === "vertical" &&
                        "h-full w-[1px] bg-white/20",
                ),
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
