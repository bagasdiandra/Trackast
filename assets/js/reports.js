/**
 * REPORTS.JS — TrackCast AI Safety Recommendations & User Reports
 */

document.addEventListener("DOMContentLoaded", () => {
  const data = window.TrackCastData;
  if (!data) return;

  const destSelect = document.getElementById("recom-dest-select");
  let activeDestId = "rinjani";

  // Check URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const destParam = urlParams.get("dest");
  if (destParam && destSelect) {
    activeDestId = destParam;
    destSelect.value = destParam;
  }

  // 1. Render AI Safety Recommendations
  function renderRecommendations() {
    const recData = data.safetyRecommendations[activeDestId] || {
      status: "aman",
      score: 88,
      recommendationSummary: "Kondisi Sangat Aman untuk Berwisata",
      primaryRisk: "Fluktuasi Suhu & Terik Matahari",
      aiRationale: "Prakiraan cuaca BMKG cerah berawan dan tidak ada riwayat laporan risiko dalam 48 jam terakhir.",
      mustHaves: [
        "Kacamata hitam & tabir surya UV protector",
        "Air minum minimal 1.5 liter",
        "Topi atau pelindung kepala"
      ],
      actionPlan: [
        "Lakukan aktivitas di pagi atau sore hari untuk kenyamanan optimal.",
        "Patuhi papan petunjuk jalur resmi."
      ]
    };

    const destObj = data.destinations.find(d => d.id === activeDestId) || { name: "Destinasi Terpilih", statusLabel: "AMAN" };

    const scoreColor = recData.score < 40 ? "var(--danger)" : (recData.score < 75 ? "var(--warn)" : "var(--safe)");

    const recContainer = document.getElementById("ai-recommendation-container");
    if (recContainer) {
      recContainer.innerHTML = `
        <div class="ai-score-card">
          <div class="ai-card-top">
            <span class="badge badge--ai">⚡ AI SMART SAFETY ENGINE</span>
            <div class="ai-score-display">
              <span class="score-num" style="color: ${scoreColor};">${recData.score}</span>
              <span class="score-max">/100</span>
            </div>
          </div>

          <div class="ai-summary-text">${recData.recommendationSummary}</div>

          <div class="ai-risk-banner">
            <span>⚠️</span>
            <span>Risiko Utama: ${recData.primaryRisk}</span>
          </div>

          <div class="ai-rationale-box">
            <strong style="color: var(--text); display: block; margin-bottom: 2px;">Dasar Analisis AI:</strong>
            ${recData.aiRationale}
          </div>

          <!-- Must-haves -->
          <div class="checklist-group">
            <div style="font-size: 13px; font-weight: 700; color: var(--text); margin-bottom: 8px;">
              🎒 Perlengkapan Wajib Kondisi Ini:
            </div>
            ${recData.mustHaves.map(item => `
              <div class="check-item">
                <span class="check-icon">✓</span>
                <span>${item}</span>
              </div>
            `).join("")}
          </div>

          <!-- Action Plan -->
          <div>
            <div style="font-size: 13px; font-weight: 700; color: var(--text); margin-bottom: 8px;">
              🛡️ Rekomendasi Langkah Mitigasi:
            </div>
            ${recData.actionPlan.map((step, idx) => `
              <div class="action-step-item">
                <div class="step-circle">${idx + 1}</div>
                <div>${step}</div>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }
  }

  // 2. User Reviews Mock Data & Rendering
  const userReviews = [
    {
      id: "rev_1",
      destId: "rinjani",
      author: "Reza Fahlevi",
      rating: 5,
      date: "Kemarin",
      comment: "Informasi TrackCast sangat akurat! Kemarin sempat hujan badai di pos 3 dan rekomendasi membawa dry bag benar-benar menyelamatkan perlengkapan kami."
    },
    {
      id: "rev_2",
      destId: "rinjani",
      author: "Siti Rahmawati",
      rating: 4,
      date: "3 hari yang lalu",
      comment: "Jalur Plawangan anginnya luar biasa kencang. Pastikan pasak tenda dobel dan sewa porter lokal Pak Hasan, sangat membantu!"
    },
    {
      id: "rev_3",
      destId: "bromo",
      author: "Kenjiro Tanaka",
      rating: 5,
      date: "2 hari yang lalu",
      comment: "Lautan pasir pagi sangat dingin 8°C. Masker dan jaket tebal wajib disiapkan karena debu vulkanik beterbangan saat angin."
    }
  ];

  function renderReviews() {
    const listEl = document.getElementById("user-reviews-list");
    if (!listEl) return;

    const filtered = userReviews.filter(r => r.destId === activeDestId);

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div style="text-align: center; padding: 24px; color: var(--text-dim); font-size: 13px;">
          Belum ada ulasan wisatawan untuk destinasi ini. Jadilah yang pertama berbagi pengalaman!
        </div>
      `;
      return;
    }

    listEl.innerHTML = filtered.map(r => `
      <div class="review-card">
        <div class="review-author-row">
          <span class="review-author-name">${r.author}</span>
          <span class="review-date">${r.date}</span>
        </div>
        <div class="review-rating-stars">${"⭐".repeat(r.rating)}</div>
        <p class="review-text">${r.comment}</p>
      </div>
    `).join("");
  }

  // Destination Change Handler
  if (destSelect) {
    destSelect.addEventListener("change", (e) => {
      activeDestId = e.target.value;
      renderRecommendations();
      renderReviews();
    });
  }

  // Modals & Overlay Handlers
  const reviewModal = document.getElementById("add-review-modal");
  const reportModal = document.getElementById("new-report-modal");
  const modalOverlay = document.getElementById("modal-overlay-reports");
  const reviewForm = document.getElementById("add-review-form");
  const reportForm = document.getElementById("new-report-form");

  function closeAllModals() {
    if (reviewModal) reviewModal.style.display = "none";
    if (reportModal) reportModal.style.display = "none";
    if (modalOverlay) modalOverlay.style.display = "none";
  }

  // Open & Close Review Modal
  document.getElementById("btn-open-review-modal")?.addEventListener("click", () => {
    if (reviewModal) reviewModal.style.display = "block";
    if (modalOverlay) modalOverlay.style.display = "block";
  });

  document.getElementById("btn-close-review-modal")?.addEventListener("click", closeAllModals);

  // Open & Close Field Report Modal
  document.getElementById("btn-open-report-modal")?.addEventListener("click", () => {
    if (reportModal) reportModal.style.display = "block";
    if (modalOverlay) modalOverlay.style.display = "block";
  });

  document.getElementById("btn-close-report-modal")?.addEventListener("click", closeAllModals);

  if (modalOverlay) modalOverlay.addEventListener("click", closeAllModals);

  // Submit Review Form
  if (reviewForm) {
    reviewForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const rating = parseInt(document.getElementById("review-rating").value, 10);
      const text = document.getElementById("review-text-input").value;

      userReviews.unshift({
        id: "rev_" + Date.now(),
        destId: activeDestId,
        author: "Arya Pratama (Anda)",
        rating: rating,
        date: "Baru saja",
        comment: text
      });

      reviewForm.reset();
      closeAllModals();
      renderReviews();
      alert("✅ Ulasan perjalanan Anda berhasil dipublikasikan!");
    });
  }

  // Submit Field Report Form
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

      if (!data.fieldReports) data.fieldReports = [];
      data.fieldReports.unshift(newReport);

      reportForm.reset();
      closeAllModals();
      alert("✅ Laporan pembaruan lapangan Anda berhasil dikirim dan diverifikasi!");
    });
  }

  // Initial render
  renderRecommendations();
  renderReviews();
});
