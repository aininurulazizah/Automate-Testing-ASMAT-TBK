import { expect } from "@playwright/test";

export class Baraya {

    constructor(page) {

        // General
        this.page = page;

        // Reservation
        this.field_current_month = page.locator('span.kalbulan');
        this.field_current_year = page.locator('span.kaltahun');
        this.field_outlet_keberangkatan = page.locator('span#seloutletasal');
        this.field_outlet_tujuan = page.locator('span#seloutlettujuan');
        this.field_outletplg_keberangkatan = page.locator('span#seloutletasalpulang');
        this.field_outletplg_tujuan = page.locator('span#seloutlettujuanpulang');
        this.list_jam_keberangkatan = page.locator('div.resvlistpilihan');
        this.list_jam_keberangkatanplg = page.locator('#resvshowjadwalpulang .resvlistpilihan');
        this.toggle_pp = page.locator('label:has(input#is_pp_switch2)');
        this.field_tanggal_pulang = page.locator('input#tglpulang');
        this.list_kursi_tersedia = page.locator('div.renderkursikosong:not(.selected)');
        this.field_notelp_pemesan = page.locator('input#telppemesan');
        this.field_nama_pemesan = page.locator('input#namapemesan');
        this.button_action_goshow = page.locator('span#btngoshow');

        // Laporan
        this.field_tahun = page.locator('input#tahun');
        this.button_enter_periode = page.locator('a:text-is("GO!")');
        this.fieldFilter = page.locator('select#filter');
        this.fieldOutlet = page.locator('select#selfilteroutlet');
        this.field_periode_awal = page.locator('input#tgl_mulai'); //Laporan Kota
        this.field_periode_akhir = page.locator('input#tgl_akhir'); //Laporan Kota
        
    }

    getBulan(value) {
        return this.page.locator(`td[onclick*="pilihBulan"]:has-text("${value}")`);
    }

    getTahun(value) {
        return this.page.locator(`td[onclick*="pilihTahun"]:has-text("${value}")`);
    }

    getTanggal(value) {
        return this.page.locator(`td[onclick*="pilihTanggal"]:text-is("${value}")`);
    }

    getOutletKeberangkatan(value) {
        return this.page.locator(`div[onclick*="seloutletasal"]:has-text("${value}")`);
    }

    getOutletTujuan(value) {
        return this.page.locator(`div[onclick*="seloutlettujuan"]:has-text("${value}")`);
    }

    getOutletKeberangkatanPulang(value) {
        return this.page.locator(`div[onclick*="seloutletasalpulang"]:has-text("${value}")`).first();
    }

    getOutletTujuanPulang(value) {
        return this.page.locator(`div[onclick*="seloutlettujuanpulang"]:has-text("${value}")`);
    }

    getMetodePembayaran(value) {
        return this.page.locator(`div.btnjp:has-text("${value}")`);
    }

    getOpsiBulanLaporan(value) {
        return this.page.locator(`a >> font:has-text("${value}")`);
    }

    parseNumber(text) {
        return Number(
            text
                .replace(/[^\d-]/g, '')
                .trim()
        );
    }

    async pilihTanggalBerangkat(value) {
        const [tanggal, bulan, tahun] = value.split(" ");
        await this.field_current_month.click();
        await this.getBulan(bulan).click();
        await this.field_current_year.click();
        await this.getTahun(tahun).click();
        await this.getTanggal(tanggal).click();
    }

    async pilihKeberangkatan(value) {
        await this.field_outlet_keberangkatan.click();
        await this.getOutletKeberangkatan(value).click();
    }

    async pilihTujuan(value) {
        await this.field_outlet_tujuan.click();
        await this.getOutletTujuan(value).click();
    }

    async klikPPToggle() {
        await this.toggle_pp.click();
    }

    async pilihTanggalPulang(value) {
        const [tanggal, bulanText, tahun] = value.split(' ');
        const bulanMap = { Jan: '1', Feb: '2', Mar: '3', Apr: '4', Mei: '5', Jun: '6', Jul: '7', Agu: '8', Sep: '9', Okt: '10', Nov: '11', Des: '12'};
        const bulan = bulanMap[bulanText];
        const posisi_bulan = await this.field_tanggal_pulang.boundingBox(); //Mendapatkan koordinat posisi bulan pada field kalender tanggal pulang
        const posisi_tanggal = {x: posisi_bulan.x + 10, y: posisi_bulan.y}; //Mendapatkan koordinat posisi tanggal pada field kalender tanggal pulang
        await this.page.mouse.click(posisi_bulan.x, posisi_bulan.y); //Klik bagian bulan
        await this.page.keyboard.type(bulan); //Isi bulan
        await this.page.mouse.click(posisi_tanggal.x, posisi_tanggal.y); //Klik bagian tanggal
        await this.page.keyboard.type(tanggal); //Isi tanggal
        await this.field_tanggal_pulang.click(); //Klik field yang mengarah ke bagian tahun
        await this.field_tanggal_pulang.type(tahun); //Isi tahun
    }

