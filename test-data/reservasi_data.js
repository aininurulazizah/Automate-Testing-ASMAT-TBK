function getTanggal() {
    const today = new Date();
    const day = today.getDate(); //Ambil tanggal di hari ini
    today.setDate(1); //Set tanggal jadi 1 agar tidak overflow
    today.setMonth(today.getMonth() + 2); //Set bulan ke bulan setelah berapa 'bulan'
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate(); //Set tanggal terakhir di bulan tujuan
    today.setDate(Math.min(day,lastDay)); //Membandingkan tanggal hari ini (yang akan dipilih) dengan tanggal terakhir di bulan tujuan (misal tgl sekarang 31, tanggal terakhir di bulan target 28, maka yang dipilih 28)
    return today.toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'}); //Mengembalikan nilai tanggal tujuan
}

export const testData = {

    Btm: {
        TanggalBerangkat: getTanggal(),
        Keberangkatan: "BUAH BATU",
        Tujuan: "BTM CILEGON",
        JumlahPenumpang: 2
    },

    Baraya: {
        TanggalBerangkat: getTanggal(),
        Keberangkatan: "CALL CENTER BANDUNG",
        Tujuan: "CIMAREME",
        JumlahPenumpang: 1
    },

    Pemesan: {
        NamaPemesan: "Pemesan",
        NoHP: "080000000000"
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