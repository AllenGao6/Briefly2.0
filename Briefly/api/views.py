from .models import Video
from django.shortcuts import render
from rest_framework import serializers, viewsets
from .serializers import VideoSerializer

from rest_framework.response import Response
from rest_framework.decorators import action


class VideoViewSet(viewsets.ModelViewSet):
    serializer_class = VideoSerializer
        
    def get_queryset(self):
        """
        This view should return a list of all the videos
        for the currently authenticated user.
        """
        user = self.request.user
        return Video.objects.filter(owner=user)

    # Test
    @action(methods=['get'], detail=False)
    def newest(self, request):
        newest = self.get_queryset().order_by("created").last()
        serializer = self.get_serializer_class()(newest)
        return Response(serializer.data)
    
    