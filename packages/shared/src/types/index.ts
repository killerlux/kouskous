export type Role = 'client' | 'driver' | 'admin';

export type RideStatus =
  | 'requested'
  | 'offered'
  | 'assigned'
  | 'driver_arrived'
  | 'started'
  | 'completed'
  | 'cancelled';

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface User {
  id: string;
  phone_e164: string;
  display_name?: string;
  role: Role;
  created_at: string;
}

export interface Driver {
  id: string;
  user_id: string;
  license_number: string;
  license_expiry: string;
  verified_at?: string;
  earnings_cents: number;
  created_at: string;
}

export interface Ride {
  id: string;
  rider_user_id: string;
  driver_id?: string;
  status: RideStatus;
  pickup: GeoPoint;
  dropoff: GeoPoint;
  est_price_cents?: number;
  price_cents?: number;
  distance_m?: number;
  duration_s?: number;
  requested_at: string;
  assigned_at?: string;
  started_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
}

