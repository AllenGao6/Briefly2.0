from django.urls import path, include
from .views import upload_video
from .routers import router

urlpatterns = [
     path('upload-video/', upload_video, name='upload_video'),
     path('', include(router.urls)),
]
