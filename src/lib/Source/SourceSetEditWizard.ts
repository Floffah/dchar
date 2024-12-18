import { SourceSet } from "@/lib/Source/SourceSet";

export interface EditWizardField {
    label: string;
    type:
        | "string"
        | "textarea"
        | "number"
        | "boolean"
        | "select"
        | "mutli-select";
    description?: string;
    variable?: string;
    onchange?: (value: any) => void;
    options?: Record<string, string>;
    default?: any;
    required?: boolean;
    autoGenerate?: () => any;
    validate?: (value: any) => string | null;
}

export class SourceSetEditWizard {
    public pages: Record<
        string,
        {
            name: string;
            sections: Record<
                string,
                {
                    name: string;
                    fields: Record<string, EditWizardField>;
                }
            >;
        }
    > = {};

    constructor(public sourceSet: SourceSet) {}
}
