import { expect } from "@playwright/test"

export class Aragon {

    constructor(page) {

        // General
        this.page = page;

        // Reservation
        this.field_current_month = page.locator('span.kalbulan');
        this.field_current_year = page.locator('span.kaltahun');
        this.field_outlet_keberangkatan = page.locator('span#seloutletasal');
        this.field_outlet_tujuan = page.locator('span#seloutlettujuan');
        this.list_jam_keberangkatan = page.locator('div.resvlistpilihan');
        this.list_kursi_tersedia = page.locator('div.renderlabelkursikosong');
        this.field_notelp_pemesan = page.locator('input#telppemesan');
        this.field_nama_pemesan = page.locator('input#namapemesan');
        this.button_action_goshow = page.locator('span#btngoshow');

        // Laporan
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

    async pilihJamKeberangkatan() {
        await this.list_jam_keberangkatan.first().click();
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

    async ambilData(detail, identifiers) {
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
            const baseKey = text.toLowerCase().replace(/[\s\-()]+/g, '_').replace(/^_+|_+$/g, '');
            
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

                for (let j = 0; j < keys.length; j++) { //Untuk setiap kolom
                    if(!identifiers.includes(keys[j])) { //Jika kolom bukan identifier maka masukkan ke data total
                        const rawText = (await col.nth(j).innerText()).trim();
                        const totalKey = `Total_${keys[j]}`;
                        data[totalKey] = this.parseNumber(rawText);
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

}