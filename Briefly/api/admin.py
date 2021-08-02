from django.contrib import admin
from .models import Video, Collection, Audio, Text

admin.site.register(Video) 
admin.site.register(Collection) 
admin.site.register(Audio)
admin.site.register(Text)