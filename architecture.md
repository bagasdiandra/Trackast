# TrackCast — Architecture Document

## 1. Gambaran Umum Sistem

TrackCast adalah aplikasi mobile-first keselamatan wisata yang menggabungkan data cuaca hyperlocal OpenWeatherMap, status keselamatan destinasi, laporan mitra lapangan, direktori layanan terverifikasi, dan tanggap darurat SOS dalam satu platform terpadu.

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│          Web App (Mobile-First PWA)  ·  Native App (kelak)      │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTPS / WSS
┌───────────────────────────▼─────────────────────────────────────┐
│                        API GATEWAY                              │
│          Auth · Rate Limit · Request Routing · Logging          │
└───┬───────────────┬───────────────┬──────────────┬──────────────┘
    │               │               │              │
┌───▼───┐     ┌─────▼────┐   ┌─────▼────┐   ┌────▼──────┐
│ Auth  │     │Destination│   │ Partner  │   │  SOS &    │
│Service│     │& Weather  │   │& Report  │   │Notif Svc  │
└───────┘     │  Service  │   │  Service │   └───────────┘
              └─────┬─────┘   └──────────┘
                    │
┌───────────────────▼─────────────────────────────────────────────┐
│                    DATA LAYER                                   │
│   PostgreSQL (PostGIS)  ·  Object Storage  ·  Cache (Redis)     │
└─────────────────────────────────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                  EXTERNAL INTEGRATIONS                          │
│          OpenWeatherMap API  ·  Google OAuth  ·  SAR            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Layer Arsitektur

### 2.1 Client Layer

| Aspek           | Spesifikasi                                                           |
|-----------------|-----------------------------------------------------------------------|
| Pendekatan      | Mobile-first Progressive Web App (PWA)                                |
| Frame konten    | Fixed app bar + bottom navigation 5 tab + scrollable content area     |
| Offline support | Cache-first untuk data destinasi dan status; antrean SOS saat offline |
| Navigasi        | Beranda · Peta · Mitra · Laporan · SOS                                |
| Rendering       | CSR dengan pre-render statis untuk halaman publik                     |

**Stack Frontend (MVP Prototipe):**
```
Trackast/
├── landing.html            # Splash/landing page — nilai utama & CTA "Mulai Sekarang"
├── auth.html               # Halaman login, register, lupa sandi
├── index.html              # Beranda (post-login) — cuaca & ringkasan status
├── map.html                # Peta keselamatan interaktif
├── partners.html           # Direktori mitra & laporan lapangan
├── reports.html            # Rekomendasi & ulasan wisatawan
├── sos.html                # Tombol SOS & kontak darurat
│
├── assets/
│   ├── css/
│   │   ├── global.css      # Design tokens & utilitas bersama (semua halaman import ini)
│   │   ├── landing.css     # Styles splash/landing page
│   │   ├── auth.css        # Styles halaman autentikasi
│   │   ├── home.css
│   │   ├── map.css
│   │   ├── partners.css
│   │   ├── reports.css
│   │   └── sos.css
│   │
│   ├── js/
│   │   ├── mock-data.js    # Data simulasi untuk MVP (dipakai semua halaman)
│   │   ├── landing.js      # Animasi & navigasi landing page
│   │   ├── auth.js         # Logic autentikasi (navigasi, validasi, simulasi)
│   │   ├── home.js
│   │   ├── map.js          # Peta SVG + grid hyperlocal
│   │   ├── partners.js
│   │   ├── reports.js
│   │   └── sos.js          # Countdown SOS, status pengiriman
│   │
│   └── images/             # Aset gambar & ikon statis (logo, ilustrasi)
│
├── architecture.md
├── design (1).md
├── schema.md
└── TrackCast-PRD.txt
```

**Alur navigasi halaman:**
```
landing.html  →  auth.html  →  index.html (beranda)
                                   ↕ (bottom navigation)
                              map.html · partners.html · reports.html · sos.html
```

---

### 2.2 API Gateway

Pintu masuk tunggal semua request client.

