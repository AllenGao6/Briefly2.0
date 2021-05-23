
from django.contrib import admin
from django.urls import path, include
#from social_login.views import GoogleLogin
from django.views.generic import TemplateView

urlpatterns = [
    path('', include('frontend.urls')),
    path('admin/', admin.site.urls),
    path('accounts/', include('allauth.urls')),
    path('social-login', TemplateView.as_view(template_name="social_login/index.html"))
    #path('rest-auth/', include('rest_auth.urls')),
    #path('rest-auth/registration/', include('rest_auth.registration.urls')),
    #path('rest-auth/google/', GoogleLogin.as_view(), name='google_login'),
]
