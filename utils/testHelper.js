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
      normalized_list.push(`${key.toLowerCase()}_total`);
    }

    return normalized_list;

}

// function jumlahkanNilai(obj, excludeKeys = ['id']) {
//     return Object.entries(obj)
//         .filter(([key]) => !excludeKeys.includes(key))
//         .reduce((total, [, value]) => total + (value ?? 0), 0);
// }

