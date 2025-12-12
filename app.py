import os
from flask import Flask, render_template, request, jsonify, send_file
import requests
from resume_builder import build_resume
from dotenv import load_dotenv
from flask_cors import CORS
import io

# ===== FLASK APP =====
app = Flask(__name__)
CORS(app)

# ===== CONFIG =====
DEBUG_AI = True  # Set to False to enable real API calls

# ===== DEBUG PLACEHOLDERS =====
DEBUG_PLACEHOLDERS = {
    "description": "<<start>>Alphabet Inc., Google's parent company, is a global technology leader with a market capitalization around $3.86 trillion as of December 2025. It generated $348 billion in revenue in 2024, employs over 190,000 people, and dominates digital advertising, operating key platforms including Google Search, YouTube, and Android.<<end>>",
    "responsibility": "<<start>>Lead product development, collaborate with teams, handle customer queries daily.<<end>>",
    "achievements": "<<start>>Achieved 150% of targets, improved response rate by 20%, recognized as Employee of the Month.<<end>>",
    "tools": "<<start>>CRM systems, ticketing platforms, chat automation tools.<<end>>",
    "projects": "<<start>>Contributed to onboarding project for key clients, led process improvement initiatives.<<end>>"
}

# Load API key
load_dotenv()
api_key = os.getenv("API_KEY")
PPLX_URL = "https://api.perplexity.ai/chat/completions"
HEADERS = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/compile", methods=["POST"])
def compile():
    try:
        data = request.json

        document = build_resume(data)  # returns a python-docx Document()

        buffer = io.BytesIO()
        document.save(buffer)
        buffer.seek(0)

        return send_file(
            buffer,
            as_attachment=True,
            download_name="resume.docx",
            mimetype="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )

    except Exception as e:
        return jsonify({"success": False, "error": str(e)})


@app.route("/api/ai", methods=["POST"])
def call_ai():
    data = request.json
    fields = data.get("fields", [])
    result = {}

    print("\n📥 ====== /api/ai CALLED ======")
    print("Incoming fields:", fields)

    for f in fields:
        if DEBUG_AI:
            result[f['key']] = DEBUG_PLACEHOLDERS.get(
                f['key'], f"<<DEBUG_PLACEHOLDER for {f['key']}>>"
            )
        else:
            try:
                prompt_text = (
                    f"Prompt: {f['prompt']}\n"
                    f"User Input: {f['userInput']}\n"
                    f"Rules: {f['rules']}\n"
                    f"Generate concise response only for this field, with start/end markers."
                )

                payload = {
                    "model": "sonar",
                    "messages": [{"role": "user", "content": prompt_text}],
                    "max_tokens": 200
                }

                response = requests.post(PPLX_URL, json=payload, headers=HEADERS)

                if response.status_code != 200:
                    print("❌ API Error:", response.text)
                    result[f['key']] = ""
                    continue

                response_json = response.json()
                ai_text = response_json["choices"][0]["message"]["content"]

                result[f['key']] = ai_text

            except Exception as e:
                print("❌ Exception during AI call:", e)
                result[f['key']] = ""

    print("\n📤 Final result returned to frontend:", result)
    print("====================================\n")

    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True)
