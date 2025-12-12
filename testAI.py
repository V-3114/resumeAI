import os
import requests
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("API_KEY")

print("➡️ Loaded Perplexity API Key:", "FOUND" if api_key else "NOT FOUND")

url = "https://api.perplexity.ai/chat/completions"

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

payload = {
    "model": "sonar",     # safe model
    "messages": [
        {"role": "user", "content": "Say 'Hello' in one word."}
    ],
    "max_tokens": 50
}

print("➡️ Sending request...")

try:
    response = requests.post(url, json=payload, headers=headers)
    print("Status Code:", response.status_code)
    print("Response Body:", response.text)
except Exception as e:
    print("❌ ERROR calling Perplexity API:")
    print(e)
