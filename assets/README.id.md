<p align="center">
  <img src="../assets/laolao.gif" alt="Offer Laolao Logo" width="200">
</p>

<p align="center">
  <a href="../README.md"><img src="https://img.shields.io/badge/English-blue" alt="English"></a>
  <a href="./README.zh-CN.md"><img src="https://img.shields.io/badge/中文-red" alt="中文"></a>
  <a href="./README.zh-TW.md"><img src="https://img.shields.io/badge/中文繁体-orange" alt="中文繁体"></a>
  <a href="./README.fr.md"><img src="https://img.shields.io/badge/Français-green" alt="Français"></a>
  <a href="./README.ja.md"><img src="https://img.shields.io/badge/日本語-purple" alt="日本語"></a>
  <a href="./README.ko.md"><img src="https://img.shields.io/badge/한국어-pink" alt="한국어"></a>
  <a href="./README.ru.md"><img src="https://img.shields.io/badge/Русский-teal" alt="Русский"></a>
  <a href="./README.es.md"><img src="https://img.shields.io/badge/Español-yellow" alt="Español"></a>
  <a href="./README.ar.md"><img src="https://img.shields.io/badge/العربية-yellow" alt="العربية"></a>
  <a href="./README.id.md"><img src="https://img.shields.io/badge/Bahasa_Indonesia-yellow" alt="Bahasa Indonesia"></a>
</p>

# 🚀 Offer Laolao - Asisten Pencatatan Otomatis Resume untuk Browser Pintar

> Ekstensi browser Chrome yang kuat yang mendukung mode ganda analisis resume cerdas dan pengisian manual, dengan fitur **pencocokan kolom cerdas dengan AI** dan **pengisian presisi tingkat kolom**, membantu pelamar pekerjaan mengisi resume mereka dengan cepat dan akurat di situs perekrutan utama.

