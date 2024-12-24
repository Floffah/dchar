import { useEffect, useState } from "react";

import { useSources } from "@/providers/SourcesProvider";

export function useVariables() {
    const sources = useSources();

    return {
        get: (name: string) => sources.sourceSet.getVariable(name),
        set: (name: string, value: any) =>
            sources.sourceSet.setVariable(name, value),
    };
}

export function useVariable(name: string) {
    const sources = useSources();

    const [value, setValue] = useState(sources.sourceSet.getVariable(name));

    useEffect(() => {
        const onVariablesChanged = (changedName: string) => {
            if (changedName === name) {
                setValue(sources.sourceSet.getVariable(changedName));
            }
        };

        const onLoaded = () => {
            setValue(sources.sourceSet.getVariable(name));
        };

        sources.sourceSet.on("variableChanged", onVariablesChanged);
        sources.sourceSet.on("loaded", onLoaded);

        return () => {
            sources.sourceSet.off("variableChanged", onVariablesChanged);
            sources.sourceSet.off("loaded", onLoaded);
        };
    }, [name, sources.sourceSet]);

    return value;
}
