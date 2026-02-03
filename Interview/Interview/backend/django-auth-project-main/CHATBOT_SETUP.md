# 🚀 SkillHire Chatbot - Complete Backend Setup

## Backend Files Created/Updated

### 1. ✅ API Endpoint Created
**File:** `auth_app/api_views.py`
- Added `chat()` function - main chatbot endpoint
- Added `get_ai_response()` - AI response generator
- Added `get_fallback_response()` - fallback keyword-based responses
- Supports: Gemini API, OpenAI API, Fallback mode

### 2. ✅ URL Route Added
**File:** `auth_app/urls.py`
- Route: `path('api/chat', chat, name='api_chat')`
- Endpoint: `http://localhost:8000/api/chat`

### 3. ✅ CORS Already Enabled
**File:** `auth_project/settings.py`
- `corsheaders` installed
- `CORS_ALLOW_ALL_ORIGINS = True`
- Trusted origins configured

## How to Run

### Step 1: Install Dependencies
```bash
cd c:\Users\dell\OneDrive\Desktop\Interview\backend\django-auth-project-main

# Install required packages (if not already installed)
pip install google-generativeai openai python-dotenv
```

### Step 2: Set Up Environment Variables (Optional)
Create `.env` file in backend directory:
```
GEMINI_API_KEY=your-gemini-key-here
OPENAI_API_KEY=your-openai-key-here
```

### Step 3: Run Django Server
```bash
python manage.py runserver 8000
```

Server should start at: **http://localhost:8000**

## Testing the Endpoint

### Using cURL
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"Hello, what can you help with?\"}"
```

### Expected Response
```json
{
  "message": "Hello, what can you help with?",
  "reply": "Hello! 👋 I'm SkillHire AI assistant. How can I help you with your interview preparation?",
  "success": true
}
```

### Using Python
```python
import requests

response = requests.post('http://localhost:8000/api/chat', 
    json={'message': 'Tell me about DSA'})
print(response.json())
```

## Frontend Configuration

The frontend is already configured to use:
- **Backend URL:** `http://localhost:8000/api/chat`
- **File:** `src/components/Chatbot.jsx` (line 6)

```javascript
const BACKEND_URL = "http://localhost:8000/api/chat";
```

## Features

✅ **Three-Level AI Support:**
1. **Google Gemini API** (if configured)
2. **OpenAI API** (if configured)
3. **Fallback keyword-based responses** (always works)

✅ **Keywords Supported (Fallback Mode):**
- "interview" → Interview preparation
- "hello/hi" → Greeting
- "help" → Show capabilities
- "dsa" → Data Structures info
- "system design" → System Design tips
- "thanks/bye" → Exit messages

✅ **Error Handling:**
- Graceful fallback when APIs unavailable
- Detailed error logging
- CORS enabled for frontend access
- CSRF exempt for API requests

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 404 Not Found | Check URL routing in `urls.py` |
| CORS Error | Verify CORS settings are enabled |
| Empty response | Backend running? Check Django logs |
| Slow response | API keys valid? Network connection OK? |

## Next Steps

1. **Test in Browser:**
   - Open frontend at `http://localhost:5173`
   - Open chatbot (bottom right)
   - Type a message
   - Check browser console (F12) for logs

2. **Add AI Integration:**
   - Get API key from Gemini or OpenAI
   - Add to `.env` file
   - Restart Django server

3. **Monitor:**
   - Check Django console for request logs
   - Browser console (F12) shows API calls

## File Summary

- **api_views.py** - Chatbot endpoint + AI logic
- **urls.py** - Route configuration
- **settings.py** - CORS configuration (already done)

All files are ready to go! Start the backend with:
```bash
python manage.py runserver 8000
```

Happy coding! 🚀
