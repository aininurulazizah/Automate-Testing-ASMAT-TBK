function getTanggal(value) {
    const today = new Date();
    const day = today.getDate(); //Ambil tanggal di hari ini
    today.setDate(1); //Set tanggal jadi 1 agar tidak overflow
    today.setMonth(today.getMonth() + value); //Set bulan ke bulan setelah berapa 'bulan'
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate(); //Set tanggal terakhir di bulan tujuan
    today.setDate(Math.min(day,lastDay)); //Membandingkan tanggal hari ini (yang akan dipilih) dengan tanggal terakhir di bulan tujuan (misal tgl sekarang 31, tanggal terakhir di bulan target 28, maka yang dipilih 28)
    return today.toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'}); //Mengembalikan nilai tanggal tujuan
}

import { requiredEnv } from "../utils/env";

export const testData = {

    Btm: {
        Cred: {
            Username: requiredEnv('BTM_USERNAME'),
            Password: requiredEnv('BTM_PASSWORD')
        },
        TanggalBerangkat: getTanggal(2), //Ambil tanggal dua bulan dari sekarang
        Keberangkatan: "BUAH BATU",
        Tujuan: "BTM CILEGON",
        JumlahPenumpang: 2,
        ConnectingReservation: {
            Keberangkatan: "Bayah",
            Tujuan: "SUCI (HOTEL NINDYA BIODISTRICT )"
        },
        MetodeBayar: "TUNAI"
    },

    Daytrans: {
        Cred: {
            Username: requiredEnv('DAYTRANS_USERNAME'),
            Password: requiredEnv('DAYTRANS_PASSWORD')
        },
        TanggalBerangkat: getTanggal(2),
        TanggalPulang: getTanggal(3),
        Keberangkatan: "DIPATIUKUR",
        Tujuan: "ALFAMART RAYA PAJAJARAN BOGOR",
        KeberangkatanPulang: "ALFAMART RAYA PAJAJARAN BOGOR",
        TujuanPulang: "DIPATIUKUR",
        JumlahPenumpang: 2,
        ConnectingReservation: {
            Keberangkatan: "ALFAMART PRAMBANAN",
            Tujuan: "DIPATIUKUR"
        },
        MetodeBayar: {
            Metode: "TUNAI",
            Kategori: "TIKET KARYAWAN"
        }
    },

    Baraya: {        
        Cred: {
            Username: requiredEnv('BARAYA_USERNAME'),
            Password: requiredEnv('BARAYA_PASSWORD')
        },
        TanggalBerangkat: getTanggal(2), //Ambil tanggal dua bulan dari sekarang
        TanggalPulang: '10 Apr 2026', //Ambil tanggal tiga bulan dari sekarang
        Keberangkatan: "CALL CENTER BANDUNG",
        Tujuan: "CIMAREME",
        KeberangkatanPulang: "CIMAREME",
        TujuanPulang: "SOREANG2",
        JumlahPenumpang: 2,
        MetodeBayar: "TUNAI"
    },

    Aragon: {
        Cred: {
            Username: requiredEnv('ARAGON_USERNAME'),
            Password: requiredEnv('ARAGON_PASSWORD')
        },
        TanggalBerangkat: getTanggal(2), //Ambil tanggal dua bulan dari sekarang
        Keberangkatan: "BANDUNG",
        Tujuan: "Alfamart Banjar Atas",
        JumlahPenumpang: 2,
        MetodeBayar: "TUNAI"
    },

    Jackal: {
        Cred: {
            Username: requiredEnv('JACKAL_USERNAME'),
            Password: requiredEnv('JACKAL_PASSWORD')
        },
        TanggalBerangkat: getTanggal(2), //Ambil tanggal dua bulan dari sekarang
        TanggalPulang: getTanggal(3), //Ambil tanggal tiga bulan dari sekarang
        Keberangkatan: "DIPATIUKUR 89 SEBRANG UNI",
        Tujuan: "CHARTER",
        KeberangkatanPulang: "CHARTER",
        TujuanPulang: "DIPATIUKUR 89 SEBRANG UNI",
        JumlahPenumpang: 2,
        MetodeBayar: "TUNAI"
    },

    Pemesan: {
        NamaPemesan: "Pemesan",
        NoHP: "080000000000",
        // Tambahan data untuk Daytrans :
        Keterangan: "Ini adalah keterangan"
    },

    Penumpang: {
        PenumpangDewasa: {
            Penumpang_1: {
                NamaPenumpang: "Penumpang Satu",
                NoHP: "080000000001"
            },
            Penumpang_2: {
                NamaPenumpang: "Penumpang Dua",
                NoHP: "080000000002"
            },
            Penumpang_3: {
                NamaPenumpang: "Penumpang Tiga",
                NoHP: "080000000003"
            },
            Penumpang_4: {
                NamaPenumpang: "Penumpang Empat",
                NoHP: "080000000004"
            },
            Penumpang_5: {
                NamaPenumpang: "Penumpang Lima",
                NoHP: "080000000005"
            }
        },
        PenumpangBayi: {
            PenumpangBayi_1: {
                NamaPenumpang: "Penumpang Bayi Satu"
            },
            PenumpangBayi_2: {
                NamaPenumpang: "Penumpang Bayi Dua"
            },
            PenumpangBayi_3: {
                NamaPenumpang: "Penumpang Bayi Tiga"
            }
        }
    }

}