import requests
import json
import os
from pathlib import Path

VERSIONS_URL = "https://ddragon.leagueoflegends.com/api/versions.json"
CACHE_DIR = Path(__file__).parent.parent / "cache"

_cache = {
    "patch": None,
    "items": None,
    "champions": None,
}


def get_current_patch() -> str:
    versions = requests.get(VERSIONS_URL, timeout=10).json()
    return versions[0]


def _cache_path(name: str) -> Path:
    CACHE_DIR.mkdir(exist_ok=True)
    return CACHE_DIR / f"{name}.json"


def _load_cache(name: str):
    path = _cache_path(name)
    if path.exists():
        return json.loads(path.read_text())
    return None


def _save_cache(name: str, data):
    _cache_path(name).write_text(json.dumps(data, ensure_ascii=False))


def get_items() -> dict:
    patch = get_current_patch()

    cached_meta = _load_cache("meta")
    if cached_meta and cached_meta.get("patch") == patch and _cache["items"]:
        return _cache["items"]

    cached_items = _load_cache("items")
    if cached_items and cached_items.get("patch") == patch:
        _cache["items"] = cached_items["data"]
        return _cache["items"]

    url = f"https://ddragon.leagueoflegends.com/cdn/{patch}/data/pt_BR/item.json"
    raw = requests.get(url, timeout=10).json()

    purchasable_items = {}
    for item_id, item in raw["data"].items():
        gold = item.get("gold", {})
        tags = item.get("tags", [])
        maps = item.get("maps", {})

        if not gold.get("purchasable", False):
            continue
        if not maps.get("11", False):
            continue
        if gold.get("total", 0) < 300:
            continue

        purchasable_items[item_id] = {
            "id": item_id,
            "name": item["name"],
            "description": item.get("plaintext", ""),
            "total_gold": gold.get("total", 0),
            "tags": tags,
            "stats": item.get("stats", {}),
            "icon": f"https://ddragon.leagueoflegends.com/cdn/{patch}/img/item/{item_id}.png",
        }

    _save_cache("items", {"patch": patch, "data": purchasable_items})
    _save_cache("meta", {"patch": patch})
    _cache["items"] = purchasable_items
    return purchasable_items


def get_champions() -> dict:
    patch = get_current_patch()

    cached_champions = _load_cache("champions")
    if cached_champions and cached_champions.get("patch") == patch:
        _cache["champions"] = cached_champions["data"]
        return _cache["champions"]

    url = f"https://ddragon.leagueoflegends.com/cdn/{patch}/data/pt_BR/champion.json"
    raw = requests.get(url, timeout=10).json()

    champions = {}
    for champ_id, champ in raw["data"].items():
        champions[champ["name"]] = {
            "id": champ_id,
            "name": champ["name"],
            "tags": champ.get("tags", []),
            "icon": f"https://ddragon.leagueoflegends.com/cdn/{patch}/img/champion/{champ_id}.png",
        }

    _save_cache("champions", {"patch": patch, "data": champions})
    _cache["champions"] = champions
    return champions


# Campeões predominantemente mágicos — usados para classificar composição inimiga
AP_CHAMPIONS = {
    "Ahri", "Akali", "Anivia", "Annie", "Aurelion Sol", "Azir",
    "Brand", "Cassiopeia", "Corki", "Diana", "Ekko", "Elise",
    "Evelynn", "Fiddlesticks", "Fizz", "Galio", "Heimerdinger",
    "Karma", "Karthus", "Kassadin", "Katarina", "Kennen", "Kled",
    "LeBlanc", "Lissandra", "Lux", "Malzahar", "Morgana", "Neeko",
    "Nidalee", "Nunu & Willump", "Orianna", "Rumble", "Ryze",
    "Seraphine", "Shaco", "Singed", "Swain", "Sylas", "Syndra",
    "Taliyah", "Teemo", "Twisted Fate", "Veigar", "Vel'Koz",
    "Viktor", "Vladimir", "Vex", "Xerath", "Zoe", "Zyra",
    "Amumu", "Grasp", "Lillia", "Maokai", "Mordekaiser", "Skarner",
    "Soraka", "Sona", "Lulu", "Nami", "Janna", "Yuumi",
}


def classify_enemy_composition(enemies: list[str]) -> dict:
    ap_count = sum(1 for e in enemies if e in AP_CHAMPIONS)
    ad_count = len(enemies) - ap_count

    cc_champions = {
        "Amumu", "Leona", "Nautilus", "Thresh", "Blitzcrank",
        "Morgana", "Lissandra", "Syndra", "Zoe", "Veigar",
        "Malzahar", "Warwick", "Rammus", "Galio", "Skarner",
    }
    cc_count = sum(1 for e in enemies if e in cc_champions)

    assassins = {
        "Zed", "Talon", "Katarina", "Akali", "Kha'Zix", "Rengar",
        "Fizz", "LeBlanc", "Shaco", "Evelynn", "Qiyana", "Pyke",
    }
    assassin_count = sum(1 for e in enemies if e in assassins)

    return {
        "ap_count": ap_count,
        "ad_count": ad_count,
        "cc_count": cc_count,
        "assassin_count": assassin_count,
        "majority_damage": "magic" if ap_count >= 3 else "physical" if ad_count >= 3 else "mixed",
    }
