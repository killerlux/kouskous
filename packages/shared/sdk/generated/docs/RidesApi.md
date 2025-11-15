# RidesApi

All URIs are relative to *https://api.example.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**ridesIdCancelPost**](#ridesidcancelpost) | **POST** /rides/{id}/cancel | Cancel ride|
|[**ridesIdCompletePost**](#ridesidcompletepost) | **POST** /rides/{id}/complete | Driver completes the ride and records cash|
|[**ridesIdGet**](#ridesidget) | **GET** /rides/{id} | Get ride by id|
|[**ridesIdStartPost**](#ridesidstartpost) | **POST** /rides/{id}/start | Driver starts the ride|
|[**ridesPost**](#ridespost) | **POST** /rides | Request a ride|

# **ridesIdCancelPost**
> ridesIdCancelPost()


### Example

```typescript
import {
    RidesApi,
    Configuration,
    RidesIdCancelPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new RidesApi(configuration);

let id: string; // (default to undefined)
let ridesIdCancelPostRequest: RidesIdCancelPostRequest; // (optional)

const { status, data } = await apiInstance.ridesIdCancelPost(
    id,
    ridesIdCancelPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **ridesIdCancelPostRequest** | **RidesIdCancelPostRequest**|  | |
| **id** | [**string**] |  | defaults to undefined|


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
|**204** | Cancelled |  -  |
|**400** | Cannot cancel in current state |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **ridesIdCompletePost**
> ridesIdCompletePost(ridesIdCompletePostRequest)


### Example

```typescript
import {
    RidesApi,
    Configuration,
    RidesIdCompletePostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new RidesApi(configuration);

let id: string; // (default to undefined)
let ridesIdCompletePostRequest: RidesIdCompletePostRequest; //

const { status, data } = await apiInstance.ridesIdCompletePost(
    id,
    ridesIdCompletePostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **ridesIdCompletePostRequest** | **RidesIdCompletePostRequest**|  | |
| **id** | [**string**] |  | defaults to undefined|


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
|**204** | Completed |  -  |
|**403** | Not the assigned driver |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **ridesIdGet**
> Ride ridesIdGet()


### Example

```typescript
import {
    RidesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RidesApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.ridesIdGet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**Ride**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Ride |  -  |
|**404** | Ride not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **ridesIdStartPost**
> ridesIdStartPost()


### Example

```typescript
import {
    RidesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RidesApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.ridesIdStartPost(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | Started |  -  |
|**403** | Not the assigned driver |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **ridesPost**
> Ride ridesPost(ridesPostRequest)


### Example

```typescript
import {
    RidesApi,
    Configuration,
    RidesPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new RidesApi(configuration);

let ridesPostRequest: RidesPostRequest; //

const { status, data } = await apiInstance.ridesPost(
    ridesPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **ridesPostRequest** | **RidesPostRequest**|  | |


### Return type

**Ride**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Ride created |  -  |
|**429** | Rate limit exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