    async pilihKeberangkatanPulang(value) {
        await this.field_outletplg_keberangkatan.click();
        await this.getOutletKeberangkatanPulang(value).click();
    }

    async pilihTujuanPulang(value) {
        await this.field_outletplg_tujuan.click();
        await this.getOutletTujuanPulang(value).click();
    }

    async pilihJamKeberangkatan() {
        await this.list_jam_keberangkatan.first().click();
    }

    async pilihJamKeberangkatanPulang() {
        await this.list_jam_keberangkatanplg.first().click();
    }

    async pilihKursi(value) {
        await this.page.waitForTimeout(2000);
        for(let i = 0; i < value; i++) {
            await this.list_kursi_tersedia.nth(i).click();
        }
    }

    async isiDataPemesan(value) {
        await this.field_notelp_pemesan.fill(value.NoHP);
        await this.field_nama_pemesan.click();
        await this.field_nama_pemesan.fill(value.NamaPemesan);
    }

    async pilihMetodeBayar(value) {
        await this.getMetodePembayaran(value).click();
    }

    async cetakTiket() {
        await this.button_action_goshow.click()
    }

    // ==================================== //
    // ============== LAPORAN ============= //
    // ==================================== //

    // ** Pengambilan Data Laporan ** //

    async ambilData(detail, identifiers) {
        await this.page.waitForSelector('table tbody tr');

        const hasSeparatedTable = 
            await this.page.locator('#tableheader').count > 0 && 
            await this.page.locator('#tablecontent').count > 0 //Hasil true/false apakah header dan isi tabel elemennya terpisah atau tidak

        const headerTable = hasSeparatedTable ? this.page.locator('#tableheader') : this.page.locator('table');   //Assign tabel berdasarkan hasSeparatedTable?
        const contentTable = hasSeparatedTable ? this.page.locator('#tablecontent') : this.page.locator('table');

        // Ambil Header
        const headerRows = headerTable.locator('tbody tr'); //Ambil elemen tr (baris) untuk header
        const headerRow1 = headerRows.nth(0); //Ambil elemen baris pertama
        const headerRow2 = headerRows.nth(1); //Ambil elemen baris kedua
        const mainHeaders = await headerRow1.locator('th').all(); //Ambil elemen kolom header di baris pertama sebagai main header
        const subHeaders = await headerRow2.locator('th').allInnerTexts(); //Ambil semua inner text kolom header di baris kedua sebagai subheader
        const keys = [];
        let subIndex = 0;

        for(const th of mainHeaders) {  //Mengisi nama kolom
            const text = (await th.innerText()).trim();
            const colspan = await th.getAttribute('colspan');
            const rowspan = await th.getAttribute('rowspan');
            const baseKey = text.toLowerCase().replace(/[\s\-()]+/g, '_').replace(/^_+|_+$/g, '');
            
            if (text !== '') {
                if (rowspan === '2') {
                    keys.push(baseKey);
                }
    
                if (colspan) {
                    const span = parseInt(colspan);
                    for (let i = 0; i < span; i++) {
                        const sub = subHeaders[subIndex].toLowerCase().replace(/[\s\-()]+/g, '_').replace(/^_+|_+$/g, '');
                        keys.push(`${baseKey}_${sub}`);
                        subIndex++;
                    }
                }
            }
        }

        // Ambil data
        const rows = contentTable.locator('tbody tr'); //Ambil elemen baris untuk body/isi
        const rowCount = await rows.count(); //Hitung jumlah baris
        const startRowIndex = hasSeparatedTable ? 0 : 2;  //Jika header dan isi dipisah maka index penghitung baris dimulai dari 0
        const result = [];

        for (let i = startRowIndex; i < rowCount; i++) { //Untuk setiap baris isi table
            const row = rows.nth(i);
            const col = row.locator('td');
            const colCount = await col.count();
            const isYellow = await row.evaluate(el => el.classList.contains('yellow'));
            const data = {}

            if (!isYellow) {  // Jika baris bukan baris total (ditandai dengan baris kuning)

                for (let j = 0; j < colCount; j++) {  //Untuk setiap kolom di baris tersebut
                    const rawText = (await col.nth(j).innerText()).trim();
    
                    if (keys[j] !== undefined) {
                        if (identifiers.includes(keys[j])) { // Jika kolom identifier
                            data[keys[j]] = rawText;
                        } else {
                            data[keys[j]] = this.parseNumber(rawText);
                        }
                    }
                    
                }

            } else {

                let startTotalIndex = 1;
                for (let j = 0; j < colCount; j++) {
                    if(!identifiers.includes(keys[j]) && keys[j] !== undefined) { //Jika kolom bukan identifier maka masukkan ke total
                        const rawText = (await col.nth(startTotalIndex).innerText()).trim();
                        const totalKey = `Total_${keys[j]}`;
                        data[totalKey] = this.parseNumber(rawText);
                        startTotalIndex++;
                    }
                }

            }

            switch (detail) {
                case "All":
                    result.push(data);
                    break;
            
                case "Harian":
                    if (!isYellow) result.push(data);
                    break;
            
                case "Total":
                    if (isYellow) result.push(data);
                    break;
            }
            
        }

        console.log(`Data ${detail} Yang Diambil : `, result);

        return result;

    }

