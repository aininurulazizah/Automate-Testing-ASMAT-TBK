import { test } from "@playwright/test";

import { Credential } from "../data/credential";

import { Daytrans } from "../pages/daytrans";
import { Baraya } from "../pages/baraya";
import { Aragon } from "../pages/aragon";
import { Jackal } from "../pages/jackal";
import { Btm } from "../pages/btm";

import { Laporan } from "../logics/laporan";

import { testData } from "../data/laporan_keseluruhan_data";

import { exportToExcel } from "../utils/excelHelper";

const sites = [
  // {tag: '@daytrans', url: 'https://dev.daytrans.asmat.app', locator: Daytrans, data: testData.Daytrans, cred:Credential.Daytrans},
  // {tag: '@baraya', url: 'https://dev.baraya.asmat.app', locator: Baraya, data: testData.Baraya, cred:Credential.Baraya},
  // {tag: '@aragon', url: 'https://dev.aragon.asmat.app', locator: Aragon, data: testData.Aragon, cred:Credential.Aragon},
  // {tag: '@jackal', url: 'https://dev.jackalx.asmat.app', locator: Jackal, data: testData.Jackal, cred:Credential.Jackal},
  {tag: '@btm', url: 'https://dev.btm.asmat.app', locator: Btm, data: testData.Btm, cred:Credential.Btm}
]

