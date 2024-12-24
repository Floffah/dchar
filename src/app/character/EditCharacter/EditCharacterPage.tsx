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
                }
            }

            sections.push(
                <div key={section.id} className="flex flex-col gap-2">
                    <h2 className="text-xl font-semibold">{section.name}</h2>

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
        <Form
            form={form}
            submitHandler={onSubmit}
            className="flex flex-grow flex-col rounded-lg bg-gray-200 p-4 dark:bg-gray-800"
        >
            {renderSections()}
            <div className="flex-grow" />
            <div className="flex items-center justify-end gap-2">
                {justSubmitted && <p className="text-green-500">Saved!</p>}
                <Form.Button color="primary" size="md" className="w-fit">
                    Save
                </Form.Button>
                <Form.Button
                    color="secondary"
                    size="md"
                    className="w-fit"
                    disabled={!hasNext}
                    onAfterSubmit={onRequestNextPage}
                >
                    Save & Next Page
                </Form.Button>
            </div>
        </Form>
    );
}
