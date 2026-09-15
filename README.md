# Codewarrior AI — Autonomous Cold-Chain & Supply Chain Resiliency Copilot

Codewarrior AI is an autonomous logistics and cold-chain resilience copilot powered by
IBM Bob. It ingests real-time IoT temperature and GPS telemetry alongside active weather
disruption feeds, calculates FDA/WHO-standard Mean Kinetic Temperature (MKT) degradation
in real time, autonomously locates nearby idle refrigerated fleet assets, and triggers
emergency divert runbooks to rescue high-value cargo before spoilage occurs.

---

## The Problem
Supply chain disruptions such as severe blizzards, route closures, and fleet asset imbalances cascade across hundreds of active shipments. Cold-chain cargo—specifically life-saving pediatric vaccines, insulin, and biopharmaceuticals—is exceptionally vulnerable. A single refrigeration failure across any transit leg destroys upwards of $500,000 in cargo. Traditionally, these temperature excursions are only discovered at the destination dock when the cargo has already spoiled.

---

## Key Features
- Real-Time IoT Cold-Chain Sentinel: Continuously evaluates temperature telemetry and calculates Mean Kinetic Temperature (MKT) based on FDA/WHO biopharmaceutical degradation standards.
- Geospatial Disruption Intersect Engine: Cross-references active shipment routes with real-time weather and road disruption polygons.
- Autonomous Fleet Asset Rebalancing: Discovers idle refrigerated trailers (reefers) at nearby regional hubs and matches them for emergency cargo transfers.
- Load-Bearing IBM Bob MCP Integration: Enables operators to query fleet risk conversationally and execute 1-click rescue runbooks through natural language.
- Audit-Ready Regulatory Reporting: Generates instant compliance dossiers for pharmaceutical quality assurance officers.

---

## Tech Stack

- Backend: Python 3.11, FastAPI, Uvicorn, Pydantic
- AI & Reasoning: IBM Bob, Model Context Protocol (MCP)
- Frontend: React, TailwindCSS, Leaflet GeoJSON
- Automation & CI/CD: GitHub Actions (Automated Submission Validator)
---

## How to Run Locally

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ (for frontend)
- Git

### 2. Backend Setup
```bash
cd src/backend
python -m venv .venv
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
