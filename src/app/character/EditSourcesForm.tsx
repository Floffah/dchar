import { yupResolver } from "@hookform/resolvers/yup";
import clsx from "clsx";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { InferType, array, object, string } from "yup";

import { Form } from "@/components/Form";
import { FormField } from "@/components/Form/FormField";
import { Loader } from "@/components/Loader";
import { useAvailableSources } from "@/lib/data/useAvailableSources";
import {
    CharacterEditorAction,
    useCharacterEditorStore,
} from "@/state/characterEditor";
import { useCharacterSheetStore } from "@/state/characterSheet";
import { JSONSourceIdentifier } from "@/types/JSONSource";

const formSchema = object({
    sources: array(string().required()).default([]).required(),
});
type FormValues = InferType<typeof formSchema>;

export function EditSourcesForm() {
    "use no memo";

    const characterSheet = useCharacterSheetStore();
    const characterEditor = useCharacterEditorStore();

    const form = useForm({
        resolver: yupResolver(formSchema),
        defaultValues: {
            sources: characterSheet.sources,
        },
    });

    const selectedSources = form.watch("sources");

    const availableSources = useAvailableSources();

    const onSubmit = async (values: FormValues) => {
        characterSheet.setSources(values.sources as JSONSourceIdentifier[]);

        characterEditor.setCurrentAction(CharacterEditorAction.EDIT);
    };

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
            <Form
                form={form}
                submitHandler={onSubmit}
                className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-gray-100 p-2 dark:border-gray-700 dark:bg-gray-800"
            >
                <h1 className="text-xl font-bold dark:text-gray-200">
                    Edit Sources
                </h1>

                <FormField
                    name="sources"
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
                                    "flex cursor-pointer gap-4 rounded border border-black/10 px-4 py-2 text-left transition-colors dark:border-white/10",
                                    selectedSources.includes(source.id) &&
                                        "bg-black/10 dark:bg-white/10",
                                )}
                                onClick={() => {
                                    if (selectedSources.includes(source.id)) {
                                        form.setValue(
                                            "sources",
                                            selectedSources.filter(
                                                (id) => id !== source.id,
                                            ),
                                        );
                                    } else {
                                        form.setValue("sources", [
                                            ...selectedSources,
                                            source.id,
                                        ]);
                                    }
                                }}
                                type="button"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedSources.includes(
                                        source.id,
                                    )}
                                    readOnly
                                />

                                <div className="flex flex-col">
                                    <p className="font-semibold dark:text-gray-200">
                                        {source.name}
                                    </p>
                                    <p className="text-sm text-black/80 dark:text-white/80">
                                        {source.description}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </FormField>

                <Form.Button size="md" color="primary">
                    Confirm
                </Form.Button>
            </Form>
        </motion.div>
    );
}
