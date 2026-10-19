import httpx
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from fastapi import HTTPException
from app.core.config import settings

class WeatherService:
    def __init__(self):
        self.api_key = settings.OPENWEATHER_API_KEY
        self.base_url = settings.OPENWEATHER_BASE_URL

    async def fetch_current_weather(self, lat: float, lon: float) -> Dict[str, Any]:
        """Memanggil OpenWeatherMap API untuk data cuaca real-time saat ini."""
        if not self.api_key or self.api_key == "YOUR_OPENWEATHERMAP_API_KEY":
            raise HTTPException(
                status_code=500,
                detail="OPENWEATHER_API_KEY belum dikonfigurasi di file .env backend."
            )

        url = f"{self.base_url}/weather"
        params = {
            "lat": lat,
            "lon": lon,
            "appid": self.api_key,
            "units": "metric",
            "lang": "id"
        }

        async with httpx.AsyncClient(timeout=10.0) as client:
            try:
                response = await client.get(url, params=params)
            except httpx.RequestError as exc:
                raise HTTPException(
                    status_code=502,
                    detail=f"Gagal menghubungi server OpenWeatherMap: {str(exc)}"
                )

        if response.status_code != 200:
            error_data = response.json()
            raise HTTPException(
                status_code=response.status_code,
                detail=f"OpenWeatherMap API Error: {error_data.get('message', 'Unknown error')}"
            )

        data = response.json()
        return self._format_current_weather(data, lat, lon)

    async def fetch_forecast(self, lat: float, lon: float) -> List[Dict[str, Any]]:
        """Memanggil OpenWeatherMap API 5 Day / 3 Hour Forecast."""
        if not self.api_key or self.api_key == "YOUR_OPENWEATHERMAP_API_KEY":
            return []

        url = f"{self.base_url}/forecast"
        params = {
            "lat": lat,
            "lon": lon,
            "appid": self.api_key,
            "units": "metric",
            "lang": "id"
        }

        async with httpx.AsyncClient(timeout=10.0) as client:
            try:
                response = await client.get(url, params=params)
                if response.status_code == 200:
                    data = response.json()
                    hourly_list = []
                    # Ambil 8 interval pertama (24 jam ke depan)
                    for item in data.get("list", [])[:8]:
                        dt = datetime.fromtimestamp(item.get("dt", 0), tz=timezone.utc)
                        weather_item = item.get("weather", [{}])[0]
                        pop = int((item.get("pop", 0) or 0) * 100) # probability of precipitation
                        hourly_list.append({
                            "time": dt.strftime("%H:%M"),
                            "timestamp": item.get("dt"),
                            "temperature_c": round(item.get("main", {}).get("temp", 0), 1),
                            "condition": weather_item.get("description", "Normal").title(),
                            "icon": weather_item.get("icon", "01d"),
                            "rain_probability_pct": pop
                        })
                    return hourly_list
            except Exception:
                pass
        return []

    def _format_current_weather(self, data: Dict[str, Any], lat: float, lon: float) -> Dict[str, Any]:
        main = data.get("main", {})
        wind = data.get("wind", {})
        weather_arr = data.get("weather", [{}])
        weather_first = weather_arr[0] if weather_arr else {}
        rain = data.get("rain", {})

        # Konversi m/s ke km/jam
        wind_speed_ms = wind.get("speed", 0.0)
        wind_kph = round(wind_speed_ms * 3.6, 1)

        return {
            "location": data.get("name", f"Lokasi ({lat}, {lon})"),
            "latitude": lat,
            "longitude": lon,
            "temperature_c": round(main.get("temp", 0), 1),
            "feels_like_c": round(main.get("feels_like", 0), 1),
            "temp_min_c": round(main.get("temp_min", 0), 1),
            "temp_max_c": round(main.get("temp_max", 0), 1),
            "humidity_pct": int(main.get("humidity", 0)),
            "wind_kph": wind_kph,
            "wind_direction_deg": wind.get("deg"),
            "pressure_hpa": main.get("pressure"),
            "condition": weather_first.get("main", "Clear"),
            "condition_description": weather_first.get("description", "Cerah").title(),
            "condition_icon": weather_first.get("icon", "01d"),
            "rain_1h_mm": rain.get("1h", 0.0) if isinstance(rain, dict) else 0.0,
            "visibility_km": round(data.get("visibility", 10000) / 1000, 1),
            "observed_at": datetime.now(timezone.utc),
            "source": "OpenWeatherMap Live API"
        }

    def evaluate_safety_level(self, weather_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Evaluasi status keselamatan wisata otomatis berdasarkan parameter cuaca:
        - Bahaya: Kecepatan angin > 50 km/h, badai petir lebat (Thunderstorm), atau hujan ekstrem (> 20mm/jam)
        - Waspada: Kecepatan angin > 25 km/h, hujan sedang/lebat, kabut tebal, suhu ekstrem
        - Aman: Cuaca cerah/berawan, angin stabil
        """
        condition = weather_data.get("condition", "").lower()
        wind_kph = weather_data.get("wind_kph", 0)
        rain_mm = weather_data.get("rain_1h_mm", 0)
        humidity = weather_data.get("humidity_pct", 0)

        level = "aman"
        status_label = "AMAN BERKUNJUNG"
        note = "Kondisi cuaca mendukung aktivitas luar ruangan. Tetap patuhi protokol keselamatan."

        if "thunderstorm" in condition or wind_kph >= 45 or rain_mm >= 15:
            level = "bahaya"
            status_label = "BAHAYA — JALUR DITUTUP SEMENTARA"
            note = f"Peringatan cuaca ekstrem: {weather_data.get('condition_description')}, angin {wind_kph} km/j. Aktivitas pendakian/wisata berisiko tinggi dihentikan."
        elif "rain" in condition or wind_kph >= 25 or rain_mm > 2 or "fog" in condition or "mist" in condition:
            level = "waspada"
            status_label = "WASPADA CUACA MEMBURUK"
            note = f"Kondisi {weather_data.get('condition_description')}, angin {wind_kph} km/j, kelembaban {humidity}%. Harap waspada jalur licin dan jarak pandang terbatas."

        return {
            "level": level,
            "status_label": status_label,
            "operational_note": note
        }

weather_service = WeatherService()
