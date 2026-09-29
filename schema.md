TrackCast — Data Schema
Konvensi
Identitas menggunakan UUID; id numerik pada UI saat ini hanya data prototipe.
Semua timestamp disimpan sebagai UTC ISO-8601 (created_at, updated_at); zona tampilan disimpan sebagai IANA, misalnya Asia/Makassar.
Status keselamatan kanonis: aman, waspada, bahaya.
Peran yang memodifikasi status atau laporan penting wajib menghasilkan audit event.
Entitas inti
users
Kolom	Tipe	Keterangan
id	uuid PK	Identitas pengguna
full_name	text	Nama tampilan
email	text nullable unique	Email terverifikasi bila memakai email/Google
phone_e164	text nullable unique	Nomor WhatsApp/telepon dalam E.164
avatar_url	text nullable	URL avatar
auth_provider	enum	email, whatsapp_otp, google
status	enum	active, suspended, deleted
created_at, updated_at	timestamptz	Metadata
Kendala: minimal satu dari email atau phone_e164 wajib ada. Credential, refresh token, dan kode OTP dikelola penyedia autentikasi, bukan tabel aplikasi biasa.

emergency_contacts
Kolom	Tipe	Keterangan
id	uuid PK	Identitas kontak
user_id	uuid FK users	Pemilik kontak
name	text	Nama kontak
phone_e164	text	Nomor penerima
relationship	text	Mis. keluarga, teman
priority	smallint	Urutan notifikasi
verified_at	timestamptz nullable	Waktu persetujuan/verifikasi
destinations
Kolom	Tipe	Keterangan
id	uuid PK	Identitas destinasi
slug	text unique	ID URL stabil
name	text	Nama destinasi
region	text	Kabupaten/provinsi/keterangan wilayah
type	enum	gunung, pantai, budaya, air_terjun, taman_nasional
latitude, longitude	decimal	Titik pusat destinasi
timezone	text	Zona IANA
geometry	geometry/GeoJSON nullable	Batas atau jalur destinasi
is_active	boolean	Ketersediaan pada aplikasi
created_at, updated_at	timestamptz	Metadata
destination_statuses
Snapshot status operasional yang ditampilkan pada peta dan detail.

Kolom	Tipe	Keterangan
id	uuid PK	Identitas snapshot
destination_id	uuid FK destinations	Destinasi
level	enum	aman, waspada, bahaya
condition	text	Mis. Kabut Tebal
note	text	Catatan operasional/pembatasan
source_summary	text	Mis. BMKG + Mitra Lapangan
confidence	numeric nullable	0–1, jika model agregasi dipakai
effective_at	timestamptz	Mulai berlaku
expires_at	timestamptz nullable	Kedaluwarsa data
created_by	uuid FK users nullable	Admin/mitra bila status manual
created_at	timestamptz	Waktu dibuat
Indeks: (destination_id, effective_at desc) dan indeks untuk level + expires_at.

weather_observations
Kolom	Tipe	Keterangan
id	uuid PK	Identitas observasi
destination_id	uuid FK destinations nullable	Agregasi untuk destinasi
cell_id	text nullable	ID grid hyperlocal/H3/penyedia
observed_at	timestamptz	Waktu data berlaku
source	enum	bmkg, partner, model
temperature_c	numeric	Suhu
humidity_pct	numeric nullable	Kelembapan 0–100
wind_kph	numeric nullable	Kecepatan angin
rain_probability_pct	numeric nullable	Peluang hujan 0–100
condition_code	text	Kode kondisi sumber
condition_label	text	Label yang ditampilkan
raw_payload	jsonb nullable	Payload sumber untuk audit
hyperlocal_cells
Kolom	Tipe	Keterangan
id	text PK	ID sel, idealnya H3
resolution	smallint	Resolusi grid
centroid_lat, centroid_lng	decimal	Titik tengah
boundary	geometry/GeoJSON	Batas heksagon
latest_status	enum	Status untuk render cepat
status_updated_at	timestamptz	Pembaruan terakhir
Grid SVG pada UI merupakan representasi visual; produksi sebaiknya memakai indeks geospasial nyata agar status dapat dihitung dan di-query per area.

elevation_profiles
Kolom	Tipe	Keterangan
id	uuid PK	Identitas titik profil
destination_id	uuid FK destinations	Destinasi
sequence	integer	Urutan titik
label	text	Mis. Basecamp, Pos 1, Puncak
altitude_m	numeric	Ketinggian meter
expected_temp_c	numeric nullable	Suhu pada titik
Mitra, layanan, dan laporan
partners
Kolom	Tipe	Keterangan
id	uuid PK	Identitas profil mitra
user_id	uuid FK users unique	Akun pemilik
role	enum	pemandu, porter, ranger, pengelola, basecamp
verification_status	enum	pending, verified, rejected, expired
verified_at	timestamptz nullable	Waktu verifikasi
certificate_ref	text nullable	Referensi sertifikat, bukan file publik
bio	text nullable	Deskripsi singkat
available	boolean	Ketersediaan saat ini
price_per_day_idr	integer nullable	Tarif harian
rating_average	numeric	Nilai denormalisasi
rating_count	integer	Jumlah ulasan
partner_destinations
Relasi many-to-many untuk cakupan layanan.

