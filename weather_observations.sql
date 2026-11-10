-- ============================================================
-- YatraSetu — weather_observations Live Snapshot Seed
-- Fetched live from Open-Meteo coordinate API
-- Total Destinations: 25
-- ============================================================

USE yatrasetu;

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
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE,
    INDEX idx_weather_obs_dest (destination_id),
    INDEX idx_weather_obs_observed (destination_id, observed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO weather_observations (
    destination_id, observed_at, temperature_c, precipitation_mm,
    precipitation_probability, humidity, wind_speed_kmh, weather_code, source
) VALUES
(24, '2026-09-07 17:03:01', 20.1, 0.1, 100, 99, 2.8, 51, 'open-meteo'),
(10, '2026-09-07 17:03:01', 16.3, 0.4, 100, 97, 0.6, 80, 'open-meteo'),
(12, '2026-09-07 17:03:01', 18.1, 0.4, 100, 97, 0.6, 80, 'open-meteo'),
(16, '2026-09-07 17:03:01', 21.2, 0.1, 100, 96, 0.4, 51, 'open-meteo'),
(22, '2026-09-07 17:03:01', 16.3, 0.9, 100, 99, 0.9, 95, 'open-meteo'),
(20, '2026-09-07 17:03:01', 18.4, 0.4, 100, 97, 0.6, 80, 'open-meteo'),
(17, '2026-09-07 17:03:01', 22.3, 0.1, 100, 96, 0.4, 51, 'open-meteo'),
(19, '2026-09-07 17:03:01', 16.5, 0.2, 100, 99, 2.9, 95, 'open-meteo'),
(18, '2026-09-07 17:03:01', 22.4, 0.1, 100, 96, 2.0, 51, 'open-meteo'),
(21, '2026-09-07 17:03:01', 16.7, 0.4, 100, 97, 0.6, 80, 'open-meteo'),
(7, '2026-09-07 17:03:01', 16.4, 0.4, 100, 97, 0.6, 80, 'open-meteo'),
(25, '2026-09-07 17:03:01', 22.8, 0.0, 93, 93, 3.5, 3, 'open-meteo'),
(23, '2026-09-07 17:03:01', 20.0, 0.1, 100, 99, 2.8, 51, 'open-meteo'),
(9, '2026-09-07 17:03:01', 16.7, 0.4, 100, 97, 0.6, 80, 'open-meteo'),
(14, '2026-09-07 17:03:01', 17.6, 0.9, 100, 99, 0.9, 95, 'open-meteo'),
(11, '2026-09-07 17:03:01', 16.3, 0.4, 100, 97, 0.6, 80, 'open-meteo'),
(13, '2026-09-07 17:03:01', 21.3, 0.1, 100, 96, 0.4, 51, 'open-meteo'),
(15, '2026-09-07 17:03:01', 20.3, 1.2, 100, 97, 1.3, 95, 'open-meteo'),
(4, '2026-09-07 17:03:01', 17.1, 0.4, 100, 97, 0.6, 80, 'open-meteo'),
(2, '2026-09-07 17:03:01', 17.0, 0.9, 100, 99, 0.9, 95, 'open-meteo'),
(6, '2026-09-07 17:03:01', 17.9, 0.4, 100, 97, 0.6, 80, 'open-meteo'),
(8, '2026-09-07 17:03:01', 19.6, 0.4, 100, 97, 0.6, 80, 'open-meteo'),
(5, '2026-09-07 17:03:01', 18.2, 0.4, 100, 97, 0.6, 80, 'open-meteo'),
(1, '2026-09-07 17:03:01', 17.0, 0.4, 100, 97, 0.6, 80, 'open-meteo'),
(3, '2026-09-07 17:03:01', 16.8, 0.4, 100, 97, 0.6, 80, 'open-meteo');
