from django.contrib import admin
from django.urls import path
from django.http import JsonResponse
from django.db import connection
from .models import Operator, Tollstation, Tag, Pass
from dbconnect.views import ResetStationsView, HealthCheckView, ResetPassesView, AddPassesView

# Επεκτείνετε το υπάρχον AdminSite
class CustomAdminSite(admin.AdminSite):
    def get_urls(self):
        # Προσθέστε το custom URL pattern
        urls = super().get_urls()
        custom_urls = [
            path('healthcheck/', self.admin_view(HealthCheckView.as_view()), name='healthcheck'),
            path('resetstations/', self.admin_view(ResetStationsView.as_view()), name='resetstations'),
            path('resetpasses/', self.admin_view(ResetPassesView.as_view()), name='resetpasses'),
            path('addpasses/', self.admin_view(AddPassesView.as_view()), name="addpasses"),
        ]
        return custom_urls + urls

# Αντικαταστήστε το προεπιλεγμένο admin site με το custom admin site
admin.site = CustomAdminSite(name='admin')

admin.site.register(Operator)
admin.site.register(Tollstation)
admin.site.register(Tag)
admin.site.register(Pass)