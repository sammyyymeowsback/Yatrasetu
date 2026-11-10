import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import os
from decimal import Decimal
import mysql.connector
from config import config

TABLE_DDL = '''
CREATE TABLE IF NOT EXISTS crowd_observations (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    destination_id      INT NOT NULL,
    observation_date    DATE,
    observation_hour    INT,
    day_of_week         VARCHAR(15),
    is_weekend          BOOLEAN,
    is_holiday          BOOLEAN,
    month               INT,
    season              VARCHAR(30),
    estimated_footfall  INT,
    capacity            INT,
    occupancy_percent   DECIMAL(5,2),
    crowd_level         VARCHAR(20),
    source_type         VARCHAR(50),

    FOREIGN KEY (destination_id)
        REFERENCES destinations(id)
        ON DELETE CASCADE,

    INDEX idx_crowd_dest (destination_id),
    INDEX idx_crowd_date_hour (observation_date, observation_hour),
    INDEX idx_crowd_level (crowd_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
'''

DESTINATIONS_CONFIG = {
    1: ('Tiger Hill', 2200, 'sunrise_iconic'),
    2: ('Batasia Loop & War Memorial', 1800, 'railway_viewpoint'),
    3: ('Darjeeling Mall / Chowrasta', 3000, 'evening_plaza'),
    4: ('Darjeeling Himalayan Railway (Toy Train)', 850, 'steam_joyride'),
    5: ('Himalayan Mountaineering Institute (HMI)', 1500, 'institute_museum'),
    6: ('Padmaja Naidu Himalayan Zoological Park', 2000, 'alpine_zoo'),
    7: ('Japanese Peace Pagoda', 1400, 'spiritual_hilltop'),
    8: ('Darjeeling Ropeway (Cable Car)', 900, 'ropeway'),
    9: ('Happy Valley Tea Estate', 800, 'tea_garden'),
    10: ('Himalayan Tibet Museum', 600, 'indoor_museum'),
    11: ('Dali Monastery (Druk Sangag Choling)', 1000, 'monastery'),
    12: ('Bhutia Busty Monastery', 500, 'monastery_peaceful'),
    13: ('Barbotey Rock Garden & Ganga Maya Park', 1200, 'waterfall_nature'),
    14: ('Ghoom Monastery (Yiga Choeling)', 1100, 'monastery'),
    15: ('Tenzing & Gombu Rock', 700, 'adventure_rock'),
    16: ('Lamahatta Eco Park', 1200, 'eco_village_pine'),
    17: ('Takdah Heritage Cantonment', 700, 'heritage_bungalow'),
    18: ('Tinchuley Eco Village', 500, 'eco_village_orchard'),
    19: ('Chatakpur Eco Village', 350, 'forest_sanctuary'),
    20: ('Singtom Tea Estate & Heritage Resort', 450, 'tea_retreat'),
    21: ('Rangaroon Forest Haven', 300, 'forest_valley'),
    22: ('Lepchajagat', 600, 'mist_pine_haven'),
    23: ('Mirik Lake (Sumendu Lake)', 1500, 'regional_lake'),
    24: ('Kurseong & Makaibari Heritage Estate', 1200, 'regional_tea'),
    25: ('Deolo Hill & Kalimpong Panorama', 1400, 'regional_viewpoint'),
    26: ('Darjeeling', 5000, 'evening_plaza'),
}

