export type GristTable = {
    columns: Record<string, GristColumn>,
    data: Record<string, GristRecord>[],
    id: string,
    metadata: { [key: string]: number | boolean | string },
};

export type GristColumn = {
    id: string,
    fields: { [key: string]: number | boolean | string },
}

export type GristRecord = {
    [key: string]: number | boolean | string | null
}