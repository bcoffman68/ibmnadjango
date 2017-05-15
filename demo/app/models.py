from __future__ import unicode_literals
from django.db import models

class Technologies(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Demos(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField()
    technologies = models.ManyToManyField(Technologies)
    path = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.name

class Person(models.Model):
    gender_c = (
        ('M', 'Male'),
        ('F', 'Female'),
    )

    marital_c = (
        ('M', 'Married'),
        ('S', 'Single'),
        ('O', 'Other')
    )

    job_c = (
        ('ex','Executive'),
        ('ho', 'Hospitality'),
        ('ot', 'Other'),
        ('pr', 'Professional'),
        ('re', 'Retail'),
        ('rr', 'Retired'),
        ('sa', 'Sales'),
        ('st', 'Student'),
        ('tr', 'Trades'),
    )

    age_c = []
    for a in range(20, 70, 5):
        age_c.append([a, a])


    name = models.CharField(max_length=100)
    gender = models.CharField(max_length=1, choices=gender_c)
    marital = models.CharField(max_length=1, choices=marital_c)
    age = models.IntegerField(choices=age_c)
    job = models.CharField(max_length=2, choices=job_c)

    def __str__(self):
        return self.name

class camping_results(models.Model):
    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    rawprediction = models.TextField()
    product = models.CharField(max_length=30)
    prediction = models.FloatField()



class api_params(models.Model):
    api_name = models.CharField(max_length=30, default='')
    api_id = models.CharField(max_length=255, null=True)
    version = models.CharField(max_length=255, null=True)
    service_path = models.CharField(max_length=255, null=True)
    username = models.CharField(max_length=255, null=True)
    password = models.CharField(max_length=255, null=True)
    endpoint = models.CharField(max_length=255, null=True)
    notes = models.TextField(null=True)