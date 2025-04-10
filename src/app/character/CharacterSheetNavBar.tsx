"use client";

import clsx from "clsx";
import { BookPlusIcon, EyeIcon, HomeIcon, PencilIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/Button";
import {
    CharacterEditorAction,
    useCharacterEditorStore,
} from "@/state/characterEditor";
import { useCharacterSheetStore } from "@/state/characterSheet";

export function CharacterSheetNavBar() {
    const characterName = useCharacterSheetStore((state) => state.name);
    const { currentAction, setCurrentAction } = useCharacterEditorStore();

    return (
        <div className="flex justify-between gap-4 rounded-lg border border-gray-700 bg-gray-800 p-2">
            <div className="flex items-center gap-2">
                <Button size="sm" color="secondary" icon={<HomeIcon />} asChild>
                    <Link href="/">Home</Link>
                </Button>

                <p className="font-semibold text-white">{characterName}</p>
            </div>

            <div className="flex items-center">
                <Button
                    size="sm"
                    color="secondary"
                    icon={<PencilIcon />}
                    className={clsx("rounded-r-none", {
                        "bg-gray-600!":
                            currentAction === CharacterEditorAction.VIEW,
                    })}
                    onClick={() => setCurrentAction(CharacterEditorAction.VIEW)}
                >
                    View
                </Button>
                <Button
                    size="sm"
                    color="secondary"
                    icon={<EyeIcon />}
                    className={clsx("rounded-none", {
                        "bg-gray-600!":
                            currentAction === CharacterEditorAction.EDIT,
                    })}
                    onClick={() => setCurrentAction(CharacterEditorAction.EDIT)}
                >
                    Edit
                </Button>
                <Button
                    size="sm"
                    color="secondary"
                    icon={<BookPlusIcon />}
                    className={clsx("rounded-l-none", {
                        "bg-gray-600!":
                            currentAction ===
                            CharacterEditorAction.EDIT_SOURCES,
                    })}
                    onClick={() =>
                        setCurrentAction(CharacterEditorAction.EDIT_SOURCES)
                    }
                >
                    Sources
                </Button>
            </div>
        </div>
    );
}
