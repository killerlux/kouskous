# DepositsApi

All URIs are relative to *https://api.example.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**adminDepositsGet**](#admindepositsget) | **GET** /admin/deposits | List pending deposits for review (admin)|
|[**depositsIdApprovePost**](#depositsidapprovepost) | **POST** /deposits/{id}/approve | Approve a deposit (admin)|
|[**depositsIdRejectPost**](#depositsidrejectpost) | **POST** /deposits/{id}/reject | Reject a deposit (admin)|
|[**depositsPost**](#depositspost) | **POST** /deposits | Submit a deposit receipt for approval|

# **adminDepositsGet**
> AdminDepositsGet200Response adminDepositsGet()


### Example

```typescript
import {
    DepositsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DepositsApi(configuration);

let status: 'submitted' | 'approved' | 'rejected'; // (optional) (default to undefined)
let page: number; // (optional) (default to 1)
let limit: number; // (optional) (default to 20)

const { status, data } = await apiInstance.adminDepositsGet(
    status,
    page,
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **status** | [**&#39;submitted&#39; | &#39;approved&#39; | &#39;rejected&#39;**]**Array<&#39;submitted&#39; &#124; &#39;approved&#39; &#124; &#39;rejected&#39;>** |  | (optional) defaults to undefined|
| **page** | [**number**] |  | (optional) defaults to 1|
| **limit** | [**number**] |  | (optional) defaults to 20|


### Return type

**AdminDepositsGet200Response**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of deposits |  -  |
|**403** | Not admin |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **depositsIdApprovePost**
> depositsIdApprovePost()


### Example

```typescript
import {
    DepositsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DepositsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.depositsIdApprovePost(
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
|**204** | Approved |  -  |
|**403** | Not admin |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **depositsIdRejectPost**
> depositsIdRejectPost()


### Example

```typescript
import {
    DepositsApi,
    Configuration,
    RidesIdCancelPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DepositsApi(configuration);

let id: string; // (default to undefined)
let ridesIdCancelPostRequest: RidesIdCancelPostRequest; // (optional)

const { status, data } = await apiInstance.depositsIdRejectPost(
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
|**204** | Rejected |  -  |
|**403** | Not admin |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **depositsPost**
> depositsPost(depositsPostRequest)


### Example

```typescript
import {
    DepositsApi,
    Configuration,
    DepositsPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DepositsApi(configuration);

let depositsPostRequest: DepositsPostRequest; //

const { status, data } = await apiInstance.depositsPost(
    depositsPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **depositsPostRequest** | **DepositsPostRequest**|  | |


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
|**201** | Submitted |  -  |
|**400** | Driver not locked or amount mismatch |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

