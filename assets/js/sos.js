/**
 * SOS.JS — TrackCast Emergency Activation & Dispatch Simulation
 */

document.addEventListener("DOMContentLoaded", () => {
  const data = window.TrackCastData;
  if (!data) return;

  const btnTriggerSos = document.getElementById("btn-trigger-sos");
  const countdownOverlay = document.getElementById("countdown-overlay");
  const countdownNumber = document.getElementById("countdown-number");
  const btnCancelCountdown = document.getElementById("btn-cancel-countdown");

  const defaultSosView = document.getElementById("sos-default-view");
  const dispatchedSosView = document.getElementById("sos-dispatched-view");
  const hotlinesContainer = document.getElementById("hotlines-container");

  let countdownTimer = null;
  let secondsRemaining = 5;

  // 1. Render Hotlines
  if (hotlinesContainer && data.emergencyHotlines) {
    hotlinesContainer.innerHTML = data.emergencyHotlines.map(h => `
      <div class="hotline-card">
        <div class="hotline-info">
          <div class="hotline-icon">${h.icon}</div>
          <div>
            <div class="hotline-name">${h.name}</div>
            <div class="hotline-desc">${h.desc}</div>
          </div>
        </div>
        <a href="tel:${h.number.replace(/\s+/g, '')}" class="btn-call-hotline">
          <span>📞</span> ${h.number}
        </a>
      </div>
    `).join("");
  }

  // 2. Start Countdown
  if (btnTriggerSos) {
    btnTriggerSos.addEventListener("click", () => {
      secondsRemaining = 5;
      if (countdownNumber) countdownNumber.textContent = secondsRemaining;
      if (countdownOverlay) countdownOverlay.style.display = "flex";

      // Vibrate if mobile supported
      if (navigator.vibrate) navigator.vibrate([150, 100, 150]);

      countdownTimer = setInterval(() => {
        secondsRemaining--;
        if (countdownNumber) countdownNumber.textContent = secondsRemaining;

        if (navigator.vibrate) navigator.vibrate(100);

        if (secondsRemaining <= 0) {
          clearInterval(countdownTimer);
          triggerEmergencyDispatch();
        }
      }, 1000);
    });
  }

  // 3. Cancel Countdown
  if (btnCancelCountdown) {
    btnCancelCountdown.addEventListener("click", () => {
      if (countdownTimer) clearInterval(countdownTimer);
      if (countdownOverlay) countdownOverlay.style.display = "none";
    });
  }

  // 4. Trigger Emergency Dispatch Action
  function triggerEmergencyDispatch() {
    if (countdownOverlay) countdownOverlay.style.display = "none";
    if (defaultSosView) defaultSosView.style.display = "none";
    if (dispatchedSosView) dispatchedSosView.style.display = "block";

    // Play alert sound if audio context allowed or strong vibration
    if (navigator.vibrate) navigator.vibrate([400, 200, 400, 200, 600]);

    // Populate dynamic details
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')} WITA`;
    
    document.getElementById("sos-event-id").textContent = `SOS-2026-NTB-${Math.floor(100 + Math.random() * 900)}`;
    document.getElementById("sos-time-stamp").textContent = timeStr;
    document.getElementById("sos-gps-coords").textContent = "-8.4113° S, 116.4573° E (Gunung Rinjani)";
  }

  // Reset SOS (for demonstration purposes)
  document.getElementById("btn-reset-sos")?.addEventListener("click", () => {
    if (dispatchedSosView) dispatchedSosView.style.display = "none";
    if (defaultSosView) defaultSosView.style.display = "block";
  });
});
