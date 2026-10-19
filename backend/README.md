# TrackCast Backend Service

Backend microservice resmi untuk **TrackCast** yang difokuskan pada:
1. **Auth Service**: Registrasi, Login (Email/Username), Manajemen Profil (`/me`), Logout.
2. **JWT Authentication**: Enkripsi password menggunakan `bcrypt`, token berbasis `HS256` (Access Token & Refresh Token) dengan bearer middleware.
3. **Weather Map API**: Integrasi live ke **OpenWeatherMap API**, endpoint data destinasi wisata, koordinat peta interaktif, dan evaluasi otomatis status keselamatan (*Aman*, *Waspada*, *Bahaya*).

---

## 🚀 Panduan Instalasi & Menjalankan Backend

### 1. Instalasi Python 3.12 (Pilih salah satu)

#### Cara A: Melalui PowerShell (Winget)
Buka terminal PowerShell lalu jalankan:
```powershell
winget install Python.Python.3.12 --accept-package-agreements --accept-source-agreements
```
> *Catatan: Setelah instalasi selesai, tutup dan buka kembali terminal Anda agar perintah `python` terdeteksi.*

#### Cara B: Unduh Langsung Installer Resmi
Unduh dari: [python.org/downloads](https://www.python.org/downloads/)  
*(Centang opsi **"Add python.exe to PATH"** saat instalasi).*

---

### 2. Siapkan Database PostgreSQL (Pilih salah satu)

#### Opsi 1: Menggunakan Docker (Paling Praktis)
Jika Anda memiliki Docker Desktop, cukup jalankan perintah berikut di folder `backend`:
```powershell
docker compose up -d
```
Database PostgreSQL akan otomatis aktif di `localhost:5432` dengan user/password `postgres:postgres` dan database `trackcast_db`.

#### Opsi 2: Instal PostgreSQL Langsung di Windows
```powershell
winget install PostgreSQL.PostgreSQL.16 --accept-package-agreements --accept-source-agreements
```
Setelah terinstal, buat database bernama `trackcast_db` melalui pgAdmin atau SQL Shell (`psql`):
```sql
CREATE DATABASE trackcast_db;
```

---

### 3. Setup Virtual Environment & Install Dependensi

Masuk ke folder `backend`:
```powershell
cd d:\Trackast\backend
```

Buat dan aktifkan Virtual Environment:
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```
*(Jika muncul error Execution Policy di PowerShell, jalankan sekali: `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`)*

Install dependensi:
```powershell
pip install -r requirements.txt
```

---

### 4. Konfigurasi File `.env`

Buka file `.env` di folder `backend/`, lalu masukkan **OpenWeatherMap API Key** Anda:
```ini
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/trackcast_db
JWT_SECRET_KEY=trackcast_super_secret_jwt_key_change_in_production_123456789
OPENWEATHER_API_KEY=MASUKKAN_API_KEY_OPENWEATHERMAP_ANDA
```

---

### 5. Jalankan Backend Server

Pastikan virtual environment aktif dan PostgreSQL berjalan, lalu ketik:
```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Ketika server pertama kali berjalan, sistem akan:
- Otomatis membuat tabel-tabel PostgreSQL (`users`, `destinations`, `weather_observations`).
- Otomatis mengisi data awal 8 destinasi utama (Rinjani, Bromo, Semeru, Komodo, Prambanan, dll) beserta koordinat peta.
- Otomatis membuat demo user (`arya.pratama@gmail.com` / `password123`).

---

## 📖 Dokumentasi & Testing API Interaktif

Buka browser ke alamat:
- **Swagger UI (Dokumentasi Lengkap & Uji Coba Langsung)**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 📌 Ringkasan Endpoint API

### 1. Auth & JWT Service (`/api/auth`)

| Metode | Endpoint | Keterangan | Autentikasi |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Daftar user baru (nama, email/username, password, peran) | Publik |
| `POST` | `/api/auth/login` | Login menggunakan email atau username + password | Publik |
| `GET` | `/api/auth/me` | Mengambil profil user yang sedang login | **Bearer JWT** |
| `POST` | `/api/auth/refresh` | Refresh access token baru menggunakan refresh token | Publik |
| `POST` | `/api/auth/logout` | Logout user | **Bearer JWT** |

### 2. Weather & Map API (`/api`)

| Metode | Endpoint | Keterangan | Autentikasi |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/destinations` | Daftar destinasi (filter status, kategori, search) | Publik |
| `GET` | `/api/destinations/{slug}` | Detail informasi destinasi | Publik |
| `GET` | `/api/destinations/{slug}/weather` | Cuaca live OpenWeatherMap + prakiraan 24 jam + auto status keselamatan | Publik |
| `GET` | `/api/weather/current?lat=..&lon=..` | Cuaca live untuk koordinat GPS mana saja | Publik |
| `GET` | `/api/map/cells` | Data sel grid heksagonal untuk visualisasi peta TrackCast | Publik |
