"""
YatraSetu — seed_experiences.py

Seeds 25 authentic community-based tourism micro-experiences
for Darjeeling destinations, linking destinations directly to
local cooperatives, indigenous artisans, and rural homestays.
Exports database/seed/local_experiences.sql.
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import mysql.connector
from config import config

EXPERIENCES = [
    {
        "destination_id": 1,
        "title": "Senchal High-Altitude Dawn Birding & Butter Tea",
        "experience_type": "nature_walk",
        "description": "Pre-dawn high-altitude birding walk with certified local naturalist guides following the sunrise, concluding with hot butter tea and momos at a village cooperative stall.",
        "duration_minutes": 90,
        "price_inr": 350,
        "booking_type": "walk_in",
        "local_partner": "Senchal Forest Guides & Tea Cooperative",
        "community_revenue_pct": 100,
        "best_time": "Dawn (05:00 - 06:30)",
    },
    {
        "destination_id": 2,
        "title": "Gorkha Handloom Weaving & Woolen Knitwear Workshop",
        "experience_type": "craft_workshop",
        "description": "Interactive demonstration of traditional wooden handloom weaving and mountain wool spinning by local Gorkha artisan women.",
        "duration_minutes": 60,
        "price_inr": 200,
        "booking_type": "walk_in",
        "local_partner": "Gorkha Women Handloom Guild",
        "community_revenue_pct": 95,
        "best_time": "Morning (10:00 - 12:00)",
    },
    {
        "destination_id": 3,
        "title": "Heritage Colonial Tea Salon & Literary History Walk",
        "experience_type": "cultural",
        "description": "Guided walking tour through Darjeelings 19th-century colonial bookshops, Oxford Bookstore archives, and traditional Himalayan bakeries.",
        "duration_minutes": 75,
        "price_inr": 250,
        "booking_type": "walk_in",
        "local_partner": "Darjeeling Heritage Walkers Guild",
        "community_revenue_pct": 90,
        "best_time": "Afternoon (15:00 - 17:00)",
    },
    {
        "destination_id": 4,
        "title": "Steam Locomotive Heritage Shed & Engine Driver Stories",
        "experience_type": "heritage",
        "description": "Behind-the-scenes visit to the vintage 1881 steam locomotive loco shed with retired railway foremen sharing tales of mountain track engineering.",
        "duration_minutes": 60,
        "price_inr": 300,
        "booking_type": "prior_booking",
        "local_partner": "DHR Heritage Railway Workers Union",
        "community_revenue_pct": 85,
        "best_time": "Morning (09:30 - 11:00)",
    },
    {
        "destination_id": 5,
        "title": "Everest Expedition Equipment & Climbing Knot Masterclass",
        "experience_type": "adventure",
        "description": "Hands-on alpine knot tying, safety harness rigging, and Everest expedition equipment handling led by certified Sherpa instructors.",
        "duration_minutes": 90,
        "price_inr": 400,
        "booking_type": "walk_in",
        "local_partner": "Sherpa Alpine Instructors Association",
        "community_revenue_pct": 90,
        "best_time": "Morning (10:00 - 12:00)",
    },
    {
        "destination_id": 6,
        "title": "High-Altitude Wildlife Conservation & Red Panda Habitat Talk",
        "experience_type": "nature_walk",
        "description": "Guided naturalist walkthrough exploring captive breeding and habitat preservation for endangered Red Pandas and Snow Leopards.",
        "duration_minutes": 75,
        "price_inr": 250,
        "booking_type": "walk_in",
        "local_partner": "Himalayan Wildlife Naturalist Forum",
        "community_revenue_pct": 100,
        "best_time": "Morning (10:00 - 11:30)",
    },
    {
        "destination_id": 7,
        "title": "Buddhist Evening Drumming Chant & Sunset Meditation",
        "experience_type": "spiritual",
        "description": "Join resident Buddhist monks for rhythmic Uchiwadaiko (peace drum) chanting and silent sunset meditation overlooking the valley.",
        "duration_minutes": 60,
        "price_inr": 0,
        "booking_type": "free_community",
        "local_partner": "Nipponzan Myohoji Peace Society",
        "community_revenue_pct": 100,
        "best_time": "Sunset (16:30 - 17:30)",
    },
    {
        "destination_id": 8,
        "title": "Tukvar Valley Tea Garden Terracing & River Descent Trail",
        "experience_type": "nature_walk",
        "description": "Guided walking trail from the lower Tukvar ropeway terminal down to the Rangeet river valley through century-old tea terraces.",
        "duration_minutes": 120,
        "price_inr": 500,
        "booking_type": "prior_booking",
        "local_partner": "Tukvar Valley Village Guides",
        "community_revenue_pct": 100,
        "best_time": "Morning (10:30 - 12:30)",
    },
    {
        "destination_id": 9,
        "title": "First Flush Orthodox Tea Tasting & Plucking Workshop",
        "experience_type": "tea_tasting",
        "description": "Hands-on two leaves and a bud harvesting directly with resident tea pickers, followed by factory tasting of Muscatel and White Darjeeling teas.",
        "duration_minutes": 90,
        "price_inr": 450,
        "booking_type": "walk_in",
        "local_partner": "Happy Valley Workers Cooperative",
        "community_revenue_pct": 85,
        "best_time": "Morning (09:30 - 11:30)",
    },
    {
        "destination_id": 10,
        "title": "Tibetan Thangka Painting & Sacred Script Calligraphy",
        "experience_type": "craft_workshop",
        "description": "Learn traditional Tibetan mineral pigment grinding and sacred scroll painting under the direct mentorship of a resident master artist.",
        "duration_minutes": 90,
        "price_inr": 500,
        "booking_type": "prior_booking",
        "local_partner": "Tibetan Refugee Self-Help Centre",
        "community_revenue_pct": 100,
        "best_time": "Afternoon (14:00 - 16:00)",
    },
    {
        "destination_id": 11,
        "title": "Monastic Morning Chanting & Butter Sculpting Observation",
        "experience_type": "spiritual",
        "description": "Observe the atmospheric morning assembly of 200+ monks chanting deep sutras and crafting intricate colored yak-butter sacrificial sculptures.",
        "duration_minutes": 60,
        "price_inr": 0,
        "booking_type": "free_community",
        "local_partner": "Drukpa Kagyud Monastic Trust",
        "community_revenue_pct": 100,
        "best_time": "Early Morning (06:00 - 07:30)",
    },
    {
        "destination_id": 12,
        "title": "Bhutia Tribal Heritage Homestyle Lunch & Folklore",
        "experience_type": "culinary",
        "description": "Home-cooked traditional meal of fermented spinach (Gundruk), millet bread (Phale), and steaming Tingmo in a Bhutia village family home.",
        "duration_minutes": 75,
        "price_inr": 350,
        "booking_type": "prior_booking",
        "local_partner": "Bhutia Busty Community Kitchen",
        "community_revenue_pct": 100,
        "best_time": "Lunchtime (12:30 - 14:00)",
    },
    {
        "destination_id": 13,
        "title": "Organic Mountain Orange Juice Tasting & Waterfall Botany Walk",
        "experience_type": "nature_walk",
        "description": "Sample freshly hand-pressed Darjeeling mandarin orange juice while discovering wild ferns and Himalayan orchid species with valley farmers.",
        "duration_minutes": 60,
        "price_inr": 200,
        "booking_type": "walk_in",
        "local_partner": "Barbotey Valley Farmers Collective",
        "community_revenue_pct": 100,
        "best_time": "Morning (11:00 - 12:30)",
    },
    {
        "destination_id": 14,
        "title": "Ancient Palm-Leaf Scripture Archival Tour & Tibetan Incense",
        "experience_type": "cultural",
        "description": "Exclusive visit to the 1850 monastic library holding ancient Buddhist manuscripts and handmade medicinal herbal incense rolling.",
        "duration_minutes": 60,
        "price_inr": 150,
        "booking_type": "walk_in",
        "local_partner": "Yiga Choeling Archival Society",
        "community_revenue_pct": 100,
        "best_time": "Morning (09:00 - 10:30)",
    },
    {
        "destination_id": 15,
        "title": "Beginner Natural Rock Climbing & Rappelling Workshop",
        "experience_type": "adventure",
        "description": "Certified climbing safety instruction, harness rigging, and hands-on natural rock wall climbing where Everest mountaineers first trained.",
        "duration_minutes": 90,
        "price_inr": 600,
        "booking_type": "walk_in",
        "local_partner": "Sherpa Adventure Guides Guild",
        "community_revenue_pct": 95,
        "best_time": "Morning (10:00 - 12:00)",
    },
    {
        "destination_id": 16,
        "title": "Pine Canopy Meditation & Sacred Hilltop Lake Trek",
        "experience_type": "nature_walk",
        "description": "Silent meditative walk through towering silver firs up to the sacred mountaintop lake ringed by fluttering prayer flags. 100% of admission funds the village school.",
        "duration_minutes": 120,
        "price_inr": 200,
        "booking_type": "walk_in",
        "local_partner": "Lamahatta Village Eco-Tourism Committee",
        "community_revenue_pct": 100,
        "best_time": "Morning (09:00 - 11:30)",
    },
    {
        "destination_id": 17,
        "title": "Colonial Bungalow Architectural Trail & Rare Orchid Nursery",
        "experience_type": "heritage",
        "description": "Walk through 1900s British stone heritage bungalows, followed by a visit to the century-old Takdah Orchid Centre housing endangered species.",
        "duration_minutes": 90,
        "price_inr": 300,
        "booking_type": "walk_in",
        "local_partner": "Takdah Heritage Youth Forum",
        "community_revenue_pct": 100,
        "best_time": "Morning (10:00 - 12:00)",
    },
    {
        "destination_id": 18,
        "title": "Organic Orange Blossom Honey & Homestead Farmstay Experience",
        "experience_type": "homestay",
        "description": "Visit organic village permaculture farms, taste pure raw orange blossom honey, and enjoy a wood-fired farm-to-table lunch.",
        "duration_minutes": 120,
        "price_inr": 500,
        "booking_type": "prior_booking",
        "local_partner": "Tinchuley WWF Model Eco Cooperative",
        "community_revenue_pct": 100,
        "best_time": "Lunchtime (11:30 - 14:00)",
    },
    {
        "destination_id": 19,
        "title": "Senchal Sanctuary Red Panda Conservation & Birding Walk",
        "experience_type": "nature_walk",
        "description": "Explore virgin rhododendron forests with indigenous village trackers to spot rare mountain birds, barking deer, and signs of red pandas.",
        "duration_minutes": 150,
        "price_inr": 750,
        "booking_type": "prior_booking",
        "local_partner": "Chatakpur Eco-Development Committee",
        "community_revenue_pct": 100,
        "best_time": "Dawn (05:30 - 08:30)",
    },
    {
        "destination_id": 20,
        "title": "Century-Old Fireplace Tea Salon & Artisan Rolling Workshop",
        "experience_type": "tea_tasting",
        "description": "Learn artisanal hand-rolling of tea leaves and enjoy hot private-blend estate tea by an authentic 1862 Victorian stone fireplace.",
        "duration_minutes": 90,
        "price_inr": 600,
        "booking_type": "prior_booking",
        "local_partner": "Singtom Estate Workers Heritage Trust",
        "community_revenue_pct": 85,
        "best_time": "Afternoon (14:00 - 16:00)",
    },
    {
        "destination_id": 21,
        "title": "Rungdung River Valley Bamboo & Hornbill Birding Trail",
        "experience_type": "nature_walk",
        "description": "River basin forest walk seeking Rufous-necked Hornbills followed by seasonal bamboo shoot pickle tasting with resident families.",
        "duration_minutes": 120,
        "price_inr": 400,
        "booking_type": "walk_in",
        "local_partner": "Rangaroon Community Ecotourism Network",
        "community_revenue_pct": 100,
        "best_time": "Morning (08:30 - 11:00)",
    },
    {
        "destination_id": 22,
        "title": "Indigenous Lepcha Folklore, Flute Music & Herbal Tea Gathering",
        "experience_type": "cultural",
        "description": "Evening gathering around a hearth listening to indigenous Lepcha mythology, traditional bamboo flute tunes, and sipping wild-foraged herbal infusions.",
        "duration_minutes": 90,
        "price_inr": 300,
        "booking_type": "prior_booking",
        "local_partner": "Lepcha Indigenous Heritage Society",
        "community_revenue_pct": 100,
        "best_time": "Evening (17:00 - 18:30)",
    },
    {
        "destination_id": 23,
        "title": "Local Boatmen Rowing & Organic Cardamom Farm Trail",
        "experience_type": "nature_walk",
        "description": "Wooden boat ride across Sumendu lake rowed by licensed resident boatmen, followed by a walk through village large-cardamom plantations.",
        "duration_minutes": 90,
        "price_inr": 350,
        "booking_type": "walk_in",
        "local_partner": "Mirik Boatmen & Farmers Union",
        "community_revenue_pct": 100,
        "best_time": "Morning (10:00 - 12:00)",
    },
    {
        "destination_id": 24,
        "title": "Makaibari Women Homestay & Biodynamic Tea Rolling Experience",
        "experience_type": "homestay",
        "description": "Spend an afternoon inside a tea-picker family cottage learning biodynamic agricultural lore, hand-sorting tea, and enjoying a home meal.",
        "duration_minutes": 150,
        "price_inr": 700,
        "booking_type": "prior_booking",
        "local_partner": "Makaibari Women Homestay Association",
        "community_revenue_pct": 100,
        "best_time": "Afternoon (13:00 - 16:00)",
    },
    {
        "destination_id": 25,
        "title": "Himalayan Ridge Paragliding & Indigenous Floriculture Nursery",
        "experience_type": "adventure",
        "description": "Tandem paragliding flight over the Teesta valley followed by a visit to a village cactus and cymbidium orchid greenhouse.",
        "duration_minutes": 90,
        "price_inr": 2500,
        "booking_type": "prior_booking",
        "local_partner": "Kalimpong Adventure Pilots & Florists Guild",
        "community_revenue_pct": 90,
        "best_time": "Morning (09:00 - 11:30)",
    },
]

def export_sql_file(filepath="database/seed/local_experiences.sql"):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write("-- ============================================================\\n")
        f.write("-- YatraSetu — local_experiences Seed Dataset\\n")
        f.write(f"-- Total Community Experiences: {len(EXPERIENCES)}\\n")
        f.write("-- ============================================================\\n\\n")
        f.write("USE yatrasetu;\\n\\n")
        f.write("CREATE TABLE IF NOT EXISTS local_experiences (\\n")
        f.write("    id                          INT AUTO_INCREMENT PRIMARY KEY,\\n")
        f.write("    destination_id              INT NOT NULL,\\n")
        f.write("    title                       VARCHAR(150) NOT NULL,\\n")
        f.write("    experience_type             VARCHAR(50) NOT NULL,\\n")
        f.write("    description                 TEXT,\\n")
        f.write("    duration_minutes            INT DEFAULT 90,\\n")
        f.write("    price_inr                   INT DEFAULT 0,\\n")
        f.write("    booking_type                VARCHAR(30) DEFAULT 'walk_in',\\n")
        f.write("    local_partner               VARCHAR(150),\\n")
        f.write("    community_revenue_pct       INT DEFAULT 100,\\n")
        f.write("    best_time                   VARCHAR(50),\\n")
        f.write("    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE,\\n")
        f.write("    INDEX idx_exp_dest (destination_id),\\n")
        f.write("    INDEX idx_exp_type (experience_type)\\n")
        f.write(") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\\n\\n")
        f.write("INSERT INTO local_experiences (\\n")
        f.write("    destination_id, title, experience_type, description,\\n")
        f.write("    duration_minutes, price_inr, booking_type, local_partner,\\n")
        f.write("    community_revenue_pct, best_time\\n")
        f.write(") VALUES\\n")

        rows = []
        for e in EXPERIENCES:
            desc = e['description'].replace("'", "\\'")
            t = e['title'].replace("'", "\\'")
            p = e['local_partner'].replace("'", "\\'")
            rows.append(
                f"({e['destination_id']}, '{t}', '{e['experience_type']}', '{desc}', "
                f"{e['duration_minutes']}, {e['price_inr']}, '{e['booking_type']}', '{p}', "
                f"{e['community_revenue_pct']}, '{e['best_time']}')"
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
        cursor.execute("DELETE FROM local_experiences")
        conn.commit()

        from database.seed_darjeeling import DESTINATIONS_DATA
        cursor.execute("SELECT id, slug FROM destinations")
        slug_to_id = {row[1]: row[0] for row in cursor.fetchall()}
        idx_to_id = {i + 1: slug_to_id.get(d["slug"]) for i, d in enumerate(DESTINATIONS_DATA)}

        resolved_experiences = []
        for exp in EXPERIENCES:
            e_copy = dict(exp)
            e_copy["destination_id"] = idx_to_id.get(exp["destination_id"], exp["destination_id"])
            resolved_experiences.append(e_copy)

        insert_sql = """
        INSERT INTO local_experiences (
            destination_id, title, experience_type, description,
            duration_minutes, price_inr, booking_type, local_partner,
            community_revenue_pct, best_time
        ) VALUES (
            %(destination_id)s, %(title)s, %(experience_type)s, %(description)s,
            %(duration_minutes)s, %(price_inr)s, %(booking_type)s, %(local_partner)s,
            %(community_revenue_pct)s, %(best_time)s
        )
        """
        cursor.executemany(insert_sql, resolved_experiences)
        conn.commit()
        print(f"Successfully seeded {cursor.rowcount} local experiences into MySQL!")
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    seed()
