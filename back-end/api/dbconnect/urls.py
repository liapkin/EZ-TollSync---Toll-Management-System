from django.urls import path
from .views import (
    TollStationPassesView, 
    PassAnalysisView, 
    PassesCostView, 
    ChargesByView
)

urlpatterns = [
    path('tollStationPasses/<str:tollStationID>/<str:date_from>/<str:date_to>/', TollStationPassesView.as_view(), name='tollStationPasses'),
    path('passAnalysis/<str:stationOpID>/<str:tagOpID>/<str:date_from>/<str:date_to>/', PassAnalysisView.as_view(), name='passAnalysis'),
    path('passesCost/<str:tollOpID>/<str:tagOpID>/<str:date_from>/<str:date_to>/', PassesCostView.as_view(), name='passesCost'),
    path('chargesBy/<str:tollOpID>/<str:date_from>/<str:date_to>/', ChargesByView.as_view(), name='chargesBy'),
]