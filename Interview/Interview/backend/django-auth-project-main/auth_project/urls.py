from django.contrib import admin
from django.urls import path, include
from auth_app.views import home_view

urlpatterns = [
    path('', home_view, name='home'),
    path('admin/', admin.site.urls),
    path('auth/', include('auth_app.urls')),
    path('', include('auth_app.urls')),
]