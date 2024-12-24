"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { InferType, object, string } from "yup";
import sourcesMeta from "~sources";

import { Form } from "@/components/Form";
import { FormField } from "@/components/Form/FormField";
import { saveSourceSet, serializeSourceSet } from "@/lib/Source/persistence";
import { CharacterSheetVariableConstants } from "@/lib/constants";
import { useSources } from "@/providers/SourcesProvider";

const formSchema = object({
    name: string().required(),
    source: string().required(),
});
type FormValues = InferType<typeof formSchema>;

export function CreateCharacterForm() {
    const router = useRouter();
    const sources = useSources();

    const form = useForm({
        resolver: yupResolver(formSchema),
        defaultValues: {
            name: "",
            source: "",
        },
    });

    const selectedSource = form.watch("source");

    const onSubmit = async (values: FormValues) => {
        router.prefetch("/character");

        await sources.sourceSet.unload();

        try {
            await sources.sourceSet.loadSource(values.source);
        } catch (_e) {
            form.setError("source", {
                message: "Failed to load source",
            });
            return;
        }

        sources.sourceSet.setVariable(
            CharacterSheetVariableConstants.CHARACTER_NAME,
            values.name,
        );

        sources.sourceSet.emit("loaded");

        saveSourceSet(sources.sourceSet, false);

        const searchParams = new URLSearchParams();

        searchParams.set("data", serializeSourceSet(sources.sourceSet));

        router.push("/character?" + searchParams.toString());
    };

    return (
        <Form
            form={form}
            submitHandler={onSubmit}
            className="flex flex-col gap-2"
        >
            <h1 className="text-xl font-bold">Create a new character</h1>

            <Form.Input
                name="name"
                label="Character Name"
                placeholder="Chris P. Bacon"
            />

            <FormField name="source" label="Choose a source">
                {/* TODO: convert to radio list */}
                {sourcesMeta.sources
                    .filter((source) => !source.lib)
                    .map((source) => (
                        <button
                            key={source.id}
                            type="button"
                            className={clsx(
                                "flex flex-col rounded-md p-2 text-left transition-colors duration-150",
                                {
                                    "outline outline-2 outline-blue-400 dark:outline-blue-600":
                                        selectedSource === source.id,
                                    "hover:bg-gray-300 hover:dark:bg-gray-700":
                                        selectedSource !== source.id,
                                },
                            )}
                            onClick={() => form.setValue("source", source.id)}
                        >
                            <span className="font-semibold">{source.name}</span>
                            <span className="text-sm">
                                {source.description}
                            </span>
                        </button>
                    ))}
            </FormField>

            <Form.Button size="md" color="primary">
                Create Character
            </Form.Button>
        </Form>
    );
}
