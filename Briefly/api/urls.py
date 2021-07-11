from django.urls import path, include
from .views import search, get_remaining
from .routers import router, collection_router
from django.conf.urls import url

urlpatterns = [
     path('search/', search),
     path('get-remaining/', get_remaining),
     path('', include(router.urls)),
     path('', include(collection_router.urls)),
     
     
     #The following is for nested url test, now use DRF-Nested-Routers instead
     #url(r'^collection/(?P<collection_pk>\d+)/video/?$', 
     #    VideoViewSet.as_view({'get': 'list'}), name='collection-video-list'),
     #url(r'^collection/(?P<collection_pk>\d+)/video/(?P<pk>\d+)/?$', 
     #    VideoViewSet.as_view({'get': 'retrieve'}), name='collection-video-detail'),
]
