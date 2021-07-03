from django.urls import path, re_path
from .views import index

urlpatterns = [
    path('', index),
    path('not-found/', index),
    path('dashboard/', index),
    path('home/', index),
    re_path(r'dashboard/[0-9]*/[video|audio|text]', index),


]

