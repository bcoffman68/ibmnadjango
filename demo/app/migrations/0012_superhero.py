# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-05-31 16:53
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0011_auto_20170530_2229'),
    ]

    operations = [
        migrations.CreateModel(
            name='SuperHero',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('heroid', models.IntegerField()),
                ('hero', models.CharField(max_length=100)),
                ('Role', models.CharField(max_length=100)),
                ('Efficienyv', models.DecimalField(decimal_places=2, max_digits=5)),
                ('Mitigationv', models.DecimalField(decimal_places=2, max_digits=5)),
                ('Suportv', models.DecimalField(decimal_places=2, max_digits=5)),
                ('Ultimates', models.DecimalField(decimal_places=2, max_digits=5)),
                ('Scalingv', models.DecimalField(decimal_places=2, max_digits=5)),
                ('Productionv', models.DecimalField(decimal_places=2, max_digits=5)),
                ('Depthv', models.DecimalField(decimal_places=2, max_digits=5)),
                ('Funv', models.DecimalField(decimal_places=2, max_digits=5)),
                ('DE', models.DecimalField(decimal_places=2, max_digits=5)),
                ('Fights', models.IntegerField(blank=True, null=True)),
            ],
        ),
    ]
