import stylex from "@stylexjs/stylex";
import { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Form } from "@/components/Form";
import { useVariable } from "@/hooks/sources";
import { SourceSetEditWizardPage } from "@/lib/Source/SourceSetEditWizard";
import {
    CHARACTER_LIST,
    getSavedSourceSets,
    serializeSavableSourceSet,
} from "@/lib/Source/persistence";
import {
    CharacterSheetSectionConstants,
    CharacterSheetVariableConstants,
} from "@/lib/constants";
import { colours } from "@/styles/colours.stylex";
import { fontSizes, fontWeights, lineHeights } from "@/styles/fonts.stylex";
import { rounded } from "@/styles/rounded.stylex";
import { maxWidths, sizes } from "@/styles/sizes.stylex";

function getDefaultValuesForPage(page: SourceSetEditWizardPage) {
    const defaultValues: Record<string, any> = {};

    for (const section of Object.values(page.sections)) {
        for (const field of Object.values(section.fields)) {
            let defaultValue = field.default;

            if (field.variable) {
                defaultValue = page.sourceSet.getVariable(field.variable);
            }

            defaultValues[section.id + ":" + field.id] = defaultValue;
        }
    }

    return defaultValues;
}

export function EditCharacterPage({
    page,
    hasNext,
    onRequestNextPage,
}: {
    page: SourceSetEditWizardPage;
    hasNext: boolean;
    onRequestNextPage: () => void;
}) {
    const characterName = useVariable(
        CharacterSheetVariableConstants.CHARACTER_NAME,
    );

    const [defaultValues, setDefaultValues] = useState(() =>
        getDefaultValuesForPage(page),
    );

    const form = useForm({
        defaultValues,
    });

    const [justSubmitted, setJustSubmitted] = useState(false);

    const reset = () => {
        const newDefaultValues = getDefaultValuesForPage(page);
        setDefaultValues(newDefaultValues);

        form.reset(newDefaultValues);
    };

    const onSubmit = async (values: any) => {
        const variablesToSet: Record<string, any> = {};

        for (const [key, value] of Object.entries(values)) {
            const [sectionId, fieldId] = key.split(":");

            const field = page.sections[sectionId].fields[fieldId];

            if (field.validate) {
                const error = field.validate(value);

                if (error) {
                    form.setError(key, {
                        message: error,
                    });
                    return;
                }
            }

            if (field.variable) {
                variablesToSet[field.variable] = value;
            }

            if (field.onchange) {
                field.onchange(value);
            }
        }

        if (
            CharacterSheetVariableConstants.CHARACTER_NAME in variablesToSet &&
            variablesToSet[CharacterSheetVariableConstants.CHARACTER_NAME] !==
                defaultValues[CharacterSheetVariableConstants.CHARACTER_NAME]
        ) {
            const savedSets = getSavedSourceSets();

            if (
                savedSets.some(
                    (set) =>
                        set.variables[
                            CharacterSheetVariableConstants.CHARACTER_NAME
                        ].value === variablesToSet.characterName,
                )
            ) {
                form.setError(
                    CharacterSheetSectionConstants.DETAILS +
                        ":" +
                        CharacterSheetVariableConstants.CHARACTER_NAME,
                    {
                        message: "Character name already exists",
                    },
                );
                return;
            }

            const newSavedSets = savedSets.filter(
                (set) =>
                    set.variables[
                        CharacterSheetVariableConstants.CHARACTER_NAME
                    ].value !== characterName,
            );

            localStorage.setItem(
                CHARACTER_LIST,
                JSON.stringify(
                    newSavedSets.map((set) => serializeSavableSourceSet(set)),
                ),
            );
        }

        for (const [name, value] of Object.entries(variablesToSet)) {
            page.sourceSet.setVariable(name, value);
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));

        setJustSubmitted(true);

        reset();
    };

    const renderSections = () => {
        const sections: ReactNode[] = [];

        for (const section of Object.values(page.sections)) {
            const fields: ReactNode[] = [];

            for (const field of Object.values(section.fields)) {
                if (field.type === "string") {
                    fields.push(
                        <Form.Input
                            key={field.id}
                            name={section.id + ":" + field.id}
                            label={field.label}
                            description={field.description}
                            required={field.required}
                        />,
                    );
                } else if (field.type === "textarea") {
                    fields.push(
                        <Form.TextArea
                            key={field.id}
                            name={section.id + ":" + field.id}
                            label={field.label}
                            description={field.description}
                            required={field.required}
                            minRows={3}
                            maxRows={6}
                        />,
                    );
                }
            }

            sections.push(
                <div
                    key={section.id}
                    {...stylex.props(styles.sectionContainer)}
                >
                    <h2 {...stylex.props(styles.sectionHeading)}>
                        {section.name}
                    </h2>

                    {fields}
                </div>,
            );
        }

        return sections;
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            setJustSubmitted(false);
        }, 3000);

        return () => clearTimeout(timeout);
    }, [justSubmitted]);

    return (
        <div {...stylex.props(styles.container)}>
            <Form
                form={form}
                submitHandler={onSubmit}
                {...stylex.props(styles.form)}
            >
                <div {...stylex.props(styles.formSectionsContainer)}>
                    {renderSections()}
                </div>

                <div {...stylex.props(styles.formButtonsContainer)}>
                    {justSubmitted && (
                        <p {...stylex.props(styles.formSavedMessage)}>Saved!</p>
                    )}

                    <Form.Button color="primary" size="md">
                        Save
                    </Form.Button>
                    <Form.Button
                        color="secondary"
                        size="md"
                        disabled={!hasNext}
                        onAfterSubmit={onRequestNextPage}
                    >
                        Save & Next Page
                    </Form.Button>
                </div>
            </Form>
        </div>
    );
}

const DARK = "@media (prefers-color-scheme: dark)";
const SM_BREAKPOINT = "@media (min-width: 640px)";
const styles = stylex.create({
    container: {
        display: "flex",
        flexGrow: 1,
        justifyContent: "center",
        padding: sizes.spacing4,
        borderRadius: rounded.lg,
        backgroundColor: {
            default: colours.gray200,
            [DARK]: colours.gray800,
        },
    },

    form: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        justifyContent: "space-between",
        maxWidth: {
            default: "none",
            [SM_BREAKPOINT]: maxWidths.md,
        },
    },
    formSectionsContainer: {
        display: "flex",
        flexDirection: "column",
        gap: sizes.spacing4,
    },
    formButtonsContainer: {
        display: "flex",
        gap: sizes.spacing2,
        alignItems: "center",
        justifyContent: "flex-end",
    },
    formSavedMessage: {
        color: colours.green500,
    },

    sectionContainer: {
        display: "flex",
        flexDirection: "column",
        gap: sizes.spacing2,
    },
    sectionHeading: {
        fontSize: fontSizes.xl,
        lineHeight: lineHeights.xl,
        fontWeight: fontWeights.bold,
    },
});
