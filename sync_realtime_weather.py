"""
YatraSetu — sync_realtime_weather.py

Fetches 100% live real-time meteorological observations for all 25
Darjeeling destinations from Open-Meteo and persists them into
the weather_observations MySQL table. Also exports a fresh SQL seed file.
"""

import os
import sys

# Ensure root is in sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.open_meteo_service import fetch_and_save_realtime_weather_batch
from models.weather import get_all_latest_weather_observations


def export_sql_seed(observations, filepath="database/seed/weather_observations.sql"):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write("-- ============================================================\n")
        f.write("-- YatraSetu — weather_observations Live Snapshot Seed\n")
        f.write(f"-- Fetched live from Open-Meteo coordinate API\n")
        f.write(f"-- Total Destinations: {len(observations)}\n")
        f.write("-- ============================================================\n\n")
        f.write("USE yatrasetu;\n\n")
        f.write("CREATE TABLE IF NOT EXISTS weather_observations (\n")
        f.write("    id                          INT AUTO_INCREMENT PRIMARY KEY,\n")
        f.write("    destination_id              INT NOT NULL,\n")
        f.write("    observed_at                 DATETIME NOT NULL,\n")
        f.write("    temperature_c               DECIMAL(5,2),\n")
        f.write("    precipitation_mm            DECIMAL(6,2),\n")
        f.write("    precipitation_probability   INT,\n")
        f.write("    humidity                    INT,\n")
        f.write("    wind_speed_kmh              DECIMAL(6,2),\n")
        f.write("    weather_code                INT,\n")
        f.write("    source                      VARCHAR(100) DEFAULT 'open-meteo',\n")
        f.write("    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE,\n")
        f.write("    INDEX idx_weather_obs_dest (destination_id),\n")
        f.write("    INDEX idx_weather_obs_observed (destination_id, observed_at)\n")
        f.write(") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n")
        f.write("INSERT INTO weather_observations (\n")
        f.write("    destination_id, observed_at, temperature_c, precipitation_mm,\n")
        f.write("    precipitation_probability, humidity, wind_speed_kmh, weather_code, source\n")
        f.write(") VALUES\n")

        rows = []
        for obs in observations:
            rows.append(
                f"({obs['destination_id']}, '{obs['observed_at']}', {obs['temperature_c']}, "
                f"{obs['precipitation_mm']}, {obs['precipitation_probability']}, {obs['humidity']}, "
                f"{obs['wind_speed_kmh']}, {obs['weather_code']}, '{obs['source']}')"
            )
        f.write(",\n".join(rows) + ";\n")
    print(f"Exported SQL seed to {filepath}")


def sync():
    print("Fetching live real-time weather from Open-Meteo...")
    observations = fetch_and_save_realtime_weather_batch()
    print(f"Recorded {len(observations)} live weather records into MySQL.")
    export_sql_seed(observations)

    latest = get_all_latest_weather_observations()
    print(f"\n--- Live Weather Summary ({len(latest)} Destinations) ---")
    for o in latest:
        d_id = o.get("destination_id")
        name = o.get("destination_name")
        temp = o.get("temperature_c")
        rain = o.get("precipitation_mm")
        prob = o.get("precipitation_probability")
        cond = o.get("condition")
        print(f"[{d_id:2d}] {name:<35} : {temp}C | Rain: {rain}mm ({prob}%) | {cond}")


if __name__ == "__main__":
    sync()
