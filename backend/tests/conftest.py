from collections.abc import Iterator

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from app.db.models import Base


@pytest.fixture
def db_session() -> Iterator[Session]:
    """เตรียมฐานข้อมูลทดสอบที่มีตารางตาม CON-TECH-01 และ IF-HIS-01."""
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    with Session(engine) as session:
        yield session
    engine.dispose()