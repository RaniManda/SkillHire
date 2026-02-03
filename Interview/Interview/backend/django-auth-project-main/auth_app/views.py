import json
import random
from django.http import JsonResponse, HttpResponse
from django.contrib.auth import get_user_model, authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.conf import settings
from django.shortcuts import render, redirect

User = get_user_model()

# =============================
# OTP UTILS
# =============================
def generate_otp():
    return str(random.randint(100000, 999999))


# =============================
# API REGISTER (SEND OTP)
# =============================
@csrf_exempt
def api_register(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not all([username, email, password]):
        return JsonResponse({"error": "All fields are required"}, status=400)

    if User.objects.filter(username=username).exists():
        return JsonResponse({"error": "Username already exists"}, status=400)

    if User.objects.filter(email=email).exists():
        return JsonResponse({"error": "Email already exists"}, status=400)

    otp = generate_otp()

    request.session["pending_user"] = {
        "username": username,
        "email": email,
        "password": password,
        "otp": otp,
    }

    send_mail(
        subject="SkillHire Email Verification",
        message=f"Your OTP is: {otp}",
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[email],
        fail_silently=False,
    )

    return JsonResponse(
        {"message": "OTP sent to email"},
        status=200
    )


# =============================
# API VERIFY OTP
# =============================
@csrf_exempt
def api_verify_otp(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    entered_otp = data.get("otp")
    session_data = request.session.get("pending_user")

    if not session_data:
        return JsonResponse({"error": "Session expired"}, status=400)

    if entered_otp != session_data["otp"]:
        return JsonResponse({"error": "Invalid OTP"}, status=400)

    User.objects.create_user(
        username=session_data["username"],
        email=session_data["email"],
        password=session_data["password"],
    )

    del request.session["pending_user"]

    return JsonResponse(
        {"message": "User registered successfully"},
        status=201
    )


# =============================
# API LOGIN (REACT)
# =============================
@csrf_exempt
def api_login(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return JsonResponse({"error": "Email and password required"}, status=400)

    try:
        user_obj = User.objects.get(email=email)
    except User.DoesNotExist:
        return JsonResponse({"error": "Invalid credentials"}, status=401)

    user = authenticate(username=user_obj.username, password=password)

    if not user:
        return JsonResponse({"error": "Invalid credentials"}, status=401)

    return JsonResponse({
        "message": "Login successful",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
        }
    }, status=200)


# ==================================================
# TEMPLATE AUTH (OPTIONAL – KEEP SEPARATE)
# ==================================================

def home_view(request):
    if request.user.is_authenticated:
        return redirect("dashboard")
    return redirect("login")


def register_view(request):
    return render(request, "auth/register.html")


def verify_otp_view(request):
    return render(request, "auth/verify_otp.html")


def login_view(request):
    return render(request, "auth/login.html")


def dashboard_view(request):
    return render(request, "dashboard.html")


def logout_view(request):
    logout(request)
    return redirect("login")


# =============================
# CONTACT ADMIN API
# =============================
@csrf_exempt
def contact_admin(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    name = data.get("name")
    email = data.get("email")
    message = data.get("message")

    if not all([name, email, message]):
        return JsonResponse({"error": "All fields required"}, status=400)

    send_mail(
        subject=f"[SkillHire] Message from {name}",
        message=f"From: {email}\n\n{message}",
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=["skillhire@googlegroups.com"],
        fail_silently=False,
    )

    return JsonResponse({"message": "Message sent successfully"}, status=200)
