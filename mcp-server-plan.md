# MCP Server Plan — Codewarrior AI Cold-Chain Tools

## Top-Level Overview

Build `src/mcp-server/server.py`, a Python MCP server that runs over **stdio** transport and exposes three tools to IBM Bob:

| Tool | Purpose |
|---|---|
| `scan_active_disruptions` | Returns all active disruptions and all active shipment summaries in two separate sections |
| `evaluate_shipment_excursion` | Accepts a `shipment_id`, looks up its temperature history in `ACTIVE_SHIPMENTS`, and runs `evaluate_excursion_severity` from `engine.py` |
| `execute_emergency_rescue` | Accepts a `shipment_id` + optional `asset_id`, selects the best idle reefer from `IDLE_FLEET`, produces a rescue runbook, and mutates in-memory state |

The server reuses `calculate_mkt` and `evaluate_excursion_severity` from `src/backend/engine.py`, and reads `ACTIVE_SHIPMENTS`, `ACTIVE_DISRUPTIONS`, and `IDLE_FLEET` from `src/backend/data.py`.

**Non-goals:** No database persistence, no HTTP transport, no authentication, no frontend changes.

---

## Sub-Task 1 — Scaffold the `src/mcp-server/` package

**Intent**
Create the directory and the minimal files needed so that `server.py` can import from `src/backend/` without path manipulation hacks.

**Expected Outcomes**
- `src/mcp-server/` directory exists
- `src/mcp-server/__init__.py` is present (empty, marks it as a package)
- `src/mcp-server/requirements.txt` lists `mcp` (the official MCP Python SDK)
- `src/backend/__init__.py` is present so `engine` and `data` are importable as a package

**Todo List**
1. Create `src/mcp-server/__init__.py` (empty)
2. Create `src/mcp-server/requirements.txt` with `mcp[cli]` pinned to a stable version
3. Create `src/backend/__init__.py` (empty) if it does not already exist

**Relevant Context**
- Existing layout: `src/backend/engine.py`, `src/backend/data.py`, `src/backend/requirements.txt`
- MCP Python SDK package name: `mcp` (install with `pip install mcp[cli]`)

**Status:** [x] done

---

## Sub-Task 2 — Implement `scan_active_disruptions`

**Intent**
Expose the full `ACTIVE_DISRUPTIONS` list and the full `ACTIVE_SHIPMENTS` list as two labelled sections in a single tool response so Bob can give operators a situational overview without any filtering.

**Expected Outcomes**
- Tool is registered in `server.py` with name `scan_active_disruptions` and no input parameters
- Returns a JSON-serialisable dict with keys `active_disruptions` (list) and `active_shipments` (list), each containing all records as-is from `data.py`

**Todo List**
1. In `server.py`, import `ACTIVE_DISRUPTIONS` and `ACTIVE_SHIPMENTS` from `src.backend.data`
2. Register the tool `scan_active_disruptions` with an empty input schema
3. Handler returns `{"active_disruptions": ACTIVE_DISRUPTIONS, "active_shipments": ACTIVE_SHIPMENTS}`

**Relevant Context**
- `ACTIVE_DISRUPTIONS` — `src/backend/data.py` line 33 (1 record, keys: id, name, type, severity, corridor, coordinates, radius_miles, impact)
- `ACTIVE_SHIPMENTS` — `src/backend/data.py` line 4 (2 records, keys: id, title, cargo_type, value_usd, origin, destination, current_location, target_temp_range, temperature_history, carrier, status)

**Status:** [x] done

---

## Sub-Task 3 — Implement `evaluate_shipment_excursion`

**Intent**
Let Bob query the cold-chain health of a specific shipment by ID. The tool looks up the shipment's `temperature_history` and `target_temp_range`, feeds those into `evaluate_excursion_severity`, and returns the full severity assessment enriched with shipment metadata.

**Expected Outcomes**
- Tool is registered with name `evaluate_shipment_excursion` and one required string input `shipment_id`
- Returns the `evaluate_excursion_severity` dict merged with shipment metadata (id, title, cargo_type, carrier, current_location)
- Returns a descriptive error string if `shipment_id` is not found

**Todo List**
1. Import `evaluate_excursion_severity` from `src.backend.engine`
2. Register the tool `evaluate_shipment_excursion` with input schema `{shipment_id: string}`
3. Handler: look up the shipment in `ACTIVE_SHIPMENTS` by `id` field
4. Parse the upper bound from `target_temp_range` (e.g. `"2°C to 8°C"` → `8.0`) to pass as `max_safe_temp`
5. Call `evaluate_excursion_severity(shipment["temperature_history"], max_safe_temp)` and merge shipment metadata into the result
6. Return error dict `{"error": "Shipment <id> not found"}` if lookup fails

