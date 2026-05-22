import { expect } from "@playwright/test";

export class Btm {

    constructor(page) {

        // General
        this.page = page;
        this.context = page.context();

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
        this.data_keberangkatan_card = page.locator('span:has-text("Data Keberangkatan") + div.resvsectioncontent');
        this.list_kursi_tersedia = page.locator('div.renderlabelkursikosong');
        this.field_notelp_pemesan = page.locator('input#telppemesan');
        this.field_nama_pemesan = page.locator('input#namapemesan');
        this.hitung_total_btn = page.locator('span#btntotal');
        this.total_bayar_label = page.locator('span.resvisidatalabel:has-text("Total Bayar") + span');
        this.button_action_goshow = page.locator('span#btngoshow');

        // Laporan
        this.field_tahun = page.locator('input#tahun');
        this.button_enter_periode = page.locator('a:text-is("GO!")');
        this.fieldFilter = page.locator('select#filter');
        this.fieldOutlet = page.locator('select#selfilteroutlet');
        this.fieldLayanan = page.locator('.tail-select');
        this.field_periode_awal = page.locator('input#tgl_mulai'); //Laporan Kota
        this.field_periode_akhir = page.locator('input#tgl_akhir'); //Laporan Kota
        
    }

    getBulan(value) {
        return this.page.locator(`td[onclick*="pilihBulan"]:has-text("${value}")`);
    }

    getTahun(value) {
        return this.page.locator(`td[onclick*="pilihTahun"]:has-text("${value}")`);
    }

