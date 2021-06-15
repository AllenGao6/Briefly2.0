from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
import random, string

def generate_unique_code():
    length = 7

    while True:
        code = ''.join(random.choices(string.ascii_uppercase, k=length))
        if Collection.objects.filter(code=code).count() == 0:
            break
    return code

def validate_video(video):
    limit_mb = 200
    file_size = video.size 
    if file_size > limit_mb * 1024 * 1024:
        raise ValidationError(f"maximum size is {limit_mb} mb")
   
   
# Create your models here.
class Video(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    className = models.CharField(max_length=50)
    video = models.FileField(upload_to="video/%y",validators=[validate_video])
    created = models.DateTimeField(auto_now_add=True)
    
    
    def __str__(self):
        return f"Video: {self.title}"

#collection model
class Collection(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=8, default=generate_unique_code, unique=True)
    name = models.CharField(max_length=100, blank=False, default='My Collection')
    description = models.CharField(max_length=1000, blank=True, default='')
    is_archived =  models.BooleanField(default=False)
    cover_image =  models.FileField(upload_to="image/%y", null=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Collection: {self.id}"
