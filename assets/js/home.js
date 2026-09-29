/**
 * HOME.JS — TrackCast Beranda Logic
 */

document.addEventListener("DOMContentLoaded", () => {
  const data = window.TrackCastData;
  const storage = window.TrackCastStorage;

  if (!data) {
    console.error("TrackCastData not loaded");
    return;
  }

  // Set user greeting
  const user = (storage && storage.get("user_data")) || data.currentUser;
  const greetingEl = document.getElementById("user-greeting");
  if (greetingEl) {
    greetingEl.textContent = `Halo, ${user.name.split(" ")[0]} 👋`;
  }

  // Render Current Weather
  const w = data.currentWeather;
  document.getElementById("weather-location").textContent = w.location;
  document.getElementById("weather-region").textContent = w.region;
  document.getElementById("weather-temp").textContent = w.temp;
  document.getElementById("weather-icon").textContent = w.icon;
  document.getElementById("weather-condition").textContent = w.condition;
  document.getElementById("weather-range").textContent = `Tertinggi ${w.high}° · Terendah ${w.low}°`;
  document.getElementById("weather-humidity").textContent = `${w.humidity}%`;
  document.getElementById("weather-wind").textContent = w.windSpeed;
  document.getElementById("weather-rain").textContent = `${w.rainfallProbability}%`;
  document.getElementById("weather-updated").textContent = w.updatedAt;

  // Render Hourly Forecast
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

  // Filter Destinasi
  let activeCategory = "semua";
  const filterChips = document.querySelectorAll(".chip[data-category]");
  const destListEl = document.getElementById("destination-list");

  function renderDestinations() {
    if (!destListEl) return;
    const filtered = activeCategory === "semua" 
      ? data.destinations 
      : data.destinations.filter(d => d.category === activeCategory);

    destListEl.innerHTML = filtered.map(dest => {
      const statusClass = dest.status === "aman" ? "safe" : (dest.status === "waspada" ? "warn" : "danger");
      const iconMap = {
        gunung: "⛰️",
        pantai: "🏖️",
        air_terjun: "💧",
        budaya: "🏛️",
        taman_nasional: "🌿",
        danau: "🌊"
      };
      const icon = iconMap[dest.category] || "📍";
      
      return `
        <div class="dest-card" data-id="${dest.id}">
          <div class="dest-main-info">
            <div class="dest-status-indicator ${statusClass}">
              <span>${icon}</span>
            </div>
            <div class="dest-text-group">
              <div class="dest-title-row">
                <span class="dest-name">${dest.name}</span>
                <span class="badge badge--${statusClass}">${dest.statusLabel}</span>
              </div>
              <span class="dest-meta">${dest.region} · ${dest.categoryLabel}</span>
            </div>
          </div>
          <div class="dest-right-stats">
            <span class="dest-temp">${dest.temp}°C</span>
            <span class="dest-weather-label">${dest.weather.split(" ")[0]}</span>
          </div>
        </div>
      `;
    }).join("");

    // Add click listeners to cards to open modal
    document.querySelectorAll(".dest-card").forEach(card => {
      card.addEventListener("click", () => {
        const id = card.getAttribute("data-id");
        openDestModal(id);
      });
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

  // Quick Modal Logic
  const modalEl = document.getElementById("quick-dest-modal");
  const modalOverlay = document.getElementById("modal-overlay");
  const modalClose = document.getElementById("modal-close-btn");

  function openDestModal(destId) {
    const dest = data.destinations.find(d => d.id === destId);
    if (!dest || !modalEl) return;

    const statusBadge = dest.status === "aman" 
      ? `<span class="badge badge--safe">AMAN</span>`
      : (dest.status === "waspada" ? `<span class="badge badge--warn">WASPADA</span>` : `<span class="badge badge--danger">DITUTUP</span>`);

    document.getElementById("modal-dest-name").textContent = dest.name;
    document.getElementById("modal-dest-region").textContent = `${dest.region} · ${dest.elevation}`;
    document.getElementById("modal-badge-container").innerHTML = statusBadge;
    document.getElementById("modal-dest-weather").textContent = `${dest.weather} (${dest.temp}°C)`;
    document.getElementById("modal-dest-wind").textContent = `${dest.windSpeed}, Kelembapan ${dest.humidity}%`;
    document.getElementById("modal-dest-headline").textContent = dest.headline;
    document.getElementById("modal-dest-notes").textContent = dest.operationalNote;
    document.getElementById("modal-dest-source").textContent = `Sumber: ${dest.source} · Diperbarui ${dest.updatedAt}`;

    const mapBtn = document.getElementById("modal-go-map");
    if (mapBtn) {
      mapBtn.href = `map.html?dest=${dest.id}`;
    }

    modalEl.style.display = "block";
    if (modalOverlay) modalOverlay.style.display = "block";
  }

  function closeModal() {
    if (modalEl) modalEl.style.display = "none";
    if (modalOverlay) modalOverlay.style.display = "none";
  }

  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modalOverlay) modalOverlay.addEventListener("click", closeModal);

  // Render Alert Feed
  const alertReport = data.fieldReports.find(r => r.urgency === "warn" || r.urgency === "danger");
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
