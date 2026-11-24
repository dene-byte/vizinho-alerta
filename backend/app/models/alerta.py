
from sqlalchemy import Column, Integer, String, Text, DateTime, Date, Time
from sqlalchemy.sql import func

from app.db.base import Base


class Alerta(Base):
    __tablename__ = "alertas"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(150), nullable=False)
    descricao = Column(Text, nullable=False)
    categoria = Column(String(50), nullable=False)
    bairro = Column(String(100), nullable=False)

    situacao = Column(String(150), nullable=True)
    data_ocorrencia = Column(Date, nullable=True)
    horario_aproximado = Column(Time, nullable=True)
    local_referencia = Column(String(150), nullable=True)

    status = Column(String(30), nullable=False, default="pendente")
    criado_em = Column(DateTime(timezone=True), server_default=func.now())
