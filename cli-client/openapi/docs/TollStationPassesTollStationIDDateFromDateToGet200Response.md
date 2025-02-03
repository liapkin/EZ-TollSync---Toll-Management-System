# TollStationPassesTollStationIDDateFromDateToGet200Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**station_id** | **str** |  | [optional] 
**station_operator** | **str** |  | [optional] 
**request_timestamp** | **str** |  | [optional] 
**period_from** | **str** |  | [optional] 
**period_to** | **str** |  | [optional] 
**n_passes** | **int** |  | [optional] 
**pass_list** | [**List[TollStationPassesTollStationIDDateFromDateToGet200ResponsePassListInner]**](TollStationPassesTollStationIDDateFromDateToGet200ResponsePassListInner.md) |  | [optional] 

## Example

```python
from openapi_client.models.toll_station_passes_toll_station_id_date_from_date_to_get200_response import TollStationPassesTollStationIDDateFromDateToGet200Response

# TODO update the JSON string below
json = "{}"
# create an instance of TollStationPassesTollStationIDDateFromDateToGet200Response from a JSON string
toll_station_passes_toll_station_id_date_from_date_to_get200_response_instance = TollStationPassesTollStationIDDateFromDateToGet200Response.from_json(json)
# print the JSON string representation of the object
print(TollStationPassesTollStationIDDateFromDateToGet200Response.to_json())

# convert the object into a dict
toll_station_passes_toll_station_id_date_from_date_to_get200_response_dict = toll_station_passes_toll_station_id_date_from_date_to_get200_response_instance.to_dict()
# create an instance of TollStationPassesTollStationIDDateFromDateToGet200Response from a dict
toll_station_passes_toll_station_id_date_from_date_to_get200_response_from_dict = TollStationPassesTollStationIDDateFromDateToGet200Response.from_dict(toll_station_passes_toll_station_id_date_from_date_to_get200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


