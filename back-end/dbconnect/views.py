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
        


@authentication_classes([])
@permission_classes([AllowAny])
class AddPassesView(APIView):
    def post(self, request):
        file_path = 'dbconnect/data/passes-sample.csv'  # Διαδρομή προς το CSV αρχείο
        
        # Έλεγχος αν το αρχείο υπάρχει
        try:
            with open(file_path, 'r', encoding='utf-8-sig') as file:
                reader = csv.DictReader(file)  # Διάβασμα του CSV αρχείου
                rows = list(reader)
        except FileNotFoundError:
            return JsonResponse({
                "status": "failed",
                "info": "File not found"
            }, status=400)
        except Exception as e:
            return JsonResponse({
                "status": "failed",
                "info": f"Error opening file: {str(e)}"
            }, status=400)
        
        errors = []
        success_count = 0
        
        try:
            with transaction.atomic():
                for row_num, row in enumerate(rows, start=1):
                    try:
                        # Έλεγχος αν όλα τα απαραίτητα πεδία υπάρχουν στη γραμμή
                        print("CSV Headers:", reader.fieldnames)
                        if not all(key in row for key in ['tagHomeID', 'tagRef', 'tollID', 'timestamp', 'charge']):
                            errors.append(f"Row {row_num}: Missing required fields.")
                            continue

                        # Εξαγωγή πεδίων από το CSV
                        tag_home_id = row['tagHomeID']
                        tag_ref = row['tagRef']
                        toll_id = row['tollID']
                        timestamp = row['timestamp']
                        charge = float(row['charge'])  # Μετατροπή σε float

                        # Προσδιορισμός κωδικού operator από το tagHomeID
                        if tag_home_id.startswith("NA"):
                            operator_code = "NAO"
                        else:
                            operator_code = tag_home_id[:2]

                        # Εύρεση του Operator
                        try:
                            operator = Operator.objects.get(code=operator_code)
                        except Operator.DoesNotExist:
                            errors.append(f"Row {row_num}: Operator με κωδικό '{operator_code}' δεν βρέθηκε.")
                            continue

                        # Δημιουργία/Εύρεση Tag (ελέγχουμε αν υπάρχει ήδη)
                        tag, created = Tag.objects.get_or_create(
                            tagref=tag_ref,
                            operator=operator
                        )

                        # Εύρεση του Tollstation με βάση το tollID
                        try:
                            tollstation = Tollstation.objects.get(tollid=toll_id)
                        except Tollstation.DoesNotExist:
                            errors.append(f"Row {row_num}: Tollstation με tollID '{toll_id}' δεν βρέθηκε.")
                            continue

                        # Δημιουργία Pass
                        Pass.objects.create(
                            timestamp=timestamp,
                            charge=charge,
                            tag=tag,
                            tollstation=tollstation
                        )
                        success_count += 1

                    except ValueError as e:
                        errors.append(f"Row {row_num}: Invalid charge value. {str(e)}")
                    except Exception as e:
                        errors.append(f"Row {row_num}: {str(e)}")

                if errors:
                    return JsonResponse({
                        "status": "partial",
                        "message": f"Επιτυχία: {success_count}, Σφάλματα: {len(errors)}",
                        "errors": errors
                    }, status=207)
                else:
                    return JsonResponse({
                        "status": "success",
                        "message": f"Προστέθηκαν {success_count} εγγραφές."
                    }, status=200)

        except Exception as e:
            return JsonResponse({
                "status": "failed",
                "info": f"Transaction failed: {str(e)}"
            }, status=500)