import clsx from "clsx";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { ComponentPropsWithRef } from "react";

import { Button } from "@/components/Button";
import { useCombinedSourcesQuery } from "@/lib/data/useCombinedSourcesQuery";
import { useCharacterEditorStore } from "@/state/characterEditor";

export function CharacterEditorNavigation({
    className,
    ...props
}: ComponentPropsWithRef<"div">) {
    const editor = useCharacterEditorStore();

    const combinedSources = useCombinedSourcesQuery();

    const availablePages = Object.keys(combinedSources.data?.pages ?? {});

    const indexOfCurrentPage = availablePages.findIndex(
        (page) => page === editor.selectedPage,
    );
    const hasPreviousPage = indexOfCurrentPage > 0;
    const hasNextPage = indexOfCurrentPage < availablePages.length - 1;

    return (
        <div className={clsx("flex gap-2", className)} {...props}>
            <Button
                size="md"
                color="secondary"
                type="button"
                icon={<ChevronLeftIcon />}
                aria-label="Previous Page"
                disabled={!hasPreviousPage}
                onClick={() => {
                    if (hasPreviousPage) {
                        editor.setSelectedPage(
                            availablePages[indexOfCurrentPage - 1],
                        );
                    }
                }}
            >
                Previous
            </Button>
            <Button
                size="md"
                color="secondary"
                type="button"
                icon={<ChevronRightIcon />}
                aria-label="Next Page"
                disabled={!hasNextPage}
                onClick={() => {
                    if (hasNextPage) {
                        editor.setSelectedPage(
                            availablePages[indexOfCurrentPage + 1],
                        );
                    }
                }}
            >
                Next
            </Button>
        </div>
    );
}
