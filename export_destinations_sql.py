import mysql.connector
from config import config

conn = mysql.connector.connect(
    host=config.MYSQL_HOST,
    port=config.MYSQL_PORT,
    user=config.MYSQL_USER,
    password=config.MYSQL_PASSWORD,
    database=config.MYSQL_DATABASE,
)
cur = conn.cursor(dictionary=True)
cur.execute("SELECT * FROM card_destinations ORDER BY id")
rows = cur.fetchall()

sql = """-- ============================================================
-- YatraSetu — 24 Curated All-India Offbeat Hidden Gems Seed Data
-- ============================================================

USE yatrasetu;

CREATE TABLE IF NOT EXISTS card_destinations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(160) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    area VARCHAR(100) DEFAULT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    elevation_m INT DEFAULT NULL,
    category VARCHAR(50) DEFAULT 'heritage',
    description TEXT DEFAULT NULL,
    popularity_score DECIMAL(5, 2) DEFAULT 50.00,
    tourism_pressure_score DECIMAL(5, 2) DEFAULT 30.00,
    crowd_level VARCHAR(20) DEFAULT 'low',
    predicted_crowd_level VARCHAR(20) DEFAULT 'low',
    capacity INT DEFAULT 1000,
    estimated_daily_capacity INT DEFAULT 1000,
    best_time_start TIME DEFAULT NULL,
    best_time_end TIME DEFAULT NULL,
    best_months VARCHAR(100) DEFAULT NULL,
    avg_visit_duration_minutes INT DEFAULT 120,
    accessibility_level VARCHAR(50) DEFAULT 'High',
    community_value_score DECIMAL(5, 2) DEFAULT 80.00,
    risk_baseline VARCHAR(30) DEFAULT 'Low',
    risk_level VARCHAR(20) DEFAULT 'low',
    risk_notes TEXT DEFAULT NULL,
    reason_to_visit TEXT DEFAULT NULL,
    community_info TEXT DEFAULT NULL,
    image_path VARCHAR(500) DEFAULT NULL,
    verified TINYINT(1) DEFAULT 1,
    is_approved TINYINT(1) DEFAULT 1,
    is_user_submitted TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_card_category (category),
    INDEX idx_card_crowd (crowd_level),
    INDEX idx_card_state (state)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

TRUNCATE TABLE card_destinations;

INSERT INTO card_destinations (
    id, name, slug, district, state, area, latitude, longitude, elevation_m,
    category, description, popularity_score, tourism_pressure_score,
    crowd_level, predicted_crowd_level, capacity, estimated_daily_capacity,
    best_time_start, best_time_end, best_months, avg_visit_duration_minutes,
    accessibility_level, community_value_score, risk_baseline, risk_level,
    risk_notes, reason_to_visit, community_info, image_path,
    verified, is_approved, is_user_submitted
) VALUES
"""

def esc(v):
    if v is None:
        return "NULL"
    if isinstance(v, (int, float)):
        return str(v)
    s = str(v).replace("'", "\\'")
    return f"'{s}'"

vals = []
for r in rows:
    row_str = (
        f"(\n"
        f"    {r['id']}, {esc(r['name'])}, {esc(r['slug'])}, {esc(r['district'])}, {esc(r['state'])}, {esc(r['area'])},\n"
        f"    {r['latitude']}, {r['longitude']}, {r['elevation_m'] or 'NULL'}, {esc(r['category'])},\n"
        f"    {esc(r['description'])},\n"
        f"    {r['popularity_score']}, {r['tourism_pressure_score']}, {esc(r['crowd_level'])}, {esc(r['predicted_crowd_level'])}, {r['capacity']}, {r['estimated_daily_capacity']},\n"
        f"    {esc(str(r['best_time_start']) if r['best_time_start'] else None)}, {esc(str(r['best_time_end']) if r['best_time_end'] else None)}, {esc(r['best_months'])}, {r['avg_visit_duration_minutes']},\n"
        f"    {esc(r['accessibility_level'])}, {r['community_value_score']}, {esc(r['risk_baseline'])}, {esc(r['risk_level'])},\n"
        f"    {esc(r['risk_notes'])},\n"
        f"    {esc(r['reason_to_visit'])},\n"
        f"    {esc(r['community_info'])},\n"
        f"    {esc(r['image_path'])},\n"
        f"    TRUE, TRUE, FALSE\n"
        f")"
    )
    vals.append(row_str)

sql += ",\n".join(vals) + ";\n\n"

sql += """-- Also sync destinations table
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE destinations;

INSERT INTO destinations (
    id, name, slug, district, state, area, latitude, longitude, elevation_m,
    category, description, popularity_score, tourism_pressure_score,
    crowd_level, predicted_crowd_level, capacity, estimated_daily_capacity,
    best_time_start, best_time_end, best_months, avg_visit_duration_minutes,
    accessibility_level, community_value_score, risk_baseline, risk_level,
    risk_notes, reason_to_visit, community_info, image_path,
    verified, is_approved, is_user_submitted
)
SELECT
    id, name, slug, district, state, area, latitude, longitude, elevation_m,
    category, description, popularity_score, tourism_pressure_score,
    crowd_level, predicted_crowd_level, capacity, estimated_daily_capacity,
    best_time_start, best_time_end, best_months, avg_visit_duration_minutes,
    accessibility_level, community_value_score, risk_baseline, risk_level,
    risk_notes, reason_to_visit, community_info, image_path,
    verified, is_approved, is_user_submitted
FROM card_destinations;

SET FOREIGN_KEY_CHECKS = 1;
"""

with open("database/seed/destinations.sql", "w", encoding="utf-8") as f:
    f.write(sql)

print("Wrote database/seed/destinations.sql successfully!")
cur.close()
conn.close()
