import { expect } from "@playwright/test";

export class Jackal {

    constructor(page) {

        // General
        this.page = page;

        // Reservation
        this.field_current_month = page.locator('span.kalbulan');
        this.field_current_year = page.locator('span.kaltahun');
        this.field_outlet_keberangkatan = page.locator('span#seloutletasal');
        this.field_outlet_tujuan = page.locator('span#seloutlettujuan');
        this.field_outletplg_keberangkatan = page.locator('span#seloutletasalpulang');
        this.field_outletplg_tujuan = page.locator('seloutlettujuanpulang');
        this.list_jam_keberangkatan = page.locator('div.resvlistpilihan');
        this.list_jam_keberangkatanplg = page.locator('#resvshowjadwalpulang .resvlistpilihan');
        this.toggle_pp = page.locator('label:has(input#is_pp_switch2)');
        this.field_tanggal_pulang = page.locator('input#tglpulang');
        this.list_kursi_tersedia = page.locator('div.renderlabelkursikosong');
        this.field_notelp_pemesan = page.locator('input#telppemesan');
        this.field_nama_pemesan = page.locator('input#namapemesan');
        this.button_action_goshow = page.locator('span#btngoshow');

        // Laporam
        this.field_tahun = page.locator('input#tahun');
        this.button_enter_periode = page.locator('a:text-is("GO!")');
        this.fieldFilter = page.locator('select#filter');
        this.fieldOutlet = page.locator('select#selfilteroutlet');
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
        return this.page.locator(`div[onclick*="seloutletasalpulang"]:has-text("${value}")`);
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

    parseRupiah(text) {
        return Number (
            text.replace(/Rp\.?/g, '')
            .replace(/\./g, '')
            .replace(/,/g, '')
            .trim()
        )
    }

    parseKg(text) {
        return Number (
            text.replace(/kg/i, '')
            .replace(/\./g, '')
            .replace(/,/g, '')
            .trim()
        )
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
        await this.getOutletKeberangkatan(value).first().click();
    }

    async pilihTujuan(value) {
        await this.field_outlet_tujuan.click();
        await this.getOutletTujuan(value).first().click();
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
        // lokasi keberangkatan pulang auto dipilih di sistem
    }

    async pilihTujuanPulang(value) {
        // tujuan pulang auto dipilih di sistem
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
        await this.button_action_goshow.click();
    }

    // Laporan

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

    async ambilData() {
        await this.page.waitForSelector('table tbody tr', {timeout: 1000});
        const rows = this.page.locator('table tbody tr');
        const rowCount = await rows.count() - 1;
        const result = [];

        for (let i = 2; i < rowCount; i++) {
            const row = rows.nth(i);
            const col = row.locator('td');
            
            const data = {
                tanggal         : (await col.nth(0).innerText()).trim(),
                jumlah_tiket    : Number((await col.nth(1).innerText()).trim()),
                penjualan_tiket : this.parseRupiah(await col.nth(2).innerText()),
                jumlah_paket    : Number((await col.nth(3).innerText()).trim()),
                berat_paket     : this.parseKg(await col.nth(4).innerText()),
                penjualan_paket : this.parseRupiah(await col.nth(5).innerText()),
                op_bbm          : this.parseRupiah(await col.nth(6).innerText()),
                op_driver        : this.parseRupiah(await col.nth(7).innerText()),
                op_tol          : this.parseRupiah(await col.nth(8).innerText()),
                op_total        : this.parseRupiah(await col.nth(9).innerText()),
                laba            : this.parseRupiah(await col.nth(10).innerText())
            };

            result.push(data);
        }

        // console.log('Data Harian : ', result);

        return result;
    }

    async ambilDataTotal() {
        await this.page.waitForSelector('table tbody tr', {timeout: 1000});
        const rows = this.page.locator('table tbody tr');
        const row_total = rows.last();
        const col_total = row_total.locator('td');
        const result =  {
            total_jumlah_tiket    : Number((await col_total.nth(1).innerText()).trim()),
            total_penjualan_tiket : this.parseRupiah(await col_total.nth(2).innerText()),
            total_jumlah_paket    : Number((await col_total.nth(3).innerText()).trim()),
            total_berat_paket     : this.parseKg(await col_total.nth(4).innerText()),
            total_penjualan_paket : this.parseRupiah(await col_total.nth(5).innerText()),
            total_op_bbm          : this.parseRupiah(await col_total.nth(6).innerText()),
            total_op_driver        : this.parseRupiah(await col_total.nth(7).innerText()),
            total_op_tol          : this.parseRupiah(await col_total.nth(8).innerText()),
            total_op_keseluruhan  : this.parseRupiah(await col_total.nth(9).innerText()),
            total_laba            : this.parseRupiah(await col_total.nth(10).innerText())
        }

        // console.log('Data Total : ', result);

        return result;
    }

    async ambilDataAll() {
        const result = await this.ambilData();
        const result_total = await this.ambilDataTotal();
        result.push(result_total);
        // console.log('Data All : ', result);
        return result;
    }

    async hitungPendapatan(values) {
        const result = [];

        for (const value of values) {

            const data = {
                id_tanggal : await value.tanggal,
                pendapatan : await value.penjualan_tiket + value.penjualan_paket
            };

            result.push(data);

        }
        return result;
    }

    async hitungPengeluaran(values) {
        const result = [];

        for (const value of values) {

            const data = {
                id_tanggal  : await value.tanggal,
                pengeluaran : await value.op_bbm + value.op_driver + value.op_tol
            }

            result.push(data);
        }
        return result;
    }

    async hitungLaba(pendapatan_values, pengeluaran_values) {
        const result = [];

        for(const value of pendapatan_values) {

            const data = {
                id_tanggal  : await value.id_tanggal,
                laba        : await value.pendapatan - (pengeluaran_values.find(p => p.id_tanggal === value.id_tanggal).pengeluaran )
            }

            result.push(data);

        }
        return result;
    }

    async validasiPengeluaran(values_from_web, values_from_val) {
        for (const value of values_from_val) {
            expect (
                (values_from_web.find(p => p.tanggal === value.id_tanggal)).op_total,
                `Validasi total pengeluaran pada tanggal ${value.id_tanggal}`
            ).toBe(value.pengeluaran)
        }
    }

    async validasiLaba(values_from_web, values_from_val) {
        for (const value of values_from_val) {
            expect (
                (values_from_web.find(p => p.tanggal === value.id_tanggal)).laba,
                `Validasi total laba pada tanggal ${value.id_tanggal}`
            ).toBe(value.laba)
        }
    }

    async hitungTotalPerField(values) {
        let result = [];
        let temp_total_jumlah_tiket    = 0;
        let temp_total_penjualan_tiket = 0;
        let temp_total_jumlah_paket    = 0;
        let temp_total_berat_paket     = 0;
        let temp_total_penjualan_paket = 0;
        let temp_total_op_bbm          = 0;
        let temp_total_op_driver       = 0;
        let temp_total_op_tol          = 0;
        let temp_total_op_keseluruhan  = 0;
        let temp_total_laba            = 0;

        for (const value of values) {
            temp_total_jumlah_tiket    = temp_total_jumlah_tiket + value.jumlah_tiket;
            temp_total_penjualan_tiket = temp_total_penjualan_tiket + value.penjualan_tiket;
            temp_total_jumlah_paket    = temp_total_jumlah_paket + value.jumlah_paket;
            temp_total_berat_paket     = temp_total_berat_paket + value.berat_paket;
            temp_total_penjualan_paket = temp_total_penjualan_paket + value.penjualan_paket;
            temp_total_op_bbm          = temp_total_op_bbm + value.op_bbm;
            temp_total_op_driver       = temp_total_op_driver + value.op_driver;
            temp_total_op_tol          = temp_total_op_tol + value.op_tol;
            temp_total_op_keseluruhan  = temp_total_op_keseluruhan + value.op_total;
            temp_total_laba            = temp_total_laba + value.laba;
        }

        result = {
            total_jumlah_tiket      : temp_total_jumlah_tiket,
            total_penjualan_tiket   : temp_total_penjualan_tiket,
            total_jumlah_paket      : temp_total_jumlah_paket,   
            total_berat_paket       : temp_total_berat_paket,
            total_penjualan_paket   : temp_total_penjualan_paket,
            total_op_bbm            : temp_total_op_bbm,     
            total_op_driver         : temp_total_op_driver, 
            total_op_tol            : temp_total_op_tol,
            total_op_keseluruhan    : temp_total_op_keseluruhan,
            total_laba              : temp_total_laba 
        }

        // console.log('hasil semua total : ', result);
        return result;
    }

    async validasiTotalPerField(values_from_web, values_from_val) {
        for (const [key, value] of Object.entries(values_from_web)) {

            expect (
                (value),
                `Validasi ${key}`
            ).toBe(values_from_val[key])

        }
    }

}