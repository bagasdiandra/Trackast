import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Boolean, DateTime, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base

class Destination(Base):
    __tablename__ = "destinations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    slug = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(150), nullable=False)
    region = Column(String(100), nullable=False)
    island = Column(String(50), nullable=True)
    category = Column(String(50), default="gunung")  # gunung, pantai, taman_nasional, budaya
    elevation = Column(String(50), nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    
    # Status keselamatan terkini
    status = Column(String(20), default="aman")  # aman, waspada, bahaya
    status_label = Column(String(50), default="AMAN")
    headline = Column(Text, nullable=True)
    operational_note = Column(Text, nullable=True)
    
    # Koordinat visual peta (SVG prototype mapping)
    map_x = Column(Float, nullable=True)
    map_y = Column(Float, nullable=True)
    grid_cell = Column(String(50), nullable=True)

    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    weather_observations = relationship("WeatherObservation", back_populates="destination", cascade="all, delete-orphan")


class WeatherObservation(Base):
    __tablename__ = "weather_observations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    destination_id = Column(String, ForeignKey("destinations.id"), nullable=True)
    observed_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    source = Column(String(50), default="openweathermap")
    
    temperature_c = Column(Float, nullable=True)
    humidity_pct = Column(Float, nullable=True)
    wind_kph = Column(Float, nullable=True)
    rain_probability_pct = Column(Float, nullable=True)
    condition_code = Column(String(50), nullable=True)
    condition_label = Column(String(100), nullable=True)
    raw_payload = Column(JSON, nullable=True)

    destination = relationship("Destination", back_populates="weather_observations")
