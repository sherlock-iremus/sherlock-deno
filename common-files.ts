export async function indexFilesByName(folder: string) {
    const o = {};

    for await (const entry of Deno.readDir(folder)) {
        if (entry.isFile) {
            o[entry.name] = `${folder}/${entry.name}`;
        }
    }

    return o;
}

export function findFilesByPrefix(files: object, prefix: string) {
    const r = [];

    for (const [key, value] of Object.entries(files)) {
        if (key.startsWith(prefix)) {
            r.push(value);
        }
    }

    return r;
}