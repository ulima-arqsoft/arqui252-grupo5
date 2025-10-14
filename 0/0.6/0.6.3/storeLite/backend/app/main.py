from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sentry_sdk
from app.routes import products, orders, simulate_error
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),
    traces_sample_rate=1.0
)

app = FastAPI(title="StoreLite API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)
app.include_router(orders.router)
app.include_router(simulate_error.router)

@app.get("/")
def root():
    return {"message": "Welcome to StoreLite API"}

@app.get("/simulate/log")
def simulate_log():
    logger.info("Esto es un log informativo para demo")
    logger.warning("Advertencia simulada")
    logger.error("Error simulado")
    return {"status": "ok"}