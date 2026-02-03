from django.urls import path
from . import views
from .api_views import (
    register_api,
    login_api,
    send_otp,
    verify_otp,
    reset_password_api,
    chat,
    contact_form_api,
    google_oauth_start,
    google_oauth_callback,
    linkedin_oauth_start,
    linkedin_oauth_callback,
)

urlpatterns = [
    # Template views
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('dashboard/', views.dashboard_view, name='dashboard'),
    path('verify-otp/', views.verify_otp_view, name='verify_otp'),
    path('contact-admin/', views.contact_admin, name='contact_admin'),

    # API endpoints
    path('api/register/', register_api, name='api_register'),
    path('api/login/', login_api, name='api_login'),
    path('api/send-otp/', send_otp, name='send_otp'),
    path('api/verify-otp/', verify_otp, name='api_verify_otp'),
    path('api/reset-password/', reset_password_api, name='reset_password'),
    path('api/chat', chat, name='api_chat'),  # ⭐ Chatbot endpoint
    path('api/contact/', contact_form_api, name='contact_form_api'),

    # Social OAuth
    path('oauth/google/', google_oauth_start, name='google_oauth_start'),
    path('oauth/google/callback/', google_oauth_callback, name='google_oauth_callback'),
    path('oauth/linkedin/', linkedin_oauth_start, name='linkedin_oauth_start'),
    path('oauth/linkedin/callback/', linkedin_oauth_callback, name='linkedin_oauth_callback'),
]