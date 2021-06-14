from django.db import models
from django.contrib.auth.models import User
from django.dispatch import receiver
from django.db.models.signals import post_save
import random, string


class UserProfile(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    is_signed_in = models.BooleanField(default=False)
    phone_number = models.CharField(max_length=12, default="Not provided")
    education = models.CharField(max_length=50,default="Not provided")
    location = models.CharField(max_length=50,default="Not provided")
    profession = models.CharField(max_length=50,default="Not provided")
    
    def __str__(self):
        return self.user.username

@receiver(post_save, sender=User)
def update_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
    instance.userprofile.save()
