# AdminHealthcheckGet401Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**status** | **str** |  | [optional] 
**dbconnection** | **str** |  | [optional] 

## Example

```python
from openapi_client.models.admin_healthcheck_get401_response import AdminHealthcheckGet401Response

# TODO update the JSON string below
json = "{}"
# create an instance of AdminHealthcheckGet401Response from a JSON string
admin_healthcheck_get401_response_instance = AdminHealthcheckGet401Response.from_json(json)
# print the JSON string representation of the object
print(AdminHealthcheckGet401Response.to_json())

# convert the object into a dict
admin_healthcheck_get401_response_dict = admin_healthcheck_get401_response_instance.to_dict()
# create an instance of AdminHealthcheckGet401Response from a dict
admin_healthcheck_get401_response_from_dict = AdminHealthcheckGet401Response.from_dict(admin_healthcheck_get401_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


