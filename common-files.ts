export async function indexFilesByName(folder: string) {
    const o = {};

    for await (const entry of Deno.readDir(folder)) {
        console.log(entry.name, entry.isFile ? "file" : "dir");
    }

    return o;
}