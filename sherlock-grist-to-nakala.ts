import { Command } from 'jsr:@cliffy/command@1.0.0';
import { load } from 'https://deno.land/std@0.224.0/dotenv/mod.ts';
import { fetchRecords as fetchGristRecords } from "https://raw.githubusercontent.com/sherlock-iremus/sherlock-deno/refs/heads/main/common-grist.ts";
import { indexFilesByName } from "https://raw.githubusercontent.com/sherlock-iremus/sherlock-deno/refs/heads/main/common-files.ts";

const { options } = await new Command()
    .name('SHERLOCK Grist to Nakala')
    .description('🌴')
    .version('v1.0.0')
    .option('--nakala-api-base <nakala-api-base:string>')
    .option('--nakala-api-key <nakala-api-key:string>')
    .option('--grist-api-key <grist-api-key:string>')
    .option('--grist-base <grist-base:string>')
    .option('--grist-doc-id <grist-doc-id:string>')
    .option('--grist-table-id <grist-table-id:string>')
    .option('--files-dir <files-dir:string>')
    .parse();

indexFilesByName(options.filesDir)

// const records = await fetchGristRecords(options.gristBase, options.gristApiKey, options.gristDocId, options.gristTableId);
// for (const record of records) {
//     console.log(record);
// }