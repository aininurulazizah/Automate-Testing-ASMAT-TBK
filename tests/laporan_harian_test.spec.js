import { test, expect } from "@playwright/test";
import { Credential } from "../test-data/credential";
// import { Daytrans } from "../pages/daytrans";
import { Baraya } from "../pages/baraya";
import { Aragon } from "../pages/aragon";
import { Jackal } from "../pages/jackal";
import { Btm } from "../pages/btm";
import { testData } from "../test-data/laporan_harian_data";
import { exportToExcel } from "../utils/excelHelper";


const sites = [
  // {tag: '@daytrans', url: 'https://dev.daytrans.asmat.app', locator: Daytrans, data: testData.Daytrans, cred:Credential.Daytrans},
  {tag: '@baraya', url: 'https://dev.baraya.asmat.app', locator: Baraya, data: testData.Baraya, cred:Credential.Baraya},
  {tag: '@aragon', url: 'https://dev.aragon.asmat.app', locator: Aragon, data: testData.Aragon, cred:Credential.Aragon},
  {tag: '@jackal', url: 'https://dev.jackalx.asmat.app', locator: Jackal, data: testData.Jackal, cred:Credential.Jackal},
  {tag: '@btm', url: 'https://dev.btm.asmat.app', locator: Btm, data: testData.Btm, cred:Credential.Btm}
]

for (const site of sites) {

    test.describe('Laporan Harian', () => {
  
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

        await page.goto(`${site.url}/asmat/laporan.harian`);

        await web.pilihTahun(site.data.PeriodeTahun);

        await web.pilihFilter(site.data.FilterBy);

        await web.pilihOutlet(site.data.Outlet);

        await web.enter();

        await web.pilihBulan(site.data.PeriodeBulan);

        const laporan = await web.ambilDataAll();

        exportToExcel(laporan, 
          `output/Laporan_Harian_${site.tag}_${site.data.PeriodeBulan}_${site.data.PeriodeTahun}_by ${site.data.FilterBy}.xlsx`, //Nama File
          `${(site.data.Outlet).substring(0, 31)}`); //Nama Sheet

      });
    
      test(`${site.tag} - Test Case 1 - Cek Laporan Harian`, async() => {
    
        const page = await context.newPage();
        
        const web = new site.locator(page);
            
        await page.goto(`${site.url}/asmat/laporan.harian`);

        await web.pilihTahun(site.data.PeriodeTahun);

        await web.pilihFilter(site.data.FilterBy);

        await web.pilihOutlet(site.data.Outlet);

        await web.enter();

        await web.pilihBulan(site.data.PeriodeBulan);

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

        await web.pilihTahun(site.data.PeriodeTahun);

        await web.pilihFilter(site.data.FilterBy);

        await web.pilihOutlet(site.data.Outlet);

        await web.enter();

        await web.pilihBulan(site.data.PeriodeBulan);

        const laporan = await web.ambilData(); // Data harian tanpa total

        const laporan_total = await web.ambilDataTotal(); // Data total setiap kolom

        const baris_total_val = await web.hitungTotalPerField(laporan);

        await web.validasiTotalPerField(laporan_total, baris_total_val);

        await page.pause();
                
      })
    
    });
  
  }