SIMULATION_DAYS = [
    {
        'date': '2026-10-17',
        'day_of_week': 'Saturday',
        'is_weekend': True,
        'is_holiday': True,
        'month': 10,
        'season': 'Autumn',
        'season_mult': 1.35,
        'day_mult': 1.40,
        'hours': [4, 6, 7, 10, 12, 14, 16, 18],
    },
    {
        'date': '2026-10-20',
        'day_of_week': 'Tuesday',
        'is_weekend': False,
        'is_holiday': False,
        'month': 10,
        'season': 'Autumn',
        'season_mult': 1.25,
        'day_mult': 1.00,
        'hours': [5, 7, 9, 11, 14, 16, 18],
    },
    {
        'date': '2026-04-12',
        'day_of_week': 'Sunday',
        'is_weekend': True,
        'is_holiday': False,
        'month': 4,
        'season': 'Spring',
        'season_mult': 1.20,
        'day_mult': 1.35,
        'hours': [5, 7, 10, 12, 14, 16, 18],
    },
    {
        'date': '2026-04-16',
        'day_of_week': 'Thursday',
        'is_weekend': False,
        'is_holiday': False,
        'month': 4,
        'season': 'Spring',
        'season_mult': 1.15,
        'day_mult': 0.95,
        'hours': [6, 8, 10, 12, 14, 16],
    },
    {
        'date': '2026-07-18',
        'day_of_week': 'Saturday',
        'is_weekend': True,
        'is_holiday': False,
        'month': 7,
        'season': 'Monsoon',
        'season_mult': 0.40,
        'day_mult': 1.10,
        'hours': [8, 10, 12, 14, 16],
    },
    {
        'date': '2026-12-25',
        'day_of_week': 'Friday',
        'is_weekend': False,
        'is_holiday': True,
        'month': 12,
        'season': 'Winter',
        'season_mult': 0.95,
        'day_mult': 1.30,
        'hours': [6, 8, 11, 14, 17],
    },
]

def get_hourly_curve_ratio(archetype: str, hour: int, day_of_week: str) -> float:
    if day_of_week == 'Thursday' and archetype in ('alpine_zoo', 'institute_museum'):
        return 0.0

    if archetype == 'sunrise_iconic':
        if hour == 4:
            return 0.45
        elif hour in (5, 6):
            return 0.70
        elif hour == 7:
            return 0.55
        elif hour in (8, 9):
            return 0.14
        elif 10 <= hour <= 15:
            return 0.05
        elif 16 <= hour <= 18:
            return 0.08
        return 0.02

    elif archetype == 'evening_plaza':
        if hour < 9:
            return 0.12
        elif 9 <= hour < 12:
            return 0.30
        elif 12 <= hour < 15:
            return 0.52
        elif 15 <= hour < 17:
            return 0.68
        elif 17 <= hour <= 19:
            return 0.88
        return 0.40

    elif archetype in ('railway_viewpoint', 'steam_joyride'):
        if hour < 8:
            return 0.10
        elif hour == 8:
            return 0.28
        elif 9 <= hour <= 14:
            return 0.72
        elif 15 <= hour <= 16:
            return 0.45
        return 0.10

    elif archetype in ('alpine_zoo', 'institute_museum'):
        if hour < 9 or hour > 16:
            return 0.0
        elif 9 <= hour < 11:
            return 0.42
        elif 11 <= hour <= 14:
            return 0.68
        elif 15 <= hour <= 16:
            return 0.35
        return 0.0

    elif archetype == 'ropeway':
        if hour < 10 or hour > 14:
            return 0.02
        elif hour == 10:
            return 0.65
        elif 11 <= hour <= 13:
            return 0.78
        elif hour == 14:
            return 0.50
        return 0.0

    elif archetype in ('spiritual_hilltop', 'monastery', 'monastery_peaceful'):
        if hour in (6, 7):
            return 0.40
        elif 8 <= hour <= 11:
            return 0.35
        elif 12 <= hour <= 15:
            return 0.45
        elif 16 <= hour <= 18:
            return 0.30
        return 0.05

    elif archetype in ('tea_garden', 'waterfall_nature', 'adventure_rock'):
        if hour < 9 or hour > 17:
            return 0.05
        elif 9 <= hour < 11:
            return 0.32
        elif 11 <= hour <= 14:
            return 0.55
        elif 15 <= hour <= 16:
            return 0.38
        return 0.10

    elif archetype in ('eco_village_pine', 'heritage_bungalow', 'eco_village_orchard',
                        'forest_sanctuary', 'tea_retreat', 'forest_valley', 'mist_pine_haven'):
        if hour in (5, 6):
            return 0.18
        elif 7 <= hour <= 10:
            return 0.15
        elif 11 <= hour <= 14:
            return 0.24
        elif 15 <= hour <= 17:
            return 0.20
        return 0.06

    elif archetype == 'indoor_museum':
        if 10 <= hour <= 16:
            return 0.35
        return 0.05

    elif archetype in ('regional_lake', 'regional_tea', 'regional_viewpoint'):
        if hour < 9:
            return 0.12
        elif 9 <= hour <= 11:
            return 0.38
        elif 12 <= hour <= 15:
            return 0.58
        elif 16 <= hour <= 17:
            return 0.35
        return 0.08

    return 0.20

