from rest_framework.routers import DefaultRouter
from .views import VideoViewSet, CollectionViewSet
from rest_framework_nested import routers

router = DefaultRouter()
router.register('collections', CollectionViewSet, basename='collection')

collection_router = routers.NestedSimpleRouter(router,r'collections',lookup='collection')
collection_router.register(r'videos', VideoViewSet, basename='collection-videos')
#router.register('collection/<collection_pk>/video', VideoViewSet, basename='video')
