import { test, expect } from "@playwright/test";
import { Credential } from "../data/credential";
import { Daytrans } from "../pages/daytrans";
import { Baraya } from "../pages/baraya";
import { Aragon } from "../pages/aragon";
import { Jackal } from "../pages/jackal";
import { Btm } from "../pages/btm";
import { testData } from "../data/reservasi_data";
import { saveBookingDetails } from "../utils/testHelper";

const sites = [
    {
      tag: '@daytrans', 
      url: 'https://dev.daytrans.asmat.app', 
      locator: Daytrans, 
      data: testData.Daytrans, 
      cred:Credential.Daytrans, 
      roundTrip: true, 
      connectingRes: true,
      ticketCodePrefix: 'TDTR'
    },
    {
      tag: '@baraya', 
      url: 'https://dev.baraya.asmat.app', 
      locator: Baraya, 
      data: testData.Baraya, 
      cred:Credential.Baraya, 
      roundTrip: true, 
      connectingRes: false,
      ticketCodePrefix: 'TBRT'
    },
    {
      tag: '@aragon', 
      url: 'https://dev.aragon.asmat.app', 
      locator: Aragon, 
      data: testData.Aragon, 
      cred:Credential.Aragon, 
      roundTrip: false, 
      connectingRes: false,
      ticketCodePrefix: 'TARG'
    },
    {
      tag: '@jackal', 
      url: 'https://dev.jackalx.asmat.app', 
      locator: Jackal, 
      data: testData.Jackal, 
      cred:Credential.Jackal, 
      roundTrip: true, 
      connectingRes: false,
      ticketCodePrefix: 'TJKL'
    },
    {
      tag: '@btm', 
      url: 'https://dev.btm.asmat.app', 
      locator: Btm, 
      data: testData.Btm, 
      cred:Credential.Btm, 
      roundTrip: false, 
      connectingRes: true,
      ticketCodePrefix: 'TBTM'
    },
]

const data_Pemesan = testData.Pemesan;

