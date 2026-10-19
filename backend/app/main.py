import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.session import engine, Base, SessionLocal
from app.db.init_db import init_db
from app.api.auth import router as auth_router
from app.api.weather import router as weather_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Inisialisasi tabel PostgreSQL dan seed data awal
    try:
        logger.info("Membuat tabel database jika belum ada...")
        Base.metadata.create_all(bind=engine)
        
        logger.info("Memeriksa seed data awal...")
        db = SessionLocal()
        try:
            init_db(db)
        finally:
            db.close()
        logger.info("Database TrackCast siap digunakan.")
    except Exception as e:
        logger.warning(f"Koneksi database belum aktif atau terjadi error: {e}")
        logger.info("Pastikan PostgreSQL sudah berjalan dan kredensial di file .env sesuai.")
    yield
    # Shutdown
    logger.info("Mematikan aplikasi TrackCast Backend...")

app = FastAPI(
    title="TrackCast Backend Service",
    description="Backend microservice untuk Auth Service (JWT Authentication) dan Weather Map API (OpenWeatherMap Live Integration)",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware agar frontend TrackCast (PWA/HTML) dapat memanggil API tanpa hambatan
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Mengizinkan akses dari domain lokal/frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Hubungkan Routers
app.include_router(auth_router, prefix="/api")
app.include_router(weather_router, prefix="/api")

@app.get("/", tags=["Health Check"])
def root():
    return {
        "app": "TrackCast Backend API",
        "status": "online",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": {
            "auth": {
                "register": "POST /api/auth/register",
                "login": "POST /api/auth/login",
                "me": "GET /api/auth/me (JWT required)",
                "refresh": "POST /api/auth/refresh",
                "logout": "POST /api/auth/logout"
            },
            "weather_and_map": {
                "destinations": "GET /api/destinations",
                "destination_detail": "GET /api/destinations/{slug}",
                "destination_weather": "GET /api/destinations/{slug}/weather (OpenWeatherMap)",
                "custom_coords_weather": "GET /api/weather/current?lat={lat}&lon={lon}",
                "map_cells": "GET /api/map/cells"
            }
        }
    }

@app.get("/health", tags=["Health Check"])
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=settings.PORT, reload=settings.DEBUG)