for (const site of sites) {

    test.describe('Laporan Keseluruhan', () => {
  
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

        await page.goto(`${site.url}/asmat/laporan.keseluruhan`);

        await web.pilihTahun(site.data.PeriodeTahun);

        await web.pilihFilter(site.data.FilterBy);

        if(site.data.Layanan) {
          await web.pilihLayanan(site.data.Layanan);
        }

        await web.enter();

        await web.pilihBulan(site.data.PeriodeBulan);

        const laporan = await web.ambilDataAll(testData.IdentifierColumns);

        exportToExcel(laporan, 
          `output/Laporan_Keseluruhan_${site.tag}_${site.data.PeriodeBulan}_${site.data.PeriodeTahun}_by ${site.data.FilterBy}.xlsx`, //Nama File
          `${(site.data.Layanan).substring(0, 31)}`); //Nama Sheet

      });
    
      test(`${site.tag} - Test Case 1 - Validasi Jumlah Penumpang Perhari`, async() => {
    
        const page = await context.newPage();
        
        const web = new site.locator(page);

        const logic = new Laporan(page, site.locator);
            
        await page.goto(`${site.url}/asmat/laporan.keseluruhan`);

        await web.pilihTahun(site.data.PeriodeTahun);

        await web.pilihFilter(site.data.FilterBy);

        if(site.data.Layanan) {
          await web.pilihLayanan(site.data.Layanan);
        }

        await web.enter();

        await web.pilihBulan(site.data.PeriodeBulan);

        const laporan = await web.ambilDataDetail(testData.IdentifierColumns);

        // Ambil nilai aktual hanya id (tanggal) dan total jumlah penumpang
        const total_jml_penumpang_act = await logic.ambilTotalPerBaris(laporan, testData.MainIdentifier, 'jml_penumpang_total');
        
        // Hitung total jumlah penumpang perhari sebagai nilai expected untuk validasi
        const total_jml_penumpang_exp = await logic.hitungTotalPerBaris(laporan, testData.MainIdentifier, site.data.KolomNonMonetary.JmlPenumpang, 'jml_penumpang_total');

        await logic.validasiArrayOfObject(total_jml_penumpang_act, total_jml_penumpang_exp, 'jml_penumpang_total');

        // await page.pause();
                
      })

      test(`${site.tag} - Test Case 2 - Validasi Jumlah Penumpang By Pembayaran Perhari`, async() => {
    
        const page = await context.newPage();
        
        const web = new site.locator(page);

        const logic = new Laporan(page, site.locator);
            
        await page.goto(`${site.url}/asmat/laporan.keseluruhan`);

        await web.pilihTahun(site.data.PeriodeTahun);

        await web.pilihFilter(site.data.FilterBy);

        if(site.data.Layanan) {
          await web.pilihLayanan(site.data.Layanan);
        }

        await web.enter();

        await web.pilihBulan(site.data.PeriodeBulan);

        const laporan = await web.ambilDataDetail(testData.IdentifierColumns);

        // Ambil nilai aktual hanya id (tanggal) dan total jumlah penumpang by pembayaran
        const total_jml_penumpang_by_pembayaran_act = await logic.ambilTotalPerBaris(laporan, testData.MainIdentifier, 'jml_penumpang_by_pembayaran_total');
        
        // Hitung total jumlah penumpang by pembayaran perhari sebagai nilai expected untuk validasi
        const total_jml_penumpang_by_pembayaran_exp = await logic.hitungTotalPerBaris(laporan, testData.MainIdentifier, site.data.KolomNonMonetary.JmlPenumpangByPembayaran, 'jml_penumpang_by_pembayaran_total');

        await logic.validasiArrayOfObject(total_jml_penumpang_by_pembayaran_act, total_jml_penumpang_by_pembayaran_exp, 'jml_penumpang_by_pembayaran_total');

        // await page.pause();
                
      })

      test(`${site.tag} - Test Case 3 - Validasi Jumlah Penumpang & Jumlah Penumpang By Pembayaran Perhari`, async() => {
       
        const page = await context.newPage();
        
        const web = new site.locator(page);

        const logic = new Laporan(page, site.locator);
            
        await page.goto(`${site.url}/asmat/laporan.keseluruhan`);

        await web.pilihTahun(site.data.PeriodeTahun);

        await web.pilihFilter(site.data.FilterBy);

        if(site.data.Layanan) {
          await web.pilihLayanan(site.data.Layanan);
        }

        await web.enter();

        await web.pilihBulan(site.data.PeriodeBulan);

        const laporan = await web.ambilDataDetail(testData.IdentifierColumns);

        // Ambil nilai aktual hanya id (tanggal) dan total jumlah penumpang
        const total_jml_penumpang = await logic.ambilTotalPerBaris(laporan, testData.MainIdentifier, 'jml_penumpang_total');
        
        // Ambil nilai aktual hanya id (tanggal) dan total jumlah penumpang by pembayaran
        const total_jml_penumpang_by_pembayaran = await logic.ambilTotalPerBaris(laporan, testData.MainIdentifier, 'jml_penumpang_by_pembayaran_total');

        await logic.validasiArrayOfObjectDiffExpectedCol(total_jml_penumpang, total_jml_penumpang_by_pembayaran, 'jml_penumpang_total', 'jml_penumpang_by_pembayaran_total');

        // await page.pause();
                
      })

      // test(`${site.tag} - Test Case 4 - Validasi Rata - Rata Penumpang Perhari`, async() => {
    
                
      // })

      // test(`${site.tag} - Test Case 5 - Validasi Pendapatan Penumpang Perhari`, async() => {
    
                
      // })

      test(`${site.tag} - Test Case 6 - Validasi Jumlah Paket Perhari`, async() => {
    
        const page = await context.newPage();
        
        const web = new site.locator(page);

        const logic = new Laporan(page, site.locator);
            
        await page.goto(`${site.url}/asmat/laporan.keseluruhan`);

        await web.pilihTahun(site.data.PeriodeTahun);

        await web.pilihFilter(site.data.FilterBy);

        if(site.data.Layanan) {
          await web.pilihLayanan(site.data.Layanan);
        }

        await web.enter();

        await web.pilihBulan(site.data.PeriodeBulan);

        const laporan = await web.ambilDataDetail(testData.IdentifierColumns);

        // Ambil nilai aktual hanya id (tanggal) dan total jumlah penumpang by pembayaran
        const jml_paket_act = await logic.ambilTotalPerBaris(laporan, testData.MainIdentifier, 'jml_paket_total');
        
        // Hitung total jumlah penumpang by pembayaran perhari sebagai nilai expected untuk validasi
        const jml_paket_exp = await logic.hitungTotalPerBaris(laporan, testData.MainIdentifier, site.data.KolomNonMonetary.JmlPaket, 'jml_paket_total');

        await logic.validasiArrayOfObject(jml_paket_act, jml_paket_exp, 'jml_paket_total');

        // await page.pause();
                
      })

      // test(`${site.tag} - Test Case 7 - Validasi Rata - Rata Paket Perhari`, async() => {
    
                
      // })

      test(`${site.tag} - Test Case 8 - Validasi Total Omzet Paket Perhari`, async() => {
    
        const page = await context.newPage();
        
        const web = new site.locator(page);

        const logic = new Laporan(page, site.locator);
            
        await page.goto(`${site.url}/asmat/laporan.keseluruhan`);

        await web.pilihTahun(site.data.PeriodeTahun);

        await web.pilihFilter(site.data.FilterBy);

        if(site.data.Layanan) {
          await web.pilihLayanan(site.data.Layanan);
        }

        await web.enter();

        await web.pilihBulan(site.data.PeriodeBulan);

        const laporan = await web.ambilDataDetail(testData.IdentifierColumns);

        // Ambil nilai aktual hanya id (tanggal) dan total jumlah penumpang by pembayaran
        const total_omzet_paket_act = await logic.ambilTotalPerBaris(laporan, testData.MainIdentifier, 'omzet_paket_total');
        
        // Hitung total jumlah penumpang by pembayaran perhari sebagai nilai expected untuk validasi
        const total_omzet_paket_exp = await logic.hitungTotalPerBaris(laporan, testData.MainIdentifier, site.data.KolomPendapatan.OmzetPaket, 'omzet_paket_total');

        await logic.validasiArrayOfObject(total_omzet_paket_act, total_omzet_paket_exp, 'omzet_paket_total');

        // await page.pause();
                
      })

      // test(`${site.tag} - Test Case 9 - Validasi Total Omzet Perhari`, async() => {
    
                
      // })

      test(`${site.tag} - Test Case 10 - Validasi Total Biaya Op Perhari`, async() => {
    
        const page = await context.newPage();
        
        const web = new site.locator(page);

        const logic = new Laporan(page, site.locator);
            
        await page.goto(`${site.url}/asmat/laporan.keseluruhan`);

        await web.pilihTahun(site.data.PeriodeTahun);

        await web.pilihFilter(site.data.FilterBy);

        if(site.data.Layanan) {
          await web.pilihLayanan(site.data.Layanan);
        }

        await web.enter();

        await web.pilihBulan(site.data.PeriodeBulan);

        const laporan = await web.ambilDataDetail(testData.IdentifierColumns);

        // Ambil nilai aktual hanya id (tanggal) dan total jumlah penumpang by pembayaran
        const total_biaya_op_act = await logic.ambilTotalPerBaris(laporan, testData.MainIdentifier, 'biaya_op_total');
        
        // Hitung total jumlah penumpang by pembayaran perhari sebagai nilai expected untuk validasi
        const total_biaya_op_exp = await logic.hitungTotalPerBaris(laporan, testData.MainIdentifier, site.data.KolomPengeluaran.BiayaOp, 'biaya_op_total');

        await logic.validasiArrayOfObject(total_biaya_op_act, total_biaya_op_exp, 'biaya_op_total');

        // await page.pause();
                
      })

      // test(`${site.tag} - Test Case 11 - Validasi Total Laba Kotor Perhari`, async() => {
    
                
      // })
    
    });
  
  }