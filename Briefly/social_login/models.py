from django.db import models
from django.contrib.auth.models import User
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.core.exceptions import ValidationError




class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="userprofile")
    is_signed_in = models.BooleanField(default=False)
    phone_number = models.CharField(max_length=12, default="Not provided")
    education = models.CharField(max_length=50,default="Not provided")
    location = models.CharField(max_length=50,default="Not provided")
    profession = models.CharField(max_length=50,default="Not provided")
    remaining_size = models.IntegerField(default=200*1024*1024)
    def __str__(self):
        return self.user.username
    

        
    # def validate_total_limit(self):
    #     limit_mb = 2048
    #     if self.total_limit >= limit_mb *1024*1024:
    #         return False
    #     return True
    
    # def get_max_limit(self):
    #     return 
    
@receiver(post_save, sender=User)
def update_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
    instance.userprofile.save()
