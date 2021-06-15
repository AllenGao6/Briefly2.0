from .models import Collection, Video
from django.shortcuts import render
from rest_framework import serializers, viewsets
from .serializers import VideoSerializer, CollectionSerializer

from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.authentication import SessionAuthentication, TokenAuthentication

class VideoViewSet(viewsets.ModelViewSet):
    serializer_class = VideoSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    def get_queryset(self):
        """
        This view should return a list of all the videos
        for the currently authenticated user.
        """
        user = self.request.user
        print(user)
        return Video.objects.filter(owner=user)

    # Test
    @action(methods=['get'], detail=False)
    def newest(self, request):
        newest = self.get_queryset().order_by("created").last()
        serializer = self.get_serializer_class()(newest)
        return Response(serializer.data)
    
class CollectionViewSet(viewsets.ModelViewSet):
    serializer_class = CollectionSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get_queryset(self):
        #currently authenticated user
        user = self.request.user
        print(user)
        return Collection.objects.filter(owner=user)
