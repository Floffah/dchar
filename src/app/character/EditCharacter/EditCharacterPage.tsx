"use client";

import { Fragment, useMemo } from "react";

import { CharacterEditorNavigation } from "@/app/character/EditCharacter/CharacterEditorNavigation";
import { Button } from "@/components/Button";
import { Divider } from "@/components/Divider";
import { useCombinedSourcesQuery } from "@/lib/data/useCombinedSourcesQuery";
import { useAppForm } from "@/lib/hooks/useAppForm";
import { useCharacterSheetStore } from "@/state/characterSheet";

export function EditCharacterPage({ page }: { page: string }) {
    const sheet = useCharacterSheetStore();

    const combinedSources = useCombinedSourcesQuery();

    const sections = useMemo(
        () =>
            Object.entries(combinedSources.data?.sections ?? {})
                .filter(([, v]) => v.page === page)
                .map(([k]) => k),
        [combinedSources.data?.sections, page],
    );

    const initialDefaultValues = useMemo(() => {
        const defaultValues = {} as any;

        for (const [name, field] of Object.entries(
            combinedSources.data?.fields ?? {},
        )) {
            if (sections.includes(field.section)) {
                if (typeof field.default !== "undefined") {
                    defaultValues[name] = field.default;
                } else if (field.variable) {
                    const variableValue = sheet.variables[field.variable];

                    defaultValues[name] = variableValue.value;
                }
            }
        }

        return defaultValues;
    }, [combinedSources.data?.fields, sections, sheet.variables]);

    const form = useAppForm({
        defaultValues: initialDefaultValues,
        onSubmit: async ({ value }) => {
            for (const key of Object.keys(value)) {
                const field = combinedSources.data?.fields[key];

                if (field?.variable) {
                    sheet.setVariable(field.variable, value[key]);

                    if (field.variable === "characterName") {
                        sheet.setName(value[key]);
                    }
                }
            }
        },
    });

    return (
        <form
            className="flex flex-1 flex-col gap-4"
            onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
            }}
        >
            <form.AppForm>
                <div className="flex flex-1 flex-col gap-4">
                    {sections.map((sectionName, i) => {
                        const fields = Object.entries(
                            combinedSources.data?.fields ?? {},
                        ).filter(([, v]) => v.section === sectionName);

                        const section =
                            combinedSources.data?.sections[sectionName];

                        if (!section) {
                            return null;
                        }

                        return (
                            <Fragment key={sectionName}>
                                {i > 0 && <Divider orientation="horizontal" />}

                                <div
                                    key={sectionName}
                                    className="flex flex-col gap-2"
                                >
                                    <h2 className="text-xl font-bold text-gray-200">
                                        {section.name}
                                    </h2>

                                    {fields.map(([fieldId, fieldData]) => (
                                        <form.AppField
                                            name={fieldId}
                                            key={fieldId}
                                            validators={{
                                                onSubmit: ({ value }) => {
                                                    if (
                                                        !value &&
                                                        fieldData.required
                                                    ) {
                                                        return "This field is required";
                                                    }

                                                    if (
                                                        fieldData.type ===
                                                        "string"
                                                    ) {
                                                        if (
                                                            typeof value !==
                                                            "string"
                                                        ) {
                                                            return "This field must be a string";
                                                        }

                                                        if (
                                                            fieldData.required &&
                                                            !value.trim()
                                                        ) {
                                                            return "This field cannot be empty";
                                                        }
                                                    }
                                                },
                                            }}
                                        >
                                            {(field) => {
                                                if (
                                                    fieldData.type === "string"
                                                ) {
                                                    return (
                                                        <field.Input
                                                            label={
                                                                fieldData.name
                                                            }
                                                            description={
                                                                fieldData.description
                                                            }
                                                            disabled={
                                                                !fieldData.variable
                                                            }
                                                        />
                                                    );
                                                }

                                                return (
                                                    <field.Field
                                                        label={fieldData.name}
                                                        description={
                                                            fieldData.description
                                                        }
                                                    >
                                                        <p className="text-white italic">
                                                            {field.state.value}
                                                        </p>
                                                    </field.Field>
                                                );
                                            }}
                                        </form.AppField>
                                    ))}
                                </div>
                            </Fragment>
                        );
                    })}
                </div>
                <div className="flex flex-shrink-0 justify-between gap-2">
                    <CharacterEditorNavigation className="flex-shrink-0" />

                    <div className="flex flex-shrink-0 gap-2">
                        <Button
                            size="md"
                            color="secondary"
                            type="button"
                            onClick={() => form.reset()}
                        >
                            Reset
                        </Button>
                        <form.SubscribeButton size="md" color="primary">
                            Save
                        </form.SubscribeButton>
                    </div>
                </div>
            </form.AppForm>
        </form>
    );
}
