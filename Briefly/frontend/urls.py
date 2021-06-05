from django.urls import path, re_path
from .views import index

urlpatterns = [
    path('', index),
    path('not-found/', index),
    path('dashboard/', index),
    path('home/', index),
]

