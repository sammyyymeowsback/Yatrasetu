"""
YatraSetu — seed_risk_profiles.py

Populates 25 authentic, terrain-grounded risk profiles for Darjeeling
destinations based on the Darjeeling District Disaster Management Plan (DDMA).
Exports standalone SQL seed in database/seed/risk_profiles.sql.
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import mysql.connector
from config import config

RISK_PROFILES = [
    {
        "destination_id": 1,
        "baseline_risk": "Moderate",
        "landslide_sensitivity": "Moderate",
        "heavy_rain_sensitivity": "Moderate",
        "road_access_type": "Narrow Mountain Ascent",
        "fog_vulnerability": "High",
        "safety_advisory": "Extreme pre-dawn vehicle queues, sub-zero dawn chill, and dense winter morning mist. Carry heavy woollens and depart by 3:45 AM.",
        "emergency_contact": "Jorebungalow Police Outpost: 0354-2252100",
        "source": "Darjeeling DDMA / WBTDC",
    },
    {
        "destination_id": 2,
        "baseline_risk": "Low",
        "landslide_sensitivity": "Low",
        "heavy_rain_sensitivity": "Low",
        "road_access_type": "Paved Highway (NH 55)",
        "fog_vulnerability": "Moderate",
        "safety_advisory": "Paved railway loop with broad viewing gardens. Exercise trackside safety caution when steam train joyrides pass.",
        "emergency_contact": "Ghoom Police Station: 0354-2252100",
        "source": "Darjeeling DDMA / UNESCO DHR",
    },
    {
        "destination_id": 3,
        "baseline_risk": "Low",
        "landslide_sensitivity": "Low",
        "heavy_rain_sensitivity": "Low",
        "road_access_type": "Pedestrian Promenade (No Vehicles)",
        "fog_vulnerability": "Low",
        "safety_advisory": "Pedestrianised town square with stone paving. Zero vehicular traffic risk. Stone surface slippery when wet during heavy rain.",
        "emergency_contact": "Sadar Police Station Darjeeling: 0354-2254422",
        "source": "Darjeeling DDMA / WBTDC",
    },
    {
        "destination_id": 4,
        "baseline_risk": "Moderate",
        "landslide_sensitivity": "Moderate",
        "heavy_rain_sensitivity": "High",
        "road_access_type": "Hill Cart Road Track Corridor",
        "fog_vulnerability": "Moderate",
        "safety_advisory": "Narrow gauge mountain track runs alongside Hill Cart Road; services may be suspended during heavy continuous monsoon rains due to track mudslides.",
        "emergency_contact": "DHR Station Master / Railway Helpline: 139",
        "source": "Indian Railways / Darjeeling DDMA",
    },
    {
        "destination_id": 5,
        "baseline_risk": "Low",
        "landslide_sensitivity": "Low",
        "heavy_rain_sensitivity": "Low",
        "road_access_type": "Paved Complex Walking Path",
        "fog_vulnerability": "Low",
        "safety_advisory": "Well-paved campus paths inside Birch Hill park. NOTE: Complex is closed on Thursdays for weekly maintenance.",
        "emergency_contact": "HMI Campus Security: 0354-2254087",
        "source": "HMI / WBTDC",
    },
    {
        "destination_id": 6,
        "baseline_risk": "Low",
        "landslide_sensitivity": "Low",
        "heavy_rain_sensitivity": "Moderate",
        "road_access_type": "Paved Incline Walking Paths",
        "fog_vulnerability": "Low",
        "safety_advisory": "Steep internal walking paths may be slippery during rain; wear non-slip footwear. NOTE: Closed on Thursdays for animal rest.",
        "emergency_contact": "Darjeeling Zoo Office: 0354-2253709",
        "source": "Central Zoo Authority / Darjeeling DDMA",
    },
    {
        "destination_id": 7,
        "baseline_risk": "Low",
        "landslide_sensitivity": "Low",
        "heavy_rain_sensitivity": "Low",
        "road_access_type": "Paved Jalapahar Approach Road",
        "fog_vulnerability": "Moderate",
        "safety_advisory": "Paved ridge road with gentle steps to the pagoda dome. Peaceful ground; drive with headlights during evening Jalapahar fog.",
        "emergency_contact": "Darjeeling Tourist Police: 0354-2254422",
        "source": "Darjeeling DDMA / WBTDC",
    },
    {
        "destination_id": 8,
        "baseline_risk": "Moderate",
        "landslide_sensitivity": "Low",
        "heavy_rain_sensitivity": "High",
        "road_access_type": "Paved Lebong Cart Road",
        "fog_vulnerability": "High",
        "safety_advisory": "Aerial cable operations strictly halted when valley wind speeds exceed 32 km/h or during dense mist obscuring tower visibility.",
        "emergency_contact": "Ropeway Terminal Control: 0354-2270008",
        "source": "WBFDC Ropeway Safety Protocols",
    },
    {
        "destination_id": 9,
        "baseline_risk": "Low",
        "landslide_sensitivity": "Low",
        "heavy_rain_sensitivity": "Moderate",
        "road_access_type": "Paved Estate Access / Terrace Trails",
        "fog_vulnerability": "Moderate",
        "safety_advisory": "Walking along stepped tea terraces requires comfortable sports shoes; terrace grass is slippery during monsoons.",
        "emergency_contact": "Happy Valley Estate Office: 0354-2252405",
        "source": "Tea Board of India / WBTDC",
    },
    {
        "destination_id": 10,
        "baseline_risk": "Low",
        "landslide_sensitivity": "Low",
        "heavy_rain_sensitivity": "Low",
        "road_access_type": "Town Centre Paved Street (Gandhi Rd)",
        "fog_vulnerability": "Low",
        "safety_advisory": "Indoor cultural museum with zero weather or terrain hazards. Ideal safe sanctuary during heavy mountain rain.",
        "emergency_contact": "Sadar Police Station: 0354-2254422",
        "source": "Manjushree Centre of Tibetan Culture",
    },
    {
        "destination_id": 11,
        "baseline_risk": "Low",
        "landslide_sensitivity": "Low",
        "heavy_rain_sensitivity": "Low",
        "road_access_type": "Direct Roadside on Hill Cart Road",
        "fog_vulnerability": "Low",
        "safety_advisory": "Direct roadside entry with dedicated parking. Safe in all weather conditions.",
        "emergency_contact": "Dali Monastery Office: 0354-2254215",
        "source": "Darjeeling District Administration",
    },
    {
        "destination_id": 12,
        "baseline_risk": "Low",
        "landslide_sensitivity": "Low",
        "heavy_rain_sensitivity": "Moderate",
        "road_access_type": "Paved Downhill Slope Road",
        "fog_vulnerability": "Moderate",
        "safety_advisory": "Gentle downhill walking descent from Chowrasta; concrete gradient can be slick after rains.",
        "emergency_contact": "Tourist Information Centre: 0354-2254214",
        "source": "Darjeeling Cultural Archives / DDMA",
    },
    {
        "destination_id": 13,
        "baseline_risk": "Moderate",
        "landslide_sensitivity": "High",
        "heavy_rain_sensitivity": "High",
        "road_access_type": "Steep Hairpin Valley Descent",
        "fog_vulnerability": "Low",
        "safety_advisory": "Road descends 10 km down steep valley hairpins. Hazardous during torrential downpours (>15 mm/hr) due to loose scree and waterfall runoff.",
        "emergency_contact": "Darjeeling Disaster Control Room: 0354-2255749",
        "source": "Darjeeling DDMA Barbotey Valley Assessment",
    },
    {
        "destination_id": 14,
        "baseline_risk": "Low",
        "landslide_sensitivity": "Low",
        "heavy_rain_sensitivity": "Low",
        "road_access_type": "Paved Ridge Approach",
        "fog_vulnerability": "Moderate",
        "safety_advisory": "Situated on high stable ridge in Ghoom. Safe access; frequent afternoon mountain fog.",
        "emergency_contact": "Ghoom Outpost: 0354-2252100",
        "source": "Darjeeling District Administration",
    },
    {
        "destination_id": 15,
        "baseline_risk": "Moderate",
        "landslide_sensitivity": "Low",
        "heavy_rain_sensitivity": "High",
        "road_access_type": "Roadside Paved Lebong Cart Rd",
        "fog_vulnerability": "Low",
        "safety_advisory": "Natural rock climbing surface becomes unscalable and dangerous when wet. Climbing suspended during rain; certified guide harness mandatory.",
        "emergency_contact": "HMI Rescue Cell: 0354-2254087",
        "source": "HMI Adventure Safety Standards",
    },
    {
        "destination_id": 16,
        "baseline_risk": "Low",
        "landslide_sensitivity": "Low",
        "heavy_rain_sensitivity": "Low",
        "road_access_type": "Paved State Highway (Peshok Road)",
        "fog_vulnerability": "Moderate",
        "safety_advisory": "Dense pine canopy and gravel timber steps. Very stable ground even in wet weather; fog adds mystical ambiance.",
        "emergency_contact": "Rangli Rangliot PS: 0354-2264225",
        "source": "West Bengal Forest Dept / WBTDC",
    },
    {
        "destination_id": 17,
        "baseline_risk": "Moderate",
        "landslide_sensitivity": "Moderate",
        "heavy_rain_sensitivity": "Moderate",
        "road_access_type": "Narrow Winding Tea Valley Road",
        "fog_vulnerability": "High",
        "safety_advisory": "Renowned as the valley of mist. Dense afternoon fog reduces road visibility under 10 meters; drive with fog lamps and slow speed.",
        "emergency_contact": "Takdah Police Outpost: 0354-2264225",
        "source": "Darjeeling DDMA / WBTDC Heritage Wing",
    },
    {
        "destination_id": 18,
        "baseline_risk": "Moderate",
        "landslide_sensitivity": "Low",
        "heavy_rain_sensitivity": "Moderate",
        "road_access_type": "Single-Lane Ridge Road with Passing Bays",
        "fog_vulnerability": "Moderate",
        "safety_advisory": "Narrow single-lane mountain ridge road requires horn honking on blind curves. Village trails well-maintained by local committee.",
        "emergency_contact": "Teesta Valley Police Assistance: 0354-2264225",
        "source": "WWF Eco-Tourism / Darjeeling DDMA",
    },
    {
        "destination_id": 19,
        "baseline_risk": "Moderate",
        "landslide_sensitivity": "Moderate",
        "heavy_rain_sensitivity": "High",
        "road_access_type": "Unpaved Forest Track (4x4 Only)",
        "fog_vulnerability": "High",
        "safety_advisory": "Located inside Senchal Wildlife Sanctuary. Track accessible strictly by 4x4 high-clearance vehicles. Forest Dept permits required; trail closed mid-June to mid-Sept.",
        "emergency_contact": "Forest Range Office Sonada: 0354-2272202",
        "source": "WBFDC Senchal Wildlife Division",
    },
    {
        "destination_id": 20,
        "baseline_risk": "Low",
        "landslide_sensitivity": "Low",
        "heavy_rain_sensitivity": "Low",
        "road_access_type": "Paved Private Estate Road",
        "fog_vulnerability": "Low",
        "safety_advisory": "Private estate road with concrete paving. Safe year-round access.",
        "emergency_contact": "Darjeeling Tourist Assistance: 0354-2254422",
        "source": "Darjeeling Tea Association Archives",
    },
    {
        "destination_id": 21,
        "baseline_risk": "Moderate",
        "landslide_sensitivity": "Moderate",
        "heavy_rain_sensitivity": "Moderate",
        "road_access_type": "Valley Descent Hill Road",
        "fog_vulnerability": "Moderate",
        "safety_advisory": "Descent from 3rd Mile toward Rungdung river; watch for loose pebbles on roadside shoulders during rainy periods.",
        "emergency_contact": "Jorebungalow Outpost: 0354-2252100",
        "source": "Darjeeling DDMA / Senchal Range",
    },
    {
        "destination_id": 22,
        "baseline_risk": "Low",
        "landslide_sensitivity": "Low",
        "heavy_rain_sensitivity": "Low",
        "road_access_type": "Paved Highway (Ghoom-Mirik Road)",
        "fog_vulnerability": "High",
        "safety_advisory": "Pristine oak/pine forest along Highway. Frequent winter and evening fog; drive cautiously around Sukiapokhri turn.",
        "emergency_contact": "Sukiapokhri Police Station: 0354-2262225",
        "source": "WBFDC Eco-Tourism Network / DDMA",
    },
    {
        "destination_id": 23,
        "baseline_risk": "Low",
        "landslide_sensitivity": "Low",
        "heavy_rain_sensitivity": "Low",
        "road_access_type": "Paved Scenic Highway (State Highway 12)",
        "fog_vulnerability": "Low",
        "safety_advisory": "Flat perimeter path around lake; life jackets required on paddle boats. Broad, well-maintained arterial highway.",
        "emergency_contact": "Mirik Police Station: 0354-2243225",
        "source": "Darjeeling District Administration / WBTDC",
    },
    {
        "destination_id": 24,
        "baseline_risk": "Low",
        "landslide_sensitivity": "Low",
        "heavy_rain_sensitivity": "Low",
        "road_access_type": "National Highway 110 (Dual-Lane Paved)",
        "fog_vulnerability": "Low",
        "safety_advisory": "Direct access on National Highway 110. Safest hill access route in the district with all-weather accessibility.",
        "emergency_contact": "Kurseong Police Station: 0354-2344222",
        "source": "National Highway Authority / DDMA",
    },
    {
        "destination_id": 25,
        "baseline_risk": "Low",
        "landslide_sensitivity": "Low",
        "heavy_rain_sensitivity": "Low",
        "road_access_type": "Paved Scenic Ridge Road",
        "fog_vulnerability": "Low",
        "safety_advisory": "Wide manicured ridge top. Paragliding operations require DGCA certified pilots and clear thermal wind conditions.",
        "emergency_contact": "Kalimpong Police Control: 03552-255225",
        "source": "Kalimpong District Administration / WBTDC",
    },
    {
        "destination_id": 26,
        "baseline_risk": "Low",
        "landslide_sensitivity": "Low",
        "heavy_rain_sensitivity": "Low",
        "road_access_type": "Paved Highway & Urban Arteries (NH 55)",
        "fog_vulnerability": "Moderate",
        "safety_advisory": "Standard mountain hill station precautions. Keep warm layers for chilly evenings and monitor morning road traffic on Hill Cart Road.",
        "emergency_contact": "Darjeeling Tourist Police: 0354-2252100 | Sadar Hospital: 0354-2252211",
        "source": "Darjeeling DDMA / WBTDC",
    },
]

def export_sql_file(filepath="database/seed/risk_profiles.sql"):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write("-- ============================================================\\n")
        f.write("-- YatraSetu — risk_profiles Seed Dataset\\n")
        f.write("-- Grounded in the Darjeeling District Disaster Management Plan\\n")
        f.write(f"-- Total Destinations: {len(RISK_PROFILES)}\\n")
        f.write("-- ============================================================\\n\\n")
        f.write("USE yatrasetu;\\n\\n")
        f.write("CREATE TABLE IF NOT EXISTS risk_profiles (\\n")
        f.write("    id                          INT AUTO_INCREMENT PRIMARY KEY,\\n")
        f.write("    destination_id              INT NOT NULL,\\n")
        f.write("    baseline_risk               VARCHAR(20) DEFAULT 'Low',\\n")
        f.write("    landslide_sensitivity       VARCHAR(20) DEFAULT 'Low',\\n")
        f.write("    heavy_rain_sensitivity      VARCHAR(20) DEFAULT 'Low',\\n")
        f.write("    road_access_type            VARCHAR(50) DEFAULT 'Paved Road',\\n")
        f.write("    fog_vulnerability           VARCHAR(20) DEFAULT 'Low',\\n")
        f.write("    safety_advisory             TEXT,\\n")
        f.write("    emergency_contact           VARCHAR(100) DEFAULT 'Darjeeling Police Control: 0354-2254422',\\n")
        f.write("    source                      VARCHAR(100) DEFAULT 'Darjeeling DDMA / WBTDC',\\n")
        f.write("    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE,\\n")
        f.write("    INDEX idx_risk_dest (destination_id),\\n")
        f.write("    INDEX idx_risk_baseline (baseline_risk)\\n")
        f.write(") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\\n\\n")
        f.write("INSERT INTO risk_profiles (\\n")
        f.write("    destination_id, baseline_risk, landslide_sensitivity,\\n")
        f.write("    heavy_rain_sensitivity, road_access_type, fog_vulnerability,\\n")
        f.write("    safety_advisory, emergency_contact, source\\n")
        f.write(") VALUES\\n")

        rows = []
        for r in RISK_PROFILES:
            adv = r['safety_advisory'].replace("'", "\\'")
            rows.append(
                f"({r['destination_id']}, '{r['baseline_risk']}', '{r['landslide_sensitivity']}', "
                f"'{r['heavy_rain_sensitivity']}', '{r['road_access_type']}', '{r['fog_vulnerability']}', "
                f"'{adv}', '{r['emergency_contact']}', '{r['source']}')"
            )
        f.write(",\\n".join(rows) + ";\\n")
    print(f"Exported SQL seed to {filepath}")

def seed():
    export_sql_file()
    conn = mysql.connector.connect(
        host=config.MYSQL_HOST,
        port=config.MYSQL_PORT,
        user=config.MYSQL_USER,
        password=config.MYSQL_PASSWORD,
        database=config.MYSQL_DATABASE,
    )
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM risk_profiles")
        conn.commit()

        insert_sql = """
        INSERT INTO risk_profiles (
            destination_id, baseline_risk, landslide_sensitivity,
            heavy_rain_sensitivity, road_access_type, fog_vulnerability,
            safety_advisory, emergency_contact, source
        ) VALUES (
            %(destination_id)s, %(baseline_risk)s, %(landslide_sensitivity)s,
            %(heavy_rain_sensitivity)s, %(road_access_type)s, %(fog_vulnerability)s,
            %(safety_advisory)s, %(emergency_contact)s, %(source)s
        )
        """
        cursor.executemany(insert_sql, RISK_PROFILES)
        conn.commit()
        print(f"Successfully seeded {cursor.rowcount} risk profiles into MySQL!")
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    seed()
