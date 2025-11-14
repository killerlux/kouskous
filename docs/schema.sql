-- docs/schema.sql
-- Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- ENUMs
DO $$ BEGIN
  CREATE TYPE role_t AS ENUM ('client', 'driver', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE ride_status_t AS ENUM (
    'requested','offered','assigned','driver_arrived','started','completed','cancelled'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE doc_status_t AS ENUM ('pending','approved','rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE deposit_status_t AS ENUM ('submitted','approved','rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- UUID v7 via pg_uuidv7 extension substitute (fallback to gen_random_uuid)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Tables
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_e164 TEXT UNIQUE NOT NULL,
  display_name TEXT,
  role role_t NOT NULL DEFAULT 'client',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  license_number TEXT NOT NULL,
  license_expiry DATE NOT NULL,
  verified_at TIMESTAMPTZ,
  earnings_cents BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_drivers_user ON drivers(user_id);

CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  plate_no TEXT NOT NULL,
  make TEXT, model TEXT, color TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_vehicles_driver ON vehicles(driver_id);

CREATE TABLE IF NOT EXISTS rides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rider_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
  status ride_status_t NOT NULL DEFAULT 'requested',
  pickup geometry(Point,4326) NOT NULL,
  dropoff geometry(Point,4326) NOT NULL,
  est_price_cents INT,
  price_cents INT,
  distance_m INT,
  duration_s INT,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  assigned_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT
);

CREATE INDEX IF NOT EXISTS gist_rides_pickup ON rides USING gist (pickup);
CREATE INDEX IF NOT EXISTS gist_rides_dropoff ON rides USING gist (dropoff);
CREATE INDEX IF NOT EXISTS ix_rides_driver ON rides(driver_id);
CREATE INDEX IF NOT EXISTS ix_rides_status ON rides(status);

CREATE TABLE IF NOT EXISTS ride_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id UUID NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  offered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  responded_at TIMESTAMPTZ,
  outcome TEXT CHECK (outcome IN ('accepted','declined','expired')),
  UNIQUE (ride_id, driver_id)
);

CREATE TABLE IF NOT EXISTS earnings_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  ride_id UUID REFERENCES rides(id) ON DELETE SET NULL,
  amount_cents BIGINT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('credit','debit')),
  kind TEXT NOT NULL CHECK (kind IN ('ride_cash','adjustment','deposit_lock','deposit_unlock')),
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_ledger_driver_created ON earnings_ledger(driver_id, created_at);

CREATE TABLE IF NOT EXISTS deposits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  amount_cents BIGINT NOT NULL,
  receipt_url TEXT NOT NULL,
  status deposit_status_t NOT NULL DEFAULT 'submitted',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  decided_at TIMESTAMPTZ,
  decided_by UUID REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS ix_deposits_driver_status ON deposits(driver_id, status);

CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('license','carte_grise','assurance','photo_id')),
  url TEXT NOT NULL,
  status doc_status_t NOT NULL DEFAULT 'pending',
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS ix_documents_driver_status ON documents(driver_id, status);

CREATE TABLE IF NOT EXISTS device_tokens (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('ios','android','web')),
  token TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, platform, token)
);

CREATE TABLE IF NOT EXISTS admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES users(id),
  action TEXT NOT NULL,
  target_id UUID,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Materialized view to speed up balance queries
CREATE MATERIALIZED VIEW IF NOT EXISTS driver_balances_mv AS
SELECT
  d.id AS driver_id,
  COALESCE(SUM(CASE WHEN el.direction='credit' THEN el.amount_cents ELSE -el.amount_cents END),0) AS balance_cents,
  max(el.created_at) AS last_tx_at
FROM drivers d
LEFT JOIN earnings_ledger el ON el.driver_id = d.id
GROUP BY d.id
WITH NO DATA;

-- Index for fast lookups near the lock threshold (1,000 TND = 100,000 cents)
CREATE INDEX IF NOT EXISTS ix_balances_near_threshold ON driver_balances_mv(balance_cents);

-- Helper function to refresh balances (to be called by a job after ledger writes)
CREATE OR REPLACE FUNCTION refresh_driver_balances()
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY driver_balances_mv;
END;
$$;

