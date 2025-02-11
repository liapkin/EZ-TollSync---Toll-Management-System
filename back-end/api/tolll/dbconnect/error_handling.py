from rest_framework.response import Response
from rest_framework import status

# Βασική κλάση για API Responses
class ApiResponse:
    def __init__(self, status_msg="OK"):
        self.response_data = {"status": status_msg}
    
    def to_response(self, http_status):
        return Response(self.response_data, status=http_status)

# Επιστροφή όταν όλα είναι εντάξει και περιλαμβάνει στατιστικά δεδομένα
class SuccessWithDataResponse(ApiResponse):
    def __init__(self, dbconnection, n_stations, n_tags, n_passes):
        super().__init__(status_msg="OK")
        self.response_data.update({
            "dbconnection": dbconnection,
            "n_stations": n_stations,
            "n_tags": n_tags,
            "n_passes": n_passes
        })

    def to_response(self):
        return super().to_response(status.HTTP_200_OK)

# Επιστροφή σε περίπτωση επιτυχίας χωρίς δεδομένα
class SuccessNoContentResponse(ApiResponse):
    def __init__(self):
        super().__init__(status_msg="OK")

    def to_response(self):
        return super().to_response(status.HTTP_204_NO_CONTENT)

# Επιστροφή αποτυχίας χωρίς επιπλέον πληροφορίες
class FailedDbConnectionResponse(ApiResponse):
    def __init__(self, dbconnection):
        super().__init__(status_msg="failed")
        self.response_data.update({
            "dbconnection": dbconnection
        })

    def to_response(self):
        return super().to_response(status.HTTP_500_INTERNAL_SERVER_ERROR)

# Επιστροφή αποτυχίας με πληροφορίες για το λόγο αποτυχίας
class FailedWithReasonResponse(ApiResponse):
    def __init__(self, reason):
        super().__init__(status_msg="failed")
        self.response_data.update({
            "info": reason
        })

    def to_response(self, http_status):
        return super().to_response(http_status)

# Επιστροφή σε περίπτωση μη έγκυρης αίτησης (π.χ. λείπουν δεδομένα)
class BadRequestResponse(FailedWithReasonResponse):
    def __init__(self, reason):
        super().__init__(reason)

    def to_response(self):
        return super().to_response(status.HTTP_400_BAD_REQUEST)

# Επιστροφή για μη εξουσιοδοτημένη πρόσβαση
class UnauthorizedResponse(FailedWithReasonResponse):
    def __init__(self, reason="Unauthorized"):
        super().__init__(reason)

    def to_response(self):
        return super().to_response(status.HTTP_401_UNAUTHORIZED)

# Επιστροφή για σφάλματα που αφορούν τον server
class InternalServerErrorResponse(FailedWithReasonResponse):
    def __init__(self, reason="Internal Server Error"):
        super().__init__(reason)

    def to_response(self):
        return super().to_response(status.HTTP_500_INTERNAL_SERVER_ERROR)
