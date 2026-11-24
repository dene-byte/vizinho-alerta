
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.alerta import Alerta
from app.schemas.alerta import AlertaCriar, AlertaResposta
from app.core.security import obter_admin_atual


router = APIRouter(
    prefix="/alertas",
    tags=["Alertas"],
)


@router.post(
    "/",
    response_model=AlertaResposta,
    status_code=status.HTTP_201_CREATED,
)
def cadastrar_alerta(
    dados: AlertaCriar,
    db: Session = Depends(get_db),
):
    novo_alerta = Alerta(
        titulo=dados.titulo,
        descricao=dados.descricao,
        categoria=dados.categoria,
        bairro=dados.bairro,
        situacao=dados.situacao,
        data_ocorrencia=dados.data_ocorrencia,
        horario_aproximado=dados.horario_aproximado,
        local_referencia=dados.local_referencia,
        status="pendente",
    )

    db.add(novo_alerta)
    db.commit()
    db.refresh(novo_alerta)

    return novo_alerta


@router.get(
    "/",
    response_model=list[AlertaResposta],
)
def listar_alertas(db: Session = Depends(get_db)):
    return (
        db.query(Alerta)
        .filter(Alerta.status == "publicado")
        .order_by(Alerta.id.desc())
        .all()
    )


@router.get(
    "/{alerta_id}",
    response_model=AlertaResposta,
)
def consultar_alerta(
    alerta_id: int,
    db: Session = Depends(get_db),
):
    alerta = (
        db.query(Alerta)
        .filter(
            Alerta.id == alerta_id,
            Alerta.status == "publicado",
        )
        .first()
    )

    if alerta is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alerta não encontrado.",
        )

    return alerta


@router.patch(
    "/{alerta_id}/status",
    response_model=AlertaResposta,
)
def atualizar_status(
    alerta_id: int,
    novo_status: str,
    db: Session = Depends(get_db),
    administrador: str = Depends(obter_admin_atual),
):
    status_permitidos = [
        "pendente",
        "em análise",
        "publicado",
        "resolvido",
    ]

    if novo_status not in status_permitidos:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Status inválido.",
        )

    alerta = db.query(Alerta).filter(Alerta.id == alerta_id).first()

    if alerta is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alerta não encontrado.",
        )

    alerta.status = novo_status
    db.commit()
    db.refresh(alerta)

    return alerta


@router.delete(
    "/{alerta_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def excluir_alerta(
    alerta_id: int,
    db: Session = Depends(get_db),
    administrador: str = Depends(obter_admin_atual),
):
    alerta = db.query(Alerta).filter(Alerta.id == alerta_id).first()

    if alerta is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alerta não encontrado.",
        )

    db.delete(alerta)
    db.commit()

    return None
