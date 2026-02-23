import { expect } from "@playwright/test";

export class Laporan {

    constructor(page, objectPage) {

        this.object = new objectPage(page);

    }

    //======= Steps =======//

    async ambilTotalPerBaris (laporan, identifier, kolomTotal) {

        return laporan.map((row) => {
            const result = { 
                id              : row[identifier],
                [kolomTotal]    : row[kolomTotal] 
            };
          
            return result;
        })
    }

    async hitungTotalPerBaris (laporan, identifier, listKolom, namaKolomTotal) {

        return laporan.map((row) => {
            let total = 0;

            const result = {
                id: row[identifier]
            }

            for (const column of listKolom) {
                total += row[column] ?? 0;
            }

            result[namaKolomTotal] = total;

            return result;
       })

    }

    async hitungTotalPerkategori(laporan, identifier, listKolomKategori) {
        let result = {};

        for (const [key, value] of Object.entries(listKolomKategori)) {

            result[key] = laporan.map((row) => {
                let total = 0;
    
                for (const column of value) {
                    total += row[column] ?? 0;
                }
    
                return {
                    id : row[identifier],
                    [`${key.toLowerCase()}_total`] : total
                };
            });
        }

        return result;
    }

    async ambilGabunganKategori (data) {
        const map = new Map();

        for (const kategori of Object.values(data)) {
            
            for (const row of kategori) {
                const id = row.id;

                if (!map.has(id)) {
                    map.set(id, {id});
                }

                const target = map.get(id);

                for (const [key, value] of Object.entries(row)) {
                    if (key !== 'id') {
                        target[key] = value;
                    }
                }
            }
        }

        return Array.from(map.values());
    }

    async hitungTotalGabunganKategori (data, namaKolom) {
        let result = [];
        const gabunganKategori = await this.ambilGabunganKategori(data);

        for (const row of gabunganKategori) {
            let total = 0

            for (const [key, value] of Object.entries(row)) {
                if (key !== 'id') {
                    total += value?? 0;
                }
            }

            result.push({
                id          : row.id,
                [namaKolom] : total
            })
        }

        return result
    }

    async hitungSelisihKategori (laporan, identifier, subBase, subPengurang, namaKolom) {
        let result = [];
        let total_base_perkategori = await this.hitungTotalPerkategori(laporan, identifier, subBase);
        let total_pengurang_perkategori = await this.hitungTotalPerkategori(laporan, identifier, subPengurang);
        let list_total_base = await this.hitungTotalGabunganKategori(total_base_perkategori, 'total_base');
        let list_total_pengurang = await this.hitungTotalGabunganKategori(total_pengurang_perkategori, 'total_pengurang');
        
        for (const base of list_total_base) {
            const current_base = base.total_base;
            const pengurang = list_total_pengurang.find(p => p.id === base.id);
            const current_pengurang = pengurang.total_pengurang;

            result.push({
                id : base.id,
                [namaKolom] : current_base - current_pengurang
            })
        }

        return result;
    }

    async hitungAveragePerBaris(laporan, identifier, subBase, subPembagi, namaKolom) {
        let result = [];

        for (const data of laporan) {
            const current_base = data[subBase];
            const current_pembagi = data[subPembagi];
            const avg = current_pembagi === 0 ? 0 : Math.round((current_base / current_pembagi) * 10) / 10

            result.push({
                id : data[identifier],
                [namaKolom] : avg
            })
        }

        return result;
    }

    async hitungTotalPerField(values, identifiers) {
        let temp_koloms = Object.keys(values[0]); // Ambil salah satu object untuk diambil nama kolomnya
        let result = [];
        let result_temp = {};

        for (const temp_kolom of temp_koloms) { // Pembuatan kolom temporari untuk setiap kolom
            if (!identifiers.includes(temp_kolom)) {
                result_temp[`Total_${temp_kolom}`] = 0;
            }
        }

        for(const value of values) { // Untuk setiap baris

            for(const [key, value_temp] of Object.entries(result_temp)) { // Untuk setiap kolom dalam satu baris
                const kolom_non_temp = key.replace('Total_', ''); // Dari nama kolom temporari menjadi nama kolom asli
                result_temp[key] = value_temp + value[kolom_non_temp]; // Penambahan nilai dari kolom temporari dengan nilai dari kolom saat ini
            }

        }

        result.push(result_temp);

        return result;
    }


    //======= Validations =======//

    async validasiArrayOfObject (actual, expected, expected_column) {
        for (const row of expected) {
            expect (
                (actual.find(p => p.id == row.id))[expected_column],
                `Validasi ${expected_column} pada ${row.id}`
            ).toBe(row[expected_column]);
        }
    }

    async validasiArrayOfObjectDiffExpectedCol (actual, expected, actual_column, expected_column) {
        for (const row of expected) {
            expect (
                (actual.find(p => p.id == row.id))[actual_column],
                `Validasi ${expected_column} pada ${row.id}`
            ).toBe(row[expected_column]);
        }
    }

    async validasiArrayOfSingleObject(actual, expected) {
        const actual_value = actual[0]; //Karena values bentuknya array diambil elemen pertama 
        const expected_value = expected[0]; //Selalu elemen pertama karena data total ini hanya list dengan satu object
        
        for (const key of Object.keys(expected_value)) {
            expect (
                actual_value[key],
                `Validasi ${key}`
            ).toBe(expected_value[key]);

        }
    }

}