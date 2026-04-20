import { Command } from 'jsr:@cliffy/command@1.0.0';
import { fetchRecords, getColumns, getTables } from "./common-grist.ts";
import { GristTable, GristRecord } from "./common-grist-data.ts";
import { DataFactory, Store, Writer } from "https://esm.sh/n3";

const { options } = await new Command()
    .name('SHERLOCK Grist Opentheso Plugin skos:prefLabel to Opentheso URI')
    .description('🌴')
    .version('v1.0.0')
    .option('--grist-api-key <grist-api-key:string>')
    .option('--grist-base <grist-base:string>')
    .option('--grist-doc-id <grist-doc-id:string>')
    .option('-t, --table <table:string>', "Add table", { collect: true })
    .option('--rdf-properties-prefix <rdf-properties-prefix:string>')
    .option('--rdf-ressource-base <rdf-ressource-base:string>')
    .option('--output-ttl <output-ttl:string>')
    .parse();

const GRIST_DATA: Record<string, GristTable> = {};
for (const tableId of options.table) GRIST_DATA[tableId] = { columns: {}, data: {}, id: tableId, metadata: {} };

// FETCH METADATA AND DATA

const tables = await getTables(options.gristBase, options.gristApiKey, options.gristDocId);
for (const tableData of tables["tables"]) {
    if (options.table.includes(tableData["id"])) {
        GRIST_DATA[tableData["id"]].metadata = tableData["fields"];
        // COLUMNS
        const columns = await getColumns(options.gristBase, options.gristApiKey, options.gristDocId, tableData["id"]);
        for (const column of columns.columns) GRIST_DATA[tableData["id"]].columns[column.id] = { id: column.id, ...column.fields };;
        // DATA
        const records = await fetchRecords(options.gristBase, options.gristApiKey, options.gristDocId, tableData["id"]);
        for (const record of records) GRIST_DATA[tableData["id"]].data[record.id] = { id: record.id, ...record.fields };
    }
}

// CREATE RDF

const { namedNode, literal, quad } = DataFactory;
const E = options.rdfRessourceBase;
const R = options.rdfPropertiesPrefix;
const writer = new Writer({
    escapeUnicode: false,
    prefixes: {
        e: E,
        p: R
    }
});
writer.addQuad(namedNode(E + 'andouillette'), namedNode(R + 'label'), literal("💾"));
writer.end((error: any, result: any) => {
    console.log(result);
    if (error) console.error(error);
    else Deno.writeTextFileSync(options.outputTtl, result);
});