"""
Codewarrior AI - Datasets for Shipments, IoT Feeds, and Idle Fleet
"""
ACTIVE_SHIPMENTS = [
    {
        "id": "SHP-8801",
        "title": "Pediatric Measles & COVID-19 Vaccines (10,000 Doses)",
        "cargo_type": "Pharmaceutical / Biologics",
        "value_usd": 520000,
        "origin": "Omaha, NE",
        "destination": "Salt Lake City, UT",
        "current_location": {"city": "Cheyenne, WY", "lat": 41.1399, "lng": -104.8202},
        "target_temp_range": "2°C to 8°C",
        "temperature_history": [4.1, 4.2, 4.5, 5.8, 7.2, 8.4, 9.1],
        "carrier": "Titan Express Reefer #14",
        "status": "CRITICAL_EXCURSION"
    },
    {
        "id": "SHP-9022",
        "title": "Fresh Organic Produce & Berries",
        "cargo_type": "Perishable Foods",
        "value_usd": 45000,
        "origin": "Sacramento, CA",
        "destination": "Denver, CO",
        "current_location": {"city": "Elko, NV", "lat": 40.8324, "lng": -115.7631},
        "target_temp_range": "1°C to 4°C",
        "temperature_history": [2.1, 2.3, 2.2, 2.5, 2.4],
        "carrier": "Sierra Freight #09",
        "status": "OPTIMAL"
    }
]

ACTIVE_DISRUPTIONS = [
    {
        "id": "DISRUPT-2026-01",
        "name": "Winter Storm Boreas",
        "type": "Severe Blizzard / Highway Closure",
        "severity": "CRITICAL",
        "corridor": "Interstate 80 Corridor (Laramie, WY to Rawlins, WY)",
        "coordinates": {"lat": 41.3114, "lng": -105.5911},
        "radius_miles": 85,
        "impact": "I-80 closed to commercial freight; ambient temp -15°C"
    }
]

IDLE_FLEET = [
    {
        "asset_id": "REEFER-WY-04",
        "equipment_type": "53ft Multi-Temp Refrigerated Trailer",
        "depot_name": "Cheyenne Logistics Hub, WY",
        "location": {"lat": 41.1400, "lng": -104.8190},
        "distance_miles": 14.2,
        "eta_minutes": 22,
        "status": "AVAILABLE_IMMEDIATE"
    },
    {
        "asset_id": "REEFER-CO-11",
        "equipment_type": "48ft Refrigerated Trailer",
        "depot_name": "Fort Collins Logistics Depot, CO",
        "location": {"lat": 40.5853, "lng": -105.0844},
        "distance_miles": 48.6,
        "eta_minutes": 55,
        "status": "AVAILABLE_STANDBY"
    }
]
