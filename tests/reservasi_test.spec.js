import { test, expect } from "@playwright/test";
import { Credential } from "../test-data/credential";
// import { Daytrans } from "../pages/daytrans";
import { Baraya } from "../pages/baraya";
import { Aragon } from "../pages/aragon";
import { Jackal } from "../pages/jackal";
import { Btm } from "../pages/btm";
import { testData } from "../test-data/reservasi_data";

const sites = [
    // {tag: '@daytrans', url: 'https://dev.daytrans.asmat.app', locator: Daytrans, data: testData.Daytrans, cred:Credential.Daytrans, roundTrip: true, connectingRes: true},
    {tag: '@baraya', url: 'https://dev.baraya.asmat.app', locator: Baraya, data: testData.Baraya, cred:Credential.Baraya, roundTrip: true, connectingRes: false},
    {tag: '@aragon', url: 'https://dev.aragon.asmat.app', locator: Aragon, data: testData.Aragon, cred:Credential.Aragon, roundTrip: false, connectingRes: false},
    {tag: '@jackal', url: 'https://dev.jackalx.asmat.app', locator: Jackal, data: testData.Jackal, cred:Credential.Jackal, roundTrip: true, connectingRes: false},
    {tag: '@btm', url: 'https://dev.btm.asmat.app', locator: Btm, data: testData.Btm, cred:Credential.Btm, roundTrip: false, connectingRes: true},
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
        await page.fill('#username', `${site.cred.Username}`);
        await page.fill('#password', `${site.cred.Password}`);
        await page.click('#loginbutton');
        await page.waitForURL('**/menu.operasional');
    });
    
    test.afterAll(async () => {
        await context.close();
    });
  
    test(`${site.tag} - Test Case 1 - Reservasi One Way Trip`, async() => {
  
      const page = await context.newPage();
      
      const web = new site.locator(page);
          
      await page.goto(`${site.url}/asmat/reservasi`);
      
      await web.pilihTanggalBerangkat(site.data.TanggalBerangkat); // Isi tanggal keberangkatan
  
      await web.pilihKeberangkatan(site.data.Keberangkatan); // Isi outlet keberangkatan
  
      await web.pilihTujuan(site.data.Tujuan); // Isi outlet tujuan
  
      await web.pilihJamKeberangkatan();
  
      await web.pilihKursi(site.data.JumlahPenumpang);
  
      await web.isiDataPemesan(data_Pemesan);
  
      await web.pilihMetodeBayar(site.data.MetodeBayar);
  
      await web.cetakTiket();
  
      await page.pause();
              
    })

    if(site.roundTrip) {
      test(`${site.tag} - Test Case 2 - Reservasi Round Trip`, async() => {
  
        const page = await context.newPage();
        
        const web = new site.locator(page);
            
        await page.goto(`${site.url}/asmat/reservasi`);
        
        await web.pilihTanggalBerangkat(site.data.TanggalBerangkat); // Isi tanggal keberangkatan
    
        await web.pilihKeberangkatan(site.data.Keberangkatan); // Isi outlet keberangkatan
    
        await web.pilihTujuan(site.data.Tujuan); // Isi outlet tujuan
  
        await web.klikPPToggle();
  
        await web.pilihTanggalPulang(site.data.TanggalPulang);
  
        await web.pilihKeberangkatanPulang(site.data.KeberangkatanPulang);
  
        await web.pilihTujuanPulang(site.data.TujuanPulang);
    
        await web.pilihJamKeberangkatan();
  
        await web.pilihKursi(site.data.JumlahPenumpang);

        await web.pilihJamKeberangkatanPulang();

        await web.pilihKursi(site.data.JumlahPenumpang);

        await web.isiDataPemesan(data_Pemesan);
    
        await web.pilihMetodeBayar(site.data.MetodeBayar);
    
        await web.cetakTiket();
    
        await page.pause();
                
      })
    }

    if (site.connectingRes) {

      test(`${site.tag} - Test Case 3 - Connecting Reservation`, async() => {

        const page = await context.newPage();

        const web = new site.locator(page);

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

}


