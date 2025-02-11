from django.urls import path, re_path
from .views import (
    TollStationPassesView, 
    PassAnalysisView, 
    PassesCostView, 
    ChargesByView
)

urlpatterns = [
    re_path(r'^tollStationPasses/(?P<tollStationID>\w+)/(?P<date_from>\d{8})(?:/(?P<date_to>\d{8}))?/$', TollStationPassesView.as_view(), name='tollStationPasses'),
    re_path(r'^passAnalysis/(?P<stationOpID>\w+)/(?P<tagOpID>\w+)/(?P<date_from>\d{8})(?:/(?P<date_to>\d{8}))?/$', PassAnalysisView.as_view(), name='passAnalysis'),
    re_path(r'^passesCost/(?P<tollOpID>\w+)/(?P<tagOpID>\w+)/(?P<date_from>\d{8})(?:/(?P<date_to>\d{8}))?/$', PassesCostView.as_view(), name='passesCost'),
    re_path(r'^chargesBy/(?P<tollOpID>\w+)/(?P<date_from>\d{8})(?:/(?P<date_to>\d{8}))?/$', ChargesByView.as_view(), name='chargesBy'),
]