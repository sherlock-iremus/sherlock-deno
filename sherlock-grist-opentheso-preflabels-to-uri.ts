import { Command } from 'jsr:@cliffy/command@1.0.0';

import { fetchRecords as fetchGristRecords, patchRecord } from "./common-grist.ts";

const { options } = await new Command()
    .name('SHERLOCK Grist Opentheso Plugin skos:prefLabel to Opentheso URI')
    .description('🌴')
    .version('v1.0.0')
    .option('--grist-api-key <grist-api-key:string>')
    .option('--grist-base <grist-base:string>')
    .option('--grist-doc-id <grist-doc-id:string>')
    .option('--grist-table-id <grist-table-id:string>')
    .option('--grist-preflabel-column-id <grist-column-id:string>')
    .option('--grist-opentheso-url-column-id <grist-column-id:string>')
    .option('--opentheso-thesaurus-url <opentheso-thesaurus-url:string>')
    .parse();

console.log(options);

const records = await fetchGristRecords(options.gristBase, options.gristApiKey, options.gristDocId, options.gristTableId);
for (const record of records) {
    console.log(record);
}