**Tanggung Jawab:**
- Validasi JWT / session token
- Rate limiting per user dan per endpoint
- Routing ke microservice yang tepat
- Logging request untuk observabilitas
- CORS dan header keamanan (CSP, HSTS)

---

### 2.3 Backend Services

#### Auth Service
```
POST /auth/register          # email+password atau username+password
POST /auth/login             # email atau username
POST /auth/google            # Google OAuth callback
POST /auth/logout
GET  /auth/me
```

**Alur autentikasi:**
```
[Client] → (email/pass) → [Auth Service] → [Identity Provider]
[Client] → (Google) → [Google OAuth 2.0] → [Auth Service]
                                               ↓
                                    JWT (access + refresh token)
```

#### Destination & Weather Service
```
GET  /destinations                    # List destinasi aktif + filter
GET  /destinations/:slug              # Detail destinasi
GET  /destinations/:slug/status       # Status operasional terkini
GET  /destinations/:slug/weather      # Prakiraan cuaca + jam-ke-jam
GET  /destinations/:slug/elevation    # Profil elevasi
GET  /map/cells                       # Grid hyperlocal H3 dengan status
```

**Alur data cuaca:**
```
[OpenWeatherMap API] → [Weather Ingestion Job] → [weather_observations]
                                              ↓
                                   [Aggregation Engine]
                                              ↓
                            [destination_statuses] (level: aman/waspada/bahaya)
                                              ↓
                                        [Cache Redis TTL 5 menit]
                                              ↓
                                          [Client]
```

#### Partner & Report Service
```
GET  /partners                        # Direktori mitra + filter
GET  /partners/:id                    # Profil mitra detail
POST /reports                         # Buat laporan lapangan (mitra)
GET  /reports                         # Feed laporan termoderasi
GET  /reports/:id
PUT  /reports/:id/moderate            # Admin only
GET  /reviews                         # Ulasan wisatawan
POST /reviews                         # Tambah ulasan
```

#### SOS & Notification Service
```
POST /sos                             # Trigger SOS (countdown dimulai)
POST /sos/:id/cancel                  # Batal dalam countdown
GET  /sos/:id/status                  # Status pengiriman real-time
GET  /emergency-contacts              # CRUD kontak darurat
POST /emergency-contacts
PUT  /emergency-contacts/:id
DELETE /emergency-contacts/:id
```

**Alur SOS:**
```
[Client tekan SOS]
      ↓
[countdown 5 detik — bisa dibatalkan]
      ↓
POST /sos → status: queued
      ↓
[SOS Service ambil lokasi + identitas + konteks]
      ↓
[Kirim notifikasi paralel]:
  ├── Push notification → emergency_contacts
  ├── SMS → emergency_contacts
  └── Webhook → SAR operator (jika terkonfigurasi)
      ↓
status: sent → acknowledged → resolved
(setiap transisi disimpan di sos_notifications + audit_events)
```

---

### 2.4 Data Layer

#### Database: PostgreSQL + PostGIS

**Tabel inti beserta indeks kritis:**

| Tabel                  | Indeks Penting                                            |
|------------------------|-----------------------------------------------------------|
| `destinations`         | `slug` (unique), `(type, is_active)`                     |
| `destination_statuses` | `(destination_id, effective_at DESC)`, `(level, expires_at)` |
| `weather_observations` | `(destination_id, observed_at DESC)`, `(cell_id, observed_at)` |
| `hyperlocal_cells`     | `boundary` (GiST/geospasial), `latest_status`            |
| `field_reports`        | `(destination_id, moderation_status, occurred_at DESC)`  |
| `sos_events`           | `(user_id, status)`, `(status, created_at)` untuk monitoring |
| `audit_events`         | `(entity_type, entity_id)`, `(actor_user_id, created_at)` |

**Skema relasi utama:**
```
users ──< emergency_contacts
users ──1 partners ──< partner_destinations >── destinations
users ──< field_reports ──< report_media
users ──< sos_events ──< sos_notifications
destinations ──< weather_observations
destinations ──< destination_statuses
destinations ──< elevation_profiles
destinations ──< safety_recommendations
```

