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
    cred: Credential.Daytrans,
    roundTrip: true,
    connectingRes: true,
    ticketCodePrefix: 'TDTR'
  },
  {
    tag: '@baraya',
    url: 'https://dev.baraya.asmat.app',
    locator: Baraya,
    data: testData.Baraya,
    cred: Credential.Baraya,
    roundTrip: true,
    connectingRes: false,
    ticketCodePrefix: 'TBRT'
  },
  {
    tag: '@aragon',
    url: 'https://dev.aragon.asmat.app',
    locator: Aragon,
    data: testData.Aragon,
    cred: Credential.Aragon,
    roundTrip: false,
    connectingRes: false,
    ticketCodePrefix: 'TARG'
  },
  {
    tag: '@jackal',
    url: 'https://dev.jackalx.asmat.app',
    locator: Jackal,
    data: testData.Jackal,
    cred: Credential.Jackal,
    roundTrip: true,
    connectingRes: false,
    ticketCodePrefix: 'TJKL'
  },
  {
    tag: '@btm',
    url: 'https://dev.btm.asmat.app',
    locator: Btm,
    data: testData.Btm,
    cred: Credential.Btm,
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


    test(`${site.tag} - Test Case 1 - Reservasi One Way Trip`, async () => {

      let ticket;
      let harga_tiket, is_diskon;

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

      // Ambil harga tiket
      const data_tiket = await web.ambilHargaTiket();

      await test.step('Pilih kursi penumpang', async () => {
        await web.pilihKursi(site.data.JumlahPenumpang, site.tag === '@daytrans' ? data_tiket : undefined);
      });

      // Assign harga tiket
      ({ harga_tiket, is_diskon } = data_tiket);

      await test.step('Isi data pemesan', async () => {
        await web.isiDataPemesan(data_Pemesan);
      });

      await test.step('Pilih metode pembayaran', async () => {
        await web.pilihMetodeBayar(site.data.MetodeBayar);
      });

      await test.step('Validasi total pembayaran tiket', async () => {
        await web.validasiTotalTiket(harga_tiket, 0, site.data.JumlahPenumpang); //Expected Result : Cek total bayar
      });

      await test.step('Cetak tiket', async () => {
        ticket = await web.cetakTiket(); // Ambil page tiket
      });

      await test.step('Validasi tiket : Kode Tiket', async () => {
        await web.validasiPrefixTiket(ticket, site.ticketCodePrefix, site.data.JumlahPenumpang); //Expected Result : Cek apakah ada "Tiket" di halaman
      });

      await test.step('Validasi tiket : Tanggal Keberangkatan', async () => {
        await web.validasiTanggal(ticket, site.data.TanggalBerangkat, site.data.JumlahPenumpang); //Expected Result : Cek apakah tanggal berangkat sesuai
      });

      await test.step('Validasi tiket : Keberangkatan & Tujuan', async () => {
        await web.validasiKeberangkatanTujuan(ticket, site.data.Keberangkatan, site.data.Tujuan, site.data.JumlahPenumpang, site.data.TanggalBerangkat); //Expected Result : Cek apakah keberangkatan & tujuan sesuai
      });

      const test_case_name = test.info().title;
      const booking_detail = await web.ambilDetailBooking(ticket, is_diskon, false, 'one way trip');
      const booking_detail_path = saveBookingDetails(booking_detail, test_case_name);

      await test.info().attach('booking_detail', {
        path: booking_detail_path,
        contentType: 'application/json'
      });

    })

    if (site.roundTrip) {
      test(`${site.tag} - Test Case 2 - Reservasi Round Trip`, async () => {

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

        // Ambil harga tiket
        const data_tiket = await web.ambilHargaTiket();

        await test.step('Pilih kursi penumpang untuk pergi', async () => {
          await web.pilihKursi(site.data.JumlahPenumpang, site.tag === '@daytrans' ? data_tiket : undefined);
        });

        // Assign harga tiket
        const { harga_tiket, is_diskon } = data_tiket;

        await test.step('Pilih jadwal keberangkatan pulang', async () => {
          await web.pilihJamKeberangkatanPulang();
        });

        // Ambil harga tiket pulang
        const data_tiket_plg = await web.ambilHargaTiket();

        await test.step('Pilih kursi penumpang untuk pulang', async () => {
          await web.pilihKursi(site.data.JumlahPenumpang, site.tag === '@daytrans' ? data_tiket_plg : undefined);
        });

        const { harga_tiket: harga_tiket_plg, is_diskon: is_diskon_plg } = data_tiket_plg;

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
          await web.validasiPrefixTiket(ticket, site.ticketCodePrefix, site.data.JumlahPenumpang); //Expected Result : Cek apakah ada "Tiket" di halaman
        });

        await test.step('Validasi tiket : Tanggal Keberangkatan (Pergi)', async () => {
          await web.validasiTanggal(ticket, site.data.TanggalBerangkat, site.data.JumlahPenumpang); //Expected Result : Cek apakah tanggal berangkat sesuai
        });

        await test.step('Validasi tiket : Keberangkatan & Tujuan (Pergi)', async () => {
          await web.validasiKeberangkatanTujuan(ticket, site.data.Keberangkatan, site.data.Tujuan, site.data.JumlahPenumpang, site.data.TanggalBerangkat); //Expected Result : Cek apakah keberangkatan & tujuan sesuai
        });

        await test.step('Validasi tiket : Tanggal Keberangkatan (Pulang)', async () => {
          await web.validasiTanggal(ticket, site.data.TanggalPulang, site.data.JumlahPenumpang); //Expected Result : Cek apakah tanggal berangkat sesuai
        });

        await test.step('Validasi tiket : Keberangkatan & Tujuan (Pulang)', async () => {
          await web.validasiKeberangkatanTujuan(ticket, site.data.KeberangkatanPulang, site.data.TujuanPulang, site.data.JumlahPenumpang, site.data.TanggalPulang); //Expected Result : Cek apakah keberangkatan & tujuan sesuai
        });

        const test_case_name = test.info().title;
        const booking_detail = await web.ambilDetailBooking(ticket, is_diskon, is_diskon_plg, 'round trip');
        const booking_detail_path = saveBookingDetails(booking_detail, test_case_name);

        await test.info().attach('booking_detail', {
          path: booking_detail_path,
          contentType: 'application/json'
        });

        // await page.pause();

      })
    }

    if (site.connectingRes) {

      test(`${site.tag} - Test Case 3 - Connecting Reservation`, async () => {

        await test.step('Buka halaman reservasi', async () => {
          await page.goto(`${site.url}/asmat/reservasi`);
        });

        await test.step('Pilih tanggal berangkat', async () => {
          await web.pilihTanggalBerangkat(site.data.TanggalBerangkat);
        });

        await test.step('Pilih lokasi keberangkatan', async () => {
          await web.pilihKeberangkatan(site.data.ConnectingReservation.Keberangkatan);
        });

        await test.step('Pilih lokasi tujuan', async () => {
          await web.pilihTujuan(site.data.ConnectingReservation.Tujuan);
        });

        let list_rute, jml_rute;

        await test.step('Pilih rute connecting', async () => {
          ({ list_rute, jml_rute } = await web.pilihRute());
        });

        await test.step('Pilih jadwal keberangkatan rute 1', async () => {
          await web.pilihJamKeberangkatan();
        });

        let data_tiket = [];
        const harga_tiket = [];
        const is_diskon = [];

        for (let i = 0; i < jml_rute; i++) {

          data_tiket[i] = await web.ambilHargaTiket();

          await test.step(`Pilih kursi penumpang rute ${i + 1}`, async () => {
            await web.pilihKursi(
              site.data.JumlahPenumpang,
              site.tag === '@daytrans' ? data_tiket[i] : undefined,
              'connecting',
              i
            );
          });

          ({ harga_tiket: harga_tiket[i], is_diskon: is_diskon[i] } = data_tiket[i]);

          if (i + 1 !== jml_rute) {
            await test.step(`Pilih jadwal keberangkatan rute ${i + 1}`, async () => {
              await web.pilihNextJamKeberangkatan(i + 1);
            });
          }

        }

        console.log(`harga tiket : ${harga_tiket} | is_diskon : ${is_diskon}`);

        await test.step('Isi data pemesan', async () => {
          await web.isiDataPemesan(data_Pemesan);
        });

        await test.step('Pilih metode pembayaran', async () => {
          await web.pilihMetodeBayar(site.data.MetodeBayar);
        });

        await test.step('Validasi total pembayaran tiket', async () => {
          await web.validasiTotalTiket(harga_tiket, 0, site.data.JumlahPenumpang, jml_rute); //Expected Result : Cek total bayar
        });

        let ticket;
        await test.step('Cetak tiket', async () => {
          ticket = await web.cetakTiket();
        });

        await test.step('Validasi tiket : Kode Tiket', async () => {
          await web.validasiPrefixTiket(ticket, site.ticketCodePrefix, site.data.JumlahPenumpang); //Expected Result : Cek apakah ada "Tiket" di halaman
        });

        await test.step('Validasi tiket : Tanggal Keberangkatan', async () => {
          await web.validasiTanggal(ticket, site.data.TanggalBerangkat, site.data.JumlahPenumpang); //Expected Result : Cek apakah tanggal berangkat sesuai
        });

        // for (let i = 0; i < jml_rute; i++) {
        //   const [keberangkatan, tujuan] = list_rute[i].split(' - ');
        //   await test.step(`Validasi tiket : Keberangkatan & Tujuan Rute ${i+1}`, async () => {
        //     await web.validasiKeberangkatanTujuan(ticket, keberangkatan, tujuan, site.data.JumlahPenumpang, site.data.TanggalBerangkat); //Expected Result : Cek apakah keberangkatan & tujuan sesuai
        //   });
        // }

        const test_case_name = test.info().title;
        const booking_detail = await web.ambilDetailBooking(ticket, is_diskon, 'connecting');
        const booking_detail_path = saveBookingDetails(booking_detail, test_case_name);

        await test.info().attach('booking_detail', {
          path: booking_detail_path,
          contentType: 'application/json'
        });

      })

    }

  });

})


