import { Command } from 'jsr:@cliffy/command@1.0.0';
import { describeDoc } from "./common-grist.ts";

const { options } = await new Command()
    .name('SHERLOCK Grist Opentheso Plugin skos:prefLabel to Opentheso URI')
    .description('🌴')
    .version('v1.0.0')
    .option('--grist-api-key <grist-api-key:string>')
    .option('--grist-base <grist-base:string>')
    .option('--grist-doc-id <grist-doc-id:string>')
    .option('-t, --table <table:string>', "Add table", { collect: true })
    .parse();

console.log(options);