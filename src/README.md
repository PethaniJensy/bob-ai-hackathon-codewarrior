# ColdChain AI — Source Code

## Directory Structure

src/
├── backend/          # FastAPI REST API (Python)
├── frontend/         # React dashboard
├── mcp-server/       # IBM Bob MCP integration
└── .env.example      # Environment variable template

## backend/ — FastAPI Server (port 8000)

**Run:**
cd src/backend
python -m venv .venv

# Windows:
.venv\Scripts\activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000

Server: http://localhost:8000
Docs:   http://localhost:8000/docs

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Server health check |
| GET | /api/shipments | All shipments with MKT analysis |
| GET | /api/disruptions | Active weather disruptions |
| GET | /api/idle-fleet | Available reefer trucks |
| POST | /api/rescue-shipment/{id} | Trigger emergency rescue |

## frontend/ — React Dashboard (port 5173)

**Run:**
cd src/frontend
npm install
npm run dev

Polls the backend every few seconds — start the backend first.

## mcp-server/ — IBM Bob MCP Integration

**Run:**
cd src/mcp-server
python server.py

Starts over stdio. Exposes three tools to IBM Bob: `scan_active_disruptions`,
`evaluate_shipment_excursion`, `execute_emergency_rescue`. Runs entirely on the
backend's in-memory data — no external API calls or environment variables required.

## Environment Variables

Copy src/.env.example to src/.env. Not required to run this build — all three
components use in-memory sample data. WATSONX_API_KEY / WATSONX_PROJECT_ID are
placeholders scoped for a future direct watsonx.ai integration, currently unused.