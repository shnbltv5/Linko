from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from .models import Profile

@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        if not hasattr(instance, 'profile'):
             Profile.objects.create(user=instance)
             print(f"Profile created by signal for user {instance.username}")
        else:
             print(f"Profile already exists for user {instance.username} (signal skipped creation)")
