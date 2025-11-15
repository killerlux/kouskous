# Ride


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]
**rider_user_id** | **string** |  | [optional] [default to undefined]
**driver_id** | **string** |  | [optional] [default to undefined]
**status** | [**RideStatus**](RideStatus.md) |  | [optional] [default to undefined]
**pickup** | [**GeoPoint**](GeoPoint.md) |  | [optional] [default to undefined]
**dropoff** | [**GeoPoint**](GeoPoint.md) |  | [optional] [default to undefined]
**est_price_cents** | **number** |  | [optional] [default to undefined]
**price_cents** | **number** |  | [optional] [default to undefined]
**distance_m** | **number** |  | [optional] [default to undefined]
**duration_s** | **number** |  | [optional] [default to undefined]
**requested_at** | **string** |  | [optional] [default to undefined]
**assigned_at** | **string** |  | [optional] [default to undefined]
**started_at** | **string** |  | [optional] [default to undefined]
**completed_at** | **string** |  | [optional] [default to undefined]
**cancelled_at** | **string** |  | [optional] [default to undefined]
**cancellation_reason** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { Ride } from './api';

const instance: Ride = {
    id,
    rider_user_id,
    driver_id,
    status,
    pickup,
    dropoff,
    est_price_cents,
    price_cents,
    distance_m,
    duration_s,
    requested_at,
    assigned_at,
    started_at,
    completed_at,
    cancelled_at,
    cancellation_reason,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
