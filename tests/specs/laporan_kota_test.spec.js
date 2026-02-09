import { test } from "@playwright/test";
import { Credential } from "../data/credential";
import { Baraya } from "../pages/baraya";
import { Jackal } from "../pages/jackal";
import { Btm } from "../pages/btm";
import { testData } from "../data/laporan_kota_data";
import { exportToExcel } from "../utils/excelHelper";
import { Laporan } from "../logics/laporan";


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
    
      test(`${site.tag} - Test Case 1 - Validasi Total Biaya Operasional Perhari`, async() => {
    
        const page = await context.newPage();
        
        const web = new site.locator(page);

        const logic = new Laporan(page, site.locator);
            
        await page.goto(`${site.url}/asmat/laporan.kota`);

        await web.pilihPeriodeAwal(site.data.PeriodeAwalTahun, site.data.PeriodeAwalBulan, site.data.PeriodeAwalTanggal);

        await web.pilihPeriodeAkhir(site.data.PeriodeAkhirTahun, site.data.PeriodeAkhirBulan, site.data.PeriodeAkhirTanggal);

        await web.pilihFilter(site.data.FilterBy);

        await web.enter();

        const laporan = await web.ambilDataHarian(testData.IdentifierColumns);

        // Ambil nilai aktual hanya id (tanggal) dan total biaya op
        const total_biaya_op_act = await logic.ambilTotalBiayaOpPerhari(laporan, testData.MainIdentifier, 'biaya_op_total_biaya_op');
        console.log("total_biaya_op_act : ", total_biaya_op_act);
        
        // Hitung total biaya op perhari sebagai nilai expected untuk validasi
        const total_biaya_op_exp = await logic.hitungTotalBiayaOp(laporan, testData.MainIdentifier, site.data.KolomPengeluaran.Biaya_Op, 'biaya_op_total_biaya_op');
        console.log("total_biaya_op_exp : ", total_biaya_op_exp);
        await page.pause();

        await logic.validasiArrayOfObject(total_biaya_op_act, total_biaya_op_exp, 'biaya_op_total_biaya_op');

        await page.pause();
                
      })

      test(`${site.tag} - Test Case 2 - Validasi Total Laba Perhari`, async() => {
    
        const page = await context.newPage();
        
        const web = new site.locator(page);

        const logic = new Laporan(page, site.locator);
            
        await page.goto(`${site.url}/asmat/laporan.kota`);

        await web.pilihPeriodeAwal(site.data.PeriodeAwalTahun, site.data.PeriodeAwalBulan, site.data.PeriodeAwalTanggal);

        await web.pilihPeriodeAkhir(site.data.PeriodeAkhirTahun, site.data.PeriodeAkhirBulan, site.data.PeriodeAkhirTanggal);

        await web.pilihFilter(site.data.FilterBy);

        await web.enter();

        const laporan = await web.ambilDataHarian(testData.IdentifierColumns);

        // Ambil nilai aktual hanya id (tanggal) dan total biaya op
        const total_laba_act = await logic.ambilTotalLabaPerhari(laporan, testData.MainIdentifier, 'total_laba');
        
        // Hitung total biaya op perhari sebagai nilai expected untuk validasi
        const total_laba_exp = await logic.hitungTotalLaba(laporan, testData.MainIdentifier, site.data.KolomPendapatan, site.data.KolomPengeluaran);

        await logic.validasiArrayOfObject(total_laba_act, total_laba_exp, 'total_laba');

        await page.pause();
                
      })

      test(`${site.tag} - Test Case 3 - Cek Laporan Total Bulanan`, async() => {
    
        const page = await context.newPage();
        
        const web = new site.locator(page);

        const logic = new Laporan(page, site.locator);
            
        await page.goto(`${site.url}/asmat/laporan.kota`);

        await web.pilihPeriodeAwal(site.data.PeriodeAwalTahun, site.data.PeriodeAwalBulan, site.data.PeriodeAwalTanggal);

        await web.pilihPeriodeAkhir(site.data.PeriodeAkhirTahun, site.data.PeriodeAkhirBulan, site.data.PeriodeAkhirTanggal);

        await web.pilihFilter(site.data.FilterBy);

        await web.enter();

        const laporan = await web.ambilDataHarian(testData.IdentifierColumns); // Data harian tanpa total

        const totals_act = await web.ambilDataTotal(testData.IdentifierColumns); // Data total setiap kolom

        const totals_exp = await logic.hitungTotalPerField(laporan, testData.IdentifierColumns);

        await logic.validasiArrayOfSingleObject(totals_act, totals_exp);

        await page.pause();
                
      })
    
    });
}
