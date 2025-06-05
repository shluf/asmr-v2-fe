<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/shluf/asmr/fe1c7f44a7214c6dbbc6108b031a22b9e584fe1f/public/logo.svg" width="200" alt="Laravel Logo"></a></p>

## Aplikasi Surat Menyurat RT/RW V2

Selamat datang di **Aplikasi Surat Menyurat RT/RW V2**! Versi terbaru ini adalah evolusi dari [proyek ASMR sebelumnya](https://github.com/shluf/asmr), kini dibangun dengan teknologi modern Next.js dan arsitektur berbasis API. Peningkatan ini bertujuan untuk menghadirkan interoperabilitas sistem yang lebih baik dan kemudahan pemeliharaan jangka panjang.

Aplikasi ini dirancang untuk merevolusi administrasi surat-menyurat di tingkat RT/RW. Kami menyediakan platform digital yang intuitif bagi warga untuk mengajukan berbagai jenis surat secara online, sekaligus menyederhanakan proses verifikasi dan persetujuan bagi pengurus RT/RW.

Lebih dari sekadar pengajuan surat, warga yang terdaftar dapat memantau progres program kerja RW (yang telah, sedang, dan akan dilaksanakan) secara transparan. Seluruh alur kerja—mulai dari pengajuan, verifikasi, hingga pengarsipan dokumen—kini sepenuhnya digital, aman, dan dapat diakses kapan pun, di mana pun.

## Instalasi Aplikasi Surat Menyurat RT/RW

### Repositori 
1. Frontend: https://github.com/shluf/asmr-v2-fe
2. Backend: https://github.com/Asyfdzaky/ASMR-BACKEND-API

### Prasyarat
* **MySql:** Pastikan MySql sudah terinstal.
* **NodeJs:** Pastikan NodeJs sudah terinstal.
* **PHP:** Pastikan PHP versi 8.0 atau lebih tinggi sudah terinstal.
* **Composer:** Pastikan Composer sudah terinstal secara global.

### Menjalankan Frontend
#### Langkah 1: Clone Proyek Frontend
```bash
git clone https://github.com/shluf/asmr-v2-fe.git
```
#### Langkah 2: Masuk ke Direktori Proyek Frontend
```bash
cd asmr-v2-fe
```
#### Langkah 3: Instal Dependensi Frontend
```bash
npm install
```
Atau jika Anda menggunakan yarn:
```bash
yarn install
```
#### Langkah 4: Konfigurasi Environment Frontend
Salin file `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```
Kemudian, buka file `.env.local` dan sesuaikan environtment variable sesuai dengan kebutuhan.

#### Langkah 5: Jalankan Aplikasi Frontend
```bash
npm run dev
```
Atau jika Anda menggunakan yarn:
```bash
yarn dev
```
Aplikasi frontend akan tersedia di `http://localhost:3000`.

### Menjalankan Backend

#### Langkah 1: Clone Proyek Backend
```bash
git clone https://github.com/Asyfdzaky/ASMR-BACKEND-API.git
```

#### Langkah 2: Masuk ke Direktori Proyek Backend
```bash
cd ASMR-BACKEND-API
```

#### Langkah 3: Instal Dependensi
```bash
composer install
```

#### Langkah 4: Konfigurasi Environment
Salin file `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env
```
Kemudian, buka file `.env` dan sesuaikan environtment variable sesuai dengan kebutuhan.

#### Langkah 5: Generate Key Aplikasi
```bash
php artisan key:generate
```

#### Langkah 6: Migrate database
Mulai database server kemudian jalan perintah berikut 
```bash
php artisan migrate
```

#### Langkah 7: (Opsional) Isi database dengan Seeder
Mulai database server kemudian jalan perintah berikut 
```bash
php artisan db:seed
```

#### Langkah 8: Jalankan Aplikasi Backend
```bash
php artisan serve
```
Aplikasi backend akan tersedia di `http://localhost:8000` (atau port lain jika dikonfigurasi berbeda).

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).