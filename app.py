from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)

# IMPORTANT: use threading mode (Windows-safe)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="threading")

@app.route("/")
def user():
    return render_template("user.html")

@app.route("/admin")
def admin():
    return render_template("admin.html")

'''@socketio.on("user_message")
def handle_user_message(msg):
    print("User:", msg)
    emit("admin_receive", msg, broadcast=True)

@socketio.on("admin_message")
def handle_admin_message(msg):
    print("Admin:", msg)
    emit("user_receive", msg, broadcast=True)
'''
@socketio.on("chat_message")
def handle_chat_message(data):
    # broadcast to everyone
    emit("chat_message", data, broadcast=True)

if __name__ == "__main__":
    print("Starting SkillHire Live Chat Server...")
    socketio.run(app, host="127.0.0.1", port=5001)
