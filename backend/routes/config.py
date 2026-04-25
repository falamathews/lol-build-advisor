from fastapi import APIRouter
from services.data_dragon import get_current_patch
import os

router = APIRouter()


@router.get("/")
def get_config():
    name = os.getenv("RIOT_ID_NAME", "")
    tag = os.getenv("RIOT_ID_TAG", "")
    region = os.getenv("RIOT_REGION", "br1").upper()
    try:
        patch = get_current_patch()
    except Exception:
        patch = "—"
    return {
        "riot_id": f"{name}#{tag}" if name and tag else "—",
        "region": region,
        "patch": patch,
    }
