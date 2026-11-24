from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import (
    verificar_senha,
    criar_token_acesso,
    obter_admin_atual,
)
from app.db.session import get_db
from app.models.alerta import Alerta
from app.schemas.alerta import AlertaResposta


router = APIRouter(prefix="/admin", tags=["Administração"])


@router.post("/login")
def login_admin(
    dados: OAuth2PasswordRequestForm = Depends()
):
    usuario_correto = dados.username == settings.ADMIN_USERNAME

    senha_correta = verificar_senha(
        dados.password,
        settings.ADMIN_PASSWORD_HASH
    )

    if not usuario_correto or not senha_correta:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário ou senha incorretos."
        )

    token = criar_token_acesso(dados.username)

    return {
        "access_token": token,
        "token_type": "bearer"
    }


@router.get(
    "/alertas",
    response_model=list[AlertaResposta],
)
def listar_todos_alertas_admin(
    db: Session = Depends(get_db),
    administrador: str = Depends(obter_admin_atual),
):
    return (
        db.query(Alerta)
        .order_by(Alerta.id.desc())
        .all()
    )


@router.get(
    "/alertas/pendentes",
    response_model=list[AlertaResposta],
)
def listar_alertas_pendentes(
    db: Session = Depends(get_db),
    administrador: str = Depends(obter_admin_atual),
):
    return (
        db.query(Alerta)
        .filter(
            Alerta.status.in_(["pendente", "em análise"])
        )
        .order_by(Alerta.id.desc())
        .all()
    )