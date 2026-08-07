from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime
from database import init_db, get_db
from qa_engine import run_all_checks

app = FastAPI(title="AdSquadOps API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()

class CampaignCreate(BaseModel):
    name: str
    destination_url: str
    tracking_tag: str
    ad_copy: Optional[str] = None

class TicketCreate(BaseModel):
    campaign_id: int
    title: str
    priority: Literal["high", "standard"] = "standard"

class EscalationCreate(BaseModel):
    ticket_id: int
    reason: str
    owner_team: str

class EscalationAdvance(BaseModel):
    stage: Literal["in_progress", "fixed"]
    note: Optional[str] = None

SLA_HOURS = {"high": 2, "standard": 4}
STAGE_LABELS = {"reported": "Reported", "in_progress": "In progress", "fixed": "Fixed"}

@app.post("/campaigns")
def create_campaign(campaign: CampaignCreate):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO campaigns (name, destination_url, tracking_tag, ad_copy) VALUES (?, ?, ?, ?)",
        (campaign.name, campaign.destination_url, campaign.tracking_tag, campaign.ad_copy),
    )
    conn.commit()
    campaign_id = cursor.lastrowid
    conn.close()
    return {"id": campaign_id, "message": "Campaign created"}

@app.get("/campaigns")
def list_campaigns():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM campaigns ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

@app.post("/campaigns/{campaign_id}/validate")
def validate_campaign(campaign_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM campaigns WHERE id = ?", (campaign_id,))
    row = cursor.fetchone()

    if row is None:
        conn.close()
        raise HTTPException(status_code=404, detail="Campaign not found")

    campaign = dict(row)
    results = run_all_checks(campaign)

    for result in results:
        cursor.execute(
            "INSERT INTO qa_checks (campaign_id, check_type, passed, detail) VALUES (?, ?, ?, ?)",
            (campaign_id, result["check_type"], int(result["passed"]), result["detail"]),
        )

    all_passed = all(r["passed"] for r in results)
    new_status = "qa_passed" if all_passed else "qa_failed"
    cursor.execute("UPDATE campaigns SET status = ? WHERE id = ?", (new_status, campaign_id))

    conn.commit()
    conn.close()

    return {"campaign_id": campaign_id, "status": new_status, "results": results}

@app.post("/tickets")
def create_ticket(ticket: TicketCreate):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM campaigns WHERE id = ?", (ticket.campaign_id,))
    if cursor.fetchone() is None:
        conn.close()
        raise HTTPException(status_code=404, detail="Campaign not found")

    sla_hours = SLA_HOURS[ticket.priority]
    cursor.execute(
        "INSERT INTO tickets (campaign_id, title, priority, sla_hours) VALUES (?, ?, ?, ?)",
        (ticket.campaign_id, ticket.title, ticket.priority, sla_hours),
    )
    conn.commit()
    ticket_id = cursor.lastrowid
    conn.close()
    return {"id": ticket_id, "message": "Ticket created"}

@app.get("/tickets")
def list_tickets():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT tickets.*, campaigns.name AS campaign_name
        FROM tickets
        JOIN campaigns ON tickets.campaign_id = campaigns.id
        ORDER BY tickets.created_at DESC
    """)
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

@app.post("/tickets/{ticket_id}/resolve")
def resolve_ticket(ticket_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM tickets WHERE id = ?", (ticket_id,))
    if cursor.fetchone() is None:
        conn.close()
        raise HTTPException(status_code=404, detail="Ticket not found")

    cursor.execute(
        "UPDATE tickets SET status = 'resolved', resolved_at = CURRENT_TIMESTAMP WHERE id = ?",
        (ticket_id,),
    )
    conn.commit()
    conn.close()
    return {"id": ticket_id, "message": "Ticket resolved"}

@app.post("/escalations")
def create_escalation(escalation: EscalationCreate):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM tickets WHERE id = ?", (escalation.ticket_id,))
    if cursor.fetchone() is None:
        conn.close()
        raise HTTPException(status_code=404, detail="Ticket not found")

    cursor.execute(
        "INSERT INTO escalations (ticket_id, reason, owner_team) VALUES (?, ?, ?)",
        (escalation.ticket_id, escalation.reason, escalation.owner_team),
    )
    escalation_id = cursor.lastrowid

    cursor.execute(
        "INSERT INTO escalation_log (escalation_id, stage, note) VALUES (?, ?, ?)",
        (escalation_id, "reported", "Escalation opened"),
    )

    conn.commit()
    conn.close()
    return {"id": escalation_id, "message": "Escalation created"}

@app.get("/escalations")
def list_escalations():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT escalations.*, tickets.title AS ticket_title, campaigns.name AS campaign_name
        FROM escalations
        JOIN tickets ON escalations.ticket_id = tickets.id
        JOIN campaigns ON tickets.campaign_id = campaigns.id
        ORDER BY escalations.created_at DESC
    """)
    escalations = [dict(row) for row in cursor.fetchall()]

    for esc in escalations:
        cursor.execute(
            "SELECT stage, note, created_at FROM escalation_log WHERE escalation_id = ? ORDER BY created_at ASC",
            (esc["id"],),
        )
        esc["log"] = [dict(row) for row in cursor.fetchall()]

    conn.close()
    return escalations

