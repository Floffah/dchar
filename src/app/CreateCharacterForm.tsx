"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { InferType, object, string } from "yup";
import sourcesMeta from "~sources";

import { Form } from "@/components/Form";
import { FormField } from "@/components/Form/FormField";
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

        try {
            await sources.loadSource(values.source);
        } catch (_e) {
            form.setError("source", {
                message: "Failed to load source",
            });
            return;
        }

        const source = sources.sources.find(
            (source) => source.id === values.source,
        );

        await source?.engine?.doString(
            `setvariable("characterName", ${JSON.stringify(values.name)})`,
        );

        router.push("/character");
    };

    return (
        <Form
            form={form}
            submitHandler={onSubmit}
            className="flex flex-col gap-2"
        >
            <Form.Input name="name" label="Character Name" />

            <FormField name="source" label="Choose a source">
                {sourcesMeta.sources
                    .filter((source) => !source.lib)
                    .map((source) => (
                        <button
                            key={source.id}
                            type="button"
                            className={clsx(
                                "flex flex-col rounded-md p-2 text-left transition-colors",
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
