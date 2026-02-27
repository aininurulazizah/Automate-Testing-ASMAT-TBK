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
        PeriodeTahun: '2026',
        PeriodeBulan: 'Februari',
        FilterBy: 'Waktu Keberangkatan',

        KolomPendapatan: {
            OmzetPenumpang: [
                'omzet_penumpang_dt_jakarta',
                'omzet_penumpang_dt_jateng'
            ],
            OmzetPaket: [
                'omzet_pkt_dt_jakarta',
                'omzet_pkt_dt_jateng'
            ]
        },
        KolomPengeluaran: {
            Discount: [
                'total_discount_penumpang_dt_jakarta',
                'total_discount_penumpang_dt_jateng'
            ],
            DiscountPaket: [
                'total_discount_paket_dt_jakarta',
                'total_discount_paket_dt_jateng'
            ],
            Komisi: [
                'komisi_app_api',
                'komisi_whitelabel',
                'komisi_tiketux',
                'komisi_redbus',
                'komisi_merchant_tiket',
                'komisi_kiosk',
                'komisi_traveloka_internal',
                'komisi_traveloka_api_channel',
            ],
            BiayaOp: [
                'biaya_tol',
                'biaya_bbm',
                'biaya_order_fee',
                'biaya_biaya_langsung',
                'biaya_biaya_tambahan'
            ]
        },
        KolomNonMonetary: {
            TotalTrip: [
                'total_trip_dt_jakarta',
                'total_trip_dt_jateng',
                'total_trip_sewa_jakarta',
                'total_trip_sewa_jateng'
            ],
            // JmlPenumpang: [], //Perlu tau dulu hitungannya dari mana
            PendapatanPnp: [  //Perlu di-makesure ini masuk ke pendapatan/pengeluaran atau tidak
                'pendapatan_pnp_nett_dt_jakarta',
                'pendapatan_pnp_nett_dt_jateng'
            ],
            JmlPaket: [
                'jum_paket_dt_jakarta',
                'jum_paket_dt_jateng'
            ],
            OmzetUnitJakarta: [  //Perlu di-makesure ini masuk ke pendapatan/pengeluaran atau tidak
                'omzet_unit_jakarta_pax',
                'omzet_unit_jakarta_paket'
            ],
            OmzetUnitJateng: [  //Perlu di-makesure ini masuk ke pendapatan/pengeluaran atau tidak
                'omzet_unit_jateng_pax',
                'omzet_unit_jateng_paket'
            ]
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
        KolomPendapatanCharter: {
            OmzetCharter: [
                'charter_omzet'
            ]
        },
        KolomPengeluaranCharter: {
          BiayaOpCharter: [
            'charter_biaya_op_bahan_bakar_minyak',
            'charter_biaya_op_jasa_driver',
            'charter_biaya_op_lain_lain',
            'charter_biaya_op_tol_dan_parkir'
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
        PeriodeBulan: 'Desember',
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
                'biaya_op_bbm',
                'biaya_op_premi_driver',
                'biaya_op_tol'
            ],
            Komisi: [
                'komisi'
            ],
            Ppn: [
                'ppn'
            ]
        },
        KolomPendapatanCharter: {
            OmzetCharter: [
                'charter_omzet'
            ]
        },
        KolomPengeluaranCharter: {
            BiayaOpCharter: [
                'charter_biaya_op'
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
                'jml_penumpang_by_pembayaran_mbr',
                'jml_penumpang_by_pembayaran_wl_and',
                'jml_penumpang_by_pembayaran_wl_ios',
                'jml_penumpang_by_pembayaran_wl_web',
                'jml_penumpang_by_pembayaran_mer',
                'jml_penumpang_by_pembayaran_ttx',
                'jml_penumpang_by_pembayaran_trv',
                'jml_penumpang_by_pembayaran_rdb',
                'jml_penumpang_by_pembayaran_kiosk',
                'jml_penumpang_by_pembayaran_esb',
                'jml_penumpang_by_pembayaran_bca',
            ],
            JmlPaket: [
                'jml_paket_reguler',
                'jml_paket_corporate'
            ]
        }
    }

}