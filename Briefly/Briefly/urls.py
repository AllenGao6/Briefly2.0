
from django.contrib import admin
from django.urls import path, include
from social_login.views import exchange_token

urlpatterns = [
    path('', include('frontend.urls')),
    path('admin/', admin.site.urls),
    path('auth/<backend>/', exchange_token),
]
