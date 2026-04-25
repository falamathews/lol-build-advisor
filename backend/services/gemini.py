import os
import json
from google import genai
from google.genai import types
from services.data_dragon import get_items, get_current_patch, classify_enemy_composition

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def _build_prompt(my_champion: str, allies: list, enemies: list, items: dict, patch: str) -> str:
    composition = classify_enemy_composition(enemies)

    items_summary = []
    for item in items.values():
        if item["total_gold"] >= 2500:
            items_summary.append(
                f"{item['name']} ({item['total_gold']}g) - {item['description']} [tags: {', '.join(item['tags'])}]"
            )

    items_text = "\n".join(items_summary[:80])

    prompt = f"""Você é um especialista em League of Legends no patch {patch}.

## Situação da partida
- Meu campeão: {my_champion}
- Meus aliados: {', '.join(allies) if allies else 'Nenhum identificado ainda'}
- Campeões inimigos: {', '.join(enemies)}

## Análise da composição inimiga
- Campeões AP (dano mágico): {composition['ap_count']}
- Campeões AD (dano físico): {composition['ad_count']}
- Campeões com CC: {composition['cc_count']}
- Assassinos: {composition['assassin_count']}
- Tipo de dano predominante: {composition['majority_damage']}

## Itens disponíveis no patch {patch} (itens completos, 2500g+)
{items_text}

## Sua tarefa
Recomende a build completa ideal para {my_champion} considerando a composição inimiga acima.
Inclua: 5 itens principais + 1 bota.
Priorize itens situacionais que conteram as ameaças inimigas.

Responda SOMENTE com JSON válido, sem texto antes ou depois, neste formato exato:
{{
  "champion": "{my_champion}",
  "patch": "{patch}",
  "composition_analysis": "resumo em 1-2 frases sobre a composição inimiga e o que priorizar",
  "build": [
    {{
      "slot": 1,
      "item": "Nome do item",
      "reason": "Explicação de por que esse item é ideal contra essa composição"
    }},
    {{
      "slot": 2,
      "item": "Nome do item",
      "reason": "..."
    }},
    {{
      "slot": 3,
      "item": "Nome do item",
      "reason": "..."
    }},
    {{
      "slot": 4,
      "item": "Nome do item",
      "reason": "..."
    }},
    {{
      "slot": 5,
      "item": "Nome do item",
      "reason": "..."
    }},
    {{
      "slot": "boots",
      "item": "Nome das botas",
      "reason": "Explicação considerando CC e tipo de dano inimigo"
    }}
  ],
  "buy_order": ["item 1", "item 2", "item 3", "item 4", "item 5", "botas"]
}}"""

    return prompt


def _enrich_with_icons(build_data: dict, items: dict, patch: str) -> dict:
    name_to_icon = {v["name"].lower(): v["icon"] for v in items.values()}

    for item in build_data.get("build", []):
        item_name = item.get("item", "").lower()
        icon = name_to_icon.get(item_name)
        if not icon:
            for name, url in name_to_icon.items():
                if item_name in name or name in item_name:
                    icon = url
                    break
        item["icon"] = icon or ""

    champion_name = build_data.get("champion", "")
    clean_id = champion_name.replace(" ", "").replace("'", "").replace(".", "")
    build_data["champion_icon"] = f"https://ddragon.leagueoflegends.com/cdn/{patch}/img/champion/{clean_id}.png"

    return build_data


def get_build_recommendation(my_champion: str, allies: list, enemies: list) -> dict:
    items = get_items()
    patch = get_current_patch()
    prompt = _build_prompt(my_champion, allies, enemies, items, patch)

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(temperature=0.3),
    )
    text = response.text.strip()

    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
        text = text.strip()

    build_data = json.loads(text)
    return _enrich_with_icons(build_data, items, patch)
