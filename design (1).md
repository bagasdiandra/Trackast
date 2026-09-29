TrackCast — Design Specification
Prinsip visual
TrackCast dirancang sebagai "operations room di saku": tenang, kredibel, dan cepat dipindai saat kondisi perjalanan berubah. Dark mode navy memberi fondasi yang tidak menyilaukan, sementara cyan menandai data aktif, hijau menyatakan aman, amber menyatakan kewaspadaan, dan merah hanya dipakai untuk risiko atau SOS.

Fondasi desain
Elemen	Spesifikasi
Latar utama	#0A1628 navy gelap
Surface/kartu	#111E35
Surface sekunder	#162240 atau #1A2F52
Border	#1E3356
Teks utama	#E8F0FE
Teks redup	#6B8BAA
Aksen/data aktif	#00C2CC cyan-teal
Aman	emerald (#34D399 sebagai aksen)
Waspada	amber (#FBBF24 sebagai aksen)
Bahaya/SOS	red (#F87171 sebagai aksen)
Radius	Dasar 12px; kartu/aksi utama dapat memakai 16–24px
Font judul	Poppins, 600–800
Font isi	Inter, 400–600
Font data	JetBrains Mono, 400–500 untuk waktu, suhu, koordinat, dan angka operasional
Font aktif didefinisikan melalui Google Fonts di src/index.css. Gunakan token CSS yang sudah ada (--background, --card, --primary, dan seterusnya) untuk menjaga konsistensi.

Hierarki dan layout
Aplikasi memakai frame mobile-first dengan app bar di atas dan bottom navigation lima item di bawah.
Area konten dapat di-scroll; bottom navigation tetap mudah dijangkau ibu jari.
Gunakan header ringkas: judul tebal, subteks/sumber data kecil, lalu aksi kontekstual.
Kartu berbatas halus dan memiliki kontras surface, bukan shadow besar. Gunakan garis cyan/warna status secara selektif sebagai penanda informasi penting.
Spasi mengikuti ritme 4px: 4, 8, 12, 16, 20, 24, 32. Hindari keramaian visual dan jangan menaruh lebih dari satu CTA primer yang bersaing dalam satu viewport.
Navigasi
Tab	Tujuan	Penanda aktif
Beranda	Ringkasan kondisi dan jalan pintas	cyan
Peta	Eksplorasi status spasial	cyan
Mitra	Layanan dan laporan lapangan	cyan
Laporan	Rekomendasi serta ulasan perjalanan	cyan
SOS	Aksi darurat	merah
Label selalu tampil bersama ikon/emoji. Tab SOS dipisahkan secara visual melalui warna merah lembut agar terlihat tanpa mendominasi navigasi normal.

Bahasa status dan data
Gunakan selalu kombinasi warna, label teks, ikon, dan bila relevan pola/outline.

Status	Warna	Label	Penggunaan
Aman	Hijau	AMAN	Kondisi normal, jalur terbuka, informasi positif
Waspada	Amber	WASPADA	Risiko sedang, keputusan dengan mitigasi
Bahaya	Merah	BAHAYA / DITUTUP	Risiko tinggi, penutupan, tindakan segera
Semua modul data harus menampilkan kapan informasi terakhir diperbarui dan asalnya, misalnya BMKG + Mitra Lapangan · 09:00 WITA.

Peta dan grid hyperlocal
Peta menggunakan SVG dengan siluet kepulauan sebagai konteks, lalu grid heksagonal untuk menunjukkan variasi lokal tanpa memberi kesan presisi palsu.
Sel grid memakai palet hijau/amber/merah dengan opacity rendah di atas navy. Grid yang tidak berstatus harus tetap redup.
Marker destinasi memuat simbol kondisi, cincin berwarna status, dan label notifikasi singkat seperti LOKAL, WASPADA, atau ALERT.
Sediakan legenda permanen, kompas, dan instruksi singkat "Ketuk penanda untuk detail".
Modal detail menampilkan mini-map, badge status, metrik cuaca, catatan operasional, sumber, dan grafik elevasi bila relevan.
Komponen dan perilaku
Kartu destinasi
Berisi ikon kondisi, nama, wilayah, badge status, suhu/kondisi singkat, serta waktu pembaruan. Seluruh kartu adalah target interaksi yang membuka detail, bukan hanya teksnya.

Filter dan pencarian
Filter status dan tipe berupa chip pil. Keadaan aktif memakai cyan solid dengan teks navy; nonaktif memakai surface gelap dengan border. Pencarian harus jelas placeholder-nya dan tidak menghapus filter lain tanpa tindakan pengguna.

Kartu mitra
Tampilkan avatar inisial, nama, peran, verifikasi, rating/review, bahasa, cakupan lokasi, ketersediaan, sertifikasi, dan tarif. Badge verifikasi harus dapat dijelaskan lewat teks, bukan hanya centang.

Laporan lapangan
Urutkan berdasarkan dampak dan kebaruan. Tampilkan pengirim/peran, lokasi, waktu, status, judul, ringkasan, dan thumbnail bukti bila tersedia. Form laporan memakai label eksplisit dan feedback sukses yang singkat.

Rekomendasi keselamatan
Sertakan badge AI Smart sebagai penanda asal, tetapi tuliskan dasar rekomendasi dalam bahasa natural: cuaca, angin, hujan, dan laporan lapangan yang digunakan. Jangan menyajikan rekomendasi AI sebagai kepastian.

SOS
Tombol darurat berbentuk target/bulat merah besar, ditempatkan terpisah dari aksi reguler. Saat ditekan, gunakan hitung mundur jelas dengan tombol batal yang mudah dijangkau. Setelah status berubah, berikan pesan eksplisit: sedang menyiapkan, menunggu jaringan, terkirim, atau gagal.

Aksesibilitas dan responsif
Kontras teks minimum mengikuti WCAG AA; teks redup tidak dipakai untuk instruksi kritis.
Target sentuh minimum 44 × 44px.
Semua input memiliki label; emoji dan ikon dekoratif memiliki alternatif teks atau aria-hidden.
Fokus keyboard memakai ring cyan yang tampak jelas.
Pada layar lebar, pertahankan lebar konten nyaman dan jangan meregangkan kartu tanpa batas; peta dapat mengambil ruang tambahan.
Respect prefers-reduced-motion; hindari animasi pada peringatan bahaya kecuali benar-benar membantu.
Nada microcopy
Bahasa Indonesia ringkas, menenangkan, dan spesifik. Utamakan tindakan yang bisa dilakukan: "Tunda pendakian hingga cuaca membaik" lebih baik daripada "Cuaca buruk". Untuk bahaya, gunakan instruksi langsung tanpa dramatisasi: "Jalur Senaru ditutup sementara. Gunakan jalur alternatif hanya setelah ada pengumuman resmi."
