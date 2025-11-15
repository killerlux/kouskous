# AuthApi

All URIs are relative to *https://api.example.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**authExchangeTokenPost**](#authexchangetokenpost) | **POST** /auth/exchange-token | Exchange OTP for JWT|
|[**authVerifyPhonePost**](#authverifyphonepost) | **POST** /auth/verify-phone | Send OTP to phone|

# **authExchangeTokenPost**
> AuthExchangeTokenPost200Response authExchangeTokenPost(authExchangeTokenPostRequest)


### Example

```typescript
import {
    AuthApi,
    Configuration,
    AuthExchangeTokenPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let authExchangeTokenPostRequest: AuthExchangeTokenPostRequest; //

const { status, data } = await apiInstance.authExchangeTokenPost(
    authExchangeTokenPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **authExchangeTokenPostRequest** | **AuthExchangeTokenPostRequest**|  | |


### Return type

**AuthExchangeTokenPost200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Tokens |  -  |
|**401** | Invalid OTP |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authVerifyPhonePost**
> authVerifyPhonePost(authVerifyPhonePostRequest)


### Example

```typescript
import {
    AuthApi,
    Configuration,
    AuthVerifyPhonePostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let authVerifyPhonePostRequest: AuthVerifyPhonePostRequest; //

const { status, data } = await apiInstance.authVerifyPhonePost(
    authVerifyPhonePostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **authVerifyPhonePostRequest** | **AuthVerifyPhonePostRequest**|  | |


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | OTP sent |  -  |
|**429** | Rate limit exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

