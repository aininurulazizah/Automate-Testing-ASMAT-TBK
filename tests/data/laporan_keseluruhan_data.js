export const testData = {

    IdentifierColumns: ['tanggal'],

    MainIdentifier: 'tanggal',

    Btm: {
        PeriodeTahun: '2025',
        PeriodeBulan: 'Januari',
        FilterBy: 'Waktu Keberangkatan',
        Layanan: 'Semua',

        KolomPendapatan: {
            Omzet_Penumpang: [
                'omzet_penumpang'
            ],
            Discount: [
                'discount_discount',
                'discount_discount_promo',
                'discount_discount_voucher'
            ],
            Omzet_Paket: [
                'reguler',
                'corporate'
            ]
        },
        KolomPengeluaran: {
            BiayaOp: [
                'biaya_op_test',
                'biaya_op_bbm_cash',
                'biaya_op_bbm_emoney',
                'biaya_op_etoll',
                'biaya_op_op_freelance',
                'biaya_op_op_karyawan'
            ]
        }
    }

}