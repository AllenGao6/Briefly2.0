# Generated by Django 3.1.12 on 2021-06-27 07:22

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_signed_in', models.BooleanField(default=False)),
                ('phone_number', models.CharField(default='Not provided', max_length=12)),
                ('education', models.CharField(default='Not provided', max_length=50)),
                ('location', models.CharField(default='Not provided', max_length=50)),
                ('profession', models.CharField(default='Not provided', max_length=50)),
                ('total_limit', models.IntegerField(default=0)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='userprofile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
