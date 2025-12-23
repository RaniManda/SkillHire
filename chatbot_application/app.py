
from flask import Flask, render_template, request, jsonify
from chatbot import chat_with_bot

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message")
    reply = chat_with_bot(user_message)
    return jsonify({"reply": reply})

if __name__ == "__main__":
    app.run(debug=True)
