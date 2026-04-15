import requests
import json
from prompts import SYSTEM_PROMPT

def search_places_serper(query, api_key):
    """Busca lugares en Google Maps usando Serper.dev"""
    url = "https://google.serper.dev/maps"
    payload = json.dumps({"q": query, "gl": "cl"})
    headers = {
        'X-API-KEY': api_key,
        'Content-Type': 'application/json'
    }
    try:
        response = requests.request("POST", url, headers=headers, data=payload)
        return response.json().get('maps', [])
    except Exception as e:
        print(f"Error en Serper Maps: {e}")
        return []

def search_social_serper(query, api_key):
    """Busca redes sociales usando Serper.dev (Search)"""
    url = "https://google.serper.dev/search"
    payload = json.dumps({"q": query, "gl": "cl"})
    headers = {
        'X-API-KEY': api_key,
        'Content-Type': 'application/json'
    }
    try:
        response = requests.request("POST", url, headers=headers, data=payload)
        return response.json()
    except Exception as e:
        print(f"Error en Serper Search: {e}")
        return {}

def process_with_openrouter(data_text, api_key):
    """Procesa y clasifica los datos con IA vía OpenRouter"""
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "google/gemini-flash-1.5", # O "anthropic/claude-3-haiku"
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Analiza este local: {data_text}"}
        ],
        "response_format": {"type": "json_object"}
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        result = response.json()
        if 'choices' not in result:
            print(f"OpenRouter Error: {result}")
            return None

        content = result['choices'][0]['message']['content']

        # Limpiar posible markdown del modelo
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()

        return json.loads(content)
    except Exception as e:
        print(f"Error en OpenRouter: {e}")
        return None
