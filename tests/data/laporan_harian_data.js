export const testData  = {

    IdentifierColumns: ['tanggal'],

    MainIdentifier: 'tanggal',

    Btm: {
        PeriodeTahun: '2025',
        PeriodeBulan: 'Januari',
        FilterBy: 'Waktu Keberangkatan',
        Outlet: 'SEMUA',

        //Jika ada kolom baru tambahkan nama kolom yang termasuk ke dalam pengeluaran/pendapatan ke list ini
        KolomPendapatan: {
            Penjualan: [
                'penjualan_tiket', 
                'penjualan_paket'
            ]
        },
        KolomPengeluaran: {
            Biaya_Op : [
                'biaya_op_test',
                'biaya_op_bbm_cash',
                'biaya_op_bbm_emoney',
                'biaya_op_etoll',
                'biaya_op_op_freelance',
                'biaya_op_op_karyawan',
            ]
        } 
    },

    Daytrans: {
        PeriodeTahun: '2026',
        PeriodeBulan: 'Januari',
        FilterBy: 'Waktu Keberangkatan',
        Outlet: 'SEMUA',

        //Jika ada kolom baru tambahkan nama kolom yang termasuk ke dalam pengeluaran/pendapatan ke list ini
        KolomPendapatan: {
            Penjualan: [
                'penjualan_tiket',
                'penjualan_paket'
            ]
        },
        KolomPengeluaran: {
            Komisi: [
                'komisi_app_api',
                'komisi_whitelabel',
                'komisi_tiketux',
                'komisi_redbus',
                'komisi_merchant_tiket',
                'komisi_kiosk',
                'komisi_traveloka_internal',
                'komisi_traveloka_api_channel'
            ],
            Biaya_Op: [
                'biaya_op_bbm',
                'biaya_op_parkir',
                'biaya_op_sewa_bus',
                'biaya_op_sopir',
                'biaya_op_tol'
            ]
        },
    },

    Baraya: {        
        PeriodeTahun: '2026',
        PeriodeBulan: 'Januari',
        FilterBy: 'Waktu Keberangkatan',
        Outlet: 'SEMUA',

        //Jika ada kolom baru tambahkan nama kolom yang termasuk ke dalam pengeluaran/pendapatan ke list ini
        KolomPendapatan: {
            Penjualan: [
                'penjualan_tiket',
                'penjualan_paket'
            ]
        },
        KolomPengeluaran: {
            Biaya_Op: [
                'biaya_op_bbm',
                'biaya_op_sopir',
                'biaya_op_tambahan_sopir',
                'biaya_op_bbm_tambahan',
                'biaya_op_lain-lain',
                'biaya_op_parkir',
                'biaya_op_tol'
            ]
        }
    },

    Aragon: {
        PeriodeTahun: '2023',
        PeriodeBulan: 'Juli',
        FilterBy: 'Waktu Keberangkatan',
        Outlet: 'SEMUA',

        //Jika ada kolom baru tambahkan nama kolom yang termasuk ke dalam pengeluaran/pendapatan ke list ini
        KolomPendapatan: {
            Penjualan: [
                'penjualan_tiket',
                'penjualan_paket',
                'penjualan_charter'
            ]
        },
        KolomPengeluaran: {
            Biaya_Op: [
                'biaya_op_biaya_bbm',
                'biaya_op_biaya_tol',
                'biaya_op_jasa_driver',
                'biaya_op_tambahan_tol'
            ]
        }
    },

    Jackal: {
        PeriodeTahun: '2025',
        PeriodeBulan: 'Januari',
        FilterBy: 'Waktu Keberangkatan',
        Outlet: 'SEMUA',

        //Jika ada kolom baru tambahkan nama kolom yang termasuk ke dalam pengeluaran/pendapatan ke list ini
        KolomPendapatan: {
            Penjualan: [
                'penjualan_tiket',
                'penjualan_paket'
            ]
        },
        KolomPengeluaran: {
            Biaya_Op: [
                'biaya_op_bbm',
                'biaya_op_premi_driver',
                'biaya_op_toll'
            ]
        }
    }

}