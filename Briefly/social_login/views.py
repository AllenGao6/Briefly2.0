from django.conf import settings
from django.contrib.auth import authenticate, login


from rest_framework import serializers
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from requests.exceptions import HTTPError

from social_django.utils import psa

#from .models import UserProfile
from .serializers import SocialSerializer




@api_view(['POST'])
@permission_classes([AllowAny])
@psa()
def exchange_token(request, backend):
    
    serializer = SocialSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        try:
            nfe = settings.NON_FIELD_ERRORS_KEY
        except AttributeError:
            nfe = 'non_field_errors'

        try:
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
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, 'firstname': user.first_name, 'lastname': user.last_name, 'email': user.email})
            
            
            # if user.is_active:
            #     token, _ = Token.objects.get_or_create(user=user)
            #     #Userprofile is automaticlly created
            #     userProfile = UserProfile.objects.filter(user=user.id)[0]
            #     userProfile.is_signed_in = True
            #     userProfile.save()

            #     return Response({'token': token.key, 'firstname': user.first_name, 'lastname': user.last_name, 'email': user.email})
            # else:
            #     return Response(
            #         {'errors': {nfe: 'This user account is inactive'}},
            #         status=status.HTTP_400_BAD_REQUEST,
            #     )
        else:
            return Response(
                {'errors': {nfe: "Authentication Failed"}},
                status=status.HTTP_400_BAD_REQUEST,
            )
