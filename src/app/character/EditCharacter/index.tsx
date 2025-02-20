"use client";

import stylex, { StyleXStyles } from "@stylexjs/stylex";
import { ComponentProps, forwardRef, useState } from "react";

import { EditCharacterPage } from "@/app/character/EditCharacter/EditCharacterPage";
import { Button } from "@/components/Button";
import { Select } from "@/components/Select";
import { composeStyles } from "@/lib/utils/composeStyles";
import { useSources } from "@/providers/SourcesProvider";
import { sizes } from "@/styles/sizes.stylex";

export const EditCharacter = forwardRef<
    HTMLDivElement,
    Omit<ComponentProps<"div">, "style" | "ref"> & { style?: StyleXStyles }
>(({ className, style, ...props }, ref) => {
    const sources = useSources();

    const pageKeys = Object.keys(sources.sourceSet.editWizard.pages);

    const [page, setPage] = useState(
        sources.sourceSet.editWizard.pages[pageKeys[0]]?.id ?? "details",
    );

    const hasPrevious = pageKeys.indexOf(page) > 0;
    const hasNext = pageKeys.indexOf(page) < pageKeys.length - 1;

    if (pageKeys.length === 0) {
        return <></>;
    }

    return (
        <div
            {...props}
            {...composeStyles(stylex.props(styles.container, style), className)}
            ref={ref}
        >
            <div {...stylex.props(styles.pageControlsContainer)}>
                <Button size="md" color="primary" disabled={!hasPrevious}>
                    Previous
                </Button>
                <Select value={page} onValueChange={setPage}>
                    <Select.Button>Select Page</Select.Button>
                    <Select.Content>
                        {pageKeys.map((key) => {
                            const page =
                                sources.sourceSet.editWizard.pages[key];

                            return (
                                <Select.Item key={key} value={key}>
                                    {page?.name}
                                </Select.Item>
                            );
                        })}
                    </Select.Content>
                </Select>
                <Button size="md" color="primary" disabled={!hasNext}>
                    Next
                </Button>
            </div>

            {page && (
                <EditCharacterPage
                    key={page}
                    page={sources.sourceSet.editWizard.pages[page]}
                    hasNext={hasNext}
                    onRequestNextPage={() => {
                        if (hasNext) {
                            setPage(pageKeys[pageKeys.indexOf(page) + 1]);
                        }
                    }}
                />
            )}
        </div>
    );
});

const styles = stylex.create({
    container: {
        display: "flex",
        flexDirection: "column",
        gap: sizes.spacing2,
    },

    pageControlsContainer: {
        display: "flex",
        gap: sizes.spacing2,
    },
});
