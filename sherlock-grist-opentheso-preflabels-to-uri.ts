import { Command } from "https://deno.land/x/cliffy@v0.25.7/command/mod.ts";

import { fetchRecords } from "./common-grist.ts"

const cmd = await new Command()
    .option("--grist_api_key <key:string>", "Grist API key", { required: true })
    .option("--grist_doc_id <id:string>", "Grist document ID", { required: true })
    .parse(Deno.args);

console.log(cmd.options.grist_api_key);
console.log(cmd.options.grist_doc_id);