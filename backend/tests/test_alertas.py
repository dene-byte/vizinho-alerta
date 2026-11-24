
from fastapi.testclient import TestClient

from app.main import app
from app.core.security import obter_admin_atual


def test_inicio(client):
    resposta = client.get("/")

    assert resposta.status_code == 200
    assert resposta.json()["status"] == "API funcionando"


def test_verificar_saude(client):
    resposta = client.get("/health")

    assert resposta.status_code == 200
    assert resposta.json()["status"] == "ok"


def test_cadastrar_alerta(client):
    dados = {
        "titulo": "Alerta de teste",
        "descricao": "Teste do banco de dados temporário.",
        "categoria": "Segurança",
        "bairro": "Centro",
        "situacao": "Movimentação suspeita",
        "data_ocorrencia": "2026-11-16",
        "horario_aproximado": "18:30:00",
        "local_referencia": "Próximo à praça central"
    }

    resposta = client.post("/alertas/", json=dados)

    assert resposta.status_code == 201
    assert resposta.json()["titulo"] == "Alerta de teste"
    assert resposta.json()["situacao"] == "Movimentação suspeita"
    assert resposta.json()["status"] == "pendente"


def test_listar_alertas(client):
    resposta = client.get("/alertas/")

    assert resposta.status_code == 200
    assert isinstance(resposta.json(), list)


def test_consultar_alerta(client):
    dados = {
        "titulo": "Alerta para consulta",
        "descricao": "Registro criado para testar consulta.",
        "categoria": "Segurança",
        "bairro": "Centro",
        "situacao": "Tentativa de furto"
    }

    cadastro = client.post("/alertas/", json=dados)
    alerta_id = cadastro.json()["id"]

    app.dependency_overrides[obter_admin_atual] = lambda: "admin"

    try:
        publicacao = client.patch(
            f"/alertas/{alerta_id}/status",
            params={"novo_status": "publicado"}
        )

        assert publicacao.status_code == 200
    finally:
        app.dependency_overrides.pop(obter_admin_atual, None)

    resposta = client.get(f"/alertas/{alerta_id}")

    assert resposta.status_code == 200
    assert resposta.json()["id"] == alerta_id
    assert resposta.json()["situacao"] == "Tentativa de furto"


def test_atualizar_status(client):
    dados = {
        "titulo": "Alerta para atualização",
        "descricao": "Registro criado para testar atualização.",
        "categoria": "Segurança",
        "bairro": "Centro",
        "situacao": "Ameaças ou conflitos"
    }

    cadastro = client.post("/alertas/", json=dados)
    alerta_id = cadastro.json()["id"]

    app.dependency_overrides[obter_admin_atual] = lambda: "admin"

    try:
        resposta = client.patch(
            f"/alertas/{alerta_id}/status",
            params={"novo_status": "em análise"}
        )
    finally:
        app.dependency_overrides.pop(obter_admin_atual, None)

    assert resposta.status_code == 200
    assert resposta.json()["status"] == "em análise"
