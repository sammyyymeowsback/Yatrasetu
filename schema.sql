-- ============================================================
-- YatraSetu — MySQL Schema
-- Compatible with MySQL 8.x
--
-- IMPORTANT:
-- Seed data is PROTOTYPE / DEMO data for development and
-- demonstration only. It is NOT live tourism statistics,
-- official capacity data, or official risk information.
-- ============================================================


-- ============================================================
-- DATABASE
-- ============================================================

CREATE DATABASE IF NOT EXISTS yatrasetu
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE yatrasetu;


-- ============================================================
-- DESTINATIONS
-- ============================================================
--
-- Approved, publicly visible tourism destinations.
--
-- Sources can include:
--   1. Initial prototype/demo seed data.
--   2. Tourism-board-approved user submissions.
--
-- Crowd, weather, and risk fields are lightweight cached/current
-- values used by the prototype. Detailed weather/risk history is
-- stored separately in weather_cache and risk_assessments.
-- ============================================================

CREATE TABLE IF NOT EXISTS destinations (
    id                      INT AUTO_INCREMENT PRIMARY KEY,

    name                    VARCHAR(150) NOT NULL,
    slug                    VARCHAR(150) UNIQUE,

    district                VARCHAR(100),
    area                    VARCHAR(100),

    latitude                DECIMAL(10,7) NOT NULL,
    longitude               DECIMAL(10,7) NOT NULL,
    elevation_m             INT,

    category                VARCHAR(50) DEFAULT 'heritage',

    description             TEXT,

    popularity_score        DECIMAL(5,2) DEFAULT 50.00,
    tourism_pressure_score  DECIMAL(5,2) DEFAULT 50.00,

    estimated_daily_capacity INT DEFAULT NULL,

    best_time_start         TIME DEFAULT NULL,
    best_time_end           TIME DEFAULT NULL,

    best_months             VARCHAR(100) DEFAULT NULL,

    avg_visit_duration_minutes INT DEFAULT 90,

    accessibility_level     VARCHAR(30) DEFAULT 'Moderate',

    community_value_score   DECIMAL(5,2) DEFAULT 75.00,

    risk_baseline           VARCHAR(30) DEFAULT 'Low',

    verified                BOOLEAN DEFAULT TRUE,

    -- --------------------------------------------------------
    -- Application UI & Context Support Fields
    -- --------------------------------------------------------
    state                   VARCHAR(100) DEFAULT 'West Bengal',
    crowd_level             VARCHAR(20) NOT NULL DEFAULT 'moderate',
    predicted_crowd_level   VARCHAR(20) DEFAULT NULL,
    capacity                INT DEFAULT NULL,
    weather_status          VARCHAR(50) DEFAULT NULL,
    risk_level              VARCHAR(20) NOT NULL DEFAULT 'low',
    risk_notes              TEXT DEFAULT NULL,
    reason_to_visit         TEXT DEFAULT NULL,
    community_info          TEXT DEFAULT NULL,
    image_path              VARCHAR(255) DEFAULT NULL,
    is_approved             BOOLEAN NOT NULL DEFAULT TRUE,
    is_user_submitted       BOOLEAN NOT NULL DEFAULT FALSE,

    -- --------------------------------------------------------
    -- Timestamps
    -- --------------------------------------------------------
    created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                            ON UPDATE CURRENT_TIMESTAMP,

    -- --------------------------------------------------------
    -- Indexes
    -- --------------------------------------------------------
    INDEX idx_destinations_slug (slug),
    INDEX idx_destinations_category (category),
    INDEX idx_destinations_crowd_level (crowd_level),
    INDEX idx_destinations_predicted_crowd (predicted_crowd_level),
    INDEX idx_destinations_risk_level (risk_level),
    INDEX idx_destinations_is_approved (is_approved)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- CARD DESTINATIONS (Dedicated table for Royal Deck Discovery Cards)
-- ============================================================
CREATE TABLE IF NOT EXISTS card_destinations (
    id                      INT AUTO_INCREMENT PRIMARY KEY,
    name                    VARCHAR(150) NOT NULL,
    slug                    VARCHAR(160) NOT NULL,
    district                VARCHAR(100) NOT NULL,
    state                   VARCHAR(100) NOT NULL,
    area                    VARCHAR(100) DEFAULT NULL,
    latitude                DECIMAL(10, 7) NOT NULL,
    longitude               DECIMAL(10, 7) NOT NULL,
    elevation_m             INT DEFAULT NULL,
    category                VARCHAR(50) DEFAULT 'heritage',
    description             TEXT DEFAULT NULL,
    popularity_score        DECIMAL(5, 2) DEFAULT 50.00,
    tourism_pressure_score  DECIMAL(5, 2) DEFAULT 30.00,
    crowd_level             VARCHAR(20) DEFAULT 'low',
    predicted_crowd_level   VARCHAR(20) DEFAULT 'low',
    capacity                INT DEFAULT 1000,
    estimated_daily_capacity INT DEFAULT 1000,
    best_time_start         TIME DEFAULT NULL,
    best_time_end           TIME DEFAULT NULL,
    best_months             VARCHAR(100) DEFAULT NULL,
    avg_visit_duration_minutes INT DEFAULT 120,
    accessibility_level     VARCHAR(50) DEFAULT 'High',
    community_value_score   DECIMAL(5, 2) DEFAULT 80.00,
    risk_baseline           VARCHAR(30) DEFAULT 'Low',
    risk_level              VARCHAR(20) DEFAULT 'low',
    risk_notes              TEXT DEFAULT NULL,
    reason_to_visit         TEXT DEFAULT NULL,
    community_info          TEXT DEFAULT NULL,
    image_path              VARCHAR(500) DEFAULT NULL,
    verified                TINYINT(1) DEFAULT 1,
    is_approved             TINYINT(1) DEFAULT 1,
    is_user_submitted       TINYINT(1) DEFAULT 0,
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_card_category (category),
    INDEX idx_card_crowd (crowd_level),
    INDEX idx_card_state (state)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



-- ============================================================
-- SUBMISSIONS
-- ============================================================
--
-- User-submitted tourism spots.
--
-- Lifecycle:
--
--     pending
--        ↓
--     approved → copied into destinations
--
--     pending
--        ↓
--     rejected
--
-- No public visibility is granted while a submission is pending.
-- ============================================================

CREATE TABLE IF NOT EXISTS submissions (
    id                      INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    spot_name               VARCHAR(150) NOT NULL,

    description             TEXT,

    category                ENUM(
                                'heritage',
                                'nature',
                                'culture',
                                'rural',
                                'spiritual'
                            ) NOT NULL DEFAULT 'heritage',

    latitude                DECIMAL(9,6) NOT NULL,
    longitude               DECIMAL(9,6) NOT NULL,

    image_path              VARCHAR(255) DEFAULT NULL,

    reason_to_visit         TEXT,

    -- --------------------------------------------------------
    -- Moderation state
    -- --------------------------------------------------------

    status                  ENUM(
                                'pending',
                                'approved',
                                'rejected'
                            ) NOT NULL DEFAULT 'pending',

    -- Destination created after Tourism Board approval.
    -- NULL for pending/rejected submissions.
    approved_destination_id INT UNSIGNED DEFAULT NULL,

    submitted_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    reviewed_at             TIMESTAMP NULL DEFAULT NULL,

    -- --------------------------------------------------------
    -- Validation
    -- --------------------------------------------------------

    CONSTRAINT chk_submissions_latitude
        CHECK (latitude BETWEEN -90.000000 AND 90.000000),

    CONSTRAINT chk_submissions_longitude
        CHECK (longitude BETWEEN -180.000000 AND 180.000000),

    -- --------------------------------------------------------
    -- Relationship
    -- --------------------------------------------------------

    CONSTRAINT fk_submissions_destination
        FOREIGN KEY (approved_destination_id)
        REFERENCES destinations(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    -- --------------------------------------------------------
    -- Indexes
    -- --------------------------------------------------------

    INDEX idx_submissions_status (status),

    INDEX idx_submissions_destination (approved_destination_id),

    INDEX idx_submissions_submitted_at (submitted_at)

) ENGINE=InnoDB;


-- ============================================================
-- WEATHER CACHE
-- ============================================================
--
-- Stores weather snapshots obtained by the backend weather
-- service.
--
-- A row may represent:
--
--   is_demo_data = FALSE → provider response
--   is_demo_data = TRUE  → prototype/demo fallback
--
-- Historical snapshots are intentionally retained rather than
-- replacing one row every time.
-- ============================================================

CREATE TABLE IF NOT EXISTS weather_cache (
    id                          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    destination_id              INT UNSIGNED NOT NULL,

    temperature                 DECIMAL(5,2) DEFAULT NULL,

    conditions                  VARCHAR(100) DEFAULT NULL,

    precipitation_probability   TINYINT UNSIGNED DEFAULT NULL,

    warning                     TEXT DEFAULT NULL,

    is_demo_data                BOOLEAN NOT NULL DEFAULT FALSE
                                COMMENT 'TRUE when the value is demo/fallback data rather than a live provider response',

    fetched_at                  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- --------------------------------------------------------
    -- Validation
    -- --------------------------------------------------------

    CONSTRAINT chk_weather_precipitation
        CHECK (
            precipitation_probability IS NULL
            OR precipitation_probability BETWEEN 0 AND 100
        ),

    -- --------------------------------------------------------
    -- Relationship
    -- --------------------------------------------------------

    CONSTRAINT fk_weather_destination
        FOREIGN KEY (destination_id)
        REFERENCES destinations(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    -- --------------------------------------------------------
    -- Indexes
    -- --------------------------------------------------------

    INDEX idx_weather_destination_fetched
        (destination_id, fetched_at)

) ENGINE=InnoDB;


-- ============================================================
-- WEATHER OBSERVATIONS
-- ============================================================
--
-- Real-time & cached weather observations for destinations.
-- Populated live from coordinate-based Open-Meteo API.
-- ============================================================

CREATE TABLE IF NOT EXISTS weather_observations (
    id                          INT AUTO_INCREMENT PRIMARY KEY,

    destination_id              INT NOT NULL,

    observed_at                 DATETIME NOT NULL,

    temperature_c               DECIMAL(5,2),
    precipitation_mm            DECIMAL(6,2),
    precipitation_probability   INT,

    humidity                    INT,
    wind_speed_kmh              DECIMAL(6,2),

    weather_code                INT,

    source                      VARCHAR(100) DEFAULT 'open-meteo',

    FOREIGN KEY (destination_id)
        REFERENCES destinations(id)
        ON DELETE CASCADE,

    INDEX idx_weather_obs_dest (destination_id),
    INDEX idx_weather_obs_observed (destination_id, observed_at)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- RISK ASSESSMENTS
-- ============================================================
--
-- Stores risk-information snapshots.
--
-- source:
--
--   verified → explicitly verified/public risk information
--   demo     → prototype/demo/indicative information
--
-- IMPORTANT:
-- This table does NOT imply that YatraSetu performs scientifically
-- validated landslide prediction.
-- ============================================================

CREATE TABLE IF NOT EXISTS risk_assessments (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    destination_id  INT UNSIGNED NOT NULL,

    risk_level      ENUM(
                        'low',
                        'moderate',
                        'high'
                    ) NOT NULL,

    source          ENUM(
                        'verified',
                        'demo'
                    ) NOT NULL DEFAULT 'demo',

    notes           TEXT,

    assessed_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- --------------------------------------------------------
    -- Relationship
    -- --------------------------------------------------------

    CONSTRAINT fk_risk_destination
        FOREIGN KEY (destination_id)
        REFERENCES destinations(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    -- --------------------------------------------------------
    -- Index
    -- --------------------------------------------------------

    INDEX idx_risk_destination_assessed
        (destination_id, assessed_at)

) ENGINE=InnoDB;


-- ============================================================
-- RISK PROFILES
-- ============================================================
--
-- Official terrain, slope hazard, and safety profiles for destinations.
-- Grounded in the Darjeeling District Disaster Management Plan (DDMA).
-- ============================================================

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

    FOREIGN KEY (destination_id)
        REFERENCES destinations(id)
        ON DELETE CASCADE,

    INDEX idx_risk_dest (destination_id),
    INDEX idx_risk_baseline (baseline_risk)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- CROWD OBSERVATIONS
-- ============================================================
--
-- Time-series crowd footfall and capacity utilization observations.
--
-- Stores empirical hourly curves for prototype destinations.
-- source_type:
--   'prototype_simulation' -> transparent empirical simulation
--   'official_counter'     -> physical turnstile / ticket sensor
-- ============================================================

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


-- ============================================================
-- LOCAL EXPERIENCES
-- ============================================================
--
-- Authentic, community-run micro-experiences and workshops.
-- Links destinations to local cooperatives, guilds, and homestays.
-- ============================================================

CREATE TABLE IF NOT EXISTS local_experiences (
    id                          INT AUTO_INCREMENT PRIMARY KEY,
    destination_id              INT NOT NULL,

    title                       VARCHAR(150) NOT NULL,
    experience_type             VARCHAR(50) NOT NULL,

    description                 TEXT,
    duration_minutes            INT DEFAULT 90,

    price_inr                   INT DEFAULT 0,
    booking_type                VARCHAR(30) DEFAULT 'walk_in',

    local_partner               VARCHAR(150),
    community_revenue_pct       INT DEFAULT 100,

    best_time                   VARCHAR(50),

    FOREIGN KEY (destination_id)
        REFERENCES destinations(id)
        ON DELETE CASCADE,

    INDEX idx_exp_dest (destination_id),
    INDEX idx_exp_type (experience_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- TOURISM EVENTS
-- ============================================================
--
-- Official civic, cultural, religious festivals, and seasonal surges.
-- Provides Gemini with temporal crowd impact signals and traffic rules.
-- Grounded in official calendars: Darjeeling Police, GTA, NFR, WBTDC.
-- ============================================================

CREATE TABLE IF NOT EXISTS tourism_events (
    id                          INT AUTO_INCREMENT PRIMARY KEY,
    destination_id              INT DEFAULT NULL,

    name                        VARCHAR(150) NOT NULL,
    event_type                  VARCHAR(50) NOT NULL,

    start_date                  DATE NOT NULL,
    end_date                    DATE NOT NULL,

    location_name               VARCHAR(150) NOT NULL,
    impact_level                VARCHAR(20) DEFAULT 'HIGH',
    crowd_surge_multiplier      DECIMAL(3,2) DEFAULT 1.50,

    traffic_restrictions        TEXT,
    description                 TEXT,
    official_source             VARCHAR(150),

    FOREIGN KEY (destination_id)
        REFERENCES destinations(id)
        ON DELETE SET NULL,

    INDEX idx_event_dates (start_date, end_date),
    INDEX idx_event_dest (destination_id),
    INDEX idx_event_impact (impact_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- ROUTE OPTIONS
-- ============================================================
--
-- Inter-destination mountain road connectivity, distances, and transit times.
-- Prevents unrealistic straight-line travel estimates across Himalayan terrain.
-- Grounded in OpenStreetMap (OSM) road networks & WBTDC hill driving surveys.
-- ============================================================

CREATE TABLE IF NOT EXISTS route_options (
    id                          INT AUTO_INCREMENT PRIMARY KEY,
    origin_id                   INT NOT NULL,
    destination_id              INT NOT NULL,

    distance_km                 DECIMAL(5,2) NOT NULL,
    duration_minutes            INT NOT NULL,

    road_type                   VARCHAR(50) DEFAULT 'Paved Hill Road',
    road_condition              VARCHAR(50) DEFAULT 'Good Paved',
    scenic_rating               DECIMAL(3,1) DEFAULT 8.5,
    terrain_difficulty          VARCHAR(20) DEFAULT 'Moderate',

    via_landmark                VARCHAR(150),
    advisory_notes              TEXT,
    source                      VARCHAR(100) DEFAULT 'OpenStreetMap (OSM) / WBTDC Hill Route Survey',

    FOREIGN KEY (origin_id)
        REFERENCES destinations(id)
        ON DELETE CASCADE,

    FOREIGN KEY (destination_id)
        REFERENCES destinations(id)
        ON DELETE CASCADE,

    INDEX idx_route_endpoints (origin_id, destination_id),
    INDEX idx_route_origin (origin_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- ADMINS
-- ============================================================
--
-- Lightweight Tourism Board prototype authentication.
--
-- Passwords MUST be stored as Werkzeug password hashes.
-- Plaintext passwords must never be stored here.
--
-- Admin creation / synchronization is handled by the application
-- layer, not by this SQL seed script.
-- ============================================================

CREATE TABLE IF NOT EXISTS admins (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    username        VARCHAR(50) NOT NULL UNIQUE,

    password_hash   VARCHAR(255) NOT NULL,

    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

) ENGINE=InnoDB;


-- ============================================================
-- TOURIST USERS & SAVED ITINERARIES
-- ============================================================

CREATE TABLE IF NOT EXISTS tourist_users (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(150) NOT NULL,
    email           VARCHAR(191) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_tourist_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ai_itineraries (
    id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id             INT UNSIGNED NOT NULL,
    trip_title          VARCHAR(255) NOT NULL,
    origin_destination  VARCHAR(150) NOT NULL,
    start_date          VARCHAR(50) DEFAULT NULL,
    end_date            VARCHAR(50) DEFAULT NULL,
    duration_days       INT UNSIGNED NOT NULL DEFAULT 3,
    budget_range        VARCHAR(50) DEFAULT NULL,
    parsed_itinerary    LONGTEXT NOT NULL,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_ai_itineraries_user (user_id),
    CONSTRAINT fk_ai_itineraries_user FOREIGN KEY (user_id) REFERENCES tourist_users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- SEED DATA
-- ============================================================
--
-- ALL VALUES BELOW ARE PROTOTYPE / DEMO VALUES.
--
-- They are intended only to make the SIH prototype immediately
-- testable. They must NOT be presented in the UI as:
--
--   • live tourist counts
--   • official destination capacity
--   • official crowd statistics
--   • official disaster warnings
--   • scientifically validated risk probabilities
--
-- Destination IDs are explicitly supplied so dependent demo
-- records below remain deterministic on a fresh installation.
-- ============================================================


-- ------------------------------------------------------------
-- DEMO DESTINATIONS
-- ------------------------------------------------------------

INSERT INTO destinations

(

    id,

    name,

    description,

    state,

    district,

    latitude,

    longitude,

    category,

    crowd_level,

    predicted_crowd_level,

    capacity,

    popularity_score,

    weather_status,

    risk_level,

    risk_notes,

    reason_to_visit,

    community_info,

    image_path,

    is_approved,

    is_user_submitted

)

VALUES

(

    1,

    'Darjeeling',

    'The iconic hill station — Kanchenjunga views, the UNESCO toy train, and colonial tea estates. Currently under heavy tourist pressure.',

    'West Bengal',

    'Darjeeling',

    27.041000,

    88.266300,

    'heritage',

    'high',

    'high',

    10000,

    87,

    NULL,

    'low',

    NULL,

    'The iconic hill station — Kanchenjunga views, the UNESCO toy train, and colonial tea estates. Currently under heavy tourist pressure.',

    NULL,

    'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80',

    TRUE,

    FALSE

),



(

    2,

    'Manali',

    'Adventure capital of the Himalayas — high-altitude treks, Rohtang Pass and the Beas River. Peak season sees extreme overcrowding.',

    'Himachal Pradesh',

    'Kullu',

    32.239600,

    77.188700,

    'nature',

    'high',

    'high',

    12000,

    92,

    NULL,

    'low',

    NULL,

    'Adventure capital of the Himalayas — high-altitude treks, Rohtang Pass and the Beas River. Peak season sees extreme overcrowding.',

    NULL,

    'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop&q=80',

    TRUE,

    FALSE

),



(

    3,

    'Goa (North)',

    'India''s most popular beach destination. North Goa beaches reach critical overcrowding during peak season, stressing local ecosystems.',

    'Goa',

    'North Goa',

    15.500900,

    73.827800,

    'nature',

    'high',

    'high',

    25000,

    89,

    NULL,

    'low',

    NULL,

    'India''s most popular beach destination. North Goa beaches reach critical overcrowding during peak season, stressing local ecosystems.',

    NULL,

    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80',

    TRUE,

    FALSE

),



(

    4,

    'Kalimpong',

    'A former Silk Road trade town — monasteries, orchid nurseries famous across Asia, and panoramic Teesta valley views.',

    'West Bengal',

    'Kalimpong',

    27.060000,

    88.470000,

    'culture',

    'moderate',

    'moderate',

    5500,

    45,

    NULL,

    'low',

    NULL,

    'A former Silk Road trade town — monasteries, orchid nurseries famous across Asia, and panoramic Teesta valley views.',

    NULL,

    'https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=800&auto=format&fit=crop&q=80',

    TRUE,

    FALSE

),



(

    5,

    'Kurseong',

    'Land of white orchids — quieter tea gardens, mist-covered ridges, and a slower pace, just a short ride from Darjeeling town.',

    'West Bengal',

    'Darjeeling',

    26.879200,

    88.278800,

    'nature',

    'moderate',

    'moderate',

    6000,

    52,

    NULL,

    'low',

    NULL,

    'Land of white orchids — quieter tea gardens, mist-covered ridges, and a slower pace, just a short ride from Darjeeling town.',

    NULL,

    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',

    TRUE,

    FALSE

),



(

    6,

    'Khajjiar',

    'Mini Switzerland of India — a serene meadow ringed by dense deodar forests at 2,000m. Far less crowded than Manali.',

    'Himachal Pradesh',

    'Chamba',

    32.549700,

    76.025900,

    'nature',

    'low',

    'low',

    3000,

    38,

    NULL,

    'low',

    NULL,

    'Mini Switzerland of India — a serene meadow ringed by dense deodar forests at 2,000m. Far less crowded than Manali.',

    NULL,

    'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?w=800&auto=format&fit=crop&q=80',

    TRUE,

    FALSE

),



(

    7,

    'Gokarna',

    'A temple town with pristine hidden beaches — Om Beach, Half Moon Beach. Calmer, cleaner and spiritually rich alternative to Goa.',

    'Karnataka',

    'Uttara Kannada',

    14.547900,

    74.318800,

    'nature',

    'moderate',

    'moderate',

    4000,

    41,

    NULL,

    'low',

    NULL,

    'A temple town with pristine hidden beaches — Om Beach, Half Moon Beach. Calmer, cleaner and spiritually rich alternative to Goa.',

    NULL,

    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',

    TRUE,

    FALSE

),



(

    8,

    'Spiti Valley',

    'Cold desert mountain valley at 3,800m — ancient monasteries, stark lunar landscapes. Remote and extraordinarily beautiful.',

    'Himachal Pradesh',

    'Lahaul and Spiti',

    31.968900,

    78.052400,

    'nature',

    'low',

    'low',

    2000,

    29,

    NULL,

    'low',

    NULL,

    'Cold desert mountain valley at 3,800m — ancient monasteries, stark lunar landscapes. Remote and extraordinarily beautiful.',

    NULL,

    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80',

    TRUE,

    FALSE

),



(

    9,

    'Lamahatta',

    'Community-run eco-tourism hamlet built around a forest park and homestays. A model for distributed tourism YatraSetu surfaces.',

    'West Bengal',

    'Darjeeling',

    27.033300,

    88.366700,

    'nature',

    'low',

    'low',

    1200,

    20,

    NULL,

    'low',

    NULL,

    'Community-run eco-tourism hamlet built around a forest park and homestays. A model for distributed tourism YatraSetu surfaces.',

    NULL,

    'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',

    TRUE,

    FALSE

),



(

    10,

    'Mawlynnong',

    'Asia''s cleanest village — living root bridges, neat winding paths, and community pride in sustainable tourism. A remarkable model.',

    'Meghalaya',

    'East Khasi Hills',

    25.202000,

    91.898500,

    'culture',

    'low',

    'low',

    800,

    34,

    NULL,

    'low',

    NULL,

    'Asia''s cleanest village — living root bridges, neat winding paths, and community pride in sustainable tourism. A remarkable model.',

    NULL,

    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',

    TRUE,

    FALSE

),



(

    11,

    'Dzukou Valley',

    'Valley of flowers at 2,400m — seasonal blooms, pristine streams, zero crowd pressure. One of India''s best-kept trekking secrets.',

    'Nagaland',

    'Kohima',

    25.537200,

    94.088700,

    'nature',

    'low',

    'low',

    600,

    18,

    NULL,

    'low',

    NULL,

    'Valley of flowers at 2,400m — seasonal blooms, pristine streams, zero crowd pressure. One of India''s best-kept trekking secrets.',

    NULL,

    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',

    TRUE,

    FALSE

),



(

    12,

    'Ziro Valley',

    'UNESCO tentative heritage site — Apatani tribal culture, paddy fields, pine-clad hills. Hosts India''s most off-beat music festival.',

    'Arunachal Pradesh',

    'Lower Subansiri',

    27.547900,

    93.821900,

    'culture',

    'low',

    'low',

    1500,

    22,

    NULL,

    'low',

    NULL,

    'UNESCO tentative heritage site — Apatani tribal culture, paddy fields, pine-clad hills. Hosts India''s most off-beat music festival.',

    NULL,

    'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80',

    TRUE,

    FALSE

),



(

    13,

    'Pattadakal',

    'UNESCO World Heritage Site with Chalukyan temples from the 7th century. Massively undervisited despite being India''s architectural crown jewel.',

    'Karnataka',

    'Bagalkot',

    15.948000,

    75.818300,

    'heritage',

    'low',

    'low',

    5000,

    25,

    NULL,

    'low',

    NULL,

    'UNESCO World Heritage Site with Chalukyan temples from the 7th century. Massively undervisited despite being India''s architectural crown jewel.',

    NULL,

    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',

    TRUE,

    FALSE

),



(

    14,

    'Gandikota',

    'India''s Grand Canyon — the Pennar river gorge cutting through red sandstone. Ancient fort, stunning gorge views, almost no tourists.',

    'Andhra Pradesh',

    'Kadapa',

    14.804100,

    78.283800,

    'heritage',

    'low',

    'low',

    3000,

    19,

    NULL,

    'low',

    NULL,

    'India''s Grand Canyon — the Pennar river gorge cutting through red sandstone. Ancient fort, stunning gorge views, almost no tourists.',

    NULL,

    'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?w=800&auto=format&fit=crop&q=80',

    TRUE,

    FALSE

),



(

    15,

    'Champaner',

    'UNESCO site — medieval Islamic architecture and Rajput fortifications in one valley. One of India''s most underrated historical sites.',

    'Gujarat',

    'Panchmahal',

    22.487500,

    73.537800,

    'heritage',

    'low',

    'low',

    4000,

    28,

    NULL,

    'low',

    NULL,

    'UNESCO site — medieval Islamic architecture and Rajput fortifications in one valley. One of India''s most underrated historical sites.',

    NULL,

    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&auto=format&fit=crop&q=80',

    TRUE,

    FALSE

),



(

    16,

    'Majuli',

    'World''s largest river island — Vaishnavite monasteries (satras), mask-making traditions, disappearing wetland ecosystem. Urgent conservation site.',

    'Assam',

    'Majuli',

    26.954000,

    94.161000,

    'culture',

    'low',

    'low',

    2500,

    31,

    NULL,

    'low',

    NULL,

    'World''s largest river island — Vaishnavite monasteries (satras), mask-making traditions, disappearing wetland ecosystem. Urgent conservation site.',

    NULL,

    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80',

    TRUE,

    FALSE

),



(

    17,

    'Tawang',

    'India''s highest monastery town at 3,048m — the 17th century Tawang Monastery, Sela Pass, and stunning Himalayan panoramas.',

    'Arunachal Pradesh',

    'Tawang',

    27.586000,

    91.859500,

    'culture',

    'moderate',

    'moderate',

    3000,

    42,

    NULL,

    'low',

    NULL,

    'India''s highest monastery town at 3,048m — the 17th century Tawang Monastery, Sela Pass, and stunning Himalayan panoramas.',

    NULL,

    'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',

    TRUE,

    FALSE

),



(

    18,

    'Hampi',

    'UNESCO World Heritage Site — ruins of the Vijayanagara Empire scattered across a surreal boulder landscape. Awe-inspiring scale.',

    'Karnataka',

    'Vijayanagara',

    15.335000,

    76.460000,

    'heritage',

    'moderate',

    'moderate',

    8000,

    55,

    NULL,

    'low',

    NULL,

    'UNESCO World Heritage Site — ruins of the Vijayanagara Empire scattered across a surreal boulder landscape. Awe-inspiring scale.',

    NULL,

    'https://images.unsplash.com/photo-1603288967394-0cf11c521eb8?w=800&auto=format&fit=crop&q=80',

    TRUE,

    FALSE

),



(

    19,

    'Poovar',

    'Where the Neyyar River meets the Arabian Sea amid golden beaches. Backwaters, mangroves, and complete seclusion from mainstream tourism.',

    'Kerala',

    'Thiruvananthapuram',

    8.313800,

    77.090000,

    'nature',

    'low',

    'low',

    1500,

    24,

    NULL,

    'low',

    NULL,

    'Where the Neyyar River meets the Arabian Sea amid golden beaches. Backwaters, mangroves, and complete seclusion from mainstream tourism.',

    NULL,

    'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800&auto=format&fit=crop&q=80',

    TRUE,

    FALSE

),



(

    20,

    'Chikmagalur',

    'Coffee country in the Western Ghats — misty peaks, coffee estates you can stay in, and the sacred Baba Budan Giri hills.',

    'Karnataka',

    'Chikkamagaluru',

    13.316100,

    75.772000,

    'nature',

    'moderate',

    'moderate',

    5000,

    46,

    NULL,

    'low',

    NULL,

    'Coffee country in the Western Ghats — misty peaks, coffee estates you can stay in, and the sacred Baba Budan Giri hills.',

    NULL,

    'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800&auto=format&fit=crop&q=80',

    TRUE,

    FALSE

),



(

    21,

    'Dholavira',

    'UNESCO World Heritage Site — a 5,000-year-old Harappan city in the Rann of Kutch. One of India''s most significant and least-visited archaeological sites.',

    'Gujarat',

    'Kutch',

    23.887600,

    70.216500,

    'heritage',

    'low',

    'low',

    2000,

    15,

    NULL,

    'low',

    NULL,

    'UNESCO World Heritage Site — a 5,000-year-old Harappan city in the Rann of Kutch. One of India''s most significant and least-visited archaeological sites.',

    NULL,

    'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop&q=80',

    TRUE,

    FALSE

),



(

    22,

    'Mirik',

    'Built around Sumendu Lake, ringed by orange orchards and cardamom plantations. Calm, scenic, and largely overlooked by mainstream itineraries.',

    'West Bengal',

    'Darjeeling',

    26.887500,

    88.183700,

    'nature',

    'low',

    'low',

    4000,

    31,

    NULL,

    'low',

    NULL,

    'Built around Sumendu Lake, ringed by orange orchards and cardamom plantations. Calm, scenic, and largely overlooked by mainstream itineraries.',

    NULL,

    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80',

    TRUE,

    FALSE

);


-- ============================================================
-- DEMO WEATHER CACHE
-- ============================================================
--
-- These are explicitly marked as demo values.
-- IDs refer to the deterministic demo destination IDs above.
-- ============================================================

INSERT INTO weather_cache
(
    destination_id,
    temperature,
    conditions,
    precipitation_probability,
    warning,
    is_demo_data
)
VALUES
(
    1,
    28.50,
    'Clear',
    5,
    NULL,
    TRUE
),
(
    6,
    4.00,
    'Cold, clear',
    10,
    NULL,
    TRUE
),
(
    12,
    31.00,
    'Humid, cloudy',
    65,
    'Monsoon rainfall possible in delta region.',
    TRUE
);


-- ============================================================
-- DEMO RISK ASSESSMENTS
-- ============================================================
--
-- These records are deliberately source='demo'.
-- They are NOT validated landslide/disaster predictions.
-- ============================================================

INSERT INTO risk_assessments
(
    destination_id,
    risk_level,
    source,
    notes
)
VALUES
(
    6,
    'moderate',
    'demo',
    'Illustrative landslide-risk indicator for mountain access roads; not a validated prediction model.'
),
(
    7,
    'moderate',
    'demo',
    'Illustrative landslide-risk indicator for approach roads; not a validated prediction model.'
),
(
    12,
    'high',
    'demo',
    'Illustrative cyclone/flood-risk indicator for delta region; not a validated prediction model.'
);

