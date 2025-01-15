"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import stylex from "@stylexjs/stylex";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { InferType, object, string } from "yup";
import sourcesMeta from "~sources";

import { Form } from "@/components/Form";
import { FormField } from "@/components/Form/FormField";
import { saveSourceSet, serializeSourceSet } from "@/lib/Source/persistence";
import { CharacterSheetVariableConstants } from "@/lib/constants";
import { useSources } from "@/providers/SourcesProvider";
import { colours } from "@/styles/colours.stylex";
import { fontSizes, fontWeights } from "@/styles/fonts.stylex";
import { rounded } from "@/styles/rounded.stylex";
import { sizes } from "@/styles/sizes.stylex";
import { theme } from "@/styles/theme.stylex";

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
            {...stylex.props(styles.form)}
        >
            <h1 {...stylex.props(styles.heading)}>Create a new character</h1>

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
                            {...stylex.props(
                                styles.sourceButton,
                                selectedSource === source.id
                                    ? styles.sourceButtonSelected
                                    : styles.sourceButtonNotSelected,
                            )}
                            onClick={() => form.setValue("source", source.id)}
                        >
                            <span {...stylex.props(styles.sourceButtonName)}>
                                {source.name}
                            </span>
                            <span
                                {...stylex.props(
                                    styles.sourceButtonDescription,
                                )}
                            >
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

const DARK = "@media (prefers-color-scheme: dark)";
const styles = stylex.create({
    form: {
        display: "flex",
        flexDirection: "column",
        gap: sizes.spacing2,
    },
    heading: {
        fontSize: fontSizes.xl,
        lineHeight: fontSizes.xl,
        fontWeight: fontWeights.bold,
    },

    sourceButton: {
        display: "flex",
        flexDirection: "column",
        padding: sizes.spacing2,
        borderRadius: rounded.md,
        gap: sizes.spacing1,
        textAlign: "left",
        transitionProperty: "background-color, border-color, color",
        transitionDuration: "150ms",
        background: "none",
        border: "none",
    },
    sourceButtonNotSelected: {
        backgroundColor: {
            ":hover": colours.gray300,
            [DARK]: {
                ":hover": colours.gray700,
            },
        },
    },
    sourceButtonSelected: {
        outline: theme.controlFocusedBorder,
    },
    sourceButtonName: {
        fontWeight: fontWeights.semibold,
    },
    sourceButtonDescription: {
        fontSize: fontSizes.sm,
        lineHeight: fontSizes.sm,
    },
});
