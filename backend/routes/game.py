from fastapi import APIRouter
from services.live_client import get_live_game_data, parse_game_status
from services.data_dragon import get_champions, get_current_patch

router = APIRouter()


def _champion_icon(name: str, champions: dict, patch: str) -> str:
    if name in champions:
        return champions[name]["icon"]
    clean = name.replace(" ", "").replace("'", "").replace(".", "")
    return f"https://ddragon.leagueoflegends.com/cdn/{patch}/img/champion/{clean}.png"


@router.get("/status")
def game_status():
    data = get_live_game_data()
    status = parse_game_status(data)

    if status["status"] == "active":
        try:
            champions = get_champions()
            patch = get_current_patch()
            status["my_champion_icon"] = _champion_icon(status["my_champion"], champions, patch)
            status["allies_icons"] = [_champion_icon(c, champions, patch) for c in status["allies"]]
            status["enemies_icons"] = [_champion_icon(c, champions, patch) for c in status["enemies"]]
        except Exception:
            pass

    return status
