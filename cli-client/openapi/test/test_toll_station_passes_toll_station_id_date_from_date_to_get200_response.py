# coding: utf-8

"""
    Toll Management REST API

    REST API για τη διαχείριση διαλειτουργικότητας διοδίων στους αυτοκινητόδρομους. Περιέχει endpoints για login/logout, διαχείριση διαδοχών διέλευσης, αναλύσεις και διαχειριστικές λειτουργίες. 

    The version of the OpenAPI document: 1.0.0
    Generated by OpenAPI Generator (https://openapi-generator.tech)

    Do not edit the class manually.
"""  # noqa: E501


import unittest

from openapi_client.models.toll_station_passes_toll_station_id_date_from_date_to_get200_response import TollStationPassesTollStationIDDateFromDateToGet200Response

class TestTollStationPassesTollStationIDDateFromDateToGet200Response(unittest.TestCase):
    """TollStationPassesTollStationIDDateFromDateToGet200Response unit test stubs"""

    def setUp(self):
        pass

    def tearDown(self):
        pass

    def make_instance(self, include_optional) -> TollStationPassesTollStationIDDateFromDateToGet200Response:
        """Test TollStationPassesTollStationIDDateFromDateToGet200Response
            include_optional is a boolean, when False only required
            params are included, when True both required and
            optional params are included """
        # uncomment below to create an instance of `TollStationPassesTollStationIDDateFromDateToGet200Response`
        """
        model = TollStationPassesTollStationIDDateFromDateToGet200Response()
        if include_optional:
            return TollStationPassesTollStationIDDateFromDateToGet200Response(
                station_id = '',
                station_operator = '',
                request_timestamp = '2024-11-15 12:34',
                period_from = '',
                period_to = '',
                n_passes = 56,
                pass_list = [
                    openapi_client.models._toll_station_passes__toll_station_id___date_from___date_to__get_200_response_pass_list_inner._tollStationPasses__tollStationID___date_from___date_to__get_200_response_passList_inner(
                        pass_index = 56, 
                        pass_id = '', 
                        timestamp = '2024-11-15 12:34', 
                        tag_id = '', 
                        tag_provider = '', 
                        pass_type = 'home', 
                        pass_charge = 1.337, )
                    ]
            )
        else:
            return TollStationPassesTollStationIDDateFromDateToGet200Response(
        )
        """

    def testTollStationPassesTollStationIDDateFromDateToGet200Response(self):
        """Test TollStationPassesTollStationIDDateFromDateToGet200Response"""
        # inst_req_only = self.make_instance(include_optional=False)
        # inst_req_and_optional = self.make_instance(include_optional=True)

if __name__ == '__main__':
    unittest.main()
