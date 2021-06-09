from rest_framework.routers import DefaultRouter
from .views import VideoViewSet

router = DefaultRouter()
router.register('video', VideoViewSet, basename='video')
