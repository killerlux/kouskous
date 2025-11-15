# SocketAck

Standard acknowledgment envelope for all Socket.IO events

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**ok** | **boolean** |  | [default to undefined]
**error** | **string** |  | [optional] [default to undefined]
**data** | **object** |  | [optional] [default to undefined]

## Example

```typescript
import { SocketAck } from './api';

const instance: SocketAck = {
    ok,
    error,
    data,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
