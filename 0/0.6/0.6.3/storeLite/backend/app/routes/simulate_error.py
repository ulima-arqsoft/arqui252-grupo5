from fastapi import APIRouter
import sentry_sdk

router = APIRouter(prefix="/test", tags=["Debug"])

@router.get("/error")
def trigger_error():
    sentry_sdk.capture_message("Manual error triggered 🚨")
    raise Exception("Simulated error for Sentry testing!")
