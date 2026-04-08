import { Command } from 'jsr:@cliffy/command@1.0.0';
import { load } from 'https://deno.land/std@0.224.0/dotenv/mod.ts';
import { fetchRecords as fetchGristRecords } from "https://raw.githubusercontent.com/sherlock-iremus/sherlock-deno/main/common-grist.ts";
import { indexFilesByName, findFilesByPrefix } from "https://raw.githubusercontent.com/sherlock-iremus/sherlock-deno/main/common-files.ts";
import { postDataUploads, postDatas } from './common-nakala.ts';

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

const files = await indexFilesByName(options.filesDir);

const records = await fetchGristRecords(options.gristBase, options.gristApiKey, options.gristDocId, options.gristTableId);
for (const record of records) {
    let associatedFiles = findFilesByPrefix(files, record.fields.filenames);
    associatedFiles.sort((a: string, b: string) => a.localeCompare(b, undefined, { sensitivity: "base" }));
    const sherlockUuid = record.fields.UUID;
    const businessId = record.fields.E42_business_id
    let nakalaDoi = record.fields.E42_nakala_doi || "";
    let nakalaDoiOnly = ""
    if (nakalaDoi) {
        nakalaDoiOnly = nakalaDoi.replace("https://nakala.fr/", "").replace("/", "%2F")
    }
    if (!sherlockUuid || associatedFiles.length === 0) continue

    if (nakalaDoi) {
        console.log(`✅ ${businessId} => ${nakalaDoi}`);
    }
    else {
        console.log(associatedFiles)
        // UPLOAD FILES TO NAKALA
        // const filesOnNakala = []
        // for (const filePath of associatedFiles) {
        //     const r = await postDataUploads(options.nakalaApiBase, options.nakalaApiKey, filePath);
        //     filesOnNakala.push(r);
        //     console.log("✅ /datas/uploads =>", r)
        // }
        // const r = await postDatas(options.nakalaApiBase, options.nakalaApiKey, filesOnNakala, sherlockUuid, businessId);
        // console.log("✅ /datas =>", r)
        // nakalaDoi = r.payload.id;
        // console.log(`✅ https://nakala.fr/${nakalaDoi}`);
        break
    }
}