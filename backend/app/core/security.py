
from datetime import datetime, timedelta, timezone

import jwt
from pwdlib import PasswordHash
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.core.config import settings


password_hash = PasswordHash.recommended()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/admin/login")


def verificar_senha(senha: str, senha_hash: str) -> bool:
    return password_hash.verify(senha, senha_hash)


def criar_token_acesso(usuario: str) -> str:
    agora = datetime.now(timezone.utc)

    expiracao = agora + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    dados = {
        "sub": usuario,
        "iat": agora,
        "exp": expiracao
    }

    return jwt.encode(
        dados,
        settings.SECRET_KEY,
        algorithm="HS256"
    )


def obter_admin_atual(token: str = Depends(oauth2_scheme)):
    erro = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não autorizado. Faça login novamente.",
        headers={"WWW-Authenticate": "Bearer"}
    )

    try:
        dados = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=["HS256"]
        )

        usuario = dados.get("sub")

        if usuario != settings.ADMIN_USERNAME:
            raise erro

        return usuario

    except jwt.InvalidTokenError:
        raise erro
