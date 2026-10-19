from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.destination import Destination, WeatherObservation
from app.schemas.weather import (
    DestinationResponse,
    DestinationWeatherDetailResponse,
    WeatherCurrentData,
    MapCellResponse
)
from app.services.weather_service import weather_service

router = APIRouter(tags=["Weather & Map API"])

@router.get("/destinations", response_model=List[DestinationResponse])
def get_destinations(
    category: Optional[str] = Query(None, description="Filter kategori: gunung, pantai, dll"),
    status_filter: Optional[str] = Query(None, alias="status", description="Filter status: aman, waspada, bahaya"),
    search: Optional[str] = Query(None, description="Pencarian nama atau wilayah destinasi"),
    db: Session = Depends(get_db)
):
    """
    Mengambil daftar destinasi wisata beserta koordinat dan status keselamatan untuk peta.
    """
    query = db.query(Destination).filter(Destination.is_active == True)
    
    if category and category != "semua":
        query = query.filter(Destination.category == category)
    if status_filter and status_filter != "semua":
        query = query.filter(Destination.status == status_filter)
    if search:
        search_fmt = f"%{search.lower()}%"
        query = query.filter(
            (Destination.name.ilike(search_fmt)) | (Destination.region.ilike(search_fmt))
        )
        
    return query.all()

@router.get("/destinations/{slug}", response_model=DestinationResponse)
def get_destination_detail(slug: str, db: Session = Depends(get_db)):
    """Mengambil informasi detail satu destinasi berdasarkan slug."""
    dest = db.query(Destination).filter(Destination.slug == slug).first()
    if not dest:
        raise HTTPException(status_code=404, detail="Destinasi tidak ditemukan")
    return dest

@router.get("/destinations/{slug}/weather", response_model=DestinationWeatherDetailResponse)
async def get_destination_weather(slug: str, db: Session = Depends(get_db)):
    """
    Mengambil data cuaca real-time OpenWeatherMap untuk destinasi tertentu:
    - Memanggil OpenWeatherMap Live API berdasarkan latitude & longitude destinasi
    - Menghasilkan prakiraan per jam (24 jam)
    - Melakukan evaluasi keselamatan cuaca otomatis
    - Menyimpan histori observasi ke database
    """
    dest = db.query(Destination).filter(Destination.slug == slug).first()
    if not dest:
        raise HTTPException(status_code=404, detail="Destinasi tidak ditemukan")

    # Ambil data cuaca dari OpenWeatherMap
    current_weather_dict = await weather_service.fetch_current_weather(dest.latitude, dest.longitude)
    forecast_list = await weather_service.fetch_forecast(dest.latitude, dest.longitude)
    safety_eval = weather_service.evaluate_safety_level(current_weather_dict)

    # Sinkronisasi status destinasi terbaru
    if dest.status != safety_eval["level"]:
        dest.status = safety_eval["level"]
        dest.status_label = safety_eval["status_label"]
        dest.operational_note = safety_eval["operational_note"]
        db.commit()

    # Simpan observasi cuaca terbaru ke tabel weather_observations
    # Konversi datetime ke string agar bisa disimpan sebagai JSON di PostgreSQL
    import json as _json
    from datetime import datetime as _dt

    def _serialize_payload(d):
        """Konversi semua datetime ke ISO string agar JSON serializable."""
        result = {}
        for k, v in d.items():
            if isinstance(v, _dt):
                result[k] = v.isoformat()
            else:
                result[k] = v
        return result

    serializable_payload = _serialize_payload(current_weather_dict)

    obs = WeatherObservation(
        destination_id=dest.id,
        temperature_c=current_weather_dict.get("temperature_c"),
        humidity_pct=current_weather_dict.get("humidity_pct"),
        wind_kph=current_weather_dict.get("wind_kph"),
        rain_probability_pct=current_weather_dict.get("rain_1h_mm"),
        condition_code=current_weather_dict.get("condition"),
        condition_label=current_weather_dict.get("condition_description"),
        source="openweathermap",
        raw_payload=serializable_payload
    )
    db.add(obs)
    db.commit()

    return DestinationWeatherDetailResponse(
        destination=DestinationResponse.model_validate(dest),
        current_weather=WeatherCurrentData(**current_weather_dict),
        hourly_forecast=forecast_list,
        safety_summary=safety_eval
    )

@router.get("/weather/current", response_model=WeatherCurrentData)
async def get_custom_coords_weather(
    lat: float = Query(..., description="Latitude lokasi"),
    lon: float = Query(..., description="Longitude lokasi")
):
    """
    Mengambil data cuaca langsung dari OpenWeatherMap untuk koordinat geografis bebas (GPS wisatawan).
    """
    weather_dict = await weather_service.fetch_current_weather(lat, lon)
    return WeatherCurrentData(**weather_dict)

@router.get("/map/cells", response_model=List[MapCellResponse])
def get_map_cells(db: Session = Depends(get_db)):
    """
    Mengambil status grid heksagonal untuk visualisasi peta interaktif keselamatan TrackCast.
    """
    destinations = db.query(Destination).filter(Destination.is_active == True).all()
    cells = []
    for d in destinations:
        if d.map_x and d.map_y:
            cells.append(MapCellResponse(
                id=d.grid_cell or f"cell_{d.slug}",
                cx=d.map_x,
                cy=d.map_y,
                status=d.status,
                destination_name=d.name
            ))
    return cells
