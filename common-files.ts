export async function indexFilesByName(folder: string) {
    const o = {};

    for await (const entry of Deno.readDir(folder)) {
        if (entry.isFile) {
            o[entry.name] = `${folder}/${entry.name}`
        }
    }

    return o;
}