from fastapi import APIRouter
from app.db import get_redis_connection

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("/")
def list_products():
    return [
        {"id": 1, "name": "Laptop", "price": 1200},
        {"id": 2, "name": "Mouse", "price": 40},
        {"id": 3, "name": "Keyboard", "price": 70},
    ]
