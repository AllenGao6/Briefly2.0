
from .views import GoogleLogin
from django.urls import path, include

urlpatterns = [
    path('google/', GoogleLogin.as_view(), name='google_login')
]