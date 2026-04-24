const fs = require('fs');
const path = require('path');

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

export function saveBookingDetails(detail, test_case_name) {
    const test_name = test_case_name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, ''); 
    const reportsPath = path.resolve(__dirname, '../../reports');
    const allBookingPath = path.join(reportsPath, 'all_booking.json');
    const currentBookingPath = path.join(reportsPath, `${test_name}_lastrun.json`);

    let allBookings = [];

    if (fs.existsSync(allBookingPath)) {
        allBookings = JSON.parse(fs.readFileSync(allBookingPath));
    }

    allBookings.push(detail);
    fs.writeFileSync(allBookingPath, JSON.stringify(allBookings, null, 2));
    fs.writeFileSync(currentBookingPath, JSON.stringify(detail, null, 2));

    return currentBookingPath;
}