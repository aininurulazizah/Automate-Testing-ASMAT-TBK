export const testData = {

    IdentifierColumns: ['tanggal'],

    MainIdentifier: 'tanggal',

    Btm: {
        PeriodeTahun: '2025',
        PeriodeBulan: 'Januari',
        FilterBy: 'Waktu Keberangkatan',
        Layanan: 'Semua',

        KolomPendapatan: {
            OmzetPenumpang: [
                'omzet_penumpang'
            ],
            OmzetPaket: [
                'omzet_paket_reguler',
                'omzet_paket_corporate'
                // 'omzet_paket_total'
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
            ], 
            Discount: [
                'discount_discount',
                'discount_discount_promo',
                'discount_discount_voucher'
            ]
        },
        KolomNonMonetary: {
            JmlPenumpang: [
                'jml_penumpang_go_show',
                'jml_penumpang_offline',
                'jml_penumpang_online'
            ],
            JmlPenumpangByPembayaran: [
                'jml_penumpang_by_pembayaran_tun',
                'jml_penumpang_by_pembayaran_edc',
                'jml_penumpang_by_pembayaran_bni',
                'jml_penumpang_by_pembayaran_vcr',
                'jml_penumpang_by_pembayaran_trf',
                'jml_penumpang_by_pembayaran_mbt',
                'jml_penumpang_by_pembayaran_wl_and',
                'jml_penumpang_by_pembayaran_wl_ios',
                'jml_penumpang_by_pembayaran_wl_web',
                'jml_penumpang_by_pembayaran_mer',
                'jml_penumpang_by_pembayaran_ttx',
                'jml_penumpang_by_pembayaran_trv',
                'jml_penumpang_by_pembayaran_rdb',
                'jml_penumpang_by_pembayaran_kiosk',
                'jml_penumpang_by_pembayaran_esb',
                'jml_penumpang_by_pembayaran_bca'
            ],
            JmlPaket: [
                'jml_paket_reguler',
                'jml_paket_corporate'
            ]

        }
    },

    Daytrans: {
        PeriodeTahun: '2025',
        PeriodeBulan: 'Januari',
        FilterBy: 'Waktu Keberangkatan',

        KolomPendapatan: {

        },
        KolomPengeluaran: {

        }
    },

    Baraya: {
        PeriodeTahun: '2026',
        PeriodeBulan: 'Januari',
        FilterBy: 'Waktu Keberangkatan',
        Layanan: 'Semua',

        KolomPendapatan: {
            OmzetPenumpang: [
                'omzet_penumpang_harga_tiket',
                'omzet_penumpang_charge_selisih_mutasi',
                'omzet_penumpang_refund',
                'omzet_penumpang_biaya_layanan'
            ],
            OmzetPaket: [
                'omzet_paket_reguler',
                'omzet_paket_corporate'
                // 'omzet_paket_total'
            ]
        },
        KolomPengeluaran: {
            BiayaOp: [
                'biaya_op_bbm',
                'biaya_op_sopir',
                'biaya_op_tambahan_sopir',
                'biaya_op_bbm_tambahan',
                'biaya_op_lain_lain',
                'biaya_op_parkir',
                'biaya_op_tol'
            ], 
            Discount: [
                'discount_discount',
                'discount_discount_promo',
                'discount_discount_voucher'
            ]
        },
        KolomNonMonetary: {
            JmlPenumpang: [
                'jml_penumpang_go_show',
                'jml_penumpang_offline',
                'jml_penumpang_online'
            ],
            JmlPenumpangByPembayaran: [
                'jml_penumpang_by_pembayaran_tun',
                'jml_penumpang_by_pembayaran_edc',
                'jml_penumpang_by_pembayaran_bni',
                'jml_penumpang_by_pembayaran_vcr',
                'jml_penumpang_by_pembayaran_trf',
                'jml_penumpang_by_pembayaran_mbt',
                'jml_penumpang_by_pembayaran_wl_and',
                'jml_penumpang_by_pembayaran_wl_ios',
                'jml_penumpang_by_pembayaran_wl_web',
                'jml_penumpang_by_pembayaran_mer',
                'jml_penumpang_by_pembayaran_ttx',
                'jml_penumpang_by_pembayaran_trv',
                'jml_penumpang_by_pembayaran_rdb',
                'jml_penumpang_by_pembayaran_kiosk',
                'jml_penumpang_by_pembayaran_esb',
                'jml_penumpang_by_pembayaran_bca'
            ],
            JmlPaket: [
                'jml_paket_reguler',
                'jml_paket_corporate'
            ]

        }
    },

    Aragon: {
        PeriodeTahun: '2025',
        PeriodeBulan: 'Oktober',
        FilterBy: 'Waktu Keberangkatan',
        Layanan: 'Semua',

        KolomPendapatan: {
            OmzetPenumpang: [
                'omzet_penumpang'
            ],
            OmzetPaket: [
                'omzet_paket_reguler',
                'omzet_paket_corporate'
            ]
        },
        KolomPengeluaran: {
            Discount: [
                'discount_discount',
                'discount_discount_promo',
                'discount_discount_voucher'
            ],
            BiayaOp: [
                'biaya_op_biaya_bbm',
                'biaya_op_biaya_tol',
                'biaya_op_jasa_driver',
                'biaya_op_tambahan_tol'
            ]
        },
        KolomNonMonetary: {
            JmlPenumpang: [
                'jml_penumpang_go_show',
                'jml_penumpang_offline',
                'jml_penumpang_online'
            ],
            JmlPenumpangByPembayaran: [
                'jml_penumpang_by_pembayaran_tunai',
                'jml_penumpang_by_pembayaran_transfer',
                'jml_penumpang_by_pembayaran_disopir',
                'jml_penumpang_by_pembayaran_edc_gopay',
                'jml_penumpang_by_pembayaran_edc_ovo',
                'jml_penumpang_by_pembayaran_edc_mandiri',
                'jml_penumpang_by_pembayaran_edc_bca',
                'jml_penumpang_by_pembayaran_edc_shopeepay',
                'jml_penumpang_by_pembayaran_merchant',
                'jml_penumpang_by_pembayaran_tiketux',
                'jml_penumpang_by_pembyaran_traveloka',
                'jml_penumpang_by_pembayaran_redbus',
                'jml_penumpang_by_pembayaran_whitelabel_web',
                'jml_penumpang_by_pembayaran_whitelabel_android',
                'jml_penumpang_by_pembayaran_whitelabel_ios',
                'jml_penumpang_by_pembayaran_kiosk'
            ],
            JmlPaket: [
                'jml_paket_reguler',
                'jml_paket_corporate'
            ]
        }
    },

    Jackal: {
        PeriodeTahun: '2025',
        PeriodeBulan: 'Januari',
        FilterBy: 'Waktu Keberangkatan',
        Layanan: 'Semua',

        KolomPendapatan: {

        },
        KolomPengeluaran: {

        }
    }

}