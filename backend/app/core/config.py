from typing import List, Union
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyHttpUrl, validator
import json
import os

# Resolve .env path relative to this file so it always loads
# regardless of the working directory uvicorn is started from
BASE_DIR = Path(__file__).resolve().parent.parent.parent  # -> backend/

class Settings(BaseSettings):
    PROJECT_NAME: str = "TrackCast API"
    API_V1_STR: str = "/api"
    DEBUG: bool = False
    PORT: int = 8000

    # PostgreSQL Database URL
    DATABASE_URL: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/trackcast_db"

    # JWT Settings
    JWT_SECRET_KEY: str = "trackcast_super_secret_jwt_key_change_in_production_123456789"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 # default fallback, overridden by .env
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # OpenWeatherMap Integration
    OPENWEATHER_API_KEY: str = ""
    OPENWEATHER_BASE_URL: str = "https://api.openweathermap.org/data/2.5"

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*"
    ]

    model_config = SettingsConfigDict(
        env_file=str(BASE_DIR / ".env"),  # absolute path -> always found
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
