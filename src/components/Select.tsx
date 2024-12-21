"use client";

import * as RUISelect from "@radix-ui/react-select";
import clsx from "clsx";
import {
    PropsWithChildren,
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState,
} from "react";

import ArrowDownIcon from "~icons/ic/baseline-keyboard-arrow-down";

import { Icon } from "@/components/Icon";

// TODO: make these components look nicer

export const SelectButton = forwardRef<
    HTMLButtonElement,
    RUISelect.SelectTriggerProps
>(({ className, children, ...props }, ref) => {
    return (
        <RUISelect.Trigger
            {...props}
            className={clsx(
                className,
                "flex items-center gap-1 rounded-lg border border-gray-300 bg-gray-200 px-2 py-1 outline-none ring-0 ring-offset-0 transition-colors duration-150 data-[state=open]:border-blue-600 data-[state=open]:ring-1 data-[state=open]:ring-blue-600 dark:border-gray-700 dark:bg-gray-800",
            )}
            ref={ref}
        >
            <p className="w-full flex-1 text-left">
                <RUISelect.Value placeholder={children} />
            </p>

            <RUISelect.Icon>
                <Icon
                    label="select dropdown"
                    icon={ArrowDownIcon}
                    className="h-5 w-5"
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
            "children" | "ref" | "position" | "sideOffset"
        >
    >
>(({ children, className, ...props }, ref) => {
    return (
        <RUISelect.Portal>
            <RUISelect.Content
                ref={ref}
                className={clsx(
                    className,
                    "p-0.75 w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg border border-gray-300 bg-gray-200 dark:border-gray-700 dark:bg-gray-800",
                )}
                position="popper"
                sideOffset={5}
                {...props}
            >
                <RUISelect.Viewport className="gap-0.75 flex flex-col">
                    {children}
                </RUISelect.Viewport>
            </RUISelect.Content>
        </RUISelect.Portal>
    );
});

export type SelectItemProps = RUISelect.SelectItemProps;

export const SelectItem = forwardRef<
    HTMLDivElement,
    PropsWithChildren<SelectItemProps>
>(({ children, value, disabled, className, ..._props }, ref) => {
    return (
        <RUISelect.Item
            value={value}
            ref={ref}
            disabled={disabled}
            className={clsx(
                className,
                "w-full rounded-md px-2 py-0.5 font-light outline-0 ring-0 transition-colors duration-150",
                "",
                {
                    "cursor-pointer hover:bg-black/10 dark:hover:bg-white/10":
                        !disabled,
                    "select-none opacity-50": disabled,
                },
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
