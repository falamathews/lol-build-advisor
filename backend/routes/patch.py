from fastapi import APIRouter, HTTPException
from services.data_dragon import get_current_patch, get_items, get_champions

router = APIRouter()


@router.get("/current")
def current_patch():
    try:
        patch = get_current_patch()
        return {"patch": patch}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Erro ao buscar patch: {str(e)}")


@router.get("/items")
def items():
    try:
        data = get_items()
        return {"total": len(data), "items": list(data.values())[:10]}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Erro ao buscar itens: {str(e)}")


@router.get("/champions")
def champions():
    try:
        data = get_champions()
        return {"total": len(data), "sample": list(data.values())[:5]}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Erro ao buscar campeões: {str(e)}")
