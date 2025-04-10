"use client";

import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { stringifySheet } from "@/lib/characterSheets/stringifySheet";
import { useAvailableSources } from "@/lib/data/useAvailableSources";
import { useAppForm } from "@/lib/hooks/useAppForm";
import { db } from "@/lib/localdb";
import { getSourceWithDependencies } from "@/lib/sources/getSource";
import { CharacterSheet } from "@/types/CharacterSheet";
import { JSONSourceIdentifier } from "@/types/JSONSource";

const formSchema = z.object({
    characterName: z.string().nonempty("Character name is required"),
    baseSource: z.string(),
});
type FormValues = z.infer<typeof formSchema>;

export function NewCharacterForm() {
    "use no memo";

    const router = useRouter();

    const availableSources = useAvailableSources();

    const getSourcesMutation = useMutation({
        mutationKey: ["getSources"],
        mutationFn: (id: string) => getSourceWithDependencies(id),
    });

    const form = useAppForm({
        validators: {
            onSubmit: formSchema,
        },
        defaultValues: {
            characterName: "",
            baseSource: "base",
        } as FormValues,
        onSubmit: async ({ value }) => {
            router.prefetch("/character");

            await getSourcesMutation.mutateAsync(value.baseSource);

            const sheet: CharacterSheet = {
                sources: [value.baseSource as JSONSourceIdentifier],
                variables: {
                    characterName: {
                        value: value.characterName,
                    },
                },
            };

            db.characterSheets.put({
                name: value.characterName,
                content: sheet,
            });

            router.push(`/character?data=${stringifySheet(sheet)}`);
        },
    });

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-xl font-bold text-gray-200">New Character</h1>

            <form
                className="flex flex-col gap-2"
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
            >
                <form.AppForm>
                    <form.AppField name="characterName">
                        {(field) => (
                            <field.Input
                                label="Character Name"
                                description="You can always change this later."
                                placeholder="Chris P. Bacon"
                            />
                        )}
                    </form.AppField>

                    <form.AppField name="baseSource">
                        {(field) => (
                            <field.Field
                                label="Source"
                                description="Choose a source to start with. Don't worry, you can load more later."
                            >
                                <div className="flex max-h-40 flex-col gap-2 overflow-y-auto">
                                    {availableSources.isLoading && (
                                        <>
                                            <div className="h-16 w-full animate-pulse rounded bg-white/10"></div>
                                            <div className="h-16 w-full animate-pulse rounded bg-white/10"></div>
                                        </>
                                    )}

                                    {availableSources.data && (
                                        <>
                                            <button
                                                className={clsx(
                                                    "flex cursor-pointer flex-col rounded border border-white/10 px-4 py-2 text-left transition-colors",
                                                    field.state.value ===
                                                        "base" && "bg-white/10",
                                                )}
                                                onClick={() =>
                                                    field.setValue("base")
                                                }
                                                type="button"
                                            >
                                                <p className="font-semibold text-gray-200">
                                                    None
                                                </p>
                                                <p className="text-sm text-white/80">
                                                    Add sources later, I want to
                                                    to do it myself
                                                </p>
                                            </button>

                                            {availableSources.data.map(
                                                (source) => (
                                                    <button
                                                        key={source.id}
                                                        className={clsx(
                                                            "flex cursor-pointer flex-col rounded border border-white/10 px-4 py-2 text-left transition-colors",
                                                            field.state
                                                                .value ===
                                                                source.id &&
                                                                "bg-white/10",
                                                        )}
                                                        onClick={() =>
                                                            field.setValue(
                                                                source.id,
                                                            )
                                                        }
                                                        type="button"
                                                    >
                                                        <p className="font-semibold text-gray-200">
                                                            {source.name}
                                                        </p>
                                                        <p className="text-sm text-white/80">
                                                            {source.description}
                                                        </p>
                                                    </button>
                                                ),
                                            )}
                                        </>
                                    )}
                                </div>
                            </field.Field>
                        )}
                    </form.AppField>

                    <form.SubscribeButton size="md" color="primary">
                        Create Character
                    </form.SubscribeButton>
                </form.AppForm>
            </form>
        </div>
    );
}
