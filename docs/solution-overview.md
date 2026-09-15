# Solution Overview

## What We Built

CodeWarrior AI is a control-tower dashboard, backed by an autonomous IBM Bob-integrated
copilot, that watches in-transit cold-chain shipments in real time. It calculates FDA/WHO
Mean Kinetic Temperature (MKT) degradation as new telemetry comes in, cross-references
active weather/route disruptions against shipment locations, and — when a shipment is at
risk — identifies the nearest idle refrigerated trailer and can execute a full rescue
runbook, either from the dashboard or via a natural-language request to IBM Bob.

## How It Works

1. The FastAPI backend serves live shipment, disruption, and idle-fleet data from
   `src/backend/data.py`, with location coordinates that drift slightly on every poll to
   simulate live GPS movement.
2. `src/backend/engine.py` computes true Arrhenius-based Mean Kinetic Temperature from each
   shipment's temperature history (not a simple average) and classifies severity —
   OPTIMAL, WARNING, MAJOR_HAZARD, or CRITICAL — against the shipment's safe range.
3. The React dashboard polls this data every few seconds and renders it on a live Leaflet
   map, with shipment/fleet markers showing driver name, phone, and vehicle number.
4. In parallel, `src/mcp-server/server.py` exposes the same shipment/disruption/fleet data
   and rescue logic to IBM Bob as three MCP tools, so an operator can ask Bob directly
   ("is anything at risk right now?", "rescue SHP-8801") instead of clicking through the UI.
5. When a rescue is triggered — from the dashboard's "Rescue" button or via Bob — the system
   selects the nearest idle reefer, builds a 5-step action plan (dispatch → pre-cool →
   transfer → verify → resume route), and updates the shipment's status in real time.

## Architecture Diagram

> See [`architecture.md`](architecture.md) for the detailed diagram.

[React Dashboard] ⇄ [FastAPI Backend] ⇄ [In-memory shipment/fleet/disruption data]
↑
[IBM Bob] ⇄ [MCP Server (stdio)]

## Key Design Decisions

| Decision | Rationale |
|---|---|
| Real Arrhenius MKT calculation instead of a simple average | Regulatory-accurate — matches how FDA/WHO actually define cold-chain compliance, not a naive threshold check |
| Shared `engine.py`/`data.py` module used by both the REST API and the MCP server | One source of truth — Bob and the dashboard never see inconsistent shipment state |
| MCP server runs over stdio, not HTTP | Matches IBM Bob's local tool-invocation model; no extra auth/network surface needed for the demo |
| In-memory mutable state (no DB) for the hackathon build | Fast to demo and reason about; documented as a known limitation for production hardening |

## IBM Technologies Used

- **IBM Bob:** Connects to our custom MCP server (`src/mcp-server/server.py`) and calls
  three real tools — `scan_active_disruptions`, `evaluate_shipment_excursion`, and
  `execute_emergency_rescue` — to diagnose cold-chain risk and dispatch rescues in natural
  language, rather than being used only to write code for us.