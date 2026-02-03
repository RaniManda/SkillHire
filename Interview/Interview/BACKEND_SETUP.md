# Backend Setup Guide for SkillHire Chatbot

## Quick Start

### 1. Start Django Backend
```bash
cd c:\Users\dell\OneDrive\Desktop\Interview\backend\django-auth-project-main
python manage.py runserver 8000
```

The backend should run at: **http://localhost:8000**

### 2. Create Chat API Endpoint

Add this to `auth_app/api_views.py`:

```python
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
import json

@require_http_methods(["POST"])
def chat(request):
    """Chat endpoint for SkillHire chatbot"""
    try:
        data = json.loads(request.body)
        message = data.get('message', '').strip()
        
        if not message:
            return JsonResponse({'error': 'No message provided'}, status=400)
        
        # Your AI logic here (OpenAI, Gemini, etc.)
        # For now, simple echo response
        reply = f"You said: {message}"
        
        return JsonResponse({
            'reply': reply,
            'message': message,
            'success': True
        })
    except Exception as e:
        return JsonResponse({
            'error': str(e),
            'success': False
        }, status=500)
```

### 3. Add URL Routing

Edit `auth_app/urls.py`:

```python
from django.urls import path
from . import api_views

urlpatterns = [
    # ... existing URLs ...
    path('api/chat', api_views.chat, name='chat'),
]
```

### 4. Update Settings for CORS

Edit `auth_project/settings.py`:

```python
# Add to INSTALLED_APPS
INSTALLED_APPS = [
    # ... existing apps ...
    'corsheaders',
]

# Add CORS Middleware
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    # ... other middleware ...
]

# Allow frontend origin
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite dev server
    "http://localhost:3000",
    "http://127.0.0.1:5173",
]
```

Install CORS package if needed:
```bash
pip install django-cors-headers
```

### 5. Test the Endpoint

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'
```

Expected response:
```json
{
    "reply": "You said: Hello",
    "message": "Hello",
    "success": true
}
```

## Frontend Configuration

The chatbot frontend is configured to call: **http://localhost:8000/api/chat**

Location: `src/components/Chatbot.jsx` (line 6)
```javascript
const BACKEND_URL = "http://localhost:8000/api/chat";
```

## Debugging

### Check Console Logs

1. Open browser DevTools (F12)
2. Go to Console tab
3. Send a message in chatbot
4. Look for logs:
   - 🔄 Connecting to backend
   - 📊 Backend Response Status
   - ✅ Backend API Success (if working)
   - ❌ Backend Error (if failed)

### Common Issues

| Issue | Solution |
|-------|----------|
| Connection refused | Make sure Django is running on port 8000 |
| 404 Not Found | Check URL routing in Django urls.py |
| CORS Error | Add frontend URL to CORS_ALLOWED_ORIGINS |
| 500 Server Error | Check Django server logs for stack trace |
| Empty response | Make sure response includes 'reply' field |

## Production Notes

- Update CORS_ALLOWED_ORIGINS with your production URL
- Use environment variables for API keys
- Add proper authentication if needed
- Implement rate limiting
- Add logging for monitoring

## Support

If chatbot shows demo responses, it means backend is not reachable.
Check the browser console (F12) for detailed error messages.
