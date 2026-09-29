/**
 * LANDING.JS — TrackCast Splash Interactivity
 */

document.addEventListener("DOMContentLoaded", () => {
  const btnStart = document.getElementById("btn-start");
  
  // If user is already logged in, adapt button text
  if (window.TrackCastStorage && window.TrackCastStorage.isLoggedIn()) {
    if (btnStart) {
      btnStart.textContent = "Buka Beranda";
      btnStart.href = "index.html";
    }
  }

  // Optional subtle gyro or mouse tilt effect on logo
  const logoBox = document.querySelector(".logo-box");
  if (logoBox && window.matchMedia("(hover: hover)").matches) {
    document.addEventListener("mousemove", (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);
      logoBox.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-2px)`;
    });
  }
});