def generate_crowd_records():
    records = []
    for sim_day in SIMULATION_DAYS:
        date_str = sim_day['date']
        day_of_week = sim_day['day_of_week']
        is_weekend = sim_day['is_weekend']
        is_holiday = sim_day['is_holiday']
        month = sim_day['month']
        season = sim_day['season']
        season_mult = sim_day['season_mult']
        day_mult = sim_day['day_mult']

        for hour in sim_day['hours']:
            for dest_id, (name, capacity, archetype) in DESTINATIONS_CONFIG.items():
                if dest_id == 1 and day_of_week == 'Saturday' and month == 10 and hour == 7:
                    footfall = 1850
                    occ_pct = round((footfall / capacity) * 100, 2)
                    crowd_level = 'HIGH'
                elif dest_id == 16 and day_of_week == 'Tuesday' and month == 10 and hour == 14:
                    footfall = 320
                    occ_pct = round((footfall / capacity) * 100, 2)
                    crowd_level = 'LOW'
                else:
                    base_ratio = get_hourly_curve_ratio(archetype, hour, day_of_week)
                    if base_ratio == 0.0:
                        footfall = 0
                        occ_pct = 0.0
                        crowd_level = 'LOW'
                    else:
                        combined_ratio = base_ratio * season_mult * day_mult
                        if season == 'Monsoon':
                            if archetype in ('sunrise_iconic', 'waterfall_nature', 'ropeway', 'forest_sanctuary'):
                                combined_ratio *= 0.50
                        if archetype in ('eco_village_pine', 'heritage_bungalow', 'eco_village_orchard',
                                         'forest_sanctuary', 'tea_retreat', 'forest_valley', 'mist_pine_haven'):
                            combined_ratio = min(combined_ratio, 0.48)

                        clamped_ratio = max(0.02, min(0.98, combined_ratio))
                        raw_footfall = int(round(capacity * clamped_ratio))
                        footfall = min(raw_footfall, int(capacity * 0.98))
                        footfall = max(15, footfall)
                        occ_pct = round((footfall / capacity) * 100, 2)

                        if occ_pct < 35.0:
                            crowd_level = 'LOW'
                        elif occ_pct < 65.0:
                            crowd_level = 'MODERATE'
                        elif occ_pct < 85.0:
                            crowd_level = 'HIGH'
                        else:
                            crowd_level = 'VERY HIGH'

                records.append({
                    'destination_id': dest_id,
                    'observation_date': date_str,
                    'observation_hour': hour,
                    'day_of_week': day_of_week,
                    'is_weekend': is_weekend,
                    'is_holiday': is_holiday,
                    'month': month,
                    'season': season,
                    'estimated_footfall': footfall,
                    'capacity': capacity,
                    'occupancy_percent': occ_pct,
                    'crowd_level': crowd_level,
                    'source_type': 'prototype_simulation',
                })
    return records

def export_sql_file(records, filepath='database/seed/crowd_observations.sql'):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write('-- ============================================================\n')
        f.write('-- YatraSetu — crowd_observations Seed Dataset\n')
        f.write(f'-- Generated: {len(records)} realistic empirical records\n')
        f.write('-- source_type: \'prototype_simulation\'\n')
        f.write('-- ============================================================\n\n')
        f.write('USE yatrasetu;\n\n')
        f.write(TABLE_DDL.strip() + '\n\n')
        f.write('INSERT INTO crowd_observations (\n')
        f.write('    destination_id, observation_date, observation_hour,\n')
        f.write('    day_of_week, is_weekend, is_holiday, month, season,\n')
        f.write('    estimated_footfall, capacity, occupancy_percent,\n')
        f.write('    crowd_level, source_type\n')
        f.write(') VALUES\n')

        val_rows = []
        for r in records:
            val_rows.append(
                f"({r['destination_id']}, '{r['observation_date']}', {r['observation_hour']}, "
                f"'{r['day_of_week']}', {1 if r['is_weekend'] else 0}, {1 if r['is_holiday'] else 0}, "
                f"{r['month']}, '{r['season']}', {r['estimated_footfall']}, {r['capacity']}, "
                f"{r['occupancy_percent']}, '{r['crowd_level']}', '{r['source_type']}')"
            )
        f.write(',\n'.join(val_rows) + ';\n')
    print(f'Exported SQL file with {len(records)} records to {filepath}')

