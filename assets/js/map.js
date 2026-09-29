/**
 * MAP.JS — TrackCast Interactive Safety Map & Hexagonal Grid
 */

document.addEventListener("DOMContentLoaded", () => {
  const data = window.TrackCastData;
  if (!data) return;

  const svg = document.getElementById("indonesia-svg-map");
  const hexGridGroup = document.getElementById("hex-grid-group");
  const markersGroup = document.getElementById("markers-group");
  const searchInput = document.getElementById("map-search-input");
  const detailSheet = document.getElementById("dest-detail-sheet");
  const modalOverlay = document.getElementById("map-modal-overlay");
  const panel = document.getElementById("dest-panel");
  const panelHandle = document.getElementById("dest-panel-handle");
  const cardList = document.getElementById("dest-card-list");
  const resultCount = document.getElementById("panel-result-count");

  let zoomLevel = 1;
  let panX = 0;
  let panY = 0;
  let activeStatusFilter = "semua";
  let activeTypeFilter = "semua";
  let selectedDestination = null;

  // 1. Generate Hexagonal Grid Cells across Indonesian Archipelago
  function generateHexGrid() {
    if (!hexGridGroup) return;
    const hexRadius = 24;
    const width = 1000;
    const height = 500;
    const dx = hexRadius * 1.5;
    const dy = hexRadius * Math.sqrt(3);

    let hexHtml = "";

    // Pre-compute status reference points dynamically from all destinations
    const statusPoints = data.destinations.map(d => ({
      cx: d.coordinates.mapX,
      cy: d.coordinates.mapY,
      cls: d.status === "aman" ? "hex-safe" : (d.status === "waspada" ? "hex-warn" : "hex-danger")
    }));

    let colIdx = 0;
    for (let x = 40; x < width - 40; x += dx) {
      colIdx++;
      let rowIdx = 0;
      for (let y = 60; y < height - 60; y += dy) {
        rowIdx++;
        const cx = x;
        const cy = y + (colIdx % 2 === 1 ? dy / 2 : 0);

        // Filter out hexes that are empty ocean to create archipelago feel
        const inArchipelago = (
          (cx > 100 && cx < 320 && cy > 100 && cy < 380) || // Sumatra
          (cx > 280 && cx < 600 && cy > 280 && cy < 390) || // Java / Bali / Nusa Tenggara
          (cx > 380 && cx < 580 && cy > 120 && cy < 280) || // Kalimantan
          (cx > 560 && cx < 720 && cy > 140 && cy < 320) || // Sulawesi
          (cx > 680 && cx < 820 && cy > 160 && cy < 360) || // Maluku / NTT
          (cx > 800 && cx < 980 && cy > 140 && cy < 340)    // Papua
        );

        if (!inArchipelago) continue;

        // B2 Fix: match against pre-computed points — O(k) per hex instead of O(k×destinations)
        let cellClass = "hex-dim";
        for (const sp of statusPoints) {
          if (Math.hypot(sp.cx - cx, sp.cy - cy) < 45) {
            cellClass = sp.cls;
            break; // first match wins
          }
        }

        // Polygon points for hexagon
        const points = [];
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          const px = (cx + hexRadius * Math.cos(angle)).toFixed(1);
          const py = (cy + hexRadius * Math.sin(angle)).toFixed(1);
          points.push(`${px},${py}`);
        }

        hexHtml += `<polygon points="${points.join(" ")}" class="hex-cell ${cellClass}" data-cx="${cx}" data-cy="${cy}" />`;
      }
    }

    hexGridGroup.innerHTML = hexHtml;
  }

  // 2. Render Destination Markers
  function renderMarkers() {
    if (!markersGroup) return;

    const query = (searchInput ? searchInput.value : "").toLowerCase().trim();

    const filtered = data.destinations.filter(d => {
      const matchStatus = activeStatusFilter === "semua" || d.status === activeStatusFilter;
      const matchType = activeTypeFilter === "semua" || d.category === activeTypeFilter;
      const matchSearch = !query || d.name.toLowerCase().includes(query) || d.region.toLowerCase().includes(query);
      return matchStatus && matchType && matchSearch;
    });

    markersGroup.innerHTML = filtered.map(d => {
      const x = d.coordinates.mapX;
      const y = d.coordinates.mapY;
      const color = d.status === "aman" ? "#34D399" : (d.status === "waspada" ? "#FBBF24" : "#F87171");
      const isSelected = selectedDestination && selectedDestination.id === d.id;
      const pulseR = isSelected ? 20 : 14;

      return `
        <g class="map-marker ${isSelected ? 'active' : ''}" data-id="${d.id}" transform="translate(${x}, ${y})">
          <!-- Pulse Halo -->
          <circle cx="0" cy="0" r="${pulseR}" fill="${color}" fill-opacity="${isSelected ? '0.45' : '0.25'}" class="marker-halo" />
          <!-- Pin Body -->
          <circle cx="0" cy="0" r="${isSelected ? 14 : 10}" fill="#0A1628" stroke="${color}" stroke-width="${isSelected ? 3 : 2}" />
          <circle cx="0" cy="0" r="${isSelected ? 6 : 4}" fill="${color}" />
        </g>
      `;
    }).join("");
  }

  // Setup marker click events (called once)
  function setupMarkerEvents() {
    if (!markersGroup) return;
    markersGroup.addEventListener("click", (e) => {
      const markerEl = e.target.closest(".map-marker");
      if (markerEl) {
        e.stopPropagation();
        const id = markerEl.getAttribute("data-id");
        const dest = data.destinations.find(item => item.id === id);
        if (dest) selectDestination(dest);
      }
    });
  }

  // 3. Select Destination — highlight marker + scroll panel card + open detail
  function selectDestination(dest) {
    selectedDestination = dest;
    renderMarkers();
    renderDestPanel();          // refresh card highlight

    // Scroll the panel card into view
    const activeCard = cardList && cardList.querySelector(`.dest-panel-card[data-id="${dest.id}"]`);
    if (activeCard) {
      activeCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  // 4. Open Full Detail Modal Sheet with Elevation & Operational Notes
  function openFullDetail(dest) {
    if (!detailSheet) return;

    const statusBadge = dest.status === "aman"
      ? `<span class="badge badge--safe">AMAN</span>`
      : (dest.status === "waspada" ? `<span class="badge badge--warn">WASPADA</span>` : `<span class="badge badge--danger">DITUTUP</span>`);

    const statusColor = dest.status === "aman" ? "var(--safe)" : (dest.status === "waspada" ? "var(--warn)" : "var(--danger)");

    // Build Elevation Profile Chart HTML if exists
    let elevationHtml = "";
    if (dest.elevationProfile && dest.elevationProfile.length > 0) {
      const temps = dest.elevationProfile.map(p => p.temp);
      const minTemp = Math.floor(Math.min(...temps));
      const maxTemp = Math.ceil(Math.max(...temps));
      const tempRange = Math.max(2, maxTemp - minTemp);
      const midTemp = Math.round((maxTemp + minTemp) / 2);

      elevationHtml = `
        <div class="elevation-section">
          <div class="elevation-section-title">PROFIL SUHU PER KETINGGIAN (Hyperlocal Grid)</div>
          <div class="elevation-line-chart">
            <svg viewBox="0 0 400 120" style="width: 100%; height: 120px;">
              <!-- Grid lines -->
              <g stroke="rgba(30, 51, 86, 0.3)" stroke-width="0.5">
                <line x1="40" y1="20" x2="40" y2="100" />
                <line x1="40" y1="100" x2="380" y2="100" />
                <line x1="40" y1="60" x2="380" y2="60" stroke-dasharray="4,4" />
                <line x1="40" y1="20" x2="380" y2="20" stroke-dasharray="4,4" />
              </g>
              <!-- Y-axis labels dynamically scaled -->
              <g fill="#4A6580" font-size="9" font-family="'JetBrains Mono', monospace">
                <text x="10" y="25">${maxTemp}°</text>
                <text x="10" y="65">${midTemp}°</text>
                <text x="10" y="105">${minTemp}°</text>
              </g>
              <!-- Line chart -->
              <polyline fill="none" stroke="#00C2CC" stroke-width="2" points="${dest.elevationProfile.map((p, i) => {
        const x = 40 + (i * (340 / (dest.elevationProfile.length - 1)));
        const y = 98 - (((p.temp - minTemp) / tempRange) * 75);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(" ")}" />
              <!-- Data points -->
              ${dest.elevationProfile.map((p, i) => {
        const x = 40 + (i * (340 / (dest.elevationProfile.length - 1)));
        const y = 98 - (((p.temp - minTemp) / tempRange) * 75);
        return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="#00C2CC" stroke="#060D18" stroke-width="2" />`;
      }).join("")}
              <!-- X-axis labels -->
              <g fill="#6B8BAA" font-size="9" font-family="'Inter', sans-serif" text-anchor="middle">
                ${dest.elevationProfile.map((p, i) => {
        const x = 40 + (i * (340 / (dest.elevationProfile.length - 1)));
        const label = p.point.replace("Basecamp ", "BC ").replace("Plawangan ", "Plaw. ").replace("Puncak ", "P.");
        return `<text x="${x.toFixed(1)}" y="115">${label}</text>`;
      }).join("")}
              </g>
            </svg>
          </div>
          <!-- Legend (W2 Fix: CSS classes) -->
          <div class="elevation-legend">
            ${dest.elevationProfile.map(p => `
              <div class="elevation-legend-item">
                <span class="elevation-legend-dot"></span>
                <span class="elevation-legend-point">${p.point.replace("Basecamp ", "BC ")}</span>
                <span class="elevation-legend-temp">${p.temp}°C</span>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }

    const categoryLabel = dest.categoryLabel || dest.category || 'Destinasi';

    // W2 Fix: replaced all inline styles with CSS classes
    detailSheet.innerHTML = `
      <div class="sheet-handle"></div>
      
      <div class="sheet-header-row">
        <div>
          <h2 class="sheet-dest-name">${dest.name}</h2>
          <div class="sheet-dest-meta">${dest.region} · ${categoryLabel}</div>
        </div>
        ${statusBadge}
      </div>

      <!-- Quick Metrics Grid -->
      <div class="sheet-metrics-grid">
        <div class="metric-card">
          <div class="metric-icon">🌡️</div>
          <div class="metric-value">${dest.temp}°C</div>
          <div class="metric-label">Suhu</div>
        </div>
        <div class="metric-card">
          <div class="metric-icon">💧</div>
          <div class="metric-value">${dest.humidity}%</div>
          <div class="metric-label">Kelembapan</div>
        </div>
        <div class="metric-card">
          <div class="metric-icon">💨</div>
          <div class="metric-value">${dest.windSpeed}</div>
          <div class="metric-label">Angin</div>
        </div>
      </div>

      <!-- Location on Map -->
      <div class="sheet-section">
        <div class="sheet-section-label">Lokasi di Peta</div>
        <div class="mini-map-container">
          <svg viewBox="0 0 200 150" style="width: 100%; height: 150px;">
            <rect width="200" height="150" fill="#162240" rx="8" />
            <circle cx="100" cy="75" r="40" fill="rgba(52, 211, 153, 0.2)" stroke="#34D399" stroke-width="1" stroke-dasharray="4,4" />
            <circle cx="100" cy="75" r="6" fill="${statusColor}" stroke="#0A1628" stroke-width="2" />
            <circle cx="100" cy="75" r="12" fill="none" stroke="${statusColor}" stroke-width="1" opacity="0.5" />
          </svg>
        </div>
      </div>

      ${elevationHtml}

      <!-- Operational Info -->
      <div class="sheet-info-box">
        <div class="sheet-info-headline" style="color: ${statusColor};">
          ${dest.headline}
        </div>
        <p class="sheet-info-note">${dest.operationalNote}</p>
        <div class="sheet-info-source">
          ${dest.source} · Diperbarui ${dest.updatedAt}
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="sheet-action-row">
        <a href="partners.html?dest=${dest.id}" class="btn btn-primary sheet-link-btn">
          👥 Cari Pemandu / Porter
        </a>
        <button type="button" class="btn btn-secondary btn-close-sheet" id="btn-close-detail">
          Tutup
        </button>
      </div>
    `;

    detailSheet.style.display = "block";
    if (modalOverlay) modalOverlay.style.display = "block";

    document.getElementById("btn-close-detail")?.addEventListener("click", closeDetailSheet);
  }

  function closeDetailSheet() {
    if (detailSheet) detailSheet.style.display = "none";
    if (modalOverlay) modalOverlay.style.display = "none";
  }

  if (modalOverlay) modalOverlay.addEventListener("click", closeDetailSheet);

  // ── 5. renderDestPanel — builds the sliding card list ─────────────
  function renderDestPanel() {
    if (!cardList) return;

    const query = (searchInput ? searchInput.value : "").toLowerCase().trim();
    const filtered = data.destinations.filter(d => {
      const matchStatus = activeStatusFilter === "semua" || d.status === activeStatusFilter;
      const matchType = activeTypeFilter === "semua" || d.category === activeTypeFilter;
      const matchSearch = !query || d.name.toLowerCase().includes(query) || d.region.toLowerCase().includes(query);
      return matchStatus && matchType && matchSearch;
    });

    if (resultCount) {
      resultCount.textContent = `${filtered.length} destinasi ditemukan`;
    }

    const iconMap = {
      gunung: '⛰️', pantai: '🏖️', budaya: '🏛️',
      air_terjun: '💧', taman_nasional: '🌿', danau: '🌊'
    };
    const statusIcon = { aman: '✓', waspada: '!', bahaya: '✕' };
    const statusLabel = { aman: 'Aman', waspada: 'Waspada', bahaya: 'Bahaya' };

    cardList.innerHTML = filtered.map(d => {
      const sc = d.status;   // 'aman' | 'waspada' | 'bahaya'
      const icon = iconMap[d.category] || '📍';
      const isActive = selectedDestination && selectedDestination.id === d.id;
      const hasElev = d.elevationProfile && d.elevationProfile.length > 0;

      return `
        <div class="dest-panel-card card--${sc} ${isActive ? 'card--active' : ''}" data-id="${d.id}">

          <!-- Header -->
          <div class="dpc-header">
            <div class="dpc-left">
              <div class="dpc-icon ${sc}">${icon}</div>
              <div class="dpc-title-wrap">
                <div class="dpc-name">${d.name}</div>
                <div class="dpc-region">${d.region}</div>
              </div>
            </div>
            <div class="dpc-right">
              <span class="dpc-status-badge ${sc}">
                <span class="dpc-status-icon ${sc}">${statusIcon[sc]}</span>
                ${statusLabel[sc]}
              </span>
            </div>
          </div>

          <!-- Metrics -->
          <div class="dpc-metrics">
            <span class="dpc-metric"><span class="dpc-metric-icon">🌡️</span>${d.temp}°C</span>
            <span class="dpc-metric"><span class="dpc-metric-icon">💧</span>${d.humidity}%</span>
            <span class="dpc-metric"><span class="dpc-metric-icon">💨</span>${d.windSpeed}</span>
          </div>

          <!-- Footer: weather + action buttons -->
          <div class="dpc-footer">
            <div class="dpc-weather">☁️ ${d.weather}</div>
            <div class="dpc-actions">
              <button type="button" class="dpc-btn btn-map" data-id="${d.id}">🗺️ Peta</button>
              ${hasElev ? `<button type="button" class="dpc-btn btn-elev" data-id="${d.id}">📊 Elevasi</button>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join("");

    // Card click → select + open detail
    cardList.querySelectorAll(".dest-panel-card").forEach(card => {
      card.addEventListener("click", (e) => {
        // Prevent firing when button inside is clicked
        if (e.target.closest(".dpc-btn")) return;
        const id = card.getAttribute("data-id");
        const dest = data.destinations.find(d => d.id === id);
        if (dest) {
          selectDestination(dest);
          openFullDetail(dest);
        }
      });
    });

    // "🗺️ Peta" button → select + focus on map (no detail sheet)
    cardList.querySelectorAll(".btn-map").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.getAttribute("data-id");
        const dest = data.destinations.find(d => d.id === id);
        if (dest) selectDestination(dest);
      });
    });

    // "📊 Elevasi" button → open detail sheet directly at elevation section
    cardList.querySelectorAll(".btn-elev").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.getAttribute("data-id");
        const dest = data.destinations.find(d => d.id === id);
        if (dest) {
          selectDestination(dest);
          openFullDetail(dest);
          // Scroll to elevation section after render
          setTimeout(() => {
            const elevEl = detailSheet && detailSheet.querySelector(".elevation-section");
            if (elevEl) elevEl.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 320);
        }
      });
    });
  }
  document.querySelectorAll(".chip-status").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".chip-status").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      activeStatusFilter = chip.getAttribute("data-status");
      renderMarkers();
      renderDestPanel();
    });
  });

  document.querySelectorAll(".chip-type").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".chip-type").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      activeTypeFilter = chip.getAttribute("data-type");
      renderMarkers();
      renderDestPanel();
    });
  });

  // Search debounce
  let _searchTimer;
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      clearTimeout(_searchTimer);
      _searchTimer = setTimeout(() => { renderMarkers(); renderDestPanel(); }, 200);
    });
  }

  // ── Panel Expand/Collapse on handle tap ──────────────────────────
  if (panelHandle && panel) {
    panelHandle.addEventListener("click", () => {
      panel.classList.toggle("panel--expanded");
    });

    // Drag-to-expand: track touch/mouse delta on handle
    let phStartY = 0, phStartH = 0, phDragging = false;
    const onPHStart = (clientY) => {
      phDragging = true;
      phStartY = clientY;
      phStartH = panel.offsetHeight;
      panel.style.transition = "none";
    };
    const onPHMove = (clientY) => {
      if (!phDragging) return;
      const delta = phStartY - clientY;           // drag UP = positive
      const newH = Math.max(120, Math.min(window.innerHeight * 0.75, phStartH + delta));
      panel.style.height = newH + "px";
    };
    const onPHEnd = () => {
      if (!phDragging) return;
      phDragging = false;
      panel.style.transition = "";
      const h = panel.offsetHeight;
      const mid = window.innerHeight * 0.30;
      if (h > mid) {
        panel.classList.add("panel--expanded");
        panel.style.height = "";
      } else {
        panel.classList.remove("panel--expanded");
        panel.style.height = "";
      }
    };

    panelHandle.addEventListener("mousedown", (e) => onPHStart(e.clientY));
    document.addEventListener("mousemove", (e) => { if (phDragging) onPHMove(e.clientY); });
    document.addEventListener("mouseup", () => onPHEnd());
    panelHandle.addEventListener("touchstart", (e) => onPHStart(e.touches[0].clientY), { passive: true });
    panelHandle.addEventListener("touchmove", (e) => onPHMove(e.touches[0].clientY), { passive: true });
    panelHandle.addEventListener("touchend", () => onPHEnd());
  }

  // 6. Map Zoom & Pan Interactions
  function updateMapTransform() {
    if (!svg) return;
    svg.style.transform = `scale(${zoomLevel}) translate(${panX}px, ${panY}px)`;
  }

  // Zoom controls
  document.getElementById("btn-zoom-in")?.addEventListener("click", () => {
    if (zoomLevel < 2.5) {
      zoomLevel += 0.25;
      updateMapTransform();
    }
  });

  document.getElementById("btn-zoom-out")?.addEventListener("click", () => {
    if (zoomLevel > 0.8) {
      zoomLevel -= 0.25;
      updateMapTransform();
    }
  });

  document.getElementById("btn-zoom-reset")?.addEventListener("click", () => {
    zoomLevel = 1;
    panX = 0;
    panY = 0;
    updateMapTransform();
  });

  // Pan functionality
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let initialPanX = 0;
  let initialPanY = 0;

  const mapContainer = document.getElementById("map-viewport");
  if (mapContainer) {
    mapContainer.addEventListener("mousedown", (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initialPanX = panX;
      initialPanY = panY;
      mapContainer.style.cursor = "grabbing";
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      // W6 Fix: clamp pan so the map cannot disappear fully off-screen
      const maxPan = 280 / zoomLevel;
      panX = Math.max(-maxPan, Math.min(maxPan, initialPanX + dx / zoomLevel));
      panY = Math.max(-maxPan, Math.min(maxPan, initialPanY + dy / zoomLevel));
      updateMapTransform();
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
      if (mapContainer) mapContainer.style.cursor = "grab";
    });

    // Touch events for mobile
    mapContainer.addEventListener("touchstart", (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        initialPanX = panX;
        initialPanY = panY;
      }
    }, { passive: true });

    mapContainer.addEventListener("touchmove", (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      e.preventDefault();
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      // W6 Fix: same boundary as mouse pan
      const maxPan = 280 / zoomLevel;
      panX = Math.max(-maxPan, Math.min(maxPan, initialPanX + dx / zoomLevel));
      panY = Math.max(-maxPan, Math.min(maxPan, initialPanY + dy / zoomLevel));
      updateMapTransform();
    }, { passive: false });

    mapContainer.addEventListener("touchend", () => {
      isDragging = false;
    });
  }

  // Initial Builds
  generateHexGrid();
  renderMarkers();
  setupMarkerEvents();
  renderDestPanel();       // populate bottom panel on load

  // Check URL parameter for auto-focus
  const urlParams = new URLSearchParams(window.location.search);
  const destParam = urlParams.get("dest");
  if (destParam) {
    const target = data.destinations.find(d => d.id === destParam);
    if (target) {
      setTimeout(() => {
        selectDestination(target);
        openFullDetail(target);
      }, 300);
    }
  }
});
