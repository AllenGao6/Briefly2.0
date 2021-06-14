from rest_framework.routers import DefaultRouter
from .views import VideoViewSet, CollectionViewSet

router = DefaultRouter()
router.register('video', VideoViewSet, basename='video')
router.register('collection', CollectionViewSet, basename='collection')