/**
 * API.JS — TrackCast API Client
 * Jembatan komunikasi antara Frontend (HTML/JS) dan Backend FastAPI (localhost:8000)
 *
 * Semua endpoint Auth Service, Weather Map, dan Destinations dipanggil dari sini.
 */

const TrackCastAPI = (() => {
  const RAILWAY_URL = "https://web-production-c7dcb.up.railway.app";
  // Gunakan domain Railway jika di hosting/firebase, atau localhost jika dibuka lokal (opsional tetap Railway jika ingin selalu online)
  const BASE_API_URL = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? (localStorage.getItem("use_local_api") === "true" ? "http://localhost:8000" : RAILWAY_URL)
    : RAILWAY_URL;
  const BASE_URL = `${BASE_API_URL}/api`;

  // ─── Helpers ──────────────────────────────────────────────────────────────

  function getToken() {
    try {
      return JSON.parse(localStorage.getItem("trackcast_access_token")) || null;
    } catch {
      return null;
    }
  }

  function setTokens(accessToken, refreshToken) {
    localStorage.setItem("trackcast_access_token", JSON.stringify(accessToken));
    localStorage.setItem("trackcast_refresh_token", JSON.stringify(refreshToken));
  }

  function clearTokens() {
    localStorage.removeItem("trackcast_access_token");
    localStorage.removeItem("trackcast_refresh_token");
  }

  async function request(path, options = {}) {
    const token = getToken();
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };

    try {
      const response = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.detail || `Error ${response.status}`;
        throw new Error(typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg));
      }

      return data;
    } catch (err) {
      // Bedakan network error dan API error
      if (err instanceof TypeError && err.message.includes("fetch")) {
        throw new Error("Tidak dapat terhubung ke server backend TrackCast. Pastikan server berjalan di localhost:8000.");
      }
      throw err;
    }
  }

  // ─── Auth Service ─────────────────────────────────────────────────────────

  async function register({ full_name, email, username, password, phone_e164, role }) {
    const body = { full_name, password, role: role || "wisatawan" };
    if (email) body.email = email;
    if (username) body.username = username;
    if (phone_e164) body.phone_e164 = phone_e164;

    const data = await request("/auth/register", {
      method: "POST",
      body: JSON.stringify(body)
    });
    setTokens(data.access_token, data.refresh_token);
    TrackCastStorage.setLoggedIn(true, data.user);
    return data;
  }

  async function login({ identifier, password }) {
    const data = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ identifier, password })
    });
    setTokens(data.access_token, data.refresh_token);
    TrackCastStorage.setLoggedIn(true, data.user);
    return data;
  }

  async function logout() {
    try {
      await request("/auth/logout", { method: "POST" });
    } finally {
      clearTokens();
      TrackCastStorage.setLoggedIn(false);
    }
  }

  async function getMe() {
    return await request("/auth/me");
  }

  async function refreshAccessToken() {
    const refreshToken = (() => {
      try {
        return JSON.parse(localStorage.getItem("trackcast_refresh_token"));
      } catch {
        return null;
      }
    })();

    if (!refreshToken) throw new Error("Refresh token tidak ada. Silakan login ulang.");

    const data = await request("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken })
    });
    setTokens(data.access_token, data.refresh_token);
    return data;
  }

  // ─── Destinations & Map ───────────────────────────────────────────────────

  async function getDestinations({ category, status, search } = {}) {
    const params = new URLSearchParams();
    if (category && category !== "semua") params.append("category", category);
    if (status && status !== "semua") params.append("status", status);
    if (search) params.append("search", search);

    const query = params.toString() ? `?${params}` : "";
    return await request(`/destinations${query}`);
  }

  async function getDestinationDetail(slug) {
    return await request(`/destinations/${slug}`);
  }

  async function getDestinationWeather(slug) {
    return await request(`/destinations/${slug}/weather`);
  }

  async function getWeatherByCoords(lat, lon) {
    return await request(`/weather/current?lat=${lat}&lon=${lon}`);
  }

  async function getMapCells() {
    return await request("/map/cells");
  }

  // ─── Health Check ─────────────────────────────────────────────────────────

  async function checkHealth() {
    try {
      const res = await fetch(`${BASE_API_URL}/health`);
      return res.ok;
    } catch {
      return false;
    }
  }

  // ─── Public API ───────────────────────────────────────────────────────────

  return {
    auth: { register, login, logout, getMe, refreshAccessToken },
    destinations: { getAll: getDestinations, getDetail: getDestinationDetail, getWeather: getDestinationWeather },
    weather: { getByCoords: getWeatherByCoords },
    map: { getCells: getMapCells },
    utils: { checkHealth, getToken, clearTokens }
  };
})();

window.TrackCastAPI = TrackCastAPI;