    getTanggal(value, isWeekend) {
        if(isWeekend) {
            return this.page.locator(`td.kaldatewe[onclick*="pilihTanggal"]:text-is("${value}")`);
        } else {
            return this.page.locator(`td.kaldate[onclick*="pilihTanggal"]:text-is("${value}")`);
        }
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

    getPilihanLayanan(value) {
        return this.page.locator(`ul.dropdown-optgroup >> li.dropdown-option:has-text("${value}")`);
    }

    parseNumber(text) {
        return Number(
            text
                .replace(/[^\d-]/g, '')
                .trim()
        );
    }

    parseDecimal(text) {
        return Number(
            text
                .replace(/[^\d.-]/g, '')
                .trim()
        );
    }

    parseText(text) {
        return text
            .toLowerCase()
            .replace(/[\s\-()]+/g, '_')
            .replace(/^_+|_+$/g, '')
            .trim()
    }


    // ==================================== //
    // ============ RESERVASI ============= //
    // ==================================== //

    async pilihTanggalBerangkat(value) {
        const {tanggal, isWeekend} = value;
        const [day, bulan, tahun] = tanggal.split(" ");
        await this.field_current_month.click();
        await this.getBulan(bulan).click();
        await this.field_current_year.click();
        await this.getTahun(tahun).click();
        await this.getTanggal(day, isWeekend).click();
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

        // cari span title yang ada teks yang dipisahkan dengan strip
        const list_rute_elm = await this.page.locator('div.resvsection').first().locator('span.resvsectiontitle').filter({ hasText: /.+-.+/ });
        const list_rute = (await list_rute_elm.allInnerTexts()).map(text => text.replace('KEBERANGKATAN\n', ''));
        const jml_rute = list_rute.length;
        
        return { list_rute, jml_rute };
    }

    async pilihJamKeberangkatan() {
        await this.list_jam_keberangkatan.first().click();
    }

    async pilihNextJamKeberangkatan() {
        await this.tab_next_jam_keberangkatan.click();
        await this.list_next_jam_keberangkatan.first().click();
    }

    async ambilHargaTiket() {
        await this.page.waitForTimeout(1500);

        let harga_tiket;
        let is_diskon;
        const textsOnCard = await this.data_keberangkatan_card.innerText();

        if (textsOnCard.includes("NETT HARGA")) {
            harga_tiket = this.parseNumber(await this.data_keberangkatan_card.locator('td:has-text("NETT HARGA") + td').innerText());
            is_diskon = true;
        } else {
            harga_tiket = this.parseNumber(await this.data_keberangkatan_card.locator('td:has-text("HARGA TIKET") + td').innerText());
            is_diskon = false;
        }
        return { harga_tiket, is_diskon }; 
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

    async validasiTotalTiket(harga_tiket_1, harga_tiket_2, jml_penumpang) {
        await this.hitung_total_btn.click();

        let total_tiket_1_exp = 0, total_tiket_2_exp = 0;

        if (Array.isArray(harga_tiket_1)) {
            for (const harga of harga_tiket_1) {
                total_tiket_1_exp += harga * jml_penumpang;
            }
        } else {
            total_tiket_1_exp = harga_tiket_1 * jml_penumpang;
            total_tiket_2_exp = harga_tiket_2 * jml_penumpang;
        }

        const total_tiket_exp = total_tiket_1_exp + total_tiket_2_exp;
        const total_tiket_act = this.parseNumber(await this.total_bayar_label.innerText());
        expect(total_tiket_act).toBe(total_tiket_exp);
    }

    async cetakTiket() { //Sementara: bisa diganti aksi yang bisa custom (selain goshow)/menyesuaikan metode bayar
        const[TicketPage] = await Promise.all([
            this.context.waitForEvent('page'),
            await this.button_action_goshow.click()
        ]);

        await TicketPage.waitForLoadState();
        return TicketPage;
    }

    async validasiPrefixTiket(ticket, ticketPrefix, jml_penumpang) {
        for (let i = 0; i < jml_penumpang; i++) {
            await expect(ticket.locator(`text=${ticketPrefix}`).nth(i)).toBeVisible();
        }
    }

    async validasiKeberangkatanTujuan(ticket, keberangkatan, tujuan, jml_penumpang, tanggal_berangkat) {

        const {tanggal, isWeekend} = tanggal_berangkat;
        const tanggalVal = tanggal.replace(/ /g, '-');
        const list_ticket = await ticket.locator(`div`).filter({hasText: `Pergi:${tanggalVal}`});
        const list_ticket_count = await list_ticket.count();
        let list_act_ticket = [];
        let jml_match = 0;

        for (let i = 0; i < list_ticket_count; i++) {
            const pickup = await list_ticket.nth(i).locator('span:has-text("Pick Up") + br + span').innerText();
            const dropoff = await list_ticket.nth(i).locator('span:has-text("Drop Off") + br + span').innerText();

            list_act_ticket.push({
                pickup: pickup.trim(),
                dropoff: dropoff.trim()
            })
        }

        for (const ticket of list_act_ticket) {
            if (ticket.pickup === keberangkatan && ticket.dropoff === tujuan) {
                jml_match++;
            }
        }

        expect(jml_match).toBe(jml_penumpang);

    }

    async validasiTanggal(ticket, tanggal_validasi, jml_penumpang) {
        const {tanggal, isWeekend} = tanggal_validasi;
        const tanggalVal = tanggal.replace(/ /g, '-');
        for (let i = 0; i < jml_penumpang; i++) {
            await expect(ticket.locator(`text=${tanggalVal}`).nth(i)).toBeVisible();
        }
    }

    async ambilDetailBooking(ticket, is_diskon, case_flag) {
        let kode_booking;
        let booking_detail;
        let has_diskon;

        // Ambil kode booking
        const scripts = await ticket.locator('script').allTextContents();
        for (const script of scripts) {
            const match = script.match(/showDetailReservasi\([^,]+,\s*"([^"]+)"/);
            if (match) {
                kode_booking = match[1];
            }
        }

        // Ambil detail reservasi di halaman asmat (klik kursi terbooking)
        await this.page.bringToFront();
        await this.page.locator(`[onclick*="${kode_booking}"]`).first().click(); //Klik seat booked

        await expect(await this.page.locator('span#detail_harga_v2').first()).toBeVisible();
        const detail_harga_card = await this.page.locator('span#detail_harga_v2').first();
       
        if (Array.isArray(is_diskon)) {
            has_diskon = is_diskon.includes(true);
        }

        let tanggal_keberangkatan;
        let rute;
        let harga_tiket;
        let diskon;
        let total_tiket;
        let total_diskon

        if (case_flag === 'one way trip') {
            const rute_asal = await this.page.locator('span.resvisidatalabel:text-is("Asal") + span').innerText();
            const rute_tujuan = await this.page.locator('span.resvisidatalabel:text-is("Tujuan") + span').innerText();
            const jam_keberangkatan = await this.page.locator('span.resvisidatalabel:text-is("Jam Keberangkatan") + span').innerText();

            rute = `${rute_asal} - ${rute_tujuan} (Keberangkatan : ${jam_keberangkatan})`;
            tanggal_keberangkatan = await this.page.locator('span.resvisidatalabel:text-is("Tanggal Keberangkatan") + span').innerText();
            harga_tiket = await detail_harga_card.locator('span#sectiondatapemesan:has-text("Ringkasan Pembelian Tiket") + hr + span span.resvdisidatafield').innerText();
            total_tiket = await detail_harga_card.locator('span#show_harga_keseluruhan span:has-text("Harga Tiket") + span.resvdisidatafield').innerText();
        
            diskon; //Belum nemu case diskon

            total_diskon = is_diskon
            ? await detail_harga_card.locator('span#show_harga_keseluruhan span:has-text("Discount Promo") + span.resvdisidatafield').innerText()
            : "Rp 0";

        } else if (case_flag === 'connecting') {
            const data_rute_connecting = await this.page.locator(`
                xpath=//span[@class='resvsectiontitle' and normalize-space()='Data Tiket Connecting']
                /following-sibling::*[
                    following-sibling::span[
                        @class='resvsectiontitle' and normalize-space()='Pemesan & Penumpang'
                    ]
                ]
            `);

            const data_harga_connecting = await detail_harga_card.locator(`span#show_harga_keseluruhan span`);
            
            const texts_rute = await data_rute_connecting.allInnerTexts();
            const texts_harga = await data_harga_connecting.allInnerTexts();
            
            rute = [];
            harga_tiket = [];

            for (let i = 0; i < texts_rute.length; i++) {
                if (/^\d+\.\sRute$/.test(texts_rute[i])) { // Cari label "x. Rute"
                    const nama_rute = texts_rute[i + 1];
                    const waktu_full = texts_rute[i + 3]; // Cari waktu keberangkatan
                    const jam = waktu_full.split(' ')[1]; // Ambil jam saja
                    rute.push(`${nama_rute} (Keberangkatan : ${jam})`);
                }
            }

            console.log(texts_harga);

            for (let i = 0; i < texts_harga.length; i++) {
                if (/^Harga\s[A-Z-]+$/.test(texts_harga[i])) { 
                    const rute = texts_harga[i].replace('Harga ','');
                    const harga = texts_harga[i+1];
                    harga_tiket.push({
                        Rute: rute,
                        Harga_Tiket: harga
                    });
                }
            }

            tanggal_keberangkatan = await this.page.locator('span.resvisidatalabel:text-is("Tanggal Keberangkatan") + span').innerText();
            diskon; //Belum nemu case ada diskonnya
            total_tiket = await detail_harga_card.locator('span#show_harga_keseluruhan span:has-text("Total Bayar") + span.resvdisidatafield').innerText();
            
            total_diskon = has_diskon
            ? await detail_harga_card.locator('span#show_harga_keseluruhan span:has-text("Discount Promo") + span.resvdisidatafield').innerText()
            : "Rp 0";
        }
        
        const metode_bayar = await this.page.locator('span.resvisidatalabel:has-text("Jenis Pembayaran") + span').innerText();
        const tanggal_pemesanan = await this.page.locator('span.resvisidatalabel:has-text("Waktu Pemesanan") + span').innerText();
        const pencetak = await this.page.locator('span.resvisidatalabel:has-text("Agen Pemesan") + span').innerText();
        const total_bayar = await detail_harga_card.locator('span#show_harga_keseluruhan span:has-text("Total Bayar") + span.resvdisidatafield').innerText();

        return booking_detail = {
            kode_booking,
            tanggal_keberangkatan,
            rute,
            harga_tiket,
            diskon,
            total_tiket,
            total_diskon,
            total_bayar,
            metode_bayar,
            tanggal_pemesanan,
            pencetak
        }
    }


    // ==================================== //
    // ============== LAPORAN ============= //
    // ==================================== //

    // ** Pengambilan Data Laporan ** //

    async ambilData(detail, identifiers) {
        await this.page.waitForSelector('table tbody tr');

        // const hasSeparatedTable = 
        //     await this.page.locator('#tableheader').count > 0 && 
        //     await this.page.locator('#tablecontent').count > 0 //Hasil true/false apakah header dan isi tabel elemennya terpisah atau tidak

        const hasSeparatedTable =
            (await this.page.locator('#tableheader').count()) > 0 &&
            (await this.page.locator('#tablecontent').count()) > 0; //Hasil true/false apakah header dan isi tabel elemennya terpisah atau tidak

        const headerTable = hasSeparatedTable ? this.page.locator('#tableheader') : this.page.locator('table');   //Assign tabel berdasarkan hasSeparatedTable?
        const contentTable = hasSeparatedTable ? this.page.locator('#tablecontent') : this.page.locator('table');

        // Ambil Header
        const headerRows = await headerTable.locator('tr:not([class]):not([style])').all(); //Ambil elemen tr (baris) untuk header
        let headers = [];
        let keys = [];
        let subIndex = 0;       //Index untuk sub header atau header baris ke-2
        let subSubIndex = 0;    //Index utnuk sub sub header atau header baris ke-3 (asumsi maksimal header adalah 3 baris)
        

        for (let i = 0; i < headerRows.length; i++) {
            const header = await headerRows[i].locator('th').all()
            headers.push(header);
        }

        const mainHeaders = headers[0];
        const subHeaders = headers.slice(1);

        for (const header of mainHeaders) {
            let colspan = Number(await header.getAttribute('colspan')) || 1;
            const header_text = await this.parseText(await header.innerText());

            if (header_text !== "") {
                if(colspan !== 1) {
                    const sub_headers = subHeaders[0]
    
                        for(let i = 0; i < colspan; i++) {
                            const sub_header = await sub_headers[subIndex];
                            const sub_colspan = Number(await sub_header.getAttribute('colspan')) || 1;
                            const sub_header_text = await this.parseText(await sub_header.innerText());
                            subIndex++;
    
                            if(sub_colspan !== 1) {
                                const sub_sub_headers = subHeaders[1];
                                colspan = colspan - sub_colspan + 1;
    
                                for(let i = 0; i < sub_colspan; i++) {
                                    const sub_sub_header = await sub_sub_headers[subSubIndex];
                                    const sub_sub_header_text = await this.parseText(await sub_sub_header.innerText());
                                    keys.push(`${header_text}_${sub_header_text}_${sub_sub_header_text}`);
                                    subSubIndex++;
                                }
    
                            } else {
                                keys.push(`${header_text}_${sub_header_text}`)
                            }
    
                        }
        
                } else {
                    keys.push(header_text);
                }
            }
        }
        

        // Ambil data
        const rows = contentTable.locator('tbody tr'); //Ambil elemen baris untuk body/isi
        const rowCount = await rows.count(); //Hitung jumlah baris

        let startRowIndex; //Index awal pengambilan data
        if (hasSeparatedTable) {
            startRowIndex = 0;  //Jika header dan konten terpisah maka index awal 0
        } else {
            startRowIndex = headerRows.length;  //Jika header dan konten disatukan maka index awal adalah baris ke x (tergantung banyak baris header)
        }
        
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
                        if ( !keys[j].includes("avg")) {
                            if (identifiers.includes(keys[j])) { // Jika kolom identifier
                                data[keys[j]] = rawText;
                            } else {
                                data[keys[j]] = this.parseNumber(rawText);
                            }
                        } else {
                            data[keys[j]] = this.parseDecimal(rawText);
                        }
                    }
                    
                }

            } else {

                let startTotalIndex = 1;
                for (let j = 0; j < keys.length; j++) {
                    if(!identifiers.includes(keys[j]) && keys[j] !== undefined) { //Jika kolom bukan identifier maka masukkan ke total
                        const rawText = (await col.nth(startTotalIndex).innerText()).trim();
                        const totalKey = `Total_${keys[j]}`;

                        if (!totalKey.includes("avg")) {
                            data[totalKey] = this.parseNumber(rawText);
                        } else {
                            data[totalKey] = this.parseDecimal(rawText);
                        }
                        
                        startTotalIndex++;
                    }
                }

            }

            switch (detail) {
                case "All":
                    result.push(data);
                    break;
            
                case "Detail":
                    if (!isYellow) result.push(data);
                    break;
            
                case "Total":
                    if (isYellow) result.push(data);
                    break;
            }
            
        }

        // console.log(`Data ${detail} Yang Diambil : `, result);

        return result;

    }

    async ambilDataDetail(value_identifier) {
        return await this.ambilData("Detail", value_identifier);
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

    async pilihLayanan(label) {
        await this.fieldLayanan.click();
        await this.getPilihanLayanan(label);
    }

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

    async enter() {
        await this.button_enter_periode.click();
    } 

}