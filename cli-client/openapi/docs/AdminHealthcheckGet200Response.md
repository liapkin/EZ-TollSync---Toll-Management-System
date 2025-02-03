# AdminHealthcheckGet200Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**status** | **str** |  | [optional] 
**dbconnection** | **str** |  | [optional] 
**n_stations** | **int** |  | [optional] 
**n_tags** | **int** |  | [optional] 
**n_passes** | **int** |  | [optional] 

## Example

```python
from openapi_client.models.admin_healthcheck_get200_response import AdminHealthcheckGet200Response

# TODO update the JSON string below
json = "{}"
# create an instance of AdminHealthcheckGet200Response from a JSON string
admin_healthcheck_get200_response_instance = AdminHealthcheckGet200Response.from_json(json)
# print the JSON string representation of the object
print(AdminHealthcheckGet200Response.to_json())

# convert the object into a dict
admin_healthcheck_get200_response_dict = admin_healthcheck_get200_response_instance.to_dict()
# create an instance of AdminHealthcheckGet200Response from a dict
admin_healthcheck_get200_response_from_dict = AdminHealthcheckGet200Response.from_dict(admin_healthcheck_get200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