#### Object Storage
- Menyimpan `report_media` (foto/video laporan lapangan)
- Akses via signed URL, tidak pernah diekspos langsung ke publik
- Moderasi media terpisah sebelum URL diberikan ke client

#### Cache: Redis

| Key Pattern                              | TTL      | Isi                              |
|------------------------------------------|----------|----------------------------------|
| `dest:status:{destination_id}`           | 5 menit  | Status + level terkini           |
| `dest:weather:{destination_id}`          | 5 menit  | Prakiraan cuaca                  |
| `map:cells`                              | 5 menit  | Grid H3 status keseluruhan       |
| `partners:list:{filter_hash}`            | 10 menit | Hasil query direktori mitra      |
| `recs:{destination_id}:{date}`           | 30 menit | Rekomendasi keselamatan          |

---

## 3. Peta Fitur → Komponen

```
Fitur                     Client Page     Service              Tabel Utama
─────────────────────────────────────────────────────────────────────────────
Login / Daftar            auth/*          Auth Service         users
Beranda + cuaca           home.js         Destination Svc      weather_observations
Peta interaktif           map.js          Destination Svc      hyperlocal_cells
                                                               destination_statuses
Detail destinasi          map.js (modal)  Destination Svc      destinations
                                                               elevation_profiles
Direktori mitra           partners.js     Partner Svc          partners
                                                               partner_destinations
Laporan lapangan          partners.js     Partner Svc          field_reports
                                                               report_media
Form laporan (mitra)      partners.js     Partner Svc          field_reports
Rekomendasi keselamatan   reports.js      Destination Svc      safety_recommendations
Ulasan wisatawan          reports.js      Partner Svc          traveler_reviews
SOS darurat               sos.js          SOS Service          sos_events
                                                               sos_notifications
Kontak darurat            sos.js          SOS Service          emergency_contacts
```

---

## 4. Keamanan dan Privasi

### Autentikasi & Otorisasi

```
Peran            Hak Akses
──────────────────────────────────────────────────────────────────
guest            Baca destinasi publik, status, cuaca, rekomendasi terbit
user             + profil sendiri, kontak darurat, ulasan, SOS
partner          + buat laporan untuk destinasi cakupannya
moderator        + moderasi laporan, ulasan, media
admin            + verifikasi mitra, ubah status destinasi, audit log
```

### Perlindungan Data Sensitif
- Lokasi presisi SOS **hanya** disimpan di `sos_events` dan **tidak pernah** masuk feed publik
- Nomor penerima SOS disimpan ter-hash atau ter-enkripsi di `sos_notifications.recipient_ref`
- `report_media` diakses via signed URL dengan TTL pendek
- `audit_events` tidak menyimpan payload lengkap yang mengandung rahasia

### Consent
- Izin lokasi diminta eksplisit sebelum fitur peta hyperlocal dan SOS aktif
- `consent_records` mencatat: `user_id`, `consent_type`, `granted_at`, `revoked_at`, versi dokumen

---

## 5. Observabilitas

| Event                        | Tabel / Sistem          | Aktor        |
|------------------------------|-------------------------|--------------|
| Perubahan status destinasi   | `audit_events`          | admin/mitra  |
| Moderasi laporan             | `audit_events`          | moderator    |
| Verifikasi mitra             | `audit_events`          | admin        |
| Trigger & siklus SOS         | `sos_events` + `audit_events` | sistem + admin |
| Kegagalan pengiriman SOS     | `sos_notifications`     | sistem       |
| Ingestion cuaca OpenWeatherMap | Log service           | cron job     |

---

## 6. Integrasi Eksternal

| Sistem              | Protokol        | Arah          | Keterangan                                      |
|---------------------|-----------------|---------------|-------------------------------------------------|
| OpenWeatherMap API  | REST/HTTP pull  | Inbound       | Data cuaca dan prakiraan; polling terjadwal      |
| Google OAuth 2.0    | OAuth 2.0       | Outbound      | SSO opsional                                    |
| SMS Gateway         | REST API        | Outbound      | Notifikasi SOS fallback                         |
| SAR Webhook         | Webhook         | Outbound      | Notifikasi insiden kritis ke operator SAR       |
| Object Storage      | S3-compatible   | Bidirectional | Upload media laporan, signed URL download       |

