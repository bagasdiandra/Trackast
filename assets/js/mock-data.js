/**
 * TRACKCAST — Mock Data & Shared State Management
 * Single source of truth for prototype frontend
 */

const TrackCastData = {
  // Current logged in user (simulated)
  currentUser: {
    id: "usr_001",
    name: "Arya Pratama",
    email: "arya.pratama@gmail.com",
    phone: "+62 812-3456-7890",
    role: "wisatawan",
    avatar: "AP",
    emergencyContacts: [
      { name: "Dewi Pratama (Ibu)", phone: "+62 811-9876-5432", relation: "Keluarga Inti" },
      { name: "Budi Santoso (Rekan)", phone: "+62 813-2233-4455", relation: "Rekan Perjalanan" }
    ]
  },

  // Hyperlocal Weather Data (BMKG Integration Simulation)
  currentWeather: {
    location: "Taman Nasional Gunung Rinjani",
    region: "Lombok Utara, NTB",
    temp: 18,
    condition: "Hujan Ringan",
    conditionCode: "rain-light",
    icon: "🌧️",
    high: 22,
    low: 14,
    humidity: 88,
    windSpeed: "28 km/j",
    windDirection: "Barat Daya",
    rainfallProbability: 75,
    uvIndex: 4,
    pressure: "1008 hPa",
    updatedAt: "Baru saja · BMKG Stasiun Klimatologi NTB",
    timestamp: "10:30 WITA",
    hourly: [
      { time: "11:00", temp: 19, icon: "🌧️", rain: "80%", condition: "Hujan Ringan" },
      { time: "12:00", temp: 20, icon: "🌦️", rain: "65%", condition: "Hujan Sedang" },
      { time: "13:00", temp: 21, icon: "🌧️", rain: "70%", condition: "Hujan Lebat" },
      { time: "14:00", temp: 20, icon: "⛈️", rain: "85%", condition: "Hujan Petir" },
      { time: "15:00", temp: 18, icon: "🌧️", rain: "60%", condition: "Hujan Ringan" },
      { time: "16:00", temp: 17, icon: "⛅", rain: "30%", condition: "Berawan Tebal" },
      { time: "17:00", temp: 16, icon: "⛅", rain: "20%", condition: "Berawan" },
      { time: "18:00", temp: 15, icon: "☁️", rain: "15%", condition: "Cerah Berawan" }
    ]
  },

  // Destinations with Hyperlocal Safety Status
  destinations: [
    {
      id: "rinjani",
      name: "Gunung Rinjani",
      category: "gunung",
      categoryLabel: "Gunung",
      region: "Lombok, NTB",
      island: "Nusa Tenggara",
      elevation: "3.726 mdpl",
      status: "waspada",
      statusLabel: "WASPADA",
      statusColor: "amber",
      weather: "Kabut Tebal",
      temp: 14,
      humidity: 82,
      windSpeed: "28 km/h",
      rainProb: 65,
      updatedAt: "10:15 WITA",
      source: "BMKG + Balai Taman Nasional GR",
      headline: "Kabut tebal dan suhu dingin 14°C di Plawangan Sembalun dan Danau Segara Anak.",
      operationalNote: "Jalur Sembalun dan Senaru diselimuti kabut tebal. Jarak pandang terbatas 30-50 meter. Dilarang camp di area bibir kawah.",
      coordinates: { lat: -8.4113, lng: 116.4573, mapX: 590, mapY: 346 },
      gridCell: "HEX-NTB-04",
      alertCount: 2,
      elevationProfile: [
        { point: "Basecamp Sembalun", alt: 1156, temp: 22, status: "safe" },
        { point: "Pos 1", alt: 1300, temp: 20, status: "safe" },
        { point: "Pos 2", alt: 1500, temp: 18, status: "safe" },
        { point: "Pos 3", alt: 1800, temp: 16, status: "warn" },
        { point: "Plawangan", alt: 2639, temp: 12, status: "warn" },
        { point: "Puncak Rinjani", alt: 3726, temp: 5, status: "danger" }
      ]
    },
    {
      id: "pantaipink",
      name: "Pantai Pink",
      category: "pantai",
      categoryLabel: "Pantai",
      region: "Lombok Timur, NTB",
      island: "Nusa Tenggara",
      elevation: "3 mdpl",
      status: "aman",
      statusLabel: "AMAN",
      statusColor: "emerald",
      weather: "Cerah Berawan",
      temp: 29,
      humidity: 71,
      windSpeed: "12 km/h",
      rainProb: 20,
      updatedAt: "10:30 WITA",
      source: "BMKG Maritim Lombok + Pokdarwis Tangsi",
      headline: "Perairan tenang dan rona merah muda pasir pantai tampak optimal saat surut.",
      operationalNote: "Aktivitas snorkeling, berenang, dan perahu wisata beroperasi aman dengan bendera hijau.",
      coordinates: { lat: -8.8524, lng: 116.5238, mapX: 602, mapY: 352 },
      gridCell: "HEX-NTB-02",
      alertCount: 0,
      elevationProfile: []
    },
    {
      id: "prambanan",
      name: "Candi Prambanan",
      category: "budaya",
      categoryLabel: "Budaya",
      region: "Sleman, DIY",
      island: "Jawa",
      elevation: "154 mdpl",
      status: "aman",
      statusLabel: "AMAN",
      statusColor: "emerald",
      weather: "Cerah",
      temp: 28,
      humidity: 68,
      windSpeed: "8 km/h",
      rainProb: 10,
      updatedAt: "10:45 WIB",
      source: "BMKG Yogyakarta + Balai Pelestarian Kebudayaan Wilayah X",
      headline: "Kondisi sangat cerah dan kondusif untuk kunjungan kompleks candi dan panggung terbuka.",
      operationalNote: "Seluruh zona candi dibuka normal. Disarankan mengenakan pelindung kepala dari sinar matahari langsung.",
      coordinates: { lat: -7.7520, lng: 110.4915, mapX: 422, mapY: 328 },
      gridCell: "HEX-DIY-01",
      alertCount: 0,
      elevationProfile: []
    },
    {
      id: "semeru",
      name: "Gunung Semeru",
      category: "gunung",
      categoryLabel: "Gunung",
      region: "Lumajang, Jatim",
      island: "Jawa",
      elevation: "3.676 mdpl",
      status: "bahaya",
      statusLabel: "DITUTUP",
      statusColor: "red",
      weather: "Badai Petir",
      temp: 9,
      humidity: 91,
      windSpeed: "45 km/h",
      rainProb: 95,
      updatedAt: "08:15 WIB",
      source: "PVMBG Pos Gunung Sawur + Balai Besar TNBTS",
      headline: "Peringatan Bahaya: Badai Petir & Level III Siaga di Mahameru.",
      operationalNote: "Seluruh jalur pendakian ditutup total demi keselamatan jiwa. Dilarang berada dalam radius 5 km dari kawah aktif Jonggring Saloko.",
      coordinates: { lat: -8.1077, lng: 112.9224, mapX: 466, mapY: 334 },
      gridCell: "HEX-JATIM-03",
      alertCount: 4,
      elevationProfile: [
        { point: "Ranupani", alt: 2100, temp: 15, status: "safe" },
        { point: "Ranu Kumbolo", alt: 2400, temp: 12, status: "warn" },
        { point: "Oro-oro Ombo", alt: 2460, temp: 11, status: "warn" },
        { point: "Kalimati", alt: 2700, temp: 9, status: "danger" },
        { point: "Puncak Mahameru", alt: 3676, temp: 2, status: "danger" }
      ]
    },
    {
      id: "madakaripura",
      name: "Air Terjun Madakaripura",
      category: "air_terjun",
      categoryLabel: "Air Terjun",
      region: "Probolinggo, Jatim",
      island: "Jawa",
      elevation: "620 mdpl",
      status: "waspada",
      statusLabel: "WASPADA",
      statusColor: "amber",
      weather: "Hujan Ringan",
      temp: 22,
      humidity: 88,
      windSpeed: "15 km/h",
      rainProb: 75,
      updatedAt: "09:30 WIB",
      source: "Perhutani KPH Probolinggo + BPBD Jatim",
      headline: "Curah hujan di hulu lereng Bromo meningkatkan debit air tebing dan risiko luncuran batu.",
      operationalNote: "Pengunjung wajib mengenakan helm keselamatan dan didampingi pemandu lokal. Dilarang berteduh langsung di bawah tebing tegak.",
      coordinates: { lat: -7.8542, lng: 113.0035, mapX: 476, mapY: 322 },
      gridCell: "HEX-JATIM-04",
      alertCount: 1,
      elevationProfile: []
    },
    {
      id: "komodo",
      name: "Taman Nasional Komodo",
      category: "taman_nasional",
      categoryLabel: "Taman Nasional",
      region: "Manggarai Barat, NTT",
      island: "Nusa Tenggara",
      elevation: "10 - 738 mdpl",
      status: "aman",
      statusLabel: "AMAN",
      statusColor: "emerald",
      weather: "Cerah",
      temp: 32,
      humidity: 60,
      windSpeed: "18 km/h",
      rainProb: 15,
      updatedAt: "09:45 WITA",
      source: "Balai TN Komodo + BMKG Maritim Labuan Bajo",
      headline: "Perairan Labuan Bajo dan rute pelayaran Pulau Padar-Komodo kondusif dan cerah.",
      operationalNote: "Seluruh pelayaran kapal wisata dan jalur trekking Pulau Komodo & Rinca dibuka normal dengan pendampingan ranger resmi.",
      coordinates: { lat: -8.5441, lng: 119.4939, mapX: 710, mapY: 345 },
      gridCell: "HEX-NTT-01",
      alertCount: 0,
      elevationProfile: []
    },
    {
      id: "bromo",
      name: "Gunung Bromo",
      category: "gunung",
      categoryLabel: "Gunung",
      region: "Probolinggo, Jatim",
      island: "Jawa",
      elevation: "2.329 mdpl",
      status: "waspada",
      statusLabel: "WASPADA",
      statusColor: "amber",
      weather: "Berkabut",
      temp: 11,
      humidity: 85,
      windSpeed: "22 km/h",
      rainProb: 35,
      updatedAt: "09:45 WIB",
      source: "BMKG Karangploso + PVMBG",
      headline: "Kabut tebal dan suhu dingin menyelimuti kaldera lautan pasir dan Penanjakan.",
      operationalNote: "Jarak pandang terbatas < 50 meter. Kendaraan jeep disarankan menyalakan lampu kabut dan wisatawan mengenakan pakaian hangat berlapis.",
      coordinates: { lat: -7.9425, lng: 112.9530, mapX: 470, mapY: 325 },
      gridCell: "HEX-JATIM-02",
      alertCount: 1,
      elevationProfile: [
        { point: "Cemoro Lawang", alt: 2200, temp: 13, status: "safe" },
        { point: "Lautan Pasir", alt: 2100, temp: 11, status: "warn" },
        { point: "Kawah Bromo", alt: 2329, temp: 9, status: "warn" }
      ]
    },
    {
      id: "nusadua",
      name: "Pantai Nusa Dua",
      category: "pantai",
      categoryLabel: "Pantai",
      region: "Badung, Bali",
      island: "Bali",
      elevation: "3 mdpl",
      status: "aman",
      statusLabel: "AMAN",
      statusColor: "emerald",
      weather: "Cerah Berawan",
      temp: 30,
      humidity: 72,
      windSpeed: "10 km/h",
      rainProb: 15,
      updatedAt: "10:15 WITA",
      source: "BMKG Wilayah III Denpasar + Balawista Badung",
      headline: "Gelombang laut tenang 0.8 - 1.2 meter, perairan sangat ideal untuk berenang dan watersport.",
      operationalNote: "Kawasan pantai ITDC aman dan bersih. Wisatawan dapat menikmati aktivitas tepi pantai, kano, dan jogging track.",
      coordinates: { lat: -8.8005, lng: 115.2325, mapX: 546, mapY: 351 },
      gridCell: "HEX-BALI-02",
      alertCount: 0,
      elevationProfile: []
    },
    {
      id: "tumpaksewu",
      name: "Air Terjun Tumpak Sewu",
      category: "air_terjun",
      categoryLabel: "Air Terjun",
      region: "Lumajang, Jawa Timur",
      island: "Jawa",
      elevation: "500 mdpl",
      status: "bahaya",
      statusLabel: "DITUTUP",
      statusColor: "red",
      weather: "Hujan Sangat Lebat & Arus Deras",
      temp: 22,
      humidity: 95,
      windSpeed: "22 km/j",
      rainProb: 95,
      updatedAt: "08:30 WIB",
      source: "BPBD Lumajang + Relawan Sungai",
      headline: "Peringatan Banjir Lahar Dingin Semeru & Arus Bahaya Dasar Tebing.",
      operationalNote: "Akses turun ke dasar lembah ditutup total mulai pukul 07:00 WIB sampai evaluasi ulang besok pagi. Pengunjung hanya diizinkan di spot panorama atas.",
      coordinates: { lat: -8.2312, lng: 112.9174, mapX: 460, mapY: 340 },
      gridCell: "HEX-JATIM-05",
      alertCount: 2,
      elevationProfile: [
        { point: "Pos Masuk Panorama", alt: 520, temp: 23, status: "safe" },
        { point: "Tangga Bambu", alt: 420, temp: 22, status: "danger" },
        { point: "Dasar Air Terjun", alt: 320, temp: 21, status: "danger" }
      ]
    },
    {
      id: "kuta",
      name: "Pantai Kuta & Canggu",
      category: "pantai",
      categoryLabel: "Pantai",
      region: "Badung, Bali",
      island: "Bali",
      elevation: "2 mdpl",
      status: "aman",
      statusLabel: "AMAN",
      statusColor: "emerald",
      weather: "Cerah Berawan",
      temp: 29,
      humidity: 72,
      windSpeed: "15 km/j",
      rainProb: 20,
      updatedAt: "10:00 WITA",
      source: "BMKG Wilayah III Denpasar + Balawista",
      headline: "Gelombang laut 1.25 - 1.8 meter, bendera hijau berkibar di pos pantau.",
      operationalNote: "Aktivitas selancar dan mandi laut aman pada zona rambu bendera hijau. Waspadai arus pasang pada pukul 16:30 WITA.",
      coordinates: { lat: -8.7185, lng: 115.1686, mapX: 538, mapY: 346 },
      gridCell: "HEX-BALI-01",
      alertCount: 0,
      elevationProfile: []
    },
    {
      id: "borobudur",
      name: "Candi Borobudur",
      category: "budaya",
      categoryLabel: "Budaya",
      region: "Magelang, Jawa Tengah",
      island: "Jawa",
      elevation: "265 mdpl",
      status: "aman",
      statusLabel: "AMAN",
      statusColor: "emerald",
      weather: "Berawan Sejuk",
      temp: 27,
      humidity: 70,
      windSpeed: "8 km/j",
      rainProb: 25,
      updatedAt: "10:30 WIB",
      source: "BMKG Sleman + Balai Konservasi Borobudur",
      headline: "Kondisi sangat kondusif untuk kunjungan stupa dan pelataran.",
      operationalNote: "Kunjungan struktur candi menggunakan sandal upanat wajib. Kuota naik monumen beroperasi normal.",
      coordinates: { lat: -7.6079, lng: 110.2038, mapX: 410, mapY: 320 },
      gridCell: "HEX-JATENG-03",
      alertCount: 0,
      elevationProfile: []
    },
    {
      id: "tobalake",
      name: "Danau Toba & Samosir",
      category: "danau",
      categoryLabel: "Danau & Budaya",
      region: "Sumatera Utara",
      island: "Sumatera",
      elevation: "905 mdpl",
      status: "aman",
      statusLabel: "AMAN",
      statusColor: "emerald",
      weather: "Cerah Ringan",
      temp: 24,
      humidity: 74,
      windSpeed: "10 km/j",
      rainProb: 30,
      updatedAt: "09:00 WIB",
      source: "BMKG Silangit + Dishub Samosir",
      headline: "Penyeberangan feri Ajibata - Tomok lancar tanpa kendala kabut.",
      operationalNote: "Semua dermaga beroperasi normal. Angin permukaan danau tenang hingga sore.",
      coordinates: { lat: 2.6845, lng: 98.8756, mapX: 180, mapY: 170 },
      gridCell: "HEX-SUMUT-01",
      alertCount: 0,
      elevationProfile: []
    },
    {
      id: "rajaampat",
      name: "Kepulauan Raja Ampat",
      category: "taman_nasional",
      categoryLabel: "Bahari & Alam",
      region: "Papua Barat Daya",
      island: "Papua",
      elevation: "0 - 300 mdpl",
      status: "aman",
      statusLabel: "AMAN",
      statusColor: "emerald",
      weather: "Cerah Tropis",
      temp: 30,
      humidity: 78,
      windSpeed: "11 km/j",
      rainProb: 15,
      updatedAt: "11:00 WIT",
      source: "BMKG Sorong + BLUD UPTD Raja Ampat",
      headline: "Visibilitas bawah laut 25m+, kondisi diving Pianemo & Wayag prima.",
      operationalNote: "Semua pos konservasi bahari dibuka. Wajib membawa kartu tanda masuk kawasan konservasi (PIN).",
      coordinates: { lat: -0.5284, lng: 130.5512, mapX: 860, mapY: 200 },
      gridCell: "HEX-PAPUA-01",
      alertCount: 0,
      elevationProfile: []
    }
  ],

  // Directory of Local Guides & Porters
  partners: [
    {
      id: "ptn_01",
      type: "guide",
      typeLabel: "Pemandu Berlisensi",
      name: "Hasan Basri",
      badge: "Terverifikasi APGI",
      verified: true,
      rating: 4.9,
      reviewCount: 148,
      experience: "9 Tahun",
      location: "Sembalun & Senaru, NTB",
      destinationId: "rinjani",
      destinationName: "Gunung Rinjani",
      languages: ["Indonesia", "English", "Sasak"],
      certifications: ["APGI Utama No. 892/2023", "First Aid SAR Kemensos"],
      rate: "Rp 450.000 / hari",
      available: true,
      phone: "+62 819-0711-2233",
      avatarBg: "#00C2CC",
      bio: "Pemandu spesialis jalur Sembalun & Torean. Memahami mitigasi cuaca buruk dan jalur evakuasi darurat Rinjani."
    },
    {
      id: "ptn_02",
      type: "porter",
      typeLabel: "Porter Senior Basecamp",
      name: "Amaq Suparman",
      badge: "Koperasi Porter Rinjani",
      verified: true,
      rating: 5.0,
      reviewCount: 94,
      experience: "12 Tahun",
      location: "Sembalun, Lombok",
      destinationId: "rinjani",
      destinationName: "Gunung Rinjani",
      languages: ["Indonesia", "Sasak"],
      certifications: ["Sertifikasi Standar Beban Balai TNGR"],
      rate: "Rp 300.000 / hari (Maks 20 kg)",
      available: true,
      phone: "+62 878-6543-2109",
      avatarBg: "#34D399",
      bio: "Bertanggung jawab membawa logistik, memasak makanan bergizi hangat di camp, dan berpengalaman navigasi kabut tebal."
    },
    {
      id: "ptn_03",
      type: "guide",
      typeLabel: "Pemandu Vulkanologi",
      name: "Agus Triyono",
      badge: "HPI Jawa Timur",
      verified: true,
      rating: 4.8,
      reviewCount: 112,
      experience: "7 Tahun",
      location: "Bromo & Semeru",
      destinationId: "bromo",
      destinationName: "Gunung Bromo",
      languages: ["Indonesia", "English"],
      certifications: ["HPI Pramuwisata Madya", "Mitigasi Bencana Geologi"],
      rate: "Rp 350.000 / hari",
      available: true,
      phone: "+62 813-3344-5566",
      avatarBg: "#FBBF24",
      bio: "Spesialis sunrise hunting rute alternatif Penanjakan bebas kerumunan, menguasai sejarah geologi tengger."
    },
    {
      id: "ptn_04",
      type: "porter",
      typeLabel: "Porter & Ranger Lokal",
      name: "Wayan Sudarma",
      badge: "Komunitas Jalur Alam Bali",
      verified: true,
      rating: 4.9,
      reviewCount: 76,
      experience: "6 Tahun",
      location: "Gunung Agung & Batur",
      destinationId: "kuta",
      destinationName: "Bali Adventure",
      languages: ["Indonesia", "English", "Bali"],
      certifications: ["P3K Alam Bebas Balawista"],
      rate: "Rp 275.000 / hari",
      available: false,
      phone: "+62 852-7788-9900",
      avatarBg: "#A78BFA",
      bio: "Saat ini sedang melayani rombongan pendakian Batur. Tersedia kembali tanggal 30 September."
    }
  ],

  // Real-time Field Reports Feed
  fieldReports: [
    {
      id: "rep_01",
      destinationId: "rinjani",
      destinationName: "Gunung Rinjani",
      urgency: "warn",
      urgencyLabel: "PERHATIAN JALUR",
      authorName: "Hasan Basri (Pemandu APGI)",
      authorRole: "Mitra Terverifikasi",
      time: "20 menit yang lalu · 10:10 WITA",
      title: "Jalur Antara Pos 3 Menuju Plawangan Sembalun Licin Parah",
      content: "Hujan turun deras sejak jam 08:00. Tanah liat Bukit Penyesalan sangat licin. Wajib gunakan trekking pole dan sepatu bergerigi tajam. Jangan paksakan jalan jika angin makin kencang.",
      hasImage: true,
      imagePlaceholder: "🌧️ Jalur Berlumpur Km 7.2",
      likes: 24,
      verifiedReport: true
    },
    {
      id: "rep_02",
      destinationId: "tumpaksewu",
      destinationName: "Air Terjun Tumpak Sewu",
      urgency: "danger",
      urgencyLabel: "DITUTUP SEMENTARA",
      authorName: "Ranger Pos Wisata Lumajang",
      authorRole: "Pengelola Resmi",
      time: "1 jam yang lalu · 08:30 WIB",
      title: "Aliran Air Meluap Coklat Keruh dari Lereng Semeru",
      content: "Debit air meningkat 300% akibat hujan lebat di hulu. Demi keselamatan jiwa, palang pintu tangga bawah dikunci gembok. Mohon wisatawan tidak menerobos garis pengaman.",
      hasImage: true,
      imagePlaceholder: "⚠️ Arus Banjir Lahar Dingin",
      likes: 56,
      verifiedReport: true
    },
    {
      id: "rep_03",
      destinationId: "bromo",
      destinationName: "Gunung Bromo",
      urgency: "safe",
      urgencyLabel: "KONDISI JALAN AMAN",
      authorName: "Dimas Nugroho (Wisatawan)",
      authorRole: "Laporan Wisatawan",
      time: "2 jam yang lalu · 07:45 WIB",
      title: "Sunrise Kingkong Hill Cerah Sempurna",
      content: "Lautan pasir kering, jeep beroperasi normal. Kabut tipis di kaldera menciptakan lautan awan yang sangat indah. Suhu saat subuh tercatat 10°C.",
      hasImage: true,
      imagePlaceholder: "🌄 Sunrise Bromo Cerah",
      likes: 41,
      verifiedReport: false
    }
  ],

  // AI-Powered Safety Recommendations
  safetyRecommendations: {
    rinjani: {
      status: "waspada",
      score: 62,
      recommendationSummary: "Pendakian Memerlukan Kewaspadaan Tinggi Terhadap Kabut Tebal & Suhu Dingin",
      primaryRisk: "Kabut Tebal, Jarak Pandang Terbatas & Hipotermia",
      aiRationale: "Kelembapan udara 82%, suhu puncak mencapai 5°C, dan kabut tebal menyelimuti punggungan Sembalun-Plawangan.",
      mustHaves: [
        "Jas hujan ponco ganda atau rain jacket Gore-Tex",
        "Sepatu gunung bersol Vibram / traksi agresif + gaiters",
        "Trekking pole sepasang untuk stabilitas di tanjakan",
        "Dry bag cadangan untuk pakaian ganti & sleeping bag"
      ],
      actionPlan: [
        "Mulai trekking lebih pagi (maksimal pukul 06:30) untuk menghindari kabut pekat siang hari.",
        "Pasang tenda sebelum pukul 15:00 di lokasi terlindung angin (hindari tepi punggungan).",
        "Pastikan registrasi porter lokal yang mengenal rute darurat."
      ]
    },
    semeru: {
      status: "bahaya",
      score: 10,
      recommendationSummary: "Peringatan Siaga & Bahaya Cuaca Ekstrem — Seluruh Jalur Ditutup Total",
      primaryRisk: "Badai Petir Ekstrem, Angin 45 km/h & Luncuran Material Vulkanik",
      aiRationale: "Status Siaga Level III PVMBG dipadukan dengan badai petir lokal 45 km/h dan kelembapan 91%.",
      mustHaves: [
        "Tetap berada di luar radius 5 km dari kawah aktif",
        "Patuhi instruksi petugas pos pantau Sawur & BPBD",
        "Gunakan masker pelindung debu jika terjadi hembusan abu"
      ],
      actionPlan: [
        "Batalkan semua aktivitas pendakian hingga izin resmi dikeluarkan TNBTS.",
        "Pantau pembaruan status seismik dan cuaca berkala di aplikasi TrackCast."
      ]
    },
    bromo: {
      status: "waspada",
      score: 65,
      recommendationSummary: "Kunjungan Kaldera Terbuka, Waspadai Kabut Tebal & Suhu Dingin 11°C",
      primaryRisk: "Visibilitas Rendah (< 50m) & Hipotermia Ringan",
      aiRationale: "Suhu 11°C, kelembapan 85%, dan kabut tebal mengurangi jarak pandang di lautan pasir.",
      mustHaves: [
        "Jaket windproof tebal dan sarung tangan polar",
        "Masker pelindung debu pasir dan gas belerang",
        "Senter atau headlamp untuk aktivitas sebelum fajar"
      ],
      actionPlan: [
        "Gunakan armada jeep dengan driver berpengalaman medan berkabut.",
        "Patuhi batas aman 1 km dari bibir kawah aktif Bromo."
      ]
    },
    madakaripura: {
      status: "waspada",
      score: 58,
      recommendationSummary: "Kunjungan Diperbolehkan dengan Kewaspadaan Debit Air Tebing Curam",
      primaryRisk: "Hujan Ringan & Licinnya Ceruk Air Terjun Sempit",
      aiRationale: "Hujan lokal di lereng Bromo berpotensi menambah debit ceruk sempit Madakaripura secara mendadak.",
      mustHaves: [
        "Helm pelindung kepala (wajib dari pengelola)",
        "Jas hujan atau poncho waterproof",
        "Sandal gunung atau sepatu antislip berbahan karet"
      ],
      actionPlan: [
        "Gunakan pemandu lokal berlisensi saat memasuki ceruk tebing utama.",
        "Segera keluar bila debit air berubah warna keruh atau terdengar sirine darurat."
      ]
    },
    pantaipink: {
      status: "aman",
      score: 92,
      recommendationSummary: "Kondisi Perairan Tenang & Sangat Kondusif untuk Wisata Bahari",
      primaryRisk: "Paparan Terik Matahari Siang Hari",
      aiRationale: "Cuaca cerah berawan, kecepatan angin 12 km/h, dan ombak tenang di bawah 1 meter.",
      mustHaves: [
        "Sunscreen SPF 50+ ramah terumbu karang",
        "Kacamata hitam anti-UV & topi pantai",
        "Perlengkapan snorkeling pribadi"
      ],
      actionPlan: [
        "Waktu terbaik menikmati kilau warna pasir pink adalah pukul 08:00 - 11:00 WITA saat surut.",
        "Dukung konservasi laut dengan tidak menginjak terumbu karang."
      ]
    },
    prambanan: {
      status: "aman",
      score: 94,
      recommendationSummary: "Kondisi Sangat Nyaman untuk Kunjungan Candi & Pagelaran Seni",
      primaryRisk: "Suhu Udara Hangat di Pelataran Terbuka",
      aiRationale: "Cuaca cerah benderang 28°C dengan angin sepoi-sepoi 8 km/h.",
      mustHaves: [
        "Payung atau topi pelindung matahari",
        "Air mineral botol untuk hidrasi",
        "Sepatu jalan yang nyaman untuk kompleks candi yang luas"
      ],
      actionPlan: [
        "Eksplorasi candi utama Brahma, Siwa, dan Wisnu di pagi hari.",
        "Saksikan pertunjukan Ramayana Ballet di panggung terbuka malam hari."
      ]
    },
    nusadua: {
      status: "aman",
      score: 96,
      recommendationSummary: "Kondisi Perairan & Pantai Ideal untuk Berenang dan Watersport",
      primaryRisk: "Paparan Sinar UV & Hidrasi",
      aiRationale: "Angin laut tenang 10 km/h, cerah berawan 30°C, tidak ada ancaman gelombang pasang.",
      mustHaves: [
        "Pakaian renang standar",
        "Tabir surya ramah terumbu karang",
        "Handuk & baju ganti kering"
      ],
      actionPlan: [
        "Berenang aman di zona bertanda bendera hijau pos Balawista.",
        "Kunjungi atraksi Water Blow saat pasang laut sore."
      ]
    },
    komodo: {
      status: "aman",
      score: 90,
      recommendationSummary: "Perairan Tenang & Cuaca Cerah untuk Ekspedisi Pulau",
      primaryRisk: "Suhu Panas Terik 32°C saat Trekking Savana",
      aiRationale: "Kondisi laut Selat Lintah stabil, angin 18 km/h aman untuk kapal phinisi dan speed boat.",
      mustHaves: [
        "Air minum minimal 2 liter per orang",
        "Topi rimba & kacamata polaroid",
        "Sepatu trekking bertapak kokoh"
      ],
      actionPlan: [
        "Selalu berjalan didampingi ranger resmi saat trekking Komodo.",
        "Gunakan sunscreen saat snorkeling di Pink Beach / Manta Point."
      ]
    },
    tumpaksewu: {
      status: "bahaya",
      score: 15,
      recommendationSummary: "Tunda Kunjungan ke Dasar Air Terjun — Bahaya Banjir Bandang",
      primaryRisk: "Banjir Lahar & Longsor Tebing Sungai",
      aiRationale: "Peringatan dini BPBD Semeru dan foto laporan debit air keruh ekstrem dari pos pantau Lumajang.",
      mustHaves: [
        "Tetap berada di gardu pandang atas",
        "Patuhi instruksi petugas ranger lapangan"
      ],
      actionPlan: [
        "Nikmati panorama dari spot atas tanpa menuruni tangga.",
        "Pantau pembaruan status TrackCast sebelum memutuskan turun esok hari."
      ]
    }
  },

  // Emergency SOS Contacts
  emergencyHotlines: [
    { name: "BASARNAS (Pencarian & Pertolongan)", number: "115", desc: "Bebas Pulsa 24 Jam Nasional", icon: "🚁" },
    { name: "Panggilan Darurat Umum", number: "112", desc: "Polisi, Damkar, Medis Terpadu", icon: "🚨" },
    { name: "Posko SAR TN Gunung Rinjani", number: "+62 370-660-8874", desc: "Basecamp Sembalun & Senaru", icon: "🏔️" },
    { name: "BPBD Jawa Timur (Semeru & Bromo)", number: "+62 31-855-0101", desc: "Pusdalops Bencana Daerah", icon: "🌋" },
    { name: "Balawista Pantai Bali (Life Guard)", number: "+62 361-755-666", desc: "Penyelamatan Pantai & Laut", icon: "🌊" }
  ]
};

// Storage Helpers
const TrackCastStorage = {
  get(key, fallback = null) {
    try {
      const item = localStorage.getItem(`trackcast_${key}`);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(`trackcast_${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn("Storage write failed", e);
    }
  },
  isLoggedIn() {
    return this.get("is_authenticated", false);
  },
  setLoggedIn(bool, user = null) {
    this.set("is_authenticated", bool);
    if (user) this.set("user_data", user);
  }
};

// Expose globally
window.TrackCastData = TrackCastData;
window.TrackCastStorage = TrackCastStorage;
