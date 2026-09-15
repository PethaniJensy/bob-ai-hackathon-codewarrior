# Setup Guide

## Prerequisites

- Python 3.10+
- Node.js 18+
- Git

## 1. Clone the repo

git clone https://github.com/PethaniJensy/bob-ai-hackathon-codewarrior.git
cd bob-ai-hackathon-codewarrior

## 2. Backend setup

cd src/backend
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

The API will be live at http://localhost:8000. Endpoints include /api/shipments,
/api/disruptions, and /api/idle-fleet.

## 3. Frontend setup

Open a second terminal:

cd src/frontend
npm install
npm run dev

The dashboard will be available at http://localhost:5173 (or whatever port Vite/CRA prints).
It polls the backend every few seconds, so start the backend first.

## 4. Run the MCP server (for IBM Bob integration)

cd src/mcp-server
python server.py

This starts the MCP server over stdio. Point IBM Bob at this process so it can call
scan_active_disruptions, evaluate_shipment_excursion, and execute_emergency_rescue directly.

## Sample data

The backend ships with in-memory sample shipment, disruption, and idle-fleet data
(src/backend/data.py) — no database setup is required to run the demo.

## Troubleshooting

- Port already in use: change --port 8000 to another port and update the frontend's API base URL.
- CORS errors: the backend allows all origins by default for local development.