"use client";

import * as AccessibleIcon from "@radix-ui/react-accessible-icon";
import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import { PropsWithChildren } from "react";

export interface IconProps extends PropsWithChildren {
    label?: string;
    size?: "sm" | "md";
}

export const Icon = ({ label, size, children }: IconProps) => {
    const icon = (
        <Slot
            aria-hidden
            className={clsx({
                "h-4 w-4": size === "sm",
                "h-5 w-5": size === "md",
            })}
        >
            {children}
        </Slot>
    );

    if (!label) {
        return icon;
    }

    return <AccessibleIcon.Root label={label}>{icon}</AccessibleIcon.Root>;
};
