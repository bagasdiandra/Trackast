/**
 * PARTNERS.JS — TrackCast Verified Partners & Field Reports Logic
 */

document.addEventListener("DOMContentLoaded", () => {
  const data = window.TrackCastData;
  if (!data) return;

  const tabs = document.querySelectorAll(".tab-btn[data-tab]");
  const partnersSection = document.getElementById("partners-list-wrap");
  const reportsSection = document.getElementById("reports-feed-wrap");
  const destinationFilter = document.getElementById("filter-dest-select");
  
  let currentTab = "semua"; // "semua" | "guide" | "porter" | "laporan"
  let selectedDest = "semua";

  // Check URL params for destination filter
  const urlParams = new URLSearchParams(window.location.search);
  const destParam = urlParams.get("dest");
  if (destParam && destinationFilter) {
    selectedDest = destParam;
    destinationFilter.value = destParam;
  }

  // 1. Render Partners
  function renderPartners() {
    const listEl = document.getElementById("partners-container");
    if (!listEl) return;

    let filtered = data.partners;

    if (currentTab === "guide") {
      filtered = filtered.filter(p => p.type === "guide");
    } else if (currentTab === "porter") {
      filtered = filtered.filter(p => p.type === "porter");
    }

    if (selectedDest !== "semua") {
      filtered = filtered.filter(p => p.destinationId === selectedDest);
    }

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div style="text-align: center; padding: 32px 16px; color: var(--text-dim);">
          <div style="font-size: 32px; margin-bottom: 8px;">🔍</div>
          <p>Belum ada mitra terdaftar untuk filter ini.</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = filtered.map(p => `
      <div class="partner-card">
        <div class="partner-header">
          <div class="partner-avatar" style="background: ${p.avatarBg};">
            ${p.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
          </div>
          <div class="partner-info">
            <div class="partner-name-row">
              <span class="partner-name">${p.name}</span>
              <span class="badge ${p.available ? 'badge--safe' : 'badge--warn'}" style="font-size: 9.5px;">
                ${p.available ? 'Tersedia' : 'Bertugas'}
              </span>
            </div>
            <div class="partner-role-tag">${p.typeLabel} · ${p.badge}</div>
            <div class="partner-rating-row">
              <span class="partner-stars">⭐ ${p.rating}</span>
              <span>(${p.reviewCount} ulasan)</span>
              <span>· ${p.experience}</span>
            </div>
          </div>
        </div>

        <p class="partner-bio">${p.bio}</p>

        <div class="partner-meta-grid">
          <div class="partner-meta-item">
            <span class="meta-lbl">Lokasi Layanan</span>
            <span class="meta-val">${p.location}</span>
          </div>
          <div class="partner-meta-item">
            <span class="meta-lbl">Bahasa</span>
            <span class="meta-val">${p.languages.join(", ")}</span>
          </div>
          <div class="partner-meta-item" style="grid-column: span 2;">
            <span class="meta-lbl">Sertifikasi & Lisensi</span>
            <span class="meta-val">${p.certifications.join(" · ")}</span>
          </div>
        </div>

        <div class="partner-footer-row">
          <div>
            <div style="font-size: 10px; color: var(--text-muted);">TARIF RESMI STANDAR</div>
            <div class="partner-rate-tag">${p.rate}</div>
          </div>
          <button type="button" class="btn-contact-wa" onclick="openContactModal('${p.name}', '${p.phone}', '${p.typeLabel}')">
            <span>💬</span> WhatsApp
          </button>
        </div>
      </div>
    `).join("");
  }

  // 2. Render Field Reports Feed
  function renderFieldReports() {
    const feedEl = document.getElementById("reports-container");
    if (!feedEl) return;

    let filtered = data.fieldReports;
    if (selectedDest !== "semua") {
      filtered = filtered.filter(r => r.destinationId === selectedDest);
    }

    feedEl.innerHTML = filtered.map(r => {
      const urgencyBadge = r.urgency === "danger" 
        ? `<span class="badge badge--danger">${r.urgencyLabel}</span>`
        : (r.urgency === "warn" ? `<span class="badge badge--warn">${r.urgencyLabel}</span>` : `<span class="badge badge--safe">${r.urgencyLabel}</span>`);

      return `
        <div class="report-feed-card">
          <div class="report-feed-header">
            <div class="report-author-box">
              <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--card-3); display: flex; align-items: center; justify-content: center; font-size: 14px;">
                ${r.verifiedReport ? '🛡️' : '👤'}
              </div>
              <div>
                <div class="report-author-name">${r.authorName}</div>
                <div class="report-author-role">${r.authorRole} · ${r.destinationName}</div>
              </div>
            </div>
            ${urgencyBadge}
          </div>

          <h3 class="report-title">${r.title}</h3>
          <p class="report-text">${r.content}</p>

          ${r.hasImage ? `
            <div class="report-image-mock">
              <span>📷 ${r.imagePlaceholder}</span>
            </div>
          ` : ''}

          <div class="report-footer">
            <span>🕒 ${r.time}</span>
            <button type="button" class="like-btn" onclick="toggleLike(this, ${r.likes})">
              <span>👍 Terbantu</span> <span class="like-count">${r.likes}</span>
            </button>
          </div>
        </div>
      `;
    }).join("");
  }

  // Like Toggle
  window.toggleLike = function(btn, initialLikes) {
    const countEl = btn.querySelector(".like-count");
    if (btn.classList.contains("liked")) {
      btn.classList.remove("liked");
      countEl.textContent = initialLikes;
    } else {
      btn.classList.add("liked");
      countEl.textContent = initialLikes + 1;
    }
  };

  // WhatsApp Contact Modal
  const waModal = document.getElementById("contact-modal");
  const modalOverlay = document.getElementById("modal-overlay-partners");

  window.openContactModal = function(name, phone, role) {
    if (!waModal) return;
    document.getElementById("modal-contact-name").textContent = name;
    document.getElementById("modal-contact-role").textContent = role;
    document.getElementById("modal-contact-phone").textContent = phone;
    
    const sendBtn = document.getElementById("btn-send-wa");
    if (sendBtn) {
      sendBtn.onclick = () => {
        alert(`Membuka simulasi WhatsApp ke ${name} (${phone}). Pesan keselamatan siap dikirim.`);
        closeContactModal();
      };
    }

    waModal.style.display = "block";
    if (modalOverlay) modalOverlay.style.display = "block";
  };

  function closeAllModals() {
    if (waModal) waModal.style.display = "none";
    const repModal = document.getElementById("new-report-modal");
    if (repModal) repModal.style.display = "none";
    if (modalOverlay) modalOverlay.style.display = "none";
  }

  document.getElementById("btn-close-contact")?.addEventListener("click", closeAllModals);
  if (modalOverlay) modalOverlay.addEventListener("click", closeAllModals);

  // Tab Switching
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      currentTab = tab.getAttribute("data-tab");

      if (currentTab === "laporan") {
        if (partnersSection) partnersSection.style.display = "none";
        if (reportsSection) reportsSection.style.display = "block";
        renderFieldReports();
      } else {
        if (partnersSection) partnersSection.style.display = "block";
        if (reportsSection) reportsSection.style.display = "none";
        renderPartners();
      }
    });
  });

  // Destination Select Filter
  if (destinationFilter) {
    destinationFilter.addEventListener("change", (e) => {
      selectedDest = e.target.value;
      renderPartners();
      renderFieldReports();
    });
  }

  // Submit Field Report Form
  const reportForm = document.getElementById("new-report-form");
  const reportModal = document.getElementById("new-report-modal");

  document.getElementById("btn-open-report-modal")?.addEventListener("click", () => {
    if (reportModal) reportModal.style.display = "block";
    if (modalOverlay) modalOverlay.style.display = "block";
  });

  document.getElementById("btn-close-report-modal")?.addEventListener("click", () => {
    if (reportModal) reportModal.style.display = "none";
    if (modalOverlay) modalOverlay.style.display = "none";
  });

  if (reportForm) {
    reportForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const destId = document.getElementById("report-dest").value;
      const targetDest = data.destinations.find(d => d.id === destId);
      const urgencyVal = document.getElementById("report-urgency").value;
      const titleVal = document.getElementById("report-title").value;
      const contentVal = document.getElementById("report-content").value;

      const newReport = {
        id: "rep_" + Date.now(),
        destinationId: destId,
        destinationName: targetDest ? targetDest.name : "Destinasi",
        urgency: urgencyVal,
        urgencyLabel: urgencyVal === "danger" ? "DITUTUP SEMENTARA" : (urgencyVal === "warn" ? "PERHATIAN JALUR" : "KONDISI AMAN"),
        authorName: "Arya Pratama (Anda)",
        authorRole: "Laporan Terverifikasi",
        time: "Baru saja",
        title: titleVal,
        content: contentVal,
        hasImage: true,
        imagePlaceholder: "📷 Bukti Foto Terunggah",
        likes: 1,
        verifiedReport: true
      };

      data.fieldReports.unshift(newReport);
      
      reportForm.reset();
      if (reportModal) reportModal.style.display = "none";
      if (modalOverlay) modalOverlay.style.display = "none";

      // Switch to laporan tab
      document.querySelector(".tab-btn[data-tab='laporan']")?.click();
      alert("✅ Laporan kondisi lapangan Anda berhasil dikirim dan diverifikasi!");
    });
  }

  // Initial render
  renderPartners();
});
