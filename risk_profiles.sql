-- ============================================================
-- YatraSetu — risk_profiles Seed Dataset
-- Grounded in the Darjeeling District Disaster Management Plan
-- Total Destinations: 25
-- ============================================================

USE yatrasetu;

CREATE TABLE IF NOT EXISTS risk_profiles (
    id                          INT AUTO_INCREMENT PRIMARY KEY,
    destination_id              INT NOT NULL,
    baseline_risk               VARCHAR(20) DEFAULT 'Low',
    landslide_sensitivity       VARCHAR(20) DEFAULT 'Low',
    heavy_rain_sensitivity      VARCHAR(20) DEFAULT 'Low',
    road_access_type            VARCHAR(50) DEFAULT 'Paved Road',
    fog_vulnerability           VARCHAR(20) DEFAULT 'Low',
    safety_advisory             TEXT,
    emergency_contact           VARCHAR(100) DEFAULT 'Darjeeling Police Control: 0354-2254422',
    source                      VARCHAR(100) DEFAULT 'Darjeeling DDMA / WBTDC',
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE,
    INDEX idx_risk_dest (destination_id),
    INDEX idx_risk_baseline (baseline_risk)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO risk_profiles (
    destination_id, baseline_risk, landslide_sensitivity,
    heavy_rain_sensitivity, road_access_type, fog_vulnerability,
    safety_advisory, emergency_contact, source
) VALUES
(1, 'Moderate', 'Moderate', 'Moderate', 'Narrow Mountain Ascent', 'High', 'Extreme pre-dawn vehicle queues, sub-zero dawn chill, and dense winter morning mist. Carry heavy woollens and depart by 3:45 AM.', 'Jorebungalow Police Outpost: 0354-2252100', 'Darjeeling DDMA / WBTDC'),
(2, 'Low', 'Low', 'Low', 'Paved Highway (NH 55)', 'Moderate', 'Paved railway loop with broad viewing gardens. Exercise trackside safety caution when steam train joyrides pass.', 'Ghoom Police Station: 0354-2252100', 'Darjeeling DDMA / UNESCO DHR'),
(3, 'Low', 'Low', 'Low', 'Pedestrian Promenade (No Vehicles)', 'Low', 'Pedestrianised town square with stone paving. Zero vehicular traffic risk. Stone surface slippery when wet during heavy rain.', 'Sadar Police Station Darjeeling: 0354-2254422', 'Darjeeling DDMA / WBTDC'),
(4, 'Moderate', 'Moderate', 'High', 'Hill Cart Road Track Corridor', 'Moderate', 'Narrow gauge mountain track runs alongside Hill Cart Road; services may be suspended during heavy continuous monsoon rains due to track mudslides.', 'DHR Station Master / Railway Helpline: 139', 'Indian Railways / Darjeeling DDMA'),
(5, 'Low', 'Low', 'Low', 'Paved Complex Walking Path', 'Low', 'Well-paved campus paths inside Birch Hill park. NOTE: Complex is closed on Thursdays for weekly maintenance.', 'HMI Campus Security: 0354-2254087', 'HMI / WBTDC'),
(6, 'Low', 'Low', 'Moderate', 'Paved Incline Walking Paths', 'Low', 'Steep internal walking paths may be slippery during rain; wear non-slip footwear. NOTE: Closed on Thursdays for animal rest.', 'Darjeeling Zoo Office: 0354-2253709', 'Central Zoo Authority / Darjeeling DDMA'),
(7, 'Low', 'Low', 'Low', 'Paved Jalapahar Approach Road', 'Moderate', 'Paved ridge road with gentle steps to the pagoda dome. Peaceful ground; drive with headlights during evening Jalapahar fog.', 'Darjeeling Tourist Police: 0354-2254422', 'Darjeeling DDMA / WBTDC'),
(8, 'Moderate', 'Low', 'High', 'Paved Lebong Cart Road', 'High', 'Aerial cable operations strictly halted when valley wind speeds exceed 32 km/h or during dense mist obscuring tower visibility.', 'Ropeway Terminal Control: 0354-2270008', 'WBFDC Ropeway Safety Protocols'),
(9, 'Low', 'Low', 'Moderate', 'Paved Estate Access / Terrace Trails', 'Moderate', 'Walking along stepped tea terraces requires comfortable sports shoes; terrace grass is slippery during monsoons.', 'Happy Valley Estate Office: 0354-2252405', 'Tea Board of India / WBTDC'),
(10, 'Low', 'Low', 'Low', 'Town Centre Paved Street (Gandhi Rd)', 'Low', 'Indoor cultural museum with zero weather or terrain hazards. Ideal safe sanctuary during heavy mountain rain.', 'Sadar Police Station: 0354-2254422', 'Manjushree Centre of Tibetan Culture'),
(11, 'Low', 'Low', 'Low', 'Direct Roadside on Hill Cart Road', 'Low', 'Direct roadside entry with dedicated parking. Safe in all weather conditions.', 'Dali Monastery Office: 0354-2254215', 'Darjeeling District Administration'),
(12, 'Low', 'Low', 'Moderate', 'Paved Downhill Slope Road', 'Moderate', 'Gentle downhill walking descent from Chowrasta; concrete gradient can be slick after rains.', 'Tourist Information Centre: 0354-2254214', 'Darjeeling Cultural Archives / DDMA'),
(13, 'Moderate', 'High', 'High', 'Steep Hairpin Valley Descent', 'Low', 'Road descends 10 km down steep valley hairpins. Hazardous during torrential downpours (>15 mm/hr) due to loose scree and waterfall runoff.', 'Darjeeling Disaster Control Room: 0354-2255749', 'Darjeeling DDMA Barbotey Valley Assessment'),
(14, 'Low', 'Low', 'Low', 'Paved Ridge Approach', 'Moderate', 'Situated on high stable ridge in Ghoom. Safe access; frequent afternoon mountain fog.', 'Ghoom Outpost: 0354-2252100', 'Darjeeling District Administration'),
(15, 'Moderate', 'Low', 'High', 'Roadside Paved Lebong Cart Rd', 'Low', 'Natural rock climbing surface becomes unscalable and dangerous when wet. Climbing suspended during rain; certified guide harness mandatory.', 'HMI Rescue Cell: 0354-2254087', 'HMI Adventure Safety Standards'),
(16, 'Low', 'Low', 'Low', 'Paved State Highway (Peshok Road)', 'Moderate', 'Dense pine canopy and gravel timber steps. Very stable ground even in wet weather; fog adds mystical ambiance.', 'Rangli Rangliot PS: 0354-2264225', 'West Bengal Forest Dept / WBTDC'),
(17, 'Moderate', 'Moderate', 'Moderate', 'Narrow Winding Tea Valley Road', 'High', 'Renowned as the valley of mist. Dense afternoon fog reduces road visibility under 10 meters; drive with fog lamps and slow speed.', 'Takdah Police Outpost: 0354-2264225', 'Darjeeling DDMA / WBTDC Heritage Wing'),
(18, 'Moderate', 'Low', 'Moderate', 'Single-Lane Ridge Road with Passing Bays', 'Moderate', 'Narrow single-lane mountain ridge road requires horn honking on blind curves. Village trails well-maintained by local committee.', 'Teesta Valley Police Assistance: 0354-2264225', 'WWF Eco-Tourism / Darjeeling DDMA'),
(19, 'Moderate', 'Moderate', 'High', 'Unpaved Forest Track (4x4 Only)', 'High', 'Located inside Senchal Wildlife Sanctuary. Track accessible strictly by 4x4 high-clearance vehicles. Forest Dept permits required; trail closed mid-June to mid-Sept.', 'Forest Range Office Sonada: 0354-2272202', 'WBFDC Senchal Wildlife Division'),
(20, 'Low', 'Low', 'Low', 'Paved Private Estate Road', 'Low', 'Private estate road with concrete paving. Safe year-round access.', 'Darjeeling Tourist Assistance: 0354-2254422', 'Darjeeling Tea Association Archives'),
(21, 'Moderate', 'Moderate', 'Moderate', 'Valley Descent Hill Road', 'Moderate', 'Descent from 3rd Mile toward Rungdung river; watch for loose pebbles on roadside shoulders during rainy periods.', 'Jorebungalow Outpost: 0354-2252100', 'Darjeeling DDMA / Senchal Range'),
(22, 'Low', 'Low', 'Low', 'Paved Highway (Ghoom-Mirik Road)', 'High', 'Pristine oak/pine forest along Highway. Frequent winter and evening fog; drive cautiously around Sukiapokhri turn.', 'Sukiapokhri Police Station: 0354-2262225', 'WBFDC Eco-Tourism Network / DDMA'),
(23, 'Low', 'Low', 'Low', 'Paved Scenic Highway (State Highway 12)', 'Low', 'Flat perimeter path around lake; life jackets required on paddle boats. Broad, well-maintained arterial highway.', 'Mirik Police Station: 0354-2243225', 'Darjeeling District Administration / WBTDC'),
(24, 'Low', 'Low', 'Low', 'National Highway 110 (Dual-Lane Paved)', 'Low', 'Direct access on National Highway 110. Safest hill access route in the district with all-weather accessibility.', 'Kurseong Police Station: 0354-2344222', 'National Highway Authority / DDMA'),
(25, 'Low', 'Low', 'Low', 'Paved Scenic Ridge Road', 'Low', 'Wide manicured ridge top. Paragliding operations require DGCA certified pilots and clear thermal wind conditions.', 'Kalimpong Police Control: 03552-255225', 'Kalimpong District Administration / WBTDC'),
(26, 'Low', 'Low', 'Low', 'Paved Highway & Urban Arteries (NH 55)', 'Moderate', 'Standard mountain hill station precautions. Keep warm layers for chilly evenings and monitor morning road traffic on Hill Cart Road.', 'Darjeeling Tourist Police: 0354-2252100 | Sadar Hospital: 0354-2252211', 'Darjeeling DDMA / WBTDC');
