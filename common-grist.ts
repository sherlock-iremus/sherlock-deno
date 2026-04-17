export async function fetchRecords(base: string, apiKey: string, docId: string, tableId: string) {
    const url = `${base}/docs/${docId}/tables/${tableId}/records`;
    try {
        const response = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching records: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.records;

    } catch (err) {
        console.error("Fetch failed:", err);
    }
}

export async function writeValueById(gristBaseUri: string, gristApiKey: string, gristDocId: string, gristTable: string, id: string, column: string, value: string) {
    const response = await fetch(
        `${gristBaseUri}/api/docs/${gristDocId}/tables/${gristTable}/records`,
        {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${gristApiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                records: [
                    {
                        id,
                        fields: {
                            [column]: value
                        },
                    },
                ],
            }),
        }
    );

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
}

export async function patchRecord(gristBaseUri: string, gristApiKey: string, gristDocId: string, gristTable: string, body: object) {
    const response = await fetch(
        `${gristBaseUri}/docs/${gristDocId}/tables/${gristTable}/records`,
        {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${gristApiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        }
    );

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
}

export async function describeDoc(gristBaseUri: string, gristApiKey: string, gristDocId: string) {
    const response = await fetch(
        `${gristBaseUri}/docs/${gristDocId}`,
        {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${gristApiKey}`,
                "Content-Type": "application/json",
            }
        }
    );

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
}