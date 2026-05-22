import { expect } from "@playwright/test"
import { timingSafeEqual } from "crypto";
import { type } from "os";

export class Daytrans {

    constructor(page) {

        // General
        this.page = page;
        this.context = page.context();

        // Reservation
        this.field_current_month = page.locator('span.kalbulan');
        this.field_current_year = page.locator('span.kaltahun');
        this.field_outlet_keberangkatan = page.locator('span#seloutletasal');
        this.field_outlet_tujuan = page.locator('span#seloutlettujuan');
        this.field_outletplg_keberangkatan = page.locator('span#seloutletasalpulang');
        this.field_outletplg_tujuan = page.locator('span#seloutlettujuanpulang');
        this.field_rute_connecting = page.locator('span#seljenisrute');
        this.list_rute_connecting = page.locator('div.resvcombolist');
        this.list_jam_keberangkatan = page.locator('div#resvshowkeberangkatan >> div.resvlistpilihan');
        this.list_jam_keberangkatanplg = page.locator('div#resvshowjadwalpulang >> div.resvlistpilihan');
        this.list_next_jam_keberangkatan = page.locator('div#resvshowkeberangkatan_1 > div');
        this.toggle_pp = page.locator('label:has(input#is_pp_switch2)');
        this.field_tanggal_pulang = page.locator('input#tglpulang');
        this.data_keberangkatan_card = page.locator('span:has-text("Data Keberangkatan") + div.resvsectioncontent');
        this.harga_tiket_label = page.locator('span.resvdisidatafield#penumpang > span#seldiscount');
        this.list_kursi_tersedia = page.locator('div.renderlabelkursikosong');
        this.field_notelp_pemesan = page.locator('input#telppemesan');
        this.field_nama_pemesan = page.locator('input#namapemesan');
        this.field_keterangan_pemesan = page.locator('textarea#keterangan');
        this.hitung_total_btn = page.locator('span#btntotal');
        this.total_bayar_label = page.locator('span.resvisidatalabel:has-text("Total Bayar") + span');
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

    getTanggal(value, isWeekend) {
        if(isWeekend) {
            return this.page.locator(`td.kaldatewe[onclick*="pilihTanggal"]:text-is("${value}")`);
        } else {
            return this.page.locator(`td.kaldate[onclick*="pilihTanggal"]:text-is("${value}")`);
        }
    }

    getTabRuteConn(value) {
        return this.page.locator(`span#btnruteconnecting_${value}`);
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
            .replace(/[\s\-().]+/g, '_')
            .replace(/^_+|_+$/g, '')
            .trim()
    }

    parseToSnakeCase(text) {
        return text
          .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
          .toLowerCase();
      }

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

    async klikPPToggle() {
        await this.toggle_pp.click();
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

    async pilihTanggalPulang(value) {
        const {tanggal, isWeekend} = value;
        const [day, bulanText, tahun] = tanggal.split(" ");
        const bulanMap = {Jan: '1', Feb: '2', Mar: '3', Apr: '4', Mei: '5', Jun: '6', Jul: '7', Agu: '8', Sep: '9', Okt: '10', Nov: '11', Des: '12'};
        const bulan = bulanMap[bulanText];
        const posisi_bulan = await this.field_tanggal_pulang.boundingBox();
        const posisi_tanggal = {x: posisi_bulan.x + 10, y: posisi_bulan.y};
        await this.page.mouse.click(posisi_bulan.x, posisi_bulan.y);
        await this.page.keyboard.type(bulan);
        await this.page.mouse.click(posisi_tanggal.x, posisi_tanggal.y);
        await this.page.keyboard.type(day);
        await this.field_tanggal_pulang.click();
        await this.field_tanggal_pulang.type(tahun);
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

    async pilihNextJamKeberangkatan(rute_ke) {
        await this.getTabRuteConn(rute_ke).click();
        await this.page.waitForTimeout(1500);
        await this.list_next_jam_keberangkatan.first().click();
    }

    async ambilHargaTiket() {
        return  {
            harga_tiket: [],
            is_diskon: []
        };
    }

    async cekTipeHarga() {
        const harga = await this.data_keberangkatan_card.locator('td:has-text("HARGA TIKET") + td').innerText();
        const is_range = await harga.includes("-");

        return is_range;
    }

    async pilihKursi(value, data_tiket, case_flag, rute_ke) {
        for(let i = 0; i < value; i++) {
            await this.list_kursi_tersedia.nth(i).click();

            await this.page.waitForTimeout(1500);

            if(case_flag === 'connecting') {
                await this.getTabRuteConn(rute_ke).click();
            }

            await this.page.waitForTimeout(1500);

            const textsOnCard = await this.data_keberangkatan_card.innerText();
            const is_range = await this.cekTipeHarga();
    
            let current_harga_tiket;
            let current_is_diskon;

            if (is_range) {
                if (textsOnCard.includes("NETT HARGA")) {
                    current_harga_tiket = this.parseNumber(await this.harga_tiket_label.innerText());
                    current_is_diskon = true;
                } else {
                    current_harga_tiket = this.parseNumber(await this.harga_tiket_label.innerText());
                    current_is_diskon = false;
                }
            } else {
                if (textsOnCard.includes("NETT HARGA")) {
                    current_harga_tiket = this.parseNumber(await this.data_keberangkatan_card.locator('td:has-text("NETT HARGA") + td').innerText());
                    current_is_diskon = true;
                } else {
                    current_harga_tiket = this.parseNumber(await this.data_keberangkatan_card.locator('td:has-text("HARGA TIKET") + td').innerText());
                    current_is_diskon = false;
                }
            }

            data_tiket.harga_tiket.push(current_harga_tiket);
            data_tiket.is_diskon.push(current_is_diskon);

        }
    }

    async isiDataPemesan(value) {
        await this.field_notelp_pemesan.fill(value.NoHP);
        await this.field_nama_pemesan.click();
        await this.field_nama_pemesan.fill(value.NamaPemesan);
        await this.field_keterangan_pemesan.fill(value.Keterangan);
    }

    async pilihMetodeBayar(value) {
        await this.getMetodePembayaran(value.Metode).click();
        const alasan_kategori = await this.page.locator('#kategorialasantunai');
        if (await alasan_kategori.count() > 0) {
            await alasan_kategori.selectOption({label: value.Kategori});
        }
    }

    async validasiTotalTiket(harga_tiket_1, harga_tiket_2, jml_kursi, jml_rute) {
        const is_asuransi_checked = await this.page.locator('#is_asuransi_switch').isChecked();
        let total_tiket_1_exp = 0;
        let total_tiket_2_exp = 0;

        if (harga_tiket_1) {
            total_tiket_1_exp = harga_tiket_1
                .flat()
                .reduce((a, b) => a + b, 0);
        }

        if (harga_tiket_2) {
            total_tiket_2_exp = harga_tiket_2
                .flat()
                .reduce((a, b) => a + b, 0);
        }

        let total_tiket_exp = total_tiket_1_exp + total_tiket_2_exp;

        if (is_asuransi_checked) {
            total_tiket_exp += (1500 * (jml_kursi * jml_rute));
        }
        
        await this.hitung_total_btn.click();
        const total_tiket_act = this.parseNumber(await this.total_bayar_label.innerText());
        
        expect(total_tiket_act).toBe(total_tiket_exp);
    }

    async cetakTiket() {
        const [TicketPage] = await Promise.all([
            this.page.waitForEvent('popup'),
            this.button_action_goshow.click()
        ]);
    
        await TicketPage.waitForLoadState('domcontentloaded');
    
        return TicketPage;
    }

    async ambilDetailBooking(ticket, is_diskon, case_flag) {
        let kode_booking;
        let booking_detail;

        // Ambil kode booking
        const scripts = await ticket.locator('script').allTextContents();
        for (const script of scripts) {
            const match = script.match(/showDetailReservasi\([^,]+,\s*"([^"]+)"/);
            if (match) {
                kode_booking = match[1];
            }
        }

        // Ambil detail reservasi di halaman asmat (klik kursi terbooking)
        const booked_seats = await this.page.locator(`div.renderkursikonfirm[onclick*="${kode_booking}"]`);
        await this.page.bringToFront();
        await booked_seats.first().click(); //Klik seat booked

        await expect(await this.page.locator('span#detail_harga_v2').nth(1)).toBeVisible();
        const detail_harga_card = await this.page.locator('span#detail_harga_v2').nth(1);
        const has_diskon = is_diskon.some(v => v === true);

        let tanggal_keberangkatan;
        let rute;
        let harga_tiket;
        let diskon;
        let total_tiket;

        if (case_flag === 'one way trip') {
            const rute_asal = await this.page.locator('span.resvisidatalabel:text-is("Asal") + span').innerText();
            const rute_tujuan = await this.page.locator('span.resvisidatalabel:text-is("Tujuan") + span').innerText();
            const jam_keberangkatan = await this.page.locator('#showsectiondetaildata span.resvisidatalabel:text-is("Jam Keberangkatan") + span').innerText();

            rute = `${rute_asal} - ${rute_tujuan} (Keberangkatan : ${jam_keberangkatan})`;
            tanggal_keberangkatan = await this.page.locator('span.resvisidatalabel:text-is("Tanggal Keberangkatan") + span').innerText();
            total_tiket = await detail_harga_card.locator('span#show_harga_keseluruhan span:has-text("Harga Tiket") + span.resvdisidatafield').innerText();

            diskon = has_diskon
            ? await detail_harga_card.locator('span#sectiondatapemesan:has-text("Ringkasan Pembelian Tiket") + span + hr + span + hr + span + hr + span span.resvdisidatafield').innerText()
            : "Rp 0";

            harga_tiket = [];
            const count_seats = await booked_seats.count();
            for (let i = 0; i < count_seats; i++) {
                await booked_seats.nth(i).click();
                await this.page.waitForTimeout(2000);
                const tiket = await detail_harga_card.locator('span#sectiondatapemesan:has-text("Ringkasan Pembelian Tiket") + span + hr + span span.resvdisidatafield').innerText();
                harga_tiket.push(tiket);
            }

        } else if (case_flag === 'round trip') {
            // await this.page.locator('span#btnrutepergi').click();
            const tanggal_pergi = await this.page.locator('span.resvisidatalabel:text-is("Tanggal Keberangkatan") + span').innerText();
            const rute_asal_pergi = await this.page.locator('span.resvisidatalabel:text-is("Asal") + span').innerText();
            const rute_tujuan_pergi = await this.page.locator('span.resvisidatalabel:text-is("Tujuan") + span').innerText();
            const jam_keberangkatan = await this.page.locator('#showsectiondetaildata span.resvisidatalabel:text-is("Jam Keberangkatan") + span').innerText();
            // const harga_tiket_pergi = await detail_harga_card.locator('span#sectiondatapemesan:has-text("Ringkasan Pembelian Tiket") + hr + span span.resvdisidatafield').innerText();
            let harga_tiket_pergi = [];
            const total_pergi = await detail_harga_card.locator('span#show_harga_keseluruhan span:has-text("Harga Berangkat") + span.resvdisidatafield').innerText();
            const total_pulang = await detail_harga_card.locator('span#show_harga_keseluruhan span:has-text("Harga Pulang") + span.resvdisidatafield').innerText();
            
            const diskon_pergi = has_diskon
            ? await detail_harga_card.locator('span#sectiondatapemesan:has-text("Ringkasan Pembelian Tiket") + span + hr + span + hr + span + hr + span span.resvdisidatafield').innerText()
            : "Rp 0";

            let count_seats = await booked_seats.count();
            for (let i = 0; i < count_seats; i++) {
                await booked_seats.nth(i).click();
                await this.page.waitForTimeout(2000);
                const tiket = await detail_harga_card.locator('span#sectiondatapemesan:has-text("Ringkasan Pembelian Tiket") + span + hr + span span.resvdisidatafield').innerText();
                harga_tiket_pergi.push(tiket);
            }

            await this.page.locator('span#btnrutepulang').click();
            await this.page.waitForTimeout(1000);
            await this.page.locator(`[onclick*="${kode_booking}"]`).first().click();
            await this.page.waitForTimeout(1000);

            const tanggal_pulang = await this.page.locator('span.resvisidatalabel:text-is("Tanggal Keberangkatan") + span').innerText();
            const rute_asal_pulang = await this.page.locator('span.resvisidatalabel:text-is("Asal") + span').innerText();
            const rute_tujuan_pulang = await this.page.locator('span.resvisidatalabel:text-is("Tujuan") + span').innerText();
            const jam_pulang = await this.page.locator('#showsectiondetaildata span.resvisidatalabel:text-is("Jam Keberangkatan") + span').innerText();
            let harga_tiket_pulang = [];

            const diskon_pulang = has_diskon
            ? await detail_harga_card.locator('span#sectiondatapemesan:has-text("Ringkasan Pembelian Tiket") + span + hr + span + hr + span + hr + span span.resvdisidatafield').innerText()
            : "Rp 0";

            count_seats = await booked_seats.count();
            for (let i = 0; i < count_seats; i++) {
                await booked_seats.nth(i).click();
                await this.page.waitForTimeout(2000);
                const tiket = await detail_harga_card.locator('span#sectiondatapemesan:has-text("Ringkasan Pembelian Tiket") + span + hr + span span.resvdisidatafield').innerText();
                harga_tiket_pulang.push(tiket);
            }

            const rute_pergi = `${rute_asal_pergi} - ${rute_tujuan_pergi} (Keberangkatan : ${jam_keberangkatan})`;
            const rute_pulang = `${rute_asal_pulang} - ${rute_tujuan_pulang} (Keberangkatan : ${jam_pulang})`;

            rute = { rute_pergi, rute_pulang };
            tanggal_keberangkatan = { tanggal_pergi, tanggal_pulang };
            harga_tiket = { harga_tiket_pergi, harga_tiket_pulang };
            diskon = { diskon_pergi, diskon_pulang };
            total_tiket = { total_pergi, total_pulang };

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

            console.log(total_tiket);
        }

        const metode_bayar = await this.page.locator('span.resvisidatalabel:has-text("Jenis Pembayaran") + span').innerText();
        const tanggal_pemesanan = await this.page.locator('span.resvisidatalabel:has-text("Waktu Pemesanan") + span').innerText();
        const pencetak = await this.page.locator('span.resvisidatalabel:has-text("Agen Pemesan") + span').innerText();
        const asuransi = await detail_harga_card.locator('span#show_harga_keseluruhan span:has-text("Charge Asuransi") + span.resvdisidatafield').innerText();

        const total_diskon = has_diskon
            ? await detail_harga_card.locator('span#show_harga_keseluruhan span:has-text("Discount Promo") + span.resvdisidatafield').innerText()
            : "Rp 0";

        const total_bayar = await detail_harga_card.locator('span#show_harga_keseluruhan span:has-text("Total Bayar") + span.resvdisidatafield').innerText();

        return booking_detail = {
            kode_booking,
            tanggal_keberangkatan,
            rute,
            harga_tiket,
            diskon,
            total_tiket,
            total_diskon,
            asuransi,
            total_bayar,
            metode_bayar,
            tanggal_pemesanan,
            pencetak
        }
    }

    async specifyTicket (ticket) {
        const ticket_container = await ticket.locator('div#pax').first();
        const tickets = await ticket_container.locator('div#tiket');
        return tickets;
    }

    async validasiPrefixTiket(tikets, ticketPrefix, jml_penumpang) {
        const ticket = await this.specifyTicket(tikets);
        for (let i = 0; i < jml_penumpang; i++) {
            await expect(ticket.locator(`text=${ticketPrefix}`).nth(i)).toBeVisible();
        }
    }

    async validasiKeberangkatanTujuan(tikets, keberangkatan, tujuan, jml_penumpang, tanggal_berangkat) {
        const ticket = await this.specifyTicket(tikets);

        console.log(await ticket.allTextContents());
        await this.page.pause();

        for (let i = 0; i < jml_penumpang; i++) {
            const ticket_content = await ticket.nth(i).textContent();
            expect(ticket_content).toContain(`${keberangkatan}-${tujuan}`);
        }

    }

    async validasiTanggal(tikets, tanggal_validasi, jml_penumpang) {
        const ticket = await this.specifyTicket(tikets);
        const {tanggal, isWeekend} = tanggal_validasi;
        const dates = tanggal.split(' ');
        dates[0] = dates[0].padStart(2, '0');
        const tanggalVal = dates.join('-');

        for (let i = 0; i < jml_penumpang; i++) {
            const ticket_content = await ticket.nth(i).textContent();
            expect(ticket_content).toContain(tanggalVal);
        }
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
            const texts = await row.locator('td').allInnerTexts();
            const isYellow = await row.evaluate(el => el.classList.contains('yellow'));
            const data = {}

            if (!isYellow) {  // Jika baris bukan baris total (ditandai dengan baris kuning)

                for (let j = 0; j < texts.length; j++) {  //Untuk setiap kolom di baris tersebut
                    const rawText = await texts[j].trim();

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
                for (let j = 0; j < texts.length; j++) {    
                    if(!identifiers.includes(keys[j]) && keys[j] !== undefined) { //Jika kolom bukan identifier maka masukkan ke total
                        const rawText = (await texts[startTotalIndex]).trim();
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