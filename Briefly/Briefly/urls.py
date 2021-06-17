from django.contrib import admin
from django.urls import path, include
from social_login.views import logout_view, login_view, exchange_token
from api.routers import router
from django.conf.urls.static import static
from django.conf import settings
urlpatterns = [
    path('', include('frontend.urls')),
    path('admin/', admin.site.urls),
    path('auth/<backend>/', login_view),
    path('logout/', logout_view),
    path('api/', include('api.urls'))

]  + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