sites.forEach((site) => {

  test.describe('Reservasi', () => {

    test.setTimeout(60000);
  
    let page;
    let web;
  
    test.beforeAll(async ({ browser }) => {
        test.setTimeout(60000);
        const context = await browser.newContext();  
        page = await context.newPage();  
        web = new site.locator(page);
        await page.goto(site.url);  // Step Login
        await page.fill('#username', `${site.cred.Username}`);
        await page.fill('#password', `${site.cred.Password}`);
        await page.click('#loginbutton');
        await page.waitForURL('**/menu.operasional');
    });

  
    test(`${site.tag} - Test Case 1 - Reservasi One Way Trip`, async() => {
          
      await test.step('Buka halaman reservasi', async () => {
        await page.goto(`${site.url}/asmat/reservasi`);
      });

      await test.step('Pilih tanggal berangkat', async () => {
        await web.pilihTanggalBerangkat(site.data.TanggalBerangkat); // Isi tanggal keberangkatan
      });

      await test.step('Pilih lokasi keberangkatan', async () => {
        await web.pilihKeberangkatan(site.data.Keberangkatan); // Isi outlet keberangkatan
      });

      await test.step('Pilih lokasi tujuan', async () => {
        await web.pilihTujuan(site.data.Tujuan); // Isi outlet tujuan
      });

      await test.step('Pilih jadwal keberangkatan', async () => {
        await web.pilihJamKeberangkatan();
      });

      const { harga_tiket, is_diskon } = await web.ambilHargaTiket();

      await test.step('Pilih kursi penumpang', async () => {
        await web.pilihKursi(site.data.JumlahPenumpang);
      });

      await test.step('Isi data pemesan', async () => {
        await web.isiDataPemesan(data_Pemesan);
      });

      await test.step('Pilih metode pembayaran', async () => {
        await web.pilihMetodeBayar(site.data.MetodeBayar);
      });

      await test.step('Validasi total pembayaran tiket', async () => {
        await web.validasiTotalTiket(harga_tiket, 0, site.data.JumlahPenumpang); //Expected Result : Cek total bayar
      });

      let ticket;
      await test.step('Cetak tiket', async () => {
        ticket = await web.cetakTiket(); // Ambil page tiket
      });

      await test.step('Validasi tiket : Kode Tiket', async () => {
        await web.validasiPrefixTiket(ticket, site.ticketCodePrefix); //Expected Result : Cek apakah ada "Tiket" di halaman
      });

      await test.step('Validasi tiket : Keberangkatan & Tujuan', async () => {
        await web.validasiKeberangkatanTujuan(ticket, site.data.Keberangkatan, site.data.Tujuan); //Expected Result : Cek apakah keberangkatan & tujuan sesuai
      });

      await test.step('Validasi tiket : Tanggal Keberangkatan', async () => {
        await web.validasiTanggal(ticket, site.data.TanggalBerangkat); //Expected Result : Cek apakah tanggal berangkat sesuai
      });

      const test_case_name = test.info().title;
      const booking_detail = await web.ambilDetailBooking(ticket, is_diskon, 'one way trip');
      const booking_detail_path = saveBookingDetails(booking_detail, test_case_name);

      await test.info().attach('booking_detail', {
        path: booking_detail_path,
        contentType: 'application/json'
      });
  
      await page.pause();
              
    })

    if(site.roundTrip) {
      test(`${site.tag} - Test Case 2 - Reservasi Round Trip`, async() => {

        await test.step('Buka halaman reservasi', async () => {
          await page.goto(`${site.url}/asmat/reservasi`);
        });
  
        await test.step('Pilih tanggal berangkat', async () => {
          await web.pilihTanggalBerangkat(site.data.TanggalBerangkat); // Isi tanggal keberangkatan
        });
  
        await test.step('Pilih lokasi keberangkatan', async () => {
          await web.pilihKeberangkatan(site.data.Keberangkatan); // Isi outlet keberangkatan
        });
  
        await test.step('Pilih lokasi tujuan', async () => {
          await web.pilihTujuan(site.data.Tujuan); // Isi outlet tujuan
        });

        await test.step('Aktifkan toggle pulang pergi (PP)', async () => {
          await web.klikPPToggle();
        });

        await test.step('Pilih tanggal pulang', async () => {
          await web.pilihTanggalPulang(site.data.TanggalPulang);
        });
  
        await test.step('Pilih lokasi keberangkatan pulang', async () => {
          await web.pilihKeberangkatanPulang(site.data.KeberangkatanPulang);
        });
  
        await test.step('Pilih lokasi tujuan pulang', async () => {
          await web.pilihTujuanPulang(site.data.TujuanPulang);
        });
  
        await test.step('Pilih jadwal keberangkatan', async () => {
          await web.pilihJamKeberangkatan();
        });

        const { harga_tiket, is_diskon } = await web.ambilHargaTiket();
  
        await test.step('Pilih kursi penumpang untuk pergi', async () => {
          await web.pilihKursi(site.data.JumlahPenumpang);
        });

        await test.step('Pilih jadwal keberangkatan pulang', async () => {
          await web.pilihJamKeberangkatanPulang();
        });

        const { harga_tiket: harga_tiket_plg, is_diskon: is_diskon_plg } = await web.ambilHargaTiket();
  
        await test.step('Pilih kursi penumpang untuk pulang', async () => {
          await web.pilihKursi(site.data.JumlahPenumpang);
        });
  
        await test.step('Isi data pemesan', async () => {
          await web.isiDataPemesan(data_Pemesan);
        });
  
        await test.step('Pilih metode pembayaran', async () => {
          await web.pilihMetodeBayar(site.data.MetodeBayar);
        });

        await test.step('Validasi total pembayaran tiket', async () => {
          await web.validasiTotalTiket(harga_tiket, harga_tiket_plg, site.data.JumlahPenumpang); //Expected Result : Cek total bayar
        });
  
        let ticket;
        await test.step('Cetak tiket', async () => {
          ticket = await web.cetakTiket();
        });

        await test.step('Validasi tiket : Kode Tiket', async () => {
          await web.validasiPrefixTiket(ticket, site.ticketCodePrefix); //Expected Result : Cek apakah ada "Tiket" di halaman
        });
  
        await test.step('Validasi tiket : Keberangkatan & Tujuan (Pergi)', async () => {
          await web.validasiKeberangkatanTujuan(ticket, site.data.Keberangkatan, site.data.Tujuan); //Expected Result : Cek apakah keberangkatan & tujuan sesuai
        });

        await test.step('Validasi tiket : Keberangkatan & Tujuan (Pulang)', async () => {
          await web.validasiKeberangkatanTujuan(ticket, site.data.KeberangkatanPulang, site.data.TujuanPulang); //Expected Result : Cek apakah keberangkatan & tujuan sesuai
        });
  
        await test.step('Validasi tiket : Tanggal Keberangkatan (Pergi)', async () => {
          await web.validasiTanggal(ticket, site.data.TanggalBerangkat); //Expected Result : Cek apakah tanggal berangkat sesuai
        });

        await test.step('Validasi tiket : Tanggal Keberangkatan (Pulang)', async () => {
          await web.validasiTanggal(ticket, site.data.TanggalPulang); //Expected Result : Cek apakah tanggal berangkat sesuai
        });

        const test_case_name = test.info().title;
        const booking_detail = await web.ambilDetailBooking(ticket, is_diskon, 'round trip');
        const booking_detail_path = saveBookingDetails(booking_detail, test_case_name);
  
        await test.info().attach('booking_detail', {
          path: booking_detail_path,
          contentType: 'application/json'
        });
    
        await page.pause();
                
      })
    }

    if (site.connectingRes) {

      test(`${site.tag} - Test Case 3 - Connecting Reservation`, async() => {

        await page.goto(`${site.url}/asmat/reservasi`);

        await web.pilihTanggalBerangkat(site.data.TanggalBerangkat);

        await web.pilihKeberangkatan(site.data.ConnectingReservation.Keberangkatan);

        await web.pilihTujuan(site.data.ConnectingReservation.Tujuan);

        await web.pilihRute();

        await web.pilihJamKeberangkatan();

        await web.pilihKursi(site.data.JumlahPenumpang);

        await web.pilihNextJamKeberangkatan();

        await web.pilihKursi(site.data.JumlahPenumpang);

        await web.isiDataPemesan(data_Pemesan);

        await web.pilihMetodeBayar(site.data.MetodeBayar);

        await web.cetakTiket();

        await page.pause();

      })

    }
  
  });

})


