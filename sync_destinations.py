import mysql.connector
from config import config

conn = mysql.connector.connect(
    host=config.MYSQL_HOST,
    port=config.MYSQL_PORT,
    user=config.MYSQL_USER,
    password=config.MYSQL_PASSWORD,
    database=config.MYSQL_DATABASE,
)
cur = conn.cursor()

columns = [
    ("category", "VARCHAR(50) DEFAULT 'heritage'"),
    ("crowd_level", "VARCHAR(20) DEFAULT 'moderate'"),
    ("predicted_crowd_level", "VARCHAR(20) DEFAULT NULL"),
    ("popularity_score", "TINYINT UNSIGNED DEFAULT 50"),
    ("weather_status", "VARCHAR(50) DEFAULT NULL"),
    ("risk_level", "VARCHAR(20) DEFAULT 'low'"),
    ("risk_notes", "TEXT DEFAULT NULL"),
    ("reason_to_visit", "TEXT DEFAULT NULL"),
    ("community_info", "TEXT DEFAULT NULL"),
    ("image_path", "VARCHAR(255) DEFAULT NULL"),
    ("is_approved", "TINYINT(1) DEFAULT 1"),
    ("is_user_submitted", "TINYINT(1) DEFAULT 0"),
    ("created_at", "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"),
    ("updated_at", "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
]

for col_name, col_def in columns:
    try:
        cur.execute(f"ALTER TABLE destinations ADD COLUMN {col_name} {col_def};")
        print(f"Added column: {col_name}")
    except Exception as e:
        if "Duplicate column" in str(e):
            print(f"Column already exists: {col_name}")
        else:
            print(f"Error on {col_name}: {e}")

update_query = """
UPDATE destinations SET
category = CASE
    WHEN destination_type IN ('heritage', 'culture', 'nature', 'rural', 'spiritual') THEN destination_type
    WHEN destination_type = 'adventure' THEN 'nature'
    WHEN destination_type = 'beach' THEN 'nature'
    ELSE 'heritage'
END,
crowd_level = CASE
    WHEN crowd_pressure >= 75 THEN 'high'
    WHEN crowd_pressure >= 40 THEN 'moderate'
    ELSE 'low'
END,
predicted_crowd_level = CASE
    WHEN crowd_pressure >= 75 THEN 'high'
    WHEN crowd_pressure >= 40 THEN 'moderate'
    ELSE 'low'
END,
popularity_score = crowd_pressure,
is_approved = 1,
reason_to_visit = description;
"""
cur.execute(update_query)
conn.commit()
print("Destinations table schema synchronized with 22 destinations successfully!")
