from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from django.core.validators import validate_image_file_extension, FileExtensionValidator
from Briefly import settings
from django.http import JsonResponse
   
#Collection model
def upload_image_name(instance, filename):
    collection_dir = "Collection"+str(instance.id)
    url_path = [collection_dir,'coverImage', filename]
    print('/'.join(url_path))
    return '/'.join(url_path)

def validate_image(image):
    limit_mb = 10
    file_size = image.size 
    if file_size > limit_mb * 1024 * 1024:
        raise ValidationError(f"maximum size is {limit_mb} mb")


#collection model
class Collection(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100, blank=False, default='My Collection')
    description = models.CharField(max_length=1000, blank=True, default='')
    is_archived =  models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to=upload_image_name,validators=[validate_image,validate_image_file_extension],null=True,blank=True)
    def __str__(self):
        return f"Collection: {self.id}-{self.name}"

    # # validation purpose
    # def clean(self):
    #     if not self.owner.userprofile.validate_total_limit():
    #         raise ValidationError(f"You have reached the limit {settings.MAX_SIZE_PER_USER//1024} mb by {self.owner.userprofile.total_limit//1024//1024} mb")
    
    def get_owner_name(self):
        return self.owner.first_name

def validate_video(video):
    limit_mb = 200
    file_size = video.size 
    if file_size > limit_mb * 1024 * 1024:
        raise ValidationError(f"maximum size is {limit_mb} mb")



#video model
# def upload_video_name(instance, filename):
#     collection_dir = "Collection"+str(instance.collection.id)
#     video_id = str(instance.id)
#     url_path = [collection_dir, 'video', video_id, filename]
#     return '/'.join(url_path)

def upload_video_audioText_name(instance, filename):
    collection_dir = "Collection"+str(instance.collection.id)
    video_id = str(instance.id)
    url_path = [collection_dir, 'video', video_id, "audioText.txt"]  # assume the format is in txt, change if need
    return '/'.join(url_path)

class Video(models.Model):
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    is_archived = models.BooleanField(blank=True, default=False)
    is_summarized = models.BooleanField(blank=True, default=False)
    video = models.URLField(max_length=255,null=True, blank=True)
    transcript = models.URLField(max_length=200, null=True, blank=True)
    summarization = models.JSONField(null=True, blank=True)
    created = models.DateField(auto_now_add=True)
    audioText = models.FileField(upload_to=upload_video_audioText_name, null=True, blank=True)
    #TODO
    fileSize = models.IntegerField(null=True, blank=True)
    
    def __str__(self):
        return f"Video: {self.title}"
    
#audio model
# def upload_audio_name(instance, filename):
#     collection_dir = "Collection"+str(instance.collection.id)
#     video_id = str(instance.id)
#     url_path = [collection_dir, 'audio', video_id, filename]
#     return '/'.join(url_path)

def upload_audio_audioText_name(instance, filename):
    collection_dir = "Collection"+str(instance.collection.id)
    audio_id = str(instance.id)
    url_path = [collection_dir, 'audio', audio_id, "audioText.txt"]  # assume the format is in txt, change if need
    return '/'.join(url_path)

class Audio(models.Model):
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    is_archived = models.BooleanField(blank=True, default=False)
    is_summarized = models.BooleanField(blank=True, default=False)
    audio = models.URLField(max_length=255, null=True, blank=True)
    transcript = models.URLField(max_length=200, null=True, blank=True)
    summarization = models.JSONField(null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    audioText = models.FileField(upload_to=upload_video_audioText_name, null=True, blank=True)
    fileSize = models.IntegerField(null=True, blank=True)
    def __str__(self):
        return f"Audio: {self.title}"

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