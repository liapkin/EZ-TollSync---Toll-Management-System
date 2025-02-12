import csv
from datetime import datetime
from django.http import JsonResponse
from django.db import connection, transaction
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth.hashers import check_password
from .models import Operator, Tollstation, Tag, Pass
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import AllowAny
from urllib.parse import unquote
from .models import Tollstation, Pass
from django.db.models import Count, Sum, Q
from django.http import JsonResponse


@authentication_classes([])
@permission_classes([AllowAny])
class TollStationActivityView(APIView):
    def get(self, request, operator_id=None, date_from=None, date_to=None):
        try:
            try:
                # First try format (YYYYMMDD)
                date_from = timezone.make_aware(
                    datetime.strptime(date_from, "%Y%m%d"),
                    timezone.get_current_timezone()
                )
                date_to = timezone.make_aware(
                    datetime.strptime(date_to, "%Y%m%d"),
                    timezone.get_current_timezone()
                )
            except ValueError:
                # If that fails, try your original format
                date_from = timezone.make_aware(
                    datetime.strptime(unquote(date_from), "%Y-%m-%d %H:%M"),
                    timezone.get_current_timezone()
                )
                date_to = timezone.make_aware(
                    datetime.strptime(unquote(date_to), "%Y-%m-%d %H:%M"),
                    timezone.get_current_timezone()
                )

            stations = Tollstation.objects.annotate(
                pass_count=Count('pass', filter=Q(
                    pass__timestamp__range=[date_from, date_to]
                )),
                station_charges=Sum('pass__charge', filter=Q(
                    pass__timestamp__range=[date_from, date_to]
                ), default=0)
            )

            if operator_id and operator_id != 'admin':
                stations = stations.filter(operator__code=operator_id)

            stations_data = []
            total_passes = 0
            total_charges = 0

            for station in stations:
                total_passes += station.pass_count
                station_charges = float(station.station_charges or 0)
                total_charges += station_charges

                stations_data.append({
                    'tollid': station.tollid,
                    'name': station.name,
                    'lat': station.lat,
                    'long': station.long,
                    'pass_count': station.pass_count,
                    'total_charges': station_charges
                })

            return JsonResponse(stations_data, safe=False)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


class TollOperatorListView(APIView):
    def get(self, request):
        operators = Operator.objects.filter(is_admin=False)
        data = [{
            "code": op.code,
            "name": op.name
        } for op in operators]
        return Response(data)


class OperatorLoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({"error": "Email and password are required."},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            operator = Operator.objects.get(email=email)
        except Operator.DoesNotExist:
            return Response({"error": "Invalid credentials."},
                            status=status.HTTP_401_UNAUTHORIZED)

        if not check_password(password, operator.password):
            return Response({"error": "Invalid credentials."},
                            status=status.HTTP_401_UNAUTHORIZED)

        token = f"operator-{operator.id}"
        role = "admin" if operator.is_admin else "operator"

        return Response({
            "token": token,
            "operator_id": operator.id,
            "name": operator.name,
            "role": "admin" if operator.is_admin else "operator",
            "code": operator.code
        }, status=status.HTTP_200_OK)


class HealthCheckView(APIView):
    def get(self, request):
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")

            n_stations = Tollstation.objects.count()
            n_tags = Tag.objects.count()
            n_passes = Pass.objects.count()

            db_connection = str(connection.settings_dict)

            response_data = {
                "status": "OK",
                "dbconnection": db_connection,
                "n_stations": n_stations,
                "n_tags": n_tags,
                "n_passes": n_passes,
            }
            return JsonResponse(response_data, status=200)

        except Exception as e:
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
        file_path = 'dbconnect/data/tollstations2024.csv'

        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                pass
        except FileNotFoundError:
            return JsonResponse({
                "status": "failed",
                "info": "File not found"
            }, status=400)

        try:
            with transaction.atomic():
                Tollstation.objects.all().delete()

                with open(file_path, 'r', encoding='utf-8') as file:
                    reader = csv.DictReader(file)
                    stations = []

                    for row in reader:
                        operator = Operator.objects.filter(name=row['Operator']).first()
                        if not operator:
                            return JsonResponse({
                                "status": "failed",
                                "info": f"Operator '{row['Operator']}' not found"
                            }, status=400)

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
            with transaction.atomic():
                Tag.objects.all().delete()
                Pass.objects.all().delete()
                return JsonResponse({"status": "success", "info": "All passes and dependent data have been reset."})
        except Exception as e:
            return JsonResponse({"status": "failed", "info": f"ProtectedError: {str(e)}"}, status=400)
        except Exception as e:
            return JsonResponse({"status": "failed", "info": str(e)}, status=500)


@authentication_classes([])
@permission_classes([AllowAny])
class AddPassesView(APIView):
    def post(self, request):
        file_path = 'dbconnect/data/passes41.csv'

        try:
            with open(file_path, 'r', encoding='utf-8-sig') as file:
                reader = csv.DictReader(file)
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
                        print("CSV Headers:", reader.fieldnames)
                        if not all(key in row for key in ['tagHomeID', 'tagRef', 'tollID', 'timestamp', 'charge']):
                            errors.append(f"Row {row_num}: Missing required fields.")
                            continue

                        tag_home_id = row['tagHomeID']
                        tag_ref = row['tagRef']
                        toll_id = row['tollID']
                        timestamp_str = row['timestamp']
                        charge = float(row['charge'])

                        if tag_home_id.startswith("NA"):
                            operator_code = "NAO"
                        else:
                            operator_code = tag_home_id[:2]

                        try:
                            operator = Operator.objects.get(code=operator_code)
                        except Operator.DoesNotExist:
                            errors.append(f"Row {row_num}: Operator με κωδικό '{operator_code}' δεν βρέθηκε.")
                            continue

                        tag, created = Tag.objects.get_or_create(
                            tagref=tag_ref,
                            operator=operator
                        )

                        try:
                            tollstation = Tollstation.objects.get(tollid=toll_id)
                        except Tollstation.DoesNotExist:
                            errors.append(f"Row {row_num}: Tollstation με tollID '{toll_id}' δεν βρέθηκε.")
                            continue

                        timestamp = datetime.strptime(timestamp_str, "%Y-%m-%d %H:%M")

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


@authentication_classes([])
@permission_classes([AllowAny])
class TollStationPassesView(APIView):
    def get(self, request, tollStationID, date_from, date_to):
        try:
            try:
                # First try format (YYYYMMDD)
                date_from = datetime.strptime(date_from, "%Y%m%d")
                date_to = datetime.strptime(date_to, "%Y%m%d")
            except ValueError:
                # If that fails, try your original format
                date_from = datetime.strptime(date_from, "%Y-%m-%d %H:%M")
                date_to = datetime.strptime(date_to, "%Y-%m-%d %H:%M")

            passes = Pass.objects.filter(
                timestamp__range=[date_from, date_to]
            ).select_related(
                'tollstation', 'tag__operator'
            ).filter(
                tollstation__tollid=tollStationID)

            pass_list = []
            for index, p in enumerate(passes, start=1):
                pass_list.append({
                    "passIndex": index,
                    "passID": p.id,
                    "timestamp": p.timestamp,
                    "tagID": p.tag.tagref,
                    "tagProvider": p.tag.operator.name,
                    "passType": "home" if p.tag.operator.id == p.tollstation.operator.id else "visitor",
                    "passCharge": p.charge
                })

            response_data = {
                "stationID": tollStationID,
                "stationOperator": passes.first().tollstation.operator.name if passes else "",
                "requestTimestamp": timezone.now(),
                "periodFrom": date_from,
                "periodTo": date_to,
                "nPasses": len(passes),
                "passList": pass_list
            }

            return JsonResponse(response_data, status=200)

        except Exception as e:
            return JsonResponse({"status": "failed", "info": str(e)}, status=500)


@authentication_classes([])
@permission_classes([AllowAny])
class PassAnalysisView(APIView):
    def get(self, request, stationOpID, tagOpID, date_from, date_to):
        try:
            try:
                # First try format (YYYYMMDD)
                date_from = datetime.strptime(date_from, "%Y%m%d")
                date_to = datetime.strptime(date_to, "%Y%m%d")
            except ValueError:
                # If that fails, try your original format
                date_from = datetime.strptime(date_from, "%Y-%m-%d %H:%M")
                date_to = datetime.strptime(date_to, "%Y-%m-%d %H:%M")

            passes = Pass.objects.filter(
                tollstation__operator__code=stationOpID,
                tag__operator__code=tagOpID,
                timestamp__range=[date_from, date_to]
            )

            pass_list = []
            for index, p in enumerate(passes, start=1):
                pass_list.append({
                    "passIndex": index,
                    "passID": p.id,
                    "stationID": p.tollstation.tollid,
                    "timestamp": p.timestamp,
                    "tagID": p.tag.tagref,
                    "passCharge": p.charge
                })

            response_data = {
                "stationOpID": stationOpID,
                "tagOpID": tagOpID,
                "requestTimestamp": timezone.now(),
                "periodFrom": date_from,
                "periodTo": date_to,
                "nPasses": len(passes),
                "passList": pass_list
            }

            return JsonResponse(response_data, status=200)

        except Exception as e:
            return JsonResponse({"status": "failed", "info": str(e)}, status=500)


@authentication_classes([])
@permission_classes([AllowAny])
class PassesCostView(APIView):
    def get(self, request, tollOpID, tagOpID, date_from, date_to):
        try:
            try:
                # First try format (YYYYMMDD)
                date_from = datetime.strptime(date_from, "%Y%m%d")
                date_to = datetime.strptime(date_to, "%Y%m%d")
            except ValueError:
                # If that fails, try your original format
                date_from = datetime.strptime(date_from, "%Y-%m-%d %H:%M")
                date_to = datetime.strptime(date_to, "%Y-%m-%d %H:%M")

            passes = Pass.objects.filter(
                tollstation__operator__code=tollOpID,
                tag__operator__code=tagOpID,
                timestamp__range=[date_from, date_to]
            )

            total_cost = sum(p.charge for p in passes)

            response_data = {
                "tollOpID": tollOpID,
                "tagOpID": tagOpID,
                "requestTimestamp": timezone.now(),
                "periodFrom": date_from,
                "periodTo": date_to,
                "nPasses": len(passes),
                "passesCost": total_cost
            }

            return JsonResponse(response_data, status=200)

        except Exception as e:
            return JsonResponse({"status": "failed", "info": str(e)}, status=500)


@authentication_classes([])
@permission_classes([AllowAny])
class ChargesByView(APIView):
    def get(self, request, tollOpID, date_from, date_to):
        try:
            try:
                # First try format (YYYYMMDD)
                date_from = datetime.strptime(date_from, "%Y%m%d")
                date_to = datetime.strptime(date_to, "%Y%m%d")
            except ValueError:
                # If that fails, try your original format
                date_from = datetime.strptime(date_from, "%Y-%m-%d %H:%M")
                date_to = datetime.strptime(date_to, "%Y-%m-%d %H:%M")

            operators = Operator.objects.exclude(code=tollOpID)
            vOpList = []

            for operator in operators:
                passes = Pass.objects.filter(
                    tollstation__operator__code=tollOpID,
                    tag__operator=operator,
                    timestamp__range=[date_from, date_to]
                )

                total_cost = sum(p.charge for p in passes)
                vOpList.append({
                    "visitingOpID": operator.code,
                    "nPasses": len(passes),
                    "passesCost": total_cost
                })

            response_data = {
                "tollOpID": tollOpID,
                "requestTimestamp": timezone.now(),
                "periodFrom": date_from,
                "periodTo": date_to,
                "vOpList": vOpList
            }

            return JsonResponse(response_data, status=200)

        except Exception as e:
            return JsonResponse({"status": "failed", "info": str(e)}, status=500)
