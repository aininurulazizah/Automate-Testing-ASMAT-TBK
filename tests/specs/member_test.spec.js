import { test, expect } from "@playwright/test";
import { Credential } from "../data/credential";
import { Kruzz } from "../pages/kruzz";
// import { Daytrans } from "../pages/daytrans";
// import { Baraya } from "../pages/baraya";
// import { Aragon } from "../pages/aragon";
// import { Jackal } from "../pages/jackal";
// import { Btm } from "../pages/btm";
import { testData } from "../data/reservasi_data";

const sites = [
    {tag: '@kruzz', url: 'https://dev.kruzz.tiketux.id', locator: Kruzz, data: testData.Kruzz, cred:Credential.Kruzz},
    // {tag: '@daytrans', url: 'https://dev.daytrans.asmat.app', locator: Daytrans, data: testData.Daytrans, cred:Credential.Daytrans, roundTrip: true, connectingRes: true},
    // {tag: '@baraya', url: 'https://dev.baraya.asmat.app', locator: Baraya, data: testData.Baraya, cred:Credential.Baraya, roundTrip: true, connectingRes: false},
    // {tag: '@aragon', url: 'https://dev.aragon.asmat.app', locator: Aragon, data: testData.Aragon, cred:Credential.Aragon, roundTrip: false, connectingRes: false},
    // {tag: '@jackal', url: 'https://dev.jackalx.asmat.app', locator: Jackal, data: testData.Jackal, cred:Credential.Jackal, roundTrip: true, connectingRes: false},
    // {tag: '@btm', url: 'https://dev.btm.asmat.app', locator: Btm, data: testData.Btm, cred:Credential.Btm, roundTrip: false, connectingRes: true},
]

sites.forEach((site) => {

  test.describe('Member', () => {

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
  
    test(`${site.tag} - Test Case 1 - Cek Poin Member`, async() => {
  
      const page = await context.newPage();
      
      const web = new site.locator(page);
          
      await page.goto(`${site.url}/asmat/member`);

      const poinMember = await web.getPoinMember(site.data.Member.NoHP);

      await web.screenshotPoinMemberPage(site.data.Member.NoHP);

      await page.goto(`${site.url}/asmat/check.poin.member?telp=${site.data.Member.NoHP}`);

      const poinCekPoinMember = await web.getPoinCheckPoinMember();

      await web.screenshotPoinCheckPage(site.data.Member.NoHP);

      await web.detailRiwayatTransaksi();

      const poinRiwayatTransaksi = await web.getPoinRiwayatTransaksi();

      await web.screenshotPoinRiwayatPage(site.data.Member.NoHP);

      expect(poinCekPoinMember).toBe(poinMember);

      expect(poinRiwayatTransaksi).toBe(poinMember);
  
      await page.pause();
              
    })
  
  });

})


