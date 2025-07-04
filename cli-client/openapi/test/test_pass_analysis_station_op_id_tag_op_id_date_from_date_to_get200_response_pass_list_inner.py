# coding: utf-8

"""
    Toll Management REST API

    REST API για τη διαχείριση διαλειτουργικότητας διοδίων στους αυτοκινητόδρομους. Περιέχει endpoints για login/logout, διαχείριση διαδοχών διέλευσης, αναλύσεις και διαχειριστικές λειτουργίες. 

    The version of the OpenAPI document: 1.0.0
    Generated by OpenAPI Generator (https://openapi-generator.tech)

    Do not edit the class manually.
"""  # noqa: E501


import unittest

from openapi_client.models.pass_analysis_station_op_id_tag_op_id_date_from_date_to_get200_response_pass_list_inner import PassAnalysisStationOpIDTagOpIDDateFromDateToGet200ResponsePassListInner

class TestPassAnalysisStationOpIDTagOpIDDateFromDateToGet200ResponsePassListInner(unittest.TestCase):
    """PassAnalysisStationOpIDTagOpIDDateFromDateToGet200ResponsePassListInner unit test stubs"""

    def setUp(self):
        pass

    def tearDown(self):
        pass

    def make_instance(self, include_optional) -> PassAnalysisStationOpIDTagOpIDDateFromDateToGet200ResponsePassListInner:
        """Test PassAnalysisStationOpIDTagOpIDDateFromDateToGet200ResponsePassListInner
            include_optional is a boolean, when False only required
            params are included, when True both required and
            optional params are included """
        # uncomment below to create an instance of `PassAnalysisStationOpIDTagOpIDDateFromDateToGet200ResponsePassListInner`
        """
        model = PassAnalysisStationOpIDTagOpIDDateFromDateToGet200ResponsePassListInner()
        if include_optional:
            return PassAnalysisStationOpIDTagOpIDDateFromDateToGet200ResponsePassListInner(
                pass_index = 56,
                pass_id = '',
                station_id = '',
                timestamp = '2024-11-15 12:34',
                tag_id = '',
                pass_charge = 1.337
            )
        else:
            return PassAnalysisStationOpIDTagOpIDDateFromDateToGet200ResponsePassListInner(
        )
        """

    def testPassAnalysisStationOpIDTagOpIDDateFromDateToGet200ResponsePassListInner(self):
        """Test PassAnalysisStationOpIDTagOpIDDateFromDateToGet200ResponsePassListInner"""
        # inst_req_only = self.make_instance(include_optional=False)
        # inst_req_and_optional = self.make_instance(include_optional=True)

if __name__ == '__main__':
    unittest.main()
