/**
 * HOME.JS — TrackCast Beranda Logic
 * v2.0: Terhubung ke Backend API (OpenWeatherMap Live + Data Destinasi dari DB)
 * Fallback otomatis ke mock-data jika backend offline
 */

document.addEventListener("DOMContentLoaded", async () => {
  const data = window.TrackCastData;
  const storage = window.TrackCastStorage;
  const api = window.TrackCastAPI;

  // ─── 1. Nama Pengguna dari Session/JWT ──────────────────────────────────
  // Ambil dari storage lokal (disimpan saat login berhasil)
  const savedUser = storage ? storage.get("user_data") : null;
  const greetingEl = document.getElementById("user-greeting");
  if (greetingEl) {
    if (savedUser && (savedUser.full_name || savedUser.name)) {
      const displayName = savedUser.full_name || savedUser.name;
      greetingEl.textContent = `Halo, ${displayName.split(" ")[0]} 👋`;
    } else if (data && data.currentUser) {
      greetingEl.textContent = `Halo, ${data.currentUser.name.split(" ")[0]} 👋`;
    }

    // Coba ambil profil terbaru dari backend (jika token masih valid)
    if (api) {
      try {
        const meData = await api.auth.getMe();
        if (meData && meData.full_name) {
          greetingEl.textContent = `Halo, ${meData.full_name.split(" ")[0]} 👋`;
          // Update storage dengan data terbaru
          storage && storage.setLoggedIn(true, meData);
        }
      } catch (e) {
        // Tidak masalah — pakai nama dari storage
      }
    }
  }

  // ─── 2. Data Cuaca dari OpenWeatherMap via Backend ───────────────────────
  const DEFAULT_DEST_SLUG = "rinjani"; // Destinasi cuaca default di beranda

  async function loadWeatherFromAPI() {
    if (!api) return false;
    const online = await api.utils.checkHealth();
    if (!online) return false;

    try {
      const result = await api.destinations.getWeather(DEFAULT_DEST_SLUG);
      if (!result || !result.current_weather) return false;

      const w = result.current_weather;
      const dest = result.destination;
      const safety = result.safety_summary;

      // Lokasi & region
      const locationEl = document.getElementById("weather-location");
      const regionEl = document.getElementById("weather-region");
      if (locationEl) locationEl.textContent = dest.name || w.location;
      if (regionEl) regionEl.textContent = dest.region || "";

      // Suhu & kondisi
      const tempEl = document.getElementById("weather-temp");
      const iconEl = document.getElementById("weather-icon");
      const condEl = document.getElementById("weather-condition");
      const rangeEl = document.getElementById("weather-range");
      if (tempEl) tempEl.textContent = Math.round(w.temperature_c);
      if (condEl) condEl.textContent = w.condition_description || w.condition;
      if (rangeEl) rangeEl.textContent = `Maks ${Math.round(w.temp_max_c || w.temperature_c)}° · Min ${Math.round(w.temp_min_c || w.temperature_c - 5)}°`;

      // Ikon cuaca dari OpenWeatherMap
      if (iconEl) {
        const owmIcon = w.condition_icon;
        const iconMap = {
          "01d": "☀️", "01n": "🌙", "02d": "🌤️", "02n": "🌤️",
          "03d": "☁️", "03n": "☁️", "04d": "☁️", "04n": "☁️",
          "09d": "🌧️", "09n": "🌧️", "10d": "🌦️", "10n": "🌧️",
          "11d": "⛈️", "11n": "⛈️", "13d": "❄️", "13n": "❄️",
          "50d": "🌫️", "50n": "🌫️"
        };
        iconEl.textContent = iconMap[owmIcon] || "🌡️";
      }

      // Metrik
      const humidEl = document.getElementById("weather-humidity");
      const windEl = document.getElementById("weather-wind");
      const rainEl = document.getElementById("weather-rain");
      if (humidEl) humidEl.textContent = `${w.humidity_pct}%`;
      if (windEl) windEl.textContent = `${w.wind_kph} km/j`;
      if (rainEl) rainEl.textContent = `${w.rain_1h_mm > 0 ? Math.round(w.rain_1h_mm * 10) : 0}%`;

      // Timestamp pembaruan
      const updatedEl = document.getElementById("weather-updated");
      if (updatedEl) {
        const now = new Date(w.observed_at);
        const jam = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
        updatedEl.textContent = `Diperbarui ${jam} · OpenWeatherMap Live API`;
      }

      // Badge sumber: ganti dari "BMKG Hyperlocal" → "OpenWeatherMap Live"
      const sourceBadge = document.querySelector(".source-badge");
      if (sourceBadge) {
        sourceBadge.textContent = "OpenWeatherMap Live";
        sourceBadge.style.background = "var(--primary, #3b82f6)";
        sourceBadge.style.color = "#fff";
      }

      // Render prakiraan per jam dari forecast API
      if (result.hourly_forecast && result.hourly_forecast.length > 0) {
        renderHourlyFromAPI(result.hourly_forecast);
      }

      return true;
    } catch (err) {
      console.error("[TrackCast] Gagal memuat cuaca dari API:", err.message);
      return false;
    }
  }

  function renderHourlyFromAPI(hourlyList) {
    const hourlyWrap = document.getElementById("hourly-forecast-list");
    if (!hourlyWrap) return;

    const iconMap = {
      "01d": "☀️", "01n": "🌙", "02d": "🌤️", "02n": "🌤️",
      "03d": "☁️", "03n": "☁️", "04d": "☁️", "04n": "☁️",
      "09d": "🌧️", "09n": "🌧️", "10d": "🌦️", "10n": "🌧️",
      "11d": "⛈️", "11n": "⛈️", "13d": "❄️", "13n": "❄️",
      "50d": "🌫️", "50n": "🌫️"
    };

    hourlyWrap.innerHTML = hourlyList.map(item => `
      <div class="forecast-col">
        <span class="forecast-time">${item.time}</span>
        <span class="forecast-icon">${iconMap[item.icon] || "🌡️"}</span>
        <span class="forecast-temp">${Math.round(item.temperature_c)}°</span>
        <span class="forecast-rain">💧 ${item.rain_probability_pct}%</span>
      </div>
    `).join("");
  }

  function renderWeatherFromMock() {
    if (!data || !data.currentWeather) return;
    const w = data.currentWeather;
    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setEl("weather-location", w.location);
    setEl("weather-region", w.region);
    setEl("weather-temp", w.temp);
    setEl("weather-icon", w.icon);
    setEl("weather-condition", w.condition);
    setEl("weather-range", `Tertinggi ${w.high}° · Terendah ${w.low}°`);
    setEl("weather-humidity", `${w.humidity}%`);
    setEl("weather-wind", w.windSpeed);
    setEl("weather-rain", `${w.rainfallProbability}%`);
    setEl("weather-updated", `${w.updatedAt} (Data Simulasi)`);

    const hourlyWrap = document.getElementById("hourly-forecast-list");
    if (hourlyWrap && w.hourly) {
      hourlyWrap.innerHTML = w.hourly.map(item => `
        <div class="forecast-col">
          <span class="forecast-time">${item.time}</span>
          <span class="forecast-icon">${item.icon}</span>
          <span class="forecast-temp">${item.temp}°</span>
          <span class="forecast-rain">💧 ${item.rain}</span>
        </div>
      `).join("");
    }
  }

  // Coba load dari API, fallback ke mock jika gagal
  const weatherLoaded = await loadWeatherFromAPI();
  if (!weatherLoaded) {
    console.warn("[TrackCast] Menggunakan data cuaca simulasi (backend tidak aktif).");
    renderWeatherFromMock();
  }

  // ─── 3. Destinasi dari Backend ───────────────────────────────────────────
  let destinations = [];

  async function loadDestinationsFromAPI() {
    if (!api) return false;
    const online = await api.utils.checkHealth();
    if (!online) return false;
    try {
      destinations = await api.destinations.getAll();
      // Normalisasi field agar kompatibel dengan fungsi render lama
      destinations = destinations.map(d => ({
        ...d,
        id: d.slug,
        statusLabel: d.status_label,
        categoryLabel: d.category.charAt(0).toUpperCase() + d.category.slice(1).replace("_", " "),
        temp: null,
        weather: d.operational_note ? d.operational_note.split(".")[0] : "Data Live",
        windSpeed: "-",
        humidity: "-",
        source: "OpenWeatherMap + TrackCast Backend",
        updatedAt: "Baru saja"
      }));
      return true;
    } catch (err) {
      console.error("[TrackCast] Gagal memuat destinasi dari API:", err.message);
      return false;
    }
  }

  const destLoaded = await loadDestinationsFromAPI();
  if (!destLoaded && data) {
    destinations = data.destinations;
    console.warn("[TrackCast] Menggunakan data destinasi simulasi (backend tidak aktif).");
  }

  // ─── 4. Render Daftar Destinasi ──────────────────────────────────────────
  let activeCategory = "semua";
  const filterChips = document.querySelectorAll(".chip[data-category]");
  const destListEl = document.getElementById("destination-list");

  function renderDestinations() {
    if (!destListEl) return;
    const filtered = activeCategory === "semua"
      ? destinations
      : destinations.filter(d => d.category === activeCategory);

    if (filtered.length === 0) {
      destListEl.innerHTML = `<p style="color:var(--text-dim);font-size:13px;padding:16px 0;">Tidak ada destinasi untuk kategori ini.</p>`;
      return;
    }

    destListEl.innerHTML = filtered.map(dest => {
      const statusClass = dest.status === "aman" ? "safe" : (dest.status === "waspada" ? "warn" : "danger");
      const iconMap = { gunung: "⛰️", pantai: "🏖️", air_terjun: "💧", budaya: "🏛️", taman_nasional: "🌿", danau: "🌊" };
      const icon = iconMap[dest.category] || "📍";
      const label = dest.statusLabel || (dest.status === "aman" ? "AMAN" : dest.status === "waspada" ? "WASPADA" : "BAHAYA");
      const catLabel = dest.categoryLabel || dest.category;
      const tempDisplay = dest.temp != null ? `${dest.temp}°C` : "Live";
      const weatherLabel = (dest.weather || "").split(" ")[0] || dest.status;

      return `
        <div class="dest-card" data-id="${dest.id}" data-slug="${dest.slug || dest.id}">
          <div class="dest-main-info">
            <div class="dest-status-indicator ${statusClass}"><span>${icon}</span></div>
            <div class="dest-text-group">
              <div class="dest-title-row">
                <span class="dest-name">${dest.name}</span>
                <span class="badge badge--${statusClass}">${label}</span>
              </div>
              <span class="dest-meta">${dest.region} · ${catLabel}</span>
            </div>
          </div>
          <div class="dest-right-stats">
            <span class="dest-temp">${tempDisplay}</span>
            <span class="dest-weather-label">${weatherLabel}</span>
          </div>
        </div>
      `;
    }).join("");

    document.querySelectorAll(".dest-card").forEach(card => {
      card.addEventListener("click", () => openDestModal(card.getAttribute("data-id")));
    });
  }

  filterChips.forEach(chip => {
    chip.addEventListener("click", () => {
      filterChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      activeCategory = chip.getAttribute("data-category");
      renderDestinations();
    });
  });

  renderDestinations();

  // ─── 5. Modal Detail Destinasi ───────────────────────────────────────────
  const modalEl = document.getElementById("quick-dest-modal");
  const modalOverlay = document.getElementById("modal-overlay");
  const modalClose = document.getElementById("modal-close-btn");

  function openDestModal(destId) {
    const dest = destinations.find(d => d.id === destId || d.slug === destId);
    if (!dest || !modalEl) return;

    const statusClass = dest.status === "aman" ? "safe" : (dest.status === "waspada" ? "warn" : "danger");
    const label = dest.statusLabel || dest.status.toUpperCase();
    const statusBadge = `<span class="badge badge--${statusClass}">${label}</span>`;

    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    const setHTML = (id, val) => { const el = document.getElementById(id); if (el) el.innerHTML = val; };

    setEl("modal-dest-name", dest.name);
    setEl("modal-dest-region", `${dest.region}${dest.elevation ? " · " + dest.elevation : ""}`);
    setHTML("modal-badge-container", statusBadge);
    setEl("modal-dest-weather", dest.temp != null ? `${dest.weather} (${dest.temp}°C)` : (dest.headline || dest.operational_note || "-"));
    setEl("modal-dest-wind", dest.windSpeed !== "-" ? `${dest.windSpeed}, Kelembapan ${dest.humidity}%` : (dest.operational_note || "-"));
    setEl("modal-dest-headline", dest.headline || "-");
    setEl("modal-dest-notes", dest.operational_note || dest.operationalNote || "-");
    setEl("modal-dest-source", `Sumber: ${dest.source || "TrackCast Backend"} · ${dest.updatedAt || "Baru saja"}`);

    const mapBtn = document.getElementById("modal-go-map");
    if (mapBtn) mapBtn.href = `map.html?dest=${dest.slug || dest.id}`;

    modalEl.style.display = "block";
    if (modalOverlay) modalOverlay.style.display = "block";
  }

  function closeModal() {
    if (modalEl) modalEl.style.display = "none";
    if (modalOverlay) modalOverlay.style.display = "none";
  }

  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modalOverlay) modalOverlay.addEventListener("click", closeModal);

  // ─── 6. Alert Feed ───────────────────────────────────────────────────────
  const alertReport = data && data.fieldReports
    ? data.fieldReports.find(r => r.urgency === "warn" || r.urgency === "danger")
    : null;

  if (alertReport) {
    const alertFeedEl = document.getElementById("home-alert-feed");
    if (alertFeedEl) {
      alertFeedEl.innerHTML = `
        <div class="alert-feed-card">
          <div class="alert-feed-icon">⚠️</div>
          <div class="alert-feed-content">
            <div class="alert-feed-title">${alertReport.urgencyLabel}: ${alertReport.destinationName}</div>
            <div class="alert-feed-desc">${alertReport.title} — ${alertReport.content.slice(0, 100)}...</div>
            <div class="alert-feed-time">${alertReport.authorName} · ${alertReport.time}</div>
          </div>
        </div>
      `;
    }
  }
});
