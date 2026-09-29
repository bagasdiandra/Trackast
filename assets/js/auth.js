/**
 * AUTH.JS — TrackCast Authentication Logic
 * Supports Login, Register (Email vs Username), Password Validation, and SSO Simulation
 */

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const btnMethodEmail = document.getElementById("btn-method-email");
  const btnMethodUsername = document.getElementById("btn-method-username");
  const emailInputGroup = document.getElementById("group-email");
  const usernameInputGroup = document.getElementById("group-username");
  const passwordGroup = document.getElementById("group-password");
  const forgotWrap = document.getElementById("wrap-forgot");
  const togglePwdBtn = document.getElementById("toggle-pwd");
  const pwdInput = document.getElementById("input-password");
  const togglePwdConfirmBtn = document.getElementById("toggle-pwd-confirm");
  const pwdConfirmInput = document.getElementById("input-password-confirm");
  const checkTerms = document.getElementById("check-terms");

  const authForm = document.getElementById("auth-form");
  const authTitle = document.getElementById("auth-subtitle");
  const submitBtn = document.getElementById("btn-submit");
  const switchModeLink = document.getElementById("switch-auth-mode");
  const authFooterText = document.getElementById("auth-footer-prompt");
  const forgotLink = document.getElementById("link-forgot");
  const googleBtn = document.getElementById("btn-google");

  // State: check URL query or default to "register" as requested
  const urlParams = new URLSearchParams(window.location.search);
  let currentMethod = "email"; // "email" | "username"
  let currentMode = urlParams.get("mode") === "register" ? "register" : "login";
  let selectedRole = "wisatawan"; // Default role

  // Method Toggle (Email vs Username)
  if (btnMethodEmail && btnMethodUsername) {
    btnMethodEmail.addEventListener("click", () => {
      currentMethod = "email";
      btnMethodEmail.classList.add("active");
      btnMethodEmail.setAttribute("aria-selected", "true");
      btnMethodUsername.classList.remove("active");
      btnMethodUsername.setAttribute("aria-selected", "false");
      if (emailInputGroup) emailInputGroup.style.display = "block";
      if (usernameInputGroup) usernameInputGroup.style.display = "none";
    });

    btnMethodUsername.addEventListener("click", () => {
      currentMethod = "username";
      btnMethodUsername.classList.add("active");
      btnMethodUsername.setAttribute("aria-selected", "true");
      btnMethodEmail.classList.remove("active");
      btnMethodEmail.setAttribute("aria-selected", "false");
      if (emailInputGroup) emailInputGroup.style.display = "none";
      if (usernameInputGroup) usernameInputGroup.style.display = "block";
    });
  }

  // Password Visibility Toggle with Smart Animation
  function setupPasswordToggle(btn, input) {
    if (!btn || !input) return;
    btn.addEventListener("click", () => {
      const willShow = input.type === "password";
      input.type = willShow ? "text" : "password";

      btn.classList.toggle("is-active", willShow);
      const labelText = willShow ? "Sembunyikan kata sandi" : "Tampilkan kata sandi";
      btn.setAttribute("aria-label", labelText);
      btn.setAttribute("title", labelText);

      // Trigger smart pulse micro-animation
      btn.classList.remove("pwd-animating");
      void btn.offsetWidth; // Force reflow
      btn.classList.add("pwd-animating");
    });
  }

  setupPasswordToggle(togglePwdBtn, pwdInput);
  setupPasswordToggle(togglePwdConfirmBtn, pwdConfirmInput);

  // Switch between Login and Register
  if (switchModeLink) {
    switchModeLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentMode === "login") {
        setMode("register");
      } else {
        setMode("login");
      }
    });
  }

  // Forgot Password Click
  if (forgotLink) {
    forgotLink.addEventListener("click", (e) => {
      e.preventDefault();
      alert("Tautan pemulihan kata sandi telah dikirimkan ke kontak Anda.");
    });
  }

  function setMode(mode) {
    currentMode = mode;
    const registerFields = document.querySelectorAll(".register-only");
    const loginOnlyFields = document.querySelectorAll(".login-only");

    if (mode === "register") {
      document.title = "TrackCast — Buat Akun Baru";
      authTitle.textContent = "Daftar Akun Baru";
      submitBtn.textContent = "Buat Akun";
      authFooterText.textContent = "Sudah punya akun?";
      switchModeLink.textContent = "Masuk";
      if (pwdInput) pwdInput.placeholder = "Min. 8 karakter";

      registerFields.forEach(el => el.style.display = "block");
      loginOnlyFields.forEach(el => el.style.display = "none");
    } else {
      // login
      document.title = "TrackCast — Masuk ke Akun Anda";
      authTitle.textContent = "Masuk ke akun Anda";
      submitBtn.textContent = "Masuk";
      authFooterText.textContent = "Belum punya akun?";
      switchModeLink.textContent = "Daftar Sekarang";
      if (pwdInput) pwdInput.placeholder = "Masukkan kata sandi";

      registerFields.forEach(el => el.style.display = "none");
      loginOnlyFields.forEach(el => el.style.display = "block");
      if (forgotWrap) forgotWrap.style.display = "flex";
    }

    // Preserve active method visibility
    if (currentMethod === "email") {
      if (emailInputGroup) emailInputGroup.style.display = "block";
      if (usernameInputGroup) usernameInputGroup.style.display = "none";
    } else {
      if (emailInputGroup) emailInputGroup.style.display = "none";
      if (usernameInputGroup) usernameInputGroup.style.display = "block";
    }
  }

  // Initialize initial mode (default: register)
  setMode(currentMode);

  // Submit Handler
  if (authForm) {
    authForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameVal = document.getElementById("input-name")?.value.trim() || "";
      const emailVal = document.getElementById("input-email")?.value.trim() || "";
      const usernameVal = document.getElementById("input-username")?.value.trim() || "";
      const pwdVal = pwdInput ? pwdInput.value : "";
      const pwdConfirmVal = pwdConfirmInput ? pwdConfirmInput.value : "";

      if (currentMode === "register") {
        if (!nameVal) {
          alert("Silakan masukkan nama lengkap Anda.");
          document.getElementById("input-name")?.focus();
          return;
        }

        if (currentMethod === "email" && !emailVal) {
          alert("Silakan masukkan alamat email yang valid.");
          document.getElementById("input-email")?.focus();
          return;
        }

        if (currentMethod === "username" && !usernameVal) {
          alert("Silakan masukkan username pilihan Anda.");
          document.getElementById("input-username")?.focus();
          return;
        }

        if (pwdVal.length < 8) {
          alert("Kata sandi minimal harus 8 karakter.");
          pwdInput?.focus();
          return;
        }

        if (pwdVal !== pwdConfirmVal) {
          alert("Konfirmasi kata sandi tidak cocok. Silakan ulangi kata sandi Anda.");
          pwdConfirmInput?.focus();
          return;
        }

        if (checkTerms && !checkTerms.checked) {
          alert("Anda harus menyetujui Syarat & Ketentuan serta Kebijakan Privasi TrackCast untuk melanjutkan.");
          checkTerms.focus();
          return;
        }
      }

      // Simulate Auth Success
      submitBtn.disabled = true;
      submitBtn.textContent = currentMode === "register" ? "Membuat Akun..." : "Memverifikasi...";

      setTimeout(() => {
        const userObj = {
          id: "usr_" + Date.now().toString().slice(-4),
          name: nameVal || (usernameVal ? `@${usernameVal}` : "Arya Pratama"),
          email: currentMethod === "email" ? (emailVal || "arya.pratama@gmail.com") : `${usernameVal || 'user'}@trackcast.id`,
          username: usernameVal || (emailVal ? emailVal.split("@")[0] : "pengguna"),
          role: selectedRole
        };

        if (window.TrackCastStorage) {
          window.TrackCastStorage.setLoggedIn(true, userObj);
        }

        window.location.href = "index.html";
      }, 700);
    });
  }

  // Google Login Simulation
  if (googleBtn) {
    googleBtn.addEventListener("click", () => {
      googleBtn.disabled = true;
      googleBtn.innerHTML = `<span>⏳ Menghubungkan Google...</span>`;
      setTimeout(() => {
        if (window.TrackCastStorage) {
          window.TrackCastStorage.setLoggedIn(true, {
            id: "usr_google",
            name: "Arya Pratama (Google)",
            email: "arya.pratama@gmail.com",
            role: "wisatawan"
          });
        }
        window.location.href = "index.html";
      }, 600);
    });
  }
});

