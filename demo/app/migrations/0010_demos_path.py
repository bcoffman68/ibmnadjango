# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-05-10 22:08
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0009_auto_20170510_2157'),
    ]

    operations = [
        migrations.AddField(
            model_name='demos',
            name='path',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
