from rest_framework.routers import DefaultRouter
from .views import VideoViewSet, CollectionViewSet, AudioViewSet
from rest_framework_nested import routers

router = DefaultRouter()
router.register('collection', CollectionViewSet, basename='collection')

collection_router = routers.NestedSimpleRouter(router,r'collection',lookup='collection')
collection_router.register(r'video', VideoViewSet, basename='collection-videos')
collection_router.register(r'audio', AudioViewSet, basename='collection-audios')
#router.register('collection/<collection_pk>/video', VideoViewSet, basename='video')

