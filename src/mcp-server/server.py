"""
Codewarrior AI — MCP Server
Exposes cold-chain tools to IBM Bob over stdio transport.
"""
import sys
import os
import json

# Allow imports from the repo root so `src.backend` resolves correctly
# regardless of the working directory Bob uses to launch this server.
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from mcp.server.fastmcp import FastMCP
from src.backend.data import ACTIVE_DISRUPTIONS, ACTIVE_SHIPMENTS, IDLE_FLEET
from src.backend.engine import evaluate_excursion_severity


def _parse_upper_temp(target_temp_range: str, default: float = 8.0) -> float:
    """Extract the upper bound Celsius value from a range string like '2°C to 8°C'."""
    try:
        upper_str = target_temp_range.split(" to ")[-1]
        return float(upper_str.replace("°C", "").strip())
    except (ValueError, IndexError):
        return default

mcp = FastMCP("codewarrior-cold-chain")


# ---------------------------------------------------------------------------
# Tool 1 — scan_active_disruptions
# ---------------------------------------------------------------------------

@mcp.tool()
def scan_active_disruptions() -> str:
    """
    Return all active weather / route disruptions and all active shipment
    summaries as two labelled sections.  No filtering is applied — every
    record from the live dataset is included so the operator gets a full
    situational picture.
    """
    payload = {
        "active_disruptions": ACTIVE_DISRUPTIONS,
        "active_shipments": ACTIVE_SHIPMENTS,
    }
    return json.dumps(payload, indent=2)


# ---------------------------------------------------------------------------
# Tool 2 — evaluate_shipment_excursion
# ---------------------------------------------------------------------------

@mcp.tool()
def evaluate_shipment_excursion(shipment_id: str) -> str:
    """
    Evaluate the cold-chain health of a specific shipment by ID.

    Looks up the shipment in ACTIVE_SHIPMENTS, extracts its temperature
    history and safe-temperature upper bound, runs FDA/WHO MKT analysis
    via evaluate_excursion_severity, and returns the severity assessment
    merged with key shipment metadata.

    Args:
        shipment_id: The shipment identifier, e.g. "SHP-8801".
    """
    shipment = next(
        (s for s in ACTIVE_SHIPMENTS if s["id"] == shipment_id), None
    )
    if shipment is None:
        return json.dumps({"error": f"Shipment {shipment_id} not found"})

    max_safe_temp = _parse_upper_temp(shipment["target_temp_range"])
    severity = evaluate_excursion_severity(
        shipment["temperature_history"], max_safe_temp
    )

    result = {
        "shipment_id": shipment["id"],
        "title": shipment["title"],
        "cargo_type": shipment["cargo_type"],
        "carrier": shipment["carrier"],
        "current_location": shipment["current_location"],
        **severity,
    }
    return json.dumps(result, indent=2)


# ---------------------------------------------------------------------------
# Tool 3 — execute_emergency_rescue
# ---------------------------------------------------------------------------

@mcp.tool()
def execute_emergency_rescue(shipment_id: str, asset_id: str | None = None) -> str:
    """
    Trigger an emergency rescue runbook for a distressed shipment.

    Selects the nearest available reefer from IDLE_FLEET (or the explicitly
    requested asset), calculates severity at the time of dispatch, builds an
    ordered action plan, and mutates the shipment's in-memory status to
    RESCUE_DISPATCHED so subsequent tool calls reflect the change.

    Args:
        shipment_id: The shipment to rescue, e.g. "SHP-8801".
        asset_id:    Optional reefer asset ID, e.g. "REEFER-WY-04".
                     If omitted, the nearest idle reefer is auto-selected.
    """
    # --- resolve shipment ---------------------------------------------------
    shipment = next(
        (s for s in ACTIVE_SHIPMENTS if s["id"] == shipment_id), None
    )
    if shipment is None:
        return json.dumps({"error": f"Shipment {shipment_id} not found"})

    # --- guard: already rescued ---------------------------------------------
    if shipment.get("status") == "RESCUE_DISPATCHED":
        return json.dumps({
            "warning": f"Shipment {shipment_id} already has an active rescue in progress.",
            "rescue_asset": shipment.get("rescue_asset"),
            "status": "RESCUE_DISPATCHED",
        })

    # --- resolve reefer asset -----------------------------------------------
    if asset_id is not None:
        asset = next(
            (r for r in IDLE_FLEET if r["asset_id"] == asset_id), None
        )
        if asset is None:
            return json.dumps({"error": f"Fleet asset {asset_id} not found"})
    else:
        if not IDLE_FLEET:
            return json.dumps({"error": "No idle fleet assets available"})
        asset = min(IDLE_FLEET, key=lambda r: r["distance_miles"])

    # --- severity snapshot at dispatch --------------------------------------
    max_safe_temp = _parse_upper_temp(shipment["target_temp_range"])
    severity_at_dispatch = evaluate_excursion_severity(
        shipment["temperature_history"], max_safe_temp
    )

    # --- build rescue runbook -----------------------------------------------
    rescue_id = f"RESCUE-{shipment['id']}-{asset['asset_id']}"

    action_plan = [
        f"1. DISPATCH {asset['asset_id']} ({asset['equipment_type']}) from "
        f"{asset['depot_name']} — ETA {asset['eta_minutes']} min "
        f"({asset['distance_miles']} miles).",
        f"2. PRE-COOL asset to {shipment['target_temp_range']} before "
        f"cargo transfer.",
        f"3. TRANSFER cargo from {shipment['carrier']} to {asset['asset_id']} "
        f"at {shipment['current_location']['city']}.",
        f"4. VERIFY temperature compliance; log transfer event for regulatory "
        f"audit trail.",
        f"5. RESUME route to {shipment['destination']} under {asset['asset_id']}.",
    ]

    # --- mutate in-memory state ---------------------------------------------
    shipment["status"] = "RESCUE_DISPATCHED"
    shipment["rescue_asset"] = asset["asset_id"]

    # --- return runbook -----------------------------------------------------
    runbook = {
        "rescue_id": rescue_id,
        "shipment_id": shipment["id"],
        "assigned_asset": {
            "asset_id": asset["asset_id"],
            "equipment_type": asset["equipment_type"],
            "depot_name": asset["depot_name"],
            "distance_miles": asset["distance_miles"],
            "eta_minutes": asset["eta_minutes"],
        },
        "eta_minutes": asset["eta_minutes"],
        "severity_at_dispatch": severity_at_dispatch,
        "action_plan": action_plan,
    }
    return json.dumps(runbook, indent=2)


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    mcp.run(transport="stdio")
