## Automated Testing - ASMAT - Trans Berjaya Khatulistiwa (TBK)
### Deskripsi
Proyek automasi testing untuk proses pemesanan tiket pada layanan Asmat : Daytrans, Baraya, Aragon, dan Jackal.

### Tools & Prerequisites
- **Node.js v18+** (v22.11.0 digunakan) — Runtime JavaScript untuk menjalankan Playwright
- **Git** — Version control
- **Playwright** — Framework automated UI testing
- **GitHub Actions** — CI untuk menjalankan automated test secara otomatis
- **Telegram Bot API** — Notifikasi hasil pengujian ke telegram
- **Visual Studio Code** (atau editor lain) — Code editor
  
### Cara Menjalankan
1. Install dependensi yang dibutuhkan
2. Isi credential login sistem Asmat pada file `.env.example` lalu ubah nama file menjad `.env`
3. Menjalankan test semua website :
    ```
    npx playwright test ./reservasi_test.spec.js --project=chromium --headed --workers=1
    ```
4. Menjalankan test pada mitra tertentu :
    ```
    npx playwright test ./reservasi_test.spec.js --project=chromium --headed --workers=1 --grep '@[nama_mitra]'
    ```
    Contoh melakukan testing pada Daytrans :
    ```
    npx playwright test ./reservasi_test.spec.js --project=chromium --headed --workers=1 --grep '@Daytrans'
    ```
5. Menjalankan test untuk kondisi case tertentu, misalnya jalankan test case reservasi dengan kondisi pulang pergi (Rountrip) :
    ```
    npx playwright test ./reservasi_test.spec.js --project=chromium --headed --workers=1 --grep '[kondisi]'
    ```
    Contoh melakukan testing reservasi pulang pergi : 
    ```
    npx playwright test ./reservasi_test.spec.js --project=chromium --headed --workers=1 --grep 'Round Trip'
    ```
    Ini akan dijalankan di semua mitra yang memiliki kondisi yang case tersebut.
7. Menjalankan test spesifik (kondisi tertentu pada mitra tertentu) :
    ```
    npx playwright test ./reservasi_test.spec.js --project=chromium --headed --workers=1 --grep '[nama test case spesifik]'
    ```
    Contoh melakukan testing connecting reservation pada BTM :
    ```
    npx playwright test ./reservasi_test.spec.js --project=chromium --headed --workers=1 --grep '@btm - Test Case 3 - Connecting Reservation'
    ```
8. Menjalankan test dengan lebih dari satu kata kunci (bisa mitra/test case) :
    ```
    npx playwright test ./reservasi_test.spec.js --project=chromium --headed --workers=1 --grep '[kata kunci 1]|[kata kunci 2]|[kata kunci n]'
    ```
    Contoh melakukan testing pada mitra Daytrans, Baraya, dan BTM :
    ```
    npx playwright test ./reservasi_test.spec.js --project=chromium --headed --workers=1 --grep '@daytrans|@baraya|@btm'
    ```

   Note : 
    `--project-chromium` jika ingin menggunakan webdriver tertentu, disini menggunakan chrome.
    `--headed` menampilkan proses automate testing berjalan. Hapus jika ingin membiarkan proses berjalan di latar belakang.
    `--workers=1` menentukan berapa jendela browser yang akan dijalankan. Default jendela browser adalah dua dan dijalankan secara paralel.