@app.post("/escalations/{escalation_id}/advance")
def advance_escalation(escalation_id: int, advance: EscalationAdvance):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM escalations WHERE id = ?", (escalation_id,))
    row = cursor.fetchone()
    if row is None:
        conn.close()
        raise HTTPException(status_code=404, detail="Escalation not found")

    cursor.execute(
        "UPDATE escalations SET current_stage = ? WHERE id = ?",
        (advance.stage, escalation_id),
    )
    cursor.execute(
        "INSERT INTO escalation_log (escalation_id, stage, note) VALUES (?, ?, ?)",
        (escalation_id, advance.stage, advance.note),
    )
    conn.commit()
    conn.close()
    return {"id": escalation_id, "stage": advance.stage, "message": "Escalation advanced"}

def _parse_ts(raw):
    if not raw:
        return None
    try:
        return datetime.strptime(raw, "%Y-%m-%d %H:%M:%S")
    except ValueError:
        return None

@app.get("/overview")
def get_overview():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) AS c FROM campaigns")
    total_campaigns = cursor.fetchone()["c"]

    cursor.execute("SELECT COUNT(*) AS c FROM campaigns WHERE status IN ('qa_passed', 'qa_failed')")
    validated_campaigns = cursor.fetchone()["c"]

    cursor.execute("SELECT COUNT(*) AS c FROM campaigns WHERE status = 'qa_passed'")
    passed_campaigns = cursor.fetchone()["c"]

    qa_pass_rate = round((passed_campaigns / validated_campaigns) * 100) if validated_campaigns else None

    cursor.execute("SELECT COUNT(*) AS c FROM tickets WHERE status != 'resolved'")
    open_tickets = cursor.fetchone()["c"]

    cursor.execute("SELECT created_at, resolved_at FROM tickets WHERE status = 'resolved' AND resolved_at IS NOT NULL")
    resolved_rows = cursor.fetchall()

    response_hours = []
    for row in resolved_rows:
        created = _parse_ts(row["created_at"])
        resolved = _parse_ts(row["resolved_at"])
        if created and resolved:
            response_hours.append((resolved - created).total_seconds() / 3600)

    avg_sla_response_hours = round(sum(response_hours) / len(response_hours), 1) if response_hours else None

    cursor.execute("SELECT COUNT(*) AS c FROM escalations WHERE current_stage != 'fixed'")
    open_escalations = cursor.fetchone()["c"]

    cursor.execute("""
        SELECT tickets.priority, COUNT(*) AS c
        FROM tickets
        WHERE tickets.status != 'resolved'
        GROUP BY tickets.priority
    """)
    priority_breakdown = {row["priority"]: row["c"] for row in cursor.fetchall()}

    conn.close()

    return {
        "total_campaigns": total_campaigns,
        "validated_campaigns": validated_campaigns,
        "qa_pass_rate": qa_pass_rate,
        "open_tickets": open_tickets,
        "avg_sla_response_hours": avg_sla_response_hours,
        "open_escalations": open_escalations,
        "high_priority_open": priority_breakdown.get("high", 0),
        "standard_priority_open": priority_breakdown.get("standard", 0),
    }
