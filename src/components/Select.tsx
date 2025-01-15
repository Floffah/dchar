"use client";

import * as RUISelect from "@radix-ui/react-select";
import stylex, { StyleXStyles } from "@stylexjs/stylex";
import {
    PropsWithChildren,
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState,
} from "react";

import ArrowDownIcon from "~icons/ic/baseline-keyboard-arrow-down";

import { Icon } from "@/components/Icon";
import { composeStyles } from "@/lib/utils/composeStyles";
import { fontSizes, fontWeights, lineHeights } from "@/styles/fonts.stylex";
import { rounded } from "@/styles/rounded.stylex";
import { sizes } from "@/styles/sizes.stylex";
import { theme } from "@/styles/theme.stylex";

// TODO: make these components look nicer

export const SelectButton = forwardRef<
    HTMLButtonElement,
    Omit<RUISelect.SelectTriggerProps, "style" | "ref"> & {
        style?: StyleXStyles;
    }
>(({ className, style, children, ...props }, ref) => {
    return (
        <RUISelect.Trigger
            {...props}
            {...composeStyles(stylex.props(styles.button, style), className)}
            ref={ref}
        >
            <p {...stylex.props(styles.buttonText)}>
                <RUISelect.Value placeholder={children} />
            </p>

            <RUISelect.Icon asChild>
                <Icon
                    label="select dropdown"
                    icon={ArrowDownIcon}
                    {...stylex.props(styles.buttonIcon)}
                />
            </RUISelect.Icon>
        </RUISelect.Trigger>
    );
});

export const SelectContent = forwardRef<
    HTMLDivElement,
    PropsWithChildren<
        Omit<
            RUISelect.SelectContentProps,
            "children" | "ref" | "position" | "sideOffset" | "style"
        > & { style?: StyleXStyles }
    >
>(({ children, className, style, ...props }, ref) => {
    return (
        <RUISelect.Portal>
            <RUISelect.Content
                ref={ref}
                position="popper"
                sideOffset={5}
                {...props}
                {...composeStyles(
                    stylex.props(styles.contentContainer, style),
                    className,
                )}
            >
                <RUISelect.Viewport
                    {...stylex.props(styles.contentViewportContainer)}
                >
                    {children}
                </RUISelect.Viewport>
            </RUISelect.Content>
        </RUISelect.Portal>
    );
});

export type SelectItemProps = RUISelect.SelectItemProps;

export const SelectItem = forwardRef<
    HTMLDivElement,
    PropsWithChildren<Omit<SelectItemProps, "style"> & { style?: StyleXStyles }>
>(({ children, value, disabled, className, style, ..._props }, ref) => {
    return (
        <RUISelect.Item
            value={value}
            ref={ref}
            disabled={disabled}
            {...composeStyles(
                stylex.props(
                    styles.item,
                    disabled && styles.itemDisabled,
                    style,
                ),
                className,
            )}
        >
            <RUISelect.ItemText>{children}</RUISelect.ItemText>
        </RUISelect.Item>
    );
});

export type SelectProps = Omit<RUISelect.SelectProps, "children">;

export interface SelectRef {
    open: () => void;
    close: () => void;
}

export const Select = Object.assign(
    forwardRef<SelectRef, PropsWithChildren<Omit<SelectProps, "ref">>>(
        (
            {
                value: propsValue,
                defaultValue,
                open: propsOpen,
                children,
                ...props
            },
            ref,
        ) => {
            const [open, setOpen] = useState(false);

            const [value, setValue] = useState<string | undefined>(
                propsValue ?? undefined,
            );

            useImperativeHandle(ref, () => ({
                open: () => setOpen(true),
                close: () => setOpen(false),
            }));

            useEffect(() => {
                if (propsValue) {
                    setValue(propsValue);
                }
            }, [propsValue]);

            useEffect(() => {
                if (propsOpen) {
                    setOpen(propsOpen);
                }
            }, [propsOpen]);

            return (
                <RUISelect.Root
                    value={value}
                    defaultValue={defaultValue}
                    open={open}
                    onOpenChange={(open) => {
                        setOpen(open);
                        props.onOpenChange?.(open);
                    }}
                    {...props}
                >
                    {children}
                </RUISelect.Root>
            );
        },
    ),
    {
        Button: SelectButton,
        Content: SelectContent,
        Item: SelectItem,
    },
);

const DARK = "@media (prefers-color-scheme: dark)";
const styles = stylex.create({
    button: {
        display: "flex",
        alignItems: "center",
        gap: sizes.spacing1,
        borderRadius: rounded.lg,
        border: {
            default: theme.controlBorder,
            ":focus": theme.controlFocusedBorder,
            ":is([data-state=open])": theme.controlFocusedBorder,
        },
        outline: "none",
        background: theme.controlBackground,
        padding: `${sizes.spacing1} ${sizes.spacing2}`,
        fontSize: fontSizes.base,
        lineHeight: lineHeights.base,
    },
    buttonText: {
        width: "100%",
        flex: 1,
        textAlign: "left",
    },
    buttonIcon: {
        height: sizes.spacing5,
        width: sizes.spacing5,
    },

    contentContainer: {
        padding: "0.1875rem",
        width: "var(--radix-select-trigger-width)",
        overflow: "hidden",
        borderRadius: rounded.lg,
        border: theme.controlBorder,
        background: theme.controlBackground,
    },
    contentViewportContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "0.1875rem",
    },

    item: {
        width: "100%",
        borderRadius: rounded.md,
        padding: `${sizes.spacing0_5} ${sizes.spacing2}`,
        fontWeight: fontWeights.light,
        outline: "none",
        transitionProperty: "background-color",
        transitionDuration: "150ms",
        cursor: "pointer",
        background: {
            default: "none",
            ":hover": {
                default: "rgb(from black r g b / 10%)",
                [DARK]: "rgb(from white r g b / 10%)",
            },
        },
    },
    itemDisabled: {
        opacity: 0.5,
        userSelect: "none",
    },
});
