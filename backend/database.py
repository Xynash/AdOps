import sqlite3

DB_NAME = "adsquadops.db"

def get_db():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS campaigns (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            destination_url TEXT NOT NULL,
            tracking_tag TEXT NOT NULL,
            ad_copy TEXT,
            status TEXT DEFAULT 'draft',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS qa_checks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            campaign_id INTEGER NOT NULL,
            check_type TEXT NOT NULL,
            passed INTEGER NOT NULL,
            detail TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (campaign_id) REFERENCES campaigns (id)
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tickets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            campaign_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            priority TEXT NOT NULL DEFAULT 'standard',
            sla_hours INTEGER NOT NULL DEFAULT 4,
            status TEXT NOT NULL DEFAULT 'open',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            resolved_at TEXT,
            FOREIGN KEY (campaign_id) REFERENCES campaigns (id)
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS escalations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ticket_id INTEGER NOT NULL,
            reason TEXT NOT NULL,
            owner_team TEXT NOT NULL,
            current_stage TEXT NOT NULL DEFAULT 'reported',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (ticket_id) REFERENCES tickets (id)
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS escalation_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            escalation_id INTEGER NOT NULL,
            stage TEXT NOT NULL,
            note TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (escalation_id) REFERENCES escalations (id)
        )
    """)
    conn.commit()
    conn.close()
