import { test } from "@playwright/test";

import { Credential } from "../data/credential";

import { Daytrans } from "../pages/daytrans";
import { Baraya } from "../pages/baraya";
import { Aragon } from "../pages/aragon";
import { Jackal } from "../pages/jackal";
import { Btm } from "../pages/btm";

import { Laporan } from "../logics/laporan";

import { testData } from "../data/laporan_harian_data";

import { exportToExcel } from "../utils/excelHelper";

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
    
      test(`${site.tag} - Test Case 1 - Validasi Total Biaya Operasional Perhari`, async() => {
    
        const page = await context.newPage();
        
        const web = new site.locator(page);

        const logic = new Laporan(page, site.locator);
            
        await page.goto(`${site.url}/asmat/laporan.harian`);

        await web.pilihTahun(site.data.PeriodeTahun);

        await web.pilihFilter(site.data.FilterBy);

        await web.pilihOutlet(site.data.Outlet);

        await web.enter();

        await web.pilihBulan(site.data.PeriodeBulan);

        const laporan = await web.ambilDataHarian(testData.IdentifierColumns);

        // Ambil nilai aktual hanya id (tanggal) dan total biaya op
        const total_biaya_op_act = await logic.ambilTotalBiayaOpPerhari(laporan, testData.MainIdentifier, 'biaya_op_total');
        
        // Hitung total biaya op perhari sebagai nilai expected untuk validasi
        const total_biaya_op_exp = await logic.hitungTotalBiayaOp(laporan, testData.MainIdentifier, site.data.KolomPengeluaran.Biaya_Op, 'biaya_op_total');

        await logic.validasiArrayOfObject(total_biaya_op_act, total_biaya_op_exp, 'biaya_op_total');

        await page.pause();
                
      })

      test(`${site.tag} - Test Case 2 - Validasi Total Laba Perhari`, async() => {
    
        const page = await context.newPage();
        
        const web = new site.locator(page);

        const logic = new Laporan(page, site.locator);
            
        await page.goto(`${site.url}/asmat/laporan.harian`);

        await web.pilihTahun(site.data.PeriodeTahun);

        await web.pilihFilter(site.data.FilterBy);

        await web.pilihOutlet(site.data.Outlet);

        await web.enter();

        await web.pilihBulan(site.data.PeriodeBulan);

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
            
        await page.goto(`${site.url}/asmat/laporan.harian`);

        await web.pilihTahun(site.data.PeriodeTahun);

        await web.pilihFilter(site.data.FilterBy);

        await web.pilihOutlet(site.data.Outlet);

        await web.enter();

        await web.pilihBulan(site.data.PeriodeBulan);

        const laporan = await web.ambilDataHarian(testData.IdentifierColumns); // Data harian tanpa total

        const totals_act = await web.ambilDataTotal(testData.IdentifierColumns); // Data total setiap kolom

        const totals_exp = await logic.hitungTotalPerField(laporan, testData.IdentifierColumns);

        await logic.validasiArrayOfSingleObject(totals_act, totals_exp);

        await page.pause();
                
      })

      if (site.tag === '@daytrans') {
        test(`${site.tag} - Test Case 4 (Daytrans) - Validasi Total Biaya Komisi Perhari`, async() => {
    
          const page = await context.newPage();
          
          const web = new site.locator(page);
  
          const logic = new Laporan(page, site.locator);
              
          await page.goto(`${site.url}/asmat/laporan.harian`);
  
          await web.pilihTahun(site.data.PeriodeTahun);
  
          await web.pilihFilter(site.data.FilterBy);
  
          await web.pilihOutlet(site.data.Outlet);
  
          await web.enter();
  
          await web.pilihBulan(site.data.PeriodeBulan);
  
          const laporan = await web.ambilDataHarian(testData.IdentifierColumns);
  
          // Ambil nilai aktual hanya id (tanggal) dan total biaya op
          const total_komisi_act = await logic.ambilTotalKomisiPerhari(laporan, testData.MainIdentifier, 'komisi_total');
          
          // Hitung total biaya op perhari sebagai nilai expected untuk validasi
          const total_komisi_exp = await logic.hitungTotalKomisi(laporan, testData.MainIdentifier, site.data.KolomPengeluaran.Komisi);
  
          await logic.validasiArrayOfObject(total_komisi_act, total_komisi_exp, 'komisi_total');
  
          await page.pause();
                  
        })
      }
    
    });
  
  }