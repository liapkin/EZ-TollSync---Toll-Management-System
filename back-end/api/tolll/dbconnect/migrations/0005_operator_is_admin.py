# Generated by Django 4.2 on 2025-02-10 15:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dbconnect', '0004_operator_password'),
    ]

    operations = [
        migrations.AddField(
            model_name='operator',
            name='is_admin',
            field=models.BooleanField(default=False),
        ),
    ]
