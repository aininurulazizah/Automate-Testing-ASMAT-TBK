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
  {tag: '@daytrans', url: 'https://dev.daytrans.asmat.app', locator: Daytrans, data: testData.Daytrans, cred:Credential.Daytrans},
  {tag: '@baraya', url: 'https://dev.baraya.asmat.app', locator: Baraya, data: testData.Baraya, cred:Credential.Baraya},
  // {tag: '@aragon', url: 'https://dev.aragon.asmat.app', locator: Aragon, data: testData.Aragon, cred:Credential.Aragon},
  // {tag: '@jackal', url: 'https://dev.jackalx.asmat.app', locator: Jackal, data: testData.Jackal, cred:Credential.Jackal},
  {tag: '@btm', url: 'https://dev.btm.asmat.app', locator: Btm, data: testData.Btm, cred:Credential.Btm}
]

for (const site of sites) {

    test.describe('Laporan Keseluruhan', () => {
  
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

        await page.goto(`${site.url}/asmat/laporan.keseluruhan`);

        await web.pilihTahun(site.data.PeriodeTahun);

        await web.pilihFilter(site.data.FilterBy);

        if(site.data.Layanan) {
          await web.pilihLayanan(site.data.Layanan);
        }

        await web.enter();

        await web.pilihBulan(site.data.PeriodeBulan);

        const laporan = await web.ambilDataAll(testData.IdentifierColumns);

        const layanan = site.data.layanan ? site.data.layanan : "";

        exportToExcel(laporan, 
          `output/Laporan_Keseluruhan_${site.tag}_${site.data.PeriodeBulan}_${site.data.PeriodeTahun}_by ${site.data.FilterBy}.xlsx`, //Nama File
          `${(layanan).substring(0, 31)}`); //Nama Sheet

      });

      if (site.data.KolomNonMonetary.JmlPenumpang) {

        test(`${site.tag} - Test Case ${caseNumber()} - Validasi Jumlah Penumpang Perhari`, async() => {
    
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

      }

      if(site.data.KolomNonMonetary.JmlPenumpangByPembayaran) {

        test(`${site.tag} - Test Case ${caseNumber()} - Validasi Jumlah Penumpang By Pembayaran Perhari`, async() => {
    
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

      }

      if (site.data.KolomNonMonetary.JmlPenumpang && site.data.KolomNonMonetary.JmlPenumpangByPembayaran) {

        test(`${site.tag} - Test Case ${caseNumber()} - Validasi Jumlah Penumpang & Jumlah Penumpang By Pembayaran Perhari`, async() => {
       
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

      }

      if (site.tag === '@btm' || site.tag === '@baraya') {

        test(`${site.tag} - Test Case ${caseNumber()} - Validasi Rata - Rata Penumpang Perhari`, async() => {
    
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
  
          // Ambil nilai aktual hanya id (tanggal) dan avg penumpang
          const avg_penumpang_act = await logic.ambilTotalPerBaris(laporan, testData.MainIdentifier, 'avg_penumpang');
          
          // Hitung avg penumpang sebagai validasi
          const avg_penumpang_exp = await logic.hitungAveragePerBaris(laporan, testData.MainIdentifier, 'jml_penumpang_total', 'trip', 'avg_penumpang');
  
          await logic.validasiArrayOfObject(avg_penumpang_act, avg_penumpang_exp, 'avg_penumpang');
  
          // await page.pause();
                  
        })

      }

      if(site.data.KolomPendapatan.OmzetPenumpang.length > 1) {

        test(`${site.tag} - Test Case ${caseNumber()} - Validasi Total Omzet Penumpang Perhari`, async() => {
    
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
          const total_omzet_penumpang_act = await logic.ambilTotalPerBaris(laporan, testData.MainIdentifier, 'omzet_penumpang_total');
          
          // Hitung total jumlah penumpang by pembayaran perhari sebagai nilai expected untuk validasi
          const total_omzet_penumpang_exp = await logic.hitungTotalPerBaris(laporan, testData.MainIdentifier, site.data.KolomPendapatan.OmzetPenumpang, 'omzet_penumpang_total');
  
          await logic.validasiArrayOfObject(total_omzet_penumpang_act, total_omzet_penumpang_exp, 'omzet_penumpang_total');
  
          // await page.pause();
                  
        })

      }

      test(`${site.tag} - Test Case ${caseNumber()} - Validasi Pendapatan Penumpang Perhari`, async() => {
    
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

        const nama_kolom = site.tag === '@daytrans' ? 'pendapatan_pnp_nett_total' : 'pendapatan_penumpang'

        const pendapatan_penumpang_act =  await logic.ambilTotalPerBaris(laporan, testData.MainIdentifier, nama_kolom);

        let pendapatan_penumpang_exp;

        if (site.tag === '@daytrans') {

          pendapatan_penumpang_exp = await logic.hitungTotalPerBaris(laporan, testData.MainIdentifier, site.data.KolomNonMonetary.PendapatanPnp, nama_kolom);

        } else {

          pendapatan_penumpang_exp =  await logic.hitungSelisihKategori(
            laporan, 
            testData.MainIdentifier,     
            { OmzetPenumpang: site.data.KolomPendapatan.OmzetPenumpang },
            { Discount: site.data.KolomPengeluaran.Discount },
            nama_kolom
          );

        }
  
        await logic.validasiArrayOfObject(pendapatan_penumpang_act, pendapatan_penumpang_exp, nama_kolom);

        // await page.pause();
                
      })

      test(`${site.tag} - Test Case ${caseNumber()} - Validasi Jumlah Paket Perhari`, async() => {
    
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

        const nama_kolom = site.tag === '@daytrans' ? 'jum_paket_total' : 'jml_paket_total';
          
        // Ambil nilai aktual hanya id (tanggal) dan total jumlah penumpang by pembayaran
        const jml_paket_act = await logic.ambilTotalPerBaris(laporan, testData.MainIdentifier, nama_kolom);
        
        // Hitung total jumlah penumpang by pembayaran perhari sebagai nilai expected untuk validasi
        const jml_paket_exp = await logic.hitungTotalPerBaris(laporan, testData.MainIdentifier, site.data.KolomNonMonetary.JmlPaket, nama_kolom);

        await logic.validasiArrayOfObject(jml_paket_act, jml_paket_exp, nama_kolom);

        // await page.pause();
                
      })

      // test(`${site.tag} - Test Case 8 - Validasi Rata - Rata Paket Perhari`, async() => {
    
                
      // })

      test(`${site.tag} - Test Case ${caseNumber()} - Validasi Total Omzet Paket Perhari`, async() => {
    
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

        const nama_kolom = site.tag === '@daytrans' ? 'omzet_pkt_total' : 'omzet_paket_total'

        // Ambil nilai aktual hanya id (tanggal) dan total jumlah penumpang by pembayaran
        const total_omzet_paket_act = await logic.ambilTotalPerBaris(laporan, testData.MainIdentifier, nama_kolom);
        
        // Hitung total jumlah penumpang by pembayaran perhari sebagai nilai expected untuk validasi
        const total_omzet_paket_exp = await logic.hitungTotalPerBaris(laporan, testData.MainIdentifier, site.data.KolomPendapatan.OmzetPaket, nama_kolom);

        await logic.validasiArrayOfObject(total_omzet_paket_act, total_omzet_paket_exp, nama_kolom);

        // await page.pause();
                
      })

      test(`${site.tag} - Test Case ${caseNumber()} - Validasi Total Omzet Perhari`, async() => {
    
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

        const total_omzet_act =  await logic.ambilTotalPerBaris(laporan, testData.MainIdentifier, 'total_omzet');

        const total_omzet_exp =  await logic.hitungSelisihKategori(
                                            laporan, 
                                            testData.MainIdentifier,     
                                            site.data.KolomPendapatan,
                                            { Discount: site.data.KolomPengeluaran.Discount },
                                            'total_omzet'
                                          );

        await logic.validasiArrayOfObject(total_omzet_act, total_omzet_exp, 'total_omzet');

        // await page.pause();
                
      })

      test(`${site.tag} - Test Case ${caseNumber()} - Validasi Total Biaya Op Perhari`, async() => {
    
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

        const nama_kolom = site.tag === '@daytrans' ? 'biaya_total_biaya_keseluruhan' : 'biaya_op_total';

        // Ambil nilai aktual hanya id (tanggal) dan total jumlah penumpang by pembayaran
        const total_biaya_op_act = await logic.ambilTotalPerBaris(laporan, testData.MainIdentifier, nama_kolom);
        
        // Hitung total jumlah penumpang by pembayaran perhari sebagai nilai expected untuk validasi
        const total_biaya_op_exp = await logic.hitungTotalPerBaris(laporan, testData.MainIdentifier, site.data.KolomPengeluaran.BiayaOp, nama_kolom);

        await logic.validasiArrayOfObject(total_biaya_op_act, total_biaya_op_exp, nama_kolom);

        // await page.pause();
                
      })

      test(`${site.tag} - Test Case ${caseNumber()} - Validasi Total Laba Kotor Perhari`, async() => {
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

        console.log(laporan);

        // await page.pause();

        const nama_kolom = site.tag === '@daytrans' ? 'l/b_kotor' : 'total_laba_kotor'

        const total_laba_kotor_act =  await logic.ambilTotalPerBaris(laporan, testData.MainIdentifier, nama_kolom);

        const total_laba_kotor_exp =  await logic.hitungSelisihKategori(
                                            laporan, 
                                            testData.MainIdentifier,     
                                            site.data.KolomPendapatan,
                                            site.data.KolomPengeluaran,
                                            nama_kolom
                                          );

        await logic.validasiArrayOfObject(total_laba_kotor_act, total_laba_kotor_exp, nama_kolom);

        // await page.pause();
                
      })

      if(site.data.KolomNonMonetary.TotalTrip) {
       
        test(`${site.tag} - Test Case ${caseNumber()} - Validasi Total Trip Perhari`, async() => {
       
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
  
          const total_trip_act =  await logic.ambilTotalPerBaris(laporan, testData.MainIdentifier, 'total_trip_total');
  
          const total_trip_exp =  await logic.hitungTotalPerBaris(laporan, testData.MainIdentifier, site.data.KolomNonMonetary.TotalTrip, 'total_trip_total');
  
          await logic.validasiArrayOfObject(total_trip_act, total_trip_exp, 'total_trip_total');
  
          // await page.pause();
                  
        })

      }

      if (site.data.KolomPengeluaran.Komisi) {

        test(`${site.tag} - Test Case ${caseNumber()} - Validasi Total Komisi Perhari`, async() => {
    
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
          const total_komisi_act = await logic.ambilTotalPerBaris(laporan, testData.MainIdentifier, 'komisi_total');
          
          // Hitung total jumlah penumpang by pembayaran perhari sebagai nilai expected untuk validasi
          const total_komisi_exp = await logic.hitungTotalPerBaris(laporan, testData.MainIdentifier, site.data.KolomPengeluaran.Komisi, 'komisi_total');
  
          await logic.validasiArrayOfObject(total_komisi_act, total_komisi_exp, 'komisi_total');
  
          // await page.pause();
                  
        })

      }

      const hasOmzetUnit = Object.keys(site.data.KolomNonMonetary).some(key => key.startsWith('OmzetUnit'));

      if (hasOmzetUnit) {

        const omzetUnits = Object.entries(site.data.KolomNonMonetary).filter(([key]) => key.startsWith('OmzetUnit'));

        for (const [key, value] of omzetUnits) {
          
          test(`${site.tag} - Test Case ${caseNumber()} - Validasi Omzet Unit Perhari`, async() => {
    
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
            const omzet_unit_act = await logic.ambilTotalPerBaris(laporan, testData.MainIdentifier, `${web.parseToSnakeCase(key)}_total`);
            
            // Hitung total jumlah penumpang by pembayaran perhari sebagai nilai expected untuk validasi
            const omzet_unit_exp = await logic.hitungTotalPerBaris(laporan, testData.MainIdentifier, value, `${web.parseToSnakeCase(key)}_total`);
    
            await logic.validasiArrayOfObject(omzet_unit_act, omzet_unit_exp, `${web.parseToSnakeCase(key)}_total`);
    
            // await page.pause();
                    
          })

        }

      }

      let hasTotalDiscount;

      for (const value of Object.values(site.data.KolomPengeluaran.Discount)) {

        if(value.includes('total')) {

          hasTotalDiscount = true;

        }
      }

      if (hasTotalDiscount) {

        test(`${site.tag} - Test Case ${caseNumber()} - Validasi Total Discount Perhari`, async() => {
    
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
          const total_discount_act = await logic.ambilTotalPerBaris(laporan, testData.MainIdentifier, `total_discount_penumpang_total`);
          
          // Hitung total jumlah penumpang by pembayaran perhari sebagai nilai expected untuk validasi
          const total_discount_exp = await logic.hitungTotalPerBaris(laporan, testData.MainIdentifier, site.data.KolomPengeluaran.Discount, `total_discount_penumpang_total`);
  
          await logic.validasiArrayOfObject(total_discount_act, total_discount_exp, `total_discount_penumpang_total`);
  
          // await page.pause();
                  
        })

      }

      let hasTotalDiscountPaket;

      if(site.data.KolomPengeluaran.DiscountPaket) {

        for (const value of Object.values(site.data.KolomPengeluaran.DiscountPaket)) {

          if(value.includes('total')) {
  
            hasTotalDiscountPaket = true;
  
          }
        }

      }

      if (hasTotalDiscountPaket) {

        test(`${site.tag} - Test Case ${caseNumber()} - Validasi Total Discount Paket Perhari`, async() => {
    
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
          const total_discount_paket_act = await logic.ambilTotalPerBaris(laporan, testData.MainIdentifier, `total_discount_paket_total`);
          
          // Hitung total jumlah penumpang by pembayaran perhari sebagai nilai expected untuk validasi
          const total_discount_paket_exp = await logic.hitungTotalPerBaris(laporan, testData.MainIdentifier, site.data.KolomPengeluaran.DiscountPaket, `total_discount_paket_total`);
  
          await logic.validasiArrayOfObject(total_discount_paket_act, total_discount_paket_exp, `total_discount_paket_total`);
  
          // await page.pause();
                  
        })

      }
    
    });
  
  }