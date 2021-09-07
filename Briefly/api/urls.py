from django.urls import path, include
from .views import search, get_remaining, OpenAiEndpoint
from .routers import router, collection_router
from django.conf.urls import url

urlpatterns = [
     path('search/', search),
     path('get-remaining/', get_remaining),
     path('', include(router.urls)),
     path('', include(collection_router.urls)),
     path('collection/<int:collection_id>/video/<int:media_id>/question_ans/', OpenAiEndpoint.as_view(), {'media': 'video'} ),
     path('collection/<int:collection_id>/audio/<int:media_id>/question_ans/', OpenAiEndpoint.as_view(), {'media': 'audio'}),
     path('collection/<int:collection_id>/text/<int:media_id>/question_ans/', OpenAiEndpoint.as_view(), {'media': 'text'}),
     
     #The following is for nested url test, now use DRF-Nested-Routers instead
     #url(r'^collection/(?P<collection_pk>\d+)/video/?$', 
     #    VideoViewSet.as_view({'get': 'list'}), name='collection-video-list'),
     #url(r'^collection/(?P<collection_pk>\d+)/video/(?P<pk>\d+)/?$', 
     #    VideoViewSet.as_view({'get': 'retrieve'}), name='collection-video-detail'),
]
