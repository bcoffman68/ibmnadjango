# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-06-06 15:01
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0014_auto_20170531_1659'),
    ]

    operations = [
        migrations.AddField(
            model_name='superherofight',
            name='home',
            field=models.BinaryField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='superherofight',
            name='night',
            field=models.BinaryField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='superherofight',
            name='observers',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
