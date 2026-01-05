import { test, expect } from "@playwright/test"
// import { Daytrans } from "../pages/daytrans";
import { Baraya } from "../pages/baraya";
import { Aragon } from "../pages/aragon";
import { Jackal } from "../pages/jackal";
import { Btm } from "../pages/btm";
import { testData } from "../test-data/reservasi_data";

const sites = [
    // {tag: '@daytrans', url: ''},
    {tag: '@baraya', url: 'https://dev.baraya.asmat.app', locator: Baraya, data: testData.Baraya},
    {tag: '@aragon', url: 'https://dev.aragon.asmat.app', locator: Aragon, data: testData.Aragon},
    {tag: '@jackal', url: 'https://dev.jackalx.asmat.app', locator: Jackal, data: testData.Jackal},
    {tag: '@btm', url: 'https://dev.btm.asmat.app', locator: Btm, data: testData.Btm}
]

const data_Pemesan = testData.Pemesan;

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
  
      test(`${site.tag} - Test Case 1 - Reservasi`, async() => {
  
        const page = await context.newPage();
      
        const web = new site.locator(page);
          
        await page.goto(`${site.url}/asmat/reservasi`);
      
        await web.pilihTanggalBerangkat(site.data.TanggalBerangkat); // Isi tanggal keberangkatan
  
        await web.pilihKeberangkatan(site.data.Keberangkatan); // Isi outlet keberangkatan
  
        await web.pilihTujuan(site.data.Tujuan); // Isi outlet tujuan
  
        await web.pilihJamKeberangkatan();
  
        await web.pilihKursi(site.data.JumlahPenumpang);
  
        await web.isiDataPemesan(data_Pemesan);
  
        await web.pilihMetodeBayar("TUNAI");
  
        await web.cetakTiket();
  
        await page.pause();
              
    })
  
  });

}


