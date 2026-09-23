import os

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker


DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg://localhost/booking")
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, class_=Session, expire_on_commit=False)


def get_db():
    """เปิด session สำหรับการเข้าถึงตารางตาม CON-TECH-01 และ IF-HIS-01."""
    with SessionLocal() as session:
        yield session