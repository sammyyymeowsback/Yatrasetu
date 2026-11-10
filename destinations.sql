-- ============================================================
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
(
    1, 'Spiti Valley', 'spiti-valley', 'Lahaul & Spiti', 'Himachal Pradesh', 'Kaza & Pin Valley',
    32.2461000, 78.0349000, 3800, 'nature',
    'High-altitude cold desert valley renowned for 1,000-year-old Buddhist monasteries like Key and Tabo, surreal moonscapes, high Himalayan passes, and crystalline Chandratal lake.',
    45.00, 22.00, 'low', 'low', 1200, 1200,
    '6:00:00', '18:00:00', 'May, Jun, Jul, Aug, Sep, Oct', 240,
    'Moderate', 92.00, 'Moderate', 'low',
    'High-altitude acclimatization required; winter road closures via Rohtang and Kunzum.',
    'Unspoiled Tibetan Buddhist mountain sanctuary with surreal landscapes and starry skies.',
    'Local homestays in Kaza, Langza, and Kibber managed by mountain village communities.',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80',
    TRUE, TRUE, FALSE
),
(
    2, 'Mawlynnong & Living Root Bridges', 'mawlynnong', 'East Khasi Hills', 'Meghalaya', 'Riwai Village',
    25.2017000, 91.8906000, 490, 'culture',
    'Renowned as Asia\'s cleanest village, featuring bio-living root bridges grown by indigenous Khasi tribes from ficus elastica tree roots across rushing streams over centuries.',
    48.00, 30.00, 'low', 'low', 1000, 1000,
    '8:00:00', '17:00:00', 'Oct, Nov, Dec, Jan, Feb, Mar', 180,
    'High', 96.00, 'Low', 'low',
    'Slippery stone pathways during monsoon rainfall.',
    'Marvel of organic tribal engineering and spotlessly maintained garden village.',
    'Village council manages community eco-tourism, bamboo dustbins, and local food stalls.',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
    TRUE, TRUE, FALSE
),
(
    3, 'Chopta & Tungnath Bugyal', 'chopta-tungnath', 'Rudraprayag', 'Uttarakhand', 'Kedarnath Wildlife Sanctuary',
    30.4878000, 79.1764000, 2680, 'nature',
    'Known as the \'Mini Switzerland of Uttarakhand\', alpine bugyals (meadows) surrounded by deodar forest, opening to the high trek to the ancient 1,000-year-old Tungnath temple.',
    49.00, 28.00, 'low', 'low', 1200, 1200,
    '6:00:00', '16:00:00', 'Apr, May, Jun, Sep, Oct, Nov', 300,
    'Moderate (Paved Trek)', 90.00, 'Low', 'low',
    'Winter snowfall closes upper trails; cool temperatures year-round.',
    'Panoramic 360-degree views of Chaukhamba, Nanda Devi, and Trishul peaks.',
    'Eco-camps and Garhwali mountain homestays serving fresh rhododendron squash.',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    TRUE, TRUE, FALSE
),
(
    4, 'Ziro Valley', 'ziro-valley', 'Lower Subansiri', 'Arunachal Pradesh', 'Old Ziro',
    27.5950000, 93.8385000, 1572, 'culture',
    'A tranquil plateau nestled in pine-clad hills, home to the Apatani people celebrated for sustainable agro-ecology, bamboo craftsmanship, and unique cultural heritage.',
    40.00, 18.00, 'low', 'low', 800, 800,
    '7:00:00', '17:00:00', 'Mar, Apr, May, Oct, Nov', 240,
    'Moderate', 95.00, 'Low', 'low',
    'Requires Inner Line Permit (ILP) for entry into Arunachal Pradesh.',
    'Immerse in sustainable Apatani village life surrounded by golden paddy fields.',
    'Apatani community homestays and traditional organic millet tea.',
    'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80',
    TRUE, TRUE, FALSE
),
(
    5, 'Gandikota Gorge', 'gandikota', 'Kadapa', 'Andhra Pradesh', 'Jammalamadugu',
    14.8144000, 78.2865000, 325, 'heritage',
    'India\'s Grand Canyon, where the Pennar River cuts dramatically through the Erramala hills, flanked by the 13th-century red sandstone fort of the Pemmasani Nayaks.',
    42.00, 20.00, 'low', 'low', 1500, 1500,
    '6:00:00', '18:30:00', 'Oct, Nov, Dec, Jan, Feb', 150,
    'High', 88.00, 'Low', 'low',
    'Unfenced gorge cliffs; take caution near ledge.',
    'Breathtaking canyon vistas at sunset and untouched medieval fortress ruins.',
    'Rural cooperative guides and Andhra homestay hospitality.',
    'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?w=800&auto=format&fit=crop&q=80',
    TRUE, TRUE, FALSE
),
(
    6, 'Poovar Estuary & Golden Sandbar', 'poovar', 'Thiruvananthapuram', 'Kerala', 'Neyyattinkara',
    8.3183000, 77.0650000, 5, 'nature',
    'A pristine coastal village where the Neyyar river, calm backwater lagoons, and the Arabian Sea meet at a golden sandbar, fringed by dense mangrove canals.',
    50.00, 32.00, 'low', 'low', 1400, 1400,
    '6:30:00', '18:30:00', 'Sep, Oct, Nov, Dec, Jan, Feb, Mar', 150,
    'High (Boat Transfer)', 89.00, 'Low', 'low',
    'Do not swim on the open sea side due to strong undercurrents.',
    'Country boat rides through silent mangrove bird sanctuaries to a secluded beach.',
    'Operated by local fishermen-turned-boatman eco-tourism guild.',
    'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800&auto=format&fit=crop&q=80',
    TRUE, TRUE, FALSE
),
(
    7, 'Pattadakal & Aihole', 'pattadakal', 'Bagalkot', 'Karnataka', 'Malaprabha River Basin',
    15.9489000, 75.8160000, 545, 'heritage',
    'UNESCO World Heritage complex illustrating the zenith of 7th-8th century Chalukya architecture, harmoniously synthesizing northern Nagara and southern Dravida temple forms.',
    52.00, 25.00, 'low', 'low', 2500, 2500,
    '7:00:00', '18:00:00', 'Oct, Nov, Dec, Jan, Feb, Mar', 180,
    'High', 93.00, 'Low', 'low',
    'Warm midday sun in summer; carry hydration and sun hats.',
    'The cradle of Indian stone temple architecture on the quiet banks of the Malaprabha.',
    'Local certified Archaeological Survey of India (ASI) guides from surrounding villages.',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
    TRUE, TRUE, FALSE
),
(
    8, 'Majuli Island', 'majuli-island', 'Majuli', 'Assam', 'Garamur & Kamalabari',
    26.9500000, 94.2167000, 84, 'culture',
    'World\'s largest river island formed by the Brahmaputra, preserved as the spiritual hub of Assam\'s neo-Vaishnavite Satras and master bamboo mask sculptors.',
    44.00, 24.00, 'low', 'low', 1500, 1500,
    '7:00:00', '17:30:00', 'Oct, Nov, Dec, Jan, Feb, Mar', 300,
    'Moderate (Ferry)', 95.00, 'Low', 'low',
    'River ferry schedules depend on water levels and daylight.',
    'Experience centuries-old classical Sattriya dance and eco-friendly mask crafts.',
    'Mishing tribal villages offering stilt-cottage stays and apong hospitality.',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80',
    TRUE, TRUE, FALSE
),
(
    9, 'Dholavira Harappan Metropolis', 'dholavira', 'Kutch', 'Gujarat', 'Khadir Bet Island',
    23.8864000, 70.2131000, 17, 'heritage',
    'UNESCO World Heritage Indus Valley Civilization city dating back 5,000 years, acclaimed for its sophisticated stone urban layout, huge step-reservoirs, and citadels.',
    41.00, 19.00, 'low', 'low', 1200, 1200,
    '7:00:00', '18:00:00', 'Nov, Dec, Jan, Feb', 180,
    'High', 96.00, 'Low', 'low',
    'Remote island location; check vehicle fuel before crossing the Great Rann.',
    'Walk through intact bronze-age streets and ancient civil-engineering marvels.',
    'Kutchi embroidery artisans and traditional Bhunga mud-house homestays.',
    'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop&q=80',
    TRUE, TRUE, FALSE
),
(
    10, 'Bundi Stepwells & Fort', 'bundi', 'Bundi', 'Rajasthan', 'Old Town',
    25.4414000, 75.6441000, 268, 'heritage',
    'The blue-hued jewel of southeastern Rajasthan, celebrated for ornate subterranean stepwells (baoris), the hillside Taragarh Fort, and world-famous miniature fresco murals.',
    47.00, 25.00, 'low', 'low', 1500, 1500,
    '8:00:00', '18:00:00', 'Oct, Nov, Dec, Jan, Feb, Mar', 180,
    'High', 91.00, 'Low', 'low',
    'Cobblestone streets best explored on foot.',
    'Unspoiled Rajasthani royal charm, tranquil blue streets, and stepwell engineering.',
    'Family-run heritage havelis and traditional pottery workshops.',
    'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80',
    TRUE, TRUE, FALSE
),
(
    11, 'Champaner-Pavagadh', 'champaner', 'Panchmahal', 'Gujarat', 'Pavagadh Foothills',
    22.4833000, 73.5333000, 168, 'heritage',
    'A remarkably complete, unexcavated medieval city built by Sultan Mahmud Begada in the 15th century, featuring stone-carved mosques, stepped wells, and hilltop hill-fort walls.',
    46.00, 24.00, 'low', 'low', 2000, 2000,
    '8:00:00', '17:30:00', 'Oct, Nov, Dec, Jan, Feb, Mar', 180,
    'High', 91.00, 'Low', 'low',
    'Extensive walking between heritage monuments.',
    'Lush forested blend of Hindu and Islamic stone artistry frozen in time.',
    'Local cooperative heritage custodians and craftspeople.',
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&auto=format&fit=crop&q=80',
    TRUE, TRUE, FALSE
),
(
    12, 'Khajjiar & Kalatop Sanctuary', 'khajjiar', 'Chamba', 'Himachal Pradesh', 'Dalhousie Sub-Division',
    32.5511000, 76.0656000, 1920, 'nature',
    'A saucer-shaped alpine glade nestled in deodar and cedar forests with a small stream-fed lake and floating weed island, with tranquil views of Mount Kailash.',
    62.00, 40.00, 'moderate', 'moderate', 2000, 2000,
    '8:30:00', '18:00:00', 'Mar, Apr, May, Jun, Sep, Oct', 120,
    'High', 80.00, 'Low', 'low',
    'Monsoon fog can reduce visibility on ghat roads.',
    'Idyllic pine forest walks and peaceful picnic meadows away from urban rush.',
    'Chamba Pahari woollen shawls and local pine-honey sellers.',
    'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?w=800&auto=format&fit=crop&q=80',
    TRUE, TRUE, FALSE
),
(
    13, 'Tawang & Sela Pass', 'tawang', 'Tawang', 'Arunachal Pradesh', 'Monpa Heartland',
    27.5861000, 91.8594000, 3048, 'culture',
    'Spectacular Himalayan valley home to India\'s largest Tibetan Buddhist monastery (founded 1681), sacred high-altitude alpine lakes, and hospitable Monpa tribes.',
    53.00, 28.00, 'low', 'low', 1000, 1000,
    '7:00:00', '16:30:00', 'Apr, May, Sep, Oct, Nov', 240,
    'Moderate', 95.00, 'Moderate', 'low',
    'High elevation mountain pass (Sela Pass at 4,170m) can receive heavy snow.',
    'Spiritual tranquility amidst dramatic snow peaks and Monpa hospitality.',
    'Monastery monks and village homestays serving authentic Tibetan butter tea.',
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    TRUE, TRUE, FALSE
),
(
    14, 'Orchha Palaces & Cenotaphs', 'orchha', 'Niwari', 'Madhya Pradesh', 'Betwa Riverfront',
    25.3500000, 78.6400000, 252, 'heritage',
    'A serene 16th-century royal capital of the Bundela kings on the river Betwa, boasting magnificent stone palaces, ornate murals, and iconic multi-tiered royal chhatris (cenotaphs).',
    48.00, 26.00, 'low', 'low', 1800, 1800,
    '7:00:00', '18:30:00', 'Oct, Nov, Dec, Jan, Feb, Mar', 210,
    'High', 92.00, 'Low', 'low',
    'River banks have swift currents during monsoon.',
    'Architectural grandeur without the tourist swarms of northern circuit cities.',
    'Local village artists preserving Bundeli painting traditions.',
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
    TRUE, TRUE, FALSE
),
(
    15, 'Dzukou Valley', 'dzukou-valley', 'Kohima', 'Nagaland', 'Viswema-Jakhama Border',
    25.5539000, 94.0411000, 2452, 'nature',
    'A mystical high-altitude sanctuary with undulating emerald bamboo-grass hills, cold mountain streams, and the endemic seasonal Dzukou lily.',
    38.00, 15.00, 'low', 'low', 500, 500,
    '6:00:00', '16:00:00', 'Jun, Jul, Aug, Sep, Oct, Nov', 360,
    'Moderate (Trek)', 94.00, 'Moderate', 'low',
    'Steep trail ascent; carry thermal layers and rain protection.',
    'Trek through untouched rolling green meadows far removed from civilization.',
    'Maintained as a plastic-free zone by Southern Angami Youth Organization (SAYO).',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',
    TRUE, TRUE, FALSE
),
(
    16, 'Lamahatta Eco Park', 'lamahatta', 'Darjeeling', 'West Bengal', 'Lopchu-Peshok',
    27.0600000, 88.3500000, 2000, 'nature',
    'A serene mountain village community project featuring towering, prayer-flag draped pine and dhupi forests, manicured terraced gardens, and a sacred hilltop lake.',
    55.00, 32.00, 'low', 'low', 1200, 1200,
    '8:00:00', '17:00:00', 'Oct, Nov, Dec, Feb, Mar, Apr, May', 120,
    'Moderate (Steps)', 95.00, 'Low', 'low',
    'Uphill trail to sacred lake requires moderate walking fitness.',
    'Whispering pine canopies, Tibetan prayer flags, and tranquil mountain reflection.',
    'Model eco-tourism village initiated and managed entirely by local villagers.',
    'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',
    TRUE, TRUE, FALSE
);

-- Also sync destinations table
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
