# Codewarrior AI — MCP Server

An IBM Bob MCP server that exposes three cold-chain tools over **stdio** transport.
Bob launches it as a subprocess and calls its tools conversationally.

---

## Tools

| Tool | Description |
|---|---|
| `scan_active_disruptions` | Returns all active weather/route disruptions and all active shipment summaries in two labelled sections. |
| `evaluate_shipment_excursion` | Accepts a `shipment_id`, looks up its temperature history, runs FDA/WHO MKT analysis, and returns a full severity assessment. |
| `execute_emergency_rescue` | Accepts a `shipment_id` (and optional `asset_id`), selects the nearest idle reefer, returns an ordered rescue runbook, and marks the shipment `RESCUE_DISPATCHED` in-memory. |

---

## Prerequisites

- Python 3.10+
- Run all commands from the **repository root** (`bob-ai-hackathon-codewarrior/`)

---

## Install

```bash
pip install -r src/mcp-server/requirements.txt
```

---

## Run standalone (for testing)

```bash
python src/mcp-server/server.py
```

The server starts and listens on stdin/stdout for JSON-RPC 2.0 MCP messages.
Press `Ctrl+C` to stop.

---

## Register with IBM Bob

Add the following block to `.bob/mcp.json` in your workspace (create the file if it
does not exist). Bob will launch the server automatically as a subprocess.

```json
{
  "mcpServers": {
    "codewarrior-cold-chain": {
      "command": "python",
      "args": ["src/mcp-server/server.py"],
      "cwd": "/absolute/path/to/bob-ai-hackathon-codewarrior"
    }
  }
}
```

> **Replace** `/absolute/path/to/bob-ai-hackathon-codewarrior` with the actual
> absolute path to the repository root on your machine.
>
> On Windows use forward slashes or escape backslashes, e.g.:
> `"C:/Users/you/bob-ai-hackathon-codewarrior"`

Once saved, Bob hot-reloads the config. You can then ask Bob things like:

- *"Scan for active disruptions."*
- *"Evaluate the excursion severity for shipment SHP-8801."*
- *"Execute an emergency rescue for shipment SHP-8801."*

---

## Project layout

```
src/
├── backend/
│   ├── __init__.py          # marks backend as a package
│   ├── data.py              # ACTIVE_SHIPMENTS, ACTIVE_DISRUPTIONS, IDLE_FLEET
│   └── engine.py            # calculate_mkt, evaluate_excursion_severity
└── mcp-server/
    ├── __init__.py          # marks mcp-server as a package
    ├── requirements.txt     # mcp[cli]==1.9.0
    ├── server.py            # MCP server — three tools registered here
    └── README.md            # this file
```
