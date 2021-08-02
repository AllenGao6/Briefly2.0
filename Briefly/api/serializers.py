from rest_framework import serializers
from .models import Video, Collection, Audio, Text

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = "__all__"
'''
class AudioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Audio
        fields = "__all__"
'''

class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        fields = ('id',
                'owner',
                'name',
                'description',
                'is_archived',
                'created',
                'image',
                'get_owner_name',
                )
        
    
        
class AudioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Audio
        fields = "__all__"
        
class TextSerializer(serializers.ModelSerializer):
    class Meta:
        model = Text
        fields = "__all__"