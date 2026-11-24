import pytest

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.db.base import Base
from app.db.session import get_db
from app.main import app


SQLALCHEMY_DATABASE_URL = "sqlite://"

engine_teste = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

SessionTeste = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine_teste,
)


@pytest.fixture
def client():
    Base.metadata.create_all(bind=engine_teste)

    def substituir_banco():
        banco = SessionTeste()
        try:
            yield banco
        finally:
            banco.close()

    app.dependency_overrides[get_db] = substituir_banco

    with TestClient(app) as cliente:
        yield cliente

    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine_teste)