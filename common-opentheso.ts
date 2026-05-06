const OPENTHESO_BASE_URL = 'http://opentheso.huma-num.fr';

// Type pour un label multilingue (ex: prefLabel)
export interface SkosLabel {
	"@language"?: string;
	"@value": string;
}

// Type pour une ressource liée par @id (ex: narrower, broader, inScheme, exactMatch)
export interface SkosResourceRef {
	"@id": string;
}

export const SKOS_CONCEPT_TYPE = "http://www.w3.org/2004/02/skos/core#Concept";
// Type pour un concept SKOS dans la réponse Opentheso
export interface SkosConcept {
	"@id": string;
	"@type": string[];
	"http://www.w3.org/2004/02/skos/core#prefLabel"?: SkosLabel[];
	"http://www.w3.org/2004/02/skos/core#narrower"?: SkosResourceRef[];
	"http://www.w3.org/2004/02/skos/core#broader"?: SkosResourceRef[];
	"http://www.w3.org/2004/02/skos/core#inScheme"?: SkosResourceRef[];
	"http://www.w3.org/2004/02/skos/core#exactMatch"?: SkosResourceRef[];
	"http://purl.org/dc/terms/created"?: { "@value": string; "@type"?: string }[];
	"http://purl.org/dc/terms/modified"?: { "@value": string; "@type"?: string }[];
	"http://purl.org/dc/terms/identifier"?: { "@value": string }[];
	"http://purl.org/dc/terms/contributor"?: { "@value": string }[];
}

export const getConceptFrenchPrefLabels = (concept: SkosConcept): string[] => {
    const prefLabels = concept['http://www.w3.org/2004/02/skos/core#prefLabel'] || [];
    return prefLabels
        .filter(label => label['@language'] === 'fr')
        .map(label => label['@value']);
}

/**
 * Fetch full thesaurus on Opentheso : JSON-LD.
 * https://opentheso.huma-num.fr/swagger-ui/index.html#/Thesaurus/getThesoFromId
 * @param openthesoBaseUrl URL de base de l'API Opentheso (ex: https://opentheso.example.com)
 * @param thesaurusId Identifiant du thésaurus à récupérer
 * @returns L'objet JSON-LD du thésaurus
 */
export async function fetchThesaurus(thesaurusId: string): Promise<SkosConcept[]> {
	const url = `${OPENTHESO_BASE_URL}/openapi/v1/thesaurus/${encodeURIComponent(thesaurusId)}`;
	const response = await fetch(url, {
		headers: {
			'accept': 'application/ld+json',
		},
	});
	if (!response.ok) {
		throw new Error(`[OPENTHESO - fetchThesaurus()] error : ${response.status} ${response.statusText}`);
	}
	return await response.json();
}
