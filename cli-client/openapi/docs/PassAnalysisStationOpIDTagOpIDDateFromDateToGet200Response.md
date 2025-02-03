# PassAnalysisStationOpIDTagOpIDDateFromDateToGet200Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**station_op_id** | **str** |  | [optional] 
**tag_op_id** | **str** |  | [optional] 
**request_timestamp** | **str** |  | [optional] 
**period_from** | **str** |  | [optional] 
**period_to** | **str** |  | [optional] 
**n_passes** | **int** |  | [optional] 
**pass_list** | [**List[PassAnalysisStationOpIDTagOpIDDateFromDateToGet200ResponsePassListInner]**](PassAnalysisStationOpIDTagOpIDDateFromDateToGet200ResponsePassListInner.md) |  | [optional] 

## Example

```python
from openapi_client.models.pass_analysis_station_op_id_tag_op_id_date_from_date_to_get200_response import PassAnalysisStationOpIDTagOpIDDateFromDateToGet200Response

# TODO update the JSON string below
json = "{}"
# create an instance of PassAnalysisStationOpIDTagOpIDDateFromDateToGet200Response from a JSON string
pass_analysis_station_op_id_tag_op_id_date_from_date_to_get200_response_instance = PassAnalysisStationOpIDTagOpIDDateFromDateToGet200Response.from_json(json)
# print the JSON string representation of the object
print(PassAnalysisStationOpIDTagOpIDDateFromDateToGet200Response.to_json())

# convert the object into a dict
pass_analysis_station_op_id_tag_op_id_date_from_date_to_get200_response_dict = pass_analysis_station_op_id_tag_op_id_date_from_date_to_get200_response_instance.to_dict()
# create an instance of PassAnalysisStationOpIDTagOpIDDateFromDateToGet200Response from a dict
pass_analysis_station_op_id_tag_op_id_date_from_date_to_get200_response_from_dict = PassAnalysisStationOpIDTagOpIDDateFromDateToGet200Response.from_dict(pass_analysis_station_op_id_tag_op_id_date_from_date_to_get200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


