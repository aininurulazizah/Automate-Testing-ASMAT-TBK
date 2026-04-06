import { test } from "@playwright/test";

import { Credential } from "../data/credential";

import { Baraya } from "../pages/baraya";
import { Aragon } from "../pages/aragon";
import { Jackal } from "../pages/jackal";
import { Btm } from "../pages/btm";

import { Laporan } from "../logics/laporan";

import { testData } from "../data/laporan_outlet_data";

import { exportToExcel } from "../utils/excelHelper";

const sites = [
  {tag: '@baraya', url: 'https://dev.baraya.asmat.app', locator: Baraya, data: testData.Baraya, cred:Credential.Baraya},
  {tag: '@aragon', url: 'https://dev.aragon.asmat.app', locator: Aragon, data: testData.Aragon, cred:Credential.Aragon},
  {tag: '@jackal', url: 'https://dev.jackalx.asmat.app', locator: Jackal, data: testData.Jackal, cred:Credential.Jackal},
  {tag: '@btm', url: 'https://dev.btm.asmat.app', locator: Btm, data: testData.Btm, cred:Credential.Btm}
]

for (const site of sites) {

    test.describe('Laporan Outlet', () => {
  
      test.setTimeout(60000);
    
      let context;

      let initialCaseNumber = 0;

      const caseNumber = () => initialCaseNumber++;
    
      test.beforeAll(async ({ browser }) => {
          test.setTimeout(60000);
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


      test(`${site.tag} - Test Case ${caseNumber()} - Ekspor Laporan Ke Excel`, async() => {

        const page = await context.newPage();

        const web = new site.locator(page);

        await page.goto(`${site.url}/asmat/laporan.outlet`);

        await web.pilihPeriodeAwal(site.data.PeriodeAwalTahun, site.data.PeriodeAwalBulan, site.data.PeriodeAwalTanggal);

        await web.pilihPeriodeAkhir(site.data.PeriodeAkhirTahun, site.data.PeriodeAkhirBulan, site.data.PeriodeAkhirTanggal);

        await web.pilihFilter(site.data.FilterBy);

        await web.enter();

        const laporan = await web.ambilDataAll(testData.IdentifierColumns);

        exportToExcel(laporan, 
            `output/laporan/Laporan_Outlet_${site.tag}_${site.data.PeriodeAwalBulan}${site.data.PeriodeAwalTahun}-${site.data.PeriodeAkhirBulan}${site.data.PeriodeAkhirTahun}_by ${site.data.FilterBy}.xlsx`, //Nama File
            `${site.data.PeriodeAwalBulan}${site.data.PeriodeAwalTahun}-${site.data.PeriodeAkhirBulan}${site.data.PeriodeAkhirTahun}`); //Nama Sheet

      });

      if (site.data.KolomNonMonetary.JmlTiket) {

        test(`${site.tag} - Test Case ${caseNumber()} - Validasi Jumlah Penumpang/Tiket Perhari`, async() => {
    
          const page = await context.newPage();
          
          const web = new site.locator(page);
  
          const logic = new Laporan(page, site.locator);
              
          await page.goto(`${site.url}/asmat/laporan.outlet`);
  
          await web.pilihPeriodeAwal(site.data.PeriodeAwalTahun, site.data.PeriodeAwalBulan, site.data.PeriodeAwalTanggal);

          await web.pilihPeriodeAkhir(site.data.PeriodeAkhirTahun, site.data.PeriodeAkhirBulan, site.data.PeriodeAkhirTanggal);
  
          await web.pilihFilter(site.data.FilterBy);
  
          await web.enter();
  
          const laporan = await web.ambilDataDetail(testData.IdentifierColumns);

          const nama_kolom = site.tag === '@baraya' ? 'jumlah_penumpang_total' : 'jumlah_tiket_total'; 
  
          // Ambil nilai aktual hanya id (tanggal) dan total jumlah penumpang
          const total_jml_penumpang_act = await logic.ambilTotalPerBaris(laporan, testData.MainIdentifier, nama_kolom);
          
          // Hitung total jumlah penumpang perhari sebagai nilai expected untuk validasi
          const total_jml_penumpang_exp = await logic.hitungTotalPerBaris(laporan, testData.MainIdentifier, site.data.KolomNonMonetary.JmlTiket, nama_kolom);
  
          await logic.validasiArrayOfObject(total_jml_penumpang_act, total_jml_penumpang_exp, nama_kolom);
  
          // await page.pause();
                  
        })

      }

      if (site.data.KolomPendapatan.PenjualanTiket) {

        test(`${site.tag} - Test Case ${caseNumber()} - Validasi Total Penjualan Tiket Perhari`, async() => {
    
            const page = await context.newPage();
            
            const web = new site.locator(page);
    
            const logic = new Laporan(page, site.locator);
                
            await page.goto(`${site.url}/asmat/laporan.outlet`);
    
            await web.pilihPeriodeAwal(site.data.PeriodeAwalTahun, site.data.PeriodeAwalBulan, site.data.PeriodeAwalTanggal);
  
            await web.pilihPeriodeAkhir(site.data.PeriodeAkhirTahun, site.data.PeriodeAkhirBulan, site.data.PeriodeAkhirTanggal);
    
            await web.pilihFilter(site.data.FilterBy);
    
            await web.enter();
    
            const laporan = await web.ambilDataDetail(testData.IdentifierColumns);
    
            // Ambil nilai aktual hanya id (tanggal) dan total jumlah penumpang
            const total_penjualan_tiket_act = await logic.ambilTotalPerBaris(laporan, testData.MainIdentifier, 'penjualan_tiket_total');
            
            // Hitung total jumlah penumpang perhari sebagai nilai expected untuk validasi
            const total_penjualan_tiket_exp = await logic.hitungTotalPerBaris(laporan, testData.MainIdentifier, site.data.KolomPendapatan.PenjualanTiket, 'penjualan_tiket_total');
    
            await logic.validasiArrayOfObject(total_penjualan_tiket_act, total_penjualan_tiket_exp, 'penjualan_tiket_total');
    
            // await page.pause();
                    
          })

      }

      if (site.data.KolomNonMonetary.JmlPaket) {

        test(`${site.tag} - Test Case ${caseNumber()} - Validasi Total Jumlah Paket Perhari`, async() => {
    
            const page = await context.newPage();
            
            const web = new site.locator(page);
    
            const logic = new Laporan(page, site.locator);
                
            await page.goto(`${site.url}/asmat/laporan.outlet`);
    
            await web.pilihPeriodeAwal(site.data.PeriodeAwalTahun, site.data.PeriodeAwalBulan, site.data.PeriodeAwalTanggal);
  
            await web.pilihPeriodeAkhir(site.data.PeriodeAkhirTahun, site.data.PeriodeAkhirBulan, site.data.PeriodeAkhirTanggal);
    
            await web.pilihFilter(site.data.FilterBy);
    
            await web.enter();
    
            const laporan = await web.ambilDataDetail(testData.IdentifierColumns);
    
            // Ambil nilai aktual hanya id (tanggal) dan total jumlah penumpang
            const total_jml_paket_act = await logic.ambilTotalPerBaris(laporan, testData.MainIdentifier, 'jumlah_paket_total');
            
            // Hitung total jumlah penumpang perhari sebagai nilai expected untuk validasi
            const total_jml_paket_exp = await logic.hitungTotalPerBaris(laporan, testData.MainIdentifier, site.data.KolomNonMonetary.JmlPaket, 'jumlah_paket_total');
    
            await logic.validasiArrayOfObject(total_jml_paket_act, total_jml_paket_exp, 'jumlah_paket_total');
    
            // await page.pause();

        })

      }

      if (site.data.KolomPendapatan.PenjualanPaket) {

        if (site.data.KolomPendapatan.PenjualanPaket.length > 1) {

          test(`${site.tag} - Test Case ${caseNumber()} - Validasi Total Penjualan Paket Perhari`, async() => {
      
              const page = await context.newPage();
              
              const web = new site.locator(page);
      
              const logic = new Laporan(page, site.locator);
                  
              await page.goto(`${site.url}/asmat/laporan.outlet`);
      
              await web.pilihPeriodeAwal(site.data.PeriodeAwalTahun, site.data.PeriodeAwalBulan, site.data.PeriodeAwalTanggal);
    
              await web.pilihPeriodeAkhir(site.data.PeriodeAkhirTahun, site.data.PeriodeAkhirBulan, site.data.PeriodeAkhirTanggal);
      
              await web.pilihFilter(site.data.FilterBy);
      
              await web.enter();
      
              const laporan = await web.ambilDataDetail(testData.IdentifierColumns);
      
              // Ambil nilai aktual hanya id (tanggal) dan total jumlah penumpang
              const total_penjualan_paket_act = await logic.ambilTotalPerBaris(laporan, testData.MainIdentifier, 'penjualan_paket_total');
              
              // Hitung total jumlah penumpang perhari sebagai nilai expected untuk validasi
              const total_penjualan_paket_exp = await logic.hitungTotalPerBaris(laporan, testData.MainIdentifier, site.data.KolomPendapatan.PenjualanPaket, 'penjualan_paket_total');
  
              await logic.validasiArrayOfObject(total_penjualan_paket_act, total_penjualan_paket_exp, 'penjualan_paket_total');
      
              // await page.pause();
                      
            })
  
        }

      }

      if (site.data.KolomPengeluaran.Discount) {

        if (site.data.KolomPengeluaran.Discount.length > 1) {

          test(`${site.tag} - Test Case ${caseNumber()} - Validasi Total Discount Perhari`, async() => {
      
              const page = await context.newPage();
              
              const web = new site.locator(page);
      
              const logic = new Laporan(page, site.locator);
                  
              await page.goto(`${site.url}/asmat/laporan.outlet`);
      
              await web.pilihPeriodeAwal(site.data.PeriodeAwalTahun, site.data.PeriodeAwalBulan, site.data.PeriodeAwalTanggal);
    
              await web.pilihPeriodeAkhir(site.data.PeriodeAkhirTahun, site.data.PeriodeAkhirBulan, site.data.PeriodeAkhirTanggal);
      
              await web.pilihFilter(site.data.FilterBy);
      
              await web.enter();
      
              const laporan = await web.ambilDataDetail(testData.IdentifierColumns);
      
              // Ambil nilai aktual hanya id (tanggal) dan total jumlah penumpang
              const total_discount_act = await logic.ambilTotalPerBaris(laporan, testData.MainIdentifier, 'penjualan_tiket_total_diskon');
              
              // Hitung total jumlah penumpang perhari sebagai nilai expected untuk validasi
              const total_discount_exp = await logic.hitungTotalPerBaris(laporan, testData.MainIdentifier, site.data.KolomPengeluaran.Discount, 'penjualan_tiket_total_diskon');
      
              await logic.validasiArrayOfObject(total_discount_act, total_discount_exp, 'penjualan_tiket_total_diskon');
      
              // await page.pause();
  
          })
  
        }

      }


      if (site.tag === '@btm' || site.tag === '@aragon') {

        test(`${site.tag} - Test Case ${caseNumber()} - Validasi Total Pendapatan Tiket Perhari`, async() => {
    
            const page = await context.newPage();
            
            const web = new site.locator(page);
    
            const logic = new Laporan(page, site.locator);
                
            await page.goto(`${site.url}/asmat/laporan.outlet`);
    
            await web.pilihPeriodeAwal(site.data.PeriodeAwalTahun, site.data.PeriodeAwalBulan, site.data.PeriodeAwalTanggal);
  
            await web.pilihPeriodeAkhir(site.data.PeriodeAkhirTahun, site.data.PeriodeAkhirBulan, site.data.PeriodeAkhirTanggal);
    
            await web.pilihFilter(site.data.FilterBy);
    
            await web.enter();
    
            const laporan = await web.ambilDataDetail(testData.IdentifierColumns);
    
            // Ambil nilai aktual hanya id (tanggal) dan total jumlah penumpang
            const total_pendapatan_tiket_act = await logic.ambilTotalPerBaris(laporan, testData.MainIdentifier, 'penjualan_tiket_total_pendapatan');
            
            // Hitung total jumlah penumpang perhari sebagai nilai expected untuk validasi
            const total_pendapatan_tiket_exp = await logic.hitungSelisihKategori(
                                                    laporan, 
                                                    testData.MainIdentifier,     
                                                    { PenjualanTiket: site.data.KolomPendapatan.PenjualanTiket },
                                                    { Discount: site.data.KolomPengeluaran.Discount },
                                                    'penjualan_tiket_total_pendapatan'
                                                );
    
            await logic.validasiArrayOfObject(total_pendapatan_tiket_act, total_pendapatan_tiket_exp, 'penjualan_tiket_total_pendapatan');
    
            // await page.pause();

        })

      }

      if (site.data.KolomPengeluaran.BiayaOp.length > 1) {

        test(`${site.tag} - Test Case ${caseNumber()} - Validasi Total Biaya Op Perhari`, async() => {
    
            const page = await context.newPage();
            
            const web = new site.locator(page);
    
            const logic = new Laporan(page, site.locator);
                
            await page.goto(`${site.url}/asmat/laporan.outlet`);
    
            await web.pilihPeriodeAwal(site.data.PeriodeAwalTahun, site.data.PeriodeAwalBulan, site.data.PeriodeAwalTanggal);
  
            await web.pilihPeriodeAkhir(site.data.PeriodeAkhirTahun, site.data.PeriodeAkhirBulan, site.data.PeriodeAkhirTanggal);
    
            await web.pilihFilter(site.data.FilterBy);
    
            await web.enter();
    
            const laporan = await web.ambilDataDetail(testData.IdentifierColumns);

            const nama_kolom = site.tag === '@jackal' ? 'biaya_total_biaya_keseluruhan' : 'biaya_op_total';
    
            // Ambil nilai aktual hanya id (tanggal) dan total jumlah penumpang
            const total_biaya_op_act = await logic.ambilTotalPerBaris(laporan, testData.MainIdentifier, nama_kolom);
            
            // Hitung total jumlah penumpang perhari sebagai nilai expected untuk validasi
            const total_biaya_op_exp = await logic.hitungTotalPerBaris(laporan, testData.MainIdentifier, site.data.KolomPengeluaran.BiayaOp, nama_kolom);
    
            await logic.validasiArrayOfObject(total_biaya_op_act, total_biaya_op_exp, nama_kolom);
    
            // await page.pause();

        })

      }

      test(`${site.tag} - Test Case ${caseNumber()} - Validasi Total Laba Perhari`, async() => {
    
        const page = await context.newPage();
        
        const web = new site.locator(page);

        const logic = new Laporan(page, site.locator);
            
        await page.goto(`${site.url}/asmat/laporan.outlet`);

        await web.pilihPeriodeAwal(site.data.PeriodeAwalTahun, site.data.PeriodeAwalBulan, site.data.PeriodeAwalTanggal);

        await web.pilihPeriodeAkhir(site.data.PeriodeAkhirTahun, site.data.PeriodeAkhirBulan, site.data.PeriodeAkhirTanggal);

        await web.pilihFilter(site.data.FilterBy);

        await web.enter();

        const laporan = await web.ambilDataDetail(testData.IdentifierColumns);

        const nama_kolom = site.tag === '@btm' || site.tag === '@aragon' ? 'total_laba' : 'total_laba_kotor' ;

        // Ambil nilai aktual hanya id (tanggal) dan total biaya op
        const total_laba_act = await logic.ambilTotalPerBaris(laporan, testData.MainIdentifier, nama_kolom);
        
        // Hitung total biaya op perhari sebagai nilai expected untuk validasi
        const total_laba_exp =  await logic.hitungSelisihKategori (
                                  laporan, 
                                  testData.MainIdentifier, 
                                  site.data.KolomPendapatan, 
                                  site.data.KolomPengeluaran, 
                                  nama_kolom
                                );

        await logic.validasiArrayOfObject(total_laba_act, total_laba_exp, nama_kolom);

        // await page.pause();

      })

      if (site.data.KolomPengeluaran.Komisi) {

        test(`${site.tag} - Test Case ${caseNumber()} - Validasi Total Komisi Perhari`, async() => {
    
          const page = await context.newPage();
          
          const web = new site.locator(page);
  
          const logic = new Laporan(page, site.locator);
              
          await page.goto(`${site.url}/asmat/laporan.outlet`);
  
          await web.pilihPeriodeAwal(site.data.PeriodeAwalTahun, site.data.PeriodeAwalBulan, site.data.PeriodeAwalTanggal);

          await web.pilihPeriodeAkhir(site.data.PeriodeAkhirTahun, site.data.PeriodeAkhirBulan, site.data.PeriodeAkhirTanggal);
  
          await web.pilihFilter(site.data.FilterBy);
  
          await web.enter();
  
          const laporan = await web.ambilDataDetail(testData.IdentifierColumns);
  
          // Ambil nilai aktual hanya id (tanggal) dan total jumlah penumpang
          const total_komisi_act = await logic.ambilTotalPerBaris(laporan, testData.MainIdentifier, 'total_komisi');
          
          // Hitung total jumlah penumpang perhari sebagai nilai expected untuk validasi
          const total_komisi_exp = await logic.hitungTotalPerBaris(laporan, testData.MainIdentifier, site.data.KolomPengeluaran.Komisi, 'total_komisi');
  
          await logic.validasiArrayOfObject(total_komisi_act, total_komisi_exp, 'total_komisi');
  
          // await page.pause();

      })

      }

      test(`${site.tag} - Test Case ${caseNumber()} - Cek Laporan Total Bulanan`, async() => {
    
        const page = await context.newPage();
          
        const web = new site.locator(page);

        const logic = new Laporan(page, site.locator);
            
        await page.goto(`${site.url}/asmat/laporan.outlet`);

        await web.pilihPeriodeAwal(site.data.PeriodeAwalTahun, site.data.PeriodeAwalBulan, site.data.PeriodeAwalTanggal);

        await web.pilihPeriodeAkhir(site.data.PeriodeAkhirTahun, site.data.PeriodeAkhirBulan, site.data.PeriodeAkhirTanggal);

        await web.pilihFilter(site.data.FilterBy);

        await web.enter();
  
        const laporan = await web.ambilDataDetail(testData.IdentifierColumns); // Data harian tanpa total
  
        const totals_act = await web.ambilDataTotal(testData.IdentifierColumns); // Data total setiap kolom
  
        const totals_exp = await logic.hitungTotalPerField(laporan, testData.IdentifierColumns);
  
        await logic.validasiArrayOfSingleObject(totals_act, totals_exp);
  
        // await page.pause();
                
      })

    })
}