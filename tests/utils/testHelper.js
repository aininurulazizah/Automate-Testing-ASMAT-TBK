export function normalizeColumnToList(columnToNormalize) {
    if (Array.isArray(columnToNormalize)) {
        return columnToNormalize;
    }

    if (typeof columnToNormalize === 'object' && columnToNormalize !== null) {
        return Object.values(columnToNormalize).flat();
    }

    throw new Error('Format Kolom tidak valid');
}

export function normalizeObjectKeyToList(objectKeyToNormalize) {
    let normalized_list = [];

    for (const key of Object.keys(objectKeyToNormalize)){
      normalized_list.push(`${key.toLowerCase()}`);
    }

    return normalized_list;

}