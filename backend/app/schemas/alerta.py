
from datetime import datetime, date, time

from pydantic import BaseModel, ConfigDict, Field


class AlertaCriar(BaseModel):
    titulo: str = Field(min_length=3, max_length=150)
    descricao: str = Field(min_length=5)
    categoria: str = Field(min_length=2, max_length=50)
    bairro: str = Field(min_length=2, max_length=100)

    situacao: str = Field(min_length=2, max_length=150)
    data_ocorrencia: date | None = None
    horario_aproximado: time | None = None
    local_referencia: str | None = Field(default=None, max_length=150)


class AlertaResposta(BaseModel):
    id: int
    titulo: str
    descricao: str
    categoria: str
    bairro: str

    situacao: str | None = None
    data_ocorrencia: date | None = None
    horario_aproximado: time | None = None
    local_referencia: str | None = None

    status: str
    criado_em: datetime

    model_config = ConfigDict(from_attributes=True)
