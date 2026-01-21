import { test, expect } from "@playwright/test"
import { Daytrans } from "../pages/daytrans";
import { Baraya } from "../pages/baraya";
import { Aragon } from "../pages/aragon";
import { Jackal } from "../pages/jackal";
import { Btm } from "../pages/btm";
import { testData } from "../test-data/reservasi_data";
import { exportToExcel } from "../utils/excelHelper";


const sites = [
    {tag: '@daytrans', url: 'https://dev.daytrans.asmat.app', locator: Daytrans, data: testData.Daytrans},
    {tag: '@baraya', url: 'https://dev.baraya.asmat.app', locator: Baraya, data: testData.Baraya},
    {tag: '@aragon', url: 'https://dev.aragon.asmat.app', locator: Aragon, data: testData.Aragon},
    {tag: '@jackal', url: 'https://dev.jackalx.asmat.app', locator: Jackal, data: testData.Jackal},
    {tag: '@btm', url: 'https://dev.btm.asmat.app', locator: Btm, data: testData.Btm},
]

for (const site of sites) {

    test.describe('Reservasi', () => {
  
      test.setTimeout(60000);
    
      let context;
    
      test.beforeAll(async ({ browser }) => {
          context = await browser.newContext();  
          const page = await context.newPage();  
          await page.goto(site.url);  // Step Login
          await page.fill('#username', `${site.data.Cred.Username}`);
          await page.fill('#password', `${site.data.Cred.Password}`);
          await page.click('#loginbutton');
          await page.waitForURL('**/menu.operasional');
      });
      
      test.afterAll(async () => {
          await context.close();
      });

      test(`${site.tag} - Test Case 0 - Ekspor Laporan Ke Excel`, async() => {

        const page = await context.newPage();

        const web = new site.locator(page);

        await page.goto(`${site.url}/asmat/laporan.harian`);

        await web.pilihTahun('2025');

        await web.pilihBulan('Januari');

        const laporan = await web.ambilDataAll();

        exportToExcel(laporan, `output/Laporan_Harian_${site.tag}_Jan2025.xlsx`, 'Januari 2025');

      });
    
      test(`${site.tag} - Test Case 1 - Cek Laporan Harian`, async() => {
    
        const page = await context.newPage();
        
        const web = new site.locator(page);
            
        await page.goto(`${site.url}/asmat/laporan.harian`);

        await web.pilihTahun('2025');

        await web.pilihBulan('Januari');

        const laporan = await web.ambilData();

        const pendapatan_val = await web.hitungPendapatan(laporan);

        const pengeluaran_val = await web.hitungPengeluaran(laporan);

        const laba_val = await web.hitungLaba(pendapatan_val, pengeluaran_val);

        await web.validasiPengeluaran(laporan, pengeluaran_val);

        await web.validasiLaba(laporan, laba_val);

        await page.pause();
                
      })

      test(`${site.tag} - Test Case 2 - Cek Laporan Total Bulanan`, async() => {
    
        const page = await context.newPage();
        
        const web = new site.locator(page);
            
        await page.goto(`${site.url}/asmat/laporan.harian`);

        await web.pilihTahun('2025');

        await web.pilihBulan('Januari');

        const laporan = await web.ambilData(); // Data harian tanpa total

        const laporan_total = await web.ambilDataTotal(); // Data total setiap kolom

        const baris_total_val = await web.hitungTotalPerField(laporan);

        await web.validasiTotalPerField(laporan_total, baris_total_val);

        await page.pause();
                
      })
    
    });
  
  }