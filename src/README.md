# ColdChain AI — Source Code

## Current State
Backend API is complete and running.
Frontend and MCP server are being built by other team members.

## Directory Structure (in progress)

src/
├── backend/          # ✅ COMPLETE — FastAPI REST API (Python)
├── frontend/         # 🔨 IN PROGRESS — React dashboard (Member 3)
├── mcp-server/       # 🔨 IN PROGRESS — IBM Bob MCP integration (Member 4)
└── .env.example      # Environment variable template

## backend/ — FastAPI Server (port 8000) ✅ READY

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

## Environment Variables

Copy src/.env.example to src/.env and fill in your values.
Required for MCP server (Member 4): WATSONX_API_KEY, WATSONX_PROJECT_ID
