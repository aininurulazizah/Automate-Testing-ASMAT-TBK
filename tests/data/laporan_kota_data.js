export const testData = {

    IdentifierColumns: ['no', 'kota'],

    MainIdentifier: 'kota',
    
    Btm: {
        PeriodeAwalTahun: '2025',
        PeriodeAwalBulan: 'Januari',
        PeriodeAwalTanggal: '1',
        PeriodeAkhirTahun: '2025',
        PeriodeAkhirBulan: 'Desember',
        PeriodeAkhirTanggal: '31',
        FilterBy: 'Waktu Lunas',

        //Jika ada kolom baru tambahkan nama kolom yang termasuk ke dalam pengeluaran/pendapatan
        KolomPendapatan: {
            Penjualan: [
                'penjualan_tiket',
                'penjualan_paket',
                'penjualan_charter'
            ]
        },
        KolomPengeluaran: {
            Biaya_Op: [
                'biaya_op_test',
                'biaya_op_bbm_cash',
                'biaya_op_bbm_emoney',
                'biaya_op_etoll',
                'biaya_op_op_freelance',
                'biaya_op_op_karyawan'
            ]
        }
    },

    Baraya: {
        PeriodeAwalTahun: '2025',
        PeriodeAwalBulan: 'Januari',
        PeriodeAwalTanggal: '1',
        PeriodeAkhirTahun: '2025',
        PeriodeAkhirBulan: 'Desember',
        PeriodeAkhirTanggal: '31',
        FilterBy: 'Waktu Keberangkatan',

        //Jika ada kolom baru tambahkan nama kolom yang termasuk ke dalam pengeluaran/pendapatan
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
                'biaya_op_tambahan_bbm',
                'biaya_op_tambahan_sopir',
                'biaya_op_alat_tulis_kantor',
                'biaya_op_bbm_tambahan',
                'biaya_op_iuran',
                'biaya_op_lain_lain',
                'biaya_op_parkir',
                'biaya_op_test',
                'biaya_op_test_123',
                'biaya_op_tol'
            ]
        } 
    },

    Jackal: {
        PeriodeAwalTahun: '2025',
        PeriodeAwalBulan: 'Januari',
        PeriodeAwalTanggal: '1',
        PeriodeAkhirTahun: '2025',
        PeriodeAkhirBulan: 'Desember',
        PeriodeAkhirTanggal: '31',
        FilterBy: 'Waktu Keberangkatan',

        //Jika ada kolom baru tambahkan nama kolom yang termasuk ke dalam pengeluaran/pendapatan
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
                'biaya_op_tol'
            ]
        } 
    }

}