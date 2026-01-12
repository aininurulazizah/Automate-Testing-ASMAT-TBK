export class Daytrans {

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
        this.field_rute_connecting = page.locator('span#seljenisrute');
        this.list_rute_connecting = page.locator('div.resvcombolist');
        this.list_jam_keberangkatan = page.locator('div#resvshowkeberangkatan >> div.resvlistpilihan');
        this.list_jam_keberangkatanplg = page.locator('div#resvshowjadwalpulang >> div.resvlistpilihan');
        this.list_next_jam_keberangkatan = page.locator('div#resvshowkeberangkatan_1 >> div.resvlistpilihan');
        this.tab_next_jam_keberangkatan = page.locator('span#btnruteconnecting_1');
        this.toggle_pp = page.locator('label:has(input#is_pp_switch2)');
        this.field_tanggal_pulang = page.locator('input#tglpulang');
        this.list_kursi_tersedia = page.locator('div.renderlabelkursikosong');
        this.field_notelp_pemesan = page.locator('input#telppemesan');
        this.field_nama_pemesan = page.locator('input#namapemesan');
        this.field_keterangan_pemesan = page.locator('textarea#keterangan');
        this.button_action_goshow = page.locator('span#btngoshow');

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

    async pilihRute() {
        await this.field_rute_connecting.click();
        await this.list_rute_connecting.first().click();
    }

    async pilihTanggalPulang(value) {
        const [tanggal, bulanText, tahun] = value.split(' ');
        const bulanMap = {Jan: '1', Feb: '2', Mar: '3', Apr: '4', Mei: '5', Jun: '6', Jul: '7', Agu: '8', Sep: '9', Okt: '10', Nov: '11', Des: '12'};
        const bulan = bulanMap[bulanText];
        const posisi_bulan = await this.field_tanggal_pulang.boundingBox();
        const posisi_tanggal = {x: posisi_bulan.x + 10, y: posisi_bulan.y};
        await this.page.mouse.click(posisi_bulan.x, posisi_bulan.y);
        await this.page.keyboard.type(bulan);
        await this.page.mouse.click(posisi_tanggal.x, posisi_tanggal.y);
        await this.page.keyboard.type(tanggal);
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

    async pilihNextJamKeberangkatan() {
        await this.tab_next_jam_keberangkatan.click();
        await this.list_next_jam_keberangkatan.first().click();
    }

    async pilihKursi(value) {
        for(let i = 0; i < value; i++) {
            await this.list_kursi_tersedia.nth(i).click();
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
        await this.page.selectOption('#kategorialasantunai', { label: `${value.Kategori}` });
    }

    async cetakTiket() {
        await this.button_action_goshow.click();
    }

}