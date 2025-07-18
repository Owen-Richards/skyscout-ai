-- Initialize database for SkyScout AI
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_flights_departure_date ON flights(departure_date);
CREATE INDEX IF NOT EXISTS idx_flights_origin_destination ON flights(origin, destination);
CREATE INDEX IF NOT EXISTS idx_flights_price ON flights(price);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_user_id ON price_alerts(user_id);

-- Create hypertables for time-series data
SELECT create_hypertable('flight_prices', 'created_at', if_not_exists => TRUE);
SELECT create_hypertable('search_analytics', 'timestamp', if_not_exists => TRUE);
SELECT create_hypertable('user_interactions', 'timestamp', if_not_exists => TRUE);

-- Insert sample data for development
INSERT INTO users (id, email, name, created_at) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'demo@skyscout.ai', 'Demo User', NOW())
ON CONFLICT (id) DO NOTHING;