---

## 7. Alur Data End-to-End Kritis

### Alur Status Destinasi
```
OpenWeatherMap API (setiap N menit)
  → Weather Ingestion Job
  → weather_observations (INSERT)
  → Aggregation Engine
      ├── Gabungkan data OpenWeatherMap + laporan mitra (weighted confidence)
      └── Tentukan level: aman / waspada / bahaya
  → destination_statuses (INSERT snapshot baru)
  → Invalidate Redis cache
  → Client polling / WebSocket push
```

### Alur Laporan Mitra
```
Mitra isi form → POST /reports
  → Validasi peran (partner terverifikasi)
  → field_reports (INSERT, moderation_status: pending)
  → Moderator mendapat notifikasi laporan kritis
  → Moderator approve → moderation_status: published
  → published_at di-set
  → Invalidate cache laporan terkait destinasi
  → Muncul di feed wisatawan
```

### Alur SOS
```
User tekan tombol SOS
  → Countdown 5 detik (dapat dibatalkan)
  → POST /sos → sos_events (status: queued)
  → Ambil GPS (izin sudah diberikan sebelumnya)
  → sos_events UPDATE (lat, lng, status: sending)
  → Kirim paralel:
      ├── Push: emergency_contacts
      ├── SMS: emergency_contacts
      └── Webhook: SAR operator
  → sos_notifications INSERT per penerima
  → sos_events status: sent
  → Client polling GET /sos/:id/status → tampilkan konfirmasi
  → Jika jaringan putus: antrean lokal, kirim ulang saat online
```

---

## 8. Keandalan dan Offline

| Skenario                       | Mitigasi                                                            |
|--------------------------------|---------------------------------------------------------------------|
| OpenWeatherMap API tidak tersedia | Tampilkan data cache + timestamp terakhir diperbarui               |
| Koneksi client terputus        | Service Worker cache halaman dan data statis terakhir              |
| SOS saat sinyal lemah          | Antrean lokal IndexedDB; kirim ulang otomatis saat online kembali  |
| Database down                  | Read replica + fallback ke cache Redis                             |
| Moderasi laporan terlambat     | Laporan kritis (severity: red) diprioritaskan antrian moderasi     |

---

## 9. Roadmap Teknis

### MVP (Prototipe Saat Ini)
- [x] Design system dan token CSS lengkap
- [x] Simulasi autentikasi (tanpa backend nyata)
- [x] Data destinasi statis (mock JSON)
- [x] Peta SVG + grid heksagonal visual
- [x] Direktori mitra contoh
- [x] Feed laporan contoh + form
- [x] Rekomendasi statis
- [x] SOS simulasi dengan countdown

### Tahap 1 — Backend Dasar
- [ ] Auth nyata: email/password atau username + password atau Google SSO
- [ ] Database PostgreSQL + PostGIS
- [ ] REST API destinasi, status, dan cuaca
- [ ] Integrasi OpenWeatherMap (ingestion job)
- [ ] Redis cache

### Tahap 2 — Fitur Lapangan
- [ ] Sistem mitra: pendaftaran, verifikasi, profil
- [ ] Laporan lapangan: submit, moderasi, publikasi
- [ ] Object storage untuk media laporan
- [ ] Ulasan wisatawan + moderasi

### Tahap 3 — SOS Produksi
- [ ] Izin lokasi eksplisit + enkripsi
- [ ] Dispatch SOS ke kontak darurat via SMS
- [ ] Webhook SAR operator
- [ ] Offline queue untuk SOS (IndexedDB + Service Worker)
- [ ] Audit trail penuh siklus SOS

### Tahap 4 — Rekomendasi & Skala
- [ ] Rule-based safety recommendation engine
- [ ] AI-assisted recommendation (dengan rationale JSON transparan)
- [ ] WebSocket push untuk update status real-time
- [ ] Native app (React Native / Flutter)
- [ ] Navigasi turn-by-turn offline (out of initial scope)
