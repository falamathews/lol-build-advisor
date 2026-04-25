from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.gemini import get_build_recommendation

router = APIRouter()


class BuildRequest(BaseModel):
    my_champion: str
    allies: list[str]
    enemies: list[str]


def _classify_error(e: Exception) -> HTTPException:
    msg = str(e).lower()
    if any(k in msg for k in ("api_key", "api key", "invalid key", "401", "403", "permission", "unauthenticated")):
        return HTTPException(status_code=401, detail="GEMINI_KEY_INVALID")
    if any(k in msg for k in ("timeout", "timed out", "deadline")):
        return HTTPException(status_code=408, detail="GEMINI_TIMEOUT")
    return HTTPException(status_code=500, detail=f"Erro ao gerar recomendação: {str(e)}")


@router.post("/recommend")
def recommend_build(request: BuildRequest):
    try:
        result = get_build_recommendation(
            my_champion=request.my_champion,
            allies=request.allies,
            enemies=request.enemies,
        )
        return result
    except Exception as e:
        raise _classify_error(e)
