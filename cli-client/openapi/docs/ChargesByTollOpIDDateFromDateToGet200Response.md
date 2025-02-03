# ChargesByTollOpIDDateFromDateToGet200Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**toll_op_id** | **str** |  | [optional] 
**request_timestamp** | **str** |  | [optional] 
**period_from** | **str** |  | [optional] 
**period_to** | **str** |  | [optional] 
**v_op_list** | [**List[ChargesByTollOpIDDateFromDateToGet200ResponseVOpListInner]**](ChargesByTollOpIDDateFromDateToGet200ResponseVOpListInner.md) |  | [optional] 

## Example

```python
from openapi_client.models.charges_by_toll_op_id_date_from_date_to_get200_response import ChargesByTollOpIDDateFromDateToGet200Response

# TODO update the JSON string below
json = "{}"
# create an instance of ChargesByTollOpIDDateFromDateToGet200Response from a JSON string
charges_by_toll_op_id_date_from_date_to_get200_response_instance = ChargesByTollOpIDDateFromDateToGet200Response.from_json(json)
# print the JSON string representation of the object
print(ChargesByTollOpIDDateFromDateToGet200Response.to_json())

# convert the object into a dict
charges_by_toll_op_id_date_from_date_to_get200_response_dict = charges_by_toll_op_id_date_from_date_to_get200_response_instance.to_dict()
# create an instance of ChargesByTollOpIDDateFromDateToGet200Response from a dict
charges_by_toll_op_id_date_from_date_to_get200_response_from_dict = ChargesByTollOpIDDateFromDateToGet200Response.from_dict(charges_by_toll_op_id_date_from_date_to_get200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


