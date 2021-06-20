from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
import random, string


   
#Collection model
def upload_image_name(instance, filename):
    collection_dir = "Collection"+str(instance.id)
    url_path = [collection_dir,'coverImage', filename]
    print('/'.join(url_path))
    return '/'.join(url_path)

#collection model
class Collection(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100, blank=False, default='My Collection')
    description = models.CharField(max_length=1000, blank=True, default='')
    is_archived =  models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to=upload_image_name,null=True,blank=True)
    def __str__(self):
        return f"Collection: {self.id}-{self.name}"

def validate_video(video):
    limit_mb = 200
    file_size = video.size 
    if file_size > limit_mb * 1024 * 1024:
        raise ValidationError(f"maximum size is {limit_mb} mb")



#video model
def upload_video_name(instance, filename):
    collection_dir = "Collection"+str(instance.collection.id)
    video_id = str(instance.id)
    url_path = [collection_dir, 'video', video_id, filename]
    return '/'.join(url_path)

class Video(models.Model):
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    is_archived = models.BooleanField(blank=True, default=False)
    video = models.FileField(upload_to=upload_video_name, null=True, blank=True)
    transcript = models.URLField(max_length=200, null=True, blank=True)
    summarization = models.JSONField(null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    
    
    def __str__(self):
        return f"Video: {self.title}"
    
#audio model
def upload_audio_name(instance, filename):
    collection_dir = str(instance.collection)
    video_id = str(instance.id)
    url_path = ['video', collection_dir, video_id, filename]
    return '/'.join(url_path)

"""
class Video(models.Model):
    id = models.AutoField(primary_key=True)
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    is_archived = models.BooleanField(blank=True, default=False)
    audio = models.FileField(upload_to=upload_audio_name)
    transcript = models.URLField(max_length=200, null=True, blank=True)
    summarization = models.JSONField(null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    
    
    def __str__(self):
        return f"Audio: {self.title}"
"""
'''
#Text File
class Text(models.Model):
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    is_archived = models.BooleanField(blank=True, default=False)
    text = models.URLField(max_length=200)
    transcript = models.URLField(max_length=200)
    summarization = models.JSONField(null=True)
    created = models.DateTimeField(auto_now_add=True)
    
    
    def __str__(self):
        return f"Text: {self.title}"
'''