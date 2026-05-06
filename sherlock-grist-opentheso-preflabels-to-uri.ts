import { Command } from 'jsr:@cliffy/command@1.0.0';

import { fetchRecords as fetchGristRecords, writeValueById } from "./common-grist.ts";
import { fetchThesaurus, getConceptFrenchPrefLabels, SKOS_CONCEPT_TYPE } from './common-opentheso.ts';

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
    .option('--opentheso-thesaurus-id <opentheso-thesaurus-id:string>')
    .option('--test-mode <test-mode:boolean>')
    .parse();

const gristOpenthesoConceptsSeparator = " ; "
console.log(options);

console.log("Fetching concepts from Opentheso... ⏳");
const thesaurus = await fetchThesaurus(options.openthesoThesaurusId);
const conceptList = thesaurus.filter((concept) => concept['@type'].includes(SKOS_CONCEPT_TYPE));
console.log("Concepts fetched ✅");
console.log("Fetching records from Grist... ⏳");

const records = await fetchGristRecords(options.gristBase, options.gristApiKey, options.gristDocId, options.gristTableId);
console.log("Records fetched ✅");
console.log("Pushing concepts URIs... ⏳");

// Simple loader spinner
const spinnerFrames = ['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏'];
let spinnerIndex = 0;


for (let i = 0; i < records.length; i++) {
    const record = records[i];
    // Affiche le spinner
    spinnerIndex = (spinnerIndex + 1) % spinnerFrames.length;
    Deno.stdout.writeSync(new TextEncoder().encode(`\rAnalyzing record ${i + 1}/${records.length} ${spinnerFrames[spinnerIndex]}   `));

    const id = record.id;
    const matchingConcepts = [];
    for (const prefLabel of record.fields[options.gristPreflabelColumnId].split(gristOpenthesoConceptsSeparator)) {
        if (prefLabel.trim() === "") continue; // Ignore les labels vides
        const matchingConcept = conceptList.find(concept => getConceptFrenchPrefLabels(concept).includes(prefLabel));
        if (matchingConcept) {
            matchingConcepts.push(matchingConcept['@id']);
        } else {
            console.log(`No match found for "${prefLabel}"`);
            matchingConcepts.push("no-uri-found:" + prefLabel);
        }
    }

    if (options.testMode) {
        console.log("Test mode enabled. Skipping write operation.");
    } else {
        matchingConcepts.length > 0 && await writeValueById(
            options.gristBase,
            options.gristApiKey,
            options.gristDocId,
            options.gristTableId,
            id,
            options.gristOpenthesoUrlColumnId,
            matchingConcepts.join(gristOpenthesoConceptsSeparator)
        )
    }
}
// Nettoie la ligne du loader à la fin
Deno.stdout.writeSync(new TextEncoder().encode(`\r${' '.repeat(60)}\r`));
console.log("URIs pushed ✅");
