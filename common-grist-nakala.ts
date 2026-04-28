import { Creator, MetadataValue, NAKALA_METADATA_TYPES } from "./common-nakala-metadatas.ts";

export function extractRequiredMetadataFromRecord(fields: Record<string, unknown>): MetadataValue[] {
    const requiredMetadata: MetadataValue[] = [];
    const creators: Record<number, Creator> = {};
    let qname: string = '';

    for (const column in fields) {
        if (column.startsWith('nakala__creator')) {
            const match = column.match(/nakala__creator_(\d+)__(.+)/);
            if (match) {
                const creatorN = parseInt(match[1]);
                const creatorField = match[2];
                let creator = null;
                if (creatorN in creators) {
                    creator = creators[creatorN];
                }
                else {
                    creator = new Creator("", "", "", "", "");
                    creators[creatorN] = creator;
                }
                switch (creatorField) {
                    case "givenname":
                        creator.givenname = String(fields[column]);
                        break;
                    case "surname":
                        creator.surname = String(fields[column]);
                        break;
                    case "orcid":
                        creator.orcid = String(fields[column]);
                        break;
                }
                creators[creatorN] = creator;
            }
        }

        else if (column.startsWith('nakala__') || column.startsWith('dcterms__')) {
            qname = column.replace('__', ':');
            const metadataType = NAKALA_METADATA_TYPES[qname];
            if (metadataType) {
                requiredMetadata.push(new MetadataValue('fr', metadataType, String(fields[column])))
            }
        }
    }

    for (const creatorN in creators) {
        const creator = creators[creatorN];
        if (creator.isNotEmpty()) {
            requiredMetadata.push(new MetadataValue(null, NAKALA_METADATA_TYPES['nakala:creator'], creator))
        }
    }

    return requiredMetadata;
}