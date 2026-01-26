import { expect } from "@playwright/test";
import { throws } from "assert";

export class Btm{

    constructor(page) {

        // General
        this.page = page;

        // Reservation
        this.field_current_month = page.locator('span.kalbulan');
        this.field_current_year = page.locator('span.kaltahun');
        this.field_outlet_keberangkatan = page.locator('span#seloutletasal');
        this.field_outlet_tujuan = page.locator('span#seloutlettujuan');
        this.field_rute_connecting = page.locator('span#seljenisrute');
        this.list_rute_connecting = page.locator('div#listcontent');
        this.list_jam_keberangkatan = page.locator('div.resvlistpilihan');
        this.list_next_jam_keberangkatan = page.locator('div#resvshowkeberangkatan_1 >> div.resvlistpilihansel');
        this.tab_next_jam_keberangkatan = page.locator('span#btnruteconnecting_1');
        this.list_kursi_tersedia = page.locator('div.renderlabelkursikosong');
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

    getMetodePembayaran(value) {
        return this.page.locator(`div.btnroundjplabel:has-text("${value}")`);
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


    // ==================================== //
    // ============ RESERVASI ============= //
    // ==================================== //

    async pilihTanggalBerangkat(value) {
        const [tanggal, bulan, tahun] = value.split(" "); // Memisahkan tanggal, bulan, tahun
        await this.field_current_month.click(); // Klik field bulan
        await this.getBulan(bulan).click(); // PIlih bulan
        await this.field_current_year.click(); // Klik field tahun
        await this.getTahun(tahun).click(); // Pilih tahun
        await this.getTanggal(tanggal).click(); // Langsung pilih tanggal
    }

    async pilihKeberangkatan(value) {
        await this.field_outlet_keberangkatan.click();
        await this.getOutletKeberangkatan(value).click();
    }

    async pilihTujuan(value) {
        await this.field_outlet_tujuan.click();
        await this.getOutletTujuan(value).click();
    }

    async pilihRute() {
        await this.field_rute_connecting.click();
        await this.list_rute_connecting.first().click();
    }

    async pilihJamKeberangkatan() {
        await this.list_jam_keberangkatan.first().click();
    }

    async pilihNextJamKeberangkatan() {
        await this.tab_next_jam_keberangkatan.click();
        await this.list_next_jam_keberangkatan.first().click();
    }

    async pilihKursi(value) {
        await this.page.waitForTimeout(2000);
        for(let i = 0; i < value; i++){
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

    async cetakTiket() {  //Sementara: bisa diganti aksi yang bisa custom/menyesuaikan metode bayar 
        await this.button_action_goshow.click();
    }


    // ==================================== //
    // ========== LAPORAN HARIAN ========== //
    // ==================================== //

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

    async enter() {
        await this.button_enter_periode.click();
    }

    async ambilData(detail) {
        await this.page.waitForSelector('table tbody tr', {timeout: 2000});

        // Ambil Header
        const headerRows = this.page.locator('table tbody tr'); //Ambil elemen tr (baris)
        const headerRow1 = headerRows.nth(0); //Ambil elemen baris pertama
        const headerRow2 = headerRows.nth(1); //Ambil elemen baris kedua
        const mainHeaders = await headerRow1.locator('th').all(); //Ambil elemen kolom header di baris pertama sebagai main header
        const subHeaders = await headerRow2.locator('th').allInnerTexts(); //Ambil semua inner text kolom header di baris kedua sebagai subheader
        const keys = [];
        let subIndex = 0;

        for(const th of mainHeaders) {
            const text = (await th.innerText()).trim();
            const colspan = await th.getAttribute('colspan');
            const rowspan = await th.getAttribute('rowspan');
            const baseKey = text.toLowerCase().replace(/\s+/g, '_');
            
            if (rowspan === '2') {
                keys.push(baseKey);
            }

            if (colspan) {
                const span = parseInt(colspan);
                for (let i = 0; i < span; i++) {
                    const sub = subHeaders[subIndex].toLowerCase().replace(/\s+/g, '_');
                    keys.push(`${baseKey}_${sub}`);
                    subIndex++;
                }
            }
        }

        // Ambil data
        const rowCount = await headerRows.count();
        const result = [];

        for (let i = 2; i < rowCount; i++) {
            const row = headerRows.nth(i);
            const col = row.locator('td');
            const isYellow = await row.evaluate(el => el.classList.contains('yellow'));
            const data = {}

            if (!isYellow) {
                for (let j = 0; j < keys.length; j++) {
                    const rawText = (await col.nth(j).innerText()).trim();
    
                    if(j === 0) {
                        data[keys[j]] = rawText;
                    } else {
                        data[keys[j]] = this.parseNumber(rawText);
                    }
                    
                }
            } else {
                data[keys[0]] = 'TOTAL';

                console.log("keys.length : ", keys.length);

                for (let j = 1; j < keys.length; j++) {
                    console.log("current j = ", j);
                    const rawText = (await col.nth(j).innerText()).trim();
                    const totalKey = `Total_${keys[j]}`;
                    data[totalKey] = this.parseNumber(rawText);
                }

                delete data[Object.keys(data)[0]];
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

    async ambilDataHarian() {
        return await this.ambilData("Harian");
    }

    async ambilDataTotal() {
        return await this.ambilData("Total");
    }

    async ambilDataAll() {
        return await this.ambilData("All");
    }

    async hitungPendapatan(values) {
        const result  = [];
        const list_pendapatan = [ //Jika ada kolom baru tambahkan nama kolom yang termasuk ke dalam pendapatan ke list ini
            'penjualan_tiket',
            'penjualan_paket'
        ];

        for (const value of values) {
            let total_pendapatan = 0;
            
            for (const key of list_pendapatan) {
                total_pendapatan += value[key] ?? 0;
            }

            const data = {
                id_tanggal  : value.tanggal,
                pendapatan  : total_pendapatan
            };

            result.push(data);
        }
        return result;
    }

    async hitungPengeluaran(values) {
        const result = [];
        const list_pengeluaran = [ //Jika ada kolom baru tambahkan nama kolom yang termasuk ke dalam pengeluaran ke list ini
            'biaya_op_test',
            'biaya_op_bbm_cash',
            'biaya_op_bbm_emoney',
            'biaya_op_etoll',
            'biaya_op_op_freelance',
            'biaya_op_op_karyawan',
        ]

        for (const value of values) {
            let total_pengeluaran = 0;

            for (const key of list_pengeluaran) {
                total_pengeluaran += value[key] ?? 0;
            }

            const data = {
                id_tanggal  : value.tanggal,
                pengeluaran : total_pengeluaran
            }

            result.push(data);
        }
        return result;
    }

    async hitungLaba(pendapatan_values, pengeluaran_values) {
        const result = [];

        for(const value of pendapatan_values) {

            const data = {
                id_tanggal  : value.id_tanggal,
                laba        : value.pendapatan - (pengeluaran_values.find(p => p.id_tanggal === value.id_tanggal).pengeluaran )
            }

            result.push(data);

        }
        return result;
    }

    async hitungTotalPerField(values) {
        let temp_koloms = Object.keys(values[0]); // Ambil salah satu object untuk diambil nama kolomnya
        let result = [];
        let result_temp = {};
        for (const temp_kolom of temp_koloms) { // Pembuatan kolom temporari untuk setiap kolom
            if (temp_kolom !== 'tanggal') {
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
        console.log('hasil semua total : ', result);
        return result;
    }

    async validasiPengeluaran(values_laporan, values_pengeluaran_val) {
        for (const value of values_pengeluaran_val) {
            expect (
                (values_laporan.find(p => p.tanggal === value.id_tanggal)).biaya_op_total,
                `Validasi total pengeluaran pada tanggal ${value.id_tanggal}`
            ).toBe(value.pengeluaran)
        }
    }

    async validasiLaba(values_laporan, values_laba_val) {
        for (const value of values_laba_val) {
            expect (
                (values_laporan.find(p => p.tanggal === value.id_tanggal)).total_laba,
                `Validasi total laba pada tanggal ${value.id_tanggal}`
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


    // ==================================== //
    // =========== LAPORAN KOTA =========== //
    // ==================================== //

    async pilihPeriodeAwal(value_tahun, value_bulan, value_tanggal) {
        await this.field_periode_awal.click();
        await this.page.locator('.dp-cal-month').click();
        await this.page.locator(`a.dp-month:has-text("${value_bulan}")`).click();
        await this.page.locator('.dp-cal-year').click();
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

    async ambilData_reportByKota() {
        await this.page.waitForSelector('table tbody tr', {timeout: 2000});
        const rows = this.page.locator('table tbody tr');
        const rowCount = await rows.count() - 1;
        const result = [];

        for (let i = 2; i < rowCount; i++) {
            const row = rows.nth(i);
            const col = row.locator('td');
            
            const data = {
                kota                : (await col.nth(1).innerText()).trim(),
                jumlah_tiket        : this.parseRupiah(await col.nth(2).innerText()),
                penjualan_tiket     : this.parseRupiah(await col.nth(3).innerText()),
                jumlah_paket        : this.parseRupiah(await col.nth(4).innerText()),
                penjualan_paket     : this.parseRupiah(await col.nth(5).innerText()),
                jumlah_charter      : this.parseRupiah(await col.nth(6).innerText()),
                penjualan_charter   : this.parseRupiah(await col.nth(7).innerText()),
                op_test             : this.parseRupiah(await col.nth(8).innerText()),
                op_bbm_cash         : this.parseRupiah(await col.nth(9).innerText()),
                op_bbm_emoney       : this.parseRupiah(await col.nth(10).innerText()),
                op_etoll            : this.parseRupiah(await col.nth(11).innerText()),
                op_freelance        : this.parseRupiah(await col.nth(12).innerText()),
                op_karyawan         : this.parseRupiah(await col.nth(13).innerText()),
                op_total            : this.parseRupiah(await col.nth(14).innerText()),
                laba                : this.parseRupiah(await col.nth(15).innerText())
            };

            result.push(data);
        }

        // console.log('Data Harian : ', result);

        return result;
    }

    async ambilDataTotal_reportByKota() {
        await this.page.waitForSelector('table tbody tr', {timeout: 2000});
        const rows = this.page.locator('table tbody tr');
        const row_total = rows.last();
        const col_total = row_total.locator('td');
        const result =  {
            total_jumlah_tiket      : this.parseRupiah(await col_total.nth(1).innerText()),
            total_penjualan_tiket   : this.parseRupiah(await col_total.nth(2).innerText()),
            total_jumlah_paket      : this.parseRupiah(await col_total.nth(3).innerText()),
            total_penjualan_paket   : this.parseRupiah(await col_total.nth(4).innerText()),
            total_jumlah_charter    : this.parseRupiah(await col_total.nth(5).innerText()),
            total_penjualan_charter : this.parseRupiah(await col_total.nth(6).innerText()),
            total_op_test           : this.parseRupiah(await col_total.nth(7).innerText()),
            total_op_bbm_cash       : this.parseRupiah(await col_total.nth(8).innerText()),
            total_op_bbm_emoney     : this.parseRupiah(await col_total.nth(9).innerText()),
            total_op_etoll          : this.parseRupiah(await col_total.nth(10).innerText()),
            total_op_freelance      : this.parseRupiah(await col_total.nth(11).innerText()),
            total_op_karyawan       : this.parseRupiah(await col_total.nth(12).innerText()),
            total_op_keseluruhan    : this.parseRupiah(await col_total.nth(13).innerText()),
            total_laba              : this.parseRupiah(await col_total.nth(14).innerText())
        }

        // console.log('Data Total : ', result);

        return result;

    }

    async ambilDataAll_reportByKota() {
        const result = await this.ambilData_reportByKota();
        const result_total = await this.ambilDataTotal_reportByKota();
        result.push(result_total);
        // console.log('Data All : ', result);
        return result;
    }

    async hitungPendapatan_reportByKota(values) {
        const result  = [];

        for (const value of values) {

            const data = {
                kota  : await value.kota,
                pendapatan  : await value.penjualan_tiket + value.penjualan_paket + value.penjualan_charter
            };

            result.push(data);
        }
        return result;
    }

    async hitungPengeluaran_reportByKota(values) {
        const result = [];

        for (const value of values) {

            const data = {
                kota  : await value.kota,
                pengeluaran : await value.op_test + value.op_bbm_cash + value.op_bbm_emoney + value.op_etoll + value.op_freelance + value.op_karyawan
            }

            result.push(data);
        }
        return result;
    }

    async hitungLaba_reportByKota(pendapatan_values, pengeluaran_values) {
        const result = [];

        for(const value of pendapatan_values) {

            const data = {
                kota  : await value.kota,
                laba        : await value.pendapatan - (pengeluaran_values.find(p => p.kota === value.kota).pengeluaran )
            }

            result.push(data);

        }
        return result;
    }

    async validasiPengeluaran_reportByKota(values_laporan, values_pengeluaran_val) {
        for (const value of values_pengeluaran_val) {
            expect (
                (values_laporan.find(p => p.kota === value.kota)).op_total,
                `Validasi total pengeluaran pada kota ${value.kota}`
            ).toBe(value.pengeluaran)
        }
    }

    async validasiLaba_reportByKota(values_laporan, values_laba_val) {
        for (const value of values_laba_val) {
            expect (
                (values_laporan.find(p => p.kota === value.kota)).laba,
                `Validasi total laba pada kota ${value.kota}`
            ).toBe(value.laba)
        }
    }

    async hitungTotalPerField_reportByKota(values) {
        let result = [];
        let temp_total_jumlah_tiket = 0;
        let temp_total_penjualan_tiket = 0;
        let temp_total_jumlah_paket = 0;
        let temp_total_penjualan_paket = 0;
        let temp_total_jumlah_charter = 0;
        let temp_total_penjualan_charter = 0;
        let temp_total_op_test = 0;
        let temp_total_op_bbm_cash = 0;
        let temp_total_op_bbm_emoney = 0;
        let temp_total_op_etoll = 0;
        let temp_total_op_freelance = 0;
        let temp_total_op_karyawan = 0;
        let temp_total_op_keseluruhan = 0;
        let temp_total_laba = 0;

        for(const value of values) {

            temp_total_jumlah_tiket      = temp_total_jumlah_tiket + value.jumlah_tiket;
            temp_total_penjualan_tiket   = temp_total_penjualan_tiket + value.penjualan_tiket;
            temp_total_jumlah_paket      = temp_total_jumlah_paket + value.jumlah_paket;
            temp_total_penjualan_paket   = temp_total_penjualan_paket + value.penjualan_paket;
            temp_total_jumlah_charter    = temp_total_jumlah_charter + value.jumlah_charter;
            temp_total_penjualan_charter = temp_total_penjualan_charter + value.penjualan_charter;
            temp_total_op_test           = temp_total_op_test + value.op_test;
            temp_total_op_bbm_cash       = temp_total_op_bbm_cash + value.op_bbm_cash;
            temp_total_op_bbm_emoney     = temp_total_op_bbm_emoney + value.op_bbm_emoney;
            temp_total_op_etoll          = temp_total_op_etoll + value.op_etoll;
            temp_total_op_freelance      = temp_total_op_freelance + value.op_freelance;
            temp_total_op_karyawan       = temp_total_op_karyawan + value.op_karyawan;
            temp_total_op_keseluruhan    = temp_total_op_keseluruhan + value.op_total;
            temp_total_laba              = temp_total_laba + value.laba
        
            result = {
                total_jumlah_tiket      : temp_total_jumlah_tiket,
                total_penjualan_tiket   : temp_total_penjualan_tiket,
                total_jumlah_paket      : temp_total_jumlah_paket,
                total_penjualan_paket   : temp_total_penjualan_paket,
                total_jumlah_charter    : temp_total_jumlah_charter,
                total_penjualan_charter : temp_total_penjualan_charter,
                total_op_test           : temp_total_op_test,
                total_op_bbm_cash       : temp_total_op_bbm_cash,
                total_op_bbm_emoney     : temp_total_op_bbm_emoney,
                total_op_etoll          : temp_total_op_etoll,
                total_op_freelance      : temp_total_op_freelance,
                total_op_karyawan       : temp_total_op_karyawan,
                total_op_keseluruhan    : temp_total_op_keseluruhan,
                total_laba              : temp_total_laba
            }

        }
        // console.log('hasil semua total : ', result)
        return result;
    }

    async validasiTotalPerField_reportByKota(values_from_web, values_from_val) {
        for (const [key, value] of Object.entries(values_from_web)) {

            expect (
                (value),
                `Validasi ${key}`
            ).toBe(values_from_val[key])

        }
    }

}