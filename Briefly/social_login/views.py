from re import I
from django.conf import settings
from django.shortcuts import redirect

from rest_framework import serializers
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from requests.exceptions import HTTPError

from social_django.utils import psa

from .models import UserProfile
from .serializers import SocialSerializer
from django.contrib.auth import login, logout

@api_view(http_method_names=['POST'])
@permission_classes([AllowAny])
@psa()
def exchange_token(request, backend):
    
    # this will be rarely triggered because it is used to prevent potential bug of out of sync bewteen frontend and backend
    if request.user.is_authenticated is True:
        token, _ = Token.objects.get_or_create(user=request.user)
        #Uerprofile is automaticlly created
        userProfile = UserProfile.objects.filter(user=request.user)[0]
        userProfile.is_signed_in = True
        
        return Response({'token': token.key, 'firstname': request.user.first_name, 'lastname': request.user.last_name, 'email': request.user.email, 'pk': request.user.pk})
            
            
    serializer = SocialSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        try:
            nfe = settings.NON_FIELD_ERRORS_KEY
        except AttributeError:
            nfe = 'non_field_errors'

        try:
            print("hello")
            user = request.backend.do_auth(serializer.validated_data['access_token'])
            
        except HTTPError as e:
 
            return Response(
                {'errors': {
                    'token': 'Invalid token',
                    'detail': str(e),
                }},
                status=status.HTTP_400_BAD_REQUEST,
            )
            
        if user:
            login(request, user)
            print("if user:")
            print(user)
            if user.is_active:
                token, _ = Token.objects.get_or_create(user=user)
                #Uerprofile is automaticlly created
                userProfile = UserProfile.objects.filter(user=user.id)[0]
                userProfile.is_signed_in = True
                userProfile.save()

                return Response({'token': token.key, 'firstname': user.first_name, 'lastname': user.last_name, 'email': user.email})
            else:
                return Response(
                    {'errors': {nfe: 'This user account is inactive'}},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(
                {'errors': {nfe: "Authentication Failed"}},
                status=status.HTTP_400_BAD_REQUEST,
            )
            
            
@api_view(['GET'])
@permission_classes([AllowAny])
def logout_view(request): 
    if request.user.is_authenticated is True:
        print("logging out")
        logout(request)
    # Redirect to a success page.
    return Response({"Message": 'Logout Success!'})


@api_view(['POST','GET'])
@permission_classes([AllowAny])
def login_view(request, backend):
    print(request.user)
    print("here")
    if request.user.is_authenticated:
        print("have already logined ")
        print(f'USER:{request.user.pk}')
        token, _ = Token.objects.get_or_create(user=request.user)
        userProfile = UserProfile.objects.filter(user=request.user)[0]
        userProfile.is_signed_in = True
        userProfile.save()
        return Response({'token': token.key, 'firstname': request.user.first_name, 'lastname': request.user.last_name, 'email': request.user.email, 'pk': request.user.pk})
    else:
        print("logging or registering...")
        
        # request must be an instance of `django.http.HttpRequest`, not `rest_framework.request.Request`.
        return exchange_token(request._request, backend)