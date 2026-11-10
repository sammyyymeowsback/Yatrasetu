-- ============================================================
-- YatraSetu — Route Options & Hill Transit Seed Data
-- Verified Mountain Road Distances & Transit Times
-- Sources: OpenStreetMap (OSM) & WBTDC Hill Route Survey
-- ============================================================

USE yatrasetu;

DELETE FROM route_options;

INSERT INTO route_options (
    origin_id, destination_id, distance_km, duration_minutes,
    road_type, road_condition, scenic_rating, terrain_difficulty,
    via_landmark, advisory_notes, source
) VALUES
(
    17, 20, 0.3, 5,
    'Pedestrian Promenade', 'Cobblestone Walkway', 9.0, 'Easy',
    'via Central Mall Promenade',
    'Pleasant gentle walking route directly into Chowrasta; pedestrian-only zone.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    20, 17, 0.3, 5,
    'Pedestrian Promenade', 'Cobblestone Walkway', 9.0, 'Easy',
    'via Central Mall Promenade',
    'Pleasant gentle walking route directly into Chowrasta; pedestrian-only zone.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    17, 21, 0.8, 10,
    'Pedestrian & Municipal Road', 'Paved Sidewalk', 8.0, 'Easy',
    'via Laden La Road',
    'Short downhill walk to the heritage railway station; sidewalk available.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    21, 17, 0.8, 12,
    'Pedestrian & Municipal Road', 'Paved Sidewalk', 8.0, 'Easy',
    'via Laden La Road',
    'Gentle uphill walking ascent from railway station to town center.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    20, 18, 11.0, 40,
    'Paved Hill Road', 'Good Paved', 9.0, 'Moderate',
    'via Hill Cart Road (NH-55) & Jorebungalow Ascent',
    'Heavy pre-dawn tourist vehicle queues from 03:30 to 06:00 AM; dense morning fog common.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    18, 20, 11.0, 40,
    'Paved Hill Road', 'Good Paved', 9.0, 'Moderate',
    'via Hill Cart Road (NH-55) & Jorebungalow Ascent',
    'Heavy pre-dawn tourist vehicle queues from 03:30 to 06:00 AM; dense morning fog common.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    20, 19, 5.0, 20,
    'Paved National Highway', 'Good Paved', 8.5, 'Easy',
    'via Hill Cart Road (NH-55)',
    'Moderate traffic near Dali during school hours; active Toy Train level crossing.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    19, 20, 5.0, 20,
    'Paved National Highway', 'Good Paved', 8.5, 'Easy',
    'via Hill Cart Road (NH-55)',
    'Moderate traffic near Dali during school hours; active Toy Train level crossing.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    20, 21, 1.2, 8,
    'Pedestrian & Municipal Road', 'Paved', 7.5, 'Easy',
    'via Laden La Road & Station Road',
    'Narrow municipal road; walking descent via Laden La is often faster during midday.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    21, 20, 1.2, 8,
    'Pedestrian & Municipal Road', 'Paved', 7.5, 'Easy',
    'via Laden La Road & Station Road',
    'Narrow municipal road; walking descent via Laden La is often faster during midday.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    20, 22, 2.5, 12,
    'Paved Hill Road', 'Good Paved', 8.0, 'Easy',
    'via Jawahar Parbat & Birch Hill Road',
    'Located inside zoo complex; closed to tourists on Thursdays for sanctuary maintenance.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    22, 20, 2.5, 12,
    'Paved Hill Road', 'Good Paved', 8.0, 'Easy',
    'via Jawahar Parbat & Birch Hill Road',
    'Located inside zoo complex; closed to tourists on Thursdays for sanctuary maintenance.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    20, 23, 2.5, 12,
    'Paved Hill Road', 'Good Paved', 8.0, 'Easy',
    'via Jawahar Parbat & Birch Hill Road',
    'Paved hill incline; zoo is officially closed on Thursdays.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    23, 20, 2.5, 12,
    'Paved Hill Road', 'Good Paved', 8.0, 'Easy',
    'via Jawahar Parbat & Birch Hill Road',
    'Paved hill incline; zoo is officially closed on Thursdays.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    20, 24, 2.8, 15,
    'Paved Hill Road', 'Good Paved', 8.5, 'Moderate',
    'via Jalapahar Road',
    'Narrow approach road with limited parking at Japanese Temple gate; early morning visits recommended.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    24, 20, 2.8, 15,
    'Paved Hill Road', 'Good Paved', 8.5, 'Moderate',
    'via Jalapahar Road',
    'Narrow approach road with limited parking at Japanese Temple gate; early morning visits recommended.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    20, 25, 3.5, 16,
    'Paved Hill Road', 'Good Paved', 8.5, 'Easy',
    'via Lebong Cart Road & Singamari',
    'Cable car operations suspended during strong valley winds or heavy mist.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    25, 20, 3.5, 16,
    'Paved Hill Road', 'Good Paved', 8.5, 'Easy',
    'via Lebong Cart Road & Singamari',
    'Cable car operations suspended during strong valley winds or heavy mist.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    20, 26, 2.2, 12,
    'Narrow Paved Descent', 'Paved with sharp turns', 9.0, 'Moderate',
    'via Lebong Cart Road Tea Garden branch',
    'Steep downhill gradient; tea factory operations best viewed between 09:30 and 15:00.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    26, 20, 2.2, 12,
    'Narrow Paved Descent', 'Paved with sharp turns', 9.0, 'Moderate',
    'via Lebong Cart Road Tea Garden branch',
    'Steep downhill gradient; tea factory operations best viewed between 09:30 and 15:00.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    20, 27, 0.8, 5,
    'Town Commercial Road', 'Paved', 7.0, 'Easy',
    'via Gandhi Road',
    'Convenient walking distance from Chowrasta; safe in all weather conditions.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    27, 20, 0.8, 5,
    'Town Commercial Road', 'Paved', 7.0, 'Easy',
    'via Gandhi Road',
    'Convenient walking distance from Chowrasta; safe in all weather conditions.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    20, 28, 3.8, 15,
    'Paved National Highway', 'Good Paved', 8.0, 'Easy',
    'via Hill Cart Road (NH-55)',
    'Direct roadside parking near monastery gate; evening prayer chanting at 16:30.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    28, 20, 3.8, 15,
    'Paved National Highway', 'Good Paved', 8.0, 'Easy',
    'via Hill Cart Road (NH-55)',
    'Direct roadside parking near monastery gate; evening prayer chanting at 16:30.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    20, 29, 1.5, 12,
    'Paved Walking Descent', 'Narrow hill lane', 8.0, 'Moderate',
    'via CR Das Road / Bhutia Busty lane',
    'Steep walking return back to Chowrasta; gentle pace recommended for elderly travelers.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    29, 20, 1.5, 12,
    'Paved Walking Descent', 'Narrow hill lane', 8.0, 'Moderate',
    'via CR Das Road / Bhutia Busty lane',
    'Steep walking return back to Chowrasta; gentle pace recommended for elderly travelers.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    20, 30, 10.0, 38,
    'Serpentine Valley Road', 'Steep Hairpin Descent', 8.5, 'Challenging',
    'via Barbotey Valley Road',
    'Severe hairpin turns dropping 450m; strictly avoid driving during torrential monsoon downpours.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    30, 20, 10.0, 38,
    'Serpentine Valley Road', 'Steep Hairpin Descent', 8.5, 'Challenging',
    'via Barbotey Valley Road',
    'Severe hairpin turns dropping 450m; strictly avoid driving during torrential monsoon downpours.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    20, 31, 7.0, 25,
    'Paved National Highway', 'Good Paved', 8.0, 'Easy',
    'via Hill Cart Road & Ghoom Monastery Road',
    'Gentle approach from Ghoom station; peaceful morning hours before 11:00.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    31, 20, 7.0, 25,
    'Paved National Highway', 'Good Paved', 8.0, 'Easy',
    'via Hill Cart Road & Ghoom Monastery Road',
    'Gentle approach from Ghoom station; peaceful morning hours before 11:00.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    20, 32, 3.8, 18,
    'Paved Hill Road', 'Good Paved', 8.0, 'Easy',
    'via Lebong Cart Road',
    'Located just past the Ropeway station; certified climbing guides available on site.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    32, 20, 3.8, 18,
    'Paved Hill Road', 'Good Paved', 8.0, 'Easy',
    'via Lebong Cart Road',
    'Located just past the Ropeway station; certified climbing guides available on site.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    20, 33, 23.0, 55,
    'Scenic Hill Highway', 'Good Paved', 9.5, 'Moderate',
    'via Peshok Road / 6th Mile Pine Ridge',
    'Extremely scenic ridge drive through silver fir and pine canopies; tranquil alternative to town crowds.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    33, 20, 23.0, 55,
    'Scenic Hill Highway', 'Good Paved', 9.5, 'Moderate',
    'via Peshok Road / 6th Mile Pine Ridge',
    'Extremely scenic ridge drive through silver fir and pine canopies; tranquil alternative to town crowds.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    20, 34, 26.0, 65,
    'Narrow Hill Connector', 'Paved with blind corners', 9.0, 'Moderate',
    'via 6th Mile & Takdah Orchid Valley Road',
    'Frequent afternoon fog creates low driving visibility; use fog lamps on hill curves.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    34, 20, 26.0, 65,
    'Narrow Hill Connector', 'Paved with blind corners', 9.0, 'Moderate',
    'via 6th Mile & Takdah Orchid Valley Road',
    'Frequent afternoon fog creates low driving visibility; use fog lamps on hill curves.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    20, 35, 28.0, 70,
    'Scenic Valley Highway', 'Good Paved', 9.5, 'Moderate',
    'via Peshok Road & Tinchuley Ridge connector',
    'Spectacular views of Teesta valley; single-lane village road at entrance.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    35, 20, 28.0, 70,
    'Scenic Valley Highway', 'Good Paved', 9.5, 'Moderate',
    'via Peshok Road & Tinchuley Ridge connector',
    'Spectacular views of Teesta valley; single-lane village road at entrance.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    20, 36, 26.0, 85,
    'Forest Dirt Track', 'Unpaved 4x4 Track', 9.5, '4x4 Required',
    'via Jorebungalow / Dilaram & Senchal Sanctuary Gate',
    'Forest Dept permit required; rough dirt track impassable for standard sedans. 4WD vehicle strictly required.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    36, 20, 26.0, 85,
    'Forest Dirt Track', 'Unpaved 4x4 Track', 9.5, '4x4 Required',
    'via Jorebungalow / Dilaram & Senchal Sanctuary Gate',
    'Forest Dept permit required; rough dirt track impassable for standard sedans. 4WD vehicle strictly required.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    20, 37, 5.5, 22,
    'Private Estate Hill Road', 'Paved tea road', 9.0, 'Moderate',
    'via Singtam Valley road descent',
    'Private estate approach; 360-degree tea terrace vistas overlooking snow peaks.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    37, 20, 5.5, 22,
    'Private Estate Hill Road', 'Paved tea road', 9.0, 'Moderate',
    'via Singtam Valley road descent',
    'Private estate approach; 360-degree tea terrace vistas overlooking snow peaks.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    20, 38, 16.0, 50,
    'Forest Reserve Road', 'Narrow paved with gravel patches', 9.0, 'Moderate',
    'via 3rd Mile forest descent',
    'Serene valley haven; descent through Senchal buffer forest.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    38, 20, 16.0, 50,
    'Forest Reserve Road', 'Narrow paved with gravel patches', 9.0, 'Moderate',
    'via 3rd Mile forest descent',
    'Serene valley haven; descent through Senchal buffer forest.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    20, 39, 14.0, 45,
    'Pine Ridge Highway', 'Good Paved', 9.5, 'Moderate',
    'via Ghoom & Sukhiapokhri Road',
    'Famous for atmospheric pine forest mist and quiet Kanchenjunga viewing.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    39, 20, 14.0, 45,
    'Pine Ridge Highway', 'Good Paved', 9.5, 'Moderate',
    'via Ghoom & Sukhiapokhri Road',
    'Famous for atmospheric pine forest mist and quiet Kanchenjunga viewing.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    20, 40, 49.0, 120,
    'State Highway', 'Good Paved', 8.5, 'Moderate',
    'via Ghoom, Sukhiapokhri & Pashupati Nagar border road',
    'Full day excursion; passes Indo-Nepal border market at Pashupati Nagar.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    40, 20, 49.0, 120,
    'State Highway', 'Good Paved', 8.5, 'Moderate',
    'via Ghoom, Sukhiapokhri & Pashupati Nagar border road',
    'Full day excursion; passes Indo-Nepal border market at Pashupati Nagar.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    20, 41, 32.0, 75,
    'National Highway', 'Good Paved', 8.5, 'Moderate',
    'via Hill Cart Road (NH-110)',
    'Passes Sonada and tea garden ridges; Toy Train track parallels road.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    41, 20, 32.0, 75,
    'National Highway', 'Good Paved', 8.5, 'Moderate',
    'via Hill Cart Road (NH-110)',
    'Passes Sonada and tea garden ridges; Toy Train track parallels road.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    20, 42, 52.0, 135,
    'Mountain Highway', 'Good Paved with valley turns', 9.0, 'Challenging',
    'via Peshok Road, Teesta Bazar & Kalimpong Hill Highway',
    'Descends to Teesta river valley before climbing Kalimpong ridge; check Teesta bridge traffic.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    42, 20, 52.0, 135,
    'Mountain Highway', 'Good Paved with valley turns', 9.0, 'Challenging',
    'via Peshok Road, Teesta Bazar & Kalimpong Hill Highway',
    'Descends to Teesta river valley before climbing Kalimpong ridge; check Teesta bridge traffic.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    18, 19, 6.0, 20,
    'Paved Hill Road', 'Good Paved', 8.5, 'Easy',
    'via Senchal Sanctuary Road & Hill Cart Road',
    'Popular post-sunrise descent corridor; heavy traffic between 06:30 and 08:00 AM.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    19, 18, 6.0, 20,
    'Paved Hill Road', 'Good Paved', 8.5, 'Easy',
    'via Senchal Sanctuary Road & Hill Cart Road',
    'Popular post-sunrise descent corridor; heavy traffic between 06:30 and 08:00 AM.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    18, 31, 5.5, 18,
    'Paved Hill Road', 'Good Paved', 8.5, 'Easy',
    'via Senchal Sanctuary Road to Ghoom junction',
    'Smooth connection from dawn sunrise to historical morning monastery prayers.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    31, 18, 5.5, 18,
    'Paved Hill Road', 'Good Paved', 8.5, 'Easy',
    'via Senchal Sanctuary Road to Ghoom junction',
    'Smooth connection from dawn sunrise to historical morning monastery prayers.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    18, 36, 14.0, 50,
    'Forest Ridge Track', 'Unpaved Forest Dirt', 9.5, '4x4 Required',
    'via Senchal Wildlife Sanctuary internal ridge',
    'Direct forest track; strictly requires Forest Dept permit and high-clearance 4WD.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    36, 18, 14.0, 50,
    'Forest Ridge Track', 'Unpaved Forest Dirt', 9.5, '4x4 Required',
    'via Senchal Wildlife Sanctuary internal ridge',
    'Direct forest track; strictly requires Forest Dept permit and high-clearance 4WD.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    19, 31, 2.0, 8,
    'National Highway', 'Good Paved', 8.0, 'Easy',
    'via Hill Cart Road (NH-55)',
    'Short direct connection along heritage train track.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    31, 19, 2.0, 8,
    'National Highway', 'Good Paved', 8.0, 'Easy',
    'via Hill Cart Road (NH-55)',
    'Short direct connection along heritage train track.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    19, 28, 1.5, 6,
    'National Highway', 'Good Paved', 8.0, 'Easy',
    'via Hill Cart Road (NH-55)',
    'Very close proximity; walkable downhill sidewalk along Hill Cart Road.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    28, 19, 1.5, 6,
    'National Highway', 'Good Paved', 8.0, 'Easy',
    'via Hill Cart Road (NH-55)',
    'Very close proximity; walkable downhill sidewalk along Hill Cart Road.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    31, 39, 8.5, 25,
    'Pine Ridge Highway', 'Good Paved', 9.5, 'Moderate',
    'via Sukhiapokhri Road',
    'Quiet mountain road flanked by dense dhupi fir trees; thick winter mist in late afternoon.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    39, 31, 8.5, 25,
    'Pine Ridge Highway', 'Good Paved', 9.5, 'Moderate',
    'via Sukhiapokhri Road',
    'Quiet mountain road flanked by dense dhupi fir trees; thick winter mist in late afternoon.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    31, 41, 25.0, 55,
    'National Highway', 'Good Paved', 8.5, 'Moderate',
    'via Hill Cart Road (NH-110)',
    'Smooth downhill cruising past tea valleys towards Kurseong.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    41, 31, 25.0, 55,
    'National Highway', 'Good Paved', 8.5, 'Moderate',
    'via Hill Cart Road (NH-110)',
    'Smooth downhill cruising past tea valleys towards Kurseong.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    31, 40, 42.0, 105,
    'State Highway', 'Good Paved', 8.5, 'Moderate',
    'via Sukhiapokhri & Mirik road',
    'Winding alpine road through orange orchards and cedar forests.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    40, 31, 42.0, 105,
    'State Highway', 'Good Paved', 8.5, 'Moderate',
    'via Sukhiapokhri & Mirik road',
    'Winding alpine road through orange orchards and cedar forests.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    33, 34, 8.0, 24,
    'Narrow Hill Connector', 'Paved with forest turns', 9.0, 'Moderate',
    'via Peshok-Takdah connector road',
    'Connects pine canopy eco-park to colonial cantonment bungalows; very light traffic.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    34, 33, 8.0, 24,
    'Narrow Hill Connector', 'Paved with forest turns', 9.0, 'Moderate',
    'via Peshok-Takdah connector road',
    'Connects pine canopy eco-park to colonial cantonment bungalows; very light traffic.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    33, 35, 7.0, 22,
    'Scenic Rural Road', 'Paved with passing turnouts', 9.5, 'Moderate',
    'via Lopchu-Tinchuley connector',
    'Magnificent views of organic orange terraces and tea valleys.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    35, 33, 7.0, 22,
    'Scenic Rural Road', 'Paved with passing turnouts', 9.5, 'Moderate',
    'via Lopchu-Tinchuley connector',
    'Magnificent views of organic orange terraces and tea valleys.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    34, 35, 4.5, 15,
    'Rural Ridge Road', 'Good Paved', 9.0, 'Easy',
    'via Tinchuley Ridge road',
    'Seamless village hop between orchid nurseries and organic farm homestays.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    35, 34, 4.5, 15,
    'Rural Ridge Road', 'Good Paved', 9.0, 'Easy',
    'via Tinchuley Ridge road',
    'Seamless village hop between orchid nurseries and organic farm homestays.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    33, 42, 31.0, 80,
    'Mountain Highway', 'Good Paved with valley curves', 9.0, 'Moderate',
    'via Teesta Bridge & Kalimpong ascent',
    'Crosses Teesta river at 200m before climbing to Deolo Hill at 1,704m.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    42, 33, 31.0, 80,
    'Mountain Highway', 'Good Paved with valley curves', 9.0, 'Moderate',
    'via Teesta Bridge & Kalimpong ascent',
    'Crosses Teesta river at 200m before climbing to Deolo Hill at 1,704m.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    22, 23, 0.2, 3,
    'Pedestrian Park Path', 'Paved Walkway', 8.0, 'Easy',
    'Shared Jawahar Parbat Campus Walkway',
    'Both institutes share the same entrance gate and visitor pathways.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    23, 22, 0.2, 3,
    'Pedestrian Park Path', 'Paved Walkway', 8.0, 'Easy',
    'Shared Jawahar Parbat Campus Walkway',
    'Both institutes share the same entrance gate and visitor pathways.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    23, 25, 1.5, 8,
    'Paved Hill Road', 'Good Paved', 8.0, 'Easy',
    'via Lebong Cart Road to Singamari',
    'Quick connection from zoo exit to ropeway cable car boarding point.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    25, 23, 1.5, 8,
    'Paved Hill Road', 'Good Paved', 8.0, 'Easy',
    'via Lebong Cart Road to Singamari',
    'Quick connection from zoo exit to ropeway cable car boarding point.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    25, 32, 0.8, 5,
    'Paved Hill Road', 'Good Paved', 8.0, 'Easy',
    'via Lebong Cart Road',
    'Within easy 10-minute walking or 5-minute taxi distance along the ridge.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    32, 25, 0.8, 5,
    'Paved Hill Road', 'Good Paved', 8.0, 'Easy',
    'via Lebong Cart Road',
    'Within easy 10-minute walking or 5-minute taxi distance along the ridge.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    26, 37, 4.0, 16,
    'Estate Tea Road', 'Paved tea terrace road', 9.5, 'Moderate',
    'via Lebong Tea Valley route',
    'Ideal tea heritage combo connecting Darjeelings two most historic tea gardens.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    37, 26, 4.0, 16,
    'Estate Tea Road', 'Paved tea terrace road', 9.5, 'Moderate',
    'via Lebong Tea Valley route',
    'Ideal tea heritage combo connecting Darjeelings two most historic tea gardens.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    39, 40, 34.0, 85,
    'State Highway', 'Good Paved', 8.5, 'Moderate',
    'via Sukhiapokhri road',
    'Direct scenic route avoiding Darjeeling town traffic entirely.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    40, 39, 34.0, 85,
    'State Highway', 'Good Paved', 8.5, 'Moderate',
    'via Sukhiapokhri road',
    'Direct scenic route avoiding Darjeeling town traffic entirely.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    41, 40, 46.0, 110,
    'Hill Connector Highway', 'Paved with sharp turns', 8.5, 'Moderate',
    'via Pankhabari & Tingling Tea Viewpoint',
    'Passes world-famous Makaibari tea terraces and Tingling viewpoint overlooking Nepal border.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
),
(
    40, 41, 46.0, 110,
    'Hill Connector Highway', 'Paved with sharp turns', 8.5, 'Moderate',
    'via Pankhabari & Tingling Tea Viewpoint',
    'Passes world-famous Makaibari tea terraces and Tingling viewpoint overlooking Nepal border.',
    'OpenStreetMap (OSM) / WBTDC Hill Route Survey'
);
