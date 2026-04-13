export async function postDataUploads(apiBase: string, apiKey: string, filePath: string) {
    const formData = new FormData();
    const file = await Deno.readFile(filePath);
    const fileBlob = new Blob([file], { type: "text/plain" });
    formData.append("file", fileBlob, filePath);

    const response = await fetch(`https://${apiBase}/datas/uploads`, {
        method: "POST",
        headers: {
            "accept": "application/json",
            "X-API-KEY": apiKey,
        },
        body: formData,
    });
    return await response.json();
}

export async function postDatas(apiBase: string, apiKey: string, files, sherlockUuid: string, title: string) {
    // https://documentation.huma-num.fr/nakala-guide-de-description/#fonctionnement-des-proprietes-nakala-obligatoires
    const data = {
        // "collectionsIds": [collectionId],
        "files": files,
        "status": "published",
        "metas": [
            {
                "value": title,
                "propertyUri": "http://nakala.fr/terms#title",
                "typeUri": "http://www.w3.org/2001/XMLSchema#string"
            },
            {
                "propertyUri": "http://nakala.fr/terms#type",
                "value": "http://purl.org/coar/resource_type/c_c513",
                "typeUri": "http://www.w3.org/2001/XMLSchema#anyURI"
            },
            {
                "propertyUri": "http://purl.org/dc/terms/identifier",
                "value": `http://data-iremus.huma-num.fr/id/${sherlockUuid}`,
                "typeUri": "http://www.w3.org/2001/XMLSchema#anyURI"
            },
            {
                "propertyUri": "http://nakala.fr/terms#creator",
                "value": null,
                "typeUri": "http://www.w3.org/2001/XMLSchema#anyURI"
            },
            {
                "value": new Date().toISOString().split("T")[0],
                "propertyUri": "http://nakala.fr/terms#created",
                "typeUri": "http://www.w3.org/2001/XMLSchema#string"
            },
            {
                "value": "PDM", // licence code: https://apitest.nakala.fr/vocabularies/licenses
                "propertyUri": "http://nakala.fr/terms#license",
                "typeUri": "http://www.w3.org/2001/XMLSchema#string"
            }
        ]
    }

    try {
        const response = await fetch(`https://${apiBase}/datas`, {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json",
                "X-API-KEY": apiKey,
            },
            body: JSON.stringify(data),
        });
        return await response.json();
    }
    catch (error) {
        console.error("❌", error);
    }
}

export async function putMetadatas(apiBase: string, apiKey: string, identifier: string, metadatas: Record<string, string>[]) {
    const url = `https://${apiBase}/datas/${identifier}`;
    const data = {
        "metas": metadatas
    }

    try {
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "accept": "application/json",
                "X-API-KEY": apiKey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
        });

        return await response.json();
    }
    catch (error) {
        console.error("❌", url, error);
    }
}