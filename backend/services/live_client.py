import requests
import os
from urllib3.exceptions import InsecureRequestWarning

requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

LIVE_CLIENT_URL = "https://127.0.0.1:2999/liveclientdata/allgamedata"

RIOT_ID_NAME = os.getenv("RIOT_ID_NAME", "").lower()
RIOT_ID_TAG = os.getenv("RIOT_ID_TAG", "").lower()


def get_live_game_data():
    try:
        response = requests.get(LIVE_CLIENT_URL, verify=False, timeout=3)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.ConnectionError:
        return None
    except requests.exceptions.Timeout:
        return None
    except Exception:
        return None


def parse_game_status(data: dict) -> dict:
    if not data:
        return {"status": "waiting"}

    players = data.get("allPlayers", [])
    active_player = data.get("activePlayer", {})

    my_summoner_name = active_player.get("summonerName", "").lower()

    my_player = None
    for player in players:
        summoner = player.get("summonerName", "").lower()
        riot_id = player.get("riotId", "").lower()
        full_id = f"{RIOT_ID_NAME}#{RIOT_ID_TAG}"

        if summoner == my_summoner_name or riot_id == full_id:
            my_player = player
            break

    if not my_player and players:
        my_player = players[0]

    my_team = my_player.get("team", "ORDER") if my_player else "ORDER"
    my_champion = my_player.get("championName", "Desconhecido") if my_player else "Desconhecido"

    allies = []
    enemies = []

    for player in players:
        if player == my_player:
            continue
        champion = player.get("championName", "Desconhecido")
        if player.get("team") == my_team:
            allies.append(champion)
        else:
            enemies.append(champion)

    return {
        "status": "active",
        "my_champion": my_champion,
        "my_team": my_team,
        "allies": allies,
        "enemies": enemies,
        "game_mode": data.get("gameData", {}).get("gameMode", "CLASSIC"),
    }
