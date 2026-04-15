import { Creator, MetadataValue, NAKALA_METADATA_TYPES } from "./nakala-metadatas.ts";

export function extractRequiredMetadataFromRecord(fields: Record<string, unknown>): MetadataValue[] {
    const requiredMetadata: MetadataValue[] = [];
    const creator: Creator = new Creator("", "", "", "", "");
    let qname: string = '';

    for (const column in fields) {
        if (column.startsWith('nakala__creator')) {
            const creatorColumnIdParts: string[] = column.split('__').filter(x => x);
            const propertyLocalName: string = creatorColumnIdParts[creatorColumnIdParts.length - 1];
            if (propertyLocalName === 'creator') creator.fullName = fields[column] as string
            else creator[propertyLocalName] = fields[column] as string;
            //TODO requiredMetadata.push(new MetadataValue(null, NAKALA_METADATA_TYPES['nakala:creator'], creator));
            requiredMetadata.push(new MetadataValue(null, NAKALA_METADATA_TYPES['nakala:creator'], [
                new Creator("", "", "Marie", "", "Curie"),
                new Creator("", "", "Pierre", "", "Curie"),
            ]));
        }
        else if (column.startsWith('nakala__') || column.startsWith('dcterms__')) {
            qname = column.replace('__', ':');
            const metadataType = NAKALA_METADATA_TYPES[qname];
            if (metadataType) {
                requiredMetadata.push(new MetadataValue('fr', metadataType, String(fields[column])))
            }
        }
    }

    return requiredMetadata;
}