# openapi_client.DefaultApi

All URIs are relative to *https://localhost:9115/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**admin_addpasses_post**](DefaultApi.md#admin_addpasses_post) | **POST** /admin/addpasses | Εισαγωγή νέων διελεύσεων
[**admin_healthcheck_get**](DefaultApi.md#admin_healthcheck_get) | **GET** /admin/healthcheck | Έλεγχος συνδεσιμότητας συστήματος (healthcheck)
[**admin_resetpasses_post**](DefaultApi.md#admin_resetpasses_post) | **POST** /admin/resetpasses | Αρχικοποίηση των διελεύσεων
[**admin_resetstations_post**](DefaultApi.md#admin_resetstations_post) | **POST** /admin/resetstations | Αρχικοποίηση των σταθμών διοδίων
[**charges_by_toll_op_id_date_from_date_to_get**](DefaultApi.md#charges_by_toll_op_id_date_from_date_to_get) | **GET** /chargesBy/{tollOpID}/{date_from}/{date_to} | Διελεύσεις και χρεώσεις λοιπών λειτουργών
[**login_post**](DefaultApi.md#login_post) | **POST** /login | Είσοδος χρήστη (login)
[**logout_post**](DefaultApi.md#logout_post) | **POST** /logout | Έξοδος χρήστη (logout)
[**pass_analysis_station_op_id_tag_op_id_date_from_date_to_get**](DefaultApi.md#pass_analysis_station_op_id_tag_op_id_date_from_date_to_get) | **GET** /passAnalysis/{stationOpID}/{tagOpID}/{date_from}/{date_to} | Ανάλυση διελεύσεων μεταξύ λειτουργών
[**passes_cost_toll_op_id_tag_op_id_date_from_date_to_get**](DefaultApi.md#passes_cost_toll_op_id_tag_op_id_date_from_date_to_get) | **GET** /passesCost/{tollOpID}/{tagOpID}/{date_from}/{date_to} | Κόστος διελεύσεων μεταξύ λειτουργών
[**toll_station_passes_toll_station_id_date_from_date_to_get**](DefaultApi.md#toll_station_passes_toll_station_id_date_from_date_to_get) | **GET** /tollStationPasses/{tollStationID}/{date_from}/{date_to} | Λήψη διελεύσεων για σταθμό διοδίων


# **admin_addpasses_post**
> AdminResetstationsPost200Response admin_addpasses_post(file=file)

Εισαγωγή νέων διελεύσεων

Ενημερώνει τα γεγονότα διέλευσης προσθέτοντας δεδομένα από αρχείο CSV που αποστέλλεται ως multipart/form-data.

### Example


```python
import openapi_client
from openapi_client.models.admin_resetstations_post200_response import AdminResetstationsPost200Response
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://localhost:9115/api
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "https://localhost:9115/api"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.DefaultApi(api_client)
    file = None # bytearray | Το CSV αρχείο με τις διελεύσεις (mime type text/csv) (optional)

    try:
        # Εισαγωγή νέων διελεύσεων
        api_response = api_instance.admin_addpasses_post(file=file)
        print("The response of DefaultApi->admin_addpasses_post:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->admin_addpasses_post: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **file** | **bytearray**| Το CSV αρχείο με τις διελεύσεις (mime type text/csv) | [optional] 

### Return type

[**AdminResetstationsPost200Response**](AdminResetstationsPost200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Επιτυχής εισαγωγή δεδομένων. |  -  |
**400** | Bad Request – Λανθασμένα ή ελλιπή δεδομένα. |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **admin_healthcheck_get**
> AdminHealthcheckGet200Response admin_healthcheck_get()

Έλεγχος συνδεσιμότητας συστήματος (healthcheck)

Ελέγχει την σύνδεση με τη ΒΔ και επιστρέφει πληροφορίες σχετικά με το σύστημα.

### Example


```python
import openapi_client
from openapi_client.models.admin_healthcheck_get200_response import AdminHealthcheckGet200Response
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://localhost:9115/api
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "https://localhost:9115/api"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.DefaultApi(api_client)

    try:
        # Έλεγχος συνδεσιμότητας συστήματος (healthcheck)
        api_response = api_instance.admin_healthcheck_get()
        print("The response of DefaultApi->admin_healthcheck_get:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->admin_healthcheck_get: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

[**AdminHealthcheckGet200Response**](AdminHealthcheckGet200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Επιτυχής σύνδεση με τη ΒΔ. |  -  |
**401** | Αποτυχία σύνδεσης με τη ΒΔ. |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **admin_resetpasses_post**
> AdminResetstationsPost200Response admin_resetpasses_post()

Αρχικοποίηση των διελεύσεων

Διαγραφή όλων των γεγονότων διέλευσης και επαναφορά των σχετικών πινάκων.

### Example


```python
import openapi_client
from openapi_client.models.admin_resetstations_post200_response import AdminResetstationsPost200Response
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://localhost:9115/api
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "https://localhost:9115/api"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.DefaultApi(api_client)

    try:
        # Αρχικοποίηση των διελεύσεων
        api_response = api_instance.admin_resetpasses_post()
        print("The response of DefaultApi->admin_resetpasses_post:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->admin_resetpasses_post: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

[**AdminResetstationsPost200Response**](AdminResetstationsPost200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Επιτυχής επαναφορά. |  -  |
**400** | Bad Request – Λανθασμένα ή ελλιπή δεδομένα. |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **admin_resetstations_post**
> AdminResetstationsPost200Response admin_resetstations_post()

Αρχικοποίηση των σταθμών διοδίων

Επαναφέρει τον πίνακα σταθμών διοδίων χρησιμοποιώντας το αρχείο tollstations2024.csv.

### Example


```python
import openapi_client
from openapi_client.models.admin_resetstations_post200_response import AdminResetstationsPost200Response
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://localhost:9115/api
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "https://localhost:9115/api"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.DefaultApi(api_client)

    try:
        # Αρχικοποίηση των σταθμών διοδίων
        api_response = api_instance.admin_resetstations_post()
        print("The response of DefaultApi->admin_resetstations_post:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->admin_resetstations_post: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

[**AdminResetstationsPost200Response**](AdminResetstationsPost200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Επιτυχής αρχικοποίηση. |  -  |
**400** | Bad Request – Λανθασμένα ή ελλιπή δεδομένα. |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **charges_by_toll_op_id_date_from_date_to_get**
> ChargesByTollOpIDDateFromDateToGet200Response charges_by_toll_op_id_date_from_date_to_get(toll_op_id, date_from, date_to, format=format)

Διελεύσεις και χρεώσεις λοιπών λειτουργών

Επιστρέφει λίστα με τα γεγονότα διέλευσης από οχήματα άλλων operators και το συνολικό κόστος που οφείλουν στον tollOpID.

### Example


```python
import openapi_client
from openapi_client.models.charges_by_toll_op_id_date_from_date_to_get200_response import ChargesByTollOpIDDateFromDateToGet200Response
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://localhost:9115/api
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "https://localhost:9115/api"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.DefaultApi(api_client)
    toll_op_id = 'toll_op_id_example' # str | Το ID του operator του σταθμού διέλευσης
    date_from = 'date_from_example' # str | Η ημερομηνία έναρξης (YYYYMMDD)
    date_to = 'date_to_example' # str | Η ημερομηνία λήξης (YYYYMMDD)
    format = json # str | Ο μορφότυπος εξόδου (optional) (default to json)

    try:
        # Διελεύσεις και χρεώσεις λοιπών λειτουργών
        api_response = api_instance.charges_by_toll_op_id_date_from_date_to_get(toll_op_id, date_from, date_to, format=format)
        print("The response of DefaultApi->charges_by_toll_op_id_date_from_date_to_get:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->charges_by_toll_op_id_date_from_date_to_get: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **toll_op_id** | **str**| Το ID του operator του σταθμού διέλευσης | 
 **date_from** | **str**| Η ημερομηνία έναρξης (YYYYMMDD) | 
 **date_to** | **str**| Η ημερομηνία λήξης (YYYYMMDD) | 
 **format** | **str**| Ο μορφότυπος εξόδου | [optional] [default to json]

### Return type

[**ChargesByTollOpIDDateFromDateToGet200Response**](ChargesByTollOpIDDateFromDateToGet200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json, text/csv

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Επιτυχής ανάκτηση δεδομένων. |  -  |
**204** | Επιτυχής κλήση αλλά χωρίς δεδομένα. |  -  |
**400** | Bad Request – Λανθασμένα ή ελλιπή δεδομένα. |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **login_post**
> LoginPost200Response login_post(username, password)

Είσοδος χρήστη (login)

Επαληθεύει τα διαπιστευτήρια χρήστη και επιστρέφει token σε περίπτωση επιτυχίας.

### Example


```python
import openapi_client
from openapi_client.models.login_post200_response import LoginPost200Response
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://localhost:9115/api
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "https://localhost:9115/api"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.DefaultApi(api_client)
    username = 'username_example' # str | 
    password = 'password_example' # str | 

    try:
        # Είσοδος χρήστη (login)
        api_response = api_instance.login_post(username, password)
        print("The response of DefaultApi->login_post:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->login_post: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **username** | **str**|  | 
 **password** | **str**|  | 

### Return type

[**LoginPost200Response**](LoginPost200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/x-www-form-urlencoded
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Επιτυχής διαπίστευση χρήστη. Επιστρέφει το token. |  -  |
**400** | Bad Request – Λανθασμένα ή ελλιπή διαπιστευτήρια. |  -  |
**401** | Not Authorized – Μη διαπιστευμένος χρήστης. |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **logout_post**
> logout_post(x_observatory_auth)

Έξοδος χρήστη (logout)

Λειτουργία logout, όπου το token παρέχεται στον custom HTTP header X-OBSERVATORY-AUTH.

### Example


```python
import openapi_client
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://localhost:9115/api
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "https://localhost:9115/api"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.DefaultApi(api_client)
    x_observatory_auth = 'x_observatory_auth_example' # str | User access token

    try:
        # Έξοδος χρήστη (logout)
        api_instance.logout_post(x_observatory_auth)
    except Exception as e:
        print("Exception when calling DefaultApi->logout_post: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **x_observatory_auth** | **str**| User access token | 

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Επιτυχής έξοδος (logout) χρήστη. Κενό σώμα απάντησης. |  -  |
**401** | Not Authorized – Μη διαπιστευμένος χρήστης. |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **pass_analysis_station_op_id_tag_op_id_date_from_date_to_get**
> PassAnalysisStationOpIDTagOpIDDateFromDateToGet200Response pass_analysis_station_op_id_tag_op_id_date_from_date_to_get(station_op_id, tag_op_id, date_from, date_to, format=format)

Ανάλυση διελεύσεων μεταξύ λειτουργών

Επιστρέφει την ανάλυση των διελεύσεων που πραγματοποιήθηκαν με tag του tagOpID σε σταθμούς του stationOpID.

### Example


```python
import openapi_client
from openapi_client.models.pass_analysis_station_op_id_tag_op_id_date_from_date_to_get200_response import PassAnalysisStationOpIDTagOpIDDateFromDateToGet200Response
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://localhost:9115/api
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "https://localhost:9115/api"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.DefaultApi(api_client)
    station_op_id = 'station_op_id_example' # str | Το ID του λειτουργού του σταθμού
    tag_op_id = 'tag_op_id_example' # str | Το ID του λειτουργού-παρόχου του tag
    date_from = 'date_from_example' # str | Η ημερομηνία έναρξης (YYYYMMDD)
    date_to = 'date_to_example' # str | Η ημερομηνία λήξης (YYYYMMDD)
    format = json # str | Ο μορφότυπος εξόδου (optional) (default to json)

    try:
        # Ανάλυση διελεύσεων μεταξύ λειτουργών
        api_response = api_instance.pass_analysis_station_op_id_tag_op_id_date_from_date_to_get(station_op_id, tag_op_id, date_from, date_to, format=format)
        print("The response of DefaultApi->pass_analysis_station_op_id_tag_op_id_date_from_date_to_get:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->pass_analysis_station_op_id_tag_op_id_date_from_date_to_get: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **station_op_id** | **str**| Το ID του λειτουργού του σταθμού | 
 **tag_op_id** | **str**| Το ID του λειτουργού-παρόχου του tag | 
 **date_from** | **str**| Η ημερομηνία έναρξης (YYYYMMDD) | 
 **date_to** | **str**| Η ημερομηνία λήξης (YYYYMMDD) | 
 **format** | **str**| Ο μορφότυπος εξόδου | [optional] [default to json]

### Return type

[**PassAnalysisStationOpIDTagOpIDDateFromDateToGet200Response**](PassAnalysisStationOpIDTagOpIDDateFromDateToGet200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json, text/csv

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Επιτυχής ανάκτηση δεδομένων. |  -  |
**204** | Επιτυχής κλήση αλλά χωρίς δεδομένα. |  -  |
**400** | Bad Request – Λανθασμένα ή ελλιπή δεδομένα. |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **passes_cost_toll_op_id_tag_op_id_date_from_date_to_get**
> PassesCostTollOpIDTagOpIDDateFromDateToGet200Response passes_cost_toll_op_id_tag_op_id_date_from_date_to_get(toll_op_id, tag_op_id, date_from, date_to, format=format)

Κόστος διελεύσεων μεταξύ λειτουργών

Επιστρέφει τον αριθμό διελεύσεων και το συνολικό κόστος που οφείλει ο tagOpID στον tollOpID.

### Example


```python
import openapi_client
from openapi_client.models.passes_cost_toll_op_id_tag_op_id_date_from_date_to_get200_response import PassesCostTollOpIDTagOpIDDateFromDateToGet200Response
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://localhost:9115/api
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "https://localhost:9115/api"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.DefaultApi(api_client)
    toll_op_id = 'toll_op_id_example' # str | Το ID του λειτουργού του σταθμού διέλευσης
    tag_op_id = 'tag_op_id_example' # str | Το ID του λειτουργού του tag
    date_from = 'date_from_example' # str | Η ημερομηνία έναρξης (YYYYMMDD)
    date_to = 'date_to_example' # str | Η ημερομηνία λήξης (YYYYMMDD)
    format = json # str | Ο μορφότυπος εξόδου (optional) (default to json)

    try:
        # Κόστος διελεύσεων μεταξύ λειτουργών
        api_response = api_instance.passes_cost_toll_op_id_tag_op_id_date_from_date_to_get(toll_op_id, tag_op_id, date_from, date_to, format=format)
        print("The response of DefaultApi->passes_cost_toll_op_id_tag_op_id_date_from_date_to_get:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->passes_cost_toll_op_id_tag_op_id_date_from_date_to_get: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **toll_op_id** | **str**| Το ID του λειτουργού του σταθμού διέλευσης | 
 **tag_op_id** | **str**| Το ID του λειτουργού του tag | 
 **date_from** | **str**| Η ημερομηνία έναρξης (YYYYMMDD) | 
 **date_to** | **str**| Η ημερομηνία λήξης (YYYYMMDD) | 
 **format** | **str**| Ο μορφότυπος εξόδου | [optional] [default to json]

### Return type

[**PassesCostTollOpIDTagOpIDDateFromDateToGet200Response**](PassesCostTollOpIDTagOpIDDateFromDateToGet200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json, text/csv

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Επιτυχής ανάκτηση δεδομένων. |  -  |
**204** | Επιτυχής κλήση αλλά χωρίς δεδομένα. |  -  |
**400** | Bad Request – Λανθασμένα ή ελλιπή δεδομένα. |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **toll_station_passes_toll_station_id_date_from_date_to_get**
> TollStationPassesTollStationIDDateFromDateToGet200Response toll_station_passes_toll_station_id_date_from_date_to_get(toll_station_id, date_from, date_to, format=format)

Λήψη διελεύσεων για σταθμό διοδίων

Επιστρέφει την ανάλυση των διελεύσεων για τον συγκεκριμένο σταθμό και για την καθορισμένη περίοδο.

### Example


```python
import openapi_client
from openapi_client.models.toll_station_passes_toll_station_id_date_from_date_to_get200_response import TollStationPassesTollStationIDDateFromDateToGet200Response
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://localhost:9115/api
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "https://localhost:9115/api"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.DefaultApi(api_client)
    toll_station_id = 'toll_station_id_example' # str | Το μοναδικό ID του σταθμού διοδίων
    date_from = 'date_from_example' # str | Η ημερομηνία έναρξης (μορφή YYYYMMDD)
    date_to = 'date_to_example' # str | Η ημερομηνία λήξης (μορφή YYYYMMDD)
    format = json # str | Ο μορφότυπος δεδομένων εξόδου (json ή csv) (optional) (default to json)

    try:
        # Λήψη διελεύσεων για σταθμό διοδίων
        api_response = api_instance.toll_station_passes_toll_station_id_date_from_date_to_get(toll_station_id, date_from, date_to, format=format)
        print("The response of DefaultApi->toll_station_passes_toll_station_id_date_from_date_to_get:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->toll_station_passes_toll_station_id_date_from_date_to_get: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **toll_station_id** | **str**| Το μοναδικό ID του σταθμού διοδίων | 
 **date_from** | **str**| Η ημερομηνία έναρξης (μορφή YYYYMMDD) | 
 **date_to** | **str**| Η ημερομηνία λήξης (μορφή YYYYMMDD) | 
 **format** | **str**| Ο μορφότυπος δεδομένων εξόδου (json ή csv) | [optional] [default to json]

### Return type

[**TollStationPassesTollStationIDDateFromDateToGet200Response**](TollStationPassesTollStationIDDateFromDateToGet200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json, text/csv

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Επιτυχής ανάκτηση δεδομένων. |  -  |
**204** | Επιτυχής κλήση αλλά χωρίς δεδομένα. |  -  |
**400** | Bad Request – Λανθασμένα ή ελλιπή δεδομένα. |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

