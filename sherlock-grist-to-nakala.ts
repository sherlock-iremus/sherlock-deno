import { Command } from 'jsr:@cliffy/command@1.0.0';
import { load } from 'https://deno.land/std@0.224.0/dotenv/mod.ts';

async function fetchGristRecords(base: string, apiKey: string, docId: string, tableId: string) {
    const url = `${base}/docs/${docId}/tables/${tableId}/records`;
    try {
        const response = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching records: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched records:", data.records);
        return data.records;

    } catch (err) {
        console.error("Fetch failed:", err);
    }
}

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
    .parse();

const records = await fetchGristRecords(options.gristBase, options.gristApiKey, options.gristDocId, options.gristTableId);
for (const record of records) {
    console.log(record);
}