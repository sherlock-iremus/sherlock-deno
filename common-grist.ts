export async function fetchRecords(gristBaseUri: string, gristApiKey: string, gristDocId: string, gristTable: string,) {
    const response = await fetch(
        `${gristBaseUri}/api/docs/${gristDocId}/tables/${gristTable}/records`,
        {
            headers: {
                Authorization: `Bearer ${gristApiKey}`,
                "Content-Type": "application/json",
            }
        });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const responseJson = await response.json();
    const records = responseJson["records"];

    return records;
}

export async function writeValue(gristBaseUri: string, gristApiKey: string, gristDocId: string, gristTable: string, id: string, column: string, value: string) {
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