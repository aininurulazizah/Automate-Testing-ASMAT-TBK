import { test } from "@playwright/test";
import { Credential } from "../test-data/credential";
import { Baraya } from "../pages/baraya";
import { Jackal } from "../pages/jackal";
import { Btm } from "../pages/btm";
import { testData } from "../test-data/laporan_kota_data";
import { exportToExcel } from "../utils/excelHelper";


const sites = [
    {tag: '@baraya', url: 'https://dev.baraya.asmat.app', locator: Baraya, data: testData.Baraya, cred:Credential.Baraya},
    {tag: '@jackal', url: 'https://dev.jackalx.asmat.app', locator: Jackal, data: testData.Jackal, cred:Credential.Jackal},
    {tag: '@btm', url: 'https://dev.btm.asmat.app', locator: Btm, data: testData.Btm, cred:Credential.Btm}
]

for (const site of sites) {

    test.describe('Laporan Kota', () => {
  
      test.setTimeout(60000);
    
      let context;
    
      test.beforeAll(async ({ browser }) => {
          context = await browser.newContext();  
          const page = await context.newPage();  
          await page.goto(site.url);  // Step Login
          await page.fill('#username', `${site.cred.Username}`);
          await page.fill('#password', `${site.cred.Password}`);
          await page.click('#loginbutton');
          await page.waitForURL('**/menu.operasional');
      });
      
      test.afterAll(async () => {
          await context.close();
      });

      test(`${site.tag} - Test Case 0 - Ekspor Laporan Ke Excel`, async() => {

        const page = await context.newPage();

        const web = new site.locator(page);

        await page.goto(`${site.url}/asmat/laporan.kota`);

        await web.pilihPeriodeAwal(site.data.PeriodeAwalTahun, site.data.PeriodeAwalBulan, site.data.PeriodeAwalTanggal);

        await web.pilihPeriodeAkhir(site.data.PeriodeAkhirTahun, site.data.PeriodeAkhirBulan, site.data.PeriodeAkhirTanggal);

        await web.pilihFilter(site.data.FilterBy);

        await web.enter();

        const laporan = await web.ambilDataAll(testData.IdentifierColumns);

        exportToExcel(laporan, 
          `output/Laporan_Kota_${site.tag}_${site.data.PeriodeAwalBulan}${site.data.PeriodeAwalTahun}-${site.data.PeriodeAkhirBulan}${site.data.PeriodeAkhirTahun}_by ${site.data.FilterBy}.xlsx`, //Nama File
          `${site.data.PeriodeAwalBulan}${site.data.PeriodeAwalTahun}-${site.data.PeriodeAkhirBulan}${site.data.PeriodeAkhirTahun}`); //Nama Sheet

      });
    
      test(`${site.tag} - Test Case 1 - Cek Laporan Per Kota`, async() => {
    
        const page = await context.newPage();
        
        const web = new site.locator(page);
            
        await page.goto(`${site.url}/asmat/laporan.kota`);

        await web.pilihPeriodeAwal(site.data.PeriodeAwalTahun, site.data.PeriodeAwalBulan, site.data.PeriodeAwalTanggal);

        await web.pilihPeriodeAkhir(site.data.PeriodeAkhirTahun, site.data.PeriodeAkhirBulan, site.data.PeriodeAkhirTanggal);

        await web.pilihFilter(site.data.FilterBy);

        await web.enter();

        const laporan = await web.ambilDataHarian(testData.IdentifierColumns);

        // Ambil nilai aktual hanya id (kota) dan biaya pengeluaran (biaya_op_total_biaya_op)
        const pengeluaran_act = laporan.map(({ kota, biaya_op_total_biaya_op }) => ({ kota, biaya_op_total_biaya_op }));

        // Ambil nilai aktual hanya id (kota) dan biaya laba (total_laba)
        const laba_act = laporan.map(({ kota, total_laba }) => ({ kota, total_laba }));

        const pengeluaran_val = await web.hitungPengeluaran(laporan, site.data.KolomPengeluaran, testData.MainIdentifier);

        const pendapatan_val = await web.hitungPendapatan(laporan, site.data.KolomPendapatan, testData.MainIdentifier); // Untuk kebutuhan hitung laba

        const laba_val = await web.hitungLaba(pendapatan_val, pengeluaran_val);
        
        await web.validasiPengeluaran({
          actual: pengeluaran_act,
          expected: pengeluaran_val,
          id_column: testData.MainIdentifier,
          expected_column: "biaya_op_total_biaya_op"
        });

        await web.validasiLaba({
          actual: laba_act,
          expected: laba_val,
          id_column: testData.MainIdentifier,
          expected_column: "total_laba"
        });
        
        await page.pause();
                
      })

      test(`${site.tag} - Test Case 2 - Cek Laporan Total Semua Kota`, async() => {
    
        const page = await context.newPage();
        
        const web = new site.locator(page);
            
        await page.goto(`${site.url}/asmat/laporan.kota`);

        await web.pilihPeriodeAwal(site.data.PeriodeAwalTahun, site.data.PeriodeAwalBulan, site.data.PeriodeAwalTanggal);

        await web.pilihPeriodeAkhir(site.data.PeriodeAkhirTahun, site.data.PeriodeAkhirBulan, site.data.PeriodeAkhirTanggal);

        await web.pilihFilter(site.data.FilterBy);

        const laporan = await web.ambilDataHarian(testData.IdentifierColumns); // Data harian tanpa total

        const laporan_total = await web.ambilDataTotal(testData.IdentifierColumns); // Data total setiap kolom

        const baris_total_val = await web.hitungTotalPerField(laporan, testData.IdentifierColumns);

        await web.validasiTotalPerField(laporan_total, baris_total_val);

        await page.pause();
                
      })
    
    });
}
