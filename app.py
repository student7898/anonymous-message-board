from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, UTC

app = Flask(__name__)
CORS(app)
messages = []
MAX_MESSAGES = 50

@app.route("/api/messages", methods=["GET"])
def get_messages():
    return jsonify(messages)

@app.route("/api/messages", methods=["POST"])
def post_message():
    data = request.get_json()
    text = data.get("message", "").strip()
    user_id = data.get("userId", "anonymous")
    if not text:
        return jsonify({"error": "Empty message"}), 400
    new_message = {
        "message": text,
        "userId": user_id,
        "timestamp": datetime.now(UTC).isoformat()
    }
    messages.append(new_message)
    if len(messages) > MAX_MESSAGES:
        del messages[0:len(messages) - MAX_MESSAGES]
    return jsonify({"success": True}), 201

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")