    async ambilDataHarian(value_identifier) {
        return await this.ambilData("Harian", value_identifier);
    }

    async ambilDataTotal(value_identifier) {
        return await this.ambilData("Total", value_identifier);
    }

    async ambilDataAll(value_identifier) {
        return await this.ambilData("All", value_identifier);
    }

    // ** Filter Laporan ** //

    async pilihTahun(value) {
        await this.field_tahun.fill(value);
    }

    async pilihBulan(value) {
        await this.getOpsiBulanLaporan(value).click();
    }

    async pilihFilter(label) {
        await this.fieldFilter.selectOption({ label });
    }

    async pilihOutlet(label) {
        await this.fieldOutlet.selectOption({ label });
    }

    async pilihPeriodeAwal(value_tahun, value_bulan, value_tanggal) {
        await this.field_periode_awal.click();
        await this.page.locator('a.dp-cal-month').click();
        await this.page.locator(`a.dp-month:has-text("${value_bulan}")`).click();
        await this.page.locator('a.dp-cal-year').click();
        await this.page.locator(`a.dp-year:has-text("${value_tahun}")`).click();
        await this.page.locator(`a.dp-day:text-is("${value_tanggal}")`).first().click();
    }

    async pilihPeriodeAkhir(value_tahun, value_bulan, value_tanggal) {
        await this.field_periode_akhir.click();
        await this.page.locator('a.dp-cal-month').click();
        await this.page.locator(`a.dp-month:has-text("${value_bulan}")`).click();
        await this.page.locator('a.dp-cal-year').click();
        await this.page.locator(`a.dp-year:has-text("${value_tahun}")`).click();
        await this.page.locator(`a.dp-day:text-is("${value_tanggal}")`).click();
    }

    async enter() {
        await this.button_enter_periode.click();
    }

    // ** Laporan Harian ** //

    async hitungTotalPerKategori(values_laporan, object_list, identifier) {
        const result = [];

        for (const value of values_laporan) {  // Untuk setiap baris
            const data = {  //Definisi data pertama diisi dengan id
                id: value[identifier]
            };

            for (const [kategori, koloms] of Object.entries(object_list)) { //Untuk setiap kategori pengeluaran/pendapatan
                let total = 0;

                for (const kolom of koloms) {  //Untuk setiap kolom di dalam setiap kategori
                    total += value[kolom] ?? 0;  //Jumlahkan nilainya
                }

                const key_column = kategori.toLowerCase();

                data[`${key_column}_total`] = total;  //isi kolom yang disesuaikan kategori saat ini
            }

            result.push(data);
        }
        return result;
    }

    async hitungPengeluaran(values_laporan, object_list_pengeluaran, identifier) {
        return await this.hitungTotalPerKategori(values_laporan, object_list_pengeluaran, identifier);
    }

    async hitungPendapatan(values_laporan, object_list_pendapatan, identifier) {
        return await this.hitungTotalPerKategori(values_laporan, object_list_pendapatan, identifier);
    }

    async jumlahTanpaId(row) {
        let total = 0;
    
        for (const [key, value] of Object.entries(row)) {
            if (key !== 'id') {
                total += value ?? 0;
            }
        }
    
        return total;
    }
    
    async hitungLaba(pendapatan_values, pengeluaran_values) {
        const result = [];
    
        for (const pendapatan of pendapatan_values) {
            const total_pendapatan = await this.jumlahTanpaId(pendapatan);
    
            const pengeluaran = pengeluaran_values.find( p => p.id === pendapatan.id);
    
            const total_pengeluaran = pengeluaran
                ? await this.jumlahTanpaId(pengeluaran)
                : 0;
    
            result.push({
                id: pendapatan.id,
                laba: total_pendapatan - total_pengeluaran
            });
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

    async validasiPengeluaran({ actual, expected }) {
        const expected_columns = Object.keys(actual[0]).filter( key => key !== 'id' );

        for (const value of expected) {
            
            for (const col of expected_columns) {
                expect (
                    (actual.find(p => p.id === value.id))[col],
                    `Validasi ${col} pada ${value.id}`
                ).toBe(value[col])
            }

        }
    }

    async validasiLaba({ actual, expected, expected_column }) {

        for (const value of expected) {
            expect (
                (actual.find(p => p.id === value.id))[expected_column],
                `Validasi total laba pada ${value.id}`
            ).toBe(value.laba)
        }
    }

    async validasiTotalPerField(values_from_web, values_from_val) {
        const expected = values_from_val[0]; //Karena values bentuknya array diambil elemen pertama
        const actual = values_from_web[0]; //Selalu elemen pertama karena data total ini hanya list dengan satu object
        
        for (const key of Object.keys(expected)) {

            expect (
                actual[key],
                `Validasi ${key}`
            ).toBe(expected[key]);

        }
    }


}