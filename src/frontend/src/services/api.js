const BASE_URL = 'http://localhost:8000'

// ---------------------------------------------------------------------------
// Static fallback data — mirrors src/backend/data.py exactly so the UI
// is always functional even when the backend is not running.
// ---------------------------------------------------------------------------
const FALLBACK_SHIPMENTS = [
  {
    id: 'SHP-8801',
    title: 'Pediatric Measles & COVID-19 Vaccines (10,000 Doses)',
    cargo_type: 'Pharmaceutical / Biologics',
    value_usd: 520000,
    origin: 'Omaha, NE',
    destination: 'Salt Lake City, UT',
    current_location: { city: 'Cheyenne, WY', lat: 41.1399, lng: -104.8202 },
    target_temp_range: '2°C to 8°C',
    temperature_history: [4.1, 4.2, 4.5, 5.8, 7.2, 8.4, 9.1],
    carrier: 'Titan Express Reefer #14',
    status: 'CRITICAL_EXCURSION',
    driver_name: 'Marcus Reyes',
    driver_phone: '+1 (307) 555-0142',
    vehicle_number: 'WY-REEFER-14',
    telemetry_analysis: {
      mkt_celsius: 8.42,
      excursion_detected: true,
      max_temp: 9.1,
      readings: 7,
    },
  },
  {
    id: 'SHP-9022',
    title: 'Fresh Organic Produce & Berries',
    cargo_type: 'Perishable Foods',
    value_usd: 45000,
    origin: 'Sacramento, CA',
    destination: 'Denver, CO',
    current_location: { city: 'Elko, NV', lat: 40.8324, lng: -115.7631 },
    target_temp_range: '1°C to 4°C',
    temperature_history: [2.1, 2.3, 2.2, 2.5, 2.4],
    carrier: 'Sierra Freight #09',
    status: 'OPTIMAL',
    driver_name: 'Elena Cruz',
    driver_phone: '+1 (916) 555-0198',
    vehicle_number: 'CA-SIERRA-09',
    telemetry_analysis: {
      mkt_celsius: 2.3,
      excursion_detected: false,
      max_temp: 2.5,
      readings: 5,
    },
  },
]

const FALLBACK_DISRUPTIONS = [
  {
    id: 'DISRUPT-2026-01',
    name: 'Winter Storm Boreas',
    type: 'Severe Blizzard / Highway Closure',
    severity: 'CRITICAL',
    corridor: 'Interstate 80 Corridor (Laramie, WY to Rawlins, WY)',
    coordinates: { lat: 41.3114, lng: -105.5911 },
    radius_miles: 85,
    impact: 'I-80 closed to commercial freight; ambient temp -15°C',
  },
]

const FALLBACK_FLEET = [
  {
    asset_id: 'REEFER-WY-04',
    equipment_type: '53ft Multi-Temp Refrigerated Trailer',
    depot_name: 'Cheyenne Logistics Hub, WY',
    location: { lat: 41.1400, lng: -104.8190 },
    distance_miles: 14.2,
    eta_minutes: 22,
    status: 'AVAILABLE_IMMEDIATE',
    driver_name: 'Tom Whitfield',
    driver_phone: '+1 (307) 555-0177',
    vehicle_number: 'WY-REEFER-04',
  },
  
  {
    asset_id: 'REEFER-CO-11',
    equipment_type: '48ft Refrigerated Trailer',
    depot_name: 'Fort Collins Logistics Depot, CO',
    location: { lat: 40.5853, lng: -105.0844 },
    distance_miles: 48.6,
    eta_minutes: 55,
    status: 'AVAILABLE_STANDBY',
    driver_name: 'Priya Nair',
    driver_phone: '+1 (970) 555-0163',
    vehicle_number: 'CO-REEFER-11',
  },
]

const FALLBACK_RESCUE = {
  status: 'RESCUE_DISPATCHED',
  shipment_id: 'SHP-8801',
  cargo: 'Pediatric Measles & COVID-19 Vaccines (10,000 Doses)',
  assigned_asset: 'REEFER-WY-04',
  depot_origin: 'Cheyenne Logistics Hub, WY',
  eta_minutes: 22,
  divert_location: 'Cheyenne Certified Cold Storage (Gate 3)',
  spoilage_prevented: true,
  value_saved_usd: 520000,
}

// ---------------------------------------------------------------------------
// Network helper — tries the real backend; falls back to static data on any
// network/fetch error. Backend HTTP errors (4xx/5xx) are still surfaced.
// ---------------------------------------------------------------------------
async function request(method, path, body, fallback) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  }
  if (body) opts.body = JSON.stringify(body)

  try {
    const res = await fetch(`${BASE_URL}${path}`, opts)
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Unknown error' }))
      throw new Error(err.detail || `HTTP ${res.status}`)
    }
    return res.json()
  } catch (err) {
    // Network error (backend offline) → use fallback if provided
    if (fallback !== undefined && (err instanceof TypeError || err.message === 'Failed to fetch')) {
      return typeof fallback === 'function' ? fallback() : fallback
    }
    throw err
  }
}

export const api = {
  health: () => request('GET', '/health', null, { status: 'ok', service: 'ColdChain AI Backend (offline — using demo data)' }),
  getShipments: () => request('GET', '/api/shipments', null, FALLBACK_SHIPMENTS),
  getDisruptions: () => request('GET', '/api/disruptions', null, FALLBACK_DISRUPTIONS),
  getIdleFleet: () => request('GET', '/api/idle-fleet', null, FALLBACK_FLEET),
  rescueShipment: (id) => request('POST', `/api/rescue-shipment/${id}`, null, FALLBACK_RESCUE),
}

export default api
