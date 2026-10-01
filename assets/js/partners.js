/**
 * PARTNERS.JS — TrackCast Verified Partners & Field Reports Logic
 * Destination filter uses same custom bottom-sheet picker as reports.js
 */

document.addEventListener("DOMContentLoaded", () => {
  const data = window.TrackCastData;
  if (!data) return;

  const tabs = document.querySelectorAll(".tab-btn[data-tab]");
  const partnersSection = document.getElementById("partners-list-wrap");
  const reportsSection = document.getElementById("reports-feed-wrap");
  const destHiddenInput = document.getElementById("filter-dest-select");

  let currentTab = "semua";
  let selectedDest = "semua";

  // Destination list (icons as unicode escapes to preserve encoding)
  const destinationList = [
    { id: "semua",        name: "Semua Destinasi",           region: "Seluruh Indonesia",       icon: "\uD83D\uDDFA\uFE0F", status: "aman",    statusLabel: "Semua"    },
    { id: "rinjani",      name: "Gunung Rinjani",            region: "Lombok, NTB",             icon: "\uD83C\uDFD4\uFE0F", status: "waspada", statusLabel: "Waspada"  },
    { id: "pantaipink",   name: "Pantai Pink",               region: "Lombok Timur, NTB",       icon: "\uD83C\uDFD6\uFE0F", status: "aman",    statusLabel: "Aman"     },
    { id: "prambanan",    name: "Candi Prambanan",           region: "Sleman, DIY",             icon: "\uD83C\uDFDB\uFE0F", status: "aman",    statusLabel: "Aman"     },
    { id: "semeru",       name: "Gunung Semeru",             region: "Lumajang, Jatim",         icon: "\uD83C\uDFD4\uFE0F", status: "bahaya",  statusLabel: "Bahaya"   },
    { id: "madakaripura", name: "Air Terjun Madakaripura",   region: "Probolinggo, Jatim",      icon: "\uD83D\uDCA7",       status: "waspada", statusLabel: "Waspada"  },
    { id: "bromo",        name: "Gunung Bromo",              region: "Probolinggo, Jatim",      icon: "\uD83C\uDF0B",       status: "waspada", statusLabel: "Waspada"  },
    { id: "tumpaksewu",   name: "Air Terjun Tumpak Sewu",    region: "Lumajang, Jatim",         icon: "\uD83C\uDF0A",       status: "bahaya",  statusLabel: "Bahaya"   },
    { id: "kuta",         name: "Pantai Kuta",               region: "Badung, Bali",            icon: "\uD83C\uDFD6\uFE0F", status: "aman",    statusLabel: "Aman"     },
    { id: "nusadua",      name: "Pantai Nusa Dua",           region: "Badung, Bali",            icon: "\uD83C\uDFD6\uFE0F", status: "aman",    statusLabel: "Aman"     },
    { id: "komodo",       name: "Taman Nasional Komodo",     region: "Manggarai Barat, NTT",    icon: "\uD83E\uDD8E",       status: "aman",    statusLabel: "Aman"     },
    { id: "borobudur",    name: "Candi Borobudur",           region: "Magelang, Jateng",        icon: "\uD83C\uDFDB\uFE0F", status: "aman",    statusLabel: "Aman"     },
    { id: "tobalake",     name: "Danau Toba",                region: "Sumatera Utara",          icon: "\uD83C\uDFDE\uFE0F", status: "aman",    statusLabel: "Aman"     },
    { id: "rajaampat",    name: "Kepulauan Raja Ampat",      region: "Papua Barat Daya",        icon: "\uD83C\uDFDD\uFE0F", status: "aman",    statusLabel: "Aman"     }
  ];

  // Check URL params for destination filter
  const urlParams = new URLSearchParams(window.location.search);
  const destParam = urlParams.get("dest");
  if (destParam && destinationList.some(d => d.id === destParam)) {
    selectedDest = destParam;
    if (destHiddenInput) destHiddenInput.value = destParam;
    updateDestCard(destParam);
  }

  // Update the visible destination card to reflect selected destination
  function updateDestCard(destId) {
    const item = destinationList.find(d => d.id === destId) || destinationList[0];
    const iconEl   = document.getElementById("partners-dest-icon");
    const nameEl   = document.getElementById("partners-dest-name");
    const regionEl = document.getElementById("partners-dest-region");
    const pillEl   = document.getElementById("partners-dest-pill");
    const statusEl = document.getElementById("partners-dest-status");

    if (iconEl)   iconEl.textContent   = item.icon;
    if (nameEl)   nameEl.textContent   = item.name;
    if (regionEl) regionEl.textContent = item.region;
    if (pillEl) {
      pillEl.className = "dest-status-pill " + item.status;
      if (statusEl) statusEl.textContent = item.statusLabel;
    }
  }

  // ── 1. Render Partners ─────────────────────────────────────────
  function renderPartners() {
    const listEl = document.getElementById("partners-container");
    if (!listEl) return;

    let filtered = data.partners || [];

    if (currentTab === "guide") {
      filtered = filtered.filter(p => p.type === "guide");
    } else if (currentTab === "porter") {
      filtered = filtered.filter(p => p.type === "porter");
    }

    if (selectedDest !== "semua") {
      filtered = filtered.filter(p => p.destinationId === selectedDest);
    }

    if (filtered.length === 0) {
      listEl.innerHTML = [
        '<div style="text-align:center;padding:32px 16px;color:var(--text-dim);">',
        '  <div style="font-size:32px;margin-bottom:8px;">\uD83D\uDD0D</div>',
        '  <p>Belum ada mitra terdaftar untuk filter ini.</p>',
        '</div>'
      ].join("");
      return;
    }

    listEl.innerHTML = filtered.map(function(p) {
      var initials = p.name.split(" ").map(function(n) { return n[0]; }).slice(0, 2).join("");
      var availBadge = p.available
        ? '<span class="badge badge--safe" style="font-size:9.5px;">Tersedia</span>'
        : '<span class="badge badge--warn" style="font-size:9.5px;">Bertugas</span>';
      return [
        '<div class="partner-card">',
        '  <div class="partner-header">',
        '    <div class="partner-avatar" style="background:' + p.avatarBg + ';">' + initials + '</div>',
        '    <div class="partner-info">',
        '      <div class="partner-name-row">',
        '        <span class="partner-name">' + p.name + '</span>',
        '        ' + availBadge,
        '      </div>',
        '      <div class="partner-role-tag">' + p.typeLabel + ' \u00B7 ' + p.badge + '</div>',
        '      <div class="partner-rating-row">',
        '        <span class="partner-stars">\u2B50 ' + p.rating + '</span>',
        '        <span>(' + p.reviewCount + ' ulasan)</span>',
        '        <span>\u00B7 ' + p.experience + '</span>',
        '      </div>',
        '    </div>',
        '  </div>',
        '  <p class="partner-bio">' + p.bio + '</p>',
        '  <div class="partner-meta-grid">',
        '    <div class="partner-meta-item">',
        '      <span class="meta-lbl">Lokasi Layanan</span>',
        '      <span class="meta-val">' + p.location + '</span>',
        '    </div>',
        '    <div class="partner-meta-item">',
        '      <span class="meta-lbl">Bahasa</span>',
        '      <span class="meta-val">' + p.languages.join(", ") + '</span>',
        '    </div>',
        '    <div class="partner-meta-item" style="grid-column:span 2;">',
        '      <span class="meta-lbl">Sertifikasi &amp; Lisensi</span>',
        '      <span class="meta-val">' + p.certifications.join(" \u00B7 ") + '</span>',
        '    </div>',
        '  </div>',
        '  <div class="partner-footer-row">',
        '    <div>',
        '      <div style="font-size:10px;color:var(--text-muted);">TARIF RESMI STANDAR</div>',
        '      <div class="partner-rate-tag">' + p.rate + '</div>',
        '    </div>',
        '    <button type="button" class="btn-contact-wa" onclick="openContactModal(\'' + p.name + '\',\'' + p.phone + '\',\'' + p.typeLabel + '\')">',
        '      <span>\uD83D\uDCAC</span> WhatsApp',
        '    </button>',
        '  </div>',
        '</div>'
      ].join("\n");
    }).join("\n");
  }

  // ── 2. Render Field Reports Feed ───────────────────────────────
  function renderFieldReports() {
    const feedEl = document.getElementById("reports-container");
    if (!feedEl) return;

    var filtered = data.fieldReports || [];
    if (selectedDest !== "semua") {
      filtered = filtered.filter(function(r) { return r.destinationId === selectedDest; });
    }

    feedEl.innerHTML = filtered.map(function(r) {
      var urgencyBadge = r.urgency === "danger"
        ? '<span class="badge badge--danger">' + r.urgencyLabel + '</span>'
        : (r.urgency === "warn"
            ? '<span class="badge badge--warn">' + r.urgencyLabel + '</span>'
            : '<span class="badge badge--safe">' + r.urgencyLabel + '</span>');
      var avatarIcon = r.verifiedReport ? "\uD83D\uDEE1\uFE0F" : "\uD83D\uDC64";
      var imageHtml = "";
      if (r.photoSrc) {
        imageHtml = '<div style="margin-top:10px;border-radius:8px;overflow:hidden;"><img src="' + r.photoSrc + '" alt="Foto Lapangan" style="width:100%;max-height:220px;object-fit:cover;border-radius:8px;display:block;"></div>';
      } else if (r.hasImage) {
        imageHtml = '<div class="report-image-mock"><span>\uD83D\uDCF7 ' + r.imagePlaceholder + '</span></div>';
      }

      return [
        '<div class="report-feed-card">',
        '  <div class="report-feed-header">',
        '    <div class="report-author-box">',
        '      <div style="width:32px;height:32px;border-radius:50%;background:var(--card-3);display:flex;align-items:center;justify-content:center;font-size:14px;">' + avatarIcon + '</div>',
        '      <div>',
        '        <div class="report-author-name">' + r.authorName + '</div>',
        '        <div class="report-author-role">' + r.authorRole + ' \u00B7 ' + r.destinationName + '</div>',
        '      </div>',
        '    </div>',
        '    ' + urgencyBadge,
        '  </div>',
        '  <h3 class="report-title">' + r.title + '</h3>',
        '  <p class="report-text">' + r.content + '</p>',
        '  ' + imageHtml,
        '  <div class="report-footer">',
        '    <span>\uD83D\uDD52 ' + r.time + '</span>',
        '    <button type="button" class="like-btn" onclick="toggleLike(this,' + r.likes + ')">',
        '      <span>\uD83D\uDC4D Terbantu</span> <span class="like-count">' + r.likes + '</span>',
        '    </button>',
        '  </div>',
        '</div>'
      ].join("\n");
    }).join("\n");
  }

  // Like Toggle
  window.toggleLike = function(btn, initialLikes) {
    var countEl = btn.querySelector(".like-count");
    if (btn.classList.contains("liked")) {
      btn.classList.remove("liked");
      countEl.textContent = initialLikes;
    } else {
      btn.classList.add("liked");
      countEl.textContent = initialLikes + 1;
    }
  };

  // ── MODAL MANAGEMENT ──────────────────────────────────────────
  var modalOverlay = document.getElementById("modal-overlay-partners");
  var destModal    = document.getElementById("partners-dest-modal");
  var waModal      = document.getElementById("contact-modal");
  var destTrigger  = document.getElementById("partners-dest-trigger");

  function closeAllModals() {
    document.querySelectorAll(".modal-sheet").forEach(function(sheet) {
      sheet.style.display = "none";
      sheet.style.height  = "";
      sheet.classList.remove("sheet--expanded");
    });
    if (modalOverlay) modalOverlay.style.display = "none";
  }

  // ── Destination Picker Bottom Sheet ───────────────────────────
  function renderDestPicker() {
    var listEl = document.getElementById("partners-dest-list");
    if (!listEl) return;

    listEl.innerHTML = destinationList.map(function(item) {
      var activeClass = item.id === selectedDest ? " active" : "";
      return [
        '<div class="dest-select-item' + activeClass + '" data-dest-id="' + item.id + '" role="button" tabindex="0">',
        '  <div class="dest-item-left">',
        '    <span class="dest-item-icon">' + item.icon + '</span>',
        '    <div class="dest-item-text">',
        '      <div class="dest-item-name">' + item.name + '</div>',
        '      <div class="dest-item-region">' + item.region + '</div>',
        '    </div>',
        '  </div>',
        '  <div class="dest-item-right">',
        '    <span class="dest-status-pill ' + item.status + '">',
        '      <span class="pill-dot">\u25CF</span> <span>' + item.statusLabel + '</span>',
        '    </span>',
        '  </div>',
        '</div>'
      ].join("\n");
    }).join("\n");

    listEl.querySelectorAll(".dest-select-item").forEach(function(itemEl) {
      itemEl.addEventListener("click", function() {
        var newDest = itemEl.getAttribute("data-dest-id");
        if (!newDest) return;
        selectedDest = newDest;
        if (destHiddenInput) destHiddenInput.value = newDest;
        updateDestCard(newDest);
        closeAllModals();
        renderPartners();
        renderFieldReports();

        try {
          var url = new URL(window.location.href);
          if (newDest === "semua") url.searchParams.delete("dest");
          else url.searchParams.set("dest", newDest);
          window.history.replaceState({}, "", url.toString());
        } catch (e) {}
      });

      itemEl.addEventListener("keydown", function(e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); itemEl.click(); }
      });
    });
  }

  // Open dest picker on card click
  if (destTrigger) {
    destTrigger.addEventListener("click", function() {
      renderDestPicker();
      if (destModal && modalOverlay) {
        destModal.style.display = "block";
        modalOverlay.style.display = "block";
        setTimeout(function() {
          var active = destModal.querySelector(".dest-select-item.active");
          if (active) active.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }, 40);
      }
    });

    destTrigger.addEventListener("keydown", function(e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); destTrigger.click(); }
    });
  }

  // ── Sheet Handle Drag & Expand (matching map.js) ───────────────
  function setupSheetDragHandles() {
    document.querySelectorAll(".modal-sheet").forEach(function(sheet) {
      var handle = sheet.querySelector(".sheet-handle");
      if (!handle) return;

      var phStartY = 0, phStartH = 0, phDragging = false, hasMoved = false;

      function onStart(clientY) {
        phDragging = true; hasMoved = false;
        phStartY = clientY; phStartH = sheet.offsetHeight;
        sheet.style.transition = "none";
      }
      function onMove(clientY) {
        if (!phDragging) return;
        var delta = phStartY - clientY;
        if (Math.abs(delta) > 4) hasMoved = true;
        var newH = Math.max(100, Math.min(window.innerHeight * 0.90, phStartH + delta));
        sheet.style.height = newH + "px";
      }
      function onEnd() {
        if (!phDragging) return;
        phDragging = false;
        sheet.style.transition = "";
        var h = sheet.offsetHeight;
        if (h < Math.min(220, phStartH * 0.65) || phStartH - h > 90) {
          sheet.style.height = "";
          sheet.classList.remove("sheet--expanded");
          closeAllModals();
        } else if (h > window.innerHeight * 0.60) {
          sheet.classList.add("sheet--expanded");
          sheet.style.height = "";
        } else {
          sheet.classList.remove("sheet--expanded");
          sheet.style.height = "";
        }
      }

      handle.addEventListener("click", function() {
        if (hasMoved) return;
        sheet.classList.toggle("sheet--expanded");
        sheet.style.height = "";
      });
      handle.addEventListener("mousedown", function(e) { onStart(e.clientY); });
      document.addEventListener("mousemove", function(e) { if (phDragging) onMove(e.clientY); });
      document.addEventListener("mouseup", function() { onEnd(); });
      handle.addEventListener("touchstart", function(e) { onStart(e.touches[0].clientY); }, { passive: true });
      handle.addEventListener("touchmove",  function(e) { onMove(e.touches[0].clientY); },  { passive: true });
      handle.addEventListener("touchend",   function() { onEnd(); });
    });
  }

  // ── WhatsApp Contact Modal ─────────────────────────────────────
  window.openContactModal = function(name, phone, role) {
    if (!waModal) return;
    var nameEl  = document.getElementById("modal-contact-name");
    var roleEl  = document.getElementById("modal-contact-role");
    var phoneEl = document.getElementById("modal-contact-phone");
    if (nameEl)  nameEl.textContent  = name;
    if (roleEl)  roleEl.textContent  = role;
    if (phoneEl) phoneEl.textContent = phone;

    var sendBtn = document.getElementById("btn-send-wa");
    if (sendBtn) {
      sendBtn.onclick = function() {
        alert("Membuka simulasi WhatsApp ke " + name + " (" + phone + "). Pesan keselamatan siap dikirim.");
        closeAllModals();
      };
    }
    waModal.style.display = "block";
    if (modalOverlay) modalOverlay.style.display = "block";
  };

  var btnCloseContact = document.getElementById("btn-close-contact");
  if (btnCloseContact) btnCloseContact.addEventListener("click", closeAllModals);
  if (modalOverlay) modalOverlay.addEventListener("click", closeAllModals);

  // ── Tab Switching ──────────────────────────────────────────────
  tabs.forEach(function(tab) {
    tab.addEventListener("click", function() {
      tabs.forEach(function(t) { t.classList.remove("active"); });
      tab.classList.add("active");
      currentTab = tab.getAttribute("data-tab");

      if (currentTab === "laporan") {
        if (partnersSection) partnersSection.style.display = "none";
        if (reportsSection)  reportsSection.style.display  = "block";
        renderFieldReports();
      } else {
        if (partnersSection) partnersSection.style.display = "block";
        if (reportsSection)  reportsSection.style.display  = "none";
        renderPartners();
      }
    });
  });

  // ── Field Report Form Interactions ────────────────────────────
  var reportForm       = document.getElementById("new-report-form");
  var reportModal      = document.getElementById("new-report-modal");
  var btnOpenReport    = document.getElementById("btn-open-report-modal");
  var btnCloseReport   = document.getElementById("btn-close-report-modal");
  var photoZone        = document.getElementById("photo-upload-zone");
  var photoInput       = document.getElementById("report-photo");
  var photoPreview     = document.getElementById("photo-preview-wrap");
  var photoImg         = document.getElementById("photo-preview-img");
  var photoPlaceholder = document.getElementById("photo-upload-placeholder");
  var btnRemovePhoto   = document.getElementById("btn-remove-photo");
  var radioCards       = document.querySelectorAll(".status-toggle-card");

  if (btnOpenReport) {
    btnOpenReport.addEventListener("click", function() {
      if (reportModal) reportModal.style.display = "block";
      if (modalOverlay) modalOverlay.style.display = "block";
    });
  }

  if (btnCloseReport) {
    btnCloseReport.addEventListener("click", closeAllModals);
  }

  // Radio button active styling sync
  function syncStatusRadios() {
    radioCards.forEach(function(card) {
      var radio = card.querySelector("input[type='radio']");
      if (radio && radio.checked) {
        card.classList.add("is-active");
      } else {
        card.classList.remove("is-active");
      }
    });
  }

  radioCards.forEach(function(card) {
    var radio = card.querySelector("input[type='radio']");
    if (radio) {
      radio.addEventListener("change", syncStatusRadios);
    }
  });
  syncStatusRadios();

  // Photo upload click & preview
  if (photoZone && photoInput) {
    photoZone.addEventListener("click", function(e) {
      if (e.target.closest("#btn-remove-photo")) return;
      photoInput.click();
    });

    photoInput.addEventListener("change", function() {
      var file = photoInput.files && photoInput.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          alert("Ukuran file melebihi 5 MB. Silakan pilih foto lain yang lebih kecil.");
          photoInput.value = "";
          return;
        }
        var reader = new FileReader();
        reader.onload = function(evt) {
          if (photoImg && photoPreview && photoPlaceholder) {
            photoImg.src = evt.target.result;
            photoPreview.style.display = "block";
            photoPlaceholder.style.display = "none";
          }
        };
        reader.readAsDataURL(file);
      }
    });

    if (btnRemovePhoto) {
      btnRemovePhoto.addEventListener("click", function(e) {
        e.stopPropagation();
        photoInput.value = "";
        if (photoImg) photoImg.src = "";
        if (photoPreview) photoPreview.style.display = "none";
        if (photoPlaceholder) photoPlaceholder.style.display = "flex";
      });
    }
  }

  // Submit Handler
  if (reportForm) {
    reportForm.addEventListener("submit", function(e) {
      e.preventDefault();
      var locationVal = document.getElementById("report-dest") ? document.getElementById("report-dest").value.trim() : "";
      var urgencyEl   = document.querySelector("input[name='report-urgency']:checked");
      var urgencyVal  = urgencyEl ? urgencyEl.value : "warn";
      var titleVal    = document.getElementById("report-title") ? document.getElementById("report-title").value.trim() : "";
      var contentVal  = document.getElementById("report-content") ? document.getElementById("report-content").value.trim() : "";
      var hasCustomPhoto = photoImg && photoImg.src && photoImg.src.startsWith("data:image");

      var urgencyBadgeLabel = urgencyVal === "danger" 
        ? "DITUTUP SEMENTARA" 
        : (urgencyVal === "warn" ? "PERHATIAN JALUR" : "KONDISI AMAN");

      data.fieldReports.unshift({
        id:              "rep_" + Date.now(),
        destinationId:   selectedDest !== "semua" ? selectedDest : "rinjani",
        destinationName: locationVal || "Lokasi Lapangan",
        urgency:         urgencyVal,
        urgencyLabel:    urgencyBadgeLabel,
        authorName:      "Arya Pratama (Anda)",
        authorRole:      "Laporan Terverifikasi",
        time:            "Baru saja",
        title:           titleVal,
        content:         contentVal,
        hasImage:        Boolean(hasCustomPhoto),
        imagePlaceholder: hasCustomPhoto ? "📷 Foto Lapangan Terlampir" : "",
        photoSrc:        hasCustomPhoto ? photoImg.src : null,
        likes:           1,
        verifiedReport:  true
      });

      reportForm.reset();
      if (btnRemovePhoto) {
        photoInput.value = "";
        if (photoImg) photoImg.src = "";
        if (photoPreview) photoPreview.style.display = "none";
        if (photoPlaceholder) photoPlaceholder.style.display = "flex";
      }
      syncStatusRadios();
      closeAllModals();

      var laporanTab = document.querySelector(".tab-btn[data-tab='laporan']");
      if (laporanTab) {
        laporanTab.click();
      } else {
        renderFieldReports();
      }
      alert("\u2705 Laporan status lapangan Anda berhasil diunggah!");
    });
  }

  // ── Initial Render ─────────────────────────────────────────────
  renderPartners();
  setupSheetDragHandles();
});
