import { expect } from "@playwright/test";

export class Laporan {

    constructor(page, objectPage) {

        this.object = new objectPage(page);

    }

    //======= Main Function =======//

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

    async hitungTotalLabaPerBaris (laporan, identifier, kolomPendapatan, kolomPengeluaran) {
        let result = [];
        let total_pendapatan_perkategori = await this.hitungTotalPerkategori(laporan, identifier, kolomPendapatan);
        let total_pengeluaran_perkategori = await this.hitungTotalPerkategori(laporan, identifier, kolomPengeluaran);
        let list_total_pendapatan = await this.hitungTotalGabunganKategori(total_pendapatan_perkategori, 'total_pendapatan');
        let list_total_pengeluaran = await this.hitungTotalGabunganKategori(total_pengeluaran_perkategori, 'total_pengeluaran');
        
        for (const pendapatan of list_total_pendapatan) {
            const current_pendapatan = pendapatan.total_pendapatan;
            const pengeluaran = list_total_pengeluaran.find(p => p.id === pendapatan.id);
            const current_pengeluaran = pengeluaran.total_pengeluaran;

            result.push({
                id : pendapatan.id,
                total_laba : current_pendapatan - current_pengeluaran
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

    //======= Steps Function =======//

    async ambilTotalBiayaOpPerhari (laporan, identifier, kolomTotalBiayaOp) {
        return this.ambilTotalPerIdentifier(laporan, identifier, kolomTotalBiayaOp);
    }

    async ambilTotalKomisiPerhari (laporan, identifier, kolomTotalKomisi) {
        return this.ambilTotalPerIdentifier(laporan, identifier, kolomTotalKomisi);
    }

    async ambilTotalLabaPerhari (laporan, identifier, kolomTotalLaba) {
        return this.ambilTotalPerIdentifier(laporan, identifier, kolomTotalLaba);
    }

    async hitungTotalBiayaOpPerhari (laporan, identifier, listKolomBiayaOp, kolomTotalBiayaOp) {
        return this.hitungTotalPerIdentifier(laporan, identifier, listKolomBiayaOp, kolomTotalBiayaOp);
    }

    async hitungTotalKomisiPerhari (laporan, identifier, listKolomKomisi, kolomTotalKomisi) {
        return this.hitungTotalPerIdentifier(laporan, identifier, listKolomKomisi, kolomTotalKomisi);
    }

    async ambilTotalBiayaOpPerkota (laporan, identifier, kolomTotalBiayaOp) {
        return this.ambilTotalPerIdentifier(laporan, identifier, kolomTotalBiayaOp);
    }

    async ambilTotalKomisiPerkota (laporan, identifier, kolomTotalKomisi) {
        return this.ambilTotalPerIdentifier(laporan, identifier, kolomTotalKomisi);
    }

    async ambilTotalLabaPerkota (laporan, identifier, kolomTotalLaba) {
        return this.ambilTotalPerIdentifier(laporan, identifier, kolomTotalLaba);
    }

    async hitungTotalBiayaOpPerkota (laporan, identifier, listKolomBiayaOp, kolomTotalBiayaOp) {
        return this.hitungTotalPerIdentifier(laporan, identifier, listKolomBiayaOp, kolomTotalBiayaOp);
    }

    async hitungTotalLabaPerkota (laporan, identifier, kolomPendapatan, kolomPengeluaran) {
        return this.hitungTotalLabaPerIdentifier(laporan, identifier, kolomPendapatan, kolomPengeluaran);
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