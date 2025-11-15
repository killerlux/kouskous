# DriversApi

All URIs are relative to *https://api.example.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**driversDocumentsPost**](#driversdocumentspost) | **POST** /drivers/documents | Upload driver document metadata (pre-signed upload handled separately)|
|[**driversMeGet**](#driversmeget) | **GET** /drivers/me | Current driver profile|

# **driversDocumentsPost**
> driversDocumentsPost(driversDocumentsPostRequest)


### Example

```typescript
import {
    DriversApi,
    Configuration,
    DriversDocumentsPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DriversApi(configuration);

let driversDocumentsPostRequest: DriversDocumentsPostRequest; //

const { status, data } = await apiInstance.driversDocumentsPost(
    driversDocumentsPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **driversDocumentsPostRequest** | **DriversDocumentsPostRequest**|  | |


### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **driversMeGet**
> Driver driversMeGet()


### Example

```typescript
import {
    DriversApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DriversApi(configuration);

const { status, data } = await apiInstance.driversMeGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Driver**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Driver |  -  |
|**403** | Not a driver |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

