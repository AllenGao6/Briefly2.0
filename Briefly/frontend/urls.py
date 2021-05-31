from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('login', index),
    path('about-us', index),
    path('dashboard', index),
    path('home', index),
]

