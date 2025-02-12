from django.urls import path
from .views import (
    TollStationPassesView, 
    PassAnalysisView, 
    PassesCostView, 
    ChargesByView,
    OperatorLoginView,
    TollOperatorListView,
    TollStationActivityView,
    AddPassesView


)

urlpatterns = [
    path('login/', OperatorLoginView.as_view(), name='operator_login'),
    path('addpasses/', AddPassesView.as_view(), name='add_passes'),
    path('tollStationPasses/<str:tollStationID>/<str:date_from>/<str:date_to>/', TollStationPassesView.as_view(), name='tollStationPasses'),
    path('passAnalysis/<str:stationOpID>/<str:tagOpID>/<str:date_from>/<str:date_to>/', PassAnalysisView.as_view(), name='passAnalysis'),
    path('passesCost/<str:tollOpID>/<str:tagOpID>/<str:date_from>/<str:date_to>/', PassesCostView.as_view(), name='passesCost'),
    path('chargesBy/<str:tollOpID>/<str:date_from>/<str:date_to>/', ChargesByView.as_view(), name='chargesBy'),
    path('tolloperators/', TollOperatorListView.as_view(), name='toll_operators'),
    path('tollstations/activity/<str:operator_id>/<str:date_from>/<str:date_to>/', TollStationActivityView.as_view(),name='tollstation-activity'),

]
