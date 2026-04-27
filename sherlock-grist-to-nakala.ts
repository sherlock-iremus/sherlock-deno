import { Command } from 'jsr:@cliffy/command@1.0.0';
import { fetchRecords as fetchGristRecords, patchRecord, } from "./common-grist.ts";
import { indexFilesByName, findFilesByPrefix } from "./common-files.ts";
import { postDataUploads, postDatas, putMetadatas } from './common-nakala.ts';
import { extractRequiredMetadataFromRecord } from './common-grist-nakala.ts';

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
        nakalaDoiOnly = options.nakalaApiBase === "apitest.nakala.fr"
            ? nakalaDoi.replace("https://test.nakala.fr/", "").replace("/", "%2F")
            : nakalaDoi.replace("https://nakala.fr/", "").replace("/", "%2F")
    }
    if (!sherlockUuid || associatedFiles.length === 0) continue

    // WHAT ARE WE DOING?
    console.log('-'.repeat(80));
    console.log(`🔮 Donnée d'id « ${businessId} »`);

    // DOES THE DATA ALREADY EXIST ON NAKALA?
    if (nakalaDoi) {
        console.log(`🔮 ${businessId} => ${nakalaDoi}`);
    }
    else {
        // UPLOAD FILES
        const filesOnNakala = []
        console.log(`🔮 ${associatedFiles.length} fichiers à uploader avec le préfixe « ${record.fields.filenames} »`)
        for (const filePath of associatedFiles) {
            const r = await postDataUploads(options.nakalaApiBase, options.nakalaApiKey, filePath);
            filesOnNakala.push(r);
            console.log("✨ /datas/uploads =>", JSON.stringify(r))
            break
        }

        // POST DATA
        const r = await postDatas(options.nakalaApiBase, options.nakalaApiKey, filesOnNakala, sherlockUuid, businessId);
        console.log("✨ /datas =>", JSON.stringify(r))
        const newNakalaDoi = r.payload.id;
        nakalaDoiOnly = newNakalaDoi.replace("/", "%2F");
        const fullNewNakalaDoi = options.nakalaApiBase === "apitest.nakala.fr"
            ? `https://test.nakala.fr/${newNakalaDoi}`
            : `https://nakala.fr/${newNakalaDoi}`
        console.log(`🌸 ${fullNewNakalaDoi}`);

        // STORE NAKALA DOI IN GRIST
        // await patchRecord(
        //     options.gristBase,
        //     options.gristApiKey,
        //     options.gristDocId,
        //     options.gristTableId,
        //     {
        //         "records": [{
        //             "require": { E42_business_id: businessId },
        //             "fields": { "E42_nakala_doi": fullNewNakalaDoi }
        //         }]
        //     }
        // )
    }

    // METADATAS
    const requiredMetadata = extractRequiredMetadataFromRecord(record.fields);
    console.log(requiredMetadata.map(x => x.forRequest()));
    const r_md = await putMetadatas(options.nakalaApiBase, options.nakalaApiKey, nakalaDoiOnly, requiredMetadata.map(x => x.forRequest()));
    console.log(`ℹ️  /datas/${nakalaDoiOnly}`, r_md)
    break
}