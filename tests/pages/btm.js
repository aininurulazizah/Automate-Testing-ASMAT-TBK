export class Btm {

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
    // ============== LAPORAN ============= //
    // ==================================== //

    // ** Pengambilan Data Laporan ** //

    async recursiveHeaderExtractor(headerRows, rowIndex, colStart, colSpan, path, result) {
        if (rowIndex >= headerRows.length) {
            result.push(path.join('_'));
            return;
        }

        const cells = await headerRows[rowIndex].locator('th').all();
        let colPointer = 0;
      
        for (const cell of cells) {
          const colspan = Number(await cell.getAttribute('colspan')) || 1;
          const rowspan = Number(await cell.getAttribute('rowspan')) || 1;
      
          const cellStart = colPointer;
          const cellEnd = colPointer + colspan - 1;
      
          // cek overlap kolom
          if (cellEnd < colStart || cellStart >= colStart + colSpan) {
            colPointer += colspan;
            continue;
          }
      
          const text = this.parseText(await cell.innerText());
          const newPath = [...path, text];
      
          // cek apakah dia leaf
          if (rowIndex + rowspan >= headerRows.length) {
            result.push(newPath.join('_'));
          } else {
            await this.recursiveHeaderExtractor(
              headerRows,
              rowIndex + rowspan,
              cellStart,
              colspan,
              newPath,
              result
            );
          }
      
          colPointer += colspan;
        }
      }

    async ambilData(detail, identifiers) {
        await this.page.waitForSelector('table tbody tr');

        const hasSeparatedTable = 
            await this.page.locator('#tableheader').count > 0 && 
            await this.page.locator('#tablecontent').count > 0 //Hasil true/false apakah header dan isi tabel elemennya terpisah atau tidak

        const headerTable = hasSeparatedTable ? this.page.locator('#tableheader') : this.page.locator('table');   //Assign tabel berdasarkan hasSeparatedTable?
        const contentTable = hasSeparatedTable ? this.page.locator('#tablecontent') : this.page.locator('table');

        // Ambil Header
        const headerRows = await headerTable.locator('tr:not([class])').all(); //Ambil elemen tr (baris) untuk header
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
                        if ( !keys[j].includes("avg")) {
                            if (identifiers.includes(keys[j])) { // Jika kolom identifier
                                data[keys[j]] = rawText;
                            } else {
                                data[keys[j]] = this.parseNumber(rawText);
                            }
                        }
                    } else {
                        if (keys[j] !== undefined) {
                            data[keys[j]] = this.parseDecimal(rawText);
                        }
                    }
                    
                }

            } else {

                let startTotalIndex = 1;
                for (let j = 0; j < colCount; j++) {
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