**Relevant Context**
- `evaluate_excursion_severity` signature — `src/backend/engine.py` line 19: `(temperatures_celsius: List[float], max_safe_temp: float = 8.0) -> Dict`
- `target_temp_range` format in data: `"2°C to 8°C"` — parse the number before `°C` after ` to ` to extract the upper bound
- Shipment fields to merge: `id`, `title`, `cargo_type`, `carrier`, `current_location`

**Status:** [x] done

---

## Sub-Task 4 — Implement `execute_emergency_rescue`

**Intent**
Let Bob trigger an emergency rescue runbook for a distressed shipment. The tool selects the nearest available reefer (or uses the caller-specified one), builds a structured rescue plan, and mutates in-memory state so subsequent `scan_active_disruptions` or `evaluate_shipment_excursion` calls reflect the rescue.

**Expected Outcomes**
- Tool registered with name `execute_emergency_rescue`, required input `shipment_id` (string), optional input `asset_id` (string or null)
- If `asset_id` is provided, the tool uses that reefer; otherwise it selects the record in `IDLE_FLEET` with the smallest `distance_miles`
- Returns a rescue runbook dict with keys: `rescue_id`, `shipment_id`, `assigned_asset`, `eta_minutes`, `action_plan` (list of ordered steps), `severity_at_dispatch`
- Mutates `ACTIVE_SHIPMENTS` in-memory: sets the matched shipment's `status` to `"RESCUE_DISPATCHED"` and adds a `rescue_asset` key with the assigned `asset_id`
- Returns error dict if shipment or asset not found

**Todo List**
1. Import `IDLE_FLEET` from `src.backend.data`
2. Register the tool `execute_emergency_rescue` with input schema `{shipment_id: string, asset_id: string | null}`
3. Handler: resolve shipment from `ACTIVE_SHIPMENTS`; resolve reefer from `IDLE_FLEET` (provided `asset_id` → lookup by `asset_id` field; no `asset_id` → `min(IDLE_FLEET, key=lambda r: r["distance_miles"])`)
4. Call `evaluate_excursion_severity` on the shipment's temperature history to populate `severity_at_dispatch`
5. Build `rescue_id` as `f"RESCUE-{shipment['id']}-{asset['asset_id']}"`, assemble `action_plan` list with clear human-readable steps (e.g. dispatch reefer, pre-cool, transfer cargo, resume route)
6. Mutate the shipment dict in-place: `shipment["status"] = "RESCUE_DISPATCHED"`, `shipment["rescue_asset"] = asset["asset_id"]`
7. Return the complete runbook dict

**Relevant Context**
- `IDLE_FLEET` — `src/backend/data.py` line 46 (keys: asset_id, equipment_type, depot_name, location, distance_miles, eta_minutes, status)
- In-memory mutation is intentional — `data.py` lists are module-level and persist for the lifetime of the server process
- `rescue_id` is a synthesised string — no UUID library required

**Status:** [x] done

---

## Sub-Task 5 — Wire up MCP server entry point and stdio transport

**Intent**
Create the `main()` entry point that instantiates the MCP `Server`, registers all three tools, and runs the stdio transport loop so Bob can launch it as a subprocess.

**Expected Outcomes**
- `server.py` is executable: `python src/mcp-server/server.py` starts the MCP stdio listener without error
- Server name is `"codewarrior-cold-chain"`
- All three tools are registered before `run()` is called
- The file contains a standard `if __name__ == "__main__":` guard

**Todo List**
1. Import `mcp.server.Server` and `mcp.server.stdio.stdio_server` (or equivalent from the installed SDK)
2. Instantiate `Server("codewarrior-cold-chain")`
3. Register all three tool handlers (from sub-tasks 2–4) using the `@server.call_tool` and `@server.list_tools` decorators (or the SDK's `registerTool` equivalent)
4. Add `if __name__ == "__main__": asyncio.run(main())` entry point
5. Verify import paths work with the `src/backend/__init__.py` present

**Relevant Context**
- MCP Python SDK docs: tools are registered via `@server.list_tools` (returns tool definitions) and `@server.call_tool` (dispatches by name)
- stdio transport: `async with stdio_server() as (read, write): await server.run(read, write, ...)`
- Python path: since `server.py` is at `src/mcp-server/server.py`, imports `src.backend.engine` require either running from repo root or adding `sys.path` adjustment at the top of `server.py`

**Status:** [x] done

---

## Sub-Task 6 — Write `README.md` for the MCP server

**Intent**
Document how to install dependencies, run the server standalone, and register it with Bob's MCP config so the team can onboard quickly.

**Expected Outcomes**
- `src/mcp-server/README.md` exists with: purpose, install steps, run command, example Bob MCP config block

**Todo List**
1. Create `src/mcp-server/README.md`
2. Include install instructions: `pip install -r src/mcp-server/requirements.txt`
3. Include run command: `python src/mcp-server/server.py`
4. Include example Bob `mcp_servers` config YAML block pointing to `server.py` with `transport: stdio`

**Relevant Context**
- Bob MCP config format: `.bob/mcp_servers.yaml` with `name`, `command`, `transport: stdio`

**Status:** [x] done
