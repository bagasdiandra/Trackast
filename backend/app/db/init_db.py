import logging
from sqlalchemy.orm import Session
from app.models.destination import Destination
from app.models.user import User
from app.core.security import get_password_hash

logger = logging.getLogger(__name__)

INITIAL_DESTINATIONS = [
    {
        "slug": "rinjani",
        "name": "Gunung Rinjani",
        "category": "gunung",
        "region": "Lombok, NTB",
        "island": "Nusa Tenggara",
        "elevation": "3.726 mdpl",
        "latitude": -8.4113,
        "longitude": 116.4573,
        "status": "waspada",
        "status_label": "WASPADA",
        "headline": "Kabut tebal dan suhu dingin di Plawangan Sembalun dan Danau Segara Anak.",
        "operational_note": "Jalur Sembalun dan Senaru diselimuti kabut tebal. Jarak pandang terbatas 30-50 meter. Dilarang camp di area bibir kawah.",
        "map_x": 590.0,
        "map_y": 346.0,
        "grid_cell": "HEX-NTB-04"
    },
    {
        "slug": "pantaipink",
        "name": "Pantai Pink",
        "category": "pantai",
        "region": "Lombok Timur, NTB",
        "island": "Nusa Tenggara",
        "elevation": "3 mdpl",
        "latitude": -8.8524,
        "longitude": 116.5238,
        "status": "aman",
        "status_label": "AMAN",
        "headline": "Perairan tenang dan rona merah muda pasir pantai tampak optimal saat surut.",
        "operational_note": "Aktivitas snorkeling, berenang, dan perahu wisata beroperasi aman dengan bendera hijau.",
        "map_x": 602.0,
        "map_y": 352.0,
        "grid_cell": "HEX-NTB-02"
    },
    {
        "slug": "prambanan",
        "name": "Candi Prambanan",
        "category": "budaya",
        "region": "Sleman, DIY",
        "island": "Jawa",
        "elevation": "154 mdpl",
        "latitude": -7.7520,
        "longitude": 110.4915,
        "status": "aman",
        "status_label": "AMAN",
        "headline": "Kondisi sangat cerah dan kondusif untuk kunjungan kompleks candi dan panggung terbuka.",
        "operational_note": "Seluruh zona candi dibuka normal. Disarankan mengenakan pelindung kepala dari sinar matahari langsung.",
        "map_x": 422.0,
        "map_y": 328.0,
        "grid_cell": "HEX-DIY-01"
    },
    {
        "slug": "semeru",
        "name": "Gunung Semeru",
        "category": "gunung",
        "region": "Lumajang, Jatim",
        "island": "Jawa",
        "elevation": "3.676 mdpl",
        "latitude": -8.1077,
        "longitude": 112.9224,
        "status": "bahaya",
        "status_label": "DITUTUP",
        "headline": "Peringatan Bahaya: Badai Petir & Level III Siaga di Mahameru.",
        "operational_note": "Seluruh jalur pendakian ditutup total demi keselamatan jiwa. Dilarang berada dalam radius 5 km dari kawah aktif Jonggring Saloko.",
        "map_x": 466.0,
        "map_y": 334.0,
        "grid_cell": "HEX-JATIM-03"
    },
    {
        "slug": "madakaripura",
        "name": "Air Terjun Madakaripura",
        "category": "air_terjun",
        "region": "Probolinggo, Jatim",
        "island": "Jawa",
        "elevation": "620 mdpl",
        "latitude": -7.8542,
        "longitude": 113.0035,
        "status": "waspada",
        "status_label": "WASPADA",
        "headline": "Curah hujan di hulu lereng Bromo meningkatkan debit air tebing dan risiko luncuran batu.",
        "operational_note": "Pengunjung wajib mengenakan helm keselamatan dan didampingi pemandu lokal. Dilarang berteduh langsung di bawah tebing tegak.",
        "map_x": 476.0,
        "map_y": 322.0,
        "grid_cell": "HEX-JATIM-04"
    },
    {
        "slug": "komodo",
        "name": "Taman Nasional Komodo",
        "category": "taman_nasional",
        "region": "Manggarai Barat, NTT",
        "island": "Nusa Tenggara",
        "elevation": "10 - 738 mdpl",
        "latitude": -8.5441,
        "longitude": 119.4939,
        "status": "aman",
        "status_label": "AMAN",
        "headline": "Perairan Labuan Bajo dan rute pelayaran Pulau Padar-Komodo kondusif dan cerah.",
        "operational_note": "Seluruh pelayaran kapal wisata dan jalur trekking Pulau Komodo & Rinca dibuka normal dengan pendampingan ranger resmi.",
        "map_x": 710.0,
        "map_y": 345.0,
        "grid_cell": "HEX-NTT-01"
    },
    {
        "slug": "bromo",
        "name": "Gunung Bromo",
        "category": "gunung",
        "region": "Probolinggo, Jatim",
        "island": "Jawa",
        "elevation": "2.329 mdpl",
        "latitude": -7.9425,
        "longitude": 112.9530,
        "status": "waspada",
        "status_label": "WASPADA",
        "headline": "Kabut tebal dan suhu dingin menyelimuti kaldera lautan pasir dan Penanjakan.",
        "operational_note": "Jarak pandang terbatas < 50 meter. Kendaraan jeep disarankan menyalakan lampu kabut dan wisatawan mengenakan pakaian hangat berlapis.",
        "map_x": 470.0,
        "map_y": 325.0,
        "grid_cell": "HEX-JATIM-02"
    },
    {
        "slug": "nusadua",
        "name": "Pantai Nusa Dua",
        "category": "pantai",
        "region": "Badung, Bali",
        "island": "Bali",
        "elevation": "3 mdpl",
        "latitude": -8.7944,
        "longitude": 115.2343,
        "status": "aman",
        "status_label": "AMAN",
        "headline": "Kondisi pantai tenang, ombak landai dengan visibilitas air jernih.",
        "operational_note": "Zona berenang aman dipantau Balawista Badung.",
        "map_x": 540.0,
        "map_y": 350.0,
        "grid_cell": "HEX-BALI-01"
    }
]

def init_db(db: Session):
    """Seed data awal jika tabel masih kosong."""
    # Seed default admin / demo user
    demo_user = db.query(User).filter(User.email == "arya.pratama@gmail.com").first()
    if not demo_user:
        user = User(
            full_name="Arya Pratama",
            email="arya.pratama@gmail.com",
            username="aryapratama",
            hashed_password=get_password_hash("password123"),
            role="wisatawan",
            phone_e164="+6281234567890",
            is_active=True
        )
        db.add(user)
        db.commit()

    # Seed destinasi wisata
    dest_count = db.query(Destination).count()
    if dest_count == 0:
        for d_data in INITIAL_DESTINATIONS:
            dest = Destination(**d_data, is_active=True)
            db.add(dest)
        db.commit()
