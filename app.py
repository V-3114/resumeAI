from flask import Flask, render_template, request, jsonify
from resume_builder import build_resume

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/compile", methods=["POST"])
def compile():
    data = request.json
    output = build_resume(data)
    #output = "Resume Compiled"

    return jsonify({
        "message": "Resume generated.",
        "result": output  # You can return the generated resume or a file path
    })

if __name__ == "__main__":
    app.run(debug=True)