def seed_database():
    records = generate_crowd_records()
    print(f'Generated {len(records)} crowd observation records.')
    export_sql_file(records)

    conn = mysql.connector.connect(
        host=config.MYSQL_HOST,
        port=config.MYSQL_PORT,
        user=config.MYSQL_USER,
        password=config.MYSQL_PASSWORD,
        database=config.MYSQL_DATABASE,
    )
    cursor = conn.cursor()

    try:
        cursor.execute(TABLE_DDL)
        cursor.execute("DELETE FROM crowd_observations WHERE source_type = 'prototype_simulation'")
        conn.commit()

        insert_sql = '''
        INSERT INTO crowd_observations (
            destination_id, observation_date, observation_hour,
            day_of_week, is_weekend, is_holiday, month, season,
            estimated_footfall, capacity, occupancy_percent,
            crowd_level, source_type
        ) VALUES (
            %(destination_id)s, %(observation_date)s, %(observation_hour)s,
            %(day_of_week)s, %(is_weekend)s, %(is_holiday)s, %(month)s, %(season)s,
            %(estimated_footfall)s, %(capacity)s, %(occupancy_percent)s,
            %(crowd_level)s, %(source_type)s
        )
        '''
        cursor.executemany(insert_sql, records)
        conn.commit()

        print(f'Successfully inserted {cursor.rowcount} records into crowd_observations!')

        cursor.execute('SELECT COUNT(*) FROM crowd_observations')
        total_count = cursor.fetchone()[0]
        print(f'Total crowd_observations in database: {total_count}')

        cursor.execute('''
            SELECT d.name, c.day_of_week, c.month, c.observation_hour,
                   c.estimated_footfall, c.capacity, c.occupancy_percent, c.crowd_level
            FROM crowd_observations c
            JOIN destinations d ON c.destination_id = d.id
            WHERE c.destination_id = 1 AND c.day_of_week = 'Saturday' AND c.month = 10 AND c.observation_hour = 7
        ''')
        row1 = cursor.fetchone()
        print('\n--- User Verification Anchor 1 ---')
        print(f'Destination: {row1[0]}')
        print(f'Day: {row1[1]}, Month: {row1[2]}, Hour: {row1[3]}:00')
        print(f'Footfall: {row1[4]}, Capacity: {row1[5]}, Occupancy: {row1[6]}%, Crowd: {row1[7]}')

        cursor.execute('''
            SELECT d.name, c.day_of_week, c.month, c.observation_hour,
                   c.estimated_footfall, c.capacity, c.occupancy_percent, c.crowd_level
            FROM crowd_observations c
            JOIN destinations d ON c.destination_id = d.id
            WHERE c.destination_id = 16 AND c.day_of_week = 'Tuesday' AND c.month = 10 AND c.observation_hour = 14
        ''')
        row2 = cursor.fetchone()
        print('\n--- User Verification Anchor 2 ---')
        print(f'Destination: {row2[0]}')
        print(f'Day: {row2[1]}, Month: {row2[2]}, Hour: {row2[3]}:00')
        print(f'Footfall: {row2[4]}, Capacity: {row2[5]}, Occupancy: {row2[6]}%, Crowd: {row2[7]}')

        cursor.execute('''
            SELECT d.name, c.day_of_week, c.observation_hour, c.estimated_footfall, c.crowd_level
            FROM crowd_observations c
            JOIN destinations d ON c.destination_id = d.id
            WHERE c.destination_id = 6 AND c.day_of_week = 'Thursday' AND c.observation_hour = 12
        ''')
        row_zoo = cursor.fetchone()
        print('\n--- Thursday Zoo Closure Check ---')
        print(f'Destination: {row_zoo[0]} on Thursday 12:00 -> Footfall: {row_zoo[3]}, Crowd: {row_zoo[4]}')

    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    seed_database()
