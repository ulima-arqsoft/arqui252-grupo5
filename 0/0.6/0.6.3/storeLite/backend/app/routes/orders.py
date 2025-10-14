from fastapi import APIRouter, HTTPException
from app.db import get_redis_connection  # aunque no se usa aún, lo dejamos
import logging

router = APIRouter(prefix="/orders", tags=["Orders"])
logger = logging.getLogger(__name__)

@router.get("/")
def list_orders():
    return {"message": "Orders API is ready. Use POST to create an order."}

@router.post("/")
def create_order(order: dict):
    product_id = order.get("product_id")
    if not product_id:
        logger.error("❌ Missing product_id in order request")
        raise HTTPException(status_code=400, detail="Missing product_id")

    logger.info(f"🛒 Order created for product_id={product_id}")
    return {"message": "Order created", "order": order}
