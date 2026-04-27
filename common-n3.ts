import { Writer } from "https://esm.sh/n3";

export function writeTtl(writer: Writer, filename: string) {
    writer.end((error: any, result: any) => {
        const readable = result.replace(/\\U([0-9a-fA-F]{8})/g, (_: string, hex: string) =>
            String.fromCodePoint(parseInt(hex, 16))
        );
        Deno.writeTextFileSync(filename, readable);
    });
}