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

ddl_statements = [
    """
    CREATE TABLE IF NOT EXISTS submissions (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        spot_name VARCHAR(150) NOT NULL,
        description TEXT,
        category ENUM('heritage','nature','culture','rural','spiritual') NOT NULL DEFAULT 'heritage',
        latitude DECIMAL(9,6) NOT NULL,
        longitude DECIMAL(9,6) NOT NULL,
        image_path VARCHAR(255) DEFAULT NULL,
        reason_to_visit TEXT,
        status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
        approved_destination_id INT UNSIGNED DEFAULT NULL,
        submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        reviewed_at TIMESTAMP NULL DEFAULT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """,
    """
    CREATE TABLE IF NOT EXISTS admins (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(80) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """,
    """
    CREATE TABLE IF NOT EXISTS weather_cache (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        destination_id INT UNSIGNED NOT NULL,
        temperature DECIMAL(5,2) DEFAULT NULL,
        conditions VARCHAR(100) DEFAULT NULL,
        precipitation_probability TINYINT UNSIGNED DEFAULT NULL,
        warning VARCHAR(255) DEFAULT NULL,
        is_demo_data TINYINT(1) NOT NULL DEFAULT 0,
        fetched_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_weather_dest_fetched (destination_id, fetched_at DESC)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """,
    """
    CREATE TABLE IF NOT EXISTS risk_assessments (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        destination_id INT UNSIGNED NOT NULL,
        risk_level ENUM('low','moderate','high') NOT NULL DEFAULT 'low',
        source ENUM('verified','demo') NOT NULL DEFAULT 'demo',
        notes TEXT,
        assessed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_risk_dest_assessed (destination_id, assessed_at DESC)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """
]

for ddl in ddl_statements:
    try:
        cur.execute(ddl)
        print("Created table successfully.")
    except Exception as e:
        print("Error creating table:", e)

conn.commit()
print("All remaining tables verified and created!")
