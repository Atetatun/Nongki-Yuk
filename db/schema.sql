-- Skema Database PostgreSQL untuk Nongki-Yuk (Milestone 1)
-- Sesuai dengan PRD Bagian 6.6

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabel Events (Acara)
CREATE TABLE IF NOT EXISTS events (
    id VARCHAR(32) PRIMARY KEY, -- nanoid / unique id
    title VARCHAR(255) NOT NULL,
    timezone VARCHAR(50) NOT NULL DEFAULT 'Asia/Jakarta',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    day_start_min INT NOT NULL DEFAULT 540, -- misal 09:00 dalam menit (540)
    day_end_min INT NOT NULL DEFAULT 1320,  -- misal 22:00 dalam menit (1320)
    slot_minutes INT NOT NULL DEFAULT 30,
    min_duration_min INT NOT NULL DEFAULT 120,
    locked_start_utc TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL -- diindeks untuk cron retensi
);

CREATE INDEX IF NOT EXISTS idx_events_expires_at ON events(expires_at);

-- 2. Tabel Participants (Peserta)
CREATE TABLE IF NOT EXISTS participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id VARCHAR(32) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    edit_token_hash VARCHAR(255) NOT NULL, -- token edit di-hash
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_event_participant_name UNIQUE (event_id, name)
);

CREATE INDEX IF NOT EXISTS idx_participants_event_id ON participants(event_id);

-- 3. Tabel Availability (Ketersediaan Slot Waktu)
CREATE TABLE IF NOT EXISTS availability (
    participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
    slot_start_utc TIMESTAMPTZ NOT NULL,
    event_id VARCHAR(32) NOT NULL REFERENCES events(id) ON DELETE CASCADE, -- denormalisasi untuk agregasi cepat
    PRIMARY KEY (participant_id, slot_start_utc)
);

CREATE INDEX IF NOT EXISTS idx_availability_event_slot ON availability(event_id, slot_start_utc);
