from django.urls import path, include
from .views import upload_video
from .routers import router, collection_router
from django.conf.urls import url
from .views import VideoViewSet


urlpatterns = [
     path('upload-video/', upload_video, name='upload_video'),
     path('', include(router.urls)),
     path('', include(collection_router.urls)),
     
     
     #The following is for nested url test, now use DRF-Nested-Routers instead
     #url(r'^collection/(?P<collection_pk>\d+)/video/?$', 
     #    VideoViewSet.as_view({'get': 'list'}), name='collection-video-list'),
     #url(r'^collection/(?P<collection_pk>\d+)/video/(?P<pk>\d+)/?$', 
     #    VideoViewSet.as_view({'get': 'retrieve'}), name='collection-video-detail'),
]
