import { test, expect } from "@playwright/test";
import { Credential } from "../test-data/credential";
import { Daytrans } from "../pages/daytrans";
import { Baraya } from "../pages/baraya";
import { Aragon } from "../pages/aragon";
import { Jackal } from "../pages/jackal";
import { Btm } from "../pages/btm";
import { testData } from "../test-data/laporan_harian_data";
import { exportToExcel } from "../utils/excelHelper";
import { normalizeColumnToList } from "../utils/testHelper";
import { normalizeObjectKeyToList } from "../utils/testHelper";

const sites = [
  {tag: '@daytrans', url: 'https://dev.daytrans.asmat.app', locator: Daytrans, data: testData.Daytrans, cred:Credential.Daytrans},
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

        const laporan = await web.ambilDataAll(testData.IdentifierColumns);

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

        const laporan = await web.ambilDataHarian(testData.IdentifierColumns);

        // Ambil nilai aktual hanya id (tanggal) dan biaya-biaya pengeluaran
        const pengeluaran_act = laporan.map((row) => {
          const result = {
            id: row.tanggal
          };
        
          for (const kolom of normalizeObjectKeyToList(site.data.KolomPengeluaran)) {
            result[kolom] = row[kolom] ?? 0;
          }
        
          return result;
        });

        // Ambil nilai aktual hanya id (tanggal) dan biaya laba (total_biaya)
        const laba_act = laporan.map(({ tanggal, total_laba }) => ({ id: tanggal, total_laba }));

        const pengeluaran_val = await web.hitungPengeluaran(laporan, site.data.KolomPengeluaran, testData.MainIdentifier);

        const pendapatan_val = await web.hitungPendapatan(laporan, site.data.KolomPendapatan, testData.MainIdentifier);

        const laba_val = await web.hitungLaba(pendapatan_val, pengeluaran_val);

        await web.validasiPengeluaran({
          actual: pengeluaran_act,
          expected: pengeluaran_val
        });

        await web.validasiLaba({
          actual: laba_act,
          expected: laba_val,
          expected_column: "total_laba"
        });

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

        const laporan = await web.ambilDataHarian(testData.IdentifierColumns); // Data harian tanpa total

        const laporan_total = await web.ambilDataTotal(testData.IdentifierColumns); // Data total setiap kolom

        const baris_total_val = await web.hitungTotalPerField(laporan, testData.IdentifierColumns);

        await web.validasiTotalPerField(laporan_total, baris_total_val);

        await page.pause();
                
      })
    
    });
  
  }