
import os
from google import genai

# Load API key
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise RuntimeError("GOOGLE_API_KEY not set")

client = genai.Client(api_key=api_key)

# Choose a valid model
MODEL_NAME = "gemini-2.5-flash"

SYSTEM_INSTRUCTION = (
    "You are a friendly, helpful assistant. "
    "Respond naturally and conversationally, like a chat. "
    "Keep context of back-and-forth conversation."
)

history = []

def build_prompt(history, user_input):
    history.append(f"User: {user_input}")

    prompt = SYSTEM_INSTRUCTION + "\n\n"
    for turn in history:
        prompt += turn + "\n"
    prompt += "Assistant:"

    return prompt

def chat_with_bot(user_input):
    prompt = build_prompt(history, user_input)

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt
    )

    reply = response.text.strip()
    history.append(f"Assistant: {reply}")
    return reply
