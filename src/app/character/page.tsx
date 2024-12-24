"use client";

import * as Tabs from "@radix-ui/react-tabs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import EyeIcon from "~icons/mdi/eye-outline";
import HomeIcon from "~icons/mdi/home-outline";
import PencilIcon from "~icons/mdi/pencil-outline";

import { EditCharacter } from "@/app/character/EditCharacter";
import { Button } from "@/components/Button";
import { Loader } from "@/components/Loader";
import { useVariable } from "@/hooks/sources";
import { CharacterSheetVariableConstants } from "@/lib/constants";
import { useSources } from "@/providers/SourcesProvider";

export default function CharacterPage() {
    const router = useRouter();
    const sources = useSources();

    const characterName = useVariable(
        CharacterSheetVariableConstants.CHARACTER_NAME,
    );

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        if (!params.has("data")) {
            router.replace("/");
        }
    }, []);

    if (sources.isLoading) {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center gap-2">
                <Loader className="h-6 w-6 text-gray-400 dark:text-gray-600" />
                <p className="text-sm text-gray-400 dark:text-gray-600">
                    Loading sources...
                </p>
            </div>
        );
    }

    return (
        <Tabs.Root
            className="flex h-screen flex-col gap-4 p-4"
            defaultValue="edit"
        >
            <header className="flex items-center gap-2 rounded-lg bg-gray-200 p-2 dark:bg-gray-800">
                <Button size="sm" color="secondary" icon={HomeIcon} asChild>
                    <Link href="/">Home</Link>
                </Button>

                <div className="h-fit rounded bg-blue-200 px-1 font-semibold dark:bg-blue-900">
                    Character Sheet
                </div>

                <h1 className="text-xl font-bold">{characterName}</h1>

                <div className="flex-grow" />

                {/* TODO: abstract tabs to their own component */}
                <Tabs.List className="flex">
                    <Tabs.Trigger
                        value="view"
                        className="flex items-center gap-1 rounded-l-md border border-gray-300 px-2 py-1 hover:bg-gray-300 data-[state=active]:bg-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 dark:data-[state=active]:bg-gray-700"
                    >
                        <EyeIcon />
                        View
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        value="edit"
                        className="flex items-center gap-1 rounded-r-md border border-gray-300 px-2 py-1 hover:bg-gray-300 data-[state=active]:bg-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 dark:data-[state=active]:bg-gray-700"
                    >
                        <PencilIcon />
                        Edit
                    </Tabs.Trigger>
                </Tabs.List>
            </header>

            <Tabs.Content
                value="view"
                className="my-auto self-center justify-self-center"
            >
                <p>
                    Page content not implemented yet. Click the edit button to
                    prepare
                </p>
            </Tabs.Content>

            <Tabs.Content
                value="edit"
                className="flex flex-grow flex-col gap-2"
            >
                <EditCharacter />
            </Tabs.Content>
        </Tabs.Root>
    );
}
