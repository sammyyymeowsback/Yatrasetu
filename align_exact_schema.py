"""
YatraSetu — Align Destinations Table with Exact Schema Specification.
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import mysql.connector
from config import config

ALTER_STATEMENTS = [
    # Match exact types requested
    "ALTER TABLE destinations MODIFY name VARCHAR(150) NOT NULL;",
    "ALTER TABLE destinations MODIFY district VARCHAR(100);",
    "ALTER TABLE destinations MODIFY area VARCHAR(100);",
    "ALTER TABLE destinations MODIFY latitude DECIMAL(10,7) NOT NULL;",
    "ALTER TABLE destinations MODIFY longitude DECIMAL(10,7) NOT NULL;",
    "ALTER TABLE destinations MODIFY elevation_m INT;",
    "ALTER TABLE destinations MODIFY category VARCHAR(50);",
    "ALTER TABLE destinations MODIFY description TEXT;",
    "ALTER TABLE destinations MODIFY popularity_score DECIMAL(5,2);",
    "ALTER TABLE destinations MODIFY tourism_pressure_score DECIMAL(5,2);",
    "ALTER TABLE destinations MODIFY estimated_daily_capacity INT;",
    "ALTER TABLE destinations MODIFY best_time_start TIME;",
    "ALTER TABLE destinations MODIFY best_time_end TIME;",
    "ALTER TABLE destinations MODIFY best_months VARCHAR(100);",
    "ALTER TABLE destinations MODIFY avg_visit_duration_minutes INT;",
    "ALTER TABLE destinations MODIFY accessibility_level VARCHAR(30);",
    "ALTER TABLE destinations MODIFY community_value_score DECIMAL(5,2);",
    "ALTER TABLE destinations MODIFY risk_baseline VARCHAR(30);",
    "ALTER TABLE destinations MODIFY verified BOOLEAN DEFAULT TRUE;",
]

OBSOLETE_COLUMNS = [
    "region",
    "destination_type",
    "crowd_pressure",
    "accessibility_score",
    "local_opportunity_score",
    "sustainability_score",
    "image_keyword",
    "hidden_gem",
    "best_time",
    "budget_range",
    "tags",
]

def align_schema():
    print("Connecting to MySQL...")
    conn = mysql.connector.connect(
        host=config.MYSQL_HOST,
        port=config.MYSQL_PORT,
        user=config.MYSQL_USER,
        password=config.MYSQL_PASSWORD,
        database=config.MYSQL_DATABASE,
    )
    cur = conn.cursor()

    # Apply type modifications
    for stmt in ALTER_STATEMENTS:
        try:
            cur.execute(stmt)
            print(f"Executed: {stmt}")
        except Exception as e:
            print(f"Notice on '{stmt}': {e}")

    # Drop obsolete columns
    for col in OBSOLETE_COLUMNS:
        try:
            cur.execute(f"ALTER TABLE destinations DROP COLUMN {col};")
            print(f"Dropped obsolete column: {col}")
        except Exception as e:
            # If already dropped, ignore
            pass

    conn.commit()
    cur.close()
    conn.close()
    print("Schema alignment complete!")

if __name__ == "__main__":
    align_schema()
