from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User


def validate_video(video):
    limit_mb = 200
    file_size = video.size 
    if file_size> limit_mb * 1024 * 1024:
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