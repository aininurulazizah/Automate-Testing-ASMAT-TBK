import { test, expect } from "@playwright/test";
import { Credential } from "../test-data/credential";
// import { Daytrans } from "../pages/daytrans";
import { Baraya } from "../pages/baraya";
import { Aragon } from "../pages/aragon";
import { Jackal } from "../pages/jackal";
import { Btm } from "../pages/btm";
import { testData } from "../test-data/laporan_kota_data";
import { exportToExcel } from "../utils/excelHelper";


const sites = [
  // {tag: '@daytrans', url: 'https://dev.daytrans.asmat.app', locator: Daytrans, data: testData.Daytrans, cred:Credential.Daytrans},
  {tag: '@baraya', url: 'https://dev.baraya.asmat.app', locator: Baraya, data: testData.Baraya, cred:Credential.Baraya},
  {tag: '@aragon', url: 'https://dev.aragon.asmat.app', locator: Aragon, data: testData.Aragon, cred:Credential.Aragon},
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

        await web.enter();

        const laporan = await web.ambilDataAll_reportByKota();

        exportToExcel(laporan, 
          `output/Laporan_Kota_${site.tag}_${site.data.PeriodeAwalBulan}${site.data.PeriodeAwalTahun}-${site.data.PeriodeAkhirBulan}${site.data.PeriodeAkhirTahun}.xlsx`, //Nama File
          `${site.data.PeriodeAwalBulan}${site.data.PeriodeAwalTahun}-${site.data.PeriodeAkhirBulan}${site.data.PeriodeAkhirTahun}`); //Nama Sheet

      });
    
      test(`${site.tag} - Test Case 1 - Cek Laporan Per Kota`, async() => {
    
        const page = await context.newPage();
        
        const web = new site.locator(page);
            
        await page.goto(`${site.url}/asmat/laporan.kota`);

        await web.pilihPeriodeAwal(site.data.PeriodeAwalTahun, site.data.PeriodeAwalBulan, site.data.PeriodeAwalTanggal);

        await web.pilihPeriodeAkhir(site.data.PeriodeAkhirTahun, site.data.PeriodeAkhirBulan, site.data.PeriodeAkhirTanggal);

        await web.enter();

        const laporan = await web.ambilData_reportByKota();

        const pendapatan_val = await web.hitungPendapatan_reportByKota(laporan);

        const pengeluaran_val = await web.hitungPengeluaran_reportByKota(laporan);

        const laba_val = await web.hitungLaba_reportByKota(pendapatan_val, pengeluaran_val);

        await web.validasiPengeluaran_reportByKota(laporan, pengeluaran_val);

        await web.validasiLaba_reportByKota(laporan, laba_val);

        await page.pause();
                
      })

      test(`${site.tag} - Test Case 2 - Cek Laporan Total Semua Kota`, async() => {
    
        const page = await context.newPage();
        
        const web = new site.locator(page);
            
        await page.goto(`${site.url}/asmat/laporan.kota`);

        await web.pilihPeriodeAwal(site.data.PeriodeAwalTahun, site.data.PeriodeAwalBulan, site.data.PeriodeAwalTanggal);

        await web.pilihPeriodeAkhir(site.data.PeriodeAkhirTahun, site.data.PeriodeAkhirBulan, site.data.PeriodeAkhirTanggal);

        const laporan = await web.ambilData_reportByKota(); // Data harian tanpa total

        const laporan_total = await web.ambilDataTotal_reportByKota(); // Data total setiap kolom

        const baris_total_val = await web.hitungTotalPerField_reportByKota(laporan);

        await web.validasiTotalPerField_reportByKota(laporan_total, baris_total_val);

        await page.pause();
                
      })
    
    });
  
  }