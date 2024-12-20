import { SourceSet } from "@/lib/Source/SourceSet";

export class SourceSetEditWizard {
    public pages: Record<string, SourceSetEditWizardPage> = {};

    constructor(public sourceSet: SourceSet) {}

    public page(id: string, name: string) {
        const page = this.pages[id] || new SourceSetEditWizardPage(id, name);

        if (name) {
            page.name = name;
        } else if (!this.pages[id]) {
            throw new Error("Name is required for new pages");
        }

        return (this.pages[id] = page);
    }
}

export class SourceSetEditWizardPage {
    public sections: Record<string, SourceSetEditWizardSection> = {};

    constructor(
        public id: string,
        public name: string,
    ) {}

    public section(id: string, name: string) {
        const section =
            this.sections[id] || new SourceSetEditWizardSection(id, name);

        if (name) {
            section.name = name;
        } else if (!this.sections[id]) {
            throw new Error("Name is required for new sections");
        }

        return (this.sections[id] = section);
    }
}

class SourceSetEditWizardSection {
    public fields: Record<string, EditWizardField> = {};

    constructor(
        public id: string,
        public name: string,
    ) {}

    public field(id: string, options: EditWizardFieldOptions) {
        return (this.fields[id] = new EditWizardField(id, options));
    }
}

interface EditWizardFieldOptions {
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

export class EditWizardField implements EditWizardFieldOptions {
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

    constructor(
        public id: string,
        options: EditWizardFieldOptions,
    ) {
        this.label = options.label;
        this.type = options.type;
        this.description = options.description;
        this.variable = options.variable;
        this.onchange = options.onchange;
        this.options = options.options;
        this.default = options.default;
        this.required = options.required;
        this.autoGenerate = options.autoGenerate;
        this.validate = options.validate;
    }
}
