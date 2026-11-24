
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.alertas import router as alertas_router
from app.routers.admin import router as admin_router


app = FastAPI(
    title="Vizinho Alerta",
    description=(
        "Sistema comunitário para registro de situações, "
        "publicação de alertas revisados e prevenção."
    ),
    version="0.1.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(alertas_router)
app.include_router(admin_router)


@app.get("/")
def inicio():
    return {
        "mensagem": "Bem-vindo ao Vizinho Alerta!",
        "status": "API funcionando",
    }


@app.get("/health")
def verificar_saude():
    return {"status": "ok"}
