from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
import random, string

#collection model
class Collection(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100, blank=False, default='My Collection')
    description = models.CharField(max_length=1000, blank=True, default='')
    is_archived =  models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Collection: {self.name}"

def validate_video(video):
    limit_mb = 200
    file_size = video.size 
    if file_size > limit_mb * 1024 * 1024:
        raise ValidationError(f"maximum size is {limit_mb} mb")
   
   
# Create your models here.
class Video(models.Model):
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    is_archived = models.BooleanField(blank=True, default=False)
    video = models.URLField(max_length=200)
    transcript = models.URLField(max_length=200)
    summarization = models.JSONField(null=True, default=None)
    created = models.DateTimeField(auto_now_add=True)
    
    
    def __str__(self):
        return f"Video: {self.title}"
#audio file
'''
class Audio(models.Model):
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    is_archived = models.BooleanField(blank=True, default=False)
    audio = models.URLField(max_length=200)
    transcript = models.URLField(max_length=200)
    summarization = models.JSONField(null=True)
    created = models.DateTimeField(auto_now_add=True)
    
    
    def __str__(self):
        return f"Audio: {self.title}"

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