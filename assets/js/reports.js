/**
 * REPORTS.JS — TrackCast AI Safety Recommendations & Public Field Reports
 * Pixel-accurate implementation matching modern design system
 */

document.addEventListener("DOMContentLoaded", () => {
  const data = window.TrackCastData;
  if (!data) return;

  const destSelect = document.getElementById("recom-dest-select");
  let activeDestId = "rinjani";

  // Destination items matching the design mockup order & styling
  const destinationList = [
    { id: "rinjani", name: "Gunung Rinjani", region: "Lombok, NTB", icon: "🏔️", status: "waspada", statusLabel: "Waspada" },
    { id: "pantaipink", name: "Pantai Pink", region: "Lombok Timur, NTB", icon: "🏖️", status: "aman", statusLabel: "Aman" },
    { id: "prambanan", name: "Candi Prambanan", region: "Sleman, DIY", icon: "🏛️", status: "aman", statusLabel: "Aman" },
    { id: "semeru", name: "Gunung Semeru", region: "Lumajang, Jatim", icon: "🏔️", status: "bahaya", statusLabel: "Bahaya" },
    { id: "madakaripura", name: "Air Terjun Madakaripura", region: "Probolinggo, Jatim", icon: "💧", status: "waspada", statusLabel: "Waspada" },
    { id: "bromo", name: "Gunung Bromo", region: "Probolinggo, Jatim", icon: "🌋", status: "waspada", statusLabel: "Waspada" },
    { id: "tumpaksewu", name: "Air Terjun Tumpak Sewu", region: "Lumajang, Jatim", icon: "🌊", status: "bahaya", statusLabel: "Bahaya" },
    { id: "kuta", name: "Pantai Kuta", region: "Badung, Bali", icon: "🏖️", status: "aman", statusLabel: "Aman" },
    { id: "nusadua", name: "Pantai Nusa Dua", region: "Badung, Bali", icon: "🏖️", status: "aman", statusLabel: "Aman" },
    { id: "komodo", name: "Taman Nasional Komodo", region: "Manggarai Barat, NTT", icon: "🦎", status: "aman", statusLabel: "Aman" },
    { id: "borobudur", name: "Candi Borobudur", region: "Magelang, Jateng", icon: "🏛️", status: "aman", statusLabel: "Aman" },
    { id: "tobalake", name: "Danau Toba", region: "Sumatera Utara", icon: "🏞️", status: "aman", statusLabel: "Aman" },
    { id: "rajaampat", name: "Kepulauan Raja Ampat", region: "Papua Barat Daya", icon: "🏝️", status: "aman", statusLabel: "Aman" }
  ];

  // Check URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const destParam = urlParams.get("dest");
  if (destParam && destinationList.some(d => d.id === destParam)) {
    activeDestId = destParam;
    if (destSelect) destSelect.value = destParam;
  }

  // Pre-configured rich safety insights for destinations
  const destinationInsights = {
    rinjani: {
      icon: "🏔️",
      displayName: "Gunung Rinjani",
      region: "Lombok, NTB",
      status: "waspada",
      statusLabel: "Waspada",
      temp: "14°C",
      humidity: "82%",
      wind: "28 km/h",
      updated: "09:00 WITA",
      warningTitle: "Peringatan: Kabut Tebal Diprediksi Berlanjut",
      warningDesc: "Pantau kondisi cuaca secara berkala sebelum dan selama perjalanan.",
      tipTitle: "Saran: Persiapkan Perlengkapan Ekstra",
      tipDesc: "Bawa jas hujan, senter cadangan, dan perlengkapan pertolongan pertama.",
      elevationPoints: [
        { name: "Basecamp", temp: 22 },
        { name: "Pos 1", temp: 18 },
        { name: "Pos 2", temp: 14 },
        { name: "Pos 3", temp: 10 },
        { name: "Puncak", temp: 8 }
      ],
      equipment: [
        "Jas hujan ponco ganda atau jaket waterproof Gore-Tex",
        "Sepatu gunung bersol traksi kuat (Vibram) & gaiters",
        "Trekking pole sepasang untuk stabilitas tanjakan",
        "Headlamp dengan baterai cadangan",
        "Dry bag untuk perlengkapan pakaian & sleeping bag"
      ],
      budget: [
        { item: "Tiket Masuk TN Rinjani (SIMAKSI)", cost: "Rp 50.000 / hari (Domestik)" },
        { item: "Jasa Porter Lokal (Beban maks 20kg)", cost: "Rp 250.000 - 300.000 / hari" },
        { item: "Pemandu Bersertifikat APGI", cost: "Rp 350.000 / hari per grup" },
        { item: "Sewa Tenda Dome 4P & Matras", cost: "Rp 80.000 / malam" }
      ],
      route: "Jalur Sembalun lebih disarankan untuk pendakian naik karena kontur savana landai, sedangkan jalur Senaru disarankan untuk turun dengan naungan hutan tropis.",
      bestTime: "Mulai pendakian pagi pukul 06:30 WITA untuk menghindari terik matahari di Bukit Penyesalan dan kabut tebal setelah jam 13:00."
    },
    bromo: {
      icon: "🌋",
      displayName: "Gunung Bromo",
      region: "Probolinggo, Jatim",
      status: "waspada",
      statusLabel: "Waspada",
      temp: "11°C",
      humidity: "85%",
      wind: "22 km/h",
      updated: "09:45 WIB",
      warningTitle: "Peringatan: Suhu Dingin Ekstrem & Pasir Berangin",
      warningDesc: "Suhu dini hari mencapai 7°C di Penanjakan dan debu kaldera beterbangan.",
      tipTitle: "Saran: Gunakan Masker & Pakaian Berlapis",
      tipDesc: "Siapkan jaket windproof tebal, syal, dan kacamata pelindung debu.",
      elevationPoints: [
        { name: "Sukapura", temp: 20 },
        { name: "Cemoro Lawang", temp: 14 },
        { name: "Lautan Pasir", temp: 11 },
        { name: "Kawah Bromo", temp: 9 },
        { name: "Penanjakan", temp: 7 }
      ],
      equipment: [
        "Jaket windproof & fleece hangat",
        "Masker kain / KN95 pelindung debu vulkanik",
        "Kacamata outdoor / sunglasses",
        "Sarung tangan & kupluk polar"
      ],
      budget: [
        { item: "Tiket Masuk TNBTS", cost: "Rp 29.000 (Hari Kerja) / Rp 34.000 (Libur)" },
        { item: "Sewa Hardtop Jeep 4x4", cost: "Rp 650.000 - 850.000 / unit (6 org)" },
        { item: "Sewa Kuda Lautan Pasir", cost: "Rp 150.000 - 200.000 PP" },
        { item: "Ojek Motor Subuh", cost: "Rp 50.000 - 100.000" }
      ],
      route: "Gunakan jeep resmi dari pos Cemoro Lawang atau Tosari untuk melintasi kaldera berpasir.",
      bestTime: "Spot Kingkong Hill pukul 04:30 WIB untuk pemandangan sunrise terbaik bebas kabut tebal."
    },
    tumpaksewu: {
      icon: "🌊",
      displayName: "Air Terjun Tumpak Sewu",
      region: "Lumajang, Jatim",
      status: "bahaya",
      statusLabel: "Bahaya",
      temp: "22°C",
      humidity: "95%",
      wind: "20 km/h",
      updated: "08:30 WIB",
      warningTitle: "Peringatan: Akses Dasar Tebing Ditutup Sementara",
      warningDesc: "Debit air meluap dari hulu lereng Semeru berpotensi banjir lahar dingin.",
      tipTitle: "Saran: Nikmati dari Gardu Pandang Panorama",
      tipDesc: "Patuhi garis pengaman dan jangan memaksa menuruni tangga bambu curam.",
      elevationPoints: [
        { name: "Parkiran", temp: 24 },
        { name: "Gardu Pandang", temp: 23 },
        { name: "Tangga Atas", temp: 22 },
        { name: "Pos Tengah", temp: 21 },
        { name: "Dasar Air Terjun", temp: 20 }
      ],
      equipment: [
        "Jas hujan ponco & kantong waterproof ponsel",
        "Sandal gunung atau sepatu air antislip",
        "Helm pengaman (disediakan pengelola)",
        "Pakaian ganti lengkap"
      ],
      budget: [
        { item: "Tiket Masuk Gardu Panorama", cost: "Rp 10.000 / orang" },
        { item: "Tiket Turun Dasar Tebing", cost: "Rp 10.000 / orang" },
        { item: "Jasa Guide Pendamping Tebing", cost: "Rp 100.000 / grup" },
        { item: "Sewa Sandal Karet Anti Slip", cost: "Rp 10.000 / pasang" }
      ],
      route: "Saat ini rute tangga bambu curam basah dialihkan khusus hanya ke dek observasi atas.",
      bestTime: "Pukul 07:00 - 10:00 WIB saat pencahayaan matahari menembus lembah dan sebelum hujan siang."
    },
    pantaipink: {
      icon: "🏖️",
      displayName: "Pantai Pink",
      region: "Lombok Timur, NTB",
      status: "aman",
      statusLabel: "Aman",
      temp: "29°C",
      humidity: "71%",
      wind: "12 km/h",
      updated: "10:00 WITA",
      warningTitle: "Pemberitahuan: Terik Matahari & Arus Laut Tenang",
      warningDesc: "Kondisi sangat kondusif untuk aktivitas berenang dan snorkeling.",
      tipTitle: "Saran: Gunakan Tabir Surya Ramah Terumbu Karang",
      tipDesc: "Bawa air mineral cukup dan lindungi kulit dari paparan sinar UV tinggi.",
      elevationPoints: [
        { name: "Dermaga", temp: 30 },
        { name: "Pesisir", temp: 29 },
        { name: "Bukit Tangsi", temp: 28 },
        { name: "Perahu", temp: 29 },
        { name: "Spot Snorkel", temp: 27 }
      ],
      equipment: [
        "Sunscreen SPF 50+ reef-safe",
        "Kacamata UV & topi pantai lebar",
        "Kacamata & snorkel pribadi",
        "Sepatu karang / water shoes"
      ],
      budget: [
        { item: "Tiket Masuk Kawasan", cost: "Rp 10.000 / orang" },
        { item: "Sewa Perahu Tradisional Jelajah Pulau", cost: "Rp 300.000 - 450.000 / perahu" },
        { item: "Sewa Set Alat Snorkeling", cost: "Rp 35.000 / set" },
        { item: "Gazebo Tepi Pantai", cost: "Rp 50.000 / sepuasnya" }
      ],
      route: "Akses perahu cepat dari Pelabuhan Tanjung Luar lebih nyaman dibandingkan jalur darat berbatu.",
      bestTime: "Pukul 08:00 - 11:30 WITA ketika air laut surut dan butiran alga merah terlihat paling merah muda."
    },
    prambanan: {
      icon: "🏛️",
      displayName: "Candi Prambanan",
      region: "Sleman, DIY",
      status: "aman",
      statusLabel: "Aman",
      temp: "28°C",
      humidity: "68%",
      wind: "10 km/h",
      updated: "10:15 WIB",
      warningTitle: "Pemberitahuan: Cuaca Cerah & Terik Siang Hari",
      warningDesc: "Suhu terasa hangat di pelataran terbuka komplek candi.",
      tipTitle: "Saran: Bawa Payung & Air Minum Cukup",
      tipDesc: "Kenakan alas kaki yang nyaman untuk berjalan di area pelataran candi yang luas.",
      elevationPoints: [
        { name: "Pintu Masuk", temp: 28 },
        { name: "Pelataran Luar", temp: 29 },
        { name: "Candi Siwa", temp: 28 },
        { name: "Candi Brahma", temp: 28 },
        { name: "Taman Budaya", temp: 27 }
      ],
      equipment: [
        "Payung atau topi pelindung terik matahari",
        "Air mineral botol untuk hidrasi",
        "Kacamata hitam anti-UV",
        "Sepatu jalan santai bertapak empuk"
      ],
      budget: [
        { item: "Tiket Masuk Reguler Domestik", cost: "Rp 50.000 / orang" },
        { item: "Tiket Terusan Prambanan-Ratu Boko", cost: "Rp 85.000 / orang" },
        { item: "Pemandu Sejarah HPI", cost: "Rp 150.000 / rombongan" },
        { item: "Tiket Sendratari Ramayana", cost: "Rp 150.000 - 450.000" }
      ],
      route: "Area ramah pejalan kaki dengan jalur pedestrian paving tertata dan akses shuttle golf car.",
      bestTime: "Pukul 07:30 - 09:30 WIB untuk pencahayaan foto terbaik, atau sore hari pukul 16:00 WIB."
    },
    semeru: {
      icon: "🏔️",
      displayName: "Gunung Semeru",
      region: "Lumajang, Jatim",
      status: "bahaya",
      statusLabel: "Bahaya",
      temp: "9°C",
      humidity: "92%",
      wind: "45 km/h",
      updated: "08:15 WIB",
      warningTitle: "Peringatan Bahaya: Status Siaga & Badai Petir",
      warningDesc: "Seluruh jalur pendakian ditutup total demi keselamatan jiwa oleh Balai Besar TNBTS.",
      tipTitle: "Saran: Dilarang Masuk Radius 5 Km",
      tipDesc: "Patuhi instruksi resmi pos pantau Gunung Sawur dan BPBD Jawa Timur.",
      elevationPoints: [
        { name: "Ranupani", temp: 15 },
        { name: "Ranu Kumbolo", temp: 12 },
        { name: "Oro-oro Ombo", temp: 11 },
        { name: "Kalimati", temp: 9 },
        { name: "Puncak Mahameru", temp: 2 }
      ],
      equipment: [
        "Masker pelindung debu vulkanik",
        "Perlengkapan darurat evakuasi",
        "Radio komunikasi HT",
        "Jaket tahan angin dan air ekstrem"
      ],
      budget: [
        { item: "Status Pendakian", cost: "TUTUP SEMENTARA" },
        { item: "Kompensasi Booking SIMAKSI", cost: "Proses Reschedule Online" }
      ],
      route: "Akses gerbang Ranupani ditutup palang besi dan dijaga petugas gabungan.",
      bestTime: "Menunggu penurunan status resmi vulkanologi dari PVMBG."
    },
    madakaripura: {
      icon: "💧",
      displayName: "Air Terjun Madakaripura",
      region: "Probolinggo, Jatim",
      status: "waspada",
      statusLabel: "Waspada",
      temp: "22°C",
      humidity: "88%",
      wind: "15 km/h",
      updated: "09:30 WIB",
      warningTitle: "Peringatan: Debit Air Tebing Meningkat",
      warningDesc: "Curah hujan di lereng Bromo menambah debit air ceruk dan potensi jatuhan batu kecil.",
      tipTitle: "Saran: Wajib Mengenakan Helm Keselamatan",
      tipDesc: "Gunakan pemandu lokal berlisensi dan jangan berteduh tepat di bawah tebing tegak.",
      elevationPoints: [
        { name: "Loket Masuk", temp: 24 },
        { name: "Jalur Susur", temp: 23 },
        { name: "Ceruk Tengah", temp: 22 },
        { name: "Air Terjun Utama", temp: 21 },
        { name: "Gua Pertapaan", temp: 20 }
      ],
      equipment: [
        "Helm pelindung kepala (wajib dari pos)",
        "Jas hujan ponco plastik / raincoat",
        "Sandal karet antislip medan basah",
        "Dry bag waterproof untuk barang elektronik"
      ],
      budget: [
        { item: "Tiket Masuk Perhutani", cost: "Rp 33.000 / orang" },
        { item: "Ojek Parkiran ke Pintu Rimba", cost: "Rp 15.000 / jalan" },
        { item: "Pemandu Lokal Berlisensi", cost: "Rp 70.000 - 100.000 / grup" },
        { item: "Sewa Helm & Sandal Karet", cost: "Rp 15.000 / paket" }
      ],
      route: "Jalur susur sungai berbatu dengan tirai air abadi menembus ceruk tebing melingkar.",
      bestTime: "Pukul 08:00 - 11:00 WIB sebelum awan mendung siang hari berkumpul di lereng atas."
    }
  };

  // Public Reports Feed Data
  let publicReports = [
    {
      id: "rep_rinjani_1",
      destId: "rinjani",
      avatarText: "UL",
      authorName: "Uayan L.",
      stars: 4,
      locationTime: "Gunung Rinjani · 2 jam lalu",
      comment: "Sangat Licin Setelah Hujan. Jalur menuju Pos 2 sangat licin, disarankan pakai trekking pole.",
      mediaType: "camera" // 📸
    },
    {
      id: "rep_rinjani_2",
      destId: "rinjani",
      avatarText: "PB",
      authorName: "Pemandu Budi S.",
      stars: 5,
      locationTime: "Gunung Rinjani · 5 jam lalu",
      comment: "Sangat Informatif! Pemandu sangat profesional dan informatif. Sangat direkomendasikan.",
      mediaType: "compass" // 🧭
    },
    {
      id: "rep_pantaipink_1",
      destId: "pantaipink",
      avatarText: "DS",
      authorName: "Dinda Safitri",
      stars: 5,
      locationTime: "Pantai Pink · 3 jam lalu",
      comment: "Pasir merah mudanya terlihat sangat jelas saat surut pagi ini! Ombak tenang dan terumbu karang masih sangat alami.",
      mediaType: "camera"
    },
    {
      id: "rep_prambanan_1",
      destId: "prambanan",
      avatarText: "RA",
      authorName: "Rian Anggara",
      stars: 5,
      locationTime: "Candi Prambanan · 4 jam lalu",
      comment: "Kompleks candi sangat bersih dan tertata. Disarankan menyewa payung di gerbang karena cuaca siang cukup terik.",
      mediaType: "camera"
    },
    {
      id: "rep_semeru_1",
      destId: "semeru",
      avatarText: "BP",
      authorName: "BPBD Lumajang",
      stars: 2,
      locationTime: "Gunung Semeru · 1 jam lalu",
      comment: "Jalur pendakian ditutup total Level III Siaga. Dilarang beraktivitas dalam radius bahaya 5 km demi keselamatan.",
      mediaType: "compass"
    },
    {
      id: "rep_madakaripura_1",
      destId: "madakaripura",
      avatarText: "HN",
      authorName: "Hendra Novian",
      stars: 4,
      locationTime: "Air Terjun Madakaripura · 2 jam lalu",
      comment: "Pemandangannya magis seperti tirai air raksasa! Wajib sewa sandal karet dan pakai jas hujan karena basah kuyup.",
      mediaType: "camera"
    },
    {
      id: "rep_bromo_1",
      destId: "bromo",
      avatarText: "DN",
      authorName: "Dimas Nugroho",
      stars: 5,
      locationTime: "Gunung Bromo · 3 jam lalu",
      comment: "Sunrise Kingkong Hill Cerah Sempurna! Lautan pasir kering, jeep beroperasi normal. Kabut tipis di kaldera menciptakan pemandangan menakjubkan.",
      mediaType: "camera"
    },
    {
      id: "rep_tumpak_1",
      destId: "tumpaksewu",
      avatarText: "RP",
      authorName: "Ranger Pos Wisata",
      stars: 3,
      locationTime: "Air Terjun Tumpak Sewu · 1 jam lalu",
      comment: "Debit air meningkat akibat hujan lereng Semeru. Tangga bawah ditutup demi keselamatan. Pengunjung wajib berada di dek atas.",
      mediaType: "camera"
    }
  ];

  // Helper to get or generate destination data
  function getDestData(destId) {
    if (destinationInsights[destId]) {
      return destinationInsights[destId];
    }

    const dObj = data.destinations?.find(d => d.id === destId);
    const recObj = data.safetyRecommendations?.[destId];

    const isSafe = (dObj?.status === "aman");
    const isDanger = (dObj?.status === "bahaya");
    const statusType = isDanger ? "bahaya" : (isSafe ? "aman" : "waspada");

    return {
      icon: dObj?.category === "gunung" ? "🏔️" : (dObj?.category === "pantai" ? "🏖️" : (dObj?.category === "air_terjun" ? "🌊" : "📍")),
      displayName: dObj?.name || "Destinasi Wisata",
      region: dObj?.region || "Indonesia",
      status: statusType,
      statusLabel: statusType === "bahaya" ? "Bahaya" : (statusType === "aman" ? "Aman" : "Waspada"),
      temp: `${dObj?.temp || 24}°C`,
      humidity: `${dObj?.humidity || 75}%`,
      wind: dObj?.windSpeed || "15 km/h",
      updated: dObj?.updatedAt || "09:00 WIB",
      warningTitle: isDanger ? "Peringatan: Kondisi Ekstrem / Jalur Rawan" : (isSafe ? "Pemberitahuan: Kondisi Terkendali & Nyaman" : "Peringatan: Waspadai Fluktuasi Cuaca"),
      warningDesc: recObj?.aiRationale || "Pantau kondisi cuaca secara berkala sebelum dan selama perjalanan.",
      tipTitle: "Saran: Persiapkan Perlengkapan Ekstra",
      tipDesc: recObj?.mustHaves?.[0] || "Bawa jas hujan, senter cadangan, dan perlengkapan pertolongan pertama.",
      elevationPoints: dObj?.elevationProfile?.length ? dObj.elevationProfile.slice(0, 5).map(p => ({ name: p.point, temp: p.temp })) : [
        { name: "Titik Awal", temp: (dObj?.temp || 24) + 4 },
        { name: "Titik 1", temp: (dObj?.temp || 24) + 2 },
        { name: "Titik 2", temp: dObj?.temp || 24 },
        { name: "Titik 3", temp: (dObj?.temp || 24) - 2 },
        { name: "Puncak", temp: (dObj?.temp || 24) - 5 }
      ],
      equipment: recObj?.mustHaves || ["Pakaian nyaman sesuai iklim", "Air minum cukup", "Obat-obatan pribadi"],
      budget: [
        { item: "Tiket Masuk Destinasi", cost: "Rp 25.000 - 50.000 / orang" },
        { item: "Transportasi Lokal", cost: "Rp 50.000 - 150.000" }
      ],
      route: "Gunakan jalur resmi yang telah diberi marka oleh petugas pengelola.",
      bestTime: "Kunjungan di pagi hari memberikan pencahayaan dan kenyamanan cuaca terbaik."
    };
  }

  // Render SVG Line Chart
  function renderElevationChart(points) {
    const svgContainer = document.getElementById("chart-svg-container");
    const statsGrid = document.getElementById("elevation-stats-grid");
    if (!svgContainer || !points || points.length === 0) return;

    // ViewBox dimensions
    const width = 340;
    const height = 145;
    const paddingLeft = 32;
    const paddingRight = 18;
    const paddingTop = 18;
    const paddingBottom = 26;

    const plotWidth = width - paddingLeft - paddingRight;
    const plotHeight = height - paddingTop - paddingBottom;

    // Y values scale (0 to 24)
    const minY = 0;
    const maxY = 24;

    function scaleY(val) {
      const clamped = Math.max(minY, Math.min(maxY, val));
      return paddingTop + (1 - clamped / maxY) * plotHeight;
    }

    function scaleX(idx) {
      if (points.length === 1) return paddingLeft + plotWidth / 2;
      return paddingLeft + (idx / (points.length - 1)) * plotWidth;
    }

    // Build SVG Path
    const coords = points.map((p, idx) => ({
      x: scaleX(idx),
      y: scaleY(p.temp),
      name: p.name,
      temp: p.temp
    }));

    let lineD = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 1; i < coords.length; i++) {
      lineD += ` L ${coords[i].x} ${coords[i].y}`;
    }

    // Area path for gradient fill
    const areaD = `${lineD} L ${coords[coords.length - 1].x} ${height - paddingBottom} L ${coords[0].x} ${height - paddingBottom} Z`;

    // Horizontal grid lines: 24, 18, 12, 6, 0
    const yGridValues = [24, 18, 12, 6, 0];
    const gridLinesSvg = yGridValues.map(v => {
      const yPos = scaleY(v);
      return `
        <text x="8" y="${yPos + 3}" fill="#6E91B5" font-size="9" font-family="'JetBrains Mono', monospace">${v}°</text>
        <line x1="${paddingLeft}" y1="${yPos}" x2="${width - paddingRight}" y2="${yPos}" stroke="rgba(255,255,255,0.06)" stroke-dasharray="2 3" stroke-width="1"/>
      `;
    }).join("");

    // X Axis Labels
    const xLabelsSvg = coords.map(c => `
      <text x="${c.x}" y="${height - 8}" fill="#6E91B5" font-size="9" font-family="'Inter', sans-serif" text-anchor="middle">${c.name}</text>
    `).join("");

    // Data Dots
    const dotsSvg = coords.map(c => `
      <circle cx="${c.x}" cy="${c.y}" r="4" fill="#00C2CC" stroke="#08162B" stroke-width="1.5" />
      <circle cx="${c.x}" cy="${c.y}" r="2" fill="#FFFFFF" />
    `).join("");

    svgContainer.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="elevationGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#00C2CC" stop-opacity="0.32" />
            <stop offset="100%" stop-color="#00C2CC" stop-opacity="0.0" />
          </linearGradient>
        </defs>

        <!-- Grid Lines & Y Axis -->
        ${gridLinesSvg}

        <!-- Gradient Area Under Curve -->
        <path d="${areaD}" fill="url(#elevationGrad)" />

        <!-- Line Curve -->
        <path d="${lineD}" stroke="#00C2CC" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />

        <!-- X Axis Labels -->
        ${xLabelsSvg}

        <!-- Interactive Data Dots -->
        ${dotsSvg}
      </svg>
    `;

    // Render Stats list below graph (2 columns: Basecamp, Pos 1, etc.)
    if (statsGrid) {
      statsGrid.innerHTML = points.map(p => `
        <div class="elevation-stat-item">
          <div class="stat-left">
            <span class="stat-dot">●</span>
            <span>${p.name}</span>
          </div>
          <span class="stat-temp">${p.temp}°C</span>
        </div>
      `).join("");
    }
  }

  // Render Public Reports Feed
  function renderPublicReports(destId, destName) {
    const kickerEl = document.getElementById("public-reports-kicker");
    if (kickerEl) {
      kickerEl.textContent = `LAPORAN PUBLIK WISATAWAN — ${destName.toUpperCase()}`;
    }

    const feedEl = document.getElementById("public-reports-feed");
    if (!feedEl) return;

    // Filter reports for selected dest or fallback to top reports
    let filtered = publicReports.filter(r => r.destId === destId);
    if (filtered.length === 0) {
      filtered = [
        {
          id: `rep_${destId}_auto`,
          destId: destId,
          avatarText: "TW",
          authorName: "Tim Wisatawan",
          stars: 5,
          locationTime: `${destName} · Hari ini`,
          comment: `Kondisi jalur dan cuaca saat ini terpantau kondusif. Tetap waspada terhadap perubahan cuaca lokal.`,
          mediaType: "compass"
        }
      ];
    }

    feedEl.innerHTML = filtered.map(r => `
      <div class="report-card-modern" id="${r.id}">
        <div class="report-card-header">
          <div class="user-avatar-circle">${r.avatarText || "US"}</div>
          <div class="user-meta-col">
            <div class="user-name-stars-row">
              <span class="report-author-name">${r.authorName}</span>
              <span class="report-stars">${"★".repeat(r.stars)}</span>
            </div>
            <div class="report-location-time">${r.locationTime}</div>
          </div>
        </div>
        <p class="report-comment-text">${r.comment}</p>
        <div class="report-media-box">
          <span>${r.mediaType === "compass" ? "🧭" : "📸"}</span>
        </div>
      </div>
    `).join("");
  }

  // Render Entire View based on Active Destination
  function updateDashboard() {
    const curr = getDestData(activeDestId);

    // 1. Destination card
    const iconEl = document.getElementById("dest-icon");
    const nameEl = document.getElementById("dest-display-name");
    const regionEl = document.getElementById("dest-display-region");
    const pillEl = document.getElementById("dest-status-pill");
    const statusTextEl = document.getElementById("dest-status-text");

    if (iconEl) iconEl.textContent = curr.icon;
    if (nameEl) nameEl.textContent = curr.displayName;
    if (regionEl) regionEl.textContent = curr.region;
    if (pillEl) {
      pillEl.className = `dest-status-pill ${curr.status}`;
      if (statusTextEl) statusTextEl.textContent = curr.statusLabel;
    }

    // 2. Alert Banners
    const warnTitleEl = document.getElementById("alert-warning-title");
    const warnDescEl = document.getElementById("alert-warning-desc");
    const tipTitleEl = document.getElementById("alert-tip-title");
    const tipDescEl = document.getElementById("alert-tip-desc");

    if (warnTitleEl) warnTitleEl.textContent = curr.warningTitle;
    if (warnDescEl) warnDescEl.textContent = curr.warningDesc;
    if (tipTitleEl) tipTitleEl.textContent = curr.tipTitle;
    if (tipDescEl) tipDescEl.textContent = curr.tipDesc;

    // 3. Weather Metrics Grid
    const tempEl = document.getElementById("val-temp");
    const humEl = document.getElementById("val-humidity");
    const windEl = document.getElementById("val-wind");
    const upEl = document.getElementById("val-updated");

    if (tempEl) tempEl.textContent = curr.temp;
    if (humEl) humEl.textContent = curr.humidity;
    if (windEl) windEl.textContent = curr.wind;
    if (upEl) upEl.textContent = curr.updated;

    // 4. Elevation Chart
    renderElevationChart(curr.elevationPoints);

    // 5. Public Reports Feed
    renderPublicReports(activeDestId, curr.displayName);
  }

  // ── MODAL MANAGEMENT ──────────────────────────────────────────
  const modalOverlay = document.getElementById("modal-overlay-reports");
  const destModal = document.getElementById("dest-select-modal");
  const destCardTrigger = document.getElementById("dest-card-trigger");
  const reportModal = document.getElementById("new-report-modal");
  const guideModal = document.getElementById("guide-detail-modal");
  const reportForm = document.getElementById("new-report-form");

  function closeAllModals() {
    document.querySelectorAll(".modal-sheet").forEach(sheet => {
      sheet.style.display = "none";
      sheet.style.height = "";
      sheet.classList.remove("sheet--expanded");
    });
    if (modalOverlay) modalOverlay.style.display = "none";
  }

  // ── Bottom Sheet Drag & Expand Handlers (matching map.js) ─────
  function setupSheetDragHandles() {
    const modalSheets = document.querySelectorAll(".modal-sheet");
    modalSheets.forEach(sheet => {
      const handle = sheet.querySelector(".sheet-handle");
      if (!handle) return;

      let phStartY = 0, phStartH = 0, phDragging = false, hasMoved = false;

      const onPHStart = (clientY) => {
        phDragging = true;
        hasMoved = false;
        phStartY = clientY;
        phStartH = sheet.offsetHeight;
        sheet.style.transition = "none";
      };

      const onPHMove = (clientY) => {
        if (!phDragging) return;
        const delta = phStartY - clientY; // drag UP = positive (increases height)
        if (Math.abs(delta) > 4) {
          hasMoved = true;
        }
        const minH = 100;
        const maxH = Math.min(window.innerHeight * 0.90, window.innerHeight - 30);
        const newH = Math.max(minH, Math.min(maxH, phStartH + delta));
        sheet.style.height = newH + "px";
      };

      const onPHEnd = () => {
        if (!phDragging) return;
        phDragging = false;
        sheet.style.transition = "";

        const h = sheet.offsetHeight;
        const closeThreshold = Math.min(220, phStartH * 0.65);
        const expandThreshold = window.innerHeight * 0.60;

        if (h < closeThreshold || (phStartH - h > 90)) {
          sheet.style.height = "";
          sheet.classList.remove("sheet--expanded");
          closeAllModals();
        } else if (h > expandThreshold) {
          sheet.classList.add("sheet--expanded");
          sheet.style.height = "";
        } else {
          sheet.classList.remove("sheet--expanded");
          sheet.style.height = "";
        }
      };

      // Tap on handle toggles expanded state (just like map.js)
      handle.addEventListener("click", () => {
        if (hasMoved) return;
        sheet.classList.toggle("sheet--expanded");
        sheet.style.height = "";
      });

      // Mouse drag listeners
      handle.addEventListener("mousedown", (e) => onPHStart(e.clientY));
      document.addEventListener("mousemove", (e) => {
        if (phDragging) onPHMove(e.clientY);
      });
      document.addEventListener("mouseup", () => onPHEnd());

      // Touch drag listeners for mobile
      handle.addEventListener("touchstart", (e) => onPHStart(e.touches[0].clientY), { passive: true });
      handle.addEventListener("touchmove", (e) => onPHMove(e.touches[0].clientY), { passive: true });
      handle.addEventListener("touchend", () => onPHEnd());
    });
  }

  // ── DESTINATION BOTTOM SHEET PICKER ───────────────────────────
  function renderDestinationPicker() {
    const listEl = document.getElementById("dest-select-list");
    if (!listEl) return;

    listEl.innerHTML = destinationList.map(item => `
      <div class="dest-select-item ${item.id === activeDestId ? 'active' : ''}" data-dest-id="${item.id}" role="button" tabindex="0">
        <div class="dest-item-left">
          <span class="dest-item-icon">${item.icon}</span>
          <div class="dest-item-text">
            <div class="dest-item-name">${item.name}</div>
            <div class="dest-item-region">${item.region}</div>
          </div>
        </div>
        <div class="dest-item-right">
          <span class="dest-status-pill ${item.status}">
            <span class="pill-dot">●</span> <span>${item.statusLabel}</span>
          </span>
        </div>
      </div>
    `).join("");

    listEl.querySelectorAll(".dest-select-item").forEach(itemEl => {
      itemEl.addEventListener("click", () => {
        const selectedId = itemEl.getAttribute("data-dest-id");
        if (selectedId) {
          activeDestId = selectedId;
          if (destSelect) destSelect.value = selectedId;
          updateDashboard();
          closeAllModals();

          try {
            const url = new URL(window.location);
            url.searchParams.set("dest", selectedId);
            window.history.replaceState({}, "", url);
          } catch (err) {}
        }
      });

      itemEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          itemEl.click();
        }
      });
    });
  }

  // Open Destination Picker Sheet
  destCardTrigger?.addEventListener("click", () => {
    renderDestinationPicker();
    if (destModal && modalOverlay) {
      destModal.style.display = "block";
      modalOverlay.style.display = "block";
      setTimeout(() => {
        const activeItem = destModal.querySelector(".dest-select-item.active");
        if (activeItem) {
          activeItem.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }
      }, 40);
    }
  });

  destCardTrigger?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      destCardTrigger.click();
    }
  });

  // Open "Tambah Laporan Perjalanan" modal
  document.getElementById("btn-open-report-modal")?.addEventListener("click", () => {
    if (reportModal && modalOverlay) {
      reportModal.style.display = "block";
      modalOverlay.style.display = "block";
      // Update destination name in modal subtitle
      const curData = getDestData(activeDestId);
      const subEl = document.getElementById("modal-report-dest-name");
      if (subEl) subEl.textContent = curData.displayName;
    }
  });

  document.getElementById("btn-close-report-modal")?.addEventListener("click", closeAllModals);
  document.getElementById("btn-close-guide-modal")?.addEventListener("click", closeAllModals);
  modalOverlay?.addEventListener("click", closeAllModals);

  // Submit New Public Travel Report
  if (reportForm) {
    reportForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const rating = parseInt(document.getElementById("report-rating").value, 10);
      const commentText = document.getElementById("report-content-input").value;
      const mediaOption = document.querySelector('input[name="media-type"]:checked')?.value || "camera";
      const curData = getDestData(activeDestId);

      const newReport = {
        id: "rep_" + Date.now(),
        destId: activeDestId,
        avatarText: "AP",
        authorName: "Arya Pratama (Anda)",
        stars: rating,
        locationTime: `${curData.displayName} · Baru saja`,
        comment: commentText,
        mediaType: mediaOption
      };

      publicReports.unshift(newReport);
      reportForm.reset();
      closeAllModals();
      renderPublicReports(activeDestId, curData.displayName);

      // Scroll smoothly to the new report
      const newCard = document.getElementById(newReport.id);
      if (newCard) {
        newCard.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }

  // ── GUIDE DETAIL MODAL HANDLERS ───────────────────────────────
  const prepCards = document.querySelectorAll(".prep-card");
  prepCards.forEach(card => {
    card.addEventListener("click", () => {
      const guideType = card.getAttribute("data-guide");
      const curData = getDestData(activeDestId);
      const guideTitleEl = document.getElementById("guide-modal-title");
      const guideBodyEl = document.getElementById("guide-modal-body");

      if (!guideTitleEl || !guideBodyEl || !guideModal || !modalOverlay) return;

      if (guideType === "equipment") {
        guideTitleEl.textContent = "🎒 Perlengkapan Wajib";
        guideBodyEl.innerHTML = `
          <div class="sheet-sub">Daftar perlengkapan penting untuk kondisi cuaca terkini di <strong>${curData.displayName}</strong>:</div>
          <div class="guide-content-box">
            ${curData.equipment.map(item => `
              <div class="checklist-item">
                <span class="checklist-check">✓</span>
                <span>${item}</span>
              </div>
            `).join("")}
          </div>
          <p style="font-size: 11.5px; color: #7492B3; line-height: 1.4;">
            💡 <em>Pastikan memeriksa ulang semua perlengkapan tahan air sebelum memulai perjalanan.</em>
          </p>
        `;
      } else if (guideType === "budget") {
        guideTitleEl.textContent = "💰 Estimasi Biaya & Tiket";
        guideBodyEl.innerHTML = `
          <div class="sheet-sub">Rincian estimasi pengeluaran resmi di <strong>${curData.displayName}</strong>:</div>
          <div class="guide-content-box">
            ${curData.budget.map(b => `
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-size: 12.5px;">
                <span style="color: #D6E4F5;">${b.item}</span>
                <span style="color: #00C2CC; font-weight: 700; font-family: 'JetBrains Mono', monospace; font-size: 12px;">${b.cost}</span>
              </div>
            `).join("")}
          </div>
          <p style="font-size: 11.5px; color: #7492B3; line-height: 1.4;">
            💡 <em>Tarif dapat berubah tergantung musim liburan dan negosiasi paket grup resmi.</em>
          </p>
        `;
      } else if (guideType === "route") {
        guideTitleEl.textContent = "🛣️ Rute & Jalur Teraman";
        guideBodyEl.innerHTML = `
          <div class="sheet-sub">Rekomendasi navigasi rute untuk <strong>${curData.displayName}</strong>:</div>
          <div class="guide-content-box">
            <p style="font-size: 13px; color: #E2ECF8; line-height: 1.5; margin-bottom: 12px;">
              ${curData.route}
            </p>
            <div style="background: rgba(0, 194, 204, 0.08); border-left: 3px solid #00C2CC; padding: 10px 12px; border-radius: 4px; font-size: 12px; color: #9BB4CE;">
              ⚠️ Jangan mengambil rute potong ilegal yang tidak bertanda plang resmi Balai Taman Nasional.
            </div>
          </div>
        `;
      } else if (guideType === "best_time") {
        guideTitleEl.textContent = "📅 Waktu Kunjungan Terbaik";
        guideBodyEl.innerHTML = `
          <div class="sheet-sub">Prakiraan waktu optimal untuk <strong>${curData.displayName}</strong>:</div>
          <div class="guide-content-box">
            <p style="font-size: 13px; color: #E2ECF8; line-height: 1.5; margin-bottom: 12px;">
              ${curData.bestTime}
            </p>
            <div style="display: flex; gap: 8px; align-items: center; font-size: 12px; color: #FBBF24;">
              <span>🌤️</span>
              <span>Hindari aktivitas di lereng terbuka saat siang menuju sore jika awan kumulonimbus mulai terbentuk.</span>
            </div>
          </div>
        `;
      }

      guideModal.style.display = "block";
      modalOverlay.style.display = "block";
    });
  });

  // Initial render
  updateDashboard();
  setupSheetDragHandles();
});
