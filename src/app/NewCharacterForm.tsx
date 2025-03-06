"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { InferType, object, string } from "yup";

import { Form } from "@/components/Form";
import { FormField } from "@/components/Form/FormField";
import { stringifySheet } from "@/lib/characterSheets/stringifySheet";
import { useAvailableSources } from "@/lib/data/useAvailableSources";
import { db } from "@/lib/localdb";
import { getSourceWithDependencies } from "@/lib/sources/getSource";
import { CharacterSheet } from "@/types/CharacterSheet";
import { JSONSourceIdentifier } from "@/types/JSONSource";

const formSchema = object({
    characterName: string().required("Character name is required"),
    baseSource: string().required("Source is required"),
});
type FormValues = InferType<typeof formSchema>;

export function NewCharacterForm() {
    "use no memo";

    const router = useRouter();

    const availableSources = useAvailableSources();

    const getSourcesMutation = useMutation({
        mutationKey: ["getSources"],
        mutationFn: (id: string) => getSourceWithDependencies(id),
    });

    const form = useForm({
        resolver: yupResolver(formSchema),
        defaultValues: {
            characterName: "",
            baseSource: "base",
        },
    });

    const selectedSource = form.watch("baseSource");

    const onSubmit = async (values: FormValues) => {
        router.prefetch("/character");

        await getSourcesMutation.mutateAsync(values.baseSource);

        const sheet: CharacterSheet = {
            sources: [values.baseSource as JSONSourceIdentifier],
            variables: {
                characterName: {
                    value: values.characterName,
                },
            },
        };

        db.characterSheets.put({
            name: values.characterName,
            content: sheet,
        });

        router.push(`/character?data=${stringifySheet(sheet)}`);
    };

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-xl font-bold dark:text-gray-200">
                New Character
            </h1>

            <Form
                form={form}
                submitHandler={onSubmit}
                className="flex flex-col gap-2"
            >
                <Form.Input
                    name="characterName"
                    label="Character Name"
                    description="You can always change this later."
                    placeholder="Chris P. Bacon"
                />

                <FormField
                    name="baseSource"
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
                                        "flex cursor-pointer flex-col rounded border border-black/10 px-4 py-2 text-left transition-colors dark:border-white/10",
                                        selectedSource === "base" &&
                                            "bg-black/10 dark:bg-white/10",
                                    )}
                                    onClick={() =>
                                        form.setValue("baseSource", "base")
                                    }
                                    type="button"
                                >
                                    <p className="font-semibold dark:text-gray-200">
                                        None
                                    </p>
                                    <p className="text-sm text-black/80 dark:text-white/80">
                                        Add sources later, I want to to do it
                                        myself
                                    </p>
                                </button>

                                {availableSources.data.map((source) => (
                                    <button
                                        key={source.id}
                                        className={clsx(
                                            "flex cursor-pointer flex-col rounded border border-black/10 px-4 py-2 text-left transition-colors dark:border-white/10",
                                            selectedSource === source.id &&
                                                "bg-black/10 dark:bg-white/10",
                                        )}
                                        onClick={() =>
                                            form.setValue(
                                                "baseSource",
                                                source.id,
                                            )
                                        }
                                        type="button"
                                    >
                                        <p className="font-semibold dark:text-gray-200">
                                            {source.name}
                                        </p>
                                        <p className="text-sm text-black/80 dark:text-white/80">
                                            {source.description}
                                        </p>
                                    </button>
                                ))}
                            </>
                        )}
                    </div>
                </FormField>

                <Form.Button size="md" color="primary">
                    Create Character
                </Form.Button>
            </Form>
        </div>
    );
}