Kolom	Tipe	Keterangan
partner_id	uuid FK partners	Mitra
destination_id	uuid FK destinations	Destinasi
service_role	enum	pemandu atau porter
Primary key gabungan: (partner_id, destination_id, service_role).

partner_languages
Kolom	Tipe	Keterangan
partner_id	uuid FK partners	Mitra
language_code	text	BCP-47, mis. id, en, ban
proficiency	enum	basic, conversational, fluent
field_reports
Kolom	Tipe	Keterangan
id	uuid PK	Identitas laporan
author_user_id	uuid FK users	Pengirim
partner_id	uuid FK partners nullable	Ada bila berasal dari mitra
destination_id	uuid FK destinations	Lokasi utama
location_text	text	Lokasi detail, mis. Pos 3
latitude, longitude	decimal nullable	Titik kejadian bila disetujui
severity	enum	green, orange, red
title	text	Judul laporan
description	text	Isi laporan
occurred_at	timestamptz	Waktu kondisi diamati
moderation_status	enum	pending, published, rejected, archived
published_at	timestamptz nullable	Waktu terbit
created_at, updated_at	timestamptz	Metadata
report_media
Kolom	Tipe	Keterangan
id	uuid PK	Identitas media
report_id	uuid FK field_reports	Laporan induk
storage_key	text	Referensi object storage privat
media_type	enum	image, video
captured_at	timestamptz nullable	Waktu pengambilan
moderation_status	enum	Status moderasi media
traveler_reviews
Kolom	Tipe	Keterangan
id	uuid PK	Identitas ulasan
author_user_id	uuid FK users	Pengirim
destination_id	uuid FK destinations	Destinasi
partner_id	uuid FK partners nullable	Mitra yang diulas bila ada
rating	smallint	1–5
body	text	Isi ulasan/laporan perjalanan
occurred_at	timestamptz nullable	Waktu perjalanan
moderation_status	enum	Status publikasi
created_at	timestamptz	Metadata
Rekomendasi dan SOS
safety_recommendations
Kolom	Tipe	Keterangan
id	uuid PK	Identitas rekomendasi
destination_id	uuid FK destinations	Konteks destinasi
status_id	uuid FK destination_statuses nullable	Snapshot dasar
title	text	Judul rekomendasi
body	text	Rekomendasi yang ditampilkan
rationale	jsonb	Faktor terstruktur: cuaca, laporan, aturan
generator	enum	rule, ai, editor
model_version	text nullable	Versi model AI
valid_from, valid_until	timestamptz	Masa berlaku
reviewed_by	uuid FK users nullable	Peninjau manusia
sos_events
Kolom	Tipe	Keterangan
id	uuid PK	Identitas insiden
user_id	uuid FK users	Pemicu SOS
destination_id	uuid FK destinations nullable	Konteks destinasi
status	enum	countdown, queued, sent, acknowledged, resolved, cancelled, failed
latitude, longitude	decimal nullable	Lokasi terakhir yang disetujui
location_accuracy_m	numeric nullable	Akurasi GPS
location_captured_at	timestamptz nullable	Waktu lokasi
triggered_at	timestamptz nullable	Waktu dikirimkan
acknowledged_at, resolved_at	timestamptz nullable	Siklus penanganan
cancellation_reason	text nullable	Alasan batal jika ada
created_at, updated_at	timestamptz	Metadata
sos_notifications
Kolom	Tipe	Keterangan
id	uuid PK	Identitas notifikasi
sos_event_id	uuid FK sos_events	Insiden
recipient_type	enum	emergency_contact, partner, sar_operator
recipient_ref	text	ID penerima atau nomor yang dilindungi
channel	enum	push, sms, whatsapp, webhook
delivery_status	enum	queued, sent, delivered, failed
attempted_at, delivered_at	timestamptz nullable	Waktu pengiriman
provider_message_id	text nullable	Referensi provider
Audit, izin, dan keamanan
consent_records
Simpan user_id, consent_type (location, emergency_sharing, terms, privacy), granted_at, revoked_at, versi dokumen, serta metadata minimal yang diperlukan.

audit_events
Simpan id, actor_user_id, action, entity_type, entity_id, before_data, after_data, ip_hash, dan created_at. Jangan menyimpan rahasia atau lokasi presisi lebih dari yang diperlukan pada log umum.

Relasi utama
users ──< emergency_contacts
users ──1 partners ──< partner_destinations >── destinations
users ──< field_reports >── destinations
field_reports ──< report_media
destinations ──< weather_observations
destinations ──< destination_statuses
destinations ──< elevation_profiles
destinations ──< safety_recommendations
users ──< sos_events ──< sos_notifications
Akses data yang direkomendasikan
Pengguna publik terautentikasi dapat membaca destinasi aktif, status terbit, cuaca, rekomendasi terbit, laporan dan ulasan yang dimoderasi.
Pemilik hanya boleh membaca/mengubah profil, kontak darurat, dan SOS miliknya sendiri.
Mitra terverifikasi boleh membuat laporan untuk cakupan destinasi mereka; laporan tetap berstatus pending kecuali kebijakan mengizinkan publikasi otomatis berdasarkan reputasi.
Admin/moderator memiliki akses operasi terbatas dan semua mutasi sensitif diaudit.
Lokasi SOS dan nomor penerima tidak pernah diekspos di feed publik atau API klien umum.