![Version](https://img.shields.io/badge/Version-1.0-blue)
![Chrome](https://img.shields.io/badge/Chrome-Extension-green)
![Manifest](https://img.shields.io/badge/Manifest-V3-orange)

🌐 **Akses Online**：[https://offer-laolao-plugin.vercel.app](https://offer-laolao-plugin.vercel.app)

## ✨ Fitur Fungsional Utama

### 📄 Analisis Resume Cerdas

- **Dukungan untuk format multiple**：Dukungan untuk format resume utama seperti PDF, DOCX, DOC, TXT, JSON
- **Analisis API Cloud**：Integrasi dengan API analisis resume dari pasar Alibaba Cloud untuk mengekstrak informasi resume dengan akurat
- **Import JSON langsung**：Dukungan untuk mengimpor data resume langsung dalam format JSON untuk melakukan backup dan pemulihan data
- **Upload dengan drag and drop**：Dukungan untuk mengunggah file dengan drag and drop untuk operasi yang nyaman
- **Pemetaan kolom cerdas**：Otomatis memetakan hasil analisis ke kolom formulir yang sesuai

### 📝 Pengelolaan Informasi Resume yang Lengkap

Dukungan untuk pengisian dan pengelolaan modul resume berikut：

| Modul              | Kolom yang disertakan                                                                     |
| ----------------- | ---------------------------------------------------------------------------- |
| **Informasi Dasar**      | Nama, Jenis Kelamin, Tanggal Lahir, Nomor Telepon Seluler, Email, Nomor Identitas, Lokasi, Orientasi Politik         |
| **Ekspektasi Pekerjaan**      | Posisi yang Diinginkan, Industri yang Diinginkan, Gaji yang Diinginkan, Lokasi yang Diinginkan, Durasi Magang, Jam Kerja yang Mungkin                 |
| **Pengalaman Pendidikan**      | Nama Sekolah, Jurusan, Tingkat Pendidikan (Diploma/Sarjana/Magister/PhD), Peringkat, Tanggal Masuk/Lulus (dukung beberapa entri) |
| **Pengalaman Kerja/Magang** | Nama Perusahaan, Jabatan, Tanggal Mulai/Akhir, Deskripsi Pekerjaan (dukung beberapa entri)                          |
| **Pengalaman Proyek**      | Nama Proyek, Peran, Durasi Proyek, Deskripsi Proyek, Deskripsi Tanggung Jawab (dukung beberapa entri)                 |
| **Informasi Keterampilan**      | Nama Keterampilan, Tingkat Keterampilan (Pemula/Intermediet/Lanjutan/Ahli) (dukung beberapa entri)                        |
| **Kemampuan Bahasa**      | Nama Bahasa, Tingkat Penguasaan (Pemula/Dasar/Mahir/Lancar), Sertifikat Bahasa (dukung beberapa entri)              |
| **Kolom Kustom**    | Nama dan konten kolom kustom (dukung beberapa entri)                                             |
| **Deskripsi Diri**      | Demonstrasi kekuatan pribadi dan karakteristik                                                           |

### 🎯 Pengisian Formulir Cerdas

#### Fitur pre-fill dengan satu klik

- Klik tombol "📋 Isi Terlebih Dahulu" untuk secara otomatis mengisi data resume ke formulir situs perekrutan saat ini
- Pengenalan kolom formulir cerdas, pencocokan otomatis dengan informasi resume yang sesuai
- Dukungan untuk berbagai elemen formulir seperti input, textarea, select, contenteditable
- Memicu secara otomatis peristiwa formulir (input, change, blur) untuk memastikan verifikasi situs lulus
- Memberikan umpan balik visual setelah pengisian, menyoroti kolom yang telah diisi

#### Pengisian presisi tingkat kolom（↗ Pengisian dengan penunjuk）

- Setiap kolom memiliki tombol "↗" untuk **pengisian presisi satu kolom**
- Saat mengklik tombol, masuk ke "mode pengisian dengan penunjuk"：
  - Panduan operasi ditampilkan di bagian atas halaman
  - Ketika kursor mengarahkan ke elemen yang dapat diisi, elemen tersebut akan ditandai (batasan biru)
  - Klik kotak input target untuk memasukkan nilai kolom
  - Tekan tombol `Esc` untuk membatalkan operasi
- Dukungan untuk pengisian di elemen input, textarea, select, contenteditable
- Memicu secara otomatis peristiwa formulir (input, change, blur) untuk memastikan verifikasi situs lulus
- Menutup secara otomatis popup setelah pengisian berhasil, memudahkan operasi berurutan

### 🤖 Integrasi dengan Model AI Besar

Dukungan untuk beberapa penyedia layanan model besar China untuk optimalisasi konten resume cerdas dan pencocokan kolom：

| Penyedia Layanan                | Model yang Didukung                                               |
| --------------------- | ------------------------------------------------------ |
| **DeepSeek**          | DeepSeek Chat、DeepSeek Coder                          |
| **Kimi (Moonshot)**   | Moonshot 8K/32K/128K                                   |
| **Tongyi Qianwen (Alibaba Cloud)** | Qwen Turbo/Plus/Max/Max Teks Panjang                         |
| **Volcano Engine (Doubao)**   | Doubao Seed 1.6、Doubao Seed 1.6 Lite、Doubao Seed 1.6 Flash |
| **Zhipu AI**           | GLM-4、GLM-4 Flash、GLM-3 Turbo                        |
| **Baichuan Intelligence**          | Baichuan 2 Turbo、Baichuan 2 Turbo 192K                        |
| **Kustom**            | Dukungan untuk API format kompatibel OpenAI apa pun                         |

**Fitur Fungsional AI**：

- Pengujian koneksi API dengan satu klik
- **✨ Optimalisasi Resume AI dengan Satu Klik**：Secara cerdas mengoptimalkan presentasi pribadi, deskripsi pekerjaan, deskripsi proyek, dll.
- **🤖 Generasi Perkenalan Resume dengan AI**：Secara cerdas menghasilkan presentasi profesional berdasarkan data resume (200-300 karakter)
  - Dukungan untuk menyalin ke clipboard, mengisi kolom deskripsi diri, mengunduh sebagai file TXT
- Mengoptimalkan deskripsi pekerjaan dan proyek menurut metode STAR
- Otomatis menambahkan data kuantitatif dan deskripsi hasil

### 📤 Ekspor dalam Beberapa Format

- **Ekspor JSON**：Ekspor data resume lengkap untuk backup dan sinkronisasi antar perangkat
- **Ekspor LaTeX**：Menghasilkan template resume profesional dalam LaTeX
  - Dapat dikompilasi langsung di [Overleaf](https://www.overleaf.com/)
  - Dukungan untuk bahasa Cina (menggunakan paket ctex)
  - Penataan profesional, cocok untuk aplikasi akademik dan teknis
  - Termasuk definisi gaya lengkap dan komentar
- **🤖 Generasi Perkenalan Resume dengan AI**：Memanggil model AI untuk menghasilkan presentasi profesional secara cerdas
  - Dibuat berdasarkan latar belakang pendidikan, pengalaman kerja, pengalaman proyek, dan keterampilan dari resume
  - Dukungan untuk menyalin ke clipboard
  - Dukungan untuk mengisi kolom deskripsi diri dengan satu klik
  - Dukungan untuk mengunduh sebagai file `.txt`
- **Ekspor Prompt Perkenalan Resume**：Ekspor template prompt terstruktur, dengan dukungan `.md`/`.txt`
  - Termasuk prompt untuk konten dasar pribadi
  - Template pertanyaan tentang pengalaman kerja
  - Kerangka pertanyaan tentang pengalaman proyek
  - Kata panduan untuk evaluasi keterampilan

### 💾 Persistensi Data

- **Chrome Storage API**：Menggunakan penyimpanan asli browser, data aman dan andal
- **Penyimpanan otomatis real-time**：Menyimpan secara otomatis ketika konten formulir berubah, mencegah kehilangan data
- **Penyimpanan manual**：Dukungan untuk mengklik tombol simpan secara manual untuk mengonfirmasi penyimpanan
- **Reset Data**：Menghapus semua data resume dengan satu klik untuk memulai dari awal
- **Penyimpanan otomatis pengaturan**：Konfigurasi halaman pengaturan disimpan secara otomatis

## 🏗️ Arsitektur Proyek

```
super_resume/
├── docs                       # Halaman pengantar
├── manifest.json              # File konfigurasi ekstensi Chrome (Manifest V3)
├── icons/                     # Ikon ekstensi
├── src/
│   ├── background/            # Skrip layanan latar belakang
│   ├── content/               # Skrip konten (disuntik ke halaman web)
│   └── popup/                 # Halaman popup
└── README.md
```

## 📦 Panduan Instalasi

### Metode 1： Instalasi dalam Mode Pengembang

1. **Unduh Proyek**

   ```bash
   git clone https://github.com/itxaiohanglover/offer-laolao-plugin.git
   ```

   Atau unduh ZIP secara langsung dan ekstrak

2. **Buka Halaman Manajemen Ekstensi Chrome**

   - Masukkan ke dalam bilah alamat：`chrome://extensions/`
   - Atau melalui menu：Lebih Banyak Alat → Ekstensi

3. **Aktifkan Mode Pengembang**

   - Klik tombol "Mode Pengembang" di sudut kanan atas

4. **Muat Ekstensi**

   - Klik "Muat Ekstensi yang Sudah Diekstrak"
   - Pilih direktori root proyek (folder yang berisi `manifest.json`)

5. **Instalasi Selesai**
   - Ikon ekstensi akan muncul di bilah alat browser
   - Klik ikon untuk membuka asisten pengisian resume

### Metode 2： Instalasi di Browser Edge

Browser Edge juga mendukung ekstensi Chrome：

1. Buka `edge://extensions/`
2. Aktifkan "Mode Pengembang"
3. Klik "Muat Ekstensi yang Sudah Diekstrak"
4. Pilih direktori proyek

## 🚀 Panduan Penggunaan

### Langkah 1： Konfigurasikan API (opsional tetapi disarankan)

1. Klik ikon ekstensi, beralih ke tab "⚙️ Pengaturan"
2. **Konfigurasi Model AI** (untuk optimalisasi konten, disarankan)
   - Pilih penyedia model (seperti DeepSeek, Kimi, dll.)
   - Masukkan kunci API yang sesuai
   - Klik tombol "🔗 Uji Koneksi" untuk memverifikasi konfigurasi
3. **Konfigurasi API Analisis Resume** (untuk menganalisis resume dalam format PDF/DOCX)
   - Beli layanan analisis resume di [Pasar Alibaba Cloud](https://market.aliyun.com/detail/cmapi034316)
   - Masukkan URL API dan Kode APP

### Langkah 2： Isi atau Impor Resume

#### Metode A： Unggah dan Analisis Cerdas

1. Temukan area upload di bagian atas tab "📝 Isi Resume"
2. Seret dan lepas file resume atau klik untuk memilih file
3. Tunggu hingga analisis selesai, klik tombol "Gunakan Data Analisis"
4. Informasi resume akan secara otomatis mengisi formulir

#### Metode B： Isian Manual

1. Isi semua informasi langsung ke formulir
2. Klik tombol "+ Tambah" untuk menambah beberapa pengalaman
3. Data akan disimpan secara otomatis, atau Anda dapat mengklik tombol "💾 Simpan" untuk menyimpan secara manual

#### Metode C： Impor JSON

1. Jika Anda memiliki file JSON yang diekspor sebelumnya
2. Cukup seret dan lepas ke area upload untuk mengimpor

### Langkah 3： Optimalkan Resume dengan AI (opsional)

1. Pastikan kunci API model AI dikonfigurasi
2. Isi konten deskriptif resume (presentasi pribadi, deskripsi pekerjaan, deskripsi proyek, dll.)
3. Klik tombol "✨ Optimalkan dengan AI"
4. Sistem akan mengoptimalkan semua konten deskriptif satu per satu
5. Konten yang dioptimalkan akan secara otomatis mengisi formulir kembali

### Langkah 4： Isi Resume di Situs Perekrutan

#### Pre-fill dengan Satu Klik (disarankan)

1. Buka halaman pengisian resume situs perekrutan target
2. Klik ikon ekstensi untuk membuka popup
3. Klik tombol "📋 Isi Terlebih Dahulu"
4. Ekstensi akan mengenali dan mengisi kolom formulir secara otomatis
5. Setelah pengisian selesai, detail pengisian akan ditampilkan

#### Pengisian Presisi Tingkat Kolom

1. Temukan kolom yang ingin Anda isi, klik tombol "↗" di sampingnya
2. Popup akan secara otomatis menutup, dan halaman akan memasuki "mode pengisian dengan penunjuk"
3. Klik kotak input target di halaman web
4. Nilai kolom akan diisi dengan presisi
5. Tekan `Esc` untuk membatalkan operasi

### Langkah 5： Ekspor dan Buat Backup

1. Klik tombol "📤 Ekspor"
2. Pilih format ekspor：
   - **JSON**：Untuk backup dan impor data
   - **LaTeX**：Menghasilkan dokumen resume profesional yang dapat diedit dan dicetak di Overleaf
   - **🤖 Generasi Perkenalan Resume dengan AI**：Memanggil AI untuk menghasilkan presentasi profesional secara cerdas
     - Setelah dihasilkan, Anda dapat menyalinnya, mengisinya ke deskripsi diri, atau mengunduhnya sebagai file TXT
   - **Prompt Perkenalan Resume**：Ekspor prompt terstruktur untuk berinteraksi dengan AI (dengan dukungan `.md`/`.txt`), nama file secara otomatis diberi nama "Nama Pengguna_Prompt_Resume_Tanggal"

## 🌐 Situs Perekrutan yang Didukung

Ekstensi ini menggunakan teknologi pengenalan formulir universal dan secara teoretis mendukung semua situs perekrutan, termasuk tetapi tidak terbatas pada：

- ✅ Zhilian (zhaopin.com)
- ✅ 51job (51job.com)
- ✅ Liepin (liepin.com)
- ✅ Boss Zhipin (zhipin.com)
- ✅ Lagou (lagou.com)
- ✅ Maimai (maimai.cn)
- ✅ Shixiseng (shixiseng.com)
- ✅ Nowcoder (nowcoder.com)
- ✅ Halaman perekrutan resmi perusahaan besar seperti ByteDance Campus Recruitment

> 💡 Tips：Jika formulir situs tertentu tidak dapat dikenali secara otomatis, Anda dapat menggunakan fitur "pengisian presisi tingkat kolom" untuk menentukan lokasi pengisian secara manual.

## 🛠️ Tumpukan Teknologi

- **Framework Frontend**：JavaScript asli (ES6+)
- **Standar Ekstensi**：Chrome Extensions Manifest V3
- **Solusi Penyimpanan**：Chrome Storage API + localStorage
- **Solusi Gaya**：CSS asli (variabel CSS, Flexbox, Grid)
- **Format Dokumen**：LaTeX (dukungan bahasa Cina ctex)
- **Integrasi API**：
  - API Analisis Resume Alibaba Cloud
  - API model besar yang kompatibel dengan OpenAI (DeepSeek, Doubao (Volcano Engine), Tongyi Qianwen, dll.)

## ⚠️ Catatan Penting

1. **Konfigurasi API**：Fitur analisis resume memerlukan konfigurasi API, jika tidak, hanya impor JSON yang dapat digunakan
2. **Optimalisasi AI**：Untuk menggunakan fitur optimalisasi, kunci API model AI harus dikonfigurasi
3. **Kesesuaian Situs**：Beberapa situs mungkin menggunakan komponen formulir khusus, jadi disarankan untuk menggunakan pengisian tingkat kolom
4. **Keamanan Data**：Semua data hanya disimpan secara lokal di browser dan tidak diunggah ke server apa pun
5. **Izin Browser**：Ekstensi memerlukan izin `activeTab`, `scripting`, dan `storage` untuk berfungsi dengan benar
6. **Halaman Khusus**：Halaman sistem seperti `chrome://`, `edge://`, `about:` tidak mendukung injeksi skrip konten

## 📋 Catatan Perubahan

### v1.0 (Versi Saat Ini)

## 📄 Lisensi Kode Sumber

Proyek ini dilisensikan di bawah [Lisensi MIT](LICENSE).

## 🤝 Kontribusi dan Umpan Balik

Kontribusi dan umpan balik diterima!

- 🐛 Temukan bug？ Silakan kirim [Issue](https://github.com/itxaiohanglover/offer-laolao-plugin/issues)
- 💡 Ada ide baru？ Selamat datang untuk mengirim [Feature Request](https://github.com/itxaiohanglover/offer-laolao-plugin/issues)
- 🔧 Ingin berkontribusi kode？ Selamat datang untuk mengirim [Pull Request](https://github.com/itxaiohanglover/offer-laolao-plugin/pulls)

---

<p align="center">
  <strong>Buat pencarian kerja lebih mudah ✨</strong>
</p>