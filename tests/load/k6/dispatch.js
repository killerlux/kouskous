import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    drivers: {
      executor: 'constant-vus',
      vus: 500,
      duration: '2m',
      exec: 'driverHeartbeat',
    },
    riders: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 200 },
        { duration: '1m', target: 200 },
        { duration: '30s', target: 0 },
      ],
      exec: 'riderRequest',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<2000'],
  },
};

const API_BASE = __ENV.API_BASE || 'https://staging.api.example.com';

export function driverHeartbeat() {
  const res = http.post(`${API_BASE}/telemetry/driver-location`, JSON.stringify({
    lat: 36.8 + Math.random() * 0.01,
    lng: 10.2 + Math.random() * 0.01,
    accuracy: 10,
    speed: 30,
  }), {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${__ENV.DRIVER_TOKEN}` },
  });
  check(res, { 'heartbeat 2xx': (r) => r.status === 200 || r.status === 204 });
  sleep(1);
}

export function riderRequest() {
  const body = {
    pickup: { lat: 36.81, lng: 10.18 },
    dropoff: { lat: 36.85, lng: 10.25 },
    idempotency_key: `req-${__VU}-${Date.now()}`,
  };
  const res = http.post(`${API_BASE}/rides`, JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${__ENV.RIDER_TOKEN}` },
  });
  check(res, { 'request created': (r) => r.status === 201 });
  sleep(3);
}

