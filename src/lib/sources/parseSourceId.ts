export function parseSourceId(sourceId: string) {
    const [namespace, name = "main"] = sourceId.split(":");

    return { namespace, name, formattedId: `${namespace}:${name}` };
}
