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

    async ambilData(detail) {
        await this.page.waitForSelector('table tbody tr', {timeout: 1000});

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

                for (let j = 1; j < keys.length; j++) {
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
            'biaya_op_bbm',
            'biaya_op_premi_driver',
            'biaya_op_toll'
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

}