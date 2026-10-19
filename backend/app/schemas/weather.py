from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

class DestinationBase(BaseModel):
    slug: str
    name: str
    region: str
    island: Optional[str] = None
    category: str
    elevation: Optional[str] = None
    latitude: float
    longitude: float
    status: str  # aman, waspada, bahaya
    status_label: str
    headline: Optional[str] = None
    operational_note: Optional[str] = None
    map_x: Optional[float] = None
    map_y: Optional[float] = None
    grid_cell: Optional[str] = None

class DestinationResponse(DestinationBase):
    id: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class WeatherCurrentData(BaseModel):
    location: str
    latitude: float
    longitude: float
    temperature_c: float
    feels_like_c: Optional[float] = None
    temp_min_c: Optional[float] = None
    temp_max_c: Optional[float] = None
    humidity_pct: int
    wind_kph: float
    wind_direction_deg: Optional[int] = None
    pressure_hpa: Optional[int] = None
    condition: str
    condition_description: str
    condition_icon: str
    rain_1h_mm: Optional[float] = 0.0
    visibility_km: Optional[float] = None
    observed_at: datetime
    source: str = "OpenWeatherMap"

class WeatherHourlyItem(BaseModel):
    time: str
    timestamp: int
    temperature_c: float
    condition: str
    icon: str
    rain_probability_pct: int

class DestinationWeatherDetailResponse(BaseModel):
    destination: DestinationResponse
    current_weather: WeatherCurrentData
    hourly_forecast: List[WeatherHourlyItem] = []
    safety_summary: Dict[str, Any]

class MapCellResponse(BaseModel):
    id: str
    cx: float
    cy: float
    status: str
    destination_name: Optional[str] = None
