import csv
from django.http import JsonResponse
from django.db import connection,transaction
from rest_framework.views import APIView
from .models import Operator, Tollstation, Tag, Pass  
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import AllowAny

class HealthCheckView(APIView):
    def get(self, request):
        try:
            # Έλεγχος συνδεσιμότητας με τη βάση δεδομένων
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")  # Απλό ερώτημα για έλεγχο σύνδεσης

            # Αριθμός εγγραφών στους πίνακες
            n_stations = Tollstation.objects.count()
            n_tags = Tag.objects.count()
            n_passes = Pass.objects.count()

            # Connection string (προσαρμόστε ανάλογα με τη βάση δεδομένων σας)
            db_connection = str(connection.settings_dict)

            # Επιστροφή επιτυχούς απάντησης
            response_data = {
                "status": "OK",
                "dbconnection": db_connection,
                "n_stations": n_stations,
                "n_tags": n_tags,
                "n_passes": n_passes,
            }
            return JsonResponse(response_data, status=200)

        except Exception as e:
            # Επιστροφή αποτυχημένης απάντησης
            db_connection = str(connection.settings_dict)
            response_data = {
                "status": "failed",
                "dbconnection": db_connection,
            }
            return JsonResponse(response_data, status=401)
        
@authentication_classes([])
@permission_classes([AllowAny])
class ResetStationsView(APIView):
    def post(self, request):
        file_path = 'dbconnect/data/tollstations2024.csv'  # Διαδρομή προς το CSV αρχείο

        try:
            # Έλεγχος αν το αρχείο υπάρχει
            with open(file_path, 'r', encoding='utf-8') as file:
                pass  # Απλός έλεγχος ύπαρξης
        except FileNotFoundError:
            return JsonResponse({
                "status": "failed",
                "info": "File not found"
            }, status=400)

        try:
            with transaction.atomic():  # Ξεκινήστε μια συναλλαγή
                # Διαγραφή όλων των εγγραφών από τον πίνακα Tollstation
                Tollstation.objects.all().delete()

                # Διαβάστε το CSV αρχείο και εισάγετε τα δεδομένα
                with open(file_path, 'r',encoding='utf-8') as file:
                    reader = csv.DictReader(file)
                    stations = []

                    for row in reader:
                        # Βρείτε τον χειριστή (operator) με βάση το όνομα
                        operator = Operator.objects.filter(name=row['Operator']).first()
                        if not operator:
                            return JsonResponse({
                                "status": "failed",
                                "info": f"Operator '{row['Operator']}' not found"
                            }, status=400)

                        # Δημιουργία του αντικειμένου Tollstation
                        stations.append(Tollstation(
                            name=row['Name'],
                            locality=row['Locality'],
                            road=row['Road'],
                            lat=float(row['Lat']),
                            long=float(row['Long']),
                            price1=float(row['Price1']),
                            price2=float(row['Price2']),
                            price3=float(row['Price3']),
                            price4=float(row['Price4']),
                            operator=operator,
                            tollid=row['TollID']
                        ))

                    # Εισαγωγή όλων των σταθμών στη βάση δεδομένων
                    Tollstation.objects.bulk_create(stations)

                return JsonResponse({
                    "status": "OK"
                })

        except Exception as e:
            return JsonResponse({
                "status": "failed",
                "info": str(e)
            }, status=500)

@authentication_classes([])
@permission_classes([AllowAny])    
class ResetPassesView(APIView):
    def post(self, request):
        try:
            with transaction.atomic():  # Χρήση transaction για ασφάλεια
                # Διαγραφή όλων των tags (εξαρτημένοι πίνακες)
                Tag.objects.all().delete()
                
                # Διαγραφή όλων των passes
                Pass.objects.all().delete()
                
                return JsonResponse({"status": "success", "message": "All passes and dependent data have been reset."})
        except Exception as e:
            return JsonResponse({"status": "failed", "message": f"ProtectedError: {str(e)}"}, status=400)
        except Exception as e:
            return JsonResponse({"status": "failed", "message": str(e)}, status=500)
        