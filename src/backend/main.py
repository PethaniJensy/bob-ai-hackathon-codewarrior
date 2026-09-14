"""
Codewarrior AI - FastAPI Server
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from engine import evaluate_excursion_severity
from data import ACTIVE_SHIPMENTS, ACTIVE_DISRUPTIONS, IDLE_FLEET

app = FastAPI(title="Codewarrior AI Resiliency API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "online", "system": "Codewarrior AI Resiliency Engine"}

@app.get("/health")
def health():
    return {"status": "ok", "service": "ColdChain AI Backend"}

@app.get("/api/shipments")
def get_shipments():
    results = []
    for s in ACTIVE_SHIPMENTS:
        analysis = evaluate_excursion_severity(s["temperature_history"])
        results.append({**s, "telemetry_analysis": analysis})
    return results

@app.get("/api/disruptions")
def get_disruptions():
    return ACTIVE_DISRUPTIONS

@app.get("/api/idle-fleet")
def get_idle_fleet():
    return IDLE_FLEET

@app.post("/api/rescue-shipment/{shipment_id}")
def trigger_rescue(shipment_id: str):
    shipment = next((s for s in ACTIVE_SHIPMENTS if s["id"] == shipment_id), None)
    if not shipment:
        raise HTTPException(status_code=404, detail=f"Shipment {shipment_id} not found")

    available = [r for r in IDLE_FLEET if r["status"] == "AVAILABLE_IMMEDIATE"
                 or r["status"] == "AVAILABLE_STANDBY"]
    if not available:
        raise HTTPException(status_code=503, detail="No idle fleet assets available")

    rescue_unit = available[0]
    rescue_unit["status"] = "DISPATCHED"

    return {
        "status": "RESCUE_DISPATCHED",
        "shipment_id": shipment_id,
        "cargo": shipment["title"],
        "assigned_asset": rescue_unit["asset_id"],
        "depot_origin": rescue_unit["depot_name"],
        "eta_minutes": rescue_unit["eta_minutes"],
        "divert_location": "Cheyenne Certified Cold Storage (Gate 3)",
        "spoilage_prevented": True,
        "value_saved_usd": shipment["value_usd"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
