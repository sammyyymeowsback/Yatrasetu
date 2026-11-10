-- ============================================================
-- YatraSetu — Tourism Events & Festivals Seed Data
-- Strict Real-World Data from Official Sources:
--   - Darjeeling District Police Official Notifications
--   - Gorkhaland Territorial Administration (GTA) Tourism Dept
--   - Northeast Frontier Railway (NFR) Press Releases
--   - Department of Tourism, Govt of West Bengal
--   - Monastic Committees & Cultural Councils
-- ============================================================

USE yatrasetu;

DELETE FROM tourism_events;

INSERT INTO tourism_events (
    id, destination_id, name, event_type, start_date, end_date,
    location_name, impact_level, crowd_surge_multiplier,
    traffic_restrictions, description, official_source
) VALUES
(
    1, 3, 'Darjeeling Police Hill Marathon', 'Sports & Community',
    '2024-11-24', '2024-11-24', 'Chowrasta Mall to Ghoom & Jorebungalow (Hill Cart Road)', 'HIGH', 2.2,
    'Vehicular movement completely restricted on Hill Cart Road (NH-55) and Gandhi Road between 05:00 AM and 11:00 AM. Emergency vehicles only via Lebong Cart Road.',
    'Flagged off by Darjeeling District Police from Chowrasta Mall. Features 21K Half Marathon and 10K Run attracting thousands of national and Himalayan runners. High pedestrian crowds around Mall and Ghoom.',
    'Darjeeling District Police / West Bengal Police Official Notification'
),
(
    2, 3, 'Darjeeling Melo-Tea Fest', 'Cultural & Music Festival',
    '2024-12-21', '2024-12-23', 'Chowrasta Mall & Gymkhana Grounds', 'VERY_HIGH', 2.5,
    'Pedestrian-only restrictions enforced from Clubside to Chowrasta; heavy evening taxi gridlock on Laden La Road and Cart Road after 16:00.',
    'Organized by Gorkhaland Territorial Administration (GTA) Tourism and Information & Cultural Affairs. Highlights premium Darjeeling orthodox tea tastings, indie rock and folk music stages, cultural showcases, and handicrafts.',
    'Gorkhaland Territorial Administration (GTA) Tourism Department'
),
(
    3, 3, 'Durga Puja Autumn Festive Surge', 'Regional Holiday Surge',
    '2024-10-09', '2024-10-14', 'Darjeeling Town Promenade & Hill Viewing Points', 'CRITICAL', 2.8,
    'One-way traffic rules strictly enforced on Rohini Road and Pankhabari Road. Parking near Chowrasta/Mall totally prohibited. Extended taxi queues at Siliguri Junction.',
    'Peak annual festive holiday surge across West Bengal. 100% hotel occupancy across Darjeeling, extreme queues at Tiger Hill dawn viewpoint and DHR Toy Train counters. Night illumination on Mall Road.',
    'Department of Tourism, Govt of West Bengal / Darjeeling Traffic Police'
),
(
    4, 4, 'DHR UNESCO Heritage & Ghum Festival', 'Heritage & Tourism',
    '2024-11-12', '2024-12-04', 'Ghoom Railway Station & Darjeeling Station', 'HIGH', 2.0,
    'Slow-moving vehicular traffic along Hill Cart Road parallel to railway track during special steam heritage convoy runs.',
    'Organized by Northeast Frontier Railway (NFR) celebrating the Darjeeling Himalayan Railway UNESCO World Heritage status. Features steam engine exhibits, evening cultural concerts at Ghum station (2,258m), and joyride surges.',
    'Northeast Frontier Railway (NFR) / Indian Railways Public Circular'
),
(
    5, 11, 'Losar — Tibetan New Year Monastic Cham Dances', 'Spiritual & Religious',
    '2025-02-28', '2025-03-02', 'Dali Monastery (Druk Sangag Choling) & Ghoom Monastery', 'HIGH', 1.9,
    'Dali Monastery stretch on Hill Cart Road experiences heavy roadside parking and devotee foot traffic from 08:00 AM to 14:00.',
    'Tibetan New Year celebrations featuring sacred Cham (sacred masked dances) by Buddhist lamas accompanied by traditional cymbals and long horns, expulsion of negative energies, and butter lamp rituals.',
    'Druk Sangag Choling Monastic Committee / Yiga Choeling Trust'
),
(
    6, 7, 'Saga Dawa Sacred Procession', 'Spiritual & Religious',
    '2024-05-23', '2024-05-23', 'Observatory Hill to Japanese Peace Pagoda via Chowrasta', 'HIGH', 1.85,
    'Jalapahar Road and Gandhi Road closed to through vehicular traffic between 08:30 AM and 13:00 during the grand religious procession.',
    'Holiest month of Tibetan Buddhist calendar commemorating Buddha Shakyamunis birth, enlightenment, and parinirvana. Hundreds of monks and devotees carry holy Kangyur scriptures through Darjeeling streets.',
    'Darjeeling Buddhist Council & Nipponzan Myohoji Temple'
),
(
    7, 3, 'Bhanu Jayanti Cultural Commemoration', 'Cultural & Civic',
    '2024-07-13', '2024-07-13', 'Chowrasta Mall (Bhanubhakta Statue) & Gorkha Ranga Manch', 'HIGH', 1.75,
    'Lebong Cart Road and Mall vicinity experience heavy foot movement; official dignitary convoys escorted through town.',
    'Official GTA gazetted public celebration commemorating pioneer Nepali poet Adi Kavi Bhanubhakta Acharya. Traditional Gorkha attire rallies, Maruni and Tamang Selo folk performances, and literary gatherings.',
    'GTA Department of Information and Cultural Affairs (I&CA)'
),
(
    8, 17, 'Takdah Spring Orchid & Floriculture Exhibition', 'Nature & Agriculture',
    '2025-03-20', '2025-03-24', 'Takdah Orchid Research Centre & Rungli Rungliot Valleys', 'MEDIUM', 1.5,
    'Narrow Peshok-Takdah connector road sees moderate tourist shuttle congestion; passing turnouts monitored by local traffic wardens.',
    'Annual spring bloom exhibition organized by the Directorate of Cinchona & Medicinal Plants. Displays over 110 species of rare Himalayan orchids, hybrid blooms, and medicinal flora with guided garden walks.',
    'Directorate of Cinchona and Other Medicinal Plants / GTA Horticulture'
),
(
    9, 18, 'Maghey Sankranti Teesta-Rangeet Triveni Mela', 'Folk Fair & River Festival',
    '2025-01-14', '2025-01-16', 'Triveni Confluence (Teesta & Rangeet Rivers, near Peshok/Tinchuley)', 'HIGH', 1.8,
    'Heavy vehicle congestion along NH-10 and Teesta Bazar junction towards Triveni camping grounds; parking managed by local youth club.',
    'Traditional mid-winter river festival celebrated at the confluence of Teesta and Rangeet rivers. Holy river bathing, traditional Nepali food stalls (sel roti, tarul, gundruk), folk music, and beach camping.',
    'GTA Cultural Tourism Wing & Triveni Festival Committee'
),
(
    10, 1, 'Tiger Hill Autumn Clear-Sky Sunrise Surge', 'Seasonal Peak Rush',
    '2024-10-15', '2024-11-15', 'Tiger Hill Observatory & Senchal Sanctuary Gates', 'CRITICAL', 2.4,
    'Jorebungalow to Tiger Hill ascent restricted to permitted tourist syndicate 4WD vehicles. Vehicles queued from 03:30 AM; cutoff entry at 05:15 AM.',
    'The clearest window of the year for panoramic Kanchenjunga sunrises causes an overwhelming vehicular rush of 600+ SUVs every morning. Severe parking saturation at the observation pavilion.',
    'Darjeeling Traffic Police Dawn Advisory / Senchal Forest Division'
);
