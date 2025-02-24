"use client";

import clsx from "clsx";
import { LoaderCircle } from "lucide-react";
import { ComponentProps, forwardRef } from "react";

import { Icon } from "@/components/Icon";

export const Loader = forwardRef<
    SVGSVGElement,
    Omit<ComponentProps<typeof LoaderCircle>, "ref" | "label" | "icon">
>(({ className, ...props }, ref) => {
    return (
        <Icon label="loading">
            <LoaderCircle
                ref={ref}
                className={clsx("animate-spin", className)}
                {...props}
            />
        </Icon>
    );
});
