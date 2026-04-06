export class Kruzz {

    constructor(page) {

        // General
        this.page = page;

        // // Reservation

        // // Laporan

        // Member
        this.all_table_member = page.locator('div:has(table#tableheader)').nth(1);
        this.table_member = page.locator('table#tablecontent');
        this.total_poin_row = this.table_member.locator('td:has-text("TOTAL POIN")');
        
    }

    getRowMember(identifier) {
        return this.table_member.locator(`tr:has-text("${identifier}")`);
    }

    getPoinMember(identifier) {
        return this.table_member.locator(`tr:has-text("${identifier}") > td`).nth(18).innerText();
    }

    getPoinCheckPoinMember() {
        return this.table_member.locator(`td`).nth(2).innerText();
    }

    getPoinRiwayatTransaksi() {
        return this.table_member.locator('td:has-text("TOTAL POIN") + td').last().innerText();
    }

    async screenshotPoinMemberPage(identifier) {
        await this.page.setViewportSize({ width: 2560, height: 1080 }); //Melebarkan view size untuk screenshot data member
        const memberRow = await this.getRowMember(identifier);
        await memberRow.screenshot({ path: `output/check poin member/memberRow-${identifier}.png` });
        await this.page.setViewportSize({ width: 1280, height: 720 }); //Mengembalikan view size
    }

    async screenshotPoinCheckPage(identifier) {
        await this.page.screenshot({ path: `output/check poin member/poinOnCheckPage-${identifier}.png` });
    }

    async screenshotPoinRiwayatPage(identifier) {
        await this.page.setViewportSize({ width: 1920, height: 900 }); //Melebarkan view size 
        await this.total_poin_row.scrollIntoViewIfNeeded();
        await this.page.screenshot({ path: `output/check poin member/poinOnRiwayatPage-${identifier}.png` });
        await this.page.setViewportSize({ width: 1280, height: 720 }); //Mengembalikan view size
    }

    async detailRiwayatTransaksi() {
        await this.table_member.locator('a[onclick*="showRiwayatTransaksi"]').click();
    }

}