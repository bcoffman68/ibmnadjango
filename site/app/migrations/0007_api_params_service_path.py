# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-05-10 16:06
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0006_api_params_api_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='api_params',
            name='service_path',
            field=models.CharField(max_length=255, null=True),
        ),
    ]