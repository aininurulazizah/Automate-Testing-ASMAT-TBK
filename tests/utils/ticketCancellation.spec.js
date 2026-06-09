import { test } from "@playwright/test";
import { Credential } from "../data/credential.js";
import { Daytrans } from "../pages/daytrans.js";
import { Baraya } from "../pages/baraya.js";
import { Aragon } from "../pages/aragon.js";
import { Jackal } from "../pages/jackal.js";
import { Btm } from "../pages/btm.js";
import { testData } from "../data/reservasi_data.js";

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


    test(`${site.tag} - Pembatalan Tiket Otomatis`, async () => {

      await test.step('Buka halaman reservasi', async () => {
        await page.goto(`${site.url}/asmat/reservasi`);
      });

      await test.step('Pilih tanggal berangkat', async () => {
        await web.pilihTanggalBerangkat(site.data.TanggalBerangkat);
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

      await test.step('Pilih kursi yang sudah di-book dan batalkan', async () => {
        await web.pilihKursiBooked();
      });

    })

  });

})


