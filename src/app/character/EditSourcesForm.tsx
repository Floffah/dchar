"use client";

import * as motion from "motion/react-client";
import clsx from "clsx";
import { z } from "zod";

import { Loader } from "@/components/Loader";
import { useAvailableSources } from "@/lib/data/useAvailableSources";
import { useAppForm } from "@/lib/hooks/useAppForm";
import {
    CharacterEditorAction,
    useCharacterEditorStore,
} from "@/state/characterEditor";
import { useCharacterSheetStore } from "@/state/characterSheet";
import { JSONSourceIdentifier } from "@/types/JSONSource";

const formSchema = z.object({
    sources: z.array(z.string()),
});
type FormValues = z.infer<typeof formSchema>;

export function EditSourcesForm() {
    const characterSheet = useCharacterSheetStore();
    const characterEditor = useCharacterEditorStore();

    const form = useAppForm({
        validators: {
            onSubmit: formSchema,
        },
        defaultValues: {
            sources: characterSheet.sources,
        } as FormValues,
        onSubmit: async ({ value }) => {
            characterSheet.setSources(value.sources as JSONSourceIdentifier[]);

            characterEditor.setCurrentAction(CharacterEditorAction.EDIT);
        },
    });

    const availableSources = useAvailableSources();

    if (availableSources.isLoading) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <Loader className="h-8 w-8 text-gray-500" />
            </div>
        );
    }

    return (
        <motion.div
            animate={{
                scale: 1,
                opacity: 1,
            }}
            initial={{
                scale: 0.9,
            }}
            className="flex flex-1 items-center justify-center gap-4"
        >
            <form
                className="flex flex-col gap-2 rounded-lg border border-gray-700 bg-gray-800 p-2"
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
            >
                <form.AppForm>
                    <h1 className="text-xl font-bold text-gray-200">
                        Edit Sources
                    </h1>

                    <form.AppField name="sources">
                        {(field) => (
                            <field.Field
                                label="Selected Sources"
                                description="Select multiple sources to base your character on"
                            >
                                <div className="flex max-h-40 flex-col gap-2 overflow-y-auto">
                                    {availableSources.isLoading && (
                                        <>
                                            <div className="h-16 w-full animate-pulse rounded bg-white/10"></div>
                                            <div className="h-16 w-full animate-pulse rounded bg-white/10"></div>
                                        </>
                                    )}

                                    {availableSources.data?.map((source) => (
                                        <button
                                            key={source.id}
                                            className={clsx(
                                                "flex cursor-pointer gap-4 rounded border border-white/10 px-4 py-2 text-left transition-colors",
                                                field.state.value.includes(
                                                    source.id,
                                                ) && "bg-white/10",
                                            )}
                                            onClick={() => {
                                                if (
                                                    field.state.value.includes(
                                                        source.id,
                                                    )
                                                ) {
                                                    field.setValue((value) =>
                                                        value.filter(
                                                            (id) =>
                                                                id !==
                                                                source.id,
                                                        ),
                                                    );
                                                } else {
                                                    field.setValue((value) => [
                                                        ...value,
                                                        source.id,
                                                    ]);
                                                }
                                            }}
                                            type="button"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={field.state.value.includes(
                                                    source.id,
                                                )}
                                                readOnly
                                            />

                                            <div className="flex flex-col">
                                                <p className="font-semibold text-gray-200">
                                                    {source.name}
                                                </p>
                                                <p className="text-sm text-white/80">
                                                    {source.description}
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </field.Field>
                        )}
                    </form.AppField>

                    <form.SubscribeButton size="md" color="primary">
                        Confirm
                    </form.SubscribeButton>
                </form.AppForm>
            </form>
        </motion.div>
    );
}
