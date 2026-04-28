// curl -X GET "https://api.nakala.fr/vocabularies/licenses" -H "accept: application/json"
// https://vocabularies.coar-repositories.org/resource_types/c_c513/

const XSD_STRING = "http://www.w3.org/2001/XMLSchema#string";
const XSD_ANYURI = "http://www.w3.org/2001/XMLSchema#anyURI";

const NAKALA_NS = "http://nakala.fr/terms#";
const NAKALA_CREATED = NAKALA_NS + "created";
const NAKALA_CREATOR = NAKALA_NS + "creator";
const NAKALA_LICENSE = NAKALA_NS + "license";
const NAKALA_TITLE = NAKALA_NS + "title";
const NAKALA_TYPE = NAKALA_NS + "type";

export class Creator {
    constructor(
        public authorId: string,
        public fullName: string,
        public givenname: string,
        public orcid: string,
        public surname: string,
    ) { }

    asDict(): Record<string, string> {
        const x: Record<string, string> = {}

        if (this.authorId) x.authorId = this.authorId;
        if (this.fullName) x.fullName = this.fullName;
        if (this.givenname) x.givenname = this.givenname;
        if (this.orcid) x.orcid = this.orcid;
        if (this.surname) x.surname = this.surname;

        return x;
    }

    isNotEmpty(): boolean {
        function _(s: string): boolean {
            return (typeof s === "string" && s.trim().length > 0);
        }

        return _(this.surname) || _(this.givenname);
    }

    static isCreator(value: unknown): value is Creator {
        return value instanceof Creator;
    }

    // static isCreatorArray(value: unknown): value is Creator[] {
    //     return Array.isArray(value) && value.every(Creator.isCreator);
    // }
}

class MetadataType {
    constructor(
        public lang: boolean,
        public propertyUri: URL,
        public typeUri: URL,
    ) { }
}

export class MetadataValue {
    constructor(
        public lang: string | null,
        public metadataType: MetadataType,
        public value: string | URL | Creator | Creator[],
    ) { }

    forRequest() {
        // console.log(this);
        let x: any = {
            "propertyUri": this.metadataType.propertyUri.href,
            "typeUri": this.metadataType.typeUri.href,
            "value": this.value.toString(),
        }

        if (Creator.isCreator(this.value)) {
            x.value = this.value.asDict();
            if (!x.value.givenname) x.value.givenname = " ";
            if (!x.value.surname) x.value.surname = " ";
            delete x.typeUri;
        }
        if (this.lang && this.metadataType.lang) {
            x.lang = this.lang.toString();
        }

        if (this.metadataType.propertyUri.href === NAKALA_TYPE) {
            x.value = "http://purl.org/coar/resource_type/c_c513"
        }

        if (this.metadataType.propertyUri.href === NAKALA_CREATED) {
            x.value = new Date().toISOString().split("T")[0];
        }

        if (this.metadataType.propertyUri.href === NAKALA_CREATOR && this.value instanceof Creator) {
            delete x.typeUri;
        }

        return x
    }
}

export const NAKALA_METADATA_TYPES: Record<string, MetadataType> = {
    'nakala:created': new MetadataType(false, new URL(NAKALA_CREATED), new URL(XSD_STRING)),
    'nakala:creator': new MetadataType(false, new URL(NAKALA_CREATOR), new URL(XSD_ANYURI)),
    'nakala:license': new MetadataType(false, new URL(NAKALA_LICENSE), new URL(XSD_STRING)),
    'nakala:title': new MetadataType(true, new URL(NAKALA_TITLE), new URL(XSD_STRING)),
    'nakala:type': new MetadataType(false, new URL(NAKALA_TYPE), new URL(XSD_ANYURI